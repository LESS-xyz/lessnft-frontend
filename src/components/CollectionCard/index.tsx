/* eslint-disable react/no-array-index-key */
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { routes } from 'appConstants';
import { profile_avatar_example, profile_page_bg_example } from 'assets/img';
import cx from 'classnames';
import { Text } from 'components';
import { observer } from 'mobx-react-lite';
import { useMst } from 'store';
import { numberFormatter, sliceString } from 'utils';

import styles from './styles.module.scss';

type Props = {
  collectionId: string | number;
  className?: string;
  imageMain: string;
  imageBanner?: string;
  name: string;
  itemsNumber?: number | string;
  author?: string;
  authorId?: string | number;
  description?: string;
};

const CollectionCard: FC<Props> = observer(
  ({
    collectionId,
    className,
    imageMain,
    imageBanner,
    name,
    itemsNumber,
    // author,
    authorId,
    description = '',
  }) => {
    const { user } = useMst();
    const creator = authorId || user.id;

    return (
      <Link to={routes.collection.link(collectionId)}>
        <div className={cx(styles.collectionCard, className)}>
          <div className={styles.imageWrapper}>
            <img
              className={styles.imageBanner}
              src={imageBanner || profile_page_bg_example}
              alt=""
            />
          </div>

          <img className={styles.imageMain} src={imageMain || profile_avatar_example} alt="" />
          <div className={styles.collectionCardInfo}>
            <Text size="xl" weight="bold" className={styles.name}>
              {sliceString(name, 20, 0)}
            </Text>
            <Text className={styles.user}>
              by{' '}
              <Link to={routes.profile.link(creator)} className={styles.userLink}>
                {+user.id === +creator ? 'you' : creator}
              </Link>
            </Text>
            <Text className={styles.description} color="lightGray">
              {description || `Explore the ${sliceString(name, 20, 0)} collection`}
            </Text>
            <Text className={styles.number} color="lightGray">
              {numberFormatter(+(itemsNumber || 0), 10)} items
            </Text>
          </div>
        </div>
      </Link>
    );
  },
);

export default CollectionCard;
