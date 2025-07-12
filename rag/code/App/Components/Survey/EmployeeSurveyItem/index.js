import React from 'react';
import I18n from '@I18n';
import styled from 'styled-components/native';
import moment from 'moment';

import { Button, StatusView } from '../../../Elements';
import IconAndLabelItem from '../IconAndLabelItem';
import Row from '../../Grid/Row';
import { surveyStatusColor } from '../../../Config/Constants';
import Tag from '../../ListItem/Tag';
import LocaleConfig from '../../../Config/LocaleConfig';

const Wrapper = styled.TouchableOpacity`
  background: #ffffff;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  padding: 16px;
  height: 180px;
  elevation: 1;
`;

const StatusIDWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Name = styled.Text`
  font-weight: bold;
  font-size: 20px;
  color: #000000;
  margin-bottom: 16px;
`;

const InfoWrapper = styled.View`
  flex: 1;
  margin-top: 10px;
`;

const DateInfo = styled(IconAndLabelItem)`
  margin-right: 16px;
`;

const TextButton = styled(Button).attrs(() => ({
  containerStyle: {
    alignSelf: 'flex-end',
    marginBottom: 0,
    height: undefined,
    paddingHorizontal: 0,
  },
}))`
  color: #0d6eff;
  font-weight: bold;
`;

const EmployeeSurveyItem = ({ onStartSurvey, onReopen, item, onItemPress }) => {
  const getTime = (date) => moment(date).format('HH:mm');

  const getDate = (date) => moment(date).format(LocaleConfig.dateTimeFormat);

  const colorCode = item.isSubmitted ? surveyStatusColor.SURVEYPUBLISH : surveyStatusColor.SURVEYUNPUBLISH;

  return (
    <Wrapper onPress={onItemPress} disabled={!item.isSubmitted}>
      {/* <StatusIDWrapper> */}
      {/*    <Tag color="#BCC3D3" name={`#${item.surveyId}`} /> */}
      {/*    <Tag color={color} name={I18n.t(item.isSubmitted ? 'SURVEY_SUBMITTED' : 'SURVEY_NOT_YET_SUBMITTED')} /> */}
      {/* </StatusIDWrapper> */}
      <InfoWrapper>
        <Name>{item.name}</Name>
        <Row center>
          <DateInfo iconName="calendar" label={`From: ${getDate(item.startDate)}`} />
          <IconAndLabelItem iconName="time" label={`${getTime(item.startDate)}`} />
        </Row>
        <Row center>
          <DateInfo iconName="calendar" label={`To: ${getDate(item.endDate)}`} />
          <IconAndLabelItem iconName="time" label={`${getTime(item.endDate)}`} />
        </Row>
      </InfoWrapper>
      {!item.isSubmitted ? (
        <TextButton title={I18n.t('SURVEY_START_SURVEY')} onPress={onStartSurvey} />
      ) : (
        <TextButton title={I18n.t('SURVEY_REOPEN')} onPress={onReopen} />
      )}
      <StatusView
        status={{ colorCode, name: I18n.t(item.isSubmitted ? 'SURVEY_SUBMITTED' : 'SURVEY_NOT_YET_SUBMITTED') }}
      />
    </Wrapper>
  );
};

export default EmployeeSurveyItem;

EmployeeSurveyItem.defaultProps = {};
