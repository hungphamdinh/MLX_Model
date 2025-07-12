import React from 'react';
import { FormProvider } from 'react-hook-form';
import I18n from '@I18n';
import * as Yup from 'yup';
import styled from 'styled-components/native';
import { Button } from '../../../Elements';
import { FormInput } from '../../Forms';
import { withModal } from '../../../HOC';
import { useCompatibleForm, useYupValidationResolver } from '../../../Utils/hook';

const ButtonWrapper = styled.View`
  align-items: center;
  margin-top: 10px;
`;

const Wrapper = styled.View`
  padding-horizontal: 10px;
`;

const ReasonModal = ({ submit, onClosePress }) => {
  const requiredQuestion = I18n.t('AUTH_REQUIRED_FIELD');
  const validationSchema = Yup.object().shape({
    reason: Yup.string().required(requiredQuestion),
  });
  const formMethods = useCompatibleForm({
    resolver: useYupValidationResolver(validationSchema),
    defaultValues: {
      reason: '',
    },
  });

  const onSubmit = ({ reason }) => {
    submit(reason);
    onClosePress();
  };

  return (
    <Wrapper>
      <FormProvider {...formMethods}>
        <FormInput multiline required name="reason" mode="small" label="COMMON_REASON" placeholder="COMMON_REASON" />
        <ButtonWrapper center>
          <Button block primary rounded title={I18n.t('COMMON_CONFIRM')} onPress={formMethods.handleSubmit(onSubmit)} />
        </ButtonWrapper>
      </FormProvider>
    </Wrapper>
  );
};

export default withModal(ReasonModal, 'VISITOR_DEACTIVATE_TITLE');
