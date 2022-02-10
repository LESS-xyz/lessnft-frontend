import { useCallback, useMemo, useState, VFC } from 'react';

import GroupWrapper from '../GroupWrapper';
import { TextInput, Button, Text } from 'components';

import styles from './PriceFilter.module.scss';

import { iconChange } from 'assets/img';

interface IProps {
  setMinPrice: React.Dispatch<React.SetStateAction<string>>;
  setMaxPrice: React.Dispatch<React.SetStateAction<string>>;
  minPrice: string;
  maxPrice: string;
}

const PriceFilter: VFC<IProps> = ({ setMinPrice, setMaxPrice, minPrice, maxPrice }) => {
  const [isOpened, setIsOpened] = useState(true);

  const [min, setMin] = useState(minPrice);
  const [max, setMax] = useState(maxPrice);

  const isError = useMemo(() => min && max && +min >= +max, [min, max]);
  const isDisabled = useMemo(
    () => (min && max && +min >= +max) || (min === '' && max === ''),
    [min, max],
  );

  const handleApply = useCallback(
    (minValue: string, maxValue: string) => {
      setMaxPrice(maxValue);
      setMinPrice(minValue);
    },
    [setMinPrice, setMaxPrice],
  );

  return (
    <GroupWrapper isOpened={isOpened} setIsOpened={() => setIsOpened(!isOpened)} title="Price">
      <div className={styles.content}>
        <div className={styles.currency}>
          <div className={styles.icon}>
            <img src={iconChange} alt="iconChange" />
          </div>
          <div className={styles.title}>United States Dollar</div>
        </div>
        <div className={styles.form}>
          <TextInput
            positiveOnly
            type="number"
            value={min}
            onChange={(e) => setMin(e.target.value)}
            placeholder="Min"
          />
          <div className={styles.to}>to</div>
          <TextInput
            value={max}
            onChange={(e) => setMax(e.target.value)}
            positiveOnly
            type="number"
            placeholder="Max"
          />
        </div>
        {isError && (
          <Text color="red" tag="span">
            Minimum must be less than maximum
          </Text>
        )}
        <Button
          disabled={isDisabled}
          className={styles.button}
          onClick={() => handleApply(min, max)}
        >
          Apply
        </Button>
      </div>
    </GroupWrapper>
  );
};

export default PriceFilter;
