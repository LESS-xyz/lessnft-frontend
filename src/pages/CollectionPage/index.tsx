import { RefObject, useCallback, useRef, useState } from 'react';
import { useParams } from 'react-router';
import cx from 'classnames';

import CollectionMainInfo from './CollectionMainInfo/index';

import { ArtCard, DiscoverFilters, Text, Select, ArtCardSkeleton } from 'components';

import s from './CollectionPage.module.scss';
import styles from '../Discover/styles.module.scss';

import { folders, art, FourSquares, NineSquares } from 'assets/img';
import { useFetchCollection, useFetchNft, useInfiniteScroll, useNewFilters, useTabs } from 'hooks';
import { useLocation } from 'react-router-dom';
import { useMst } from 'store';
import { userApi } from 'services';
import { observer } from 'mobx-react';
import { TNullable } from 'typings';
import Labels from 'pages/Discover/components/Labels';
import { toFixed } from 'utils';

const tabs = [
  {
    title: 'On sale',
    key: 'sale',
    icon: art,
  },
  {
    title: 'Collectibles',
    key: 'collectibles',
    icon: folders,
  },
];

const CollectionPage: React.FC = observer(() => {
  const { user } = useMst();
  const initialTab = useLocation().search?.replace('?tab=', '') || '';
  const { activeTab } = useTabs(tabs, initialTab);
  const [page] = useState(1);
  const [, setIsLoading] = useState(false);
  const { collectionId } = useParams<{ collectionId: string }>();
  const [isFilterOpen, setFilterOpen] = useState(window.innerWidth >= 780);
  const [isSmallCards, setIsSmallCards] = useState(window.innerWidth >= 780);

  const { collection } = useFetchCollection(setIsLoading, page, collectionId, activeTab);

  const pageTop = useRef<TNullable<HTMLDivElement>>(null);
  const filters = useNewFilters({ elementToScroll: pageTop });

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
      collections: collectionId,
      properties: filters.activePerks,
      rankings: filters.activeRankings,
      stats: filters.activeStats,
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

  const anchorRef = useInfiniteScroll(filters.page, allPages, filters.handlePage, isNftsLoading);
  const filtersRef = useRef<TNullable<HTMLDivElement>>(null);

  return (
    <section className={s.page}>
      <div className={s.page_user}>
        <CollectionMainInfo
          cover={collection.cover}
          avatar={collection.avatar}
          name={collection.name}
          description={collection.description}
          creator={collection.creator.id}
          creatorName={collection.creator.display_name || collection.creator.id}
          id={collection.id}
          owners={collection.owners}
          tokens_count={collection.tokens_count}
          volume_traded={collection.volume_traded}
          floor_price={collection.floor_price}
        />
      </div>

      <div ref={pageTop} className={cx(styles.discover, s.discoverFilters)}>
        <div className={cx(styles.filterAndCards, { [styles.open]: isFilterOpen })}>
          <div className={styles.stickyWrapper}>
            <div ref={filtersRef} className={styles.sticky}>
              <DiscoverFilters
                isFilterOpen={isFilterOpen}
                setFilterOpen={setFilterOpen}
                filters={filters}
                config={{
                  needCollections: false,
                  needChains: false,
                  properties: collection.properties,
                  rankings: collection.rankings,
                  stats: collection.stats,
                }}
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
                    </>
                  ) : (
                    nftCards.map((artCard: any) => {
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
                      if (isNftsLoading && filters.page === 1) {
                        return (
                          <ArtCardSkeleton
                            key={`${id}-${like_count}-${highest_bid}-${name}-${price}-${currency}-${creator}`}
                          />
                        );
                      }
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
      </div>
    </section>
  );
});

export default CollectionPage;
