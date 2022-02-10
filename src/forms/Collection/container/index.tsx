import { useHistory } from 'react-router';
import { toast } from 'react-toastify';
import { ToastContentWithTxHash } from 'components';
import { withFormik } from 'formik';
import { observer } from 'mobx-react-lite';
import { useWalletConnectorContext } from 'services';
import { storeApi } from 'services/api';
import * as Yup from 'yup';

import CreateCollectionForm, { ICreateCollectionForm } from '../component';
import { routes } from 'appConstants';

export default observer(({ isSingle }: any) => {
  const history = useHistory();
  const walletConnector = useWalletConnectorContext();
  const props: ICreateCollectionForm = {
    name: '',
    symbol: '',
    isSingle: true,
    description: '',
    media: '',
    preview: '',
    coverPreview: '',
    cover: '',
    isLoading: false,
    isNsfw: false,
    shortUrl: '',
    displayTheme: 'Padded',
    site: '',
    discord: '',
    twitter: '',
    instagram: '',
    medium: '',
    telegram: '',
  };
  const FormWithFormik = withFormik<any, ICreateCollectionForm>({
    enableReinitialize: true,
    mapPropsToValues: () => props,

    validationSchema: Yup.object().shape({
      name: Yup.string().min(2, 'Too short!').max(50, 'Too long!'),
      symbol: Yup.string().min(2, 'Too Short!').max(6, 'Too Long!').required(),
      description: Yup.string().max(500, 'Too long!'),
      site: Yup.string().url(),
    }),
    handleSubmit: (values, { setFieldValue }) => {
      setFieldValue('isLoading', true);

      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('symbol', values.symbol);
      formData.append('standart', isSingle ? 'ERC721' : 'ERC1155');
      if (values.description) {
        formData.append('description', values.description);
      }
      formData.append('is_nsfw', values.isNsfw.toString());
      formData.append('short_url', values.shortUrl.toString());

      formData.append('avatar', values.media);
      formData.append('cover', values.cover);
      formData.append('site', values.site);
      formData.append('discord', values.discord);
      formData.append('twitter', values.twitter);
      formData.append('instagram', values.instagram);
      formData.append('medium', values.medium);
      formData.append('telegram', values.telegram);
      formData.append('display_theme', values.displayTheme);

      storeApi
        .createCollection(formData)
        .then(({ data }) => {
          walletConnector.walletService
            .sendTransaction(data.initial_tx)
            .on('transactionHash', (txHash: string) => {
              toast.info(<ToastContentWithTxHash txHash={txHash} />);
              history.push(`${isSingle ? routes.create.single : routes.create.multiple}`);
            })
            .then(() => {
              toast.success('Collection Created');
            })
            .catch(({ response }: any) => {
              if (response && response.data && response.data.name) {
                toast.error(response.data.name);
              } else {
                toast.error('Create Collection failed');
              }
              storeApi.rejectTransaction({ type: 'collection', id: data.collection.id });
            })
            .finally(() => {
              setFieldValue('isLoading', false);
            });
        })
        .catch(({ response }) => {
          if (response.data && response.data.name) {
            toast.error(response.data.name);
          } else {
            toast.error('Create Collection failed');
          }
          setFieldValue('isLoading', false);
        });
    },

    displayName: 'ChangePasswordForm',
  })(CreateCollectionForm);
  return <FormWithFormik isSingle={isSingle} />;
});
