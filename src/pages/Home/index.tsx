import { FC } from 'react';
import { observer } from 'mobx-react';

import Banner from './Banner';
import CreateAndSell from './CreateAndSellNft';
import NotableDrops from './NotableDrops';
import TopCollections from './TopCollections';
import Trending from './Trending';
import ResourceForGettingStarted from './ResourceForGettingStarted';
import BrowseByCategory from './BrowseByCategory';

import styles from './Home.module.scss';
import { GradientBlock, LiveAuction } from 'components';

const Home: FC = observer(() => {
  return (
    <div className={styles.container}>
      <Banner />
      <NotableDrops />
      <TopCollections />
      <Trending />
      <GradientBlock color="orange" align="right" />
      <LiveAuction />
      <ResourceForGettingStarted />
      <BrowseByCategory />
      <GradientBlock color="purple" align="left" />
      <CreateAndSell />
    </div>
  );
});

export default Home;
