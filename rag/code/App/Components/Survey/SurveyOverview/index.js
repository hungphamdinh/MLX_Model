import React from 'react';
import _ from 'lodash';
import { Text } from '@Elements';

import styled from 'styled-components/native';
import InfoText from '../../InfoText';
import DateRangeText from './DateRangeText';
import { images } from '../../../Resources/image';
import { isGranted } from '../../../Config/PermissionConfig';

const Wrapper = styled.ScrollView``;

const TotalWrapper = styled.View`
  align-items: center;
  justify-content: center;
`;

const TotalBox = styled.ImageBackground`
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  margin-top: 26px;
`;

const Responses = styled(Text)`
  font-weight: bold;
  font-size: 12px;
  margin-top: 5px;
`;

const Total = styled(Text)`
  font-size: 27px;
`;

const SurveyOverview = ({ onPress, surveyDetail, isPublic, onEditNamePress }) => {
  if (!surveyDetail) return null;
  return (
    <Wrapper showsVerticalScrollIndicator={false} onPress={onPress}>
      <InfoText
        label="COMMON_NAME"
        value={surveyDetail.name}
        icon={isGranted('Survey.Update') && 'create-outline'}
        onPress={onEditNamePress}
      />
      <InfoText label="COMMON_STATUS" value={surveyDetail.surveyStatus.name} />
      <InfoText label="SURVEY_TOTAL_PAGES" value={_.size(surveyDetail.form.formPages)} />
      <DateRangeText startDate={surveyDetail.startDate} endDate={surveyDetail.endDate} />
      <InfoText label="COMMON_DESCRIPTION" value={surveyDetail.description} />
      {isPublic && (
        <TotalWrapper>
          <TotalBox source={images.surveyTotalBox}>
            <Total>{surveyDetail.submitCount}</Total>
          </TotalBox>
          <Responses preset="bold" text="SURVEY_RESPONSES" />
        </TotalWrapper>
      )}
    </Wrapper>
  );
};

export default SurveyOverview;

SurveyOverview.defaultProps = {};
