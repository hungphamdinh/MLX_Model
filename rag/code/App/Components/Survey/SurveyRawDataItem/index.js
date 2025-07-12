import React from 'react';
import IconAndLabelItem from '../IconAndLabelItem';
import { Wrapper } from '../../ItemApp/ItemCommon';
import { Colors } from '../../../Themes';

const SurveyRawDataItem = ({ onPress, item: { user, formUserAnswer } }) => (
  <Wrapper
    style={{ backgroundColor: formUserAnswer ? 'white' : Colors.border }}
    onPress={onPress}
    disabled={!formUserAnswer}
  >
    <IconAndLabelItem iconName="person" label={user.displayName} />
    <IconAndLabelItem iconName="mail" label={user.emailAddress} noMargin />
  </Wrapper>
);

export default SurveyRawDataItem;

SurveyRawDataItem.defaultProps = {};
