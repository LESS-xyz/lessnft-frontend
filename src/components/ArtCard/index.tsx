/* eslint-disable react/no-array-index-key */
import { FC, useCallback, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { routes } from 'appConstants';
import { PinkHeart } from 'assets/img';
import cx from 'classnames';
import { ArtCardAuthor, Button, Tag, Text } from 'components';
import { IBidder } from 'typings';
import { numberFormatter, sliceString, toFixed } from 'utils';

import styles from './styles.module.scss';

type Props = {
  type?: 'Padded' | 'Contained' | 'Covered';
  artId: string | number;
  className?: string;
  imageMain: string;
  // imageSecondaryOne?: string;
  // imageSecondaryTwo?: string;
  // imageSecondaryThree?: string;
  // allArtNumber?: string | number;
  name: string;
  price: string | number;
  asset: string;
  inStockNumber?: number | string;
  author: string;
  authorAvatar: string;
  authorId: string;
  likesNumber?: number;
  tags?: any[];
  isCollection?: boolean;
  bids?: any[];
  isLiked?: boolean;
  likeAction?: (id: string | number) => Promise<any>;
};

const ArtCard: FC<Props> = ({
  type = 'Covered',
  artId,
  className,
  imageMain,
  // imageSecondaryOne,
  // imageSecondaryTwo,
  // imageSecondaryThree,
  // allArtNumber = '25',
  name,
  price,
  asset,
  inStockNumber,
  author,
  authorId,
  authorAvatar,
  likesNumber = 0,
  tags,
  isCollection,
  bids,
  isLiked = false,
  likeAction,
}) => {
  const [isLike, setIsLike] = useState(isLiked);
  const [likesCount, setLikesCount] = useState(likesNumber || (isLiked ? 1 : 0));

  const wrapRef = useRef<HTMLAnchorElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const offset = 2.5;

  const onMouseOver = useCallback(() => {
    if (wrapRef.current && imgRef.current) {
      const div = wrapRef.current;
      const img = imgRef.current;
      const mouseMoveEvent = (e: any) => {
        const moveX = 100 - ((e.offsetX - offset) / div.offsetWidth) * 100;
        const moveY = 100 - ((e.offsetY - offset) / div.offsetHeight) * 100;
        img.style.objectPosition = `${moveX}% ${moveY}%`;
      };
      div.addEventListener('mousemove', mouseMoveEvent);
      div.onmouseleave = function () {
        div.removeEventListener('mousemove', mouseMoveEvent);
        img.style.objectPosition = '50% 50%';
        div.onmouseleave = null;
      };
    }
  }, [imgRef, wrapRef]);

  const handleLike = useCallback(() => {
    if (!likeAction) {
      return;
    }
    // setIsLikePending(true);
    if (isLike) {
      likeAction(artId)
        .then(() => {
          // setLikesCount((prevValue) => prevValue - 1);
          setLikesCount(isLiked ? likesNumber - 1 : likesNumber);
          setIsLike(!isLike);
          toast.success('Dislike submitted');
        })
        .catch((error: any) => {
          console.error('Dislike error', error);
          toast.success('Dislike error');
        });
    } else {
      likeAction(artId)
        .then(() => {
          setLikesCount(isLiked ? likesNumber : likesNumber + 1);
          setIsLike(!isLike);
          toast.success('Like submitted');
        })
        .catch((error: any) => {
          console.error('Like error', error);
          toast.success('Like error');
        });
    }
  }, [artId, isLike, isLiked, likeAction, likesNumber]);

  return (
    <div className={cx(styles.artCard, className)}>
      <Link
        to={isCollection ? routes.collection.link(artId) : routes.nft.link(artId)}
        className={styles.imageWrapper}
        onMouseOver={onMouseOver}
        onFocus={() => {}}
        innerRef={wrapRef}
      >
        <div className={styles.tagContainer}>
          {tags?.map((tag, index) => (
            <Tag
              className={styles.tag}
              key={index}
              type={tag.type}
              auctionEndTime={tag.auctionEndTime}
              media={tag.icon}
              value={tag.title}
            />
          ))}
        </div>
        <img ref={imgRef} className={cx(styles.mainImage, styles[type])} src={imageMain} alt="" />
      </Link>
      <div className={styles.artCardInfo}>
        <Text size="xl">{sliceString(name, 20, 0)}</Text>
        <div className={styles.flexContainer}>
          {!isCollection && price && !!inStockNumber && (
            <Text className={styles.artCardPrice} size="m">
              {`${toFixed(price, 3)} ${asset}`}{' '}
              {bids?.length ? <span className={styles.bidText}>(Highest Bid)</span> : null}
            </Text>
          )}
          {!bids?.length && (
            <Text size="m">{inStockNumber ? `in stock: ${inStockNumber}` : 'Out of stock'}</Text>
          )}
        </div>
        <div className={cx(styles.flexContainer, styles.artCardAuthorContainer)}>
          <div className={styles.flexContainer}>
            {bids?.length ? (
              <>
                <div className={styles.bidder_avatars}>
                  {bids.map((bidder: IBidder, index: number) => {
                    return index < 3 ? (
                      <img
                        key={bidder.id}
                        className={styles.bidder_avatar}
                        src={bidder.bidder_avatar}
                        alt=""
                      />
                    ) : null;
                  })}
                </div>
                <Text className={styles.artCardAuthor}>{bids.length} people have bidded</Text>
              </>
            ) : (
              authorId && <ArtCardAuthor id={authorId} avatar={authorAvatar} name={author} />
            )}
          </div>
          {likeAction && (
            <div className={cx(styles.flexContainer, styles.artCardSmallLikes)}>
              <Button
                className={cx(styles.artCardHeart, { [styles.artCardHeartActive]: isLike })}
                onClick={handleLike}
                color="transparent"
                padding="0"
              >
                <PinkHeart />
              </Button>
              <Text>{numberFormatter(likesCount, 3)}</Text>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtCard;
