import axios from '../../core/axios';
import { TOptionable } from '../../typings';

interface ILogin {
  address: string;
  signedMsg: string;
  msg: string;
}

export default {
  login: (data: ILogin) =>
    axios.post('account/metamask_login/', {
      address: data.address,
      signed_msg: data.signedMsg,
      msg: data.msg,
    }),
  getMsg: () => axios.get('account/get_metamask_message/'),
  getSingleCollections: () =>
    axios.get(`account/self/collections/?network=${localStorage.lessnft_nft_chainName}`),
  getMe: () => axios.get(`account/self/?network=${localStorage.lessnft_nft_chainName}`),
  update: (data: any) => {
    return axios.patch(`account/self/?network=${localStorage.lessnft_nft_chainName}`, data);
  },
  follow: (data: { id: string | number }) =>
    axios.post(`account/self/follow/?network=${localStorage.lessnft_nft_chainName}`, data),
  unfollow: (
    data: { id: string | number }, // TODO: remove if follow and unfollow united
  ) => axios.post(`account/self/unfollow/?network=${localStorage.lessnft_nft_chainName}`, data),
  like: (data: { id: TOptionable<string | number> }) =>
    axios.post(`account/self/like/?network=${localStorage.lessnft_nft_chainName}`, data),
  verifyMe: (data: any, address: string) =>
    axios.post(`/account/verification/?network=${localStorage.lessnft_nft_chainName}`, {
      custom_url: data.custom_url,
      address,
      role: 'creator',
      bio: data.bio,
      twitter: data.twitter,
      instagram: data.instagram,
      site: data.site,
      email: data.email,
      media: data.img,
    }),
  setUserCover: (data: any) => {
    return axios.post(
      `/account/set_user_cover/?network=${localStorage.lessnft_nft_chainName}`,
      data,
    );
  },
  getRandomCover: () =>
    axios.get(`/account/get_random_cover/?network=${localStorage.lessnft_nft_chainName}`),
  getUser: (data: { id: string }) =>
    axios.get(`account/${data.id}/?network=${localStorage.lessnft_nft_chainName}`),
  getFollowing: (address: string, page: number) =>
    axios.get(
      `account/following/${address}/${page}/?network=${localStorage.lessnft_nft_chainName}`,
    ),
  getFollowers: (address: string, page: number) =>
    axios.get(
      `account/followers/${address}/${page}/?network=${localStorage.lessnft_nft_chainName}`,
    ),
  getSelfCollections: () =>
    axios.get(`/account/self/collections/?network=${localStorage.lessnft_nft_chainName}`),
  saveEmailToDb: (address: string) => axios.post('/account/save_email/', { address }),
};
