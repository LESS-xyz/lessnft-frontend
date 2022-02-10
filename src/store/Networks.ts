import { ICurrency } from 'typings';
import { types } from 'mobx-state-tree';

const Currency = types.model({
  rate: types.string,
  symbol: types.string,
  name: types.string,
  image: types.string,
});

const Network = types.model({
  ipfs_icon: types.optional(types.string, ''),
  name: types.string,
  native_symbol: types.string,
  currencies: types.array(Currency),
});

export const Networks = types
  .model({
    networks: types.optional(types.array(Network), []),
  })
  .views((self) => ({
    get getNetworks() {
      return self.networks;
    },

    get getCurrencies() {
      const currencies = self.networks.reduce(
        (res, current) => res.concat(current.currencies),
        [] as Array<ICurrency>,
      );
      return currencies;
    },
  }))
  .actions((self) => {
    const setNetworks = (networks: any) => {
      self.networks = networks;
    };

    return {
      setNetworks,
    };
  });
