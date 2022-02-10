import { VFC } from 'react';
import cn from 'classnames';

import { H6, Text } from 'components';
import StatusFilter from './components/StatusFilter';
import PriceFilter from './components/PriceFilter';
import CollectionsFilter from './components/CollectionsFilter';
import ChainFilter from './components/ChainFilter';
import RankingsFilter from './components/RankingsFilter';
import CategoriesFilter from './components/CategoriesFilter';
// import OnSaleInFilter from './components/OnSaleInFilter';
import PropertiesFilter from './components/PropertiesFilter';
import { IProperties, IRankings, useNewFilters } from 'hooks';

import styles from './DiscoverFilters.module.scss';

import { ArrowLeft, iconStar, iconStats } from 'assets/img';

interface IFiltersConfig {
  needCollections?: boolean;
  needChains?: boolean;
  properties: IProperties;
  rankings: IRankings;
  stats: IRankings;
}
interface IProps {
  isFilterOpen: boolean;
  setFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  filters: ReturnType<typeof useNewFilters>;
  config?: IFiltersConfig;
}

const DiscoverFilters: VFC<IProps> = ({
  setFilterOpen,
  isFilterOpen,
  filters: {
    setIsOnSale,
    isOnSale,
    setIsOnAuction,
    isOnAuction,
    setIsTimedOnAuction,
    isOnTimedAuction,
    activeTags,
    setActiveTags,
    activeChains,
    setActiveChains,
    setMinPrice,
    setMaxPrice,
    minPrice,
    maxPrice,
    // activeCurrencies,
    // setActiveCurrencies,
    activeCollections,
    setActiveCollections,
    activePerks,
    setActivePerks,
    activeRankings,
    setActiveRankigs,
    activeStats,
    setActiveStats,
  },
  config = { needCollections: true, needChains: true },
}) => {
  return (
    <section className={cn(styles.filters, { [styles.active]: isFilterOpen })}>
      {isFilterOpen ? (
        <>
          <div className={styles.header}>
            <H6 className={styles.title}>Filter</H6>
            <button
              onClick={() => setFilterOpen(!isFilterOpen)}
              type="button"
              className={cn(styles.hide_button, { [styles.active]: isFilterOpen })}
            >
              <ArrowLeft />
            </button>
          </div>
          <div className={styles.content}>
            <StatusFilter
              setIsOnSale={setIsOnSale}
              isOnSale={isOnSale}
              setIsTimedOnAuction={setIsTimedOnAuction}
              setIsOnAuction={setIsOnAuction}
              isOnAuction={isOnAuction}
              isOnTimedAuction={isOnTimedAuction}
              setActiveTags={setActiveTags}
              activeTags={activeTags}
            />
            <PriceFilter
              setMinPrice={setMinPrice}
              setMaxPrice={setMaxPrice}
              minPrice={minPrice}
              maxPrice={maxPrice}
            />
            {config.needCollections && (
              <CollectionsFilter
                activeCollections={activeCollections}
                setActiveCollections={setActiveCollections}
              />
            )}
            {config.needChains && (
              <ChainFilter activeChains={activeChains} setActiveChains={setActiveChains} />
            )}
            <CategoriesFilter activeTags={activeTags} setActiveTags={setActiveTags} />
            {/* <OnSaleInFilter
              activeCurrencies={activeCurrencies}
              setActiveCurrencies={setActiveCurrencies}
            /> */}
            <PropertiesFilter
              properties={config.properties || {}}
              activePerks={activePerks}
              setActivePerks={setActivePerks}
            />
            <RankingsFilter
              rankings={config.rankings || {}}
              activeRankings={activeRankings}
              setActiveRankigs={setActiveRankigs}
              icon={iconStar}
            />
            {/* LevelsFilter 👇 Same interface as RankingsFilter*/}
            <RankingsFilter
              rankings={config.stats || {}}
              activeRankings={activeStats}
              setActiveRankigs={setActiveStats}
              icon={iconStats}
            />
          </div>
        </>
      ) : (
        <div className={styles.hide}>
          <Text className={styles.hide_title} size="m" tag="span">
            Filters
          </Text>
          <button
            onClick={() => setFilterOpen(!isFilterOpen)}
            type="button"
            className={cn(styles.hide_button, { [styles.active]: isFilterOpen })}
          >
            <ArrowLeft />
          </button>
        </div>
      )}
    </section>
  );
};

export default DiscoverFilters;
