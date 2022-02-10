import { useEffect, useState, useCallback } from 'react';
import { activityApi } from 'services';

export const useFetchTopCollections = (
  period: any,
  network = localStorage.lessnft_nft_chainName,
  tags = '',
  page = 1,
  items_per_page= 15
) => {
  const [collections, setCollections] = useState<any[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const fetchTopCollections = useCallback(() => {
    //TODO: add fetchTopCollections request
    activityApi
      .getTopCollections({ type: 'seller', sortPeriod: period.value, network, tags, page, items_per_page })
      .then(({ data: { results, total, total_pages } }: any) => {
        setCollections(results);
        setTotalItems(total);
        setTotalPages(total_pages);
      });
  }, [period.value, network, tags, page, items_per_page]);

  useEffect(() => {
    fetchTopCollections();
  }, [fetchTopCollections]);

  return {
    collections,
    totalItems,
    totalPages,
  };
};
