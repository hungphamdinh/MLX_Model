/**
 * Created by thienmd on 3/20/20
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import _ from 'lodash';
import FormControl, { useCommonFormController, commonFormStyles } from './FormControl';
import TextInputMoney from '../TextInputMoney';
import { Colors } from '../../Themes';
import LocaleConfig from '../../Config/LocaleConfig';

const FormNumberInput = ({
  name,
  label,
  required,
  translate,
  maxLength = 4,
  textOptions,
  editable = true,
  mode,
  noBorder = false,
  rightButton,
  ...props
}) => {
  const { value, setFieldValue, error } = useCommonFormController(name);
  let inputStyle = styles.input;

  let styleLabel;
  if (mode === 'small') {
    inputStyle = commonFormStyles.small.containerStyle;
    styleLabel = commonFormStyles.small.styleLabel;
  }

  const onChangeText = (text, rawValue) => {
    if (maxLength && _.size(text) > maxLength) {
      return;
    }
    setFieldValue({
      text,
      rawValue,
    });
  };

  const options = {
    precision: LocaleConfig.precision,
    separator: LocaleConfig.decimalSeparator,
    delimiter: LocaleConfig.groupSeparator,
    unit: '',
    suffix: '',
  };
  if (noBorder) {
    inputStyle = {
      ...inputStyle,
      ...commonFormStyles.noBorder.containerStyle,
    };
  }
  return (
    <FormControl rightButton={rightButton} label={label} error={error} translate={translate} required={required} styleLabel={styleLabel}>
      <TextInputMoney
        inputOptions={textOptions || options}
        value={value && value.text}
        containerStyle={inputStyle}
        includeSymbol={false}
        style={[styles.input, { borderWidth: noBorder ? 0 : 1 }, !editable && styles.disabled]}
        onChangeText={onChangeText}
        editable={editable}
        {...props}
      />
    </FormControl>
  );
};

export default FormNumberInput;

const styles = StyleSheet.create({
  input: {
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 20,
    height: 40,
    paddingHorizontal: 12,
    flex: 1,
  },
  disabled: {
    backgroundColor: Colors.disabled,
  },
});
