import { useCallback, useEffect } from 'react';
import { networksApi } from 'services';
import { rootStore } from 'store';

const useFetchNetworks = () => {
  const fetchNetworks = useCallback(async () => {
    try {
      const { data } = await networksApi.getAllNetworks();
      rootStore.networks.setNetworks(data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    fetchNetworks();
  }, [fetchNetworks]);
};

export default useFetchNetworks;
