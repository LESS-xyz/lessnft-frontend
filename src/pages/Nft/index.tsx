/* eslint-disable */
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { routes } from 'appConstants';
import cx from 'classnames';
import { ArtCard, Control, GiantCard, H3, Text } from 'components';
// import { LoadMore } from 'containers';
import GridLayer, { EGridJustify } from 'containers/GridLayer';
import { useFetchRelated } from 'hooks';
import { observer } from 'mobx-react-lite';
import { storeApi } from 'services/api';
import { useMst } from 'store';
import { ICurrency, INft, TNullable } from 'typings';

import styles from './styles.module.scss';
import PropertiesSection from './PropertiesSection';
import LevelsSection from './LevelsSection';
import StatsSection from './StatsSection';
import TradingHistorySection from './TradingHistorySection';
import PriceHistorySection from './PriceHistorySection';

const breadcrumbs = [
  {
    title: 'Discover',
    url: routes.discover.root,
  },
  {
    title: 'Artwork Details',
  },
];

type Props = {
  className?: string;
};

const DetailArtwork: FC<Props> = observer(({ className }) => {
  const {
    modals: { sell, remove },
  } = useMst();
  const history = useHistory();

  const { id } = useParams<{ id: string }>();

  const [nft, setNft] = useState<TNullable<INft>>(null);
  const [isFetching, setIsFetching] = useState<boolean>(true);

  // const { page, handleLoadMore } = useLoadMore(1);

  const wrapRef = useRef<HTMLDivElement>(null);

  const [nftCards] = useFetchRelated(id);

  const getItem = React.useCallback(() => {
    setIsFetching(true);
    storeApi
      .getToken(id)
      .then(({ data }) => setNft(data))
      .catch((err) => {
        history.push('/');
        console.error(err);
      })
      .finally(() => setIsFetching(false));
  }, [id, history, setIsFetching]);

  useEffect(() => getItem(), [getItem]);

  useEffect(() => {
    if (
      sell.checkout.isSuccess ||
      sell.placeBid.isSuccess ||
      remove.isSuccess ||
      sell.putOnSale.isSuccess
    ) {
      getItem();
    }
  }, [
    sell.checkout.isSuccess,
    sell.placeBid.isSuccess,
    getItem,
    remove.isSuccess,
    sell.putOnSale.isSuccess,
  ]);

  const isNftHasStats = useMemo(() => {
    if (nft?.stats && nft.stats.length > 0) return true;
    return false;
  }, [nft]);

  const isNftHasLevels = useMemo(() => {
    if (nft?.rankings && nft.rankings.length > 0) return true;
    return false;
  }, [nft]);

  const isNftHasProperties = useMemo(() => {
    return Object.keys(nft?.properties || {}).length > 0;
  }, [nft]);

  return (
    <div className={cx(styles.detailArtwork, className)}>
      <div className={styles.detailArtworkContent}>
        <Control item={breadcrumbs} />
        <GiantCard name={nft?.name || ''} isFetching={isFetching} nft={nft} onUpdateNft={getItem} />
        <div
          className={cx(styles.properties, {
            [styles.onlyHistory]: !isNftHasLevels && !isNftHasProperties && !isNftHasStats,
          })}
        >
          <div className={styles.propsSections}>
            {isNftHasProperties && <PropertiesSection properties={nft?.properties || {}} />}
            {isNftHasLevels && <LevelsSection levels={nft?.rankings || []} />}
            {isNftHasStats && <StatsSection stats={nft?.stats || []} />}
          </div>
          <div className={styles.history}>
            <TradingHistorySection
              history={nft?.history || []}
              currency={nft?.currency as ICurrency}
            />
          </div>
        </div>
        <PriceHistorySection tokenId={id} currency={nft?.currency as ICurrency} />

        <div className={styles.relatedArtwork}>
          <H3>Related Artwork</H3>
          {Array.isArray(nftCards) && nftCards.length ? (
            <div ref={wrapRef} className={styles.artCardsWrapper}>
              <GridLayer
                gap={40}
                wrapperRef={wrapRef}
                minWidth={250}
                minHeight={350}
                justify={EGridJustify.start}
              >
                {nftCards
                  .filter((art) => art.id !== Number(id))
                  .map((art) => {
                    const {
                      id: artId,
                      media: image,
                      name,
                      price,
                      highest_bid,
                      minimal_bid,
                      available: inStockNumber,
                      creator: { name: author },
                      creator: { avatar: authorAvatar },
                      creator: { id: authorId },
                      tags,
                      like_count: likesNumber,
                      collection,
                      // currency: { symbol: asset = '' },
                    } = art;
                    const asset = art.currency?.symbol ?? '';
                    const artPrice =
                      price || (highest_bid && highest_bid.amount) || minimal_bid || 0;
                    return (
                      <ArtCard
                        type={collection?.display_theme}
                        key={`nft_card_${art.id}`}
                        className={styles.artCard}
                        artId={artId}
                        imageMain={image}
                        name={name}
                        price={artPrice}
                        asset={asset}
                        inStockNumber={inStockNumber}
                        author={author}
                        authorAvatar={authorAvatar}
                        authorId={authorId.toString()}
                        likesNumber={likesNumber}
                        tags={tags}
                      />
                    );
                  })}
              </GridLayer>
            </div>
          ) : (
            <Text size="xl" className={styles.noItems}>
              There are no artowrks in this collection yet
            </Text>
          )}
        </div>
      </div>
    </div>
  );
});

export default DetailArtwork;
