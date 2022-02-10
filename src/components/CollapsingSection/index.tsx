import { FC } from 'react';
import cn from 'classnames';

import { Text } from 'components';

import s from './CollapsingSection.module.scss';

import { IconArrow } from 'assets/img';

interface IProps {
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  title: string;
  isOpened: boolean;
  setIsOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

const CollapsingSection: FC<IProps> = ({
  children,
  title,
  icon: SectionIcon,
  isOpened,
  setIsOpened,
}) => {
  return (
    <section className={s.section}>
      <div
        tabIndex={0}
        role="button"
        onKeyDown={() => {}}
        onClick={() => setIsOpened((prev) => !prev)}
        className={cn(s.header, { [s.active]: isOpened })}
      >
        <div className={s.inner}>
          <div className={s.icon}>
            <SectionIcon />
          </div>
          <div className={s.title}>
            <Text tag="span" size="m" weight="bold">
              {title}
            </Text>
          </div>
          <div className={cn(s.arrow, { [s.active]: isOpened })}>
            <IconArrow width="24px" height="24px" />
          </div>
        </div>
      </div>
      {isOpened && <div className={s.content}>{children}</div>}
    </section>
  );
};

export default CollapsingSection;
