import { ConnectWallet } from '@amfi/connect-wallet';
import BigNumber from 'bignumber.js/bignumber';
import { chainsEnum } from 'typings';
import Web3 from 'web3';

import {
  connectWallet as connectWalletConfig,
  contracts,
  is_production,
  exchangeAddrs,
} from '../../config';

const APPROVE_AMOUNT = 90071992000.5474099;
export class WalletConnect {
  public connectWallet: ConnectWallet;

  public walletAddress = '';

  constructor() {
    this.connectWallet = new ConnectWallet();
  }

  public async initWalletConnect(
    chainName: chainsEnum,
    providerName: 'MetaMask' | 'WalletConnect',
  ): Promise<boolean> {
    return new Promise((resolve) => {
      const { provider, network, settings } = connectWalletConfig(chainName);

      const connecting = this.connectWallet
        .connect(provider[providerName], network, settings)
        .then((connected: boolean | {}) => {
          return connected;
        })
        .catch((err: any) => {
          console.error('initWalletConnect providerWallet err: ', err);
        });

      Promise.all([connecting]).then((connect: any) => {
        resolve(connect[0]);
      });
    });
  }

  public logOut(): void {
    this.connectWallet.resetConect();
  }

  public Web3(): Web3 {
    return this.connectWallet.currentWeb3();
  }

  public async getTokenBalance(contractAbi: string) {
    const contract = this.connectWallet.getContract({
      address: contracts.params[contractAbi][is_production ? 'mainnet' : 'testnet'].address,
      abi: contracts.params[contractAbi][is_production ? 'mainnet' : 'testnet'].abi,
    });
    // eslint-disable-next-line consistent-return
    return contract.methods.balanceOf(this.walletAddress).call();
  }

  public setAccountAddress(address: string) {
    this.walletAddress = address;
  }

  async checkNftTokenAllowance(tokenAddress: string) {
    const contract = this.connectWallet.getContract({
      address: tokenAddress,
      abi: contracts.params.BEP20[is_production ? 'mainnet' : 'testnet'].abi,
    });
    const ExchangeAddress = exchangeAddrs[localStorage.lessnft_nft_chainName as chainsEnum];

    const result = await contract.methods
      .isApprovedForAll(this.walletAddress, ExchangeAddress)
      .call();

    return result;
  }

  public getAccount() {
    return this.connectWallet.getAccounts();
  }

  getWethBalance() {
    const contractAbi = 'WETH';
    const contract = this.connectWallet.getContract({
      address: contracts.params[contractAbi][is_production ? 'mainnet' : 'testnet'].address,
      abi: contracts.params[contractAbi][is_production ? 'mainnet' : 'testnet'].abi,
    });
    return contract.methods.balanceOf(this.walletAddress).call();
  }

  static getMethodInterface(abi: Array<any>, methodName: string) {
    return abi.filter((m) => {
      return m.name === methodName;
    })[0];
  }

  encodeFunctionCall(abi: any, data: Array<any>) {
    return this.Web3().eth.abi.encodeFunctionCall(abi, data);
  }

  async createTransaction(
    method: string,
    data: Array<any>,
    contract: 'BEP20' | 'WETH' | 'WBNB' | 'WMATIC' | 'NFT',
    tx?: any,
    tokenAddress?: string,
    walletAddress?: string,
    value?: any,
  ) {
    const transactionMethod = WalletConnect.getMethodInterface(
      contracts.params[contract][is_production ? 'mainnet' : 'testnet'].abi,
      method,
    );
    let signature;
    if (transactionMethod) {
      signature = this.encodeFunctionCall(transactionMethod, data);
    }

    if (tx) {
      tx.from = walletAddress || this.walletAddress;
      tx.data = signature;

      return this.sendTransaction(tx);
    }
    return this.sendTransaction({
      from: walletAddress || this.walletAddress,
      to: tokenAddress || contracts.params[contract][is_production ? 'mainnet' : 'testnet'].address,
      data: signature || '',
      value: value || '',
      // type: baseFeePerGas ? '0x2' : '0x0',
    });
  }

  sendTransaction(transactionConfig: any) {
    return this.Web3().eth.sendTransaction({
      ...transactionConfig,
      from: this.walletAddress,
    });
  }

  async totalSupply(tokenAddress: string, abi: Array<any>, tokenDecimals: number) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const contract = this.connectWallet.getContract({ address: tokenAddress, abi });
    const totalSupply = await contract.methods.totalSupply().call();

    return +new BigNumber(totalSupply).dividedBy(new BigNumber(10).pow(tokenDecimals)).toString(10);
  }

  async checkTokenAllowance(
    contractName: string,
    tokenDecimals: number,
    approvedAddress?: string,
    walletAddress?: string,
  ) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const contract = this.connectWallet.getContract({
      address: contracts.params[contractName][is_production ? 'mainnet' : 'testnet'].address,
      abi: contracts.params[contractName][is_production ? 'mainnet' : 'testnet'].abi,
    });
    const walletAdr = walletAddress || this.walletAddress;

    try {
      let result = await contract.methods
        .allowance(
          walletAdr,
          approvedAddress ||
            contracts.params[contractName][is_production ? 'mainnet' : 'testnet'].address,
        )
        .call();

      result =
        result === '0'
          ? null
          : +new BigNumber(result).dividedBy(new BigNumber(10).pow(tokenDecimals)).toString(10);
      // if (result && new BigNumber(result).minus(totalSupply).isPositive()) {

      if (result && new BigNumber(result).minus(APPROVE_AMOUNT).isPositive()) {
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  async approveToken(
    contractName: string,
    tokenDecimals: number,
    approvedAddress?: string,
    walletAddress?: string,
  ) {
    try {
      const approveMethod = WalletConnect.getMethodInterface(
        contracts.params[contractName][is_production ? 'mainnet' : 'testnet'].abi,
        'approve',
      );

      const approveSignature = this.encodeFunctionCall(approveMethod, [
        approvedAddress || walletAddress || this.walletAddress,
        WalletConnect.calcTransactionAmount(APPROVE_AMOUNT, tokenDecimals),
      ]);

      const gasPrice = await this.connectWallet.currentWeb3().eth.getGasPrice();

      return this.sendTransaction({
        from: walletAddress || this.walletAddress,
        to: contracts.params[contractName][is_production ? 'mainnet' : 'testnet'].address,
        data: approveSignature,
        gasPrice: new BigNumber(gasPrice).multipliedBy(
          localStorage.lessnft_nft_chainName === 'Polygon' ? 3 : 1,
        ),
      });
    } catch (error) {
      return error;
    }
  }

  static calcTransactionAmount(amount: number | string, tokenDecimal: number): string {
    return new BigNumber(amount).times(new BigNumber(10).pow(tokenDecimal)).toString(10);
  }

  static weiToEth(amount: number | string): string {
    return new BigNumber(amount).dividedBy(new BigNumber(10).pow(18)).toString(10);
  }

  static getAddress(contractName: string): string {
    return contracts.params[contractName][is_production ? 'mainnet' : 'testnet'].address;
  }
}
