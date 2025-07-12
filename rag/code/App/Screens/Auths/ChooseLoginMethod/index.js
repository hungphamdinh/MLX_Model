import React from 'react';
import styled from 'styled-components/native';
import { Button, Text } from '@Elements';
import { images } from '../../../Resources/image';
import AwareScrollView from '@Components/Layout/AwareScrollView';
import { LOGIN_METHODS } from '@Config/Constants';
import NavigationService from '@NavigationService';
import useUser from '../../../Context/User/Hooks/UseUser';
import useApp from '@Context/App/Hooks/UseApp';
import { useRoute } from '@react-navigation/native';
import { BIOMETRIC_STATUS } from '../../../Config/Constants';
import _ from 'lodash';
import { useBiometrics } from '../../../Utils/hook';
import { DeviceStore } from '../../../Services/MMKVStorage';
import { keyDeviceStore } from '../../../Utils';

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

const FormContainer = styled.View`
  padding-horizontal: 48px;
  align-items: center;
`;

const LoginButton = styled(Button).attrs(() => ({
  containerStyle: {
    height: 50,
    borderRadius: 25,
    marginTop: 20,
    width: '100%',
  },
}))``;

const ChooseLoginMethod = () => {
  const { login, user: { requestEmail }, saveBiometricSetting, authenticateBiometric, authenticateMfa } = useUser();
  const { params, name } = useRoute();

  const { getBiometricTermConditions } = useApp();
  
  const routeName = name;
  const { promptBiometric } = useBiometrics(true);
  const isFirstLogin = routeName === 'chooseLoginMethodFirstTime'

  React.useEffect(() => {
    if (isFirstLogin) {
      DeviceStore.delete(keyDeviceStore.BIOMETRIC_SETTING)
    }
    getBiometricTermConditions();
  }, []);

  const authenticateByBiometric = async (values) => {
    const result = await promptBiometric()
    if (!result) return;
    authenticateBiometric({
      username: values.username,
      password: values.password,
      guid: params.privateKey,
      token: params.token
    })
  };

  const handleLogin = async (method) => {
    const biometricStatus = method === LOGIN_METHODS.BIOMETRIC ? BIOMETRIC_STATUS.ON : BIOMETRIC_STATUS.OFF;
    const action = !isFirstLogin
      ? (method === LOGIN_METHODS.BIOMETRIC
          ? () => authenticateByBiometric(params)
          : () => authenticateMfa(params.username, params.password))
      : () => login(requestEmail, params.password);
  
    await action();
    if (biometricStatus === BIOMETRIC_STATUS.ON) {
      saveBiometricSetting(biometricStatus);
    }
  };

  return (
    <AwareScrollView>
      <LogoContainer>
        <Logo source={images.logo} resizeMode="contain" />
      </LogoContainer>

      <Wallpaper source={images.loginBackground}>
        <Title text="CHOOSE_LOGIN_METHOD_TITLE" />
        <Subtitle text="CHOOSE_LOGIN_METHOD_SUB_TITLE" />
      </Wallpaper>

      <FormContainer>
        <LoginButton 
          title="LOGIN_WITH_BIOMETRIC" 
          primary 
          rounded 
          onPress={() => {
            NavigationService.navigate('biometricTermConditions', {
              onAgree: () => handleLogin(LOGIN_METHODS.BIOMETRIC),
            });
          }}
        />
        <LoginButton 
          title="LOGIN_WITH_OTP" 
          primary 
          rounded 
          onPress={() => handleLogin(LOGIN_METHODS.OTP)}
        />
      </FormContainer>
    </AwareScrollView>
  );
};

export default ChooseLoginMethod;