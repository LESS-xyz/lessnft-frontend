import { useState, VFC } from 'react';

import { CollapsingSection } from 'components';
import Property from './Property';

import { IconProperties } from 'assets/img';

import s from './PropertiesSection.module.scss';
import { INftProperty } from 'typings';

interface IProps {
  properties: { [key: string]: INftProperty };
}

const PropertiesSection: VFC<IProps> = ({ properties }) => {
  const [isOpened, setIsOpened] = useState(false);

  return (
    <CollapsingSection
      isOpened={isOpened}
      setIsOpened={setIsOpened}
      icon={IconProperties}
      title="Properties"
    >
      <div className={s.properties}>
        {Object.keys(properties).map((propTitle: string) => (
          <Property
            key={propTitle}
            title={propTitle}
            chance={properties[propTitle].frequency}
            value={properties[propTitle].value}
          />
        ))}
      </div>
    </CollapsingSection>
  );
};

export default PropertiesSection;
