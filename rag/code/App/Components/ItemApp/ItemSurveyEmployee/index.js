import React from 'react';
import styled from 'styled-components/native';
import { View } from 'react-native';
import { StatusView, Text } from '@Elements';
import I18n from '@I18n';
import Swipeable from 'react-native-swipeable';
import moment from 'moment';
import { HorizontalLine, VerticalLabelValue, Wrapper } from '../ItemCommon';
import LocaleConfig from '../../../Config/LocaleConfig';
import { surveyStatusColor } from '../../../Config/Constants';

import RightButtons from '../../Lists/RightButtons';
import { generateGUID } from '../../../Utils/number';
import { Colors } from '../../../Themes';

const InfoWrapper = styled.View`
  flex: 1;
`;

const RowWrapper = styled.View`
  flex-direction: row;
  align-items: flex-end;
  margin-bottom: 10px;
`;

const Title = styled(Text)`
  margin-bottom: 10px;
`;

const ID = styled(Text)`
  margin-bottom: 12px;
`;

const ItemSurveyEmployee = ({ item, onPress, onReopen }) => {
  const [swipeRef, setSwipeRef] = React.useState(null);

  const color = item.isSubmitted ? surveyStatusColor.SURVEYPUBLISH : surveyStatusColor.SURVEYUNPUBLISH;
  const startDate = moment(item.startDate).format(LocaleConfig.fullDateTimeFormat);
  const endDate = moment(item.endDate).format(LocaleConfig.fullDateTimeFormat);
  const statusName = I18n.t(item.isSubmitted ? 'SURVEY_SUBMITTED' : 'SURVEY_NOT_YET_SUBMITTED');

  const recenter = () => {
    if (swipeRef) {
      swipeRef.recenter();
    }
  };

  const SwipeWrapper = item.isSubmitted ? Swipeable : View;

  return (
    <SwipeWrapper
      rightButtonWidth={140}
      rightButtons={[
        <RightButtons
          key={generateGUID()}
          onPress={recenter}
          buttons={[
            {
              title: I18n.t('SURVEY_REOPEN'),
              color: Colors.azure,
              icon: 'document-outline',
              onPress: onReopen,
            },
          ]}
        />,
      ]}
      onRef={(c) => {
        setSwipeRef(c);
      }}
    >
      <Wrapper onPress={onPress}>
        <ID text={`#${item.surveyId}`} preset="bold" />
        <HorizontalLine />
        <InfoWrapper>
          <Title preset="bold" text={item.name} numberOfLines={2} />
          <RowWrapper>
            <VerticalLabelValue label="COMMON_START_DATE" value={startDate} />
            <VerticalLabelValue label="COMMON_END_DATE" value={endDate} />
          </RowWrapper>
          {!!item.totalScore && (
            <RowWrapper>
              <Text style={{ color: '#757575' }} text={`${I18n.t('TOTAL_SCORE')}: `} preset="medium" />
              <Text text={item.totalScore} preset="medium" />
            </RowWrapper>
          )}
          <StatusView status={{ colorCode: color, name: statusName }} />
        </InfoWrapper>
      </Wrapper>
    </SwipeWrapper>
  );
};

export default ItemSurveyEmployee;
