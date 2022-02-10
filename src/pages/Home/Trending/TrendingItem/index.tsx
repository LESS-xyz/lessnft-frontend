import { Text } from 'components';
import { FC } from 'react';
import { sliceString } from 'utils';
import styles from './styles.module.scss';

interface IProps {
  avatar: string;
  creatorAvatar: string;
  creatorName: string;
  name: string;
  description: string;
}

const TrendingItem: FC<IProps> = ({ avatar, creatorAvatar, creatorName, name, description }) => {
  return (
    <div className={styles.trading}>
      <div className={styles.avatarWrapper}>
        <img src={avatar} className={styles.avatar} alt="avatar" />
      </div>
      <div className={styles.creatorWrapper}>
        <img src={creatorAvatar} className={styles.creatorAvatar} alt="creator" />
      </div>
      <div className={styles.info}>
        <Text className={styles.name} weight="bold" size="xl">
          {name}
        </Text>
        <Text className={styles.creatorName} size="xl">
          By{' '}
          <Text tag="span" size="xl" color="primary">
            {sliceString(creatorName, 10, 0)}
          </Text>
        </Text>
        <Text className={styles.description} color="lightGray">
          {description
            ? sliceString(description, 80, 0)
            : `Explore the ${sliceString(creatorName, 10, 0)} collection`}
        </Text>
      </div>
    </div>
  );
};
export default TrendingItem;
