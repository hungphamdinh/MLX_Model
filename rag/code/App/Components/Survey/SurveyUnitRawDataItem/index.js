import _ from 'lodash';

import React, { useState } from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity, View } from 'react-native';
import I18n from '@I18n';
import IconAndLabelItem from '../IconAndLabelItem';
import { Wrapper } from '../../ItemApp/ItemCommon';
import { Colors } from '../../../Themes';

const Container = styled(View)`
  margin-bottom: 10px;
`;

const UnitContainer = styled(View)`
  margin-bottom: 10px;
`;

const ExpandedTouchable = styled(TouchableOpacity)`
  padding: 10px;
  margin-horizontal: 20px;
  margin-top: 10px;
  background-color: white;
  border-radius: 10px;
`;

const SurveyUnitRawDataItem = ({ onPress, item: { unit, userAnswers = [] } }) => {
  const [expand, setExpand] = useState(false);
  const disabled = _.isEmpty(userAnswers);

  const onPressItem = () => {
    if (unit) {
      setExpand((prev) => !prev);
    }
  };

  return (
    <Container>
      <Wrapper
        testID="wrapper" // Added for testing purposes
        style={{ backgroundColor: !disabled ? 'white' : Colors.border }}
        onPress={onPressItem}
        disabled={disabled}
      >
        <UnitContainer>
          <IconAndLabelItem iconName="location" label={unit?.fullUnitCode} />
          <IconAndLabelItem
            iconName="clipboard"
            label={`${I18n.t('RESPONSE_COUNT')}: ${_.size(userAnswers)}`}
            noMargin
          />
        </UnitContainer>
      </Wrapper>
      {expand &&
        userAnswers.map((answer, index) => (
          <ExpandedTouchable key={answer.id} onPress={() => onPress(answer.id)} testID={`userAnswer-${index}`}>
            <IconAndLabelItem
              iconName="mail"
              label={answer.userAnswer.emailAddress}
              testID={`userAnswer-mail-${index}`}
            />
            <IconAndLabelItem
              iconName="person"
              label={answer.userAnswer.displayName}
              testID={`userAnswer-person-${index}`}
            />
          </ExpandedTouchable>
        ))}
    </Container>
  );
};

export default SurveyUnitRawDataItem;

SurveyUnitRawDataItem.defaultProps = {};
