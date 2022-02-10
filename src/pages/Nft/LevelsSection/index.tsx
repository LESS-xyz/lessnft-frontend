import { useState, VFC } from 'react';

import { CollapsingSection, Text } from 'components';

import { IconLevels } from 'assets/img';

import s from './LevelsSection.module.scss';
import { INftStat } from 'typings';

interface IProps {
  levels: Array<INftStat>;
}

const LevelsSection: VFC<IProps> = ({ levels }) => {
  const [isOpened, setIsOpened] = useState(false);

  return (
    <CollapsingSection
      isOpened={isOpened}
      setIsOpened={setIsOpened}
      icon={IconLevels}
      title="Rankings"
    >
      {levels.map((stat) => (
        <div key={`${stat.value}-${stat.trait_type}-${stat.max_value}`} className={s.level}>
          <div className={s.stat}>
            <Text tag="span" size="m" className={s.value}>
              {stat.trait_type}
            </Text>
            <Text tag="span" size="m" color="primary" className={s.fromTo}>
              {stat.value} of {stat.max_value}
            </Text>
          </div>
          <div className={s.bar}>
            <div
              className={s.bar_line}
              style={{ width: `${(+stat.value / +stat.max_value) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </CollapsingSection>
  );
};

export default LevelsSection;
