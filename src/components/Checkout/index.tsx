import React from 'react';
import { toast } from 'react-toastify';
import BigNumber from 'bignumber.js/bignumber';
import { Button, TextInput } from 'components';
import { useUserBalance } from 'hooks';
import { observer } from 'mobx-react-lite';

import { storeApi } from '../../services/api';
import { useWalletConnectorContext } from '../../services/walletConnect';
import { useMst } from '../../store';

import styles from './Checkout.module.scss';

const Checkout: React.FC = observer(() => {
  const {
    modals: { sell },
    user,
  } = useMst();
  const { walletService } = useWalletConnectorContext();
  const tokenAvailable =
    sell?.nft?.standart === 'ERC721'
      ? sell?.nft?.tokenAvailable
      : sell?.nft?.sellers?.filter((sellerItem) => sell.nft.sellerId === sellerItem.id)[0].quantity;
  const price =
    sell?.nft?.standart === 'ERC721'
      ? sell?.nft?.price
      : sell?.nft?.sellers?.filter((sellerItem) => sell.nft.sellerId === sellerItem.id)[0].price;

  const [isLoading, setIsLoading] = React.useState(false);
  const [quantity, setQuantity] = React.useState('1');
  const balance = useUserBalance(user.address, sell.nft.currency);

  const handleChangeAmount = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(e.target.value);
  }, []);

  const handleBuyToken = React.useCallback(() => {
    if (user.id) {
      setIsLoading(true);
      const amount = quantity ? +quantity : 1;
      storeApi
        .buyToken(
          sell.nft.tokenId || 0,
          sell.nft.standart === 'ERC721' ? 0 : +amount,
          sell.nft.standart === 'ERC721' ? '' : sell.nft.sellerId,
        )
        .then(({ data }) => {
          walletService
            .sendTransaction(data.initial_tx)
            .then((res: any) => {
              toast.success('Successful purchase of nft');
              storeApi
                .trackTransaction(
                  res.transactionHash,
                  sell.nft.tokenId,
                  sell.nft.sellerId,
                  sell.nft.standart === 'ERC721' ? 0 : +amount,
                )
                .then(() => {
                  setTimeout(() => {
                    sell.checkout.success();
                    sell.checkout.close();
                  }, 1000);
                });
            })
            .catch((error: any) => {
              toast.error({
                message: 'Error',
                description: 'Something went wrong',
              });
              console.error(error);
              storeApi.rejectTransaction({
                id: sell.nft.tokenId,
                type: 'token',
                owner: sell.nft.sellerId,
              });
            })
            .finally(() => setIsLoading(false));
        })
        .catch((error: any) => {
          toast.error({
            message: 'Error',
            description: 'Something went wrong',
          });
          console.error(error);
          setIsLoading(false);
        });
    }
  }, [walletService, quantity, user.id, sell]);

  const userWillPay = React.useMemo(() => {
    return new BigNumber(price || 0)
      .multipliedBy(+quantity > tokenAvailable ? tokenAvailable : quantity || 1)
      .plus(sell.nft.feeCurrency);
  }, [price, quantity, tokenAvailable, sell.nft.feeCurrency]);

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <div className={styles.media}>
          <img src={sell.nft.media} alt="" />
        </div>
        <div className={styles.content}>
          <div className={styles.title}>{sell.nft.tokenName}</div>
          <div className={styles.item}>
            <div className={styles.itemTitle}>Price</div>
            <div className={styles.itemInfo}>
              <div
                className={styles.itemPrice}
              >{`${price} ${sell.nft.currency.toUpperCase()}`}</div>
              <div className={styles.itemPriceUsd}>{`($${sell.nft.usdPrice})`}</div>
            </div>
          </div>
          {sell.nft.standart === 'ERC1155' ? (
            <div className={styles.item}>
              <div className={styles.itemTitle}>Quantity</div>
              <TextInput
                label=""
                className={styles.amount}
                value={quantity.toString()}
                onChange={handleChangeAmount}
                type="number"
                name="amount"
                placeholder="1"
                required
                positiveOnly
                integer
              />
            </div>
          ) : (
            ''
          )}
          <div className={styles.info}>
            <div className={styles.infoItem}>
              <div className={styles.infoItemName}>Your balance</div>
              <div className={styles.infoItemValue}>{`${new BigNumber(balance).toFixed(
                5,
              )} ${sell.nft.currency.toUpperCase()}`}</div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoItemName}>Service fee</div>
              <div className={styles.infoItemValue}>{`${
                sell.nft.feeCurrency
              } ${sell.nft.currency.toUpperCase()}`}</div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoItemName}>You will pay</div>
              <div
                className={styles.infoItemValue}
              >{`${userWillPay} ${sell.nft.currency.toUpperCase()}`}</div>
            </div>
          </div>
          <Button
            loading={isLoading}
            isFullWidth
            onClick={handleBuyToken}
            disabled={!quantity || +quantity > +tokenAvailable || +userWillPay > +balance}
          >
            Pay Now
          </Button>
        </div>
      </div>
    </div>
  );
});

export default Checkout;
