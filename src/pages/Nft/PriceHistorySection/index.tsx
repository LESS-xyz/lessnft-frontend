import { useState, VFC } from 'react';

import { CollapsingSection } from 'components';

import { IconPriceHistory } from 'assets/img';
import PriceHistory from '../PriceHistory';
import { ICurrency } from 'typings';

// import s from './PriceHistorySection.module.scss';

interface IProps {
  tokenId: string;
  currency: ICurrency;
}

const PriceHistorySection: VFC<IProps> = ({ tokenId, currency }) => {
  const [isOpened, setIsOpened] = useState(true);

  return (
    <CollapsingSection
      isOpened={isOpened}
      setIsOpened={setIsOpened}
      icon={IconPriceHistory}
      title="Price History"
    >
      <PriceHistory tokenId={tokenId} currency={currency} />
    </CollapsingSection>
  );
};

export default PriceHistorySection;
