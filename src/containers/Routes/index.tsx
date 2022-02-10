import { Redirect, Route, Switch } from 'react-router-dom';
import { routes } from 'appConstants';
import { GuardedRoute } from 'components';
import { observer } from 'mobx-react-lite';
import {
  Activity,
  CollectionPage,
  ComingSoon,
  ConnectWallet,
  CreateToken,
  Discover,
  Home,
  LostPage404,
  Nft,
  Profile,
  ProfileEdit,
  UploadVariants,
  TopNfts,
  CreateCollection,
} from 'pages';
import { useMst } from 'store';
import { Page } from 'containers';

const Routes = observer(() => {
  const { user } = useMst();

  return (
    <Switch>
      <Route path={routes.nft.root} render={() => <Page component={<Nft />} />} />
      <Route
        path={routes.discover.root}
        render={() => <Page needFooter={false} component={<Discover />} />}
      />
      <Route exact path={routes.profile.edit} render={() => <Page component={<ProfileEdit />} />} />
      <Route path={routes.profile.root} render={() => <Page component={<Profile />} />} />

      <Route exact path={routes.home.root} render={() => <Page component={<Home />} />} />
      <Route exact path={routes.activity.root} render={() => <Page component={<Activity />} />} />
      <Route
        path={routes.collection.root}
        render={() => <Page needFooter={false} component={<CollectionPage />} />}
      />
      <Route
        path={routes.connectWallet.root}
        render={() => <Page component={<ConnectWallet />} />}
      />
      <Route path={routes.topNfts.root} render={() => <Page component={<TopNfts />} />} />
      <Route path={routes.lostPage.root} render={() => <Page component={<LostPage404 />} />} />
      <Route path={routes.comingSoon.root} render={() => <Page component={<ComingSoon />} />} />
      {/* GUARDED ROUTES */}
      <GuardedRoute
        auth={user.isAuth}
        path={routes.create.single}
        render={() => <Page component={<CreateToken />} />}
      />
      <GuardedRoute
        auth={user.isAuth}
        path={routes.create.collection.multiple}
        render={() => <Page component={<CreateCollection isMultiple />} />}
      />
      <GuardedRoute
        auth={user.isAuth}
        path={routes.create.multiple}
        render={() => <Page component={<CreateToken isMultiple />} />}
      />
      <Route
        path={routes.create.collection.single}
        render={() => <Page component={<CreateCollection />} />}
      />
      <GuardedRoute
        auth={!!user.address}
        path={routes.create.root}
        render={() => <Page component={<UploadVariants />} />}
      />
      {/* GUARDED ROUTES */}
      <Redirect to={{ pathname: routes.lostPage.root }} />
    </Switch>
  );
});

export default Routes;
