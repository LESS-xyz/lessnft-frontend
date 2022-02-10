import { FC, useCallback } from 'react';
import cx from 'classnames';
import { observer } from 'mobx-react-lite';

import { userApi } from 'services';
import { useMst } from 'store';
import { ArtCard, H2 } from 'components';
import { useFetchNft, useLoadMore } from 'hooks';
import { LoadMore } from 'containers';

import styles from './styles.module.scss';

type Props = {
  className?: string;
};

const OurArtworkGallery: FC<Props> = observer(({ className }) => {
  const { user } = useMst();

  const { page, handleLoadMore } = useLoadMore(1);

  const [allPages, , nftCards, isLoading] = useFetchNft({
    page,
    type: 'items',
    on_sale: true,
  });

  const likeAction = useCallback(
    (id): Promise<any> => {
      if (!user.address) {
        return Promise.reject(new Error('Please login'));
      }
      return userApi.like({ id });
    },
    [user.address],
  );
  return (
    <div className={cx(styles.ourArtworkGallery, className)}>
      <div className={styles.title}>
        <H2>
          Our Artwork <span className={styles.gradientTitle}>Gallery</span>
        </H2>
      </div>
      <LoadMore
        itemsLength={nftCards.length}
        isLoading={isLoading}
        currentPage={page}
        allPages={allPages}
        handleLoadMore={handleLoadMore}
      >
        <div className={styles.artCardsWrapper}>
          {nftCards.map((artPiece: any) => {
            const {
              id,
              media,
              name,
              price,
              highest_bid,
              minimal_bid,
              currency,
              creator,
              like_count,
              available,
              tags,
              is_liked,
              collection,
            } = artPiece;
            return (
              <ArtCard
                type={collection?.display_theme}
                artId={id}
                key={name}
                imageMain={media}
                name={name}
                price={price || (highest_bid && highest_bid.amount) || minimal_bid}
                asset={currency.symbol.toUpperCase()}
                inStockNumber={available}
                author={creator.name}
                authorAvatar={creator.avatar}
                authorId={creator.id}
                likesNumber={like_count}
                tags={tags}
                likeAction={likeAction}
                isLiked={is_liked}
              />
            );
          })}
        </div>
      </LoadMore>
    </div>
  );
});

export default OurArtworkGallery;
