/* eslint-disable react/no-array-index-key */
import { FC, useMemo } from 'react';
import nextId from 'react-id-generator';
import { Link } from 'react-router-dom';
import { routes } from 'appConstants';
import { Collections, Disconnect, Favorite, ProfileUser, Settings } from 'assets/img';
import cn from 'classnames';
import { Loader, Text } from 'components';
import { Popover } from 'containers';
import { usePopover } from 'hooks';
import { observer } from 'mobx-react';
import { useWalletConnectorContext } from 'services';
import { useMst } from 'store';

import styles from './User.module.scss';

interface IUserProps {
  className?: string;
}

const UserBody: FC<{ user: any }> = ({ user }) => {
  const dropdownOptions = useMemo(
    () => [
      {
        title: 'Public profile',
        icon: <ProfileUser />,
        url: routes.profile.link(user.id, 'created'),
      },
      {
        title: 'My collections',
        icon: <Collections />,
        url: routes.profile.link(user.id, 'collections'),
      },
      {
        title: 'Favorites',
        icon: <Favorite />,
        url: routes.profile.link(user.id, 'favorited'),
      },
      {
        title: 'Settings',
        icon: <Settings />,
        url: routes.profile.edit,
      },
      {
        title: 'Disconnect',
        icon: <Disconnect />,
        url: '',
      },
    ],
    [user.id],
  );

  const { closePopover } = usePopover();
  const walletConnector = useWalletConnectorContext();
  return (
    <ul className={styles.menu}>
      {dropdownOptions.map((option, index) => {
        if (option.url?.startsWith('http')) {
          return (
            <a className={styles.item} href={option.url} rel="noopener noreferrer" key={index}>
              <div className={styles.icon}>{option.icon}</div>
              <div className={styles.text}>{option.title}</div>
            </a>
          );
        }
        return option.url !== '' ? (
          <Link
            className={styles.item}
            to={`${option.url}`}
            onClick={() => closePopover()}
            key={nextId()}
            replace
          >
            <div className={styles.icon}>{option.icon}</div>
            <Text className={styles.text} weight="medium" size="m">
              {option.title}
            </Text>
          </Link>
        ) : (
          <div
            tabIndex={0}
            className={styles.item}
            key={nextId()}
            onClick={() => walletConnector.disconnect()}
            role="button"
            onKeyDown={() => {}}
          >
            <div className={styles.icon}>{option.icon}</div>
            <Text className={styles.text} weight="medium" size="m">
              {option.title}
            </Text>
          </div>
        );
      })}
    </ul>
  );
};

const User: FC<IUserProps> = observer(({ className }) => {
  const { user } = useMst();
  return (
    <Popover className={cn(styles.user, className)}>
      <Popover.Button className={styles.popoverBtn}>
        {user.avatar ? <img src={user.avatar} alt="Avatar" /> : <Loader />}
      </Popover.Button>
      <Popover.Body className={styles.popoverBody}>
        <UserBody user={user} />
      </Popover.Body>
    </Popover>
  );
});

export default User;
