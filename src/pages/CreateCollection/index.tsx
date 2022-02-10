import React, { useState } from 'react';
import cn from 'classnames';
import { Button, H2, Text } from 'components';
import { CreateCollectionForm } from 'forms';
import { observer } from 'mobx-react';
import { useWalletConnectorContext } from 'services/walletConnect';

import styles from './CreateCollection.module.scss';

interface IProps {
  isMultiple?: boolean;
}

const CreateCollection: React.FC<IProps> = observer(({ isMultiple = false }) => {
  const walletConnector = useWalletConnectorContext();
  const [isSingle, setIsSingle] = useState(!isMultiple);
  const handleTypeChange = () => {
    setIsSingle(!isSingle);
    if (isSingle) {
      window.history.replaceState('single', '', 'multiple');
    } else window.history.replaceState('multiple', '', 'single');
  };
  return (
    <>
      <div className={cn(styles.upload)}>
        <div className={styles.head}>
          <H2 className={styles.title} align="center">
            Create your collection
          </H2>
          <Text className={styles.info} size="m" color="lightGray" weight="medium" align="center">
            Upload your best artwork here and get your money
          </Text>
          <Button color="purple" className={styles.switch} onClick={handleTypeChange}>
            Switch to {isSingle ? 'Multiple' : 'Single'}
          </Button>
        </div>
        <div className={cn(styles.container)}>
          <CreateCollectionForm isSingle={isSingle} walletConnector={walletConnector} />
        </div>
      </div>
    </>
  );
});

export default CreateCollection;
