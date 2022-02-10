import { FC, useCallback, useState } from 'react';
import { toast } from 'react-toastify';

import { routes, zeroAddress } from 'appConstants';
import {
  iconAddBlack,
  IconEdit,
  iconSettingsWhite,
  profile_avatar_example,
  profile_page_bg_example,
} from 'assets/img';
import { Button, Copyable, H2, Text, Uploader } from 'components';
import { useFetchUser, useFollow } from 'hooks';
import { observer } from 'mobx-react-lite';
import { userApi } from 'services';
import { useMst } from 'store';
import { sliceString } from 'utils';

import s from './UserMainInfo.module.scss';

interface IProps {
  userId: string;
  setCurrentUser: any;
}

const UserMainInfo: FC<IProps> = observer(({ userId, setCurrentUser }) => {
  const { user } = useMst();
  // TODO: handle user load
  const [, setIsUserLoading] = useState(false);
  const [isFileLoading, setIsFileLoading] = useState(false);
  const [isFollowClickPending, setIsFollowClickPending] = useState(false);
  const [userCover, setUserCover] = useState('');
  const {
    user: shownUser,
    isSelf,
    isFollowed,
    setIsFollowed,
  } = useFetchUser({
    id: userId,
    setLoading: setIsUserLoading,
    successCallback: setCurrentUser,
  });
  const { handleFollowClick } = useFollow({
    setLoading: setIsFollowClickPending,
    id: userId,
    initialState: isFollowed,
    successCallback: setIsFollowed,
  });

  const handleFileUpload = useCallback(
    (file: File) => {
      setIsFileLoading(true);
      const fileData = new FormData();
      fileData.append('cover', file);
      userApi
        .setUserCover(fileData)
        .then(({ data }) => {
          toast.success('Cover uploaded');
          user.setCover(data);
          setUserCover(data);
        })
        .catch((err) => {
          toast.error('Error on unfollow');
          console.error(err, 'set cover');
        })
        .finally(() => {
          setIsFileLoading(false);
        });
    },
    [user],
  );

  return (
    <section
      className={s.user}
      style={{
        backgroundImage: `url(${userCover || shownUser.cover || profile_page_bg_example})`,
      }}
    >
      <div className={s.inner}>
        <div className={s.user_avatar}>
          <img
            src={shownUser.avatar || profile_avatar_example}
            alt="profile_avatar_example"
            width={130}
            height={130}
          />
          {shownUser.is_verificated && <div className={s.isVerified} />}
        </div>
        <H2 className={s.user_name} color="white">
          {shownUser.display_name || 'User Name'}
        </H2>
        <div className={s.user_info}>
          <Copyable
            valueToCopy={shownUser.address || zeroAddress}
            classNameIcon={s.user_info__icon}
            withIcon
            title="Address"
          >
            <Text size="m" color="white">
              {sliceString(shownUser.address || zeroAddress)}
            </Text>
          </Copyable>
        </div>
        <div className={s.user_buttons}>
          {user.address && isSelf && (
            <>
              <Uploader
                isImgOnly
                isButton
                handleUpload={handleFileUpload}
                isLoading={isFileLoading}
              >
                <div className={s.user_button}>
                  <IconEdit />
                  <Text tag="span" color="white" weight="medium" className={s.user_edit}>
                    Edit Banner
                  </Text>
                </div>
              </Uploader>
              <Button className={s.user_button} color="outline" href={routes.profile.edit}>
                <img src={iconSettingsWhite} alt="" />
                <Text tag="span" color="white" weight="medium" className={s.user_edit}>
                  Edit Profile
                </Text>
              </Button>
            </>
          )}
          {user.address && !isSelf && (
            <Button
              className={s.user_button}
              color={isFollowed ? 'outline' : 'purple'}
              onClick={handleFollowClick}
              disabled={isFollowClickPending}
            >
              {!isFollowed && <img src={iconAddBlack} alt="plus icon" />}
              {isFollowed ? 'Unfollow' : 'Follow'}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
});

export default UserMainInfo;
