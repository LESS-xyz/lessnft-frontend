import { types, getSnapshot, applySnapshot, getParent } from 'mobx-state-tree';

const NftCollection = types.model({
  address: types.string,
  avatar: types.string,
  id: types.union(types.string, types.number),
  name: types.string,
});

const Seller = types.model({
  avatar: types.string,
  id: types.union(types.string, types.number),
  name: types.string,
  price: types.number,
  quantity: types.number,
});

const Detail = types.model({
  display_type: types.string,
  trait_type: types.string,
  value: types.union(types.string, types.number),
  max_value: types.union(types.string, types.number),
});

const NftForSale = types.model({
  tokenId: types.optional(types.number, 0),
  standart: types.optional(types.string, ''),
  sellerId: types.optional(types.union(types.number, types.string), 0),
  tokenName: types.optional(types.string, ''),
  fee: types.optional(types.number, 0),
  feeCurrency: types.optional(types.number, 0),
  price: types.maybeNull(types.optional(types.number, 0)),
  usdPrice: types.maybeNull(types.optional(types.number, 0)),
  minimalBid: types.maybeNull(types.optional(types.number, 0)),
  currency: types.optional(types.string, ''),
  tokenAvailable: types.optional(types.number, 0),
  aucTokenAvailable: types.optional(types.number, 0),
  media: types.optional(types.string, ''),
  royalty: types.optional(types.number, 0),
  collection: types.optional(NftCollection, {
    address: '',
    avatar: '',
    id: 0,
    name: '',
  }),
  sellers: types.optional(types.array(Seller), []),
});

const PlaceBid = types
  .model({
    isSuccess: types.optional(types.boolean, false),
    isOpen: types.optional(types.boolean, false),
  })
  .views((self) => ({
    get getIsOpen() {
      const parent: any = getParent(self);
      if (
        parent.nft.tokenId &&
        parent.nft.standart &&
        parent.nft.tokenName &&
        parent.nft.fee &&
        parent.nft.currency &&
        parent.nft.aucTokenAvailable &&
        parent.nft.media &&
        parent.nft.minimalBid &&
        self.isOpen
      ) {
        return true;
      }
      return false;
    },
  }))
  .actions((self) => ({
    close: () => {
      self.isOpen = false;
    },
    open: () => {
      self.isSuccess = false;
      self.isOpen = true;
    },
    success: () => {
      self.isSuccess = true;
    },
  }));

const ChooseSeller = types
  .model({
    sellers: types.optional(types.array(Seller), []),
  })
  .views((self) => ({
    get getIsOpen() {
      const parent: any = getParent(self);
      if (
        parent.nft.tokenId &&
        parent.nft.standart &&
        parent.nft.tokenName &&
        parent.nft.fee &&
        parent.nft.price &&
        parent.nft.currency &&
        parent.nft.tokenAvailable &&
        parent.nft.media &&
        self.sellers.length
      ) {
        return true;
      }
      return false;
    },
  }))
  .actions((self) => {
    let initialState = {};
    return {
      afterCreate: () => {
        initialState = getSnapshot(self);
      },
      close: () => {
        applySnapshot(self, initialState);
      },
      open: (sellers: any) => {
        self.sellers = sellers;
      },
    };
  });

const Checkout = types
  .model({
    isSuccess: types.optional(types.boolean, false),
    isOpen: types.optional(types.boolean, false),
  })
  .views((self) => ({
    get getIsOpen() {
      const parent: any = getParent(self);
      if (
        parent.nft.tokenId &&
        parent.nft.standart &&
        parent.nft.sellerId &&
        parent.nft.tokenName &&
        parent.nft.fee &&
        parent.nft.price &&
        parent.nft.currency &&
        parent.nft.tokenAvailable &&
        parent.nft.media &&
        self.isOpen
      ) {
        return true;
      }
      return false;
    },
  }))
  .actions((self) => ({
    close: () => {
      self.isOpen = false;
    },
    open: (sellerId: string | number) => {
      const parent: any = getParent(self);
      parent.setSellerId(sellerId);
      self.isSuccess = false;
      self.isOpen = true;
    },
    success: () => {
      self.isSuccess = true;
    },
  }));

const PutOnSale = types
  .model({
    isOpen: types.optional(types.boolean, false),
    isSuccess: types.optional(types.boolean, false),
  })
  .views((self) => ({
    get getIsOpen() {
      const parent: any = getParent(self);
      if (
        parent.nft.tokenId &&
        // parent.nft.currency &&
        // parent.nft.royalty &&
        // parent.nft.fee &&
        parent.nft.collection &&
        self.isOpen
      ) {
        return true;
      }
      return false;
    },
  }))
  .actions((self) => ({
    close: () => {
      self.isOpen = false;
    },
    open: () => {
      self.isSuccess = false;
      self.isOpen = true;
    },
    success: () => {
      self.isSuccess = true;
    },
  }));
const Swap = types
  .model({
    isOpen: types.optional(types.boolean, false),
    main: types.string,
    wrap: types.string,
    refresh: types.boolean,
  })
  .views((self) => ({
    get getIsOpen() {
      if (self.isOpen) {
        return true;
      }
      return false;
    },
  }))
  .actions((self) => ({
    close: () => {
      self.isOpen = false;
    },
    open: (main: string, wrap: string, refresh: boolean) => {
      self.isOpen = true;
      self.main = main;
      self.wrap = wrap;
      self.refresh = refresh;
    },
    setRefresh: (refresh: boolean) => {
      self.refresh = refresh;
    },
  }));

const SellModals = types
  .model({
    nft: types.optional(NftForSale, {}),
    checkout: Checkout,
    chooseSeller: ChooseSeller,
    placeBid: PlaceBid,
    putOnSale: PutOnSale,
  })
  .actions((self) => ({
    setNft: (data: any) => {
      self.nft = data;
    },
    setSellerId: (sellerId: string | number) => {
      self.nft.sellerId = sellerId;
    },
  }));

const Burn = types
  .model({
    tokenId: types.optional(types.number, 0),
    standart: types.optional(types.string, ''),
    isSuccess: types.optional(types.boolean, false),
    amount: types.optional(types.number, 0),
  })
  .views((self) => ({
    get getIsOpen() {
      return !!(self.tokenId && self.standart);
    },
  }))
  .actions((self) => {
    let initialState = {};
    return {
      afterCreate: () => {
        initialState = getSnapshot(self);
      },
      close: () => {
        applySnapshot(self, initialState);
      },
      open: (tokenId: number, standart: string, amount: number) => {
        self.isSuccess = false;
        self.tokenId = tokenId;
        self.standart = standart;
        self.amount = amount;
      },
      success: () => {
        self.isSuccess = true;
      },
    };
  });
const Remove = types
  .model({
    tokenId: types.optional(types.number, 0),
    isSuccess: types.optional(types.boolean, false),
  })
  .views((self) => ({
    get getIsOpen() {
      return !!self.tokenId;
    },
  }))
  .actions((self) => {
    let initialState = {};
    return {
      afterCreate: () => {
        initialState = getSnapshot(self);
      },
      close: () => {
        applySnapshot(self, initialState);
      },
      open: (tokenId: number) => {
        self.tokenId = tokenId;
      },
      success: () => {
        self.isSuccess = true;
      },
    };
  });

const Transfer = types
  .model({
    tokenId: types.optional(types.number, 0),
    standart: types.optional(types.string, ''),
    isSuccess: types.optional(types.boolean, false),
    available: types.optional(types.number, 0),
  })
  .views((self) => ({
    get getIsOpen() {
      return !!(self.tokenId && self.standart && self.available);
    },
  }))
  .actions((self) => {
    let initialState = {};
    return {
      afterCreate: () => {
        initialState = getSnapshot(self);
      },
      close: () => {
        applySnapshot(self, initialState);
      },
      open: (tokenId: number, standart: string, available: number) => {
        self.tokenId = tokenId;
        self.standart = standart;
        self.available = available;
      },
      success: () => {
        self.isSuccess = true;
      },
    };
  });
const Report = types
  .model({
    isOpen: types.optional(types.boolean, false),
  })
  .actions((self) => {
    return {
      close: () => {
        self.isOpen = false;
      },
      open: () => {
        self.isOpen = true;
      },
    };
  });
const Change = types
  .model({
    tokenId: types.optional(types.number, 0),
    isSuccess: types.optional(types.boolean, false),
  })
  .views((self) => ({
    get getIsOpen() {
      return !!self.tokenId;
    },
  }))
  .actions((self) => {
    let initialState = {};
    return {
      afterCreate: () => {
        initialState = getSnapshot(self);
      },
      close: () => {
        applySnapshot(self, initialState);
      },
      open: (tokenId: number) => {
        self.tokenId = tokenId;
      },
      success: () => {
        self.isSuccess = true;
      },
    };
  });
const Details = types
  .model({
    type: types.optional(types.string, ''),
    text: types.optional(types.string, ''),
    detailsItems: types.optional(types.array(Detail), [
      { display_type: '', trait_type: '', value: '', max_value: 5 },
    ]),
    isOpen: types.optional(types.boolean, false),
  })
  .views((self) => ({
    get getIsOpen() {
      return !!self.type;
    },
    get getItems() {
      return self.detailsItems;
    },
  }))
  .actions((self) => {
    return {
      close: () => {
        self.type = '';
      },
      open: (type: '' | 'Properties' | 'Rankings' | 'Stats', text: string) => {
        self.type = type;
        self.text = text;
      },
      save: (det: any) => {
        self.detailsItems = det;
      },
    };
  });

export const Modals = types.model({
  sell: SellModals,
  burn: Burn,
  remove: Remove,
  transfer: Transfer,
  report: Report,
  change: Change,
  swap: Swap,
  details: Details,
});
