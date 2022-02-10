import React, { useCallback, useState } from 'react';
import BigNumber from 'bignumber.js/bignumber';
import cn from 'classnames';
import { toast } from 'react-toastify';
import { observer } from 'mobx-react-lite';

import { Button, Switch, TextInput, Text, Dropdown, H6, RequiredMark } from 'components';
import { storeApi, useWalletConnectorContext } from 'services';
import { useMst } from 'store';
import { chainsEnum } from 'typings';
import { useUserBalance } from 'hooks';
import { exchangeAddrs } from 'config';
import { IconCoin } from 'assets/img';

import styles from './PutSale.module.scss';
import { dateFormatter } from 'utils/dateFormatter';

interface IPutSaleProps {
  className?: string;
}

// interface IRate {
//   rate: string;
//   symbol: string;
//   image: string;
// }

const startAuctionOptions = ['Right after listing', 'After 1 hour', 'After 6 hours'];
const endAuctionOptions = ['1 Day', '3 Days', '1 Week'];

const PutSale: React.FC<IPutSaleProps> = ({ className }) => {
  const ExchangeAddress = exchangeAddrs[localStorage.lessnft_nft_chainName as chainsEnum];
  const { walletService } = useWalletConnectorContext();
  const {
    user,
    modals: { sell },
  } = useMst();
  const currency =  sell.nft.currency|| 'less'
  const [price, setPrice] = useState(
    currency.toUpperCase() === 'BNB' ||
      currency.toUpperCase() === 'ETH' ||
      currency.toUpperCase() === 'MATIC' ||
      currency.toUpperCase() === 'TRX',
  );
  const [priceValue, setPriceValue] = useState('');
  // const [currency, setCurrency] = useState('');
  const [startAuction, setStartAuction] = useState(startAuctionOptions[0]);
  const [endAuction, setEndAuction] = useState(endAuctionOptions[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTimedAuction, setIsTimedAuction] = useState(false);
  // const [rates, setRates] = useState<IRate[]>([]);
  const balance = useUserBalance(user.address, currency);

  // const fetchRates = useCallback(() => {
  //   ratesApi.getRates().then(({ data }: any) => {
  //     setRates(data);
  //     setCurrency(data[0]?.symbol);
  //   });
  // }, []);

  // const currencyOptions = useMemo(() => {
  //   return !price
  //     ? [...rates.map((rate: any) => rate.symbol)].filter(
  //         (rateSymbol) => !['bnb', 'eth', 'matic'].includes(rateSymbol),
  //       )
  //     : rates.map((rate) => rate.symbol);
  // }, [rates, price]);

  const handleCheckApproveNft = useCallback(async () => {
    try {
      const result = await walletService.checkNftTokenAllowance(sell.nft.collection.address);
      return result;
    } catch (err) {
      console.error(err);
      return false;
    }
  }, [sell.nft.collection.address, walletService]);

  const handleApproveNft = useCallback(async () => {
    try {
      const isAppr = await handleCheckApproveNft();
      if (!isAppr) {
        await walletService.createTransaction(
          'setApprovalForAll',
          [ExchangeAddress, true],
          'NFT',
          false,
          sell.nft.collection.address,
        );
      }
    } catch (err) {
      throw Error;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    handleCheckApproveNft,
    sell.nft.collection.address,
    user.address,
    walletService,
    ExchangeAddress,
  ]);

  const fetchStore = useCallback(() => {
    setIsLoading(true);
    handleApproveNft()
      .then(() => {
        storeApi
          .putOnSale(
            sell.nft.tokenId ? +sell.nft.tokenId : 0,
            priceValue ? +priceValue : 0,
            price,
            currency,
            !price && isTimedAuction ? dateFormatter(startAuction) : '',
            !price && isTimedAuction ? dateFormatter(endAuction) : '',
          )
          .then(() => {
            sell.putOnSale.success();
            sell.putOnSale.close();
            toast.success('Token Put on sale');
          })
          .catch((err: any) => {
            toast.error({
              message: 'Error',
              description: 'Something went wrong',
            });
            console.error(err);
          });
      })
      .catch((err: any) => {
        toast.error({
          message: 'Error',
          description: 'Something went wrong',
        });
        console.error(err);
      })
      .finally(() => setIsLoading(false));
  }, [
    handleApproveNft,
    sell.nft.tokenId,
    sell.putOnSale,
    priceValue,
    price,
    currency,
    isTimedAuction,
    startAuction,
    endAuction,
  ]);

  const handleClose = useCallback(() => {
    sell.putOnSale.close();
  }, [sell.putOnSale]);

  // useEffect(() => {
  //   fetchRates();
  // }, [fetchRates]);

  return (
    <div className={cn(className, styles.sale)}>
      <div className={styles.line}>
        <div className={styles.icon}>
          <IconCoin />
        </div>
        <div className={styles.details}>
          <Text className={styles.info} color="lightGray" weight="bold" size="xl">
            Instant sale price
          </Text>
          <Text className={styles.text} color="lightGray" weight="medium" size="m">
            Enter the price for which the item will be instantly sold
          </Text>
        </div>
        <Switch className={styles.switch} value={price} setValue={setPrice} />
      </div>
      <div className={styles.table}>
        <div className={cn(styles.row, styles.rowInput)}>
          <TextInput
            label=""
            type="number"
            className={cn(styles.input, styles.col)}
            placeholder={price ? 'Enter instant sale price' : 'Enter bid'}
            value={priceValue}
            onChange={(e) => setPriceValue(e.target.value)}
            // prefix={
            //   <Dropdown
            //     value={currency}
            //     setValue={setCurrency}
            //     options={currencyOptions}
            //     className={styles.dropdown}
            //     headClassName={styles.head}
            //     bodyClassName={styles.body}
            //   />
            // }
            // prefixClassName={styles.prefix}
            positiveOnly
          />
          {/* <div className={styles.col}>{currency.toUpperCase()}</div> */}
        </div>
        {sell.nft.standart === 'ERC721' && !price && (
          <div className={styles.itemAuc}>
            <H6 className={styles.itemAucTitle}>
              Make timed auction
              <Switch name="isTimedAuction" value={isTimedAuction} setValue={setIsTimedAuction} />
            </H6>

            {isTimedAuction && (
              <>
                <div className={styles.startEndAuc}>
                  <div className={styles.startEndAucItem}>
                    <Text className={cn(styles.label)} size="m" weight="medium">
                      Starting Date <RequiredMark />
                    </Text>
                    <Dropdown
                      name="startAuction"
                      setValue={setStartAuction}
                      options={startAuctionOptions}
                      className={styles.startEndAucDropdown}
                      value={startAuction}
                    />
                  </div>

                  <div className={styles.startEndAucItem}>
                    <Text className={cn(styles.label)} size="m" weight="medium">
                      Expiration Date <RequiredMark />
                    </Text>
                    <Dropdown
                      name="endAuction"
                      setValue={setEndAuction}
                      options={endAuctionOptions}
                      className={styles.startEndAucDropdown}
                      value={endAuction}
                    />
                  </div>
                </div>
                <Text className={styles.startEndAucText} size="m" weight="medium">
                  Any bid placed in the last 10 minutes extends the auction by 10 minutes. Learn
                  more how timed auctions work
                </Text>
              </>
            )}
          </div>
        )}
        <div className={styles.row}>
          <div className={styles.col}>Your balance</div>
          <div className={styles.col}>
            {balance} {currency.toUpperCase()}
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.col}>Service fee</div>
          <div className={styles.col}>{sell.nft.fee}%</div>
        </div>
        <div className={styles.row}>
          <div className={styles.col}>You recieve</div>
          {priceValue ? (
            <div className={styles.col}>
              {new BigNumber(
                (
                  (parseFloat(priceValue) * (100 - sell.nft.fee - sell.nft.royalty)) /
                  100
                ).toString(),
              ).toString(10)}{' '}
              {currency.toUpperCase()}
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
      <div className={styles.btns}>
        <Button
          onClick={fetchStore}
          className={cn('button', styles.button)}
          loading={isLoading}
          isFullWidth
          disabled={!+priceValue}
        >
          Put on sale
        </Button>
        <Button
          type="button"
          className={cn('button-stroke', styles.button)}
          onClick={handleClose}
          isFullWidth
          color="outline"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default observer(PutSale);
