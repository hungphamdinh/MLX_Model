import _ from 'lodash';
import * as Yup from 'yup';
import I18n from '@I18n';
import React from 'react';
import PushNotification from 'react-native-push-notification';
import styled from 'styled-components/native';
import { FormProvider } from 'react-hook-form';
import { Button, Text } from '@Elements';
import { FormInput } from '../../../Components/Forms';
import { icons } from '../../../Resources/icon';
import { images } from '../../../Resources/image';
import AwareScrollView from '../../../Components/Layout/AwareScrollView';
import LanguageSelect from '../../../Components/Auths/ChangeLanguage/LanguageSelect';
import useUser from '../../../Context/User/Hooks/UseUser';
import useApp from '../../../Context/App/Hooks/UseApp';
import { checkEmailSavills } from '../../../Utils/regex';
import useHome from '../../../Context/Home/Hooks/UseHome';
import { useCompatibleForm, useYupValidationResolver } from '../../../Utils/hook';
import { DeviceStore } from '../../../Services/MMKVStorage';
import { keyDeviceStore } from '../../../Utils';
import * as Keychain from 'react-native-keychain';

const Logo = styled.Image`
  width: 110px;
  height: 110px;
  margin-top: 15px;
`;

const LogoContainer = styled.SafeAreaView`
  align-items: center;
  background-color: #f4f4f4;
`;

const Wallpaper = styled.ImageBackground`
  width: 100%;
  height: 300px;
  justify-content: center;
  padding-left: 40px;
`;

const Title = styled(Text)`
  color: black;
  font-weight: bold;
  font-size: 30px;
  margin-top: 50px;
  width: 80%;
`;

const Subtitle = styled(Text)`
  color: black;
  font-size: 18px;
  margin-top: 26px;
`;

// const TabSignIn

const FormContainer = styled.View`
  padding-horizontal: 48px;
`;

const InputIcon = styled.Image`
  margin-left: 20px;
  margin-right: 10px;
`;

const SignInButton = styled(Button).attrs(() => ({
  containerStyle: {
    height: 50,
    borderRadius: 25,
    marginTop: 32,
    alignSelf: 'center',
  },
}))``;

const LoginScreen = ({ navigation }) => {
  const {
    app: { languageId, currentLang },
    setLangId,
  } = useApp();
  const { setDeepLinkAction } = useHome();

  const {
    user: { emailRegex },
    checkUserEmail,
    loginWithMicrosoftAccount,
    updateBiometricSettings,
  } = useUser();
  const regex = emailRegex.regexEmails ? emailRegex.regexEmails : [];

  React.useEffect(() => {
    PushNotification.setApplicationIconBadgeNumber(0);
  }, []);

  const handleLogin = async (username) => {
    const isSavillsAccount = checkEmailSavills(username, regex);
    const url = navigation.getParam('url');
    if (url) {
      setDeepLinkAction(url);
    }
    const credentials = await Keychain.getGenericPassword();
    if (credentials.username !== username) {
      await Keychain.resetGenericPassword();
      DeviceStore.delete(keyDeviceStore.BIOMETRIC_SETTING)
      updateBiometricSettings()
    }
    if (isSavillsAccount) {
      loginWithMicrosoftAccount(username, url);
    } else {
      checkUserEmail(username);
    }
  };

  const requiredQuestion = I18n.t('AUTH_REQUIRED_FIELD');
  const validationSchema = Yup.object().shape({
    username: Yup.string().email(I18n.t('AUTH_INVALID_EMAIL')).required(requiredQuestion),
  });

  const onSubmit = (values) => {
    handleLogin(_.trim(values.username));
  };

  const formMethods = useCompatibleForm({
    resolver: useYupValidationResolver(validationSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  return (
    <AwareScrollView>
      <LogoContainer>
        <Logo source={images.logo} resizeMode="contain" />
      </LogoContainer>

      <Wallpaper source={images.loginBackground}>
        <Title text="ADMIN_LOGIN_SIGN_IN_TITLE" />
        <Subtitle text="ADMIN_LOGIN_SIGN_IN_SUB_TITLE" />
      </Wallpaper>
      <FormProvider {...formMethods}>
        <FormContainer>
          <FormInput
            name="username"
            keyboardType="email-address"
            placeholder="LOGIN_USERNAME"
            height={50}
            leftIcon={<InputIcon source={icons.profileInactive} />}
          />
          <SignInButton title="LOGIN_SIGN_IN" primary rounded onPress={formMethods.handleSubmit(onSubmit)} />

          <LanguageSelect
            options={I18n.languages}
            title="ST_SELECT_LANGUAGE"
            selectedItem={languageId}
            currentLang={currentLang}
            onChange={setLangId}
          />
        </FormContainer>
      </FormProvider>
    </AwareScrollView>
  );
};

export default LoginScreen;
