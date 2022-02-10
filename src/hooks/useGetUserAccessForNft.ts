import React from 'react';
import { chainsEnum, INft, IOwner, TNullable } from 'typings';

export default (nft: TNullable<INft>, userId: string | number, userAddress: string) => {
  const isOwner = React.useMemo(() => {
    if (userId && nft && nft.owners) {
      if (Array.isArray(nft.owners)) {
        return !!nft.owners.find((owner: IOwner) => {
          return owner.id === userId;
        });
      }
      return userId === nft.owners.id;
    }
    return false;
  }, [nft, userId]);

  const isWrongChain = React.useMemo(() => {
    if (!nft || !userAddress) return true;
    if (
      nft?.network.name === chainsEnum['Binance-Smart-Chain'] &&
      localStorage.lessnft_nft_chainName === chainsEnum['Binance-Smart-Chain']
    ) {
      return false;
    }
    if (
      nft?.network.name === chainsEnum.Polygon &&
      localStorage.lessnft_nft_chainName === chainsEnum.Polygon
    ) {
      return false;
    }
    if (
      nft?.network.name === chainsEnum.Ethereum &&
      localStorage.lessnft_nft_chainName === chainsEnum.Ethereum
    ) {
      return false;
    }
    return true;
  }, [nft, userAddress]);

  const isUserCanRemoveFromSale = React.useMemo(() => {
    if (userId && nft && !isWrongChain) {
      if (
        nft.standart === 'ERC721' &&
        (nft.is_selling || nft.is_auc_selling || nft.is_timed_auc_selling) &&
        isOwner
      ) {
        return true;
      }
      if (
        nft.standart === 'ERC1155' &&
        (nft.sellers.find((seller) => seller.id === userId) ||
          nft.owner_auction.find((seller) => seller.id === userId)) &&
        isOwner
      ) {
        return true;
      }
    }
    return false;
  }, [nft, isOwner, userId, isWrongChain]);

  const isUserCanChangePrice = React.useMemo(() => {
    if (userId && nft && !isWrongChain) {
      if (nft.is_selling && isOwner) {
        return true;
      }
    }
    return false;
  }, [nft, isOwner, userId, isWrongChain]);

  const isUserCanBuyNft = React.useMemo(() => {
    if (userId && nft && !isWrongChain && nft.price && nft.is_selling && nft.available !== 0) {
      if (nft.standart === 'ERC721' && !isOwner) {
        return true;
      }
      if (
        nft.standart === 'ERC1155' &&
        ((nft.sellers.length === 1 && nft.sellers[0].id !== userId) || nft.sellers.length > 1)
      ) {
        return true;
      }
    }
    return false;
  }, [nft, userId, isOwner, isWrongChain]);

  const isUserCanEnterInAuction = React.useMemo(() => {
    if (
      userId &&
      nft &&
      !isWrongChain &&
      (nft.is_auc_selling || nft?.is_timed_auc_selling) &&
      nft.available !== 0
    ) {
      if (nft.standart === 'ERC721' && !isOwner) {
        return true;
      }
      if (
        nft.standart === 'ERC1155' &&
        (nft.owner_auction.length > 1 ||
          (nft.owner_auction.length === 1 && nft.owner_auction[0].id !== userId))
      ) {
        return true;
      }
    }
    return false;
  }, [nft, isOwner, userId, isWrongChain]);

  const isUserCanEndAuction = React.useMemo(() => {
    if (
      userId &&
      nft &&
      !isWrongChain &&
      nft.is_auc_selling &&
      !nft.is_timed_auc_selling &&
      nft.bids.length &&
      isOwner
    ) {
      if (nft.standart === 'ERC721') {
        return true;
      }
      if (
        nft.standart === 'ERC1155' &&
        nft.owner_auction.find((seller) => seller.id === userId) &&
        nft.highest_bid?.bidder_id !== userId
      ) {
        return true;
      }
    }
    return false;
  }, [nft, isOwner, userId, isWrongChain]);

  const isUserCanSeeUnlockableContent = React.useMemo(() => {
    if (userId && nft && isOwner && nft.has_digital_key) {
      return true;
    }
    return false;
  }, [nft, isOwner, userId]);

  const isUserCanPutOnSale = React.useMemo(() => {
    if (userId && nft && !isWrongChain && isOwner) {
      if (
        nft.standart === 'ERC721' &&
        !nft.is_selling &&
        !nft.is_auc_selling &&
        !nft.start_auction
      ) {
        return true;
      }
      if (
        nft.standart === 'ERC1155' &&
        !nft.sellers.find((seller) => seller.id === userId) &&
        !nft.owner_auction.find((seller) => seller.id === userId)
      ) {
        return true;
      }
    }
    return false;
  }, [nft, isOwner, userId, isWrongChain]);

  return {
    isOwner,
    isWrongChain,
    isUserCanRemoveFromSale,
    isUserCanBuyNft,
    isUserCanEnterInAuction,
    isUserCanPutOnSale,
    isUserCanEndAuction,
    isUserCanChangePrice,
    isUserCanSeeUnlockableContent,
  };
};
