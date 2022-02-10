import { useState, VFC } from 'react';

import { CollapsingSection, Text } from 'components';

import s from './StatsSection.module.scss';

import { IconStats } from 'assets/img';
import { INftStat } from 'typings';

interface IProps {
  stats: Array<INftStat>;
}

const StatsSection: VFC<IProps> = ({ stats }) => {
  const [isOpened, setIsOpened] = useState(false);

  return (
    <CollapsingSection isOpened={isOpened} setIsOpened={setIsOpened} icon={IconStats} title="Stats">
      {stats.map((stat) => (
        <div key={`${stat.value}-${stat.trait_type}-${stat.max_value}`} className={s.stat}>
          <Text tag="span" size="m" className={s.value}>
            {stat.trait_type}
          </Text>
          <Text tag="span" size="m" color="primary" className={s.fromTo}>
            {stat.value} of {stat.max_value}
          </Text>
        </div>
      ))}
    </CollapsingSection>
  );
};

export default StatsSection;
