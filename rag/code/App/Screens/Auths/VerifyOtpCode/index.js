import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components/native';
import I18n from '@I18n';
import { FormProvider } from 'react-hook-form';
import * as Keychain from 'react-native-keychain';
import * as Yup from 'yup';

import { Button, Image } from '../../../Elements';
import { SENT_METHOD } from '../../../Config/Constants';
import Row from '../../../Components/Grid/Row';
import { Colors } from '../../../Themes';
import useUser from '../../../Context/User/Hooks/UseUser';
import ModalSuccess from '../../../Components/ModalSuccess';
import { getMinuteDisplayFromSecond } from '../../../Utils/transformData';
import { FormInput } from '../../../Components/Forms';
import AuthLayout from '../../../Components/Auths/AuthLayout';
import { icons } from '../../../Resources/icon';
import { useCompatibleForm, useYupValidationResolver } from '../../../Utils/hook';
import useHome from '../../../Context/Home/Hooks/UseHome';

const RESEND_TIME_OUT = 120;
const ActionButton = styled(Button)`
  color: ${(props) => (props.disabled ? '#A3A3A3' : Colors.azure)};
`;

const ActionWrapper = styled(Row)`
  justify-content: space-between;
  margin-horizontal: -15px;
`;

const Icon = styled(Image)`
  width: 40px;
  height: 40px;
`;

const SendMethodWrapper = styled(Row)`
  justify-content: center;
  position: absolute;
  bottom: 30px;
  right: 0;
  left: 0;
`;

const FormContainer = styled.View`
  padding-horizontal: 48px;
`;

const SignInButton = styled(Button).attrs(() => ({
  containerStyle: {
    height: 50,
    borderRadius: 25,
    marginTop: 32,
    alignSelf: 'center',
  },
}))``;

const RESEND_OTP_TIME = 120;

const VerifyOTPCode = ({ navigation }) => {
  const email = navigation.getParam('email');
  const requiredQuestion = I18n.t('AUTH_REQUIRED_FIELD');
  const validationSchema = Yup.object().shape({
    otp: Yup.string().required(requiredQuestion),
  });
  const {
    authenticateOTP,
    authenticateMfa,
    user: { mfaAuthentication, hostSetting, mfaUserSetting },
  } = useUser();

  const {
    home: { deepLinkPath },
  } = useHome();

  const isUsingSms = mfaUserSetting?.isUsingSms;
  const phoneNumber = mfaAuthentication.phoneNumber || '';

  const {
    mfa: { otp },
  } = hostSetting;

  const [remainTime, setRemainTime] = useState(otp.timeout);
  const [resendTime, setResendTime] = useState(RESEND_OTP_TIME);

  const [allowResend, setAllowResend] = useState(false);

  const timer = useRef(null);
  const resendTimer = useRef(null);

  const [isModalSuccess, setIsModalSuccess] = useState(false);

  useEffect(() => {
    if (mfaAuthentication) {
      setIsModalSuccess(true);
    }
  }, []);

  useEffect(() => {
    if (remainTime) {
      fireAllowRemainCountDown();
    }
    return () => {
      clearInterval(timer.current);
    };
  }, [remainTime]);

  useEffect(() => {
    if (resendTime) {
      fireAllowResendCountDown();
    }
    return () => {
      clearInterval(resendTimer.current);
    };
  }, [resendTime]);

  const fireAllowRemainCountDown = () => {
    timer.current = setTimeout(() => {
      const newRemainTime = remainTime - 1;
      setRemainTime(newRemainTime);
    }, 1000);
  };

  const fireAllowResendCountDown = () => {
    resendTimer.current = setTimeout(() => {
      const newRemainTime = resendTime - 1;
      setResendTime(newRemainTime);
      if (newRemainTime === 0) {
        setAllowResend(true);
      }
    }, 1000);
  };

  const onResendPress = async (sentMethod) => {
    setResendTime(RESEND_TIME_OUT);
    setRemainTime(otp.resendTime); // timeOut
    setAllowResend(false);
    const credentials = await Keychain.getGenericPassword();
    const res = await authenticateMfa(email, credentials.password, sentMethod);
    if (res) {
      setIsModalSuccess(true);
    }
  };

  const remainText = getMinuteDisplayFromSecond(remainTime);
  // const resendText = getMinuteDisplayFromSecond(resendTime);

  const closeModal = () => {
    setIsModalSuccess(false);
  };

  const isEmailMethod = mfaAuthentication.sentMethod === SENT_METHOD.email;

  const phoneDigit = phoneNumber.substring(phoneNumber.length - 4);
  const phoneSendOtp = phoneNumber.replace(phoneDigit, '****');

  const phoneMethodColor = !isEmailMethod ? Colors.success : Colors.gray;
  const emailMethodColor = isEmailMethod ? Colors.success : Colors.gray;

  const layoutProps = {
    title: 'AUTH_VERIFICATION_CODE',
    description: 'AUTH_VERIFICATION_DESCRIPTION',
    showLeftButton: false,
  };

  const onSubmit = (values) => {
    authenticateOTP({
      email,
      guid: mfaAuthentication.guid,
      otp: values.otp,
      deepLinkPath,
    });
  };

  const formMethods = useCompatibleForm({
    resolver: useYupValidationResolver(validationSchema),
    defaultValues: {
      otp: '',
    },
  });

  return (
    <AuthLayout {...layoutProps}>
      <FormProvider {...formMethods}>
        <FormContainer>
          <FormInput
            name="otp"
            label=""
            maxLength={6}
            autoFocus
            keyboardType="number-pad"
            placeholder="AUTH_ENTER_OTP"
            height={50}
          />
          <ActionWrapper center>
            <ActionButton
              transparent
              title={I18n.t('AUTH_RESEND_CODE')}
              onPress={onResendPress}
              disabled={!allowResend}
            />
            <ActionButton transparent title={remainText} disabled />
            {/* <ActionButton transparent title={resendText} disabled /> */}
          </ActionWrapper>
          <SignInButton title="COMMON_SUBMIT" primary rounded onPress={formMethods.handleSubmit(onSubmit)} />
        </FormContainer>
      </FormProvider>
      {isUsingSms && (
        <SendMethodWrapper center>
          <Button style={{ marginRight: 20 }} onPress={() => onResendPress(SENT_METHOD.email)}>
            <Icon tintColor={emailMethodColor} source={icons.emailMethod} />
          </Button>
          <Button onPress={() => onResendPress(SENT_METHOD.sms)}>
            <Icon tintColor={phoneMethodColor} source={icons.phoneMethod} />
          </Button>
        </SendMethodWrapper>
      )}

      {isModalSuccess && (
        <ModalSuccess
          titleButton={I18n.t('COMMON_CLOSE')}
          textTitle={I18n.t('MODAL_SUCCESS_TEXT_TITLE')}
          textContent={
            mfaAuthentication.sentMethod === SENT_METHOD.email
              ? I18n.t('AUTH_SEND_OTP_EMAIL', undefined, email)
              : I18n.t('AUTH_SEND_OTP_PHONE', undefined, phoneSendOtp)
          }
          onPress={closeModal}
        />
      )}
    </AuthLayout>
  );
};

export default VerifyOTPCode;
