/**
 * Created by thienmd on 3/26/20
 */
import React from 'react';
import { LayoutAnimation, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '@Elements';
import { Metric, Colors } from '@Themes';
import Icon from 'react-native-vector-icons/Ionicons';
import { useCommonFormController } from './FormControl';

export const CheckboxType = {
  circle: 'circle',
  square: 'square',
};

export const CheckBox = ({
  testID,
  checkboxType,
  onCheckBoxPress,
  label,
  value,
  labelFirst = false,
  containerStyle,
  labelStyle,
  isRadioBtn = false,
  disabled,
}) => {
  const boxStyles = () => ({
    ...styles.box,
    borderColor: disabled ? Colors.textSemiGray : '#707070',
  });

  const checkButton = (
    <View style={[boxStyles(), checkboxType === CheckboxType.circle || isRadioBtn ? { borderRadius: 11 } : {}]}>
      {value && (
        <>
          {isRadioBtn ? (
            <View style={styles.radioButton} />
          ) : (
            <Icon style={styles.icon} name="checkmark-outline" color="#000000" size={18} />
          )}
        </>
      )}
    </View>
  );

  return (
    <TouchableOpacity
      testID={testID}
      style={[styles.container, containerStyle]}
      onPress={onCheckBoxPress}
      activeOpacity={0.5}
      disabled={disabled}
    >
      {!labelFirst && checkButton}
      <Text
        style={[
          styles.label,
          {
            marginLeft: labelFirst ? 0 : 10,
            marginRight: labelFirst ? 10 : 0,
          },
          labelStyle,
        ]}
        text={label}
      />
      {labelFirst && checkButton}
    </TouchableOpacity>
  );
};

const FormCheckBox = ({ label, name, translate, onChange, ...restProps }) => {
  const { value, setFieldValue } = useCommonFormController(name);
  const checkedValueByType = () => {
    if (restProps?.isRadioBtn && value) {
      return value;
    }
    return !value;
  };

  const onCheckBoxPress = () => {
    setFieldValue(checkedValueByType());
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (onChange) {
      onChange(!value, name);
    }
  };

  return (
    <CheckBox value={value} label={label} onCheckBoxPress={onCheckBoxPress} translate={translate} {...restProps} />
  );
};
export default FormCheckBox;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Metric.Space,
  },
  label: {
    color: 'black',
    fontSize: 12,
    marginLeft: Metric.space10,
  },
  box: {
    borderRadius: 4,
    borderWidth: 1,
    width: 20,
    height: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButton: {
    backgroundColor: Colors.text,
    width: 9,
    height: 9,
    borderRadius: 20,
  },
});
