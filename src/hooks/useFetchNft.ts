import { useCallback, useEffect, useRef, useState } from 'react';
import { debounce } from 'lodash';
import { storeApi } from 'services';
import { INft } from 'typings';

// const NUMBER_NFTS_PER_PAGE = 8;

interface IProps {
  page?: number;
  type?: string;
  order_by?: string;
  tags?: string;
  max_price?: string;
  min_price?: string;
  collections?: string;
  currency?: string;
  is_verified?: string;
  creator?: string;
  owner?: string;
  text?: string;
  isOnlyForOwnerOrCreator?: boolean;
  has_bids?: boolean;
  bids_by?: string;
  on_sale?: boolean;
  on_auc_sale?: boolean;
  on_timed_auc_sale?: boolean;
  network?: string;
  properties?: string;
  rankings?: string;
  stats?: string;
}

export const useFetchNft = (
  props: IProps,
  isDebounce = false,
  isIntervalUpdate = false,
): [number, number, INft[], boolean, (config: IProps) => void] => {
  const [isLoading, setLoading] = useState(false);
  const [allPages, setAllPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [nftCards, setNftCards] = useState<INft[]>([]);

  const newFetchSearch = useCallback((config: IProps) => {
    if (config.isOnlyForOwnerOrCreator && !config.owner && !config.creator && !config.bids_by) {
      return;
    }

    const refresh = config.page === 1;
    setLoading(true);

    const boolIsVerified = undefined;
    const formattedCurrency = config.currency === 'All' ? undefined : config.currency;
    const formattedTags = config.tags?.toLocaleLowerCase() === 'all nfts' ? undefined : config.tags;

    storeApi
      .getSearchResults({
        type: config.type,
        order_by: config.order_by,
        tags: formattedTags,
        max_price: config.max_price,
        min_price: config.min_price,
        currency: formattedCurrency,
        page: config.page,
        is_verified: boolIsVerified,
        creator: config.creator,
        owner: config.owner,
        text: config.text,
        has_bids: config.has_bids,
        bids_by: config.bids_by,
        on_sale: config.on_sale || '',
        on_auc_sale: config.on_auc_sale || '',
        on_timed_auc_sale: config.on_timed_auc_sale || '',
        network: config.network,
        collections: config.collections,
        properties: config.properties,
        rankings: config.rankings,
        stats: config.stats,
      })
      .then(({ data: { results, total, total_pages } }: any) => {
        setTotalItems(() => total);
        if (refresh) {
          setNftCards(results);
        } else {
          setNftCards((prev: INft[]) => [...prev, ...results]);
        }
        if (!results && refresh) {
          setNftCards([]);
        }
        setAllPages(Math.ceil(total_pages));
      })
      .catch((error: any) => console.error('error', error))
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const newDebouncedFetch = useRef(debounce(newFetchSearch, 1000)).current;

  useEffect(() => {
    let interval: any = null;
    if (!isDebounce) {
      newFetchSearch(props);
      if (isIntervalUpdate && !interval) {
        interval = setInterval(() => newFetchSearch(props), 60000);
      }
    } else {
      newDebouncedFetch(props);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
    // when passing PROPS directly to useEffect deps - rerender each time
    // eslint-disable-next-line
  }, [newDebouncedFetch, ...Object.keys(props)]);

  return [allPages, totalItems, nftCards, isLoading, newDebouncedFetch];
};
