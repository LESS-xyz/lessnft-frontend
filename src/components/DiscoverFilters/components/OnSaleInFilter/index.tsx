import { useState, VFC, useCallback } from 'react';

import GroupWrapper from '../GroupWrapper';
import { Checkbox } from 'components';

import styles from './OnSaleInFilter.module.scss';
import { useMst } from 'store';

interface IProps {
  activeCurrencies: Array<string>;
  setActiveCurrencies: React.Dispatch<React.SetStateAction<string[]>>;
}

const OnSaleInFilter: VFC<IProps> = ({ activeCurrencies, setActiveCurrencies }) => {
  const [isOpened, setIsOpened] = useState(true);

  const { networks } = useMst();

  const handleChangeActiveCurrencies = useCallback(
    (currency: string) => {
      if (activeCurrencies.includes(currency)) {
        setActiveCurrencies((prev) => prev.filter((el) => el !== currency));
      } else {
        setActiveCurrencies((prev) => [...prev, currency]);
      }
    },
    [activeCurrencies, setActiveCurrencies],
  );

  return (
    <GroupWrapper isOpened={isOpened} setIsOpened={() => setIsOpened(!isOpened)} title="On sale in">
      <div className={styles.content}>
        {networks.getNetworks.length &&
          networks.getCurrencies.map((currency) => (
            <Checkbox
              onChange={() => handleChangeActiveCurrencies(currency.symbol)}
              content={currency.symbol.toUpperCase()}
              value={activeCurrencies.includes(currency.symbol)}
              className={styles.checkbox}
              key={currency.name}
            />
          ))}
      </div>
    </GroupWrapper>
  );
};

export default OnSaleInFilter;
