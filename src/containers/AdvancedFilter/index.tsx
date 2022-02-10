import { FC, useEffect, useState } from 'react';
import { cross } from 'assets/img';
import cx from 'classnames';
import { Button, H3, RangePicker, Select, Text } from 'components';
import { IAppliedFilter, OptionType } from 'typings';

import FilterTag from './FilterTag';

import styles from './styles.module.scss';

const DEFAULT_FILTER_STATE = {
  type: 'items',
  order_by: '-created_at',
  tags: 'All NFTs',
  max_price: 0,
  currency: 'All',
  page: 1,
  is_verificated: 'All',
  text: '',
};

type TDefaultValues = typeof DEFAULT_FILTER_STATE;

const filterSelectArtistsOptions = [
  {
    value: 'verified',
    label: 'Verified Professionals',
  },
  {
    value: 'unverified',
    label: 'Beginners',
  },
  {
    value: 'All',
    label: 'All',
  },
];

type Props = {
  className?: string;
  isMobile?: boolean;
  filterSelectCurrencyOptions: any;
  maxPrice: number;
  maxPriceFilter: OptionType;
  handleMaxPriceFilter: (maxPrice: any) => void;
  currencyFilter: OptionType;
  handleCurrencyFilter: (value: any) => void;
  verifiedFilter: OptionType;
  handleVerifiedFilter: (value: any) => void;
  defaultValues: TDefaultValues;
  resetFilter: (key?: string) => void;
  textFilter: OptionType;
};

const AdvancedFilter: FC<Props> = ({
  isMobile,
  className,
  filterSelectCurrencyOptions,
  maxPrice,
  maxPriceFilter,
  handleMaxPriceFilter,
  currencyFilter,
  handleCurrencyFilter,
  verifiedFilter,
  handleVerifiedFilter,
  defaultValues,
  resetFilter,
  textFilter,
}) => {
  const [appliedFilters, setAppliedFilters] = useState<IAppliedFilter[]>([
    maxPriceFilter,
    currencyFilter,
    verifiedFilter,
    textFilter,
  ]);

  useEffect(() => {
    setAppliedFilters([currencyFilter, verifiedFilter, textFilter]);
  }, [currencyFilter, verifiedFilter, textFilter]);

  return (
    <div className={cx(styles.advancedFilter, { [styles.mobile]: isMobile }, className)}>
      {isMobile && (
        <div className={styles.advancedFilterFlex}>
          <H3 color="lightGray">Advanced Filter</H3>
          <Button color="outline" className={styles.advancedFilterCloseBtn}>
            <img src={cross} alt="" />
          </Button>
        </div>
      )}
      <div className={styles.advancedFilterApplied}>
        <Text size="m" color="lightGray">
          Applied Filters
        </Text>
        <Button padding="0" onClick={resetFilter} className={styles.clearBtn} color="transparent">
          <Text size="m" color="inherit">
            Clear all
          </Text>
        </Button>
      </div>
      <div className={styles.tagContainer}>
        {appliedFilters
          .filter((filter: IAppliedFilter) => !Object.values(defaultValues).includes(filter.value))
          .map((filter: IAppliedFilter) => (
            <FilterTag
              key={filter.value}
              className={styles.filterTag}
              label={filter.label.length > 10 ? `${filter.label.slice(0, 10)}...` : filter.label}
              closeTag={() => {
                resetFilter(filter.field);
              }}
            />
          ))}
      </div>
      <div>
        <Text size="m" color="gray" weight="medium" className={styles.label}>
          Price Range
        </Text>
        <RangePicker
          className={styles.rangeFilter}
          onChange={handleMaxPriceFilter}
          value={maxPriceFilter.value}
          currency={currencyFilter.value}
          min={0}
          max={maxPrice}
          step={maxPrice / 100}
          isDebounce
        />
      </div>
      <div>
        <Text size="m" color="gray" weight="medium" className={styles.label}>
          Currency
        </Text>
        <Select
          onChange={handleCurrencyFilter}
          value={currencyFilter}
          options={filterSelectCurrencyOptions}
        />
      </div>
      <div>
        <Text size="m" color="gray" weight="medium" className={styles.label}>
          Artists
        </Text>
        <Select
          onChange={handleVerifiedFilter}
          value={verifiedFilter}
          options={filterSelectArtistsOptions}
        />
      </div>
      {isMobile && (
        <>
          <Button isFullWidth>
            <Text color="black" weight="bold" size="m">
              Apply
            </Text>
          </Button>
          <Button isFullWidth color="outline">
            <Text color="white" weight="bold" size="m">
              Cancel
            </Text>
          </Button>
        </>
      )}
    </div>
  );
};

export default AdvancedFilter;
