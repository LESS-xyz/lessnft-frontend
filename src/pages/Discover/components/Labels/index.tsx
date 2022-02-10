import { useCallback, useMemo, VFC } from 'react';

import FilterLabel from '../FilterLabel';
import { useNewFilters } from 'hooks';

import s from './Labels.module.scss';

import { iconChange } from 'assets/img';

interface IProps {
  filters: ReturnType<typeof useNewFilters>;
}

const Labels: VFC<IProps> = ({
  filters: {
    isOnSale,
    setIsOnSale,
    isOnAuction,
    setIsOnAuction,
    isOnTimedAuction,
    setIsTimedOnAuction,
    activeTags,
    setActiveTags,
    activeChains,
    setActiveChains,
    setDefaultFilters,
    minPrice,
    maxPrice,
    setMaxPrice,
    setMinPrice,
    activeCurrencies,
    setActiveCurrencies,
    setTextSearch,
    textSearch,
    activeCollections,
    setActiveCollections,
    activePerks,
    setActivePerks,
    activeRankings,
    setActiveRankigs,
    activeStats,
    setActiveStats,
  },
}) => {
  const minMaxLabel = useMemo(() => {
    if (minPrice && maxPrice) return `${(+minPrice).toFixed(2)} - ${(+maxPrice).toFixed(2)}`;
    if (!minPrice && maxPrice) return `< ${(+maxPrice).toFixed(2)}`;
    if (minPrice && !maxPrice) return `> ${(+minPrice).toFixed(2)}`;
    return '';
  }, [minPrice, maxPrice]);

  const activeProperties = useMemo(() => Object.keys(JSON.parse(activePerks)), [activePerks]);
  const activeRanks = useMemo(() => JSON.parse(activeRankings), [activeRankings]);
  const activeStatsProps = useMemo(() => JSON.parse(activeStats), [activeStats]);

  const handleDeletePerk = useCallback(
    (propTitle: string, propName: string) => {
      const perks = JSON.parse(activePerks);
      const newPerks = JSON.parse(activePerks)[propTitle].filter(
        (prop: string) => prop !== propName,
      );

      perks[propTitle] = newPerks;

      setActivePerks(() => JSON.stringify(perks));
    },
    [activePerks, setActivePerks],
  );

  const handleDeleteRanking = useCallback(
    (rankingTitle: string) => {
      const newRankings = Object.fromEntries(
        Object.entries(activeRankings).filter((ranking) => ranking[0] !== rankingTitle),
      );

      setActiveRankigs(JSON.stringify(newRankings));
    },
    [activeRankings, setActiveRankigs],
  );

  const handleDeleteStat = useCallback(
    (statTitle: string) => {
      const newRankings = Object.fromEntries(
        Object.entries(activeStatsProps).filter((stat) => stat[0] !== statTitle),
      );

      setActiveStats(JSON.stringify(newRankings));
    },
    [activeStatsProps, setActiveStats],
  );

  const getMinAndMaxTitle = useCallback((values: Array<string>) => {
    return `${values[0] && `from ${values[0]}`} ${values[1] && `to ${values[1]}`}`;
  }, []);

  return (
    <div className={s.labels}>
      {isOnSale && <FilterLabel title="Buy now" onClick={() => setIsOnSale(false)} />}
      {isOnAuction && <FilterLabel title="On Auction" onClick={() => setIsOnAuction(false)} />}
      {isOnTimedAuction && (
        <FilterLabel title="Has Offers" onClick={() => setIsTimedOnAuction(false)} />
      )}
      {activeTags
        .filter((nftTag) => nftTag.toLowerCase() !== 'all nfts')
        .map((tag) => (
          <FilterLabel
            key={tag}
            title={tag}
            onClick={() => setActiveTags((prev) => prev.filter((el) => el !== tag))}
          />
        ))}
      {activeChains.map((chain) => (
        <FilterLabel
          key={chain}
          title={chain}
          onClick={() => setActiveChains((prev) => prev.filter((el) => el !== chain))}
        />
      ))}
      {activeCurrencies.map((currency) => (
        <FilterLabel
          key={currency}
          title={currency.toUpperCase()}
          onClick={() => setActiveCurrencies((prev) => prev.filter((el) => el !== currency))}
        />
      ))}
      {activeCollections.map((collection) => (
        <FilterLabel
          key={collection.id}
          title={collection.name}
          onClick={() =>
            setActiveCollections((prev) => prev.filter((el) => el.id !== collection.id))
          }
        />
      ))}
      {(minPrice || maxPrice) && (
        <FilterLabel
          icon={iconChange}
          title={minMaxLabel}
          onClick={() => {
            setMaxPrice('');
            setMinPrice('');
          }}
        />
      )}
      {textSearch && (
        <FilterLabel title={`Text: ${textSearch}`} onClick={() => setTextSearch('')} />
      )}
      {activeProperties.map((propTitle) =>
        JSON.parse(activePerks)[propTitle].map((perk: string) => (
          <FilterLabel
            key={`${propTitle}-${perk}`}
            title={perk}
            onClick={() => handleDeletePerk(propTitle, perk)}
          />
        )),
      )}
      {Object.keys(activeRanks).map((rankingTitle) => (
        <FilterLabel
          key={`${rankingTitle}`}
          title={`${rankingTitle}: ${getMinAndMaxTitle([
            activeRanks[rankingTitle].min,
            activeRanks[rankingTitle].max,
          ])}`}
          onClick={() => handleDeleteRanking(rankingTitle)}
        />
      ))}
      {Object.keys(activeStatsProps).map((statTitle) => (
        <FilterLabel
          key={`${statTitle}`}
          title={`${statTitle}: ${getMinAndMaxTitle([
            activeStatsProps[statTitle].min,
            activeStatsProps[statTitle].max,
          ])}`}
          onClick={() => handleDeleteStat(statTitle)}
        />
      ))}
      <button type="button" className={s.button} onClick={setDefaultFilters}>
        Clear All
      </button>
    </div>
  );
};

export default Labels;
