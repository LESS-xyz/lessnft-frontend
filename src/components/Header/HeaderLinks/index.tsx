import { FC, useMemo } from 'react';
import { useHistory } from 'react-router';
import { Link, useLocation } from 'react-router-dom';
import { routes } from 'appConstants';
import cx from 'classnames';
import { Button, Text } from 'components';
import { Popover } from 'containers';
import { usePopover, useWindowSize } from 'hooks';
import { observer } from 'mobx-react-lite';
import { useMst } from 'store';

import styles from './styles.module.scss';

interface IHeaderLinksProps {
  toggleMenu?: () => void;
  className?: string;
}

interface ITag {
  icon?: string;
  title?: string;
  label?: string;
  link?: string;
}

interface IHeaderNestedBodyProps {
  isLinks?: boolean;
  links?: ITag[];
  onClick: (url: string) => void;
}

const HeaderNestedBody: FC<IHeaderNestedBodyProps> = ({ isLinks = false, links, onClick }) => {
  const { closePopover } = usePopover();
  const handleTagClick = (title: string) => {
    closePopover();
    onClick(routes.discover.filter(title));
  };

  if (isLinks && links) {
    return (
      <>
        {links?.length !== 0 &&
          links?.map(({ label, link }) => (
            <Link className={styles.dropdownLink} key={label} to={link as string}>
              <Text color="black" size="m" weight="medium">
                {label}
              </Text>
            </Link>
          ))}
      </>
    );
  }
  return (
    <>
      {links?.length !== 0 &&
        links?.map((tag) => (
          <Button
            className={styles.dropdownLink}
            key={tag.title}
            color="transparent"
            icon={tag.icon}
            onClick={() => handleTagClick(tag.title as string)}
          >
            <Text color="black" size="m" weight="medium">
              {tag.title}
            </Text>
          </Button>
        ))}
    </>
  );
};

const HeaderLinks: FC<IHeaderLinksProps> = observer(({ className, toggleMenu }) => {
  const { user, nftTags } = useMst();
  const history = useHistory();
  const { width } = useWindowSize();

  const location = useLocation();

  const nav = useMemo(
    () => [
      {
        title: 'Explore',
        active: location.pathname.includes(routes.discover.root),
        disabled: false,
        isNested: width > 768,
        internalLinks: nftTags.getTags,
        url: width < 768 ? routes.discover.root : '',
      },

      {
        url: routes.activity.root,
        active: location.pathname.includes(routes.activity.root),
        title: 'Activity',
        isNested: false,
      },
      // {
      //   title: 'Resources',
      //   // active: location.pathname.includes(routes.discover.root),
      //   disabled: false,
      //   isNested: true,
      //   isLinks: true,
      //   internalLinks: resourcesHelperObject,
      // },
      {
        url: user.address ? routes.create.root : routes.connectWallet.root,
        active: location.pathname.includes(routes.create.root),
        title: 'Create',
        isNested: false,
      },
    ],
    [location.pathname, nftTags.getTags, user.address, width],
  );

  const handleMenuItemClick = (url: string) => {
    if (toggleMenu) {
      toggleMenu();
    }
    history.push(url);
  };

  return (
    <div className={cx(styles.headerNavigation, className)}>
      {nav.map(({ url, title, active, disabled, isNested, internalLinks }) => {
        if (isNested && !disabled) {
          return (
            <Popover position="center" key={title}>
              <Popover.Button className={`${styles.linkBtn} ${active && styles.active}`}>
                <Text className={styles.linkTitle} size="m" color={active ? 'purple' : 'black'}>
                  {title}
                </Text>
              </Popover.Button>
              <Popover.Body>
                <HeaderNestedBody
                  links={internalLinks}
                  // isLinks={isLinks}
                  onClick={handleMenuItemClick}
                />
              </Popover.Body>
            </Popover>
          );
        }
        if (url && !disabled) {
          return (
            <Button
              padding="0"
              key={title}
              color="transparent"
              onClick={() => handleMenuItemClick(url)}
              className={`${styles.linkBtn} ${active && styles.active}`}
            >
              <Text weight="medium" size="m" color={active ? 'purple' : 'black'}>
                {title}
              </Text>
            </Button>
          );
        }
        return null;
      })}
    </div>
  );
});

export default HeaderLinks;
