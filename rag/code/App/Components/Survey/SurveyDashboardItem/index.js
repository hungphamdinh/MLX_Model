import React from 'react';
import _ from 'lodash';
import I18n from '@I18n';
import styled from 'styled-components/native';
import moment from 'moment';
import IconAndLabelItem from '../IconAndLabelItem';
import LocaleConfig from '../../../Config/LocaleConfig';
import { surveyStatusColor } from '../../../Config/Constants';

const StatusWrapper = styled.View`
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  background-color: ${(props) => props.backgroundColor};
  justify-content: center;
  width: 30px;
`;

const StatusTitle = styled.Text`
  font-size: 11px;
  font-weight: bold;
  color: white;
  width: 120px;
  text-align: center;
  align-self: center;
  transform: rotate(-90deg);
`;

const StatusType = ({ color, name }) => (
  <StatusWrapper backgroundColor={color}>
    <StatusTitle>{_.upperCase(name)}</StatusTitle>
  </StatusWrapper>
);

const Wrapper = styled.TouchableOpacity`
  flex-direction: row;
  background: #ffffff;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  elevation: 1;
`;

const Name = styled.Text`
  font-weight: bold;
  font-size: 20px;
  color: #000000;
  margin-bottom: 16px;
`;

const InfoWrapper = styled.View`
  flex: 1;
  padding-horizontal: 10px;
  margin-vertical: 10px;
`;

const TotalWrapper = styled.View`
  align-items: center;
  justify-content: center;
  padding-right: 16px;
`;

const Responses = styled.Text`
  font-weight: bold;
  font-size: 18px;
  color: #000000;
`;

const Total = styled.Text`
  font-weight: bold;
  font-size: 50px;
  color: ${(props) => props.color};
  margin-bottom: 10px;
`;

const SurveyDashboardItem = ({ onPress, item: { status, ...item } }) => {
  const color = _.get(surveyStatusColor, status.code, surveyStatusColor.SURVEYUNPUBLISH);
  const lastModificationTime = moment(item.lastModificationTime).format(LocaleConfig.dateTimeFormat);
  return (
    <Wrapper onPress={onPress}>
      <StatusType color={color} name={status.name} />
      <InfoWrapper>
        <Name numberOfLines={2}>{item.name}</Name>
        <IconAndLabelItem iconName="person" label={item.creatorUserName} />
        <IconAndLabelItem iconName="calendar" label={lastModificationTime} noMargin />
      </InfoWrapper>
      <TotalWrapper>
        <Total color={color}>{item.submitCount}</Total>
        <Responses>{I18n.t('SURVEY_RESPONSES')}</Responses>
      </TotalWrapper>
    </Wrapper>
  );
};

export default SurveyDashboardItem;

SurveyDashboardItem.defaultProps = {};
