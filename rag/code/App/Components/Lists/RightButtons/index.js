import { TouchableOpacity, View } from 'react-native';
import React from 'react';
import IonIcon from 'react-native-vector-icons/Ionicons';

import styles, { swipeableButton } from './styles';
import { Text } from '../../../Elements';

export const SwipeableButton = ({ title, color, onPress, icon, disabled }) => {
  const buttonColor = disabled ? 'gray' : color;
  return (
    <TouchableOpacity disabled={disabled} style={swipeableButton.container} onPress={onPress}>
      <IonIcon name={icon} color={buttonColor} size={20} />
      <Text preset="medium" style={[swipeableButton.title, { color: buttonColor }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const RightButtons = ({ buttons, onPress }) => (
  <View style={styles.container}>
    {buttons.map((button) => (
      <SwipeableButton
        {...button}
        onPress={() => {
          if (onPress) {
            onPress();
          }
          button.onPress();
        }}
        key={button.title}
      />
    ))}
  </View>
);

export default RightButtons;
