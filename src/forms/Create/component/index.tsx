import { FC, useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useLocation } from 'react-router-dom';
import {
  iconAddDetail,
  IconRefresh,
  iconStar,
  iconStats,
  iconUpload,
  iconWeight,
} from 'assets/img';
// import { ReactComponent as IconPropAdd } from 'assets/img/icons/icon-prop-add.svg';
// import { ReactComponent as IconPropDelete } from 'assets/img/icons/icon-prop-delete.svg';
import BigNumber from 'bignumber.js/bignumber';
import cn from 'classnames';
import {
  Button,
  Dropdown,
  H6,
  Radio,
  RequiredMark,
  Switch,
  Text,
  TextArea,
  TextInput,
  Uploader,
} from 'components';
import { IRadioButton } from 'components/Radio';
import { Field, Form, FormikProps } from 'formik';
import { observer } from 'mobx-react-lite';
import { ratesApi } from 'services';

import ChooseCollection from './ChooseCollection';

import styles from './CreateCollectibleDetails.module.scss';
import { useMst } from 'store';

interface IRate {
  rate: string;
  symbol: string;
  image: string;
}

interface IProperti {
  name: string | number;
  amount: string | number;
}

interface IDetail {
  title: 'Properties' | 'Rankings' | 'Stats';
  subtitle: string;
  text: string;
  icon: string;
}

export interface ICreateForm {
  name: string;
  isSingle?: boolean; // standart
  totalSupply: number;
  currency: string;
  description: string;
  price: number;
  minimalBid: number;
  creatorRoyalty: number;
  collection: number;
  details: IProperti[];
  selling: boolean;
  media: string;
  cover: string;
  coverPreview: string;
  format: 'image' | 'video' | 'audio';
  unlockOncePurchased: boolean;
  preview: string;
  sellMethod: string;
  isLoading: boolean;
  digitalKey: string;
  isTimedAuction: boolean;
  startAuction: string;
  endAuction: string;
  externalLink: string;
  isNsfw: boolean;
}

const sellMethods: IRadioButton[] = [
  {
    value: 'fixedPrice',
    optionTitle: 'Fixed price',
    optionInfo: 'Sell at fixed price',
  },
  {
    value: 'openForBids',
    optionTitle: 'Open for bids',
    optionInfo: 'Sell through Auction',
  },
];

const detailsItems: IDetail[] = [
  {
    title: 'Properties',
    subtitle: 'Textual traits that show up as rectangles',
    text: "Properties show up underneath your item, are clickable, and can be filtered in your collection's sidebar.",
    icon: iconWeight,
  },
  {
    title: 'Rankings',
    subtitle: 'Numerical traits that show as a progress bar',
    text: "Rankings show up underneath your item, are clickable, and can be filtered in your collection's sidebar.",
    icon: iconStar,
  },
  {
    title: 'Stats',
    subtitle: 'Numerical traits that just show as numbers',
    text: "Stats show up underneath your item, are clickable, and can be filtered in your collection's sidebar.",
    icon: iconStats,
  },
];

const CreateForm: FC<FormikProps<ICreateForm> & ICreateForm> = observer(
  ({
    setFieldValue,
    values,
    touched,
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
    isSingle = true,
  }) => {
    const {
      modals: { details },
    } = useMst();
    const history = useHistory();
    const { pathname } = useLocation();
    const [rates, setRates] = useState<IRate[]>([]);
    const [addToCollection, setAddToCollection] = useState(true);
    const [isRefresh, setIsRefresh] = useState(true);
    const startAuctionOptions = ['Right after listing', 'After 1 hour', 'After 6 hours'];
    const endAuctionOptions = ['1 Day', '3 Days', '1 Week'];
    const serviceFee = 3; // TODO: remove after get service fee request
    const stringRecieveValue =
      (parseFloat(`${values.price || values.minimalBid}`) * (100 - serviceFee)) / 100 || 0;
    const stringRatesValue = new BigNumber(
      rates.find((rate) => rate.symbol === values.currency)?.rate || 0,
    ).toFixed(2);
    // const currencyOptions = useMemo(() => {
    //   return values.sellMethod === 'openForBids'
    //     ? [...rates.map((rate) => rate.symbol)].filter(
    //         (rateSymbol) => !['bnb', 'eth', 'matic'].includes(rateSymbol),
    //       )
    //     : rates.map((rate) => rate.symbol);
    // }, [rates, values.sellMethod]);
    const handleClearImg = () => {
      setFieldValue('media', '');
      setFieldValue('preview', '');
      setFieldValue('cover', '');
      setFieldValue('coverPreview', '');
    };
    const onSubmit = () => {
      handleSubmit();
    };
    const onCancel = () => {
      history.goBack();
    };
    // const handleChangeProperty = useCallback(
    //   (e: any, index: any, type: 'name' | 'amount') => {
    //     const localProperties = [...values.details];

    //     if (type === 'name') {
    //       localProperties[index].name = e.target.value;
    //     }
    //     if (type === 'amount') {
    //       localProperties[index].amount = e.target.value;
    //     }
    //     setFieldValue('details', localProperties);
    //     handleChange(e);
    //   },
    //   [handleChange, setFieldValue, values.details],
    // );

    // const handleAddProperty = useCallback(() => {
    //   setFieldValue('details', [
    //     ...values.details,
    //     {
    //       size: '',
    //       amount: '',
    //     },
    //   ]);
    // }, [setFieldValue, values.details]);

    // const handleRemoveProperty = useCallback(
    //   (elemIndex: number) => {
    //     const newValue = values.details.filter((_, index) => index !== elemIndex);

    //     setFieldValue('details', newValue);
    //   },
    //   [setFieldValue, values.details],
    // );

    const fetchRates = useCallback(() => {
      ratesApi.getRates().then(({ data }: any) => {
        setRates(data);
        setFieldValue('currency', data[0]?.symbol);
      });
    }, [setFieldValue]);

    const handleDetailsOpen = useCallback(
      (type: 'Properties' | 'Rankings' | 'Stats', text: string) => {
        details.open(type, text);
      },
      [details],
    );

    const sliceStr = (str: string, end = 16) => {
      return str.length > end ? `${str.slice(0, end)}...` : str;
    };

    const getDetailItem = useCallback((item: any) => {
      switch (item.display_type) {
        case 'properties':
          return item.trait_type && item.value ? (
            <div className={styles.properties}>
              <Text className={styles.propertiesTitle} weight="bold" size="m" color="primary">
                {sliceStr(item.trait_type)}
              </Text>
              <Text className={styles.propertiesText}>{sliceStr(item.value, 14)}</Text>
            </div>
          ) : (
            <></>
          );
        case 'rankings':
          return item.trait_type && item.value && item.max_value ? (
            <div className={styles.rankings}>
              <div className={styles.rankingsHead}>
                <Text className={styles.rankingsTitle} weight="bold" size="m" color="primary">
                  {sliceStr(item.trait_type)}
                </Text>
                <Text className={styles.rankingsText}>
                  {item.value} of {item.max_value}
                </Text>
              </div>
              <div className={styles.rankingsBar}>
                <div
                  className={styles.rankingsBarColor}
                  style={{
                    width:
                      item.value > item.max_value
                        ? '100%'
                        : `${Math.ceil((item.value * 100) / item.max_value)}%`,
                  }}
                >
                  {' '}
                </div>
              </div>
            </div>
          ) : (
            <></>
          );

        default:
          return item.trait_type && item.value && item.max_value ? (
            <div className={styles.rankings}>
              <div className={styles.rankingsHead}>
                <Text className={styles.rankingsTitle} weight="bold" size="m" color="primary">
                  {sliceStr(item.trait_type)}
                </Text>
                <Text className={styles.rankingsText}>
                  {item.value} of {item.max_value}
                </Text>
              </div>
            </div>
          ) : (
            <></>
          );
      }
    }, []);

    useEffect(() => {
      fetchRates();
    }, [fetchRates]);

    useEffect(() => {
      setFieldValue('isSingle', isSingle);
    }, [isSingle, setFieldValue]);

    useEffect(() => {
      setFieldValue('details', details.getItems);
    }, [details.getItems, setFieldValue]);

    useEffect(() => {
      details.save([{ display_type: '', trait_type: '', value: '', max_value: 5 }]);
    }, [details, pathname]);

    return (
      <>
        <Form name="form-create" className={styles.form}>
          <div className={cn(styles.column, styles.columnUpload)}>
            {(values.format === 'video' || values.format === 'audio') && (
              <div className={styles.item}>
                {values.cover ? (
                  <div className={styles.previewImg}>
                    <img src={values.coverPreview} alt="Preview" />
                  </div>
                ) : (
                  <>
                    <div className={styles.file}>
                      <Field
                        name="cover"
                        className={styles.load}
                        required
                        render={() => (
                          <Uploader
                            isImgOnly
                            formikValue="cover"
                            setFormat={(value: string) => setFieldValue('format', value)}
                          />
                        )}
                      />
                      <div className={styles.capture}>
                        <div className={styles.icon}>
                          <img alt="" src={iconUpload} />
                        </div>
                        <Text className={styles.category} size="m" weight="medium" color="black">
                          Upload preview cover
                        </Text>
                        <Text className={styles.note} color="black">
                          Drag or choose your file to upload
                        </Text>
                        <Text className={styles.format} size="xxs" color="gray">
                          (PNG, GIF, WEBP, MP4 or MP3. Max 5 Mb.)
                        </Text>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
            <div className={styles.item}>
              {values.media ? (
                <div className={styles.previewImg}>
                  {values.format === 'image' && (
                    <>
                      <img src={values.preview} alt="Media" />
                      {/* TODO: add same btn to video/audio  */}
                    </>
                  )}
                  {values.format === 'video' && (
                    <video controls>
                      <source
                        src={values.preview}
                        type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"'
                      />
                      <track kind="captions" />
                    </video>
                  )}
                  {values.format === 'audio' && (
                    <audio controls>
                      <source src={values.preview} />
                      <track kind="captions" />
                    </audio>
                  )}
                </div>
              ) : (
                <>
                  <div className={styles.file}>
                    <Field
                      name="media"
                      className={styles.load}
                      required
                      render={() => (
                        <Uploader
                          formikValue="media"
                          setFormat={(value: string) => setFieldValue('format', value)}
                        />
                      )}
                    />
                    <div className={styles.capture}>
                      <div className={styles.icon}>
                        <img alt="" src={iconUpload} />
                      </div>
                      <Text className={styles.category} size="m" weight="medium" color="black">
                        Upload preview
                      </Text>
                      <Text className={styles.note} color="black">
                        Drag or choose your file to upload
                      </Text>
                      <Text className={styles.format} size="xxs" color="gray">
                        (PNG, GIF, WEBP, MP4, JPEG, SVG, WEBM, WAV, OGG, GLB, GLF or MP3. Max 5 Mb.)
                      </Text>
                    </div>
                  </div>
                </>
              )}
              {values.media && (
                <Button className={styles.clean} onClick={handleClearImg}>
                  Clear
                </Button>
              )}
            </div>
          </div>
          <div className={styles.column}>
            <div className={styles.item}>
              <div className={cn(styles.fieldset, styles.fieldset_first)}>
                <H6 className={styles.fieldsetTitle}>Sell method</H6>
                <Field
                  name="sellMethod"
                  render={() => (
                    <Radio
                      className={cn(styles.field, styles.options)}
                      name="sellMethod"
                      options={sellMethods}
                      controlledValue={values.sellMethod}
                      onChange={(newValue) => {
                        setFieldValue('sellMethod', newValue);
                      }}
                    />
                  )}
                />
              </div>
              <div className={styles.fieldset}>
                <H6 className={styles.fieldsetTitle}>Artwork Details</H6>
                <Field
                  render={() => (
                    <TextInput
                      label={
                        <>
                          Item name <RequiredMark />
                        </>
                      }
                      name="name"
                      type="text"
                      placeholder='e. g. "Redeemable Bitcoin Card with logo"'
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={styles.field}
                      required
                    />
                  )}
                />
                <Field
                  render={() => (
                    <TextInput
                      label="External Link"
                      subtitle={
                        <>
                          Less-Nft will include a link to this URL on this item`s detail page, so
                          that users can click to learn more about it. You are welcome to link to
                          your own webpage with more details.
                        </>
                      }
                      name="externalLink"
                      type="text"
                      placeholder="Enter your link"
                      value={values.externalLink}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={styles.field}
                      required
                    />
                  )}
                />
                {touched.externalLink && errors.externalLink && (
                  <Text color="red">{errors.externalLink}</Text>
                )}
                <Field
                  name="description"
                  render={() => (
                    <TextArea
                      label="Description"
                      name="description"
                      value={values.description}
                      placeholder="e. g. “After purchasing you will able to recived the logo...”"
                      onChange={handleChange}
                      maxLettersCount={500}
                      className={styles.field}
                    />
                  )}
                />
                {touched.description && errors.description && (
                  <Text color="red">{errors.description}</Text>
                )}
                <div className={styles.fieldsetRow}>
                  <div className={cn(styles.price, styles.fieldsetRowColumn)}>
                    <Text className={styles.label} color="black" size="m" weight="medium">
                      {`${values.sellMethod === 'fixedPrice' ? 'Price' : 'Minimal Bid'}`}{' '}
                      <RequiredMark />
                    </Text>
                    <div className={styles.inputs}>
                      {/* <Field
                        render={() => (
                          <Dropdown
                            name="currency"
                            setValue={(value) => setFieldValue('currency', value)}
                            options={currencyOptions}
                            className={styles.dropdown}
                            value={values.currency}
                          />
                        )}
                      /> */}
                      <Field
                        render={() => {
                          if (values.sellMethod === 'fixedPrice') {
                            return (
                              <TextInput
                                name="price"
                                type="number"
                                placeholder="e.g. 0.007"
                                value={values.price.toString()}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                positiveOnly
                                className={styles.priceInput}
                              />
                            );
                          }
                          return (
                            <TextInput
                              name="minimalBid"
                              type="number"
                              placeholder="e.g. 0.007"
                              value={values.minimalBid.toString()}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              required
                              positiveOnly
                              className={styles.priceInput}
                            />
                          );
                        }}
                      />
                    </div>
                    {touched.price && errors.price && <Text color="red">{errors.price}</Text>}
                    <div className={styles.postfix}>
                      {/* change dynamically */}
                      <Text color="middleGray">
                        Minimum price 0.0001 {values.currency?.toUpperCase()}
                      </Text>
                      <Text color="middleGray">
                        USD {stringRatesValue} PER/
                        {values.currency?.toUpperCase()}
                      </Text>
                    </div>
                  </div>
                  {!isSingle && (
                    <div className={styles.fieldsetRowColumn}>
                      <Text className={styles.label} size="m" weight="medium">
                        In Stock <RequiredMark />
                      </Text>
                      <Field
                        render={() => (
                          <TextInput
                            name="totalSupply"
                            type="number"
                            placeholder="e.g. 0.007"
                            value={`${values.totalSupply}`}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                          />
                        )}
                      />
                      {touched.totalSupply && errors.totalSupply && (
                        <Text color="red">{errors.totalSupply}</Text>
                      )}
                    </div>
                  )}
                  <div className={styles.fieldsetRowColumn}>
                    <Text className={cn(styles.label)} size="m" weight="medium">
                      Royalties <RequiredMark />
                    </Text>
                    <Field
                      render={() => (
                        <TextInput
                          name="creatorRoyalty"
                          type="number"
                          placeholder="e.g. 10"
                          value={`${values.creatorRoyalty}`}
                          className={styles.royalties}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          suffix="%"
                          suffixClassName={styles.suffix}
                          moreThanZero
                          positiveOnly
                          required
                        />
                      )}
                    />

                    {touched.creatorRoyalty && errors.creatorRoyalty && (
                      <Text color="red">{errors.creatorRoyalty}</Text>
                    )}
                  </div>
                </div>
                <div className={styles.fee}>
                  <Text color="primary">
                    Service fee {serviceFee}%
                    <br />
                    You will receive {stringRecieveValue} {values.currency?.toUpperCase()}
                  </Text>
                </div>
                <div className={styles.details}>
                  {detailsItems.map((detail: IDetail) => (
                    <div className={styles.detailWrapper}>
                      <div className={styles.detail}>
                        <div className={styles.detailInfo}>
                          <div className={styles.detailIcon}>
                            <img alt={detail.title} src={detail.icon} />
                          </div>

                          <div className={styles.detailInfoText}>
                            <Text weight="bold">{detail.title}</Text>
                            <Text>{detail.subtitle}</Text>
                          </div>
                        </div>

                        <div
                          className={styles.detailBtn}
                          onClick={() => handleDetailsOpen(detail.title, detail.text)}
                          onKeyDown={() => {}}
                          tabIndex={0}
                          role="button"
                        >
                          <img alt="add detail" src={iconAddDetail} />
                        </div>
                      </div>
                      {details.getItems.filter(
                        (item: any) => item.display_type === detail.title.toLowerCase(),
                      ).length ? (
                        <div
                          className={cn({
                            [styles.propertiesWrapper]: detail.title.toLowerCase() === 'properties',
                          })}
                        >
                          {details.getItems.map((item: any) => {
                            return item.display_type === detail.title.toLowerCase() ? (
                              getDetailItem(item)
                            ) : (
                              <></>
                            );
                          })}
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  ))}
                </div>
                {/* <div className={styles.tokenProperties}>
                  <FieldArray
                    name="details"
                    render={() => {
                      return values.details?.map((item: IProperti, index: number) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <div className={styles.tokenProperty} key={`details_${index}`}>
                          <Field
                            name={`details[${index}].name`}
                            render={() => (
                              <TextInput
                                label="Property"
                                type="text"
                                name={`details[${index}].name`}
                                placeholder="e. g. Size"
                                onChange={(e) => handleChangeProperty(e, index, 'name')}
                                onBlur={handleBlur}
                                className={styles.tokenPropertyName}
                              />
                            )}
                          />

                          <Field
                            name={`details[${index}].amount`}
                            render={() => (
                              <TextInput
                                name="amount"
                                label="amount"
                                type="text"
                                placeholder="e. g. M"
                                onChange={(e) => handleChangeProperty(e, index, 'amount')}
                                onBlur={handleBlur}
                                className={styles.tokenPropertyValue}
                              />
                            )}
                          />

                          <div
                            className={cn(styles.detailsBtns, {
                              [styles.detailsBtnsDouble]:
                                index === values.details.length - 1 && index !== 0,
                            })}
                          >
                            {values.details.length === index + 1 && values.details.length < 10 ? (
                              <div
                                className={cn(styles.btn, styles.btn_add)}
                                onClick={handleAddProperty}
                                role="button"
                                tabIndex={0}
                                onKeyDown={() => {}}
                              >
                                <IconPropAdd />
                              </div>
                            ) : null}
                            {values.details.length !== 1 ? (
                              <div
                                className={cn(styles.btn, styles.btn_remove)}
                                onClick={() => handleRemoveProperty(index)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={() => {}}
                              >
                                <IconPropDelete />
                              </div>
                            ) : null}
                          </div>
                        </div>
                      ));
                    }}
                  />
                </div> */}
              </div>
            </div>
            {values.sellMethod === 'openForBids' && values.isSingle && (
              <div className={cn(styles.item, styles.itemAuc)}>
                <H6 className={styles.fieldsetTitle}>
                  Make timed auction
                  <Field
                    render={() => (
                      <Switch
                        name="isTimedAuction"
                        value={values.isTimedAuction}
                        setValue={() => {
                          setFieldValue('isTimedAuction', !values.isTimedAuction);
                        }}
                      />
                    )}
                  />
                </H6>

                {values.isTimedAuction && (
                  <>
                    <div className={styles.startEndAuc}>
                      <div className={styles.startEndAucItem}>
                        <Text className={cn(styles.label)} size="m" weight="medium">
                          Starting Date <RequiredMark />
                        </Text>
                        <Field
                          name="startAuction"
                          render={() => (
                            <Dropdown
                              name="startAuction"
                              setValue={(value) => setFieldValue('startAuction', value)}
                              options={startAuctionOptions}
                              className={styles.startEndAucDropdown}
                              value={values.startAuction}
                            />
                          )}
                        />
                      </div>

                      <div className={styles.startEndAucItem}>
                        <Text className={cn(styles.label)} size="m" weight="medium">
                          Expiration Date <RequiredMark />
                        </Text>
                        <Field
                          name="endAuction"
                          render={() => (
                            <Dropdown
                              name="endAuction"
                              setValue={(value) => setFieldValue('endAuction', value)}
                              options={endAuctionOptions}
                              className={styles.startEndAucDropdown}
                              value={values.endAuction}
                            />
                          )}
                        />
                      </div>
                    </div>
                    <Text className={styles.startEndAucText} size="m" weight="medium">
                      Any bid placed in the last 10 minutes extends the auction by 10 minutes. Learn
                      more how timed auctions work
                    </Text>
                  </>
                )}
              </div>
            )}
            <div className={styles.item}>
              <H6 className={styles.fieldsetTitle}>
                Unlock once purchased
                <Field
                  render={() => (
                    <Switch
                      name="unlockOncePurchased"
                      value={values.unlockOncePurchased}
                      setValue={() => {
                        setFieldValue('unlockOncePurchased', !values.unlockOncePurchased);
                      }}
                    />
                  )}
                />
              </H6>

              {values.unlockOncePurchased && (
                <>
                  <Text className={styles.unlock} size="m" weight="medium">
                    Digital key, code to redeem or link to a file...
                  </Text>
                  <Field
                    name="digitalKey"
                    render={() => (
                      <TextInput
                        label=""
                        name="digitalKey"
                        value={values.digitalKey}
                        placeholder="Digital key"
                        onChange={handleChange}
                        type="text"
                      />
                    )}
                  />
                  {touched.description && errors.description && (
                    <Text color="red">{errors.description}</Text>
                  )}
                </>
              )}
            </div>
            <div className={cn(styles.item, styles.explicit)}>
              <div>
                <H6 className={styles.fieldsetTitle}>Explicit & Sensitive Content</H6>
                <Text>Set this item as explicit and sensitive content</Text>
              </div>
              <Field
                render={() => (
                  <Switch
                    name="isNsfw"
                    value={values.isNsfw}
                    setValue={() => {
                      setFieldValue('isNsfw', !values.isNsfw);
                    }}
                  />
                )}
              />
            </div>
            <div className={cn(styles.fieldset, styles.addCollection)}>
              <H6 className={styles.fieldsetTitle}>
                <div>
                  Add to collection
                  <IconRefresh className={styles.refresh} onClick={() => setIsRefresh(true)} />
                </div>
                <Switch
                  name="addToCollection"
                  value={addToCollection}
                  setValue={() => setAddToCollection(!addToCollection)}
                />
              </H6>
              <ChooseCollection
                className={styles.collections}
                activeCollectionId={values.collection}
                onChange={(value: any) => setFieldValue('collection', value)}
                isSingle={isSingle}
                isRefresh={isRefresh}
                setIsRefresh={setIsRefresh}
                addToCollection={addToCollection}
              />
            </div>
            <div className={styles.btns}>
              <Button
                className={cn('button', styles.button, styles.submitBtn)}
                onClick={onSubmit}
                disabled={
                  values.isLoading ||
                  !values.collection ||
                  (values.sellMethod === 'fixedPrice' && !values.price) ||
                  (values.sellMethod === 'openForBids' && !values.minimalBid) ||
                  !!Object.keys(errors).length ||
                  !values.media ||
                  ((values.format === 'video' || values.format === 'audio') && !values.cover)
                }
              >
                Create item
              </Button>
              <Button
                className={cn('button', styles.button, styles.cancelBtn)}
                onClick={onCancel}
                color="transparent"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Form>
      </>
    );
  },
);

export default CreateForm;
