import { INetwork } from '@amfi/connect-wallet/dist/interface';
import {
  bnbLogo,
  ethLogo,
  metamaskImg,
  polygonLogo,
  walletConnectImg,
  trustWalletImg,
} from 'assets/img';
import { chainsEnum, IConnectWallet, IContracts } from 'typings';

import {
  bep20Abi,
  erc20Abi,
  nftAbi,
  wbnbTestnetAbi,
  wethTestnetAbi,
  wMaticTestnetAbi,
  lessTestnetAbi
} from './abi';

export const is_production = false;

export const chains: {
  [key: string]: {
    name: chainsEnum;
    network: INetwork;
    provider: {
      [key: string]: any;
    };
    img?: any;
    explorer: string;
  };
} = {
  [chainsEnum.Ethereum]: {
    name: chainsEnum.Ethereum,
    network: {
      chainName: chainsEnum.Ethereum,
      chainID: is_production ? 1 : 4,
    },
    img: ethLogo,
    explorer: is_production ? '' : '',
    provider: {
      MetaMask: { name: 'MetaMask', img: metamaskImg },
      WalletConnect: {
        img: walletConnectImg,
        name: 'WalletConnect',
        useProvider: 'rpc',
        provider: {
          rpc: {
            rpc: {
              [is_production ? 1 : 4]: is_production
                ? 'https://bsc-dataseed.binance.org/'
                : 'https://data-seed-prebsc-2-s1.binance.org:8545/',
            },
            chainId: is_production ? 1 : 4,
          },
        },
      },
      TrustWallet: { name: 'MetaMask', img: trustWalletImg, isOnlyMobile: true },
    },
  },

  [chainsEnum['Binance-Smart-Chain']]: {
    name: chainsEnum['Binance-Smart-Chain'],
    network: {
      chainID: is_production ? 56 : 97,
      chainName: is_production ? 'Binance Smart Chain' : 'Binance Smart Chain Testnet',
      nativeCurrency: {
        name: 'BNB',
        symbol: 'BNB',
        decimals: 18,
      },
      rpc: is_production
        ? 'https://bsc-dataseed.binance.org/'
        : 'https://data-seed-prebsc-1-s1.binance.org:8545/',
      blockExplorerUrl: is_production ? 'https://bscscan.com' : 'https://testnet.bscscan.com',
    },
    img: bnbLogo,
    provider: {
      MetaMask: { name: 'MetaMask', img: metamaskImg },
      WalletConnect: {
        img: walletConnectImg,
        name: 'WalletConnect',
        useProvider: 'rpc',
        provider: {
          rpc: {
            rpc: {
              [is_production ? 56 : 97]: is_production
                ? 'https://bsc-dataseed.binance.org/'
                : 'https://data-seed-prebsc-2-s1.binance.org:8545/',
            },
            chainId: is_production ? 56 : 97,
          },
        },
      },
      TrustWallet: { name: 'MetaMask', img: trustWalletImg, isOnlyMobile: true },
    },
    explorer: is_production ? 'https://bscscan.com' : 'https://testnet.bscscan.com',
  },
  [chainsEnum.Polygon]: {
    name: chainsEnum.Polygon,
    network: {
      chainID: is_production ? 137 : 80001,
      chainName: chainsEnum.Polygon,
      nativeCurrency: {
        name: 'MATIC',
        symbol: 'MATIC',
        decimals: 18,
      },
      rpc: is_production
        ? 'https://rpc-mainnet.maticvigil.com/'
        : 'https://matic-mumbai.chainstacklabs.com',
      blockExplorerUrl: is_production
        ? 'https://explorer.matic.network/'
        : 'https://mumbai.polygonscan.com/',
    },
    img: polygonLogo,
    provider: {
      MetaMask: { name: 'MetaMask', img: metamaskImg },
      WalletConnect: {
        img: walletConnectImg,
        name: 'WalletConnect',
        useProvider: 'rpc',
        provider: {
          rpc: {
            rpc: {
              [is_production ? 137 : 80001]: is_production
                ? 'https://rpc-mainnet.maticvigil.com/'
                : 'https://matic-mumbai.chainstacklabs.com',
            },
            chainId: is_production ? 137 : 80001,
          },
        },
      },
      TrustWallet: { name: 'MetaMask', img: trustWalletImg, isOnlyMobile: true },
    },
    explorer: is_production ? 'https://polygonscan.com/' : 'https://mumbai.polygonscan.com/',
  },
};

export const connectWallet = (
  chainName: chainsEnum,
): IConnectWallet & {
  blockchains: Array<string>;
} => {
  const chain = chains[chainName];

  return {
    wallets: ['MetaMask', 'WalletConnect'],
    blockchains: ['Ethereum', 'Binance Smart Chain', 'Polygon'],
    network: chain.network,
    provider: chain.provider,
    settings: { providerType: true },
  };
};

export const exchangeAddrs = {
  [chainsEnum['Binance-Smart-Chain']]: !is_production
    ? '0xE303dD7146E67D3Bd438e54971ebd9076908e7d5'
    : '0x7b5db0171a01781e9f22737551ff6bff9ad4fe09',
  [chainsEnum.Ethereum]: !is_production
    ? '0x0d669902B1E2Dc2E7b229D5d9b3D15c3D719d3c1'
    : '0xd6318e77042b8808be7dc277da40e0e778aaba42',
  [chainsEnum.Polygon]: !is_production
    ? '0xE303dD7146E67D3Bd438e54971ebd9076908e7d5'
    : '0x533a2e15a8c1aa96b47681c0af6cba7de724f48f',
};

export const tokenAddrs = {
  [chainsEnum['Binance-Smart-Chain']]: !is_production
    ? '0x826e9dd8c254c01f9d038db8f091ed47790707b6'
    : '0xb698ac9bc82c718d8eba9590564b9a5aa53d58e6',
  [chainsEnum.Ethereum]: !is_production
    ? '0x8d12622A8f8aFF6e7223EaC3f741898Ad824432C'
    : '0x62786eeacc9246b4018e0146cb7a3efeacd9459d',
  [chainsEnum.Polygon]: !is_production
    ? '0x4F788fD644688b14cFb5E15425Dc3Eb2480b158b'
    : '0x155f60428d0eAF41b68525e1A781bcCD429E343f',
};

export const contracts: IContracts = {
  type: is_production ? 'mainnet' : 'testnet',
  names: ['Token', 'Staking', 'Presale', 'UsdtToken'],
  decimals: 18,
  params: {
    NFT: {
      mainnet: {
        address: '',
        abi: nftAbi,
      },
      testnet: {
        address: '',
        abi: nftAbi,
      },
    },
    BEP20: {
      mainnet: {
        address: '',
        abi: bep20Abi,
      },
      testnet: {
        address: '',
        abi: bep20Abi,
      },
    },
    LESS: {
      mainnet: {
        address: tokenAddrs[localStorage.lessnft_nft_chainName as chainsEnum],
        abi: erc20Abi,
      },
      testnet: {
        address: tokenAddrs[localStorage.lessnft_nft_chainName as chainsEnum],
        abi: lessTestnetAbi,
      },
    },
    WETH: {
      mainnet: {
        address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        abi: wethTestnetAbi,
      },
      testnet: {
        address: '0xdf032bc4b9dc2782bb09352007d4c57b75160b15',
        abi: wethTestnetAbi,
      },
    },
    EXCHANGE: {
      mainnet: {
        address: exchangeAddrs[localStorage.lessnft_nft_chainName as chainsEnum],
        abi: [],
      },
      testnet: {
        address: exchangeAddrs[localStorage.lessnft_nft_chainName as chainsEnum],
        abi: [],
      },
    },
    WBNB: {
      mainnet: {
        address: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
        abi: erc20Abi,
      },
      testnet: {
        address: '0x591873d1fff4ae144307f8da8dcfbb52b00bdf20',
        abi: wbnbTestnetAbi,
      },
    },
    WMATIC: {
      mainnet: {
        address: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
        abi: erc20Abi,
      },
      testnet: {
        address: '0xCF1177e9f54eE20C6E80570D678462363d56C1E5',
        abi: wMaticTestnetAbi,
      },
    },
  },
};
