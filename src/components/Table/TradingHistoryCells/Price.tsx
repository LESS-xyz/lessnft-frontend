import { FC } from 'react';
import cx from 'classnames';
import { Text } from 'components';
import { ICurrency } from 'typings';
import { toFixed } from 'utils';

import { TEventType } from './Event';

import styles from './styles.module.scss';

type Props = {
  className?: string;
  amount: number | string;
  currency: ICurrency;
  type: TEventType;
};

const TradingHistoryPrice: FC<Props> = ({ className, amount, currency, type }) => (
  <div className={cx(styles.tradingHistoryCells, className)}>
    {!(type === 'Mint' || type === 'Transfer') && (
      <>
        {currency && (
          <div className={styles.tradingIcon}>
            <img src={currency.image} alt={currency.name} />
          </div>
        )}
        <Text description={amount?.toString()} style={{ textTransform: 'uppercase' }} size="m">
          {`${amount === null ? 0 : toFixed(amount, 5)} ${
            amount === null ? '' : currency?.symbol.toUpperCase()
          }`}
        </Text>
      </>
    )}
  </div>
);

export default TradingHistoryPrice;
