import React from 'react';
import styled from 'styled-components/native';
import { Text, Icon } from '@Elements';
import I18n from '@I18n';
import Ionicon from 'react-native-vector-icons/Ionicons';

import LocaleConfig from '../../Config/LocaleConfig';
import { Colors } from '../../Themes';

const Wrapper = styled.View`
  margin-top: 12px;
`;

const ValueWrapper = styled.View`
  height: 42px;
  border-radius: 21px;
  background-color: ${({ disabled }) => (disabled ? Colors.disabled : 'white')};
  padding-horizontal: 10px;
  margin-top: 12px;
  flex-direction: row;
  align-items: center;
`;

const Label = styled(Text)`
  font-size: 15px;
  margin-left: ${({ paddingLeft }) => paddingLeft}px;
  color: #001335;
`;

const Value = styled(Text)`
  margin-left: 5px;
  flex: 1;
`;

const Button = styled.TouchableOpacity``;

const InfoText = ({
  label,
  value,
  icon,
  onPress,
  paddingLeftLabel = 12,
  iconSize,
  iconColor,
  textStyle,
  disabled,
  source,
  labelStyle,
  containerStyle,
  testID,
}) => {
  if (!value && value !== 0) {
    return null;
  }

  const displayText = typeof value === 'number' ? LocaleConfig.formatNumber(value, 0) : value;

  return (
    <Wrapper testID={testID}>
      <Label paddingLeft={paddingLeftLabel} text={`${I18n.t(label)}`} preset="medium" style={labelStyle} />
      <ValueWrapper style={containerStyle} disabled={disabled}>
        <Value style={textStyle} text={displayText} />

        {icon || source ? (
          <Button onPress={onPress}>
            {source ? (
              <Icon source={source} size={iconSize || 15} />
            ) : (
              <Ionicon name={icon} size={iconSize || 25} color={iconColor || 'black'} />
            )}
          </Button>
        ) : null}
      </ValueWrapper>
    </Wrapper>
  );
};

export default InfoText;
