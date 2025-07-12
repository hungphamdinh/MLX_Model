/**
 * Created by thienmd on 3/20/20
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import FormControl, { useCommonFormController, commonFormStyles } from './FormControl';
import TextInputMoney from '../TextInputMoney';
import { Colors } from '../../Themes';

const FormMoneyInput = ({ name, label, required, translate, noBorder = false, mode, ...props }) => {
  const { value, setFieldValue, error } = useCommonFormController(name);
  let inputStyle = styles.input;
  let styleLabel;

  if (noBorder) {
    inputStyle = {
      ...inputStyle,
      ...commonFormStyles.noBorder.containerStyle,
    };
  }
  if (mode === 'small') {
    inputStyle = {
      paddingHorizontal: 10,
      ...commonFormStyles.small.containerStyle,
    };
    styleLabel = commonFormStyles.small.styleLabel;
  }

  const onChangeText = (text, rawValue) => {
    setFieldValue({
      text,
      rawValue,
    });
  };

  return (
    <FormControl styleLabel={styleLabel} label={label} error={error} translate={translate} required={required}>
      <TextInputMoney value={value.text} style={inputStyle} onChangeText={onChangeText} {...props} />
    </FormControl>
  );
};

export default FormMoneyInput;

const styles = StyleSheet.create({
  input: {
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 20,
    height: 40,
    backgroundColor: 'white',
    paddingHorizontal: 12,
    flex: 1,
  },
});
