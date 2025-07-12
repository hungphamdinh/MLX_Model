import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Button } from '../../../Elements';
import { Colors } from '../../../Themes';

const ButtonExpand = ({ expanded, onPress, size = 20, color = Colors.azure }) => {
  const onPressExpand = () => {
    onPress(!expanded);
  };
  return (
    <Button onPress={onPressExpand}>
      <Ionicons name={!expanded ? 'chevron-up' : 'chevron-down'} color={color} size={size} />
    </Button>
  );
};

export default ButtonExpand;
