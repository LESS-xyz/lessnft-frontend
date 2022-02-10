import { RefObject, useCallback, useRef, useState } from 'react';
import cx from 'classnames';
import { ArtCard, Text, DiscoverFilters, ArtCardSkeleton, Select } from 'components';
import { useFetchNft, useInfiniteScroll, useNewFilters } from 'hooks';
import { observer } from 'mobx-react-lite';
import { userApi } from 'services';
import { useMst } from 'store';
import { TNullable } from 'typings';
import { toFixed } from 'utils';

import styles from './styles.module.scss';

import { FourSquares, NineSquares } from 'assets/img';
import Labels from './components/Labels';

const Discover = observer(() => {
  const { user } = useMst();

  const [isFilterOpen, setFilterOpen] = useState(window.innerWidth >= 780);
  const [isSmallCards, setIsSmallCards] = useState(false);

  const filters = useNewFilters();

  const [allPages, totalItems, nftCards, isNftsLoading] = useFetchNft(
    {
      page: filters.page,
      type: 'items',
      order_by: filters.sortBy.value,
      tags: filters.activeTags.join(','),
      max_price: filters.maxPrice,
      min_price: filters.minPrice,
      text: filters.textSearch,
      on_sale: filters.isOnSale,
      on_auc_sale: filters.isOnAuction,
      on_timed_auc_sale: filters.isOnTimedAuction,
      network: filters.activeChains.join(','),
      currency: filters.activeCurrencies.join(','),
      collections: filters.activeCollections.map((el) => el.id).join(','),
    },
    true,
  );

  const likeAction = useCallback(
    (id): Promise<any> => {
      if (!user.address) {
        return Promise.reject(new Error('Please login'));
      }
      return userApi.like({ id });
    },
    [user.address],
  );
  const filtersRef = useRef<TNullable<HTMLDivElement>>(null);
  const anchorRef = useInfiniteScroll(filters.page, allPages, filters.handlePage, isNftsLoading);

  return (
    <div className={styles.discover}>
      <div className={cx(styles.filterAndCards, { [styles.open]: isFilterOpen })}>
        <div className={styles.stickyWrapper}>
          <div ref={filtersRef} className={styles.sticky}>
            <DiscoverFilters
              isFilterOpen={isFilterOpen}
              setFilterOpen={setFilterOpen}
              filters={filters}
            />
          </div>
        </div>
        <div
          className={cx(styles.filterResultsContainer, {
            [styles.withFilter]: isFilterOpen,
          })}
        >
          <>
            <div className={styles.header}>
              <Text className={styles.total} tag="span" weight="bold" size="xl">
                {totalItems} results
              </Text>
              <Select
                className={styles.selectArea}
                onChange={filters.setSortBy as any}
                value={filters.sortBy}
                options={filters.sortByFilters}
                classNameSelect={styles.select}
              />
              <div className={styles.toogle_cards}>
                <button
                  type="button"
                  onClick={() => setIsSmallCards(false)}
                  className={cx(styles.toogle_item, { [styles.active]: !isSmallCards })}
                >
                  <FourSquares />
                </button>
                <button
                  type="button"
                  onClick={() => setIsSmallCards(true)}
                  className={cx(styles.toogle_item, { [styles.active]: isSmallCards })}
                >
                  <NineSquares />
                </button>
              </div>
            </div>
            <Labels filters={filters} />
            <div className={styles.filterResults}>
              <div className={cx(styles.cards, { [styles.small]: isSmallCards })}>
                {isNftsLoading && nftCards.length === 0 ? (
                  <>
                    <ArtCardSkeleton />
                    <ArtCardSkeleton />
                    <ArtCardSkeleton />
                    <ArtCardSkeleton />
                    <ArtCardSkeleton />
                    <ArtCardSkeleton />
                    <ArtCardSkeleton />
                    <ArtCardSkeleton />
                    <ArtCardSkeleton />
                  </>
                ) : (
                  nftCards.map((artCard: any) => {
                    if (isNftsLoading && filters.page === 1) {
                      return <ArtCardSkeleton />;
                    }
                    const {
                      media,
                      name,
                      price,
                      currency,
                      available,
                      creator,
                      like_count,
                      tags,
                      id,
                      highest_bid,
                      minimal_bid,
                      bids,
                      is_liked,
                    } = artCard;
                    return (
                      <ArtCard
                        artId={id}
                        key={`${id}-${like_count}-${highest_bid}-${name}-${price}-${currency}-${creator}`}
                        imageMain={media}
                        name={name}
                        price={
                          price || (highest_bid && toFixed(highest_bid.amount, 3)) || minimal_bid
                        }
                        asset={currency?.symbol.toUpperCase()}
                        inStockNumber={available}
                        author={creator.name}
                        authorAvatar={creator.avatar}
                        authorId={creator.id}
                        likesNumber={like_count}
                        tags={tags}
                        bids={bids}
                        isLiked={is_liked}
                        likeAction={likeAction}
                      />
                    );
                  })
                )}
                {isNftsLoading && filters.page >= 2 && (
                  <>
                    <ArtCardSkeleton />
                    <ArtCardSkeleton />
                    <ArtCardSkeleton />
                  </>
                )}
              </div>
            </div>
          </>
        </div>
      </div>
      <div ref={anchorRef as RefObject<HTMLDivElement>} />
      {/* <LiveAuction className={styles.liveAuction} /> */}
    </div>
  );
});

export default Discover;
