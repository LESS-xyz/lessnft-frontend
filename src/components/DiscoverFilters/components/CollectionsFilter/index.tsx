import { useFetchNft, useNewFilters } from 'hooks';
import { useCallback, useState, VFC } from 'react';

import GroupWrapper from '../GroupWrapper';
import cn from 'classnames';

import styles from './CollectionsFilter.module.scss';

import { checkMark } from 'assets/img';
import { ICollection } from 'hooks/useNewFilters';

interface IProps {
  activeCollections: Array<ICollection>;
  setActiveCollections: React.Dispatch<React.SetStateAction<ICollection[]>>;
}

const CollectionsFilter: VFC<IProps> = ({ activeCollections, setActiveCollections }) => {
  const [isOpened, setIsOpened] = useState(true);

  const filters = useNewFilters();
  const [, , collections] = useFetchNft({
    page: filters.page,
    type: 'collections',
    text: '',
  });

  const handleToogleCollection = useCallback(
    (collection: ICollection) => {
      if (activeCollections.includes(collection)) {
        setActiveCollections((prev) => prev.filter((el) => el.name !== collection.name));
      } else {
        setActiveCollections((prev) => [...prev, collection]);
      }
    },
    [activeCollections, setActiveCollections],
  );

  return (
    <GroupWrapper
      isOpened={isOpened}
      setIsOpened={() => setIsOpened(!isOpened)}
      title="Collections"
    >
      <div className={styles.content}>
        {collections
          .filter((col: any) => !col.is_default)
          .map((collection: any) => {
            const isCollectionActive = activeCollections.some((col) => col.id === collection.id);
            return (
              <button
                onClick={() => handleToogleCollection(collection)}
                className={cn(styles.collection, { [styles.active]: isCollectionActive })}
                key={collection.id}
                type="button"
              >
                <div className={styles.collection_ava}>
                  <img src={isCollectionActive ? checkMark : collection.avatar} alt="" />
                </div>
                <div className={styles.collection_name}>{collection.name}</div>
              </button>
            );
          })}
      </div>
    </GroupWrapper>
  );
};

export default CollectionsFilter;
