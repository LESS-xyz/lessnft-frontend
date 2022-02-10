import { useState, VFC, FC, useMemo, useCallback } from 'react';

import { H2, Text } from 'components';
import cn from 'classnames';
import styles from './styles.module.scss';
import { useMst } from 'store';
import { chains } from 'config';
import { observer } from 'mobx-react-lite';
import {
  allLogo,
  iconAllNFTs,
  iconArrowDown,
  iconArrowPageLeft,
  iconArrowPageRight,
  iconArrowPurple,
  iconChange,
} from 'assets/img';
import OutsideClickHandler from 'react-outside-click-handler';
import nextId from 'react-id-generator';
import { useFetchTopCollections } from 'hooks';
import { numberFormatter } from 'utils';
import BigNumber from 'bignumber.js';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import 'rc-pagination/assets/index.less';
import { localeInfo } from 'locale';
import { routes } from 'appConstants';
import { Link, useParams } from 'react-router-dom';

const timeOptions = [
  { symbol: 'Last 24 Hours', value: 'day', label: '24h' },
  { symbol: 'Last 7 Days', value: 'week', label: '7d' },
  { symbol: 'Last 30 Days', value: 'month', label: '30d' },
];

const pageOptions = [
  { symbol: '5', value: 5 },
  { symbol: '10', value: 10 },
  { symbol: '25', value: 25 },
  { symbol: '50', value: 50 },
  { symbol: '100', value: 100 },
];

const TopNfts: VFC = observer(() => {
  const { nftTags } = useMst();
  const { timeOption } = useParams<{ timeOption: string }>();
  const chainsOptions = [
    { symbol: 'All chains', image: allLogo },
    ...Object.values(chains).map((chain: any) => {
      return {
        symbol: chain.name === 'Binance-Smart-Chain' ? 'Binance' : chain.name,
        image: chain.img,
      };
    }),
  ];
  const [time, setTime] = useState(
    timeOptions.filter((option: any) => timeOption === option.value)[0] || timeOptions[0],
  );
  const [tag, setTag] = useState({ symbol: 'All NFTs', image: iconAllNFTs });
  const [chain, setChain] = useState(chainsOptions[0]);
  const [pageValue, setPageValue] = useState(pageOptions[0]);
  const [visibleChain, setVisibleChain] = useState(false);
  const [visibleTag, setVisibleTag] = useState(false);
  const [visibleTime, setVisibleTime] = useState(false);
  const [visiblePage, setVisiblePage] = useState(false);
  const [sort, setSort] = useState('price');
  const [isDesc, setIsDesc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const headOptions = useMemo(
    () => [
      { label: ' ' },
      { label: 'Collection' },
      { symbol: 'price', label: 'Volume' },
      { symbol: 'difference', label: `${time.label}%` },
      { symbol: 'floor_price', label: 'Floor Price' },
      { symbol: 'total_owners', label: 'Owners' },
      { symbol: 'total_items', label: 'Items' },
    ],
    [time.label],
  );

  const { collections, totalItems } = useFetchTopCollections(
    time,
    chain.symbol === 'All chains' ? '' : chain.symbol,
    tag.symbol === 'All NFTs' ? '' : tag.symbol,
    currentPage,
    pageValue.value,
  );

  const handleTags = (value: any) => {
    setTag(value);
    setVisibleTag(false);
  };
  const handleChains = (value: any) => {
    setChain(value);
    setVisibleChain(false);
  };
  const handleTime = (value: any) => {
    setTime(value);
    setVisibleTime(false);
  };
  const handlePage = (value: any) => {
    setPageValue(value);
    setVisiblePage(false);
  };

  const handleSetSort = useCallback(
    (symbol: string | undefined) => {
      if (symbol) {
        if (symbol === sort) {
          setIsDesc(!isDesc);
        } else if (!isDesc) {
          setIsDesc(true);
        }
        setSort(symbol);
        collections.sort((first: any, second: any) => {
          if (new BigNumber(first[symbol]).isEqualTo(new BigNumber(second[symbol]))) {
            return 0;
          }

          if (new BigNumber(first[symbol]).isLessThan(new BigNumber(second[symbol]))) {
            return isDesc ? 1 : -1;
          }
          return isDesc ? -1 : 1;
        });
      }
    },
    [isDesc, collections, sort],
  );

  const CustomDropdown: FC<any> = ({
    options,
    visible,
    value,
    setVisible,
    handleClick,
    className,
  }) => {
    return (
      <OutsideClickHandler onOutsideClick={() => setVisible(false)}>
        <div className={cn(styles.dropdown, { [styles.active]: visible }, className)} id="chains">
          <div
            onKeyDown={() => {}}
            tabIndex={0}
            role="button"
            className={styles.head}
            onClick={() => setVisible(!visible)}
          >
            {value.image ? (
              <img alt="" className={cn(styles.image, styles.imageOption)} src={value.image} />
            ) : (
              <></>
            )}
            <div className={cn(styles.selection, { [styles.margin]: value.image })}>
              {value.symbol}
            </div>
            <img alt="open dropdown" src={iconArrowDown} className={styles.arrow} />
          </div>
          <div className={styles.body}>
            {options.map((x: any) => (
              <div
                onKeyDown={() => {}}
                tabIndex={0}
                role="button"
                className={cn(styles.option, {
                  [styles.selectioned]: x.symbol === value.symbol,
                })}
                onClick={() => handleClick(x)}
                key={nextId()}
              >
                {x.image ? <img alt="" className={styles.image} src={x.image} /> : <></>}
                <span className={styles.text}>{x.symbol}</span>
              </div>
            ))}
          </div>
        </div>
      </OutsideClickHandler>
    );
  };

  const handleChangePage = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <section className={styles.page}>
      <div className={styles.top}>
        <H2 align="center" className={styles.title}>
          Top NFTs
        </H2>
        <Text className={styles.subtitle} color="lightGray">
          The top NFTs on Less-Nft, ranked by volume, floor price and other statistics.
        </Text>
      </div>
      <div className={styles.content}>
        <div className={styles.dropdowns}>
          <CustomDropdown
            options={timeOptions}
            value={time}
            setVisible={setVisibleTime}
            visible={visibleTime}
            handleClick={handleTime}
          />
          {nftTags.tags.length ? (
            <CustomDropdown
              options={nftTags.tags.map((nftTag: any) => {
                return { symbol: nftTag.title, image: nftTag.icon };
              })}
              visible={visibleTag}
              value={tag}
              setVisible={setVisibleTag}
              handleClick={handleTags}
            />
          ) : (
            <></>
          )}
          <CustomDropdown
            options={chainsOptions}
            visible={visibleChain}
            value={chain}
            setVisible={setVisibleChain}
            handleClick={handleChains}
          />
        </div>

        <div className={styles.collections}>
          <div className={styles.collectionsHead}>
            {headOptions.map((option: any) => (
              <div
                role="button"
                tabIndex={0}
                onKeyDown={() => {}}
                onClick={option.symbol ? () => handleSetSort(option.symbol) : () => {}}
                className={cn(styles.collectionStart, {
                  [styles.sorted]: sort === option.symbol,
                  [styles.isCanSort]: option.symbol,
                })}
              >
                <Text weight="bold">{option.label}</Text>
                {sort === option.symbol ? (
                  <img
                    alt="arrow"
                    className={cn(styles.sorting, { [styles.isReverted]: !isDesc })}
                    src={iconArrowPurple}
                  />
                ) : (
                  <></>
                )}
              </div>
            ))}
          </div>
          <div className={styles.collectionsBody}>
            {collections.length ? (
              collections.map((nft: any, index: number) => (
                <Link to={routes.collection.link(nft.collection.id)}>
                  <div className={styles.collection}>
                    <div className={styles.collectionNumber}>
                      <Text>{index + 1}</Text>
                    </div>
                    <div className={styles.collectionStart}>
                      <img
                        alt="avatar"
                        className={styles.collectionAvatar}
                        src={nft.collection.avatar}
                      />
                      <Text>{nft.collection.name}</Text>
                    </div>
                    <div className={styles.collectionStart}>
                      <img alt="eth" className={styles.usdIcon} src={iconChange} />
                      <Text>{nft.price}</Text>
                    </div>
                    <div className={styles.collectionStart}>
                      <Text
                        className={cn(styles.collectonDiff, {
                          [styles.green]: nft.difference && nft.difference[0] === '+',
                          [styles.red]: nft.difference && nft.difference[0] === '-',
                        })}
                      >
                        {nft.difference ? `${nft.difference}` : '0'}%
                      </Text>
                    </div>
                    <div className={styles.collectionStart}>
                      <img alt="eth" className={styles.usdIcon} src={iconChange} />
                      <Text>{nft.floor_price || 0}</Text>
                    </div>
                    <div className={styles.collectionStart}>
                      <Text>{numberFormatter(nft.total_owners, 10)}</Text>
                    </div>
                    <div className={styles.collectionStart}>
                      <Text>{numberFormatter(nft.total_items, 10)}</Text>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <Text>No items</Text>
            )}
          </div>
          <div className={styles.collectionsFooter}>
            <Pagination
              className={styles.pagination}
              defaultCurrent={1}
              current={currentPage}
              total={totalItems}
              locale={localeInfo}
              defaultPageSize={1}
              prevIcon={<img alt="" src={iconArrowPageLeft} className={styles.pageArrow} />}
              nextIcon={<img alt="" src={iconArrowPageRight} className={styles.pageArrow} />}
              onChange={handleChangePage}
            />
            <div className={styles.perPage}>
              <Text className={styles.perPageText}> show items per page</Text>

              <CustomDropdown
                options={pageOptions}
                visible={visiblePage}
                value={pageValue}
                setVisible={setVisiblePage}
                handleClick={handlePage}
                className={styles.pageDropdown}
              />
            </div>
            <div className={styles.totalItems}>
              <Text>
                {1 * currentPage}-
                {pageValue.value * currentPage > totalItems
                  ? totalItems
                  : pageValue.value * currentPage}{' '}
                out of {totalItems}
              </Text>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default TopNfts;
