import React, { useState } from 'react';
import styled from 'styled-components/native';
import _ from 'lodash';
import NavigationService from '@NavigationService';
import { Button, Card } from '@Elements';
import { FormProvider } from 'react-hook-form';
import { icons } from '../../../Resources/icon';
import FormInput from '../../../Components/Forms/FormInput';
import BaseLayout from '../../../Components/Layout/BaseLayout';
import useUser from '../../../Context/User/Hooks/UseUser';
import { Colors } from '../../../Themes';
import { SelectImageOptionsModal } from '../../../Components';
import { useCompatibleForm } from '../../../Utils/hook';

const InfoWrapper = styled.View`
  flex: 1;
`;

const DisplayNameInput = styled(FormInput).attrs(() => ({
  containerStyle: {
    marginBottom: 6,
  },
}))`
  font-size: 18px;
`;

const AvatarWrapper = styled.View`
  background-color: white;
  flex-direction: row;
  align-items: center;
  padding-vertical: 14px;
  padding-horizontal: 24px;
  margin-bottom: 10px;
`;

const AvatarButton = styled.TouchableOpacity`
  margin-right: 10px;
`;

const Avatar = styled.Image`
  width: 144px;
  height: 144px;
  border-radius: 72px;
`;

const UnitButton = styled(Button).attrs(() => ({
  containerStyle: {
    width: '100%',
    height: 33,
    backgroundColor: 'white',
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 17,
    justifyContent: 'flex-start',
  },
}))`
  color: ${Colors.azure};
  font-size: 11px;
  font-family: Gotham-Book;
  font-weight: normal;
  text-align: left;
`;

const SaveButton = styled(Button).attrs(() => ({
  containerStyle: {
    marginTop: 60,
    marginBottom: 50,
  },
}))``;

const Profile = () => {
  const {
    user: { tenant, user, profilePicture, accountUserId, isLoading },
    getLinkedAccount,
    updateProfile,
  } = useUser();

  const [localImage, setLocalImage] = useState(undefined);

  const pickerRef = React.createRef();

  const formMethods = useCompatibleForm({
    defaultValues: {
      displayName: user.displayName,
      emailAddress: user.emailAddress,
      phoneNumber: user.phoneNumber,
      isBiometric: false,
    },
  });

  const getAvatar = () => {
    if (localImage) {
      return { uri: localImage.path };
    }

    return _.size(profilePicture) > 0 ? { uri: profilePicture } : icons.avatarDefault;
  };

  const btPickPress = async () => {
    pickerRef.current?.shown(true);
  };

  const onUpdateAvatar = () => {
    updateProfile({ file: localImage.path });
  };

  const onSelectedImage = (file) => {
    setLocalImage(_.first(file));
    // actions.userProfile.changeAvatarProfile({
    //   path: localImage.uri,
    //   fileName: localImage.filename,
    //   mimeType: localImage.mime,
    // });
  };

  const onChangeTenant = () => {
    // actions.account.getTenantList(false);
    // actions.units.getUnits();
    getLinkedAccount({
      userId: accountUserId,
    });
    NavigationService.navigateFromRoot('selectTenant');
  };

  return (
    <BaseLayout loading={isLoading} title="SETTING_PROFILE">
      <FormProvider {...formMethods}>
        <AvatarWrapper>
          <AvatarButton onPress={btPickPress}>
            <Avatar source={getAvatar()} />
          </AvatarButton>
          <InfoWrapper>
            <DisplayNameInput editable={false} name="displayName" height={33} />
            <UnitButton title={tenant?.name} onPress={onChangeTenant} />
          </InfoWrapper>
        </AvatarWrapper>
        <Card>
          <FormInput mode="small" editable={false} label="PROFILE_TXT_EMAIL" name="emailAddress" />
          <FormInput mode="small" editable={false} label="PROFILE_TXT_PHONE" name="phoneNumber" />

          <SaveButton title="AD_COMMON_SAVE" primary rounded disabled={!localImage} onPress={onUpdateAvatar} />
        </Card>
      </FormProvider>
      <SelectImageOptionsModal ref={pickerRef} onSelectedImage={onSelectedImage} multiple={false} />
    </BaseLayout>
  );
};

export default Profile;
