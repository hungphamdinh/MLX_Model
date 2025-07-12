import _ from 'lodash';
import * as Yup from 'yup';
import * as Keychain from 'react-native-keychain';
import I18n from '@I18n';
import { View } from 'react-native';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { Button, Text } from '@Elements';
import { FormProvider } from 'react-hook-form';
import NavigationService from '@NavigationService';
import { FormInput } from '../../../Components/Forms';
import { icons } from '../../../Resources/icon';
import LanguageSelect from '../../../Components/Auths/ChangeLanguage/LanguageSelect';
import useUser from '../../../Context/User/Hooks/UseUser';
import useApp, { clearDeviceStore, deleteProtectedStorage } from '../../../Context/App/Hooks/UseApp';
import AuthLayout from '../../../Components/Auths/AuthLayout';
import { useBiometrics, useCompatibleForm, useYupValidationResolver } from '../../../Utils/hook';
import { BIOMETRIC_STATUS } from '../../../Config/Constants';
import { Colors } from '../../../Themes';
import { keychainServices } from '../../../Config';
import { useRoute } from '@react-navigation/native';
import Row from '../../../Components/Grid/Row';

const FormContainer = styled.View`
  flex: 1;
  padding-horizontal: 48px;
`;

const InputIcon = styled.Image`
  margin-left: 20px;
  margin-right: 10px;
`;

const ButtonChangeAccount = styled(Button)`
  padding-top: 10px;
  text-decoration-line: underline;
  color: ${Colors.gray};
  font-weight: bold;
`;

const ForgotButton = styled(Button).attrs(() => ({
  containerStyle: {
    alignSelf: 'flex-end',
  },
}))`
  font-size: 10px;
`;

const SignInButton = styled(Button).attrs(() => ({
  containerStyle: {
    height: 50,
    borderRadius: 25,
    marginTop: 32,
    alignSelf: 'center',
  },
}))``;


const RowWrapper = styled(Row)`
  flex: 1;
  margin-top: 30px;
`;

const Line = styled.View`
  height: 1px;
  flex: 0.5;
  background-color: ${Colors.semiGray};
  margin-top: 20px;
`;

const ORText = styled(Text)`
  padding-top: 20px;
  padding-horizontal: 10px;
`;

const PasswordFill = () => {
  const {
    app: { languageId, currentLang },
    setLangId,
  } = useApp();

  const {
    user: { biometricSetting },
    updateBiometricSettings,
    checkAuthenticateAnonymous,
    authenticateBiometric,
  } = useUser();

  const isTurnOnBiometric = biometricSetting === BIOMETRIC_STATUS.ON;

  const { promptBiometric } = useBiometrics(isTurnOnBiometric);
  const { params, name } = useRoute();
  const [email, setEmail] = useState(params?.email);

  const isNonSavillsLogin = name === 'nonSavillsLogin';
  const { authenticateMfa, getMFAUserSetting } = useUser();

  const getKeychains = async () => {
    const credentials = await Keychain.getGenericPassword();
    if (_.size(credentials.username)) {
      formMethods.setFieldValue('username', credentials.username);
      setEmail(credentials.username)
    }
  };


  useEffect(() => {
    getMFAUserSetting(email);
    getKeychains();
  }, []);

  const gotoForgotPassword = () => {
    NavigationService.navigate('forgotPassword', { email });
  };

  const requiredQuestion = I18n.t('AUTH_REQUIRED_FIELD');
  const validationSchema = Yup.object().shape({
    username: Yup.string().email(I18n.t('AUTH_INVALID_EMAIL')).required(requiredQuestion),
    password: Yup.string().required(requiredQuestion),
  });

  const layoutProps = {
    title: 'ADMIN_LOGIN_SIGN_IN_TITLE',
    description: 'ADMIN_LOGIN_SIGN_IN_SUB_TITLE',
    showLeftButton: !isNonSavillsLogin,
  };

  const onSubmit = async (values) => {
    const auth = await checkAuthenticateAnonymous({
      userNameOrEmailAddress: values.username,
      password: values.password,
    })
    if(!auth) return;
    // not set up Biometric in Device
    if(biometricSetting === undefined) {
      NavigationService.navigate('chooseLoginMethod', {
        username: _.trim(values.username),
        password: values.password,
        privateKey: auth.privateKey,
        token: auth.token
      });
      return;
    }
    if(!isTurnOnBiometric) {
      authenticateMfa(_.trim(values.username), values.password);
      return;
    }
    authenticateByBiometric(values, auth);
  };


  const authenticateByBiometric = async (values, auth) => {
    const result = await promptBiometric();
    if (!result) return;
    authenticateBiometric({
      username: values.username,
      password: values.password,
      guid: auth.privateKey,
      token: auth.token
    })
  };

  const formMethods = useCompatibleForm({
    resolver: useYupValidationResolver(validationSchema),
    defaultValues: {
      username: email,
      password: '',
    },
  });

  const onChangeAccount = async () => {
    clearDeviceStore();
    deleteProtectedStorage();
    await Keychain.resetGenericPassword({ service: keychainServices.pinVerify });
    updateBiometricSettings();
    NavigationService.replace('login');
  };
  return (
    <AuthLayout {...layoutProps}>
      <FormProvider {...formMethods}>
        <FormContainer>
          <FormInput
            name="username"
            keyboardType="email-address"
            placeholder="LOGIN_USERNAME"
            height={50}
            editable={false}
            leftIcon={<InputIcon source={icons.profileInactive} />}
          />
          <FormInput
            name="password"
            secureTextEntry
            placeholder="LOGIN_PASSWORD"
            autoFocus
            height={50}
            leftIcon={<InputIcon source={icons.password} />}
          />
          <ForgotButton transparent title={`${I18n.t('LOGIN_FORGOT_PASSWORD')}?`} onPress={gotoForgotPassword} />
          <SignInButton title="LOGIN_SIGN_IN" primary rounded onPress={formMethods.handleSubmit(onSubmit)} />
          {isNonSavillsLogin && (
            <View>
              <RowWrapper center>
                <Line />
                <ORText text="OR" />
                <Line />
              </RowWrapper>

              <ButtonChangeAccount transparent onPress={onChangeAccount} title="LOGIN_CHANGE_ANOTHER_ACCOUNT" />
            </View>
          )}

          <LanguageSelect
            options={I18n.languages}
            title="ST_SELECT_LANGUAGE"
            selectedItem={languageId}
            currentLang={currentLang}
            onChange={setLangId}
          />
        </FormContainer>
      </FormProvider>
    </AuthLayout>
  );
};

export default PasswordFill;
