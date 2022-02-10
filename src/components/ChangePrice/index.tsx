import React, { useState } from 'react';
import { toast } from 'react-toastify';
import cn from 'classnames';
import { observer } from 'mobx-react-lite';

import { storeApi } from 'services/api';
import { useMst } from 'store';
import { Button, Text, TextInput } from 'components';

import styles from './ChangePrice.module.scss';

interface IChangePriceProps {
  className?: string;
}

const ChangePrice: React.FC<IChangePriceProps> = ({ className }) => {
  const {
    modals: { change },
  } = useMst();
  const [price, setPrice] = useState('');

  const changePrice = React.useCallback(async () => {
    try {
      await storeApi.changePrice(change.tokenId, price);
      change.success();
      change.close();
      toast.success('Token price Changed');
    } catch (error) {
      console.error(error, 'change token price');
    }
  }, [change, price]);

  const handleClose = React.useCallback(() => {
    change.close();
  }, [change]);

  const handleSetPrice = (e: any) => {
    setPrice(e.target.value);
  };

  return (
    <div className={cn(className, styles.transfer)}>
      <Text className={styles.text} weight="medium" color="lightGray" size="m">
        Do you really want to change price of your item?
      </Text>

      <div className={styles.field}>
        <TextInput
          value={price}
          onChange={handleSetPrice}
          type="text"
          name="price"
          placeholder="Paste price"
          positiveOnly
        />
      </div>
      <div className={styles.btns}>
        <Button
          type="button"
          className={cn('button', styles.button)}
          onClick={changePrice}
          isFullWidth
          // color="blue"
        >
          Change Price
        </Button>
        <Button
          type="button"
          className={cn('button-stroke', styles.button)}
          isFullWidth
          color="outline"
          onClick={handleClose}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default observer(ChangePrice);
