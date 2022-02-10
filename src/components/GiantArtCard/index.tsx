import { FC, useCallback, useRef, useState } from 'react';
import { Close, IconLock, Zoom } from 'assets/img';
import cx from 'classnames';
import { EllipsisText, H2, Skeleton, Text } from 'components';
import { useGetUserAccessForNft, useNoScroll } from 'hooks';
import { observer } from 'mobx-react-lite';
import AuthorComponent from 'pages/Home/HotAuction/components/AuthorComponent';
import DescriptionAndTagsComponent from 'pages/Home/HotAuction/components/DescriptionAndTagsComponent';
import PaymentComponent from 'pages/Home/HotAuction/components/PaymentComponent';
import ViewsAndControlsComponent from 'pages/Home/HotAuction/components/ViewsAndControlsComponent';
import { useMst } from 'store';
import { INft, TNullable } from 'typings';

import styles from './styles.module.scss';

type TImagePosition = {
  left: string | number;
  top: string | number;
};

type Props = {
  className?: string;
  name: string;
  nft: TNullable<INft>;
  onUpdateNft?: () => void;
  isFetching?: boolean;
};

const GiantCard: FC<Props> = ({ isFetching, className, nft, onUpdateNft }) => {
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const setScroll = useNoScroll();

  const { user } = useMst();
  const {
    isUserCanEndAuction,
    isUserCanBuyNft,
    isUserCanEnterInAuction,
    isUserCanPutOnSale,
    isOwner,
    isUserCanRemoveFromSale,
    isWrongChain,
    isUserCanChangePrice,
    isUserCanSeeUnlockableContent,
  } = useGetUserAccessForNft(nft, user.id, user.address);

  const togglePreview = useCallback(
    (state: boolean) => {
      setScroll(state);
      setShowPreview(state);
    },
    [setScroll],
  );

  const mediaRef = useRef<HTMLImageElement>(null);
  const [imagePosition, setImagePosition] = useState<TNullable<TImagePosition>>(null);
  const onPreviewClick = useCallback(
    (state: boolean) => {
      if (mediaRef.current) {
        if (state) {
          const boundRect = mediaRef.current.getBoundingClientRect();
          const win = document.documentElement.getBoundingClientRect();
          setImagePosition({
            left: (win.width - boundRect.width) / 2 - boundRect.left,
            top: -win.y + (window.innerHeight * 0.5 - boundRect.height) / 2,
          });
        } else {
          setImagePosition(null);
        }
      }
      togglePreview(state);
    },
    [mediaRef, togglePreview],
  );

  return (
    <div className={cx(styles.giantCard, className)}>
      <div className={styles.contentWrapper}>
        {isFetching ? (
          <Skeleton />
        ) : (
          nft?.format === 'image' && (
            <>
              <button
                className={styles.mediaContentWrapper}
                onClick={() => onPreviewClick(true)}
                type="button"
              >
                <div className={styles.overlay}>
                  <Zoom />
                </div>
                <img
                  className={styles.mediaContent}
                  src={nft.media || '/images/content/card-pic-6.jpg'}
                  alt="Card"
                />
              </button>
              <div className={`${styles.preview} ${showPreview && styles.active}`}>
                <div
                  className={`${styles.previewImage} ${showPreview && styles.active}`}
                  style={{
                    transform: `translate(${imagePosition?.left || 0}px, ${
                      imagePosition?.top || 0
                    }px)`,
                  }}
                >
                  <img
                    ref={mediaRef}
                    className={styles.mediaContent}
                    src={nft.media || '/images/content/card-pic-6.jpg'}
                    alt="Card"
                  />
                </div>
                <button
                  type="button"
                  className={`${styles.background} ${showPreview && styles.active}`}
                  onClick={() => onPreviewClick(false)}
                >
                  <Close />
                </button>
              </div>
            </>
          )
        )}
        {nft?.format === 'video' &&
          (nft.animation ? (
            <video className={styles.mediaContent} controls>
              <source src={nft.animation} type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"' />
              <track kind="captions" />
            </video>
          ) : (
            <img
              className={styles.mediaContent}
              src={nft.media || '/images/content/card-pic-6.jpg'}
              alt="Card"
            />
          ))}
        {nft?.format === 'audio' &&
          (nft.animation ? (
            <>
              <img
                className={styles.mediaContent}
                src={nft.media || '/images/content/card-pic-6.jpg'}
                alt="Card"
              />
              <audio controls>
                <source
                  src={nft.animation}
                  // type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"'
                />
                <track kind="captions" />
              </audio>
            </>
          ) : (
            <img
              className={styles.mediaContent}
              src={nft.media || '/images/content/card-pic-6.jpg'}
              alt="Card"
            />
          ))}
      </div>

      <div className={styles.cardInfo}>
        {isFetching ? (
          <Skeleton width="30%" height="25px" />
        ) : (
          <EllipsisText className={styles.cardName}>
            <H2>{nft?.name || ''}</H2>
          </EllipsisText>
        )}
        <ViewsAndControlsComponent
          className={styles.detailedViewsAndControl}
          likes={nft?.like_count || 0}
          inStock={nft?.available || 0}
          nft={nft}
          isOwner={isOwner}
          isUserCanRemoveFromSale={isUserCanRemoveFromSale}
          isWrongChain={isWrongChain}
          isUserCanChangePrice={isUserCanChangePrice}
        />
        {(isUserCanEndAuction ||
          isUserCanBuyNft ||
          isUserCanEnterInAuction ||
          isUserCanPutOnSale ||
          nft?.selling) &&
          !isWrongChain && (
            <PaymentComponent
              nft={nft}
              onUpdateNft={onUpdateNft}
              isUserCanEndAuction={isUserCanEndAuction}
              isUserCanBuyNft={isUserCanBuyNft}
              isUserCanEnterInAuction={isUserCanEnterInAuction}
              isUserCanPutOnSale={isUserCanPutOnSale}
              isOwner={isOwner}
              className={styles.payment}
            />
          )}
        <AuthorComponent creator={nft?.creator} owners={nft?.owners} collection={nft?.collection} />
        {nft?.has_digital_key && !isUserCanSeeUnlockableContent && (
          <div className={styles.unlockButton}>
            <IconLock />
            <Text color="white" tag="span">
              This token has unlockable content
            </Text>
          </div>
        )}
        <DescriptionAndTagsComponent
          className={styles.description}
          tags={nft?.tags || []}
          body={nft?.description || ''}
          digitalKey={nft?.digital_key || ''}
          isUserCanSeeUnlockableContent={isUserCanSeeUnlockableContent}
        />
      </div>
    </div>
  );
};

export default observer(GiantCard);
