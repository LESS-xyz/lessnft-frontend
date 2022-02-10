import { FC, RefObject } from 'react';
import { ArtCard } from 'components';
import { useInfiniteScroll } from 'hooks';
import { INft, OptionType } from 'typings';
// import { toFixed } from 'utils';

import TabHeader from '../TabHeader';

import s from '../Tabs.module.scss';
import { toFixed } from 'utils';

interface IProps {
  likeAction: (id: string | number) => Promise<any>;
  page: number;
  allPages: number;
  handlePage: (value: number) => void;
  isNftsLoading: boolean;
  totalItems: number;
  orderByFilter: OptionType;
  handleOrderByFilter: (value: OptionType) => void;
  nftCards: INft[];
}

const Artworks: FC<IProps> = ({
  likeAction,
  page,
  allPages,
  handlePage,
  isNftsLoading,
  totalItems,
  orderByFilter,
  handleOrderByFilter,
  nftCards,
}) => {
  const anchorRef = useInfiniteScroll(page, allPages, handlePage, isNftsLoading);

  return (
    <>
      <TabHeader
        title={`${totalItems} artwork${totalItems !== 1 ? 's' : ''}`}
        orderByFilter={orderByFilter}
        handleOrderByFilter={handleOrderByFilter}
      />

      <div className={s.tab}>
        {nftCards.map((artCard: any) => {
          const artPrice =
            artCard.price ||
            (artCard.highest_bid && toFixed(artCard.highest_bid.amount, 3)) ||
            artCard.minimal_bid;
          return (
            <ArtCard
              type={artCard?.collection?.display_theme}
              artId={artCard?.id}
              key={artCard?.id}
              imageMain={artCard?.media}
              name={artCard?.name}
              price={artPrice}
              asset={artCard?.currency?.symbol?.toUpperCase() ?? ''}
              inStockNumber={artCard?.available}
              author={artCard?.creator?.name}
              authorAvatar={artCard?.creator?.avatar}
              authorId={artCard?.creator?.id}
              likesNumber={artCard?.like_count}
              tags={artCard?.tags}
              bids={artCard?.bids}
              isLiked={artCard?.is_liked}
              likeAction={likeAction}
            />
          );
        })}
      </div>
      <div ref={anchorRef as RefObject<HTMLDivElement>} />
    </>
  );
};
export default Artworks;
