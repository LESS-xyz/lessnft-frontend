import { FC, useState } from 'react';
import { Chart } from 'components';
import styles from './PriceHistory.module.scss';
import { ICurrency, OptionType, TPriceHistoryPeriod } from 'typings';
import { useFetchPriceHistory } from 'hooks';

const chartOptionsFilter: OptionType[] = [
  {
    label: 'Today',
    value: 'day' as TPriceHistoryPeriod,
  },
  {
    label: 'This week',
    value: 'week' as TPriceHistoryPeriod,
  },
  {
    label: 'This Month',
    value: 'month' as TPriceHistoryPeriod,
  },
  {
    label: 'This Year',
    value: 'year' as TPriceHistoryPeriod,
  },
];

interface IProps {
  tokenId: string;
  currency: ICurrency;
}

const PriceHistory: FC<IProps> = ({ tokenId, currency }) => {
  const [currentFilterOption, setCurrentFilterOption] = useState(chartOptionsFilter[0]);
  const { priceHistory } = useFetchPriceHistory({
    id: tokenId,
    period: currentFilterOption.value as TPriceHistoryPeriod,
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.chartWrapper}>
        {priceHistory.length && (
          <>
            <Chart
              currency={currency}
              className={styles.chart}
              data={priceHistory}
              period={currentFilterOption.value as TPriceHistoryPeriod}
              onCurrentFilterChange={setCurrentFilterOption}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default PriceHistory;
