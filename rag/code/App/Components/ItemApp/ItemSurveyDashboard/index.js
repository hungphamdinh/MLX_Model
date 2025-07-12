import React from 'react';
import styled from 'styled-components/native';
import _ from 'lodash';
import { StatusView, Text } from '@Elements';
import I18n from '@I18n';

import moment from 'moment';
import { Wrapper } from '../ItemCommon';
import { icons } from '../../../Resources/icon';
import LocaleConfig from '../../../Config/LocaleConfig';
import { surveyStatusColor } from '../../../Config/Constants';
import { images } from '../../../Resources/image';

const InfoWrapper = styled.View`
  flex: 1;
`;

const RowWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`;

const MainRow = styled.View`
  flex-direction: row;
`;

const Symbol = styled.Image`
  width: 15px;
  height: 22px;
`;

const LeftValue = styled(Text)`
  margin-left: 12px;
  flex: 1;
`;

const Title = styled(Text)`
  margin-bottom: 10px;
`;

const TotalWrapper = styled.View`
  align-items: center;
  justify-content: center;
`;

const TotalBox = styled.ImageBackground`
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
`;

const Responses = styled(Text)`
  font-weight: bold;
  margin-top: 10px;
`;

const Total = styled(Text)`
  font-size: 27px;
`;

const ItemSurveyDashboard = ({ item, onPress }) => {
  const color = _.get(surveyStatusColor, item.status.code, surveyStatusColor.SURVEYUNPUBLISH);
  const lastModificationTime = moment(item.lastModificationTime).format(LocaleConfig.dateTimeFormat);

  return (
    <Wrapper onPress={onPress}>
      <MainRow>
        <InfoWrapper>
          <Title preset="bold" text={item.name} numberOfLines={2} />
          <RowWrapper>
            <Symbol source={icons.user} resizeMode="contain" />
            <LeftValue text={item.creatorUserName} preset="medium" />
          </RowWrapper>
          <RowWrapper>
            <Symbol source={icons.dateTime} resizeMode="contain" />
            <LeftValue text={lastModificationTime} preset="medium" />
          </RowWrapper>
        </InfoWrapper>
        <TotalWrapper>
          <TotalBox source={images.surveyTotalBox}>
            <Total>{item.submitCount}</Total>
          </TotalBox>
          <Responses preset="bold">{I18n.t('SURVEY_RESPONSES')}</Responses>
        </TotalWrapper>
      </MainRow>
      <StatusView status={{ colorCode: color, name: item.status.name }} subStatus={item.priority} />
    </Wrapper>
  );
};

export default ItemSurveyDashboard;
