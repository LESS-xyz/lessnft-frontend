import { Button, Text } from 'components';
import { FC } from 'react';
import styles from './styles.module.scss';

interface IProps {
  avatar: string;
  name: string;
  description: string;
  link: string;
  color: string;
}

const NotableDrop: FC<IProps> = ({ avatar, name, description, link, color }) => {
  return (
    <div className={styles.notableDrop} style={{ backgroundColor: color }}>
      <div className={styles.image}>
        <img src={avatar} className={styles.avatar} alt="" />
      </div>
      <div className={styles.info}>
        <Text align='center' className={styles.name} size="xl" color="white">
          {name}
        </Text>
        <Text align="center" className={styles.description} color="white">
          {description}
        </Text>
        <Button href={link} className={styles.button} color="outline">
          Live
        </Button>
      </div>
    </div>
  );
};
export default NotableDrop;
