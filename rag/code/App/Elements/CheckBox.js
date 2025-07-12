/* @flow */

import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text } from '.';
import { Colors } from '../Themes';
import { CheckboxType } from '../Components/Forms/FormCheckBox';

const checkBoxStyle = ({ checked, size, type, styleCheckBox }) => ({
  ...styles.checkBox,
  borderColor: !checked ? Colors.textSemiGray : Colors.bgGreen,
  backgroundColor: !checked ? Colors.bgWhite : Colors.bgGreen,
  width: size,
  height: size,
  borderRadius: type === CheckboxType.circle ? 20 : 5,
  ...styleCheckBox,
});
const CheckBox = ({
  type,
  title = '',
  size = 20,
  checked = false,
  onPressCheck,
  disabled = false,
  containerStyle,
  styleCheckBox,
}) => {
  const check = () => {
    onPressCheck(!checked);
  };
  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity
        disabled={disabled}
        style={checkBoxStyle({
          checked,
          size,
          type,
          styleCheckBox,
        })}
        onPress={check}
      >
        {checked && <Ionicons size={size - 5} name="checkmark-outline" color={Colors.bgWhite} />}
      </TouchableOpacity>
      {title.length > 0 && <Text style={[styles.text]} text={title} />}
    </View>
  );
};
export default CheckBox;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    marginLeft: 10,
  },
  checkBox: {
    borderWidth: 1,
    alignItems: 'center',
    borderRadius: 5,
  },
});
