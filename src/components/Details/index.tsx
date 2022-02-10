import React, { useCallback, useState } from 'react';
import cn from 'classnames';
import { Button, Text, TextInput } from 'components';
import { observer } from 'mobx-react-lite';
import styles from './Details.module.scss';
import { useMst } from 'store';
import { iconCrossBlack } from 'assets/img';
import { toJS } from 'mobx';

const Details: React.FC = observer(() => {
  const {
    modals: { details },
  } = useMst();
  const type = details.type.toLocaleLowerCase();
  const isFirstType = details.type === 'Properties';
  const [detailsItems, setDetailsItems] = useState(
    details.getItems.filter((item: any) => item.display_type === type).length
      ? [
          // { display_type: type, trait_type: '', value: '', max_value: '' },
          ...details.getItems
            .filter((item: any) => item.display_type === type)
            .map((item: any) => toJS(item)),
        ]
      : [
          {
            display_type: type,
            trait_type: '',
            value: isFirstType ? '' : 3,
            max_value: 5,
          },
        ],
  );

  const handleChangeDetail = useCallback(
    (valueType: string, index: number, value: string) => {
      const newDetails = detailsItems;
      let newValue = value;
      if (!isFirstType) {
        if (valueType === 'value' && +detailsItems[index].value > +detailsItems[index].max_value) {
          newValue = '';
        }
      }
      newDetails[index] = { ...newDetails[index], [valueType]: newValue };
      setDetailsItems([...newDetails]);
    },
    [detailsItems, isFirstType],
  );

  const handleAddDetail = useCallback(() => {
    setDetailsItems([
      ...detailsItems,
      { display_type: type, trait_type: '', value: isFirstType ? '' : 3, max_value: 5 },
    ]);
  }, [detailsItems, isFirstType, type]);

  const handleDeleteDetail = useCallback(
    (indexValue: number) => {
      if (detailsItems.length > 1) {
        setDetailsItems([...detailsItems.filter((_, index: number) => index !== indexValue)]);
      } else {
        setDetailsItems([
          {
            display_type: type,
            trait_type: '',
            value: isFirstType ? '' : 3,
            max_value: 5,
          },
        ]);
      }
    },
    [detailsItems, isFirstType, type],
  );

  const handleSave = useCallback(
    (items: any) => {
      details.save([
        ...details.getItems.filter((item: any) => item.display_type !== type),
        ...items,
      ]);
      details.close();
    },
    [details, type],
  );

  return (
    <div className={styles.swap}>
      <div className={styles.header}>
        <Text className={styles.label} size="m" weight="medium">
          {details.text}
        </Text>
      </div>
      <div className={styles.body}>
        {/* {detailsItems.length > 1 ? (
          <> */}
        <div className={styles.left}>
          <div className={cn(styles.top, styles.topLeft)}>
            <Text weight="bold">{isFirstType ? 'Type' : 'Name'}</Text>
          </div>
          <div className={styles.bottom}>
            {detailsItems.map((detail: any, index: number) => (
              <TextInput
                className={styles.input}
                type="text"
                name={`trait_type ${index}`}
                label=""
                placeholder="Character"
                value={detail.trait_type}
                onChange={(e: any) => {
                  handleChangeDetail('trait_type', index, e.target.value);
                }}
                prefix={
                  <div
                    tabIndex={0}
                    role="button"
                    onKeyDown={() => {}}
                    onClick={() => {
                      handleDeleteDetail(index);
                    }}
                  >
                    <img src={iconCrossBlack} alt="cross" />
                  </div>
                }
                prefixClassName={styles.prefix}
              />
            ))}

            <Button color="outline" className={styles.addMore} onClick={handleAddDetail}>
              Add More
            </Button>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.top}>
            <Text weight="bold">{isFirstType ? 'Name' : 'Value'}</Text>
          </div>
          <div className={cn(styles.bottom, { [styles.bottomDouble]: !isFirstType })}>
            {detailsItems.map((detail: any, index: number) => (
              <div className={styles.bottomItem}>
                <TextInput
                  className={styles.input}
                  type={isFirstType ? 'text' : 'number'}
                  name={`value ${index}`}
                  label=""
                  placeholder={isFirstType ? 'Character' : '3'}
                  value={detail.value}
                  onChange={(e: any) => {
                    handleChangeDetail('value', index, e.target.value);
                  }}
                  positiveOnly
                  integer
                  max={+detail.max_value}
                />
                {isFirstType ? (
                  <></>
                ) : (
                  <>
                    <Text className={styles.of}>of</Text>
                    <TextInput
                      className={styles.input}
                      type="number"
                      name={`max_value ${index}`}
                      label=""
                      placeholder="5"
                      value={detail.max_value}
                      onChange={(e: any) => {
                        handleChangeDetail('max_value', index, e.target.value);
                      }}
                      positiveOnly
                      integer
                      min={+detail.value}
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
        {/* </>
        ) : (
          <>
            <div className={styles.left}>
              <div className={cn(styles.top, styles.topLeft)}>
                <Text weight="bold">Type</Text>
              </div>
              <div className={styles.bottom}>
                <TextInput
                  className={styles.input}
                  type="text"
                  name="trait_type"
                  label=""
                  placeholder="Character"
                  value={detailsItems[0].trait_type}
                  onChange={(e: any) => {
                    handleChangeDetail('trait_type', 0, e.target.value);
                  }}
                  prefix={<img src={iconCrossBlack} alt="cross" />}
                  prefixClassName={styles.prefix}
                />

                <Button color="outline" className={styles.addMore} onClick={handleAddDetail}>
                  Add More
                </Button>
              </div>
            </div>
            <div className={styles.right}>
              <div className={styles.top}>
                <Text weight="bold">Name</Text>
              </div>
              <div className={cn(styles.bottom, { [styles.bottomFirst]: !isFirstType })}>
                <TextInput
                  className={styles.input}
                  type={isFirstType ? 'text' : 'number'}
                  name="value"
                  label=""
                  placeholder={isFirstType ? 'Character' : '3'}
                  value={detailsItems.length ? detailsItems[0].value : ''}
                  onChange={(e: any) => {
                    handleChangeDetail('value', 0, e.target.value);
                  }}
                />
                {isFirstType ? (
                  <></>
                ) : (
                  <>
                    <Text className={styles.of}>of</Text>
                    <TextInput
                      className={styles.input}
                      type="number"
                      name="max_value"
                      label=""
                      placeholder="5"
                      value={detailsItems[0].max_value}
                      onChange={(e: any) => {
                        handleChangeDetail('max_value', 0, e.target.value);
                      }}
                      positiveOnly
                      integer
                      min={+detailsItems[0].value}
                    />
                  </>
                )}
              </div>
            </div>
          </>
        )} */}
      </div>
      <div className={styles.btns}>
        <Button
          className={styles.button}
          onClick={() => handleSave(detailsItems)}
          // loading={isLoading}
          // disabled={+payInput > +currentBalance || +payInput <= 0 || isLoading}
          // color="blue"
        >
          Save
        </Button>
      </div>
    </div>
  );
});

export default Details;
