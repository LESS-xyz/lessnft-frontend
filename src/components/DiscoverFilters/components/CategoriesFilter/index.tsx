import { observer } from 'mobx-react-lite';
import { useState, VFC, useCallback } from 'react';
import { useMst } from 'store';

import GroupWrapper from '../GroupWrapper';

import styles from './CategoriesFilter.module.scss';

import { checkMark } from 'assets/img';

interface IProps {
  activeTags: Array<string>;
  setActiveTags: React.Dispatch<React.SetStateAction<string[]>>;
}

const CategoriesFilter: VFC<IProps> = observer(({ activeTags, setActiveTags }) => {
  const [isOpened, setIsOpened] = useState(false);
  const { nftTags } = useMst();

  const handleToogleTag = useCallback(
    (tagName: string) => {
      if (activeTags.includes(tagName)) {
        setActiveTags((prev) => prev.filter((el) => el !== tagName));
      } else {
        setActiveTags((prev) => [...prev, tagName]);
      }
    },
    [activeTags, setActiveTags],
  );

  return (
    <GroupWrapper isOpened={isOpened} setIsOpened={() => setIsOpened(!isOpened)} title="Categories">
      <div className={styles.content}>
        {nftTags.tags
          .filter((nftTag) => nftTag.title.toLowerCase() !== 'all nfts')
          .map((tag) => {
            const isTagActive = activeTags.includes(tag.title);
            return (
              <button
                key={tag.title}
                type="button"
                onClick={() => handleToogleTag(tag.title)}
                className={styles.tag}
              >
                <div className={styles.icon}>
                  <img src={isTagActive ? checkMark : tag.icon} alt="tag" />
                </div>
                <div className={styles.title}>{tag.title}</div>
              </button>
            );
          })}
      </div>
    </GroupWrapper>
  );
});

export default CategoriesFilter;
