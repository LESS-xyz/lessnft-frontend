import { FC, RefObject, useCallback, useState } from 'react';
import { Button, CollectionCard, Text } from 'components';
import { useInfiniteScroll } from 'hooks';
import { INft, OptionType } from 'typings';
import cn from 'classnames';

import TabHeader from '../TabHeader';

import s from '../Tabs.module.scss';
import { Dots } from 'assets/img';
import OutsideClickHandler from 'react-outside-click-handler';
import OptionMenu from 'components/OptionMenu';
import { useHistory } from 'react-router-dom';
import { routes } from 'appConstants';

interface IProps {
  page: number;
  allPages: number;
  handlePage: (value: number) => void;
  isNftsLoading: boolean;
  orderByFilter?: OptionType;
  handleOrderByFilter?: (value: OptionType) => void;
  nftCards: INft[];
  authorId?: string | number;
}

const actions = [{ name: 'Single' }, { name: 'Multiple' }];

const Collections: FC<IProps> = ({
  page,
  allPages,
  handlePage,
  isNftsLoading,
  orderByFilter,
  handleOrderByFilter,
  nftCards,
  authorId,
}) => {
  const history = useHistory();
  const [isTooltipVisible, setTooltipVisible] = useState(false);
  const [type, setType] = useState('Single');
  const anchorRef = useInfiniteScroll(page, allPages, handlePage, isNftsLoading);

  const handleSetType = (value: string) => {
    setType(value);
    setTooltipVisible(false);
  };

  const handleCreateCollection = useCallback(() => {
    history.push(
      type === 'Single' ? routes.create.collection.single : routes.create.collection.multiple,
    );
  }, [history, type]);

  return (
    <>
      <TabHeader
        headTitle="My Collections"
        title="Create, curate, and manage collections of unique NFTs to share and sell."
        orderByFilter={orderByFilter}
        handleOrderByFilter={handleOrderByFilter}
      />

      <div className={s.createWrapper}>
        <Button onClick={handleCreateCollection}>Create a collection</Button>
        <div className={s.optionBtn}>
          <OutsideClickHandler onOutsideClick={() => setTooltipVisible(false)}>
            <button
              className={s.button}
              onClick={() => setTooltipVisible(!isTooltipVisible)}
              tabIndex={0}
              type="button"
              onKeyDown={() => {}}
            >
              <Dots />
            </button>
            <OptionMenu active={isTooltipVisible} position="bottom-left">
              <div className={s.actions}>
                {actions.map((action) => {
                  return (
                    <div
                      key={action.name}
                      className={cn(s.actionsItem, { [s.active]: action.name === type })}
                      onClick={() => {
                        handleSetType(action.name);
                      }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={() => {}}
                    >
                      <span>{action.name}</span>
                    </div>
                  );
                })}
              </div>
            </OptionMenu>
          </OutsideClickHandler>
        </div>
      </div>

      <div className={s.tab}>
        {nftCards.length ? (
          nftCards
            .filter((col: any) => !col.is_default)
            .map((artCard: any) => {
              const { avatar, name, id, tokens, description, cover } = artCard;
              return (
                <CollectionCard
                  imageMain={avatar}
                  name={name}
                  collectionId={id}
                  itemsNumber={tokens?.length}
                  description={description}
                  imageBanner={cover}
                  key={`${avatar}-${name}-${description}-${id}`}
                  authorId={authorId}
                />
              );
            })
        ) : (
          <Text size="xl">No Collections</Text>
        )}
      </div>
      <div ref={anchorRef as RefObject<HTMLDivElement>} />
    </>
  );
};
export default Collections;
