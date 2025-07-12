import React from 'react';
import I18n from '@I18n';
import _ from 'lodash';
import BaseLayout from '@Components/Layout/BaseLayout';
import styled from 'styled-components/native';
import SurveyOverview from '../../../Components/Survey/SurveyOverview';
import useSurvey from '../../../Context/Survey/Hooks/UseSurvey';
import useForm from '../../../Context/Form/Hooks/UseForm';
import { Modules } from '../../../Config/Constants';
import { isGranted, isGrantedAny } from '../../../Config/PermissionConfig';

const Wrapper = styled.View`
  padding-top: 10px;
  padding-horizontal: 16px;
  flex: 1;
`;

const SurveyDetail = ({ navigation }) => {
  const { getFormDetail } = useForm();

  const {
    survey: { surveyDetail },
  } = useSurvey();

  const isPublic = _.get(surveyDetail, 'surveyStatus.code') === 'SURVEYPUBLISH';

  const onViewSummary = () => {
    navigation.navigate('surveySummary');
  };

  const onViewRawData = () => {
    navigation.navigate('surveyRawData');
  };

  const onEditNamePress = () => {
    navigation.navigate('updateSurvey');
  };

  const onFormDesignPress = async () => {
    await getFormDetail({ id: surveyDetail.form.id });
    navigation.navigate('designSurvey', {
      moduleId: Modules.SURVEY,
    });
  };

  const bottomButtons = isPublic
    ? [
        {
          title: 'SURVEY_VIEW_SUMMARY',
          type: 'primary',
          onPress: onViewSummary,
        },
        {
          title: 'SURVEY_VIEW_RAW_DATA',
          type: 'light',
          onPress: onViewRawData,
        },
      ]
    : [
        {
          title: I18n.t('SURVEY_PUBLISH'),
          type: 'primary',
          permission: 'Survey.Update',
          onPress: () => {
            navigation.navigate('configPublishSurvey');
          },
        },
      ];

  const baseLayoutProps = {
    title: I18n.t('SURVEY_MODULE_TITLE'),
    rightBtn: isGrantedAny('Survey.Create', 'Survey.Update') && {
      title: 'SURVEY_FORM_DESIGN',
      onPress: onFormDesignPress,
    },
    bottomButtons,
  };

  if (!surveyDetail) {
    return <BaseLayout {...baseLayoutProps} />;
  }

  return (
    <BaseLayout {...baseLayoutProps}>
      <Wrapper>
        <SurveyOverview isPublic={isPublic} surveyDetail={surveyDetail} onEditNamePress={onEditNamePress} />
      </Wrapper>
    </BaseLayout>
  );
};

export default SurveyDetail;
