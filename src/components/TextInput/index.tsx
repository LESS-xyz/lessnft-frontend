import { ChangeEvent, useEffect, useRef, useState } from 'react';
import BigNumber from 'bignumber.js/bignumber';
import { arrowLeft } from 'assets/img';
import cn from 'classnames';
import { Text } from 'components';
import Button from 'components/Button';
// import { IconNames } from 'typings';

import styles from './TextInput.module.scss';

interface Props {
  className?: string;
  label?: string | JSX.Element;
  subtitle?: string | JSX.Element;
  name?: string;
  type: string;
  placeholder: string;
  required?: boolean;
  prefix?: string | JSX.Element;
  suffix?: any;
  suffixClassName?: string;
  prefixClassName?: string;
  onChange?: (value: any) => void;
  onBlur?: (value: any) => void;
  value?: string;
  disabled?: boolean;
  error?: boolean;
  icon?: any;
  isButton?: boolean;
  integer?: boolean;
  positiveOnly?: boolean;
  moreThanZero?: boolean;
  max?: number;
  min?: number;
  onButtonClick?: () => void;
}

const TextInput: React.FC<Props> = ({
  integer = false,
  positiveOnly = false,
  moreThanZero = false,
  className,
  label,
  subtitle,
  suffix,
  onChange,
  value,
  suffixClassName,
  name,
  disabled,
  prefix,
  prefixClassName,
  error,
  icon,
  isButton,
  max,
  min,
  type,
  onButtonClick,
  ...props
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [elWidth, setElWidth] = useState(0);
  const prefixElement = (
    <div ref={ref} className={cn(styles.prefix, prefixClassName)}>
      {prefix}
    </div>
  );

  const getRegex = () => {
    if (integer) {
      return positiveOnly ? /^[+]?[1-9]\d*$/ : /^[-+]?[1-9]\d*$/;
    }
    if (moreThanZero) {
      return positiveOnly ? /^[+]?[0-9]\d*$/ : /^[-+]?[0-9]\d*$/;
    }
    return positiveOnly ? /^[+]?([.]\d+|\d+[.]?\d*)$/ : /^[-+]?([.]\d+|\d+[.]?\d*)$/;
  };
  const checkMin = (comparingValue: string) => {
    const arrayedComparingValue = Array.from(String(comparingValue), Number);
    const arrayedMin = Array.from(String(min), Number);
    if (new BigNumber(min ?? 0).isLessThanOrEqualTo(comparingValue)) return true;
    for (let i = 0; i < arrayedComparingValue.length; i += 1) {
      if (
        !(
          (
            new BigNumber(arrayedMin[i]).isLessThanOrEqualTo(
              new BigNumber(arrayedComparingValue[i]),
            ) || // every symbol should be more or equal to min value
            (Number.isNaN(arrayedMin[i]) && Number.isNaN(arrayedComparingValue[i])) || // '.' elements
            (arrayedComparingValue[i] !== undefined && arrayedMin[i] === undefined)
          ) // if arrayedComparingValue longer than arrayedMin
        )
      ) {
        return false;
      }
    }
    return true;
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const reg = getRegex();
    const inputValue = e.target.value;
    if (onChange) {
      if (
        (!Number.isNaN(inputValue) && reg.test(inputValue)) ||
        (!positiveOnly && inputValue === '-')
      ) {
        if (max && min) {
          if (
            checkMin(inputValue) &&
            (new BigNumber(inputValue).isLessThan(new BigNumber(max)) ||
              new BigNumber(inputValue).isEqualTo(new BigNumber(max)))
          )
            onChange(e);
        } else if (max) {
          if (
            new BigNumber(inputValue).isLessThan(new BigNumber(max)) ||
            new BigNumber(inputValue).isEqualTo(new BigNumber(max))
          )
            onChange(e);
        } else if (min) {
          if (checkMin(inputValue)) onChange(e);
        } else onChange(e);
        // if (max) {
        //   if (new BigNumber(inputValue) <= new BigNumber(max)) onChange(e);
        // } else onChange(e);
      }
      if (inputValue === '') onChange(e);
    }
  };
  useEffect(() => {
    if (ref.current && prefix) {
      setElWidth(ref.current.offsetWidth);
    }
  }, [prefix]);

  const handleInputChange = type === 'number' ? handleChange : onChange;

  return (
    <div className={cn(styles.field, className)}>
      {label && (
        <Text className={styles.label} size="m" weight="medium">
          {label}
        </Text>
      )}
      {subtitle && (
        <Text className={styles.subtitle} size="s" weight="medium" color="middleGray">
          {subtitle}
        </Text>
      )}
      {icon && <img src={icon} alt="" className={styles.icon} />}
      <div className={styles.wrap}>
        {prefixElement}
        <input
          id={name}
          value={value}
          className={cn(styles.input, { [styles.error]: error, [styles.withIcon]: icon })}
          onChange={handleInputChange}
          onWheel={(e) => e.currentTarget.blur()}
          disabled={disabled}
          {...props}
          style={
            elWidth
              ? { paddingLeft: `${elWidth + 4}px`, paddingRight: suffix ? '74px' : '' }
              : { paddingRight: suffix ? '74px' : '' }
          }
        />
        {isButton && (
          <Button
            onClick={onButtonClick ? () => onButtonClick() : () => {}}
            className={styles.inputButton}
          >
            <img src={arrowLeft} alt="" />
          </Button>
        )}
        <div className={cn(styles.suffix, suffixClassName)}>{suffix}</div>
      </div>
    </div>
  );
};

export default TextInput;
