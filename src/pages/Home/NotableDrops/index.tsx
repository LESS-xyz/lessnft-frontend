import { FC, useCallback, useEffect, useState } from 'react';
import cx from 'classnames';
import { H2, Text } from 'components';
import NotableDrop from './NotableDrop';

import styles from './styles.module.scss';
import { storeApi } from 'services';
import { routes } from 'appConstants';

type Props = {
  className?: string;
};
const NotableDrops: FC<Props> = ({ className }) => {
  const [drops, setDrops] = useState<any[]>([]);

  const fetchNotableDrops = useCallback(() => {
    storeApi.getNotableDrops().then((dropsData) => {
      const { data } = dropsData;

      const finalDrops = data.map((el) => ({
        avatar: el.image,
        color: el.background_color || '#674df6',
        link: routes.collection.link(el.collection_id),
        description: el.description,
        name: el.name,
      }));
      setDrops(finalDrops);
    });
  }, []);

  useEffect(() => {
    fetchNotableDrops();
  }, [fetchNotableDrops]);
  return (
    <div className={cx(styles.notableDrops, className)}>
      <H2 className={styles.title} align="center">
        Notable Drops
      </H2>
      {drops.length ? (
        <div className={styles.drops}>
          {drops.map((drop) => {
            return (
              <div key={drop.name} className={styles.drop}>
                <NotableDrop
                  avatar={drop.avatar}
                  name={drop.name}
                  description={drop.description}
                  link={drop.link}
                  color={drop.color}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <Text size="xl" align='center' className={styles.noItems}>
          There are no notable drops
        </Text>
      )}
    </div>
  );
};

export default NotableDrops;
