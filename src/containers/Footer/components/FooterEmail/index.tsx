import { FC, useCallback, useState } from 'react';
import cx from 'classnames';
import { Text, TextInput } from 'components';

import styles from './styles.module.scss';
import { userApi } from 'services';
import { toast } from 'react-toastify';

type Props = {
  className?: string;
};

const FooterEmail: FC<Props> = ({ className }) => {
  const [email, setEmail] = useState('');
  const saveEmail = useCallback(() => {
    userApi
      .saveEmailToDb(email)
      .then(() => toast.success('Email saved'))
      .catch(({ response }) => {
        toast.error(
          response && response.data && response.data.address
            ? `${response.data.address}`
            : 'Something went wrong',
        );
        console.error(response);
      });
  }, [email]);
  return (
    <div className={cx(styles.footerEmail, className)}>
      <Text size="xxl" color="white" weight="bold">
        Stay in the loop
      </Text>
      <Text size="m" color="white" className={styles.text}>
        Join our mailing list to stay in the loop with our newest feature releases, NFT drops, and
        tips and tricks for navigating Nftcrowd.
      </Text>
      <TextInput
        isButton
        placeholder="Enter your email"
        type="text"
        className={styles.button}
        onChange={(e: any) => setEmail(e.target.value)}
        onButtonClick={saveEmail}
      />
    </div>
  );
};

export default FooterEmail;
