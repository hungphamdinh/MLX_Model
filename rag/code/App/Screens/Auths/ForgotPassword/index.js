import React from 'react';
import styled from 'styled-components/native';
import I18n from '@I18n';
import { FormInput } from '@Forms';
import * as Yup from 'yup';
import { Button } from '@Elements';
import { FormProvider } from 'react-hook-form';

import { icons } from '../../../Resources/icon';
import AuthLayout from '../../../Components/Auths/AuthLayout';
import useUser from '../../../Context/User/Hooks/UseUser';
import { useCompatibleForm, useYupValidationResolver } from '../../../Utils/hook';

const Wrapper = styled.View`
  flex: 1;
  padding-horizontal: 40px;
`;

const InputIcon = styled.Image`
  margin-left: 20px;
  margin-right: 10px;
`;

const ForgotPassword = ({ navigation }) => {
  const { sendPasswordResetCode } = useUser();

  const email = navigation.getParam('email');

  const requiredQuestion = I18n.t('AUTH_REQUIRED_FIELD');
  const validationSchema = Yup.object().shape({
    email: Yup.string().email(I18n.t('AUTH_INVALID_EMAIL')).required(requiredQuestion),
  });

  const onSubmit = (values) => {
    sendPasswordResetCode(values.email);
  };

  const layoutProps = {
    title: 'AUTH_FORGOT_YOUR_PASSWORD',
    description: 'AUTH_FORGOT_DESCRIPTION',
  };

  const formMethods = useCompatibleForm({
    resolver: useYupValidationResolver(validationSchema),
    defaultValues: {
      email,
    },
  });

  return (
    <AuthLayout {...layoutProps}>
      <Wrapper>
        <FormProvider {...formMethods}>
          <FormInput
            name="email"
            keyboardType="email-address"
            placeholder="AUTH_YOUR_EMAIL"
            height={50}
            leftIcon={<InputIcon source={icons.profileInactive} />}
          />
          <Button primary rounded title="FORGOT_BTN_SEND" onPress={formMethods.handleSubmit(onSubmit)} />
        </FormProvider>
      </Wrapper>
    </AuthLayout>
  );
};

export default ForgotPassword;
