import { useCallback, useEffect } from 'react';
import { storeApi } from 'services';
import { rootStore } from 'store';
import { AllImage, iconAllNFTs } from 'assets/img';

const useFetchTags = () => {
  const fetchTags = useCallback(async () => {
    try {
      const { data } = await storeApi.getTags();
      const fullTags = [{ title: 'All NFTs', icon: iconAllNFTs, image: AllImage }, ...data];
      rootStore.nftTags.setTags(fullTags);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);
};

export default useFetchTags;
