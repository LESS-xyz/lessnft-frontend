import { useHistory } from 'react-router';
import { toast } from 'react-toastify';
import { ToastContentWithTxHash } from 'components';
import { withFormik } from 'formik';
import { observer } from 'mobx-react-lite';
import { useWalletConnectorContext } from 'services';
import { storeApi } from 'services/api';
import { useMst } from 'store';
import * as Yup from 'yup';

import CreateForm, { ICreateForm } from '../component';
import { routes } from 'appConstants';
import { dateFormatter } from 'utils/dateFormatter';

export default observer(({ isSingle }: any) => {
  const history = useHistory();
  const walletConnector = useWalletConnectorContext();
  const { user } = useMst();
  const props: ICreateForm = {
    name: '',
    isSingle: true,
    totalSupply: 1,
    currency: '',
    description: '',
    price: 0,
    minimalBid: 0,
    creatorRoyalty: 10,
    collection: 25,
    details: [{ name: '', amount: '' }],
    selling: true,
    media: '',
    cover: '',
    coverPreview: '',
    format: 'image',
    preview: '',
    sellMethod: 'fixedPrice',
    isLoading: false,
    unlockOncePurchased: false,
    digitalKey: '',
    isTimedAuction: false,
    startAuction: 'Right after listing',
    endAuction: '1 Day',
    externalLink: '',
    isNsfw: false,
  };
  const FormWithFormik = withFormik<any, ICreateForm>({
    enableReinitialize: true,
    mapPropsToValues: () => props,

    validationSchema: Yup.object().shape({
      name: Yup.string().min(2, 'Too short!').max(50, 'Too long!'),
      totalSupply: Yup.number().min(1, 'Minimal amount equal to 1!').max(100, 'Too much!'),
      description: Yup.string().max(500, 'Too long!'),
      minimalBid: Yup.number().when('sellMethod', {
        is: 'openForBids',
        then: Yup.number().min(0.0001),
      }),
      price: Yup.number().when('sellMethod', {
        is: 'fixedPrice',
        then: Yup.number().min(0.0001),
      }),
      creatorRoyalty: Yup.number().min(0, 'Minimal royalties equal to 0!').max(80, 'Too much!'),
      externalLink: Yup.string().url(),
    }),
    handleSubmit: (values, { setFieldValue }) => {
      setFieldValue('isLoading', true);

      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('standart', isSingle ? 'ERC721' : 'ERC1155');
      if (!isSingle) {
        formData.append('total_supply', values.totalSupply.toString());
      }
      formData.append('currency', 'less');
      if (values.description) {
        formData.append('description', values.description);
      }
      if (values.sellMethod === 'fixedPrice') {
        formData.append('price', values.price.toString());
      } else {
        formData.append('minimal_bid', values.minimalBid.toString());
      }
      formData.append('creator_royalty', values.creatorRoyalty.toString());
      formData.append('collection', values.collection.toString());
      if (values.isTimedAuction) {
        formData.append('start_auction', dateFormatter(values.startAuction));
        formData.append('end_auction', dateFormatter(values.endAuction));
      }
      formData.append('external_link', values.externalLink);
      formData.append('is_nsfw', values.isNsfw.toString());

      // if (values.details[0].name) {
      const details: any = values.details.filter(
        (item: any) => item.display_type && item.trait_type && item.value && item.max_value,
      );
      //   values.details.forEach((item) => {
      //     if (item.name) {
      //       details[item.name] = item.amount;
      //     }
      //   });
      formData.append('details', JSON.stringify(details));
      // }
      // TODO: change selling from always true
      formData.append('selling', values.selling.toString());

      formData.append('media', values.media);
      if (values.format !== 'image') {
        if (!values.cover) {
          toast.info('Upload a preview for the video');
          setFieldValue('isLoading', false);
          return;
        }

        formData.append('cover', values.cover);
      }
      formData.append('format', values.format);
      if (values.unlockOncePurchased) {
        formData.append('digital_key', values.digitalKey);
      }

      storeApi
        .createToken(formData)
        .then(({ data }) => {
          walletConnector.walletService
            .sendTransaction(data.initial_tx)
            .on('transactionHash', (txHash: string) => {
              toast.info(<ToastContentWithTxHash txHash={txHash} />);
              history.push(`${routes.profile.link(user.id)}?tab=created`);
            })
            .then(() => {
              toast.success('Token Created');
            })
            .catch(({ response }: any) => {
              if (response && response.data && response.data.name) {
                toast.error(response.data.name);
              } else {
                toast.error('Create Token failed');
              }
              storeApi.rejectTransaction({ type: 'token', id: data.token.id });
            })
            .finally(() => {
              setFieldValue('isLoading', false);
            });
        })
        .catch(({ response }) => {
          if (response.data && response.data.name) {
            toast.error(response.data.name);
          } else {
            toast.error('Create Token failed');
          }
          setFieldValue('isLoading', false);
        });
    },

    displayName: 'ChangePasswordForm',
  })(CreateForm);
  return <FormWithFormik isSingle={isSingle} />;
});
