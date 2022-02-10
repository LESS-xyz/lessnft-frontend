import { H3, Select, Text } from 'components';
import { OptionType, selectOptions } from 'typings';

import s from './TabHeader.module.scss';

interface IProps {
  headTitle?: string;
  title: string;
  handleOrderByFilter?: any;
  orderByFilter?: OptionType;
}

const TabHeader: React.FC<IProps> = ({
  headTitle = 'Artworks',
  title,
  handleOrderByFilter,
  orderByFilter,
}) => {
  return (
    <div className={s.tab_header}>
      <div className={s.page_body__top_col}>
        <H3 className={s.title}>{headTitle}</H3>
        <Text className={s.counter}>{title}</Text>
      </div>
      {orderByFilter && (
        <Select
          onChange={handleOrderByFilter as any}
          value={orderByFilter}
          options={selectOptions}
        />
      )}
    </div>
  );
};
export default TabHeader;
