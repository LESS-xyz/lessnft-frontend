import { VFC } from 'react';

import { Skeleton } from 'components';

import s from '../styles.module.scss';

const ArtCardSkeleton: VFC = () => {
  return (
    <div style={{ minHeight: '350px', overflow: 'hidden' }} className={s.artCard}>
      <Skeleton />
    </div>
  );
};

export default ArtCardSkeleton;
