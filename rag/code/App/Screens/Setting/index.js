import React, { useState, Fragment } from 'react';
import _ from 'lodash';
import { Alert, Pressable } from 'react-native';
import I18n from '@I18n';
import DeviceInfo from 'react-native-device-info';
import styled from 'styled-components/native';
import { Text } from '@Elements';
import NavigationService from '@NavigationService';

import ItemSetting from '../../Components/Settings/SettingItem';
import { icons } from '../../Resources/icon';
import BaseLayout from '../../Components/Layout/BaseLayout';
import useApp from '../../Context/App/Hooks/UseApp';
import useUser from '../../Context/User/Hooks/UseUser';
import { toast } from '../../Utils';
import useSavillsAccount from '../../Components/Auths/Hooks/useSavillsAccount';
import CredentialsModal from '../../Components/Biometric/CredentialsModal';
import SwitchOffModal from '../../Components/Biometric/SwitchOffModal';
import { BIOMETRIC_STATUS } from '../../Config/Constants';
import BiometricOption from './BiometricOption';

const VersionWrapper = styled.SafeAreaView`
  position: absolute;
  bottom: 10px;
  right: 15px;
`;

const VersionText = styled(Text)``;

const data = [
  {
    icon: icons.profile,
    title: 'SETTING_PROFILE',
    screen: 'Profile',
  },
  {
    icon: icons.settingLanguage,
    title: 'ST_LANGUAGE',
    screen: 'ChangeLanguage',
  },
  {
    icon: icons.bellBlack,
    title: 'PROFILE_BTN_SETTING',
    screen: 'SettingNotification',
  },
  {
    icon: icons.inspection,
    title: 'ST_INSPECTION_SYNC',
    screen: 'inspectionSyncSetting',
  },
  {
    icon: icons.lockBlack,
    title: 'PROFILE_BTN_CHANGEPASS',
    screen: 'changePassword',
  },
  {
    icon: icons.pin,
    title: 'BTN_SET_PIN',
    screen: 'setupPinCode',
  },
  {
    icon: icons.pin,
    title: 'AUTH_BTN_FORGOT_PIN',
    screen: 'forgotPinCode',
  },
  {
    icon: icons.logout,
    title: 'PROFILE_BTN_LOGOUT',
    logout: true,
  },
];

const Setting = ({ navigation }) => {
  const { logout, setDeveloperMode, getBiometricTermConditions } = useApp();
  const {
    user: { biometricSetting, securitySetting },
    updateUserBiometric,
    setVisibleAuthConfirmModal,
  } = useUser();
  const isSavillsEmail = useSavillsAccount();

  const [versionCount, setVersionCount] = useState(0);
  const fromRequestAuth = navigation.getParam('fromRequestAuth');
  const [isBiometric, setIsBiometric] = useState(
    _.includes([BIOMETRIC_STATUS.ON, BIOMETRIC_STATUS.SESSION], biometricSetting)
  );
  const [modalCredentialsVisible, setModalCredentialsVisible] = useState(false);
  const [modalSwitchOffVisible, setModalSwitchOffVisible] = useState(false);

  const {
    user: { user },
  } = useUser();

  const isSavillsAccount = useSavillsAccount();
  const hasPinCode = user?.hasPinCode;

  React.useEffect(() => {
    getBiometricTermConditions();
    return () => {
      if (fromRequestAuth) {
        setVisibleAuthConfirmModal(true);
      }
    };
  }, []);

  const onLogout = () => {
    logout();
  };

  const onItemPress = (item) => {
    if (item.logout) {
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
      return;
    }

    NavigationService.navigate(item.screen, item.params);
  };

  const btVersionPress = () => {
    const newVersionCount = versionCount + 1;
    if (newVersionCount === 10) {
      setDeveloperMode(true);
      toast.showSuccess(I18n.t('DEVELOPER_MODE_ON'));
      return;
    }
    setVersionCount(newVersionCount);
  };

  const renderSettingItem = (item) => {
    if ((isSavillsAccount && item.screen === 'changePassword') || (item.screen === 'forgotPinCode' && !hasPinCode)) {
      return null;
    }

    if (item.screen === 'setupPinCode' && hasPinCode) {
      item.screen = 'changePinCode';
      item.title = 'BTN_CHANGE_PIN';
    }

    return <ItemSetting title={item.title} icon={item.icon} onPress={() => onItemPress(item)} logout={item.logout} />;
  };

  const version = `${I18n.t('ST_VERSION')} ${DeviceInfo.getVersion()} (${DeviceInfo.getBuildNumber()})`;

  const changeSwitchValue = (turnOn) => {
    if (turnOn) {
      NavigationService.navigate('biometricTermConditions', {
        onAgree: onEnableCredentials,
        onGoBack: () => {
          setIsBiometric(false);
        },
      });
      return;
    }
    setModalSwitchOffVisible(true);
  };

  const onCloseSwitchOff = () => {
    setModalSwitchOffVisible(false);
  };

  const onCloseCredential = () => {
    setModalCredentialsVisible(false);
  };

  const onEnableCredentials = () => {
    setIsBiometric(true);
    if (isSavillsEmail) {
      updateUserBiometric(BIOMETRIC_STATUS.SESSION);
      return;
    }
    setModalCredentialsVisible(true);
  };

  const onCredentialEnabled = () => {
    setIsBiometric(!isBiometric);
    setModalCredentialsVisible(false);
  };

  const onSwitchOff = () => {
    setModalSwitchOffVisible(false);
    setIsBiometric(!isBiometric);
  };

  return (
    <BaseLayout title="SETTING_TITLE">
      {securitySetting.isBiometricAuthenticationAdmin && (
        <BiometricOption isBiometric={isBiometric} changeSwitchValue={changeSwitchValue} />
      )}

      {data.map((item) => (
        <Fragment key={item.title}>{renderSettingItem(item)}</Fragment>
      ))}
      <VersionWrapper>
        <Pressable onPress={btVersionPress} activeOpacity={1}>
          <VersionText text={version} />
        </Pressable>
      </VersionWrapper>
      <CredentialsModal
        visible={modalCredentialsVisible}
        onClosePress={onCloseCredential}
        onSuccess={onCredentialEnabled}
      />
      <SwitchOffModal visible={modalSwitchOffVisible} onSuccess={onSwitchOff} onClosePress={onCloseSwitchOff} />
    </BaseLayout>
  );
};

export default Setting;
