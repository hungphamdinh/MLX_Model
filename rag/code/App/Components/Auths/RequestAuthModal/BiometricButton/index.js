import React from 'react';
import styled from 'styled-components/native';
import { Colors } from '@Themes';
import { icons } from '../../../../Resources/icon';
import { Text } from '../../../../Elements';

const IconButton = styled.TouchableOpacity`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: ${Colors.primary};
  align-items: center;
  justify-content: center;
  margin-left: 20px;
`;

const Icon = styled.Image`
  width: 30px;
  height: 30px;
  tint-color: black;
`;

const RectangleWrapper = styled.TouchableOpacity`
  align-self: center;
  align-items: center;
  justify-content: center;
  padding-left: 16px;
  padding-right: 16px;
  border-radius: 25px;
  background-color: #ffe136;
  flex-direction: row;
  height: 50px;
`;

const Title = styled(Text)`
  margin-left: 10px;
  color: black;
`;

export const buttonTypes = {
  circle: 'circle',
  rectangle: 'rectangle',
};

const BiometricButton = ({ availableSensor, onPress, type = buttonTypes.circle }) => {
  if (!availableSensor) {
    return null;
  }

  const icon = <Icon source={availableSensor === 'FaceID' ? icons.faceId : icons.fingerPrint} />;
  if (type === buttonTypes.rectangle) {
    return (
      <RectangleWrapper onPress={onPress}>
        {icon}
        <Title text="AUTH_UNLOCK_WITH_BIOMETRIC" preset="medium" />
      </RectangleWrapper>
    );
  }
  return (
    <IconButton testID="biometric-button" onPress={onPress}>
      {icon}
    </IconButton>
  );
};

export default BiometricButton;
