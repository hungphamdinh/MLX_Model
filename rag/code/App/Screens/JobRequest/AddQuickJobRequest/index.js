import React, { useEffect } from 'react';
import * as Yup from 'yup';
import { DeviceEventEmitter } from 'react-native';
import I18n from '@I18n';
import { FormProvider, useForm } from 'react-hook-form';
import NavigationService from '@NavigationService';
import BaseLayout from '../../../Components/Layout/BaseLayout';
import { FormDropdown, FormInput } from '../../../Components/Forms';
import AwareScrollView from '../../../Components/Layout/AwareScrollView';
import useJobRequest from '../../../Context/JobRequest/Hooks/UseJobRequest';
import Box from '../../../Elements/Box';
import { RequestApi } from '../../../Services';
import FormSuggestionPicker, { SuggestionTypes } from '../../../Components/Forms/FormSuggestionPicker';
import { useYupValidationResolver } from '../../../Utils/hook';
import FormDocumentPicker from '../../../Components/Forms/FormDocumentPicker';

const AddQuickJobRequest = () => {
  const {
    jobRequest: { quickJRSetting },
    isLoading,
    addQuickJR,
  } = useJobRequest();

  const requiredMessage = I18n.t('FORM_THIS_FIELD_IS_REQUIRED');
  const validationSchema = Yup.object().shape({
    location: Yup.object().required(requiredMessage),
    description: Yup.string().required(requiredMessage),
    subCategoryId: Yup.number().required(requiredMessage),
  });

  useEffect(() => {}, []);

  const onSubmit = async ({ location, ...values }) => {
    const params = {
      ...values,
      locationId: location.id,
      locationCode: location.code,
    };
    await addQuickJR(params);
  };

  const formMethods = useForm({
    resolver: useYupValidationResolver(validationSchema),
    defaultValues: {
      location: undefined,
      subCategoryId: undefined,
      description: undefined,
      files: [],
    },
  });

  const baseLayoutProps = {
    title: 'AD_QUICK_CRWO_TITLE_HEADER',
    showBell: false,
    containerStyle: { paddingHorizontal: 15 },
    loading: isLoading,
    bottomButtons: [
      {
        title: 'AD_COMMON_SAVE',
        type: 'primary',
        onPress: () => {
          formMethods.handleSubmit(onSubmit)();
        },
      },
    ],
  };

  return (
    <BaseLayout {...baseLayoutProps}>
      <FormProvider {...formMethods}>
        <AwareScrollView>
          <FormSuggestionPicker
            required
            type={SuggestionTypes.LOCATION}
            label="AD_CRWO_TITLE_LOCATION"
            placeholder="AD_CRWO_TITLE_LOCATION"
            name="location"
          />
          <FormDropdown
            required
            options={quickJRSetting.settingsCommons}
            label="AD_CRWO_CATEGORY"
            placeholder="AD_CRWO_CATEGORY"
            name="subCategoryId"
            fieldName="subCategoryName"
            valKey="subCategoryId"
          />
          <FormInput required label="AD_CRWO_PLACEHOLDER_DESCRIPTION" placeholder="" name="description" multiline />
          <FormDocumentPicker name="files" label="COMMON_IMAGES" />
        </AwareScrollView>
      </FormProvider>
    </BaseLayout>
  );
};

export default AddQuickJobRequest;
