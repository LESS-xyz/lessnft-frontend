import { FC, useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import { iconArrowDownBlue } from 'assets/img';
import cn from 'classnames';
import nextId from 'react-id-generator';

import styles from './styles.module.scss';

type OptionType = {
  title: string;
  icon: string;
};

interface IProps {
  options: OptionType[];
  value: OptionType;
  setValue: (value: OptionType) => void;
  className?: string;
}

const TitleDropdown: FC<IProps> = ({ options, value, setValue, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => {
    setIsOpen(false);
  };
  const handleOptionClick = (option: OptionType) => {
    setValue(option);
    setIsOpen(false);
  };
  return (
    <div className={cn(styles.titleDropdown, className)}>
      <OutsideClickHandler onOutsideClick={handleClose}>
        <div
          tabIndex={0}
          role="button"
          onKeyDown={() => {}}
          onClick={() => setIsOpen((prevState) => !prevState)}
          className={styles.selected}
        >
          <span className={styles.gradientValue}>
            {value.title.toLowerCase() === 'all nfts' ? 'all NFTs' : value.title}
          </span>
          <div className={styles.dropdownContainer}>
            <img
              src={iconArrowDownBlue}
              alt=""
              className={cn(styles.selectedImg, { [styles.selectedImgOpen]: isOpen })}
            />
            <div className={cn(styles.selectionWrapper, { [styles.activeDropdown]: isOpen })}>
              <div className={`${styles.triangle}`} />
              <ul className={cn(styles.body, { [styles.activeDropdown]: isOpen })}>
                {options.map((option) => (
                  <li key={nextId()}>
                    <div
                      // key={option.value}
                      tabIndex={0}
                      role="button"
                      onKeyDown={() => {}}
                      onClick={(e: any) => {
                        e.stopPropagation();
                        handleOptionClick(option);
                      }}
                      className={styles.option}
                    >
                      <img alt="option icon" className={styles.optionIcon} src={option.icon} />
                      {option.title}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </OutsideClickHandler>
    </div>
  );
};
export default TitleDropdown;
