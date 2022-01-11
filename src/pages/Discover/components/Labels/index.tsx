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

  return (
    <div className={s.labels}>
      {isOnSale && <FilterLabel title="Buy now" onClick={() => setIsOnSale(false)} />}
      {isOnAuction && <FilterLabel title="On Auction" onClick={() => setIsOnAuction(false)} />}
      {isOnTimedAuction && (
        <FilterLabel title="Has Offers" onClick={() => setIsTimedOnAuction(false)} />
      )}
      {activeTags.map((tag) => (
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
          key={collection}
          title={collection}
          onClick={() => setActiveCollections((prev) => prev.filter((el) => el !== collection))}
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
          title={`${rankingTitle}: ${activeRanks[rankingTitle].min} to ${activeRanks[rankingTitle].max}`}
          onClick={() => {}}
        />
      ))}
      <button type="button" className={s.button} onClick={setDefaultFilters}>
        Clear All
      </button>
    </div>
  );
};

export default Labels;
