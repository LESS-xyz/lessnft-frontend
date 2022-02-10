import { FC, useEffect } from 'react';
import { useHistory } from 'react-router';
import {
  iconCheckPurple,
  iconContained,
  iconCovered,
  iconPadded,
  iconUploadLogo,
  Site,
  Medium,
  Instagram,
  Telegram,
  Twitter,
  Discord,
} from 'assets/img';
import cn from 'classnames';
import { Button, H6, RequiredMark, Switch, Text, TextArea, TextInput, Uploader } from 'components';
import { Field, Form, FormikProps } from 'formik';
import { observer } from 'mobx-react-lite';

import styles from './CreateCollection.module.scss';
import { useMst } from 'store';

export interface ICreateCollectionForm {
  name: string;
  symbol: string;
  isSingle?: boolean; // standart
  description: string;
  media: string;
  preview: string;
  cover: string;
  coverPreview: string;
  isLoading: boolean;
  isNsfw: boolean;
  shortUrl: string;
  displayTheme: 'Padded' | 'Contained' | 'Covered';
  site: string;
  discord: string;
  twitter: string;
  instagram: string;
  medium: string;
  telegram: string;
}

const themes = [
  {
    value: 'Padded',
    text: 'Recommended for assets with transparent background',
    icon: iconPadded,
  },
  {
    value: 'Contained',
    text: 'Recommended for assets that are not a 1:1 ratio',
    icon: iconContained,
  },
  {
    value: 'Covered',
    text: 'Recommended for assets that can extend to the edge',
    icon: iconCovered,
  },
];

const CreateCollectionForm: FC<FormikProps<ICreateCollectionForm> & ICreateCollectionForm> =
  observer(
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
      const handleClearImg = () => {
        setFieldValue('media', '');
        setFieldValue('preview', '');
      };
      const handleClearCover = () => {
        setFieldValue('cover', '');
        setFieldValue('coverPreview', '');
      };
      const onSubmit = () => {
        handleSubmit();
      };
      const onCancel = () => {
        history.goBack();
      };

      useEffect(() => {
        setFieldValue('isSingle', isSingle);
      }, [isSingle, setFieldValue]);

      useEffect(() => {
        setFieldValue('details', details.getItems);
      }, [details.getItems, setFieldValue]);

      return (
        <>
          <Form name="form-create" className={styles.form}>
            <div className={cn(styles.column, styles.columnUpload)}>
              <div className={styles.item}>
                <div>
                  <H6 className={styles.uploadTitle}>
                    Logo image <RequiredMark />
                  </H6>
                  <Text className={styles.uploadSubtitle}>
                    This image will also be used for navigation. 350 x 350 recommended.
                  </Text>
                </div>
                {values.media ? (
                  <div className={styles.previewImg}>
                    <img src={values.preview} alt="Media" />
                  </div>
                ) : (
                  <>
                    <div className={cn(styles.file, styles.fileLogo)}>
                      <Field
                        name="media"
                        className={styles.load}
                        required
                        render={() => <Uploader isImgOnly formikValue="media" />}
                      />
                      <div className={styles.capture}>
                        <div className={styles.icon}>
                          <img alt="" src={iconUploadLogo} />
                        </div>
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
              <div className={styles.item}>
                <div>
                  <H6 className={styles.uploadTitle}>
                    Banner image <RequiredMark />
                  </H6>
                  <Text className={styles.uploadSubtitle}>
                    This image will appear at the top of your collection page. Avoid including too
                    much text in this banner image, as the dimensions change on different devices.
                    1400 x 400 recommended.
                  </Text>
                </div>
                {values.cover ? (
                  <div className={styles.coverImg}>
                    <img src={values.coverPreview} alt="Cover" className={styles.coverPreview} />
                  </div>
                ) : (
                  <>
                    <div className={cn(styles.file, styles.fileBanner)}>
                      <Field
                        name="cover"
                        className={styles.load}
                        required
                        render={() => <Uploader formikValue="cover" />}
                      />
                      <div className={styles.capture}>
                        <div className={styles.icon}>
                          <img alt="" src={iconUploadLogo} />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {values.cover && (
                  <Button className={styles.clean} onClick={handleClearCover}>
                    Clear
                  </Button>
                )}
              </div>
            </div>
            <div className={styles.column}>
              <div className={styles.item}>
                <div className={styles.fieldset}>
                  <H6 className={styles.fieldsetTitle}>Collection Details</H6>
                  <Field
                    render={() => (
                      <TextInput
                        label={
                          <>
                            Name <RequiredMark />
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
                  {touched.name && errors.name && <Text color="red">{errors.name}</Text>}
                  <Field
                    render={() => (
                      <TextInput
                        label={
                          <>
                            Symbol <RequiredMark />
                          </>
                        }
                        name="symbol"
                        type="text"
                        placeholder="Enter Token symbol"
                        value={values.symbol}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={styles.field}
                        required
                      />
                    )}
                  />
                  {touched.symbol && errors.symbol && <Text color="red">{errors.symbol}</Text>}
                  <Field
                    render={() => (
                      <TextInput
                        label="URL"
                        subtitle={
                          <>
                            Customize your URL on Less-Nft. Must only contain lowercase
                            letters,numbers, and hyphens.
                          </>
                        }
                        name="shortUrl"
                        type="text"
                        placeholder="Enter your link"
                        value={values.shortUrl}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={styles.field}
                        required
                      />
                    )}
                  />
                  {touched.shortUrl && errors.shortUrl && (
                    <Text color="red">{errors.shortUrl}</Text>
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
                </div>
              </div>
              <div className={styles.item}>
                <div className={styles.socials}>
                  {touched.site && errors.site && <Text color="red">{errors.site}</Text>}
                  <div className={styles.social}>
                    <Site />

                    <Field
                      name="site"
                      render={() => (
                        <TextInput
                          label=""
                          onChange={handleChange}
                          value={values.site}
                          name="site"
                          placeholder="yoursite.io"
                          type="text"
                          className={styles.socialInput}
                          prefixClassName={styles.socialPrefix}
                        />
                      )}
                    />
                  </div>
                  <div className={styles.social}>
                    <Discord />

                    <Field
                      name="discord"
                      render={() => (
                        <TextInput
                          label=""
                          onChange={handleChange}
                          value={values.discord}
                          name="discord"
                          placeholder="discord"
                          type="text"
                          className={styles.socialInput}
                          prefixClassName={styles.socialPrefix}
                          prefix="https://discord.gg/"
                        />
                      )}
                    />
                  </div>
                  <div className={styles.social}>
                    <Twitter />

                    <Field
                      name="twitter"
                      render={() => (
                        <TextInput
                          label=""
                          onChange={handleChange}
                          value={values.twitter}
                          name="twitter"
                          placeholder="twitter"
                          type="text"
                          className={styles.socialInput}
                          prefixClassName={styles.socialPrefix}
                          prefix="https://twitter.com/"
                        />
                      )}
                    />
                  </div>
                  <div className={styles.social}>
                    <Instagram />

                    <Field
                      name="instagram"
                      render={() => (
                        <TextInput
                          label=""
                          onChange={handleChange}
                          value={values.instagram}
                          name="instagram"
                          placeholder="instagram"
                          type="text"
                          className={styles.socialInput}
                          prefixClassName={styles.socialPrefix}
                          prefix="https://www.instagram.com/"
                        />
                      )}
                    />
                  </div>
                  <div className={styles.social}>
                    <Medium />

                    <Field
                      name="medium"
                      render={() => (
                        <TextInput
                          label=""
                          onChange={handleChange}
                          value={values.medium}
                          name="medium"
                          placeholder="medium"
                          type="text"
                          className={styles.socialInput}
                          prefixClassName={styles.socialPrefix}
                          prefix="https://www.medium.com/@"
                        />
                      )}
                    />
                  </div>
                  <div className={styles.social}>
                    <Telegram />

                    <Field
                      name="telegram"
                      render={() => (
                        <TextInput
                          label=""
                          onChange={handleChange}
                          value={values.telegram}
                          name="telegram"
                          placeholder="telegram"
                          type="text"
                          className={styles.socialInput}
                          prefixClassName={styles.socialPrefix}
                          prefix="https://t.me/"
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
              <div className={cn(styles.item, styles.themes)}>
                <div>
                  <H6 className={styles.fieldsetTitle}>Display theme</H6>
                  <Text>Change how your items are shown.</Text>
                </div>
                <div className={styles.themesWrapper}>
                  {themes.map((theme: any) => (
                    <div
                      className={cn(styles.theme, {
                        [styles.active]: theme.value === values.displayTheme,
                      })}
                      tabIndex={0}
                      role="button"
                      onKeyDown={() => {}}
                      onClick={() => setFieldValue('displayTheme', theme.value)}
                    >
                      {theme.value === values.displayTheme && (
                        <img alt="" src={iconCheckPurple} className={styles.check} />
                      )}
                      <img alt={theme.value} src={theme.icon} />
                      <Text className={styles.themeTitle} weight="bold">
                        {theme.value}
                      </Text>
                      <Text className={styles.themeText}>{theme.text}</Text>
                    </div>
                  ))}
                </div>
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
              <div className={styles.btns}>
                <Button
                  className={cn('button', styles.button, styles.submitBtn)}
                  onClick={onSubmit}
                  disabled={
                    values.isLoading ||
                    !!Object.keys(errors).length ||
                    (!values.media && !values.cover)
                  }
                >
                  Create
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

export default CreateCollectionForm;
