import { ChangeEvent, FC, useCallback, useEffect, useMemo, useState } from 'react';
import cx from 'classnames';
import { Switcher, Text } from 'components';
import { debounce } from 'lodash';
import Slider, { createSliderWithTooltip } from 'rc-slider';
import { validateOnlyNumbers } from 'utils';

import 'rc-slider/assets/index.css';
import './styles.scss';
import styles from './styles.module.scss';

type Props = {
  top?: boolean;
  isSwitcher?: boolean;
  value?: number | string;
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  isVertical?: boolean;
  isManageBtnVisible?: boolean;
  className?: string;
  classNameWrap?: string;
  isCurrenciesVisible?: boolean;
  valueSwitcher?: boolean;
  onChange?: (value: number | string) => void;
  onSwitcher?: (value: boolean) => void;
  isDebounce?: boolean;
  currency?: string;
};

const TooltipSlider = createSliderWithTooltip(Slider);

const RangePicker: FC<Props> = ({
  top,
  isSwitcher,
  label = '',
  value = 0,
  min = 0,
  max = 100,
  step = 1,
  isVertical = false,
  isManageBtnVisible = false,
  isCurrenciesVisible = true,
  className,
  classNameWrap,
  valueSwitcher,
  onChange = () => {},
  onSwitcher = () => {},
  isDebounce,
  currency,
}) => {
  const [localValue, setLocalValue] = useState('');

  const [debouncedCallApi] = useState(() => debounce(onChange, 1000));

  useEffect(() => {
    setLocalValue(value.toString());
  }, [value]);

  const handleChangeRange = useCallback(
    (val: number) => {
      setLocalValue(val.toString());
      if (isDebounce) {
        debouncedCallApi(val);
      } else {
        onChange(val);
      }
    },
    [debouncedCallApi, isDebounce, onChange],
  );

  const handleChangeInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (validateOnlyNumbers(e.target.value)) {
        const numberValue = e.target.value;
        const total = +numberValue > max ? max : numberValue;
        setLocalValue(total.toString());
        onChange(total);
      }
    },
    [max, onChange],
  );

  const input = useMemo(
    () => (
      <div className={cx(styles.values, top && styles.top)}>
        <input
          value={localValue === undefined ? value : localValue}
          className={styles.valueInput}
          onChange={handleChangeInput}
        />
        {/*<Text className={styles.maxValue}>{max} {currency?.toUpperCase()}</Text>*/}
      </div>
    ),
    [top, value, handleChangeInput, localValue],
  );

  return (
    <div
      className={cx(
        styles.container,
        {
          [styles.verticalContainer]: isVertical,
        },
        classNameWrap,
      )}
    >
      {top && input}

      {isSwitcher && (
        <Switcher
          className={styles.switcher}
          leftLabel="R"
          rightLabel="B"
          classNameLeft={cx(styles.switcherBtn, styles.switcherBtnLeft)}
          classNameRight={cx(styles.switcherBtn, styles.switcherBtnRight)}
          classNameActive={styles.activeSwitcher}
          checked={Boolean(valueSwitcher)}
          onChange={onSwitcher}
        />
      )}

      {label && (
        <div className={styles.labelWrap}>
          <Text className={styles.label}>{label}</Text>
          {isCurrenciesVisible && (
            <Text size="m" className={styles.currency}>
              {value}{' '}
              <Text tag="span" color="secondary">
                value
              </Text>
            </Text>
          )}
        </div>
      )}
      <div className={styles.sliderContainer}>
        {isManageBtnVisible && (
          <button
            type="button"
            className={cx(styles.manageBtn, styles.manageBtnMinus)}
            onClick={() => {
              const res = +value - step;
              onChange(res < 0 ? 0 : res);
            }}
          >
            -
          </button>
        )}

        <TooltipSlider
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore (rc-slider show that className invalid prop, but exist
          className={cx(styles.slider, 'rc-slider-wrap', className)}
          value={+localValue || +value}
          min={min}
          max={max}
          step={step}
          vertical={isVertical}
          onChange={handleChangeRange}
          railStyle={
            isVertical
              ? {
                  width: 6,
                  backgroundColor: 'white',
                }
              : {}
          }
        />

        <div className={styles.valuesWrapper}>
          <Text weight="bold" tag="span" className={styles.min}>
            {min} {currency?.toUpperCase()}
          </Text>
          <Text weight="bold" tag="span" className={styles.max}>
            {max} {currency?.toUpperCase()}
          </Text>
        </div>

        {isManageBtnVisible && (
          <button
            type="button"
            className={cx(styles.manageBtn, styles.manageBtnPlus)}
            onClick={() => {
              const res = +value + step;
              onChange(res > max ? max : res);
            }}
          >
            +
          </button>
        )}
      </div>

      {!top && input}
    </div>
  );
};

export default RangePicker;
