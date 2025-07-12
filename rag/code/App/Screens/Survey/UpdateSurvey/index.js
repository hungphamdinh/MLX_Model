import React from 'react';
import I18n from '@I18n';
import { FormInput } from '@Forms';
import _ from 'lodash';
import { FormProvider } from 'react-hook-form';
import AwareScrollView from '@Components/Layout/AwareScrollView';
import useSurvey from '../../../Context/Survey/Hooks/UseSurvey';
import BaseLayout from '../../../Components/Layout/BaseLayout';
import { useCompatibleForm } from '../../../Utils/hook';

const UpdateSurvey = () => {
  const {
    survey: { surveyDetailId, surveyDetail },
    isLoading,
    updateSurveyTitle,
  } = useSurvey();

  const baseLayoutProps = {
    loading: isLoading,
    padding: true,
    title: I18n.t('SURVEY_UPDATE_SURVEY'),
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

  const onSavePress = (values) => {
    const params = {
      ...values,
      id: surveyDetailId,
    };
    updateSurveyTitle(params);
  };

  const formMethods = useCompatibleForm({
    defaultValues: {
      name: _.get(surveyDetail, 'name', ''),
    },
  });

  return (
    <BaseLayout {...baseLayoutProps}>
      <FormProvider {...formMethods}>
        <AwareScrollView>
          <FormInput label="SURVEY_TITLE_OF_SURVEY" name="name" />
        </AwareScrollView>
      </FormProvider>
    </BaseLayout>
  );
};

export default UpdateSurvey;
