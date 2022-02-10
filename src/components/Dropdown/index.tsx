import { FC, useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import cn from 'classnames';

import { iconArrowDown } from 'assets/img';

import styles from './Dropdown.module.scss';
import { Text } from 'components';

interface IDropdownProps {
  className?: string;
  value: string;
  setValue: (str: string) => void;
  options: Array<any>;
  isWithImage?: boolean;
  isWritable?: boolean;
  name?: string;
  suffix?: string;
  headClassName?: string;
  bodyClassName?: string;
}

const Dropdown: FC<IDropdownProps> = ({
  className,
  value,
  setValue,
  options,
  isWithImage,
  isWritable,
  name,
  suffix = '',
  headClassName,
  bodyClassName,
}) => {
  const [visible, setVisible] = useState(false);

  const handleClick = (str: string) => {
    setValue(str);
    setVisible(false);
  };

  return (
    <OutsideClickHandler onOutsideClick={() => setVisible(false)}>
      <div className={cn(styles.dropdown, className, { [styles.active]: visible })} id={name}>
        <div
          onKeyDown={() => {}}
          tabIndex={0}
          role="button"
          className={cn(styles.head, headClassName)}
          onClick={() => setVisible(!visible)}
        >
          {isWritable ? (
            <input value={value} className={styles.input} />
          ) : (
            <div className={styles.selection}>{value}</div>
          )}
          <img alt="open dropdown" src={iconArrowDown} className={styles.arrow} />
        </div>
        {!isWithImage ? (
          <div className={cn(styles.body, bodyClassName)}>
            {typeof options[0] === 'string'
              ? options.map((option: string) => (
                  <div
                    onKeyDown={() => {}}
                    tabIndex={0}
                    role="button"
                    className={cn(
                      styles.option,
                      {
                        [styles.selectioned]: option === value,
                      },
                      option === value ? 'selected' : '',
                    )}
                    onClick={() => handleClick(option)}
                    key={`dropdown_option_${option}`}
                  >
                    {option}
                    {suffix}
                  </div>
                ))
              : options.map((option) => (
                  <div
                    onKeyDown={() => {}}
                    tabIndex={0}
                    role="button"
                    className={cn(
                      styles.option,
                      {
                        [styles.selectioned]: option.text === value,
                      },
                      option.text === value ? 'text-gradient' : '',
                    )}
                    onClick={() => handleClick(option.text)}
                    key={`dropdown_option_${option.text}`}
                  >
                    {option.icon}
                    <Text className={styles.text} tag="span">
                      {option.text}
                    </Text>
                  </div>
                ))}
          </div>
        ) : (
          <div className={cn(styles.body, bodyClassName)}>
            {options.map((option: any) => (
              <div
                onKeyDown={() => {}}
                tabIndex={0}
                role="button"
                className={cn(
                  styles.option,
                  {
                    [styles.selectioned]: option?.symbol === value,
                  },
                  option.symbol === value ? 'text-gradient' : '',
                )}
                onClick={() => handleClick(option.symbol.toUpperCase())}
                key={`dropdown_option_${option.symbol}`}
              >
                <img alt="" className={styles.image} src={option.image} />
                <Text className={styles.text} tag="span">
                  {option.symbol.toUpperCase()}
                </Text>
              </div>
            ))}
          </div>
        )}
      </div>
    </OutsideClickHandler>
  );
};

export default Dropdown;
