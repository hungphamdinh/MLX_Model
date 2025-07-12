import React from 'react';
import I18n from '@I18n';
import BaseLayout from '@Components/Layout/BaseLayout';
import { FormInput, FormRadioGroup } from '@Forms';
import * as Yup from 'yup';
import { FormProvider } from 'react-hook-form';
import _ from 'lodash';
import AwareScrollView from '@Components/Layout/AwareScrollView';
import FormSurveyDropdown from '../../../Components/Survey/AddSurvey/SurveyDropdown';
import useSurvey from '../../../Context/Survey/Hooks/UseSurvey';
import { useCompatibleForm, useYupValidationResolver } from '../../../Utils/hook';

const AddSurvey = () => {
  const { isLoading, addSurvey } = useSurvey();

  const requiredField = I18n.t('COMMON_FIELD_IS_REQUIRED');
  const validationSchema = Yup.object().shape({
    selectedSurvey: Yup.object().when(['createType'], {
      is: (createType) => _.first(createType) === 1,
      then: Yup.object().required(requiredField),
    }),
    name: Yup.string().required(requiredField),
  });

  const mainLayoutProps = {
    loading: isLoading,
    padding: true,
    title: I18n.t('SURVEY_ADD_SURVEY'),
    bottomButtons: [
      {
        title: I18n.t('AD_COMMON_SAVE'),
        type: 'primary',
        onPress: () => {
          formMethods.handleSubmit(onSavePress)();
        },
      },
    ],
  };

  const addOptions = [
    {
      label: I18n.t('SURVEY_CREATE_FROM_SCRATCH'),
      value: 0,
    },
    {
      label: I18n.t('SURVEY_COPY_AND_EDIT_AN_EXISTING_SURVEY'),
      value: 1,
    },
  ];

  const onSavePress = ({ selectedSurvey, createType, ...values }) => {
    const params = values;
    if (_.first(createType) === 1) {
      params.id = selectedSurvey.id;
    }
    addSurvey(params);
  };

  const existingSurveyDropdown = (
    <FormSurveyDropdown label="SURVEY_SELECT_AN_EXISTING_SURVEY" name="selectedSurvey" required />
  );

  const formMethods = useCompatibleForm({
    resolver: useYupValidationResolver(validationSchema),
    defaultValues: {
      formTypeId: 2,
      moduleId: 8,
      selectedSurvey: undefined,
      createType: [0],
      name: '',
    },
  });
  const { watch } = formMethods;
  const createType = watch('createType');
  return (
    <BaseLayout {...mainLayoutProps}>
      <FormProvider {...formMethods}>
        <AwareScrollView>
          <FormRadioGroup options={addOptions} label="SURVEY_SELECT_WAY_OF_CLONING" name="createType" />
          {_.first(createType) === 1 && existingSurveyDropdown}
          <FormInput label="SURVEY_TITLE_OF_SURVEY" name="name" required />
        </AwareScrollView>
      </FormProvider>
    </BaseLayout>
  );
};

export default AddSurvey;
