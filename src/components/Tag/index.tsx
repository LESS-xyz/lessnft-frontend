import { FC } from 'react';
import { burn, lighting } from 'assets/img';
import cx from 'classnames';
import { Text } from 'components';

import styles from './styles.module.scss';

type Props = {
  className?: string;
  type: 'rare' | 'featured' | 'auction';
  auctionEndTime?: string;
  media?: string;
  value?: string;
};

const helperObject = {
  rare: burn,
  featured: lighting,
  auction: '',
};

const Tag: FC<Props> = ({ className, type, auctionEndTime = '1:52:09', media, value }) => (
  <div
    className={cx(
      styles[type],
      styles.tag,
      className,
      styles[value?.split(' ').join('') || 'default'],
    )}
  >
    <img src={media || helperObject[type]} alt="" />
    <Text color="inherit" className={styles.tagText}>
      {type !== 'auction' ? value : `${auctionEndTime} left`}
    </Text>
  </div>
);

export default Tag;
