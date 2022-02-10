/* eslint-disable react/no-array-index-key */
import { useCallback, useState, VFC } from 'react';
import { Link } from 'react-router-dom';
import { routes } from 'appConstants';
import cx from 'classnames';
import { H5, Text, TextInput, Button } from 'components';
import Loader from 'components/Loader';
import { useFetchNft } from 'hooks';
import { INft } from 'typings';

import { SearchTag } from './components';

import styles from './styles.module.scss';
import OutsideClickHandler from 'react-outside-click-handler';
import { iconSearch } from 'assets/img';
import { toFixed } from 'utils';

type Props = {
  className?: string;
  classNameDropdown?: string;
  isDesktop?: boolean;
};

const Search: VFC<Props> = ({ isDesktop = true, className, classNameDropdown }) => {
  const [inputValue, setInputValue] = useState('');
  // TODO: check if pagination needed, if not delete
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchResultPage, setSearchResultPage] = useState(1);

  const [, totalItems, nftCards, isLoading, debouncedFetch] = useFetchNft(
    {
      text: inputValue,
      page: searchResultPage,
      is_verified: 'All',
    },
    true,
  );

  const handleInput = useCallback(
    (e) => {
      const { value } = e.target;
      setInputValue(value);
      debouncedFetch(value);
    },
    [debouncedFetch],
  );
  const clearInput = () => {
    setInputValue('');
  };

  const isShowResults = totalItems > 0 && inputValue !== '';
  const isNoResults = totalItems === 0 && inputValue !== '' && !isLoading;

  return (
    <div className={cx(styles.search, { [styles.desktop]: isDesktop }, className)}>
      <OutsideClickHandler onOutsideClick={clearInput}>
        <TextInput
          onChange={handleInput}
          value={inputValue}
          placeholder="Search by arts"
          type="text"
          className={styles.searchInput}
          icon={iconSearch}
        />
        {isLoading && <Loader className={styles.searchLoader} />}
        <div
          className={cx(
            styles.searchDropdown,
            { [styles.isVisible]: isShowResults || isNoResults },
            classNameDropdown,
          )}
        >
          {isShowResults && (
            <>
              <H5>{`Artworks (${totalItems})`}</H5>
              <ul className={styles.searchResults}>
                {nftCards.slice(0, 5).map((nft: INft, index) => {
                  const {
                    media,
                    name,
                    price,
                    highest_bid,
                    minimal_bid,
                    currency: { symbol },
                    total_supply,
                    is_auc_selling,
                    id,
                    selling,
                  } = nft;
                  return (
                    <li className={styles.searchItem} key={`${nft?.creator}-${nft?.name}`}>
                      <Link to={routes.nft.link(id)} onClick={() => setInputValue('')} key={index}>
                        <SearchTag
                          image={media}
                          title={name}
                          price={
                            price ||
                            (highest_bid && toFixed(highest_bid.amount, 3)) ||
                            minimal_bid ||
                            ''
                          }
                          asset={symbol}
                          isAuction={is_auc_selling}
                          inStock={total_supply}
                          isSelling={selling}
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <Link to={routes.discover.input(inputValue)}>
                <Button color="purple" className={styles.viewResults} onClick={clearInput}>
                  <Text color="white">View all results</Text>
                </Button>
              </Link>
            </>
          )}
          {isNoResults && <H5>No search results</H5>}
        </div>
      </OutsideClickHandler>
    </div>
  );
};

export default Search;
