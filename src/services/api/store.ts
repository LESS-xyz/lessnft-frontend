import axios from 'core/axios';
import { INotableDrop, TNullable } from 'typings';
import { IGetSearchResultParams } from '../../typings/api/search';

export default {
  burnToken: (id: string, amount?: string) =>
    axios.post(`store/${id}/burn/?network=${localStorage.lessnft_nft_chainName}`, { amount }),
  createToken: (data: any) =>
    axios.post(`store/create_token/?network=${localStorage.lessnft_nft_chainName}`, data),
  // createToken: (data: any, details: any) => {
  //   data.details = details;
  //   return axios.post('store/create_token/', data);
  // },
  createCollection: (data: any) =>
    axios.post(`store/create_collection/?network=${localStorage.lessnft_nft_chainName}`, data),
  saveToken: (data: any) =>
    axios.post(`store/save_token/?network=${localStorage.lessnft_nft_chainName}`, data),
  saveCollection: (data: any) =>
    axios.post(`store/save_collection/?network=${localStorage.lessnft_nft_chainName}`, data),
  transferToken: (id: string, address: string, amount?: string) => {
    const data = { address, amount };
    if (!amount) delete data.amount;
    return axios.post(`store/transfer/${id}/?network=${localStorage.lessnft_nft_chainName}`, data);
  },
  // saveCollection: (data: any, tx_hash: string) => axios.post(`store/save_collection/${tx_hash}`, data),
  getExplore: (page: number, filter: string, sort: string) =>
    axios.get(
      `store/hot/${page}/?network=${localStorage.lessnft_nft_chainName}&sort=${sort}${
        filter !== 'all' ? `&tag=${filter}` : ''
      }`,
    ),
  getTags: () =>
    axios.get(`store/tags/`, {
      params: {
        network: localStorage.lessnft_nft_chainName,
      },
    }),
  getFavorites: () => axios.get(`store/favorites/?network=${localStorage.lessnft_nft_chainName}`),
  getCollections: () =>
    // TODO: add period
    axios.get(`store/hot_collections/`, {
      params: {
        network: localStorage.lessnft_nft_chainName,
      },
    }),
  getHotBids: () => axios.get(`store/hot_bids/?network=${localStorage.lessnft_nft_chainName}`),
  getCollectionById: (id: number | string, page: number) =>
    axios.get(`store/collection/${id}/?network=${localStorage.lessnft_nft_chainName}`, {
      params: {
        page,
      },
    }),
  getToken: (id: number | string) =>
    axios.get(`store/${id}/?network=${localStorage.lessnft_nft_chainName}`),
  buyToken: (id: number | string, amount: number, sellerId?: string | number) => {
    const data: any = {
      id,
      tokenAmount: amount,
    };
    if (sellerId) data.sellerId = sellerId;
    return axios.post(`/store/buy/?network=${localStorage.lessnft_nft_chainName}`, data);
  },
  getLiked: (address: string, page: number) =>
    axios.get(`store/liked/${address}/?network=${localStorage.lessnft_nft_chainName}&page=${page}`),
  getCreated: (address: string, page: number) =>
    axios.get(`store/created/${address}/${page}/?network=${localStorage.lessnft_nft_chainName}`),
  getCollectibles: (address: string, page: string) =>
    axios.get(`store/owned/${address}/${page}/?network=${localStorage.lessnft_nft_chainName}`),
  getUserCollections: (address: string, page: number) =>
    axios.get(`store/collections/${address}/${page}/`),
  getSearchResults: ({
    type,
    order_by,
    owner,
    on_sale,
    text,
    tags,
    currency,
    is_verified,
    max_price,
    page,
    creator,
    has_bids = false,
    bids_by,
    on_auc_sale,
    on_timed_auc_sale,
    min_price,
    network,
    collections,
    properties,
    rankings,
    stats,
  }: IGetSearchResultParams) => {
    return axios.get(`/store/search/`, {
      params: {
        network: network || 'undefined',
        type,
        order_by,
        owner,
        on_sale,
        currency,
        is_verified,
        page,
        creator,
        tags,
        ...(has_bids && {has_bids}),
        bids_by,
        collections,
        min_price,
        max_price,
        text,
        on_auc_sale,
        on_timed_auc_sale,
        ...(properties !== '{}' && { properties }),
        ...(rankings !== '{}' && { rankings }),
        ...(stats !== '{}' && { stats }),
      },
    });
  },
  getFee: (currency: TNullable<string>) =>
    axios.get(
      `/store/fee/?network=${localStorage.lessnft_nft_chainName}${
        currency ? `&currency=${currency}` : ''
      }`,
    ),
  createBid: (id: string | number, amount: number, quantity: number, currency: string) =>
    axios.post(`/store/bids/make_bid/?network=${localStorage.lessnft_nft_chainName}`, {
      // auth_token: localStorage.dds_token,
      token_id: id,
      amount,
      quantity,
      currency,
    }),
  verificateBet: (id: number) =>
    axios.get(`/store/verificate_bet/${id}/?network=${localStorage.lessnft_nft_chainName}`),
  endAuction: (id: number) =>
    axios.post(`/store/end_auction/${id}/?network=${localStorage.lessnft_nft_chainName}`, {
      token: localStorage.dds_token,
    }),
  putOnSale: (
    tokenId: number,
    price: TNullable<number>,
    selling: boolean,
    currency: string,
    start_auction: string,
    end_auction: string,
  ) => {
    const data: any = {
      selling: true,
      price,
      currency,
      start_auction,
      end_auction,
    };
    if (!selling) {
      data.minimal_bid = price;
      delete data.price;
    }

    return axios.patch(`/store/${tokenId}/?network=${localStorage.lessnft_nft_chainName}`, data);
  },
  reportPage: (page: string, reportMessage: string, token: string) =>
    axios.post(`/store/report/?network=${localStorage.lessnft_nft_chainName}`, {
      page,
      message: reportMessage,
      token,
    }),
  support: (email: string, message: string, token: string) =>
    axios.post(`/store/support/?network=${localStorage.lessnft_nft_chainName}`, {
      email,
      message,
      token,
    }),
  trackTransaction: (
    tx_hash: string,
    token: string | number,
    seller_id: string | number,
    amount: number,
  ) => {
    const data: any = {
      tx_hash,
      token,
      ownership: seller_id,
      amount,
    };
    if (!seller_id) delete data.ownership;
    return axios.post(
      `/store/track_transaction/?network=${localStorage.lessnft_nft_chainName}`,
      data,
    );
  },
  removeFromSale: (id: string | number) => {
    const data = {
      id,
      price: null,
      minimal_bid: null,
      currency: 'less',
      start_auc: 0,
      end_auc: 0,
      selling: false,
    }
    return axios.patch(`/store/${id}/?network=${localStorage.lessnft_nft_chainName}`, data);
  },
  changePrice: (id: number | string, price: string | number) =>
    axios.patch(`/store/${id}/?network=${localStorage.lessnft_nft_chainName}`, {
      price,
    }),
  getMaxPrice: (currency: string) => axios.get(`/store/max_price/?currency=${currency}`),
  getHotAuction: () => axios.get(`/store/most_bidded/`),
  getCollection: (id: string, page: number) =>
    axios.get(`/store/collection/${id}/${page}/?network=${localStorage.lessnft_nft_chainName}`),
  getRandomToken: () =>
    axios.get(`/store/get_random_token/`, {
      params: {
        network: localStorage.lessnft_nft_chainName || '',
      },
    }),
  rejectTransaction: (data: any) => axios.post('/store/remove-reject/', data),
  getRelated: (id: string | number) =>
    axios.get(`store/related/${id}/?network=${localStorage.lessnft_nft_chainName}`),
  setCollectionCover: (data: any) => {
    return axios.post(`/store/set_cover/?network=${localStorage.lessnft_nft_chainName}`, data);
  },
  getTrendingCollections: (tag: string) =>
    axios.get(`/store/trending_collections/`, {
      params: {
        network: localStorage.lessnft_nft_chainName || '',
        tag,
      },
    }),
  getNotableDrops: (): Promise<{ data: Array<INotableDrop> }> => {
    return axios.get('/store/drops/');
  },
};
