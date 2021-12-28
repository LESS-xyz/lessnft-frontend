import { useFetchNft, useNewFilters } from 'hooks';
import { useCallback, useState, VFC } from 'react';

import GroupWrapper from '../GroupWrapper';
import cn from 'classnames';

import styles from './CollectionsFilter.module.scss';

import { checkMark } from 'assets/img';

interface IProps {
  activeCollections: Array<string>;
  setActiveCollections: React.Dispatch<React.SetStateAction<string[]>>;
}

const CollectionsFilter: VFC<IProps> = ({ activeCollections, setActiveCollections }) => {
  const [isOpened, setisOpened] = useState(true);

  const filters = useNewFilters();
  // eslint-disable-next-line
  const [allPages, totalItems, nftCards] = useFetchNft({
    page: filters.page,
    type: 'collections',
    text: '',
  });

  const handleToogleCollection = useCallback(
    (tagName: string) => {
      if (activeCollections.includes(tagName)) {
        setActiveCollections((prev) => prev.filter((el) => el !== tagName));
      } else {
        setActiveCollections((prev) => [...prev, tagName]);
      }
    },
    [activeCollections, setActiveCollections],
  );

  return (
    <GroupWrapper isOpened={isOpened} setIsOpened={setisOpened} title="Collections">
      <div className={styles.content}>
        {nftCards
          .filter((col: any) => !col.is_default)
          .map((collection: any) => {
            const isCollectionActive = activeCollections.includes(collection.name);
            return (
              <button
                onClick={() => handleToogleCollection(collection.name)}
                className={cn(styles.collection, { [styles.active]: isCollectionActive })}
                key={collection.name}
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
