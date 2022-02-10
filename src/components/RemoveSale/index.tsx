import React from 'react';
import { toast } from 'react-toastify';
import cn from 'classnames';
import { observer } from 'mobx-react-lite';

import { storeApi } from 'services/api';
import { useMst } from 'store';
import { Button, Text } from 'components';

import styles from './RemoveSale.module.scss';

interface IRemoveSaleProps {
  className?: string;
}

const RemoveSale: React.FC<IRemoveSaleProps> = ({ className }) => {
  const {
    modals: { remove },
  } = useMst();

  const removeFromSale = React.useCallback(async () => {
    try {
      await storeApi.removeFromSale(remove.tokenId);
      remove.success();
      remove.close();
      toast.success('Token Removed from sale');
    } catch (error) {
      console.error(error, 'remove from sale');
    }
  }, [remove]);

  const handleClose = React.useCallback(() => {
    remove.close();
  }, [remove]);

  return (
    <div className={cn(className, styles.transfer)}>
      <Text className={styles.text} weight="medium" color="lightGray" size="m">
        Do you really want to remove your item from sale? You can put it on sale anytime
      </Text>
      <div className={styles.btns}>
        <Button
          type="button"
          className={cn('button', styles.button)}
          onClick={removeFromSale}
          isFullWidth
        >
          Remove now
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

export default observer(RemoveSale);
