import { FC } from 'react';
import { IExtendedInfo } from 'typings';
import styles from './About.module.scss';
import { H3, Text } from 'components';
import {
  iconFacebookOutline,
  iconInstagramOutline,
  iconSiteOutline,
  iconTwitterOutline,
} from 'assets/img';
import moment from 'moment';

interface IProps {
  currentUser: IExtendedInfo;
}

const About: FC<IProps> = (props) => {
  const { currentUser } = props;
  return (
    <>
      <div className={styles.column}>
        <div className={styles.header}>
          <H3 className={styles.title}>About Me</H3>
          <ul className={styles.info}>
            <li>
              <Text size="l" weight="medium" color="darkenGray">
                <Text tag="span" weight="bold" size="l">
                  {currentUser.followers_count || 0}
                </Text>{' '}
                Followers
              </Text>
            </li>
            <li>
              <Text weight="medium" size="l" color="darkenGray">
                <Text tag="span" weight="bold" size="l">
                  {currentUser.follows_count || 0}
                </Text>{' '}
                Following
              </Text>
            </li>
          </ul>
        </div>
        <Text className={styles.description} color="black" size="m">
          {currentUser.bio}
        </Text>
      </div>
      <div className={styles.column}>
        <H3 className={styles.title}>Available Contact</H3>
        <Text tag="p" size="m" className={styles.subtitle}>
          Just Hit me up on these links bellow.
        </Text>
        <ul className={styles.socials}>
          {currentUser.twitter && (
            <li>
              <a
                href={`https://twitter.com/${currentUser.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.social}
              >
                <img src={iconTwitterOutline} alt="twitter" width={16} height={16} />
                <Text size="m">@{currentUser.twitter}</Text>
              </a>
            </li>
          )}
          {currentUser.instagram && (
            <li>
              <a
                href={`https://instagram.com/${currentUser.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.social}
              >
                <img src={iconInstagramOutline} alt="instagram" width={16} height={16} />
                <Text size="m">@{currentUser.instagram}</Text>
              </a>
            </li>
          )}
          {currentUser.facebook && (
            <li>
              <a
                href={`https://facebook.com/${currentUser.facebook}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.social}
              >
                <img src={iconFacebookOutline} alt="twitter" width={16} height={16} />
                <Text size="m">@{currentUser.facebook}</Text>
              </a>
            </li>
          )}
          {currentUser.site && (
            <li>
              <a
                href={`${currentUser.site}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.social}
              >
                <img src={iconSiteOutline} alt="site" width={16} height={16} />
                <Text size="m">{currentUser.site}</Text>
              </a>
            </li>
          )}
          {!currentUser.twitter &&
            !currentUser.instagram &&
            !currentUser.facebook &&
            !currentUser.site && (
              <li>
                <Text size="m">Not provided yet</Text>
              </li>
            )}
        </ul>
        <Text color="darkenGray" size="m" className={styles.registered}>
          Member since {moment(currentUser.created_at).format('MMM D, YYYY')}
        </Text>
      </div>
    </>
  );
};
export default About;
