import React, { useCallback, useEffect, useState } from 'react';
import { iconCreateCircle } from 'assets/img';
import cn from 'classnames';
import { Carousel, Modal, Text } from 'components';
import { observer } from 'mobx-react';
import { userApi } from 'services/api';
import { useMst } from 'store';

import { CreateCollection } from '../../../index';

import carouselBreakpointsConfig from './carouselBreakpointsConfig';

import styles from './ChooseCollection.module.scss';
import { useHistory } from 'react-router-dom';
import { routes } from 'appConstants';

interface IProps {
  isSingle: boolean;
  activeCollectionId: number;
  onChange: (value: number) => void;
  className?: string;
  isRefresh: boolean;
  setIsRefresh: (value: boolean) => void;
  addToCollection: boolean;
}

interface ICollection {
  avatar?: string;
  name: string;
  id: number;
}

const ChooseCollection: React.FC<IProps> = observer(
  ({
    isSingle,
    activeCollectionId,
    onChange,
    className,
    isRefresh,
    setIsRefresh,
    addToCollection,
  }) => {
    const { user } = useMst();
    const history = useHistory();
    const [collections, setCollections] = useState<ICollection[]>([]);
    const [defaultCollectionId, setDefaultCollectionId] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleCollectionChange = useCallback(
      (collectionId: number) => {
        if (activeCollectionId !== collectionId) {
          onChange(collectionId);
        }
      },
      [activeCollectionId, onChange],
    );

    const getCollections = useCallback(() => {
      userApi
        .getSingleCollections()
        .then(({ data }) => {
          const newCollections = data.results.filter((coll: any) => {
            if (isSingle) {
              return coll.standart === 'ERC721';
            }
            return coll.standart === 'ERC1155';
          });
          const filteredCollections = newCollections.filter(
            (collection: any) => !collection.is_default,
          );
          setCollections(filteredCollections);
          const defCollectionId = newCollections.find(
            (collection: any) => collection.is_default,
          ).id;
          setDefaultCollectionId(defCollectionId);

          // handleCollectionChange(newCollections[0].id);
        })
        .catch((err) => console.error(err, 'get single'))
        .finally(() => setIsRefresh(false));
    }, [isSingle, setIsRefresh]);

    const handleCreateCOllection = () => {
      history.push(isSingle ? routes.create.collection.single : routes.create.collection.multiple);
    };

    useEffect(() => {
      if (user.address && isRefresh) {
        getCollections();
      }
      // getCollections forces api requests on each keystroke in form
      // TODO: rework this component
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user.address, isRefresh]);

    useEffect(() => {
      if (!addToCollection) {
        handleCollectionChange(defaultCollectionId);
      } else {
        handleCollectionChange(0);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addToCollection]);

    return (
      <div className={cn(styles.cards, className)}>
        {/* TODO: убрать выезды за layout */}
        <Carousel hideArrows slidesToShow={3} responsive={carouselBreakpointsConfig}>
          <div
            onClick={handleCreateCOllection}
            onKeyDown={handleCreateCOllection}
            role="button"
            tabIndex={0}
            className={cn(styles.card, !activeCollectionId && styles.active)}
          >
            <img src={iconCreateCircle} alt="create" className={styles.plus} />
            <Text className={styles.subtitle} color="primary">
              Create collection
            </Text>
          </div>
          {!!collections.length &&
            addToCollection &&
            collections.map((collection) => (
              <div
                onClick={() => handleCollectionChange(collection.id)}
                onKeyDown={() => handleCollectionChange(collection.id)}
                role="button"
                tabIndex={0}
                key={`collection_${collection.id}`}
                className={cn(styles.card, {
                  [styles.active]: activeCollectionId === collection.id,
                })}
                // className={styles.cardContent}
              >
                <div className={styles.cardImg}>
                  {!!collection.avatar && (
                    <img src={collection.avatar} alt="create" className={styles.avatar} />
                  )}
                </div>
                <div className={styles.cardSubtitle}>
                  <Text tag="span">
                    {collection.name.length > 24
                      ? `${collection.name.slice(0, 24)}...`
                      : collection.name}
                  </Text>
                </div>
              </div>
            ))}
        </Carousel>
        <Modal visible={isModalVisible} onClose={() => setIsModalVisible(false)}>
          <CreateCollection isSingle={isSingle} onClose={() => setIsModalVisible(false)} />
        </Modal>
      </div>
    );
  },
);

export default ChooseCollection;
