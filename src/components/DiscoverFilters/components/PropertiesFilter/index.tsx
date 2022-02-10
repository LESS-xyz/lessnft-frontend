import { IProperties } from 'hooks';
import { useCallback, useState, VFC } from 'react';

import GroupWrapper from '../GroupWrapper';
import Property from './Property';

import { iconWeight } from 'assets/img';

export interface IPropertiesToBackend {
  [key: string]: Array<string>;
}
interface IProps {
  activePerks: string;
  setActivePerks: React.Dispatch<React.SetStateAction<string>>;
  properties: IProperties;
}

const PropertiesFilter: VFC<IProps> = ({ setActivePerks, properties, activePerks }) => {
  const [activeProperties, setActiveProperties] = useState<Array<string>>([]);

  const handleToogleProperty = useCallback(
    (name: string) => {
      if (activeProperties.includes(name)) {
        setActiveProperties((prev) => prev.filter((prop) => prop !== name));
      } else {
        setActiveProperties((prev) => [...prev, name]);
      }
    },
    [activeProperties],
  );

  return (
    <>
      {Object.keys(properties).map((propertyName) => (
        <GroupWrapper
          key={propertyName}
          isOpened={activeProperties.includes(propertyName)}
          setIsOpened={() => handleToogleProperty(propertyName)}
          title={propertyName}
          icon={iconWeight}
        >
          <Property
            propertiesToBacknend={JSON.parse(activePerks)}
            setPropertiesToBackend={setActivePerks}
            propertyName={propertyName}
            activePerks={activePerks}
            properties={properties[propertyName]}
          />
        </GroupWrapper>
      ))}
    </>
  );
};

export default PropertiesFilter;
