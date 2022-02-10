import { FC } from 'react';
import cx from 'classnames';
import { Table, Text } from 'components';

import styles from './styles.module.scss';
import { ICurrency } from 'typings';

type Props = {
  columns: any[];
  tableData: any[];
  className?: string;
  currency: ICurrency;
};

const TradingHistory: FC<Props> = ({ columns, tableData, className, currency }) => (
  <div className={cx(styles.history, className)}>
    <Text size="l" className={styles.soldOut}>
      {tableData.length} items sold
    </Text>
    <div className={styles.tableWrapper}>
      <Table currency={currency} columns={columns} data={tableData} />
    </div>
  </div>
);

export default TradingHistory;
