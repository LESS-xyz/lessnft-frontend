/* eslint-disable react/no-array-index-key */
import { FC, useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import { H2, Text } from 'components';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import SwiperCore, { Navigation, Pagination } from 'swiper';
import TrandingItem from './TrendingItem';

import 'swiper/swiper.scss';
import 'swiper/swiper.less';
import 'swiper/swiper-bundle.css';

import styles from './styles.module.scss';
import { useWindowSize } from 'hooks';
import TitleDropdown from './TitleDropdown';
import { observer } from 'mobx-react-lite';
import { iconAllNFTs } from 'assets/img';
import { useMst } from 'store';
import { storeApi } from 'services';
import { routes } from 'appConstants';

type Props = {
  className?: string;
};
const Trending: FC<Props> = observer(({ className }) => {
  const { nftTags } = useMst();
  const [title, setTitle] = useState<any>({ title: 'All NFTs', icon: iconAllNFTs });
  const [collections, setCollections] = useState<any[]>([]);
  const [numberOfSlide, setNumberOfSlide] = useState(3);
  const { width } = useWindowSize();
  const slidesToShow = (widthValue: number) => {
    if (widthValue < 1050) {
      return 1;
    }
    return 3;
  };

  SwiperCore.use([Navigation, Pagination]);

  useEffect(() => {
    setNumberOfSlide(slidesToShow(width));
  }, [width]);

  const fetcTrendingCollections = useCallback(() => {
    storeApi
      .getTrendingCollections(title.title === 'All NFTs' ? '' : title.title)
      .then(({ data }: any) => setCollections(data))
      .catch((err: any) => console.log('error', err));
  }, [title.title]);

  useEffect(() => {
    fetcTrendingCollections();
  }, [fetcTrendingCollections]);
  return (
    <div className={cx(styles.notableDrops, className)}>
      <H2 className={styles.title} align="center">
        Trending in{' '}
        {nftTags.tags.length && (
          <TitleDropdown value={title} setValue={setTitle} options={nftTags.tags} />
        )}
      </H2>
      {collections.length ? (
        <div className={cx(styles.drops, {[styles.row]: collections.length <= 2 })}>
          {collections.length > 2 ? (
            <Swiper
              spaceBetween={30}
              centeredSlides
              navigation
              pagination
              slidesPerView={numberOfSlide}
              loop
              className={styles.swiper}
            >
              {collections.map((collection) => {
                return (
                  <SwiperSlide key={collection.id}>
                    <Link to={routes.collection.link(collection.id)} className={styles.drop}>
                      <TrandingItem
                        avatar={collection.avatar}
                        creatorAvatar={collection.creator.avatar}
                        creatorName={collection.creator.name}
                        name={collection.name}
                        description={collection.description}
                      />
                    </Link>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          ) : (
            collections.map((collection) => {
              return (
                <Link
                  key={collection.id}
                  to={routes.collection.link(collection.id)}
                  className={cx(styles.drop, styles.dropDouble)}
                >
                  <TrandingItem
                    avatar={collection.avatar}
                    creatorAvatar={collection.creator.avatar}
                    creatorName={collection.creator.name}
                    name={collection.name}
                    description={collection.description}
                  />
                </Link>
              );
            })
          )}
        </div>
      ) : (
        <Text size="xl" align="center">
          There are no trending collections yet
        </Text>
      )}
    </div>
  );
});

export default Trending;
