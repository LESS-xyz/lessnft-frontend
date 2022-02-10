import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { TNullable } from 'typings';

const sortByFilters = [
  { value: '-created_at', label: 'Recently Created' },
  { value: 'created_at', label: 'Oldest' },
  { value: '-price', label: 'Highest Price' },
  { value: 'price', label: 'Lowest Price' },
  { value: '-likes', label: 'Most Likes' },
  { value: 'likes', label: 'Less Likes' },
  { value: '-views', label: 'Most Views' },
  { value: 'views', label: 'Less Views' },
  { value: '-sale', label: 'Recently Sold' },
  { value: 'sale', label: 'Oldest Sale' },
  { value: '-transfer', label: 'Recently Transfered' },
  { value: 'transfer', label: 'Oldest Transfer' },
  { value: '-auction_end', label: 'Recently Auction Ended' },
  { value: 'auction_end', label: 'Last Auction End' },
  { value: '-last_sale', label: 'Recently Last Sale' },
  { value: 'last_sale', label: 'Oldest Last Sale' },
];

export interface ICollection {
  id: string | number;
  name: string;
}
interface IProps {
  elementToScroll?: React.MutableRefObject<TNullable<HTMLDivElement>>;
}

const useNewFilters = (config?: IProps) => {
  const location = useLocation();

  // filter and text search from url
  const urlParams = new URLSearchParams(location.search);
  const tagsFromSearch = urlParams.get('filter');
  const textFromSearch = urlParams.get('text');

  const [isOnSale, setIsOnSale] = useState(false);
  const [isOnAuction, setIsOnAuction] = useState(false);
  const [isOnTimedAuction, setIsTimedOnAuction] = useState(false);
  const [activeTags, setActiveTags] = useState<Array<string>>(
    [tagsFromSearch || ''].filter((el) => el),
  );
  const [activeChains, setActiveChains] = useState<Array<string>>([]);
  const [activeCurrencies, setActiveCurrencies] = useState<Array<string>>([]);
  const [activeCollections, setActiveCollections] = useState<Array<ICollection>>([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [textSearch, setTextSearch] = useState(textFromSearch || '');
  const [sortBy, setSortBy] = useState(sortByFilters[0]);
  const [activePerks, setActivePerks] = useState('{}');
  const [activeRankings, setActiveRankigs] = useState('{}');
  const [activeStats, setActiveStats] = useState('{}');

  const [page, setPage] = useState(1);
  const handlePage = useCallback((value: number) => {
    setPage(value);
  }, []);

  const setDefaultFilters = useCallback(() => {
    setIsOnSale(false);
    setIsOnAuction(false);
    setIsTimedOnAuction(false);
    setActiveTags([]);
    setActiveChains([]);
    setActiveCurrencies([]);
    setActiveCollections([]);
    setPage(1);
    setMinPrice('');
    setMaxPrice('');
    setTextSearch('');
    setActivePerks('{}');
    setActiveRankigs('{}');
    setActiveStats('{}');
  }, []);

  useEffect(() => {
    if (tagsFromSearch) {
      setActiveTags(() => [tagsFromSearch]);
    }
    if (textFromSearch) {
      setTextSearch(textFromSearch);
    }
  }, [location, tagsFromSearch, textFromSearch]);

  useEffect(() => {
    setPage(1);
    if (config?.elementToScroll) {
      const scrolled = window.pageYOffset || document.documentElement.scrollTop;
      const elementRect = config.elementToScroll.current?.getBoundingClientRect() || null;
      const scrollTo = (elementRect ? elementRect.top : 0) + scrolled;

      window.scrollTo({ top: scrollTo, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // TODO: fix comment [useRef rerender too much]
    // eslint-disable-next-line
  }, [
    isOnSale,
    isOnAuction,
    isOnTimedAuction,
    activeTags,
    activeChains,
    minPrice,
    maxPrice,
    activeCurrencies,
    sortBy,
    activeCollections,
    // config,
    activeRankings,
    activePerks,
    activeStats,
  ]);

  return {
    isOnSale,
    setIsOnSale,
    isOnAuction,
    setIsOnAuction,
    isOnTimedAuction,
    setIsTimedOnAuction,
    activeTags,
    setActiveTags,
    activeChains,
    setActiveChains,
    page,
    handlePage,
    setDefaultFilters,
    minPrice,
    maxPrice,
    setMinPrice,
    setMaxPrice,
    activeCurrencies,
    setActiveCurrencies,
    textSearch,
    setTextSearch,
    sortBy,
    setSortBy,
    sortByFilters,
    activeCollections,
    setActiveCollections,
    activePerks,
    setActivePerks,
    activeRankings,
    setActiveRankigs,
    activeStats,
    setActiveStats,
  };
};

export default useNewFilters;
