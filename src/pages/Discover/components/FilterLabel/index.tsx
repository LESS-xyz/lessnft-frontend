import { VFC } from 'react';

import { Text } from 'components';

import s from './FilterLabel.module.scss';

import { cross } from 'assets/img';

interface IProps {
  title: string;
  onClick: () => void;
  icon?: string;
}

const FilterLabel: VFC<IProps> = ({ title, onClick, icon }) => {
  return (
    <button className={s.label} onClick={onClick} type="button">
      {icon && <img className={s.icon} src={icon} alt="icon" />}
      <Text color="white" tag="span">
        {title}
      </Text>
      <div className={s.cross}>
        <img src={cross} alt="cross" />
      </div>
    </button>
  );
};

export default FilterLabel;
