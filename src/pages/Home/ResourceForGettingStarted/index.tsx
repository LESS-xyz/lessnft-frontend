import { FC } from 'react';
import { Link } from 'react-router-dom';
import {
  resourceForGettingStarted1,
  resourceForGettingStarted2,
  resourceForGettingStarted3,
} from 'assets/img';
import cx from 'classnames';
import { H2, Text } from 'components';

import styles from './styles.module.scss';

type Props = {
  className?: string;
};

const heplerObject = [
  {
    description: '10 tips for avoiding scams and staying safe on the decentralized web',
    image: resourceForGettingStarted1,
  },
  {
    description: '10 tips for avoiding scams and staying safe on the decentralized web',
    image: resourceForGettingStarted2,
  },
  {
    description: '10 tips for avoiding scams and staying safe on the decentralized web',
    image: resourceForGettingStarted3,
  },
];

const ResourceForGettingStarted: FC<Props> = ({ className }) => (
  <div className={cx(styles.resourceForGettingStarted, className)}>
    <div className={styles.title}>
      <H2 align="center">Resources for getting started</H2>
    </div>
    <div className={styles.box}>
      {heplerObject.map(({ description, image }) => {
        return (
          <Link
            className={styles.resourcesBlock}
            to="https://google.com"
            key={`${description}-${image}`}
          >
            <div className={styles.resourcesImageWrapper}>
              <img className={styles.resourcesImage} src={image} alt={image} />
              <Text className={styles.resourcesText} weight="bold" size="m">
                {description}
              </Text>
            </div>
          </Link>
        );
      })}
    </div>
  </div>
);

export default ResourceForGettingStarted;
