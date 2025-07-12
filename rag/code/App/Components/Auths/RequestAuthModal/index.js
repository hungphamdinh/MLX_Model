import React, { useEffect, useState } from 'react';
import { Modal, Alert } from 'react-native';
import styled from 'styled-components/native';
import I18n from '@I18n';
import NavigationServices from '@NavigationService';
import _ from 'lodash';
import isEmpty from 'lodash/isEmpty';
import UserInactivity from 'react-native-user-inactivity';
import { FormProvider } from 'react-hook-form';
import ReactNativeBiometrics from 'react-native-biometrics';
import { useKeyboard } from '@react-native-community/hooks';
import { Button, Image, Text } from '../../../Elements';
import { ImageResource, Metric } from '../../../Themes';
import useUser from '../../../Context/User/Hooks/UseUser';
import { clearAuth } from '../../../Context/App/Hooks/UseApp';
import { useCompatibleForm } from '../../../Utils/hook';
import BiometricButton, { buttonTypes } from './BiometricButton';
import useBackgroundTime from '../Hooks/useBackgroundTime';
import { handleBiometricError } from '../../../Utils/func';
import { BIOMETRIC_STATUS } from '../../../Config/Constants';
import AwareScrollView from '../../Layout/AwareScrollView';
import { FormPinCode } from '../../Forms';
import { SetupPinCodeModal } from '../../../Screens/Auths/SetupPinCode';
import Row from '../../Grid/Row';

const Wrapper = styled.View`
  flex: 1;
  padding-top: ${Metric.ScreenHeight / 6}px;
  background-color: #f6f8fd;
`;

const ContentWrapper = styled.View`
  flex: 1;
  padding-horizontal: 40px;
`;

const CenterWrapper = styled.View`
  align-items: center;
`;

const Avatar = styled(Image)`
  width: 180px;
  height: 180px;
  border-radius: 90px;
`;

const ActionWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const UserName = styled(Text)`
  font-size: 16px;
  margin-top: 20px;
`;

const NoticeText = styled(Text)`
  margin-top: 20px;
  text-align: center;
}`;

const NoticeCredentialText = styled(Text)`
  margin-top: 5px;
  margin-bottom: 20px;
  text-align: center;
`;

const Wallpaper = styled.ImageBackground`
  width: 100%;
  height: 300px;
  position: absolute;
  bottom: 0px;
  left: 0px;
`;

const LogoutButton = styled.TouchableOpacity`
  position: absolute;
  bottom: 30px;
  left: 0px;
  right: 0px;
  align-items: center;
`;

const LogoutTitle = styled(Text)`
  text-decoration-line: underline;
  font-size: 14px;
`;

const ContinueButton = styled(Button).attrs({
  containerStyle: {
    marginBottom: 0,
    flex: 1,
  },
})``;

const ButtonWrapper = styled(Row)`
  justify-content: space-around;
`;

const SetUpButton = styled(Button)`
  font-size: 12px;
`;

const rnBiometrics = new ReactNativeBiometrics({
  allowDeviceCredentials: true,
});

const RequestAuthModal = ({ children }) => {
  const {
    user: { user, profilePicture, visibleAuthConfirm, securitySetting, isLoggedIn, biometricSetting, visibleSetupPin },
    checkAuthenWithPin,
    setVisibleAuthConfirmModal,
    setVisibleSetupPinModal,
  } = useUser();

  const routeName = NavigationServices.getCurrentRoute();
  const formMethods = useCompatibleForm({
    defaultValues: {
      pinCode: '',
    },
  });
  const keyboard = useKeyboard();
  const { watch, handleSubmit, setValue } = formMethods;
  const pinCode = watch('pinCode');

  const [active, setActive] = useState(true);

  const emailAddress = _.get(user, 'emailAddress');

  const sessionTimeout = (_.get(securitySetting, 'sessionTimeoutForHubApp') || 99999) * 60000;
  const isEnableIdle =
    _.get(securitySetting, 'sessionTimeoutForHubApp', 0) > 0 && _.get(securitySetting, 'isSessionTimeoutForHubApp');

  const isBiometricAuthenticationAdmin = _.get(securitySetting, 'isBiometricAuthenticationAdmin');
  const allowBiometric =
    isBiometricAuthenticationAdmin && _.includes([BIOMETRIC_STATUS.ON, BIOMETRIC_STATUS.SESSION], biometricSetting);

  const [availableSensor, setAvailableSensor] = useState(undefined);
  const isFaceID = availableSensor === 'FaceID';

  // handle case the app is in background mode
  useBackgroundTime(sessionTimeout);

  const onAction = (isActive) => {
    if (!isActive && isLoggedIn) {
      setVisibleAuthConfirmModal(true);
    }

    setActive(isActive);
  };

  const isBiometricSupport = async () => {
    const { available, biometryType } = await rnBiometrics.isSensorAvailable();
    if (available && biometryType) {
      setAvailableSensor(biometryType);
    }
  };

  useEffect(() => {
    isBiometricSupport();
  }, []);

  const onLogout = () => {
    clearAuth();
  };

  const btLogoutPress = () => {
    Alert.alert(
      I18n.t('PROFILE_LOGOUT_TITLE'),
      I18n.t('PROFILE_LOGOUT_CONTENT'),
      [
        {
          text: I18n.t('PROFILE_LOGOUT_OK'),
          onPress: onLogout,
        },
        {
          text: I18n.t('PROFILE_LOGOUT_CANCEL'),
          style: 'cancel',
        },
      ],
      { cancelable: false }
    );
  };

  const onBiometryPress = async () => {
    try {
      const promptMessage = isFaceID
        ? I18n.t('AUTH_SCAN_YOUR_FACE_DESCRIPTION')
        : I18n.t('AUTH_SCAN_YOUR_FINGER_DESCRIPTION');
      const result = await rnBiometrics.simplePrompt({ promptMessage });
      if (result.success) {
        setVisibleAuthConfirmModal(false);
        setValue('pinCode', '');
        if (routeName.name === 'biometric') {
          NavigationServices.goBack();
        }
      }
    } catch (error) {
      handleBiometricError(isFaceID, error.message);
    }
  };

  const verifyPinCode = async (code) => {
    await checkAuthenWithPin({ username: emailAddress, pinCode: code });
    setValue('pinCode', '');
  };

  const onSubmit = async () => {
    verifyPinCode(pinCode);
  };

  const btSetPinPress = () => {
    setVisibleSetupPinModal(true);
  };

  const onCloseSetupPin = () => {
    setVisibleSetupPinModal(false);
  };

  const btSetBiometricPress = () => {
    NavigationServices.navigate('Setting', {
      fromRequestAuth: true,
    });
    setVisibleAuthConfirmModal(false);
  };

  const getContents = () => {
    if (showSetupPinButton && user) {
      if (allowBiometric) {
        return (
          <BiometricButton onPress={onBiometryPress} availableSensor={availableSensor} type={buttonTypes.rectangle} />
        );
      }

      return (
        <ButtonWrapper>
          <SetUpButton primary rounded title="BTN_SET_PIN" onPress={btSetPinPress} />
          {isBiometricAuthenticationAdmin && (
            <SetUpButton primary rounded title="BTN_SET_UP_BIOMETRIC" onPress={btSetBiometricPress} />
          )}
        </ButtonWrapper>
      );
    }

    return (
      <FormProvider {...formMethods}>
        <FormPinCode name="pinCode" onCompleteInput={verifyPinCode} secureText />
        <ActionWrapper>
          <ContinueButton
            primary
            rounded
            title={I18n.t('IDLE_TIME_OUT_BTN_CONTINUE')}
            onPress={handleSubmit(onSubmit)}
            disabled={_.size(pinCode) === 0}
          />
          {allowBiometric && <BiometricButton onPress={onBiometryPress} availableSensor={availableSensor} />}
        </ActionWrapper>
      </FormProvider>
    );
  };

  const visibleModal = isLoggedIn && visibleAuthConfirm && isEnableIdle;
  const showSetupPinButton = visibleModal && !user?.hasPinCode;

  return (
    <UserInactivity isActive={active} timeForInactivity={sessionTimeout} onAction={onAction} style={{ flex: 1 }}>
      {children}
      <Modal visible={visibleModal}>
        <Wrapper>
          <Wallpaper source={ImageResource.IMG_LOGIN_BACKGROUND} />
          <AwareScrollView>
            <ContentWrapper>
              <CenterWrapper>
                <Avatar source={isEmpty(profilePicture) ? ImageResource.IMG_AvatarDefault : { uri: profilePicture }} />
                <UserName preset="medium" text={_.get(user, 'displayName')} />
                <NoticeText text="IDLE_TIME_OUT_NOTICE" />
                <NoticeCredentialText text="IDLE_TIME_OUT_INPUT_CREDENTIAL_NOTICE" />
              </CenterWrapper>
              {getContents()}
            </ContentWrapper>
          </AwareScrollView>
          {!keyboard.keyboardShown && (
            <LogoutButton testID="logout-button" onPress={btLogoutPress}>
              <LogoutTitle text="PROFILE_BTN_LOGOUT" />
            </LogoutButton>
          )}
        </Wrapper>
        <SetupPinCodeModal visible={visibleSetupPin} onClosePress={onCloseSetupPin} />
      </Modal>
    </UserInactivity>
  );
};

export default RequestAuthModal;
