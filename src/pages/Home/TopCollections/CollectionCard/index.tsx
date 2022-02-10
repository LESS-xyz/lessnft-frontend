import { FC } from 'react';
import styles from './styles.module.scss';
import { Avatar, EllipsisText, Text } from 'components';
import { iconChange } from 'assets/img';

interface IProps {
  index?: number;
  avatar: string;
  id: number;
  name: string;
  price: string;
  isVerified?: boolean;
  profitIncrease?: string | number;
}

const CollectionCard: FC<IProps> = ({
  index,
  avatar,
  id,
  name,
  price,
  isVerified = false,
  profitIncrease,
}) => {
  return (
    <li className={styles.collectionCard}>
      <Text color="secondary" weight="bold" size="m">
        {index}
      </Text>
      <Avatar
        avatar={avatar}
        id={id}
        isVerified={isVerified}
        isCollection
        size={56}
        badgeSize={16}
        className={styles.avatar}
      />
      <div className={styles.info}>
        <EllipsisText>
          <Text weight="bold" size="m">
            {name}
          </Text>
        </EllipsisText>
        <Text size="m" className={styles.price}>
          <img src={iconChange} alt="usd icon" />
          {price}
        </Text>
      </div>
      {profitIncrease && (
        <div className={styles.profitIncreaseWrapper}>
          <Text className={styles.profitIncreaseValue} size="m">
            {profitIncrease}%
          </Text>
        </div>
      )}
    </li>
  );
};
export default CollectionCard;
