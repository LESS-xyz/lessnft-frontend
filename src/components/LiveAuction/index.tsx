import React, { useCallback, useEffect, useState } from 'react';
import cn from 'classnames';
import { ArtCard, Carousel, H3, Text } from 'components/index';
import { useGetSlideToShow } from 'hooks';
import { storeApi } from 'services';

import styles from './LiveAuction.module.scss';
import { IBidder, TNullable } from 'typings';

interface IProps {
  className?: string;
}

interface IHotBidShorted {
  id: string | number;
  image: string;
  name: string;
  price: string;
  highest_bid: TNullable<IBidder>;
  minimal_bid: string;
  asset: string;
  inStockNumber: string;
  author: string;
  authorAvatar: string;
  authorId: string;
  likesNumber: number;
  tags: string[];
  collection: any;
}

const LiveAuction: React.FC<IProps> = ({ className }) => {
  const numberOfSlide = useGetSlideToShow();
  const [auctions, setAuctions] = useState<IHotBidShorted[]>([]);
  const getHotBids = useCallback(() => {
    storeApi.getHotBids().then(({ data }) => {
      const formatedData = [...data].map((hotBid: any) => {
        const {
          id,
          media,
          name,
          price,
          highest_bid,
          minimal_bid,
          currency,
          available,
          creator,
          like_count,
          tags,
        } = hotBid;
        return {
          id,
          image: media,
          name,
          price: price || 0,
          highest_bid,
          minimal_bid,
          asset: currency.symbol,
          inStockNumber: available,
          author: creator?.name,
          authorAvatar: creator.avatar,
          authorId: creator.id,
          likesNumber: like_count,
          tags,
        } as IHotBidShorted;
      });

      setAuctions(formatedData);
    });
  }, []);

  useEffect(() => {
    getHotBids();
  }, [getHotBids]);
  return (
    <div className={cn(className, styles.liveAuction)}>
      <H3 className={styles.title}>Live Auction Today</H3>
      {auctions.length ? (
        <Carousel classNameProp={styles.cards} slidesToShow={numberOfSlide}>
          {auctions.map((artCard) => {
            const {
              id,
              image,
              name,
              price,
              highest_bid,
              minimal_bid,
              asset,
              inStockNumber,
              author,
              authorAvatar,
              authorId,
              likesNumber,
              tags,
              collection,
            } = artCard;
            return (
              <div className={styles.liveCard}>
                <ArtCard
                  type={collection?.display_theme}
                  artId={id}
                  key={id}
                  imageMain={image}
                  name={name}
                  price={price || (highest_bid && highest_bid.amount) || minimal_bid}
                  asset={asset}
                  inStockNumber={inStockNumber}
                  author={author}
                  authorAvatar={authorAvatar}
                  authorId={authorId}
                  likesNumber={likesNumber}
                  tags={tags}
                />
              </div>
            );
          })}
        </Carousel>
      ) : (
        <Text size="xl" className={styles.noItems}>
          There are no auctions
        </Text>
      )}
    </div>
  );
};

export default LiveAuction;
