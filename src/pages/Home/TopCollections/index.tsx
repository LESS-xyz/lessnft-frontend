/* eslint-disable react/no-array-index-key */
import { FC, useState } from 'react';
import cx from 'classnames';
import { Button, H2, Text } from 'components';
import { OptionType } from 'typings';

import CollectionCard from './CollectionCard';
import TitleDropdown from './TitleDropdown';

import styles from './styles.module.scss';
import BigNumber from 'bignumber.js';
import { useFetchTopCollections } from 'hooks';
import { routes } from 'appConstants';

type Props = {
  className?: string;
};
const dropDownOptions: OptionType[] = [
  {
    label: '1 day',
    value: 'day',
  },
  {
    label: '7 days',
    value: 'week',
  },
  {
    label: 'month',
    value: 'month',
  },
];
const TopCollections: FC<Props> = ({ className }) => {
  const [period, setPeriod] = useState<OptionType>(dropDownOptions[0]);
  const { collections } = useFetchTopCollections(period);
  return (
    <div className={cx(styles.topCollections, className)}>
      <H2 className={styles.title} align="center">
        Top collections over
        <TitleDropdown value={period} setValue={setPeriod} options={dropDownOptions} />
      </H2>
      {collections.length ? (
        <div className={`${styles.collections} ${collections.length !== 0 && styles.open}`}>
          <ol
            className={styles.collectionsWrapper}
            style={{
              gridTemplateRows: `repeat(${collections.length > 5 ? 5 : collections.length}, 1fr)`,
            }}
          >
            {collections.map((collection, index) => (
              <CollectionCard
                key={index}
                avatar={collection.collection.avatar}
                isVerified={collection.is_verified}
                id={collection.collection.id}
                index={index + 1}
                name={collection.collection.name}
                price={new BigNumber(collection.price).isEqualTo(0) ? '< $0.01' : collection.price}
                profitIncrease={collection.difference || '0'}
              />
            ))}
          </ol>

          <Button className={styles.goRankingBtn} href={routes.topNfts.link(period.value)}>
            Go to Rankings
          </Button>
        </div>
      ) : (
        <Text size="xl" className={styles.noItems}>
          There are no collections for this period of time, but you can choose a longer period
        </Text>
      )}
    </div>
  );
};

export default TopCollections;
