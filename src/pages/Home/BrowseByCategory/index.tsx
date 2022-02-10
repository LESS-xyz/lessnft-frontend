import { FC } from 'react';
import cx from 'classnames';
import { H2, Text } from 'components';

import styles from './styles.module.scss';
import { useMst } from 'store';
import { observer } from 'mobx-react-lite';
import { useHistory } from 'react-router-dom';
import { routes } from 'appConstants';

type Props = {
  className?: string;
};

const BrowseByCategory: FC<Props> = observer(({ className }) => {
  const { nftTags } = useMst();
  const history = useHistory();
  const handleTagClick = (title: string) => {
    history.push(routes.discover.filter(title === 'All NFTs' ? '' : title));
  };
  return (
    <div className={cx(styles.browseByCategory, className)}>
      <div className={styles.title}>
        <H2 align="center">Browse by category</H2>
      </div>
      <div className={styles.box}>
        {nftTags.tags.length ? (
          nftTags.tags.map((tag: any) => (
            <div
              tabIndex={0}
              role="button"
              className={styles.tag}
              onKeyDown={() => {}}
              onClick={() => handleTagClick(tag.title)}
            >
              <img alt="category" className={styles.image} src={tag.image} />
              <Text className={styles.text} weight="bold">
                {tag.title}
              </Text>
            </div>
          ))
        ) : (
          <></>
        )}
      </div>
    </div>
  );
});

export default BrowseByCategory;
