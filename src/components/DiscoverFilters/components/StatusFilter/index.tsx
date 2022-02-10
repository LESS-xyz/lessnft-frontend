import { useCallback, useState, VFC } from 'react';

import GroupWrapper from '../GroupWrapper';
import { Button } from 'components';

import styles from './StatusFilter.module.scss';

interface IProps {
  setIsOnSale: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOnAuction: React.Dispatch<React.SetStateAction<boolean>>;
  setIsTimedOnAuction: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveTags: React.Dispatch<React.SetStateAction<Array<string>>>;
  isOnSale: boolean;
  isOnAuction: boolean;
  isOnTimedAuction: boolean;
  activeTags: Array<string>;
}

const StatusFilter: VFC<IProps> = ({
  setIsOnSale,
  setIsOnAuction,
  setIsTimedOnAuction,
  setActiveTags,
  isOnSale,
  isOnAuction,
  isOnTimedAuction,
  activeTags,
}) => {
  const [isOpened, setIsOpened] = useState(true);

  const handleFilter = useCallback(
    (filterName: string) => {
      switch (filterName) {
        case 'Buy now':
          setIsOnSale((prev) => !prev);
          break;

        case 'On Auction':
          setIsOnAuction((prev) => !prev);
          break;

        case 'Has Offers':
          setIsTimedOnAuction((prev) => !prev);
          break;

        case 'New':
          if (activeTags.includes(filterName)) {
            setActiveTags((prev) => prev.filter((el) => el !== filterName));
          } else setActiveTags((prev) => [...prev, filterName]);
          break;

        default:
          break;
      }
    },
    [setIsOnSale, setIsOnAuction, setIsTimedOnAuction, setActiveTags, activeTags],
  );

  return (
    <GroupWrapper isOpened={isOpened} setIsOpened={() => setIsOpened(!isOpened)} title="Status">
      <div className={styles.content}>
        <Button
          padding="0"
          onClick={() => handleFilter('Buy now')}
          color={isOnSale ? 'purple' : 'outline'}
        >
          Buy now
        </Button>
        <Button
          padding="0"
          onClick={() => handleFilter('On Auction')}
          color={isOnAuction ? 'purple' : 'outline'}
        >
          On Auction
        </Button>
        <Button
          padding="0"
          onClick={() => handleFilter('New')}
          color={activeTags.includes('New') ? 'purple' : 'outline'}
        >
          New
        </Button>
        <Button
          padding="0"
          onClick={() => handleFilter('Has Offers')}
          color={isOnTimedAuction ? 'purple' : 'outline'}
        >
          Has Offers
        </Button>
      </div>
    </GroupWrapper>
  );
};

export default StatusFilter;
