import React from 'react';
import { Modal } from 'react-native';
import * as Yup from 'yup';
import { Button } from '@Elements';
import FormInput from '@Components/Forms/FormInput';
import BaseLayout from '@Components/Layout/BaseLayout';
import I18n from '@I18n';
import { FormProvider } from 'react-hook-form';
import styles from './styles';
import { useCompatibleForm, useYupValidationResolver } from '../../../../../Utils/hook';
import { generateInspectionUUID, TableNames } from '../../../../../Services/OfflineDB/IDGenerator';

const AddOrEditSectionModal = ({ selectedItem, formGuid, onClosePress, visible, onComplete }) => {
  const validationSchema = Yup.object().shape({
    name: Yup.string().required(I18n.t('FORM_THIS_FIELD_IS_REQUIRED')),
  });

  const formMethods = useCompatibleForm({
    resolver: useYupValidationResolver(validationSchema),
    defaultValues: {
      id: generateInspectionUUID(TableNames.formPage),
      name: '',
      formQuestions: [],
      ...(selectedItem || {}),
      formGuid,
    },
  });

  const mainLayoutProps = {
    title: selectedItem ? I18n.t('FORM_EDIT_SECTION') : I18n.t('FORM_ADD_SECTION'),
    onLeftPress: onClosePress,
    style: styles.container,
    padding: true,
  };

  return (
    <Modal visible={visible}>
      <BaseLayout {...mainLayoutProps}>
        <FormProvider {...formMethods}>
          <FormInput maxLength={200} label="FORM_SECTION_TITLE" name="name" />
          <Button
            rounded
            primary
            onPress={formMethods.handleSubmit(onComplete)}
            title={I18n.t('AD_COMMON_SAVE')}
            containerStyle={styles.bottomButton}
          />
        </FormProvider>
      </BaseLayout>
    </Modal>
  );
};

export default AddOrEditSectionModal;
