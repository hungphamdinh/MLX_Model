import React from 'react';
import I18n from '@I18n';
import { FormProvider } from 'react-hook-form';
import { Button, Card, Text } from '@Elements';
import styled from 'styled-components/native';
import { Keyboard } from 'react-native';
import * as Yup from 'yup';
import _ from 'lodash';
import FormPasswordInput from '../../../Components/Auths/FormPasswordInput';
import BaseLayout from '../../../Components/Layout/BaseLayout';
import AwareScrollView from '../../../Components/Layout/AwareScrollView';
import useUser from '../../../Context/User/Hooks/UseUser';
import noticeUtils from '../../../Utils/noticeUtils';
import useApp from '../../../Context/App/Hooks/UseApp';
import { useCompatibleForm, useYupValidationResolver } from '../../../Utils/hook';
import { getPasswordConfigCaption } from '../../../Utils/common';
import { useRoute } from '@react-navigation/native';

const Caption = styled(Text)`
  color: gray;
  font-size: 12px;
  margin-horizontal: 15px;
`;

const ChangePassword = ({ navigation }) => {
  const {
    user: { requestEmail },
    resetPassword,
    changePassword,
    login,
  } = useUser();
  const {
    resetApp,
    app: { regexPassword, passwordSetting },
  } = useApp();

  const { params, name } = useRoute();
  const isResetPassword = _.includes(['resetPassword', 'resetPasswordFirstTime'], name)
  const passwordResetCode = params?.passwordResetCode;

  const onSubmit = async (values) => {
    Keyboard.dismiss();
    if (isResetPassword) {
      const result = await resetPassword(values);
      if (result) {
        if (passwordResetCode) { // reset Expired Password or First Login
          if(name === 'resetPasswordFirstTime') {
            navigation.navigate('chooseLoginMethodFirstTime', {
              password: values.password,
            })
            return;
          }
          login(requestEmail, values.password)
          return;
        }
        navigation.navigate('chooseLoginMethodFirstTime', { // forgot password
          password: values.password,
        })
      }
    } else {
      const changePassResult = await changePassword(values.currPass, values.password);
      if (changePassResult) {
        noticeUtils.showSuccess('MODAL_CHANGE_PASS_SUCCESS_CONTENT', () => {
          resetApp();
        });
      }
    }
  };

  const requiredQuestion = I18n.t('AUTH_REQUIRED_FIELD');
  let addOnValidation = {};
  if (isResetPassword) {
    addOnValidation = {
      resetCode: Yup.string().required(requiredQuestion),
    };
  } else {
    addOnValidation = {
      currPass: Yup.string().required(requiredQuestion),
    };
  }

  const validationSchema = Yup.object({
    password: Yup.string().required(requiredQuestion).matches(regexPassword, I18n.t('CHANGE_PASS_VALIDATE_ERROR')),
    confirmPassword: Yup.string().test('passwords', I18n.t('CHANGE_PASS_NOT_EQUAL_RE'), function (value) {
      return this.parent.password === value;
    }),
    ...addOnValidation,
  });

  const formMethods = useCompatibleForm({
    resolver: useYupValidationResolver(validationSchema),
    defaultValues: {
      resetCode: passwordResetCode,
      currPass: '',
      password: '',
      confirmPassword: '',
    },
  });

  return (
    <BaseLayout title="CHANGE_PASS" showBell={false} containerStyle={{ backgroundColor: 'white' }}>
      <AwareScrollView>
        <Card>
          <FormProvider {...formMethods}>
            {isResetPassword ? (
              <FormPasswordInput mode="small" name="resetCode" label={I18n.t('CHANGE_PASS_VERIFY')} />
            ) : (
              <FormPasswordInput mode="small" name="currPass" label={I18n.t('CHANGE_PASS_CURRENT_PASS')} />
            )}
            <FormPasswordInput mode="small" name="password" label={I18n.t('CHANGE_PASS_NEW_PASS')} />
            <FormPasswordInput mode="small" name="confirmPassword" label={I18n.t('CHANGE_PASS_RETYPE_PASS')} />
            <Button onPress={formMethods.handleSubmit(onSubmit)} primary rounded title="AD_COMMON_SAVE" />
          </FormProvider>
        </Card>
        {getPasswordConfigCaption(passwordSetting).map((text, index) => {
          if (index === 0) {
            return <Caption key={text} text={`${I18n.t(text)}:`} />;
          }
          return <Caption key={text} text={`• ${I18n.t(text)}`} />;
        })}
      </AwareScrollView>
      {/* {state.showModalSuccess && ( */}
      {/*  <ModalSuccess */}
      {/*    titleButton="MODAL_SUCCESS_TEXT_OK" */}
      {/*    textContent="MODAL_SUCCESS_TEXT_CONTENT" */}
      {/*    textTitle="MODAL_SUCCESS_TEXT_TITLE" */}
      {/*    onPress={() => { */}
      {/*      props.navigation.goBack(); */}
      {/*    }} */}
      {/*  /> */}
      {/* )} */}
    </BaseLayout>
  );
};

export default ChangePassword;
