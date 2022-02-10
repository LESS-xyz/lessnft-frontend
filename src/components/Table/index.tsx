/* eslint-disable no-confusing-arrow */
/* eslint-disable react/jsx-props-no-spreading */
import { FC } from 'react';
import { useTable } from 'react-table';
import { IHistoryItem, IHistoryOwner, TableProps } from 'typings';

import { TEventType } from './TradingHistoryCells/Event';
import {
  TradingHistoryBuyer,
  TradingHistoryEvent,
  TradingHistoryPrice,
} from './TradingHistoryCells';

import styles from './styles.module.scss';

const Table: FC<TableProps> = ({ columns, data }) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  });
  return (
    <table className={styles.table} {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th className={styles.th} {...column.getHeaderProps()}>
                {column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr className={styles.row} {...row.getRowProps()}>
              {row.cells.map((cell) => {
                const cellData: IHistoryItem = cell.row.original as IHistoryItem;
                const owner: IHistoryOwner = (cellData.new_owner ||
                  cellData.old_owner) as IHistoryOwner;

                switch (cell.column.Header) {
                  case 'Buyer': {
                    return (
                      <td className={styles.cell} {...cell.getCellProps()}>
                        <TradingHistoryBuyer
                          name={owner.display_name || owner.address}
                          owner={owner}
                          date={cellData.date}
                        />
                      </td>
                    );
                  }
                  case 'Price': {
                    return (
                      <td className={styles.cell} {...cell.getCellProps()}>
                        <TradingHistoryPrice
                          type={cellData.method as TEventType}
                          currency={cellData.currency}
                          amount={cellData.price as string | number}
                        />
                      </td>
                    );
                  }
                  default: {
                    return (
                      <td className={styles.cell} {...cell.getCellProps()}>
                        <TradingHistoryEvent type={cellData.method as any} />
                      </td>
                    );
                  }
                }
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;
