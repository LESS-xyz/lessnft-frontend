import { FC, useCallback, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { useLocation } from 'react-router-dom';
import { routes } from 'appConstants';
import { Art, Folders, Heart, List, Me, OffersMade, OffersReceived } from 'assets/img';
import cn from 'classnames';
import { Loader, TabLookingComponent, Text } from 'components';
import { useFetchLiked, useFetchNft, useNewFilters, useTabs } from 'hooks';
import { observer } from 'mobx-react';
import { userApi } from 'services';
import { useMst } from 'store';
import { IExtendedInfo } from 'typings';

import { About, Artworks, Collections, Favorited } from './Tabs';
import UserMainInfo from './UserMainInfo';

import s from './ProfilePage.module.scss';

const ProfilePage: FC = observer(() => {
  const { user } = useMst();
  const { userId } = useParams<{ userId: string }>();
  const initialTab = useLocation().search?.replace('?tab=', '') || '';
  const [currentUser, setCurrentUser] = useState<IExtendedInfo>({} as IExtendedInfo);

  const tabs = useMemo(
    () => [
      {
        title: 'Created',
        key: 'created',
        icon: <Art />,
        url: routes.profile.link(userId, 'created'),
      },
      {
        title: 'Owned',
        key: 'owned',
        icon: <List />,
        url: routes.profile.link(userId, 'owned'),
      },
      {
        title: 'Favorited',
        key: 'favorited',
        icon: <Heart />,
        url: routes.profile.link(userId, 'favorited'),
      },
      {
        title: 'My collections',
        key: 'collections',
        icon: <Folders />,
        url: routes.profile.link(userId, 'collections'),
      },
      {
        title: 'About Me',
        key: 'about',
        icon: <Me />,
        url: routes.profile.link(userId, 'about'),
      },
      {
        title: 'Offers received',
        key: 'received',
        icon: <OffersReceived />,
        url: routes.profile.link(userId, 'received'),
      },
      {
        title: 'Offers made',
        key: 'made',
        icon: <OffersMade />,
        url: routes.profile.link(userId, 'made'),
      },
    ],
    [userId],
  );

  const { activeTab, setActiveTab } = useTabs(tabs, initialTab);

  const creatorOrOwnerOrBids = useMemo(() => {
    switch (activeTab) {
      case 'created':
      case 'collections':
        return 'creator';
      case 'owned':
      case 'received':
        return 'owner';
      case 'made':
        return 'bids_by';
      default:
        return '';
    }
  }, [activeTab]);

  const { sortBy, page, handlePage, setSortBy } = useNewFilters();

  const [allPages, totalItems, nftCards, isNftsLoading] = useFetchNft(
    {
      page,
      type: activeTab === 'collections' ? 'collections' : 'items',
      [creatorOrOwnerOrBids]: userId,
      order_by: sortBy.value,
      isOnlyForOwnerOrCreator: true,
      is_verified: 'All',
      has_bids: activeTab === 'received',
      network: localStorage.getItem('lessnft_nft_chainName') || undefined,
    },
    false,
    true,
  );

  const [allPagesLiked, totalItemsLiked, nftCardsLicked, isLickesLoading] = useFetchLiked({
    page,
    address: userId,
    isRefresh: activeTab === 'favorited',
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
    <section className={s.page}>
      <UserMainInfo userId={userId} setCurrentUser={setCurrentUser} />

      <div className={s.page_body}>
        <div className={s.page_body__left}>
          <Text tag="p" size="m" className={s.subtitle}>
            Menu
          </Text>
          <TabLookingComponent
            className={s.tabs}
            tabs={tabs}
            activeTab={activeTab}
            action={setActiveTab}
          />
        </div>

        {isNftsLoading && page === 1 ? (
          <Loader className={s.loader} />
        ) : (
          <div className={cn(s.page_body__right, activeTab === 'about' && s.page_body__about)}>
            {(activeTab === 'created' ||
              activeTab === 'owned' ||
              activeTab === 'received' ||
              activeTab === 'made') && (
              <Artworks
                likeAction={likeAction}
                page={page}
                allPages={allPages}
                handlePage={handlePage}
                isNftsLoading={isNftsLoading}
                totalItems={totalItems}
                orderByFilter={sortBy}
                handleOrderByFilter={setSortBy}
                nftCards={nftCards}
              />
            )}
            {activeTab === 'favorited' && (
              <Favorited
                page={page}
                handlePage={handlePage}
                likeAction={likeAction}
                allPages={allPagesLiked}
                isLickesLoading={isLickesLoading}
                totalItems={totalItemsLiked}
                nftCards={nftCardsLicked}
              />
            )}
            {activeTab === 'collections' && (
              <Collections
                page={page}
                allPages={allPages}
                handlePage={handlePage}
                isNftsLoading={isNftsLoading}
                // orderByFilter={orderByFilter}
                // handleOrderByFilter={handleOrderByFilter}
                nftCards={nftCards}
                authorId={userId}
              />
            )}
            {activeTab === 'about' && <About currentUser={currentUser} />}
          </div>
        )}
      </div>
    </section>
  );
});

export default ProfilePage;
