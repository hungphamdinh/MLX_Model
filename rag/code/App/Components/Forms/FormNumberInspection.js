/**
 * Created by thienmd on 3/20/20
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import I18n from '@I18n';
import Input from '@Elements/Input';
import LocaleConfig from '@Config/LocaleConfig';
import { MAX_TEXT_LENGTH } from '@Config/Constants';
import FormControl, { useCommonFormController, commonFormStyles } from './FormControl';
import { INSPECTION_FORM_TYPE } from '../../Config/Constants';
import useForm from '../../Context/Form/Hooks/UseForm';

const FormNumberInspection = ({ name, label, required, translate, textOptions, placeholder, mode, ...props }) => {
  const { value, setFieldValue, error } = useCommonFormController(name);
  const [intValue, setIntValue] = React.useState(0);
  const [number, setNumber] = React.useState('');

  const {
    form: { formType },
  } = useForm();

  const isInventoryCheckList = formType === INSPECTION_FORM_TYPE.INVENTORY_CHECK_LIST;
  const inputPlaceHolder = isInventoryCheckList
    ? 'INSPECTION_INVENTORY_PLACE_HOLDER_INPUT_NUMBER'
    : 'COMMON_PLACE_HOLDER_INPUT_NUMBER';
  const maxTextLength = MAX_TEXT_LENGTH;
  const precision = LocaleConfig.precision;
  const numericLength = intValue ? intValue.length + precision + 1 : null;

  let inputStyle;
  let styleLabel;

  if (mode === 'small') {
    inputStyle = commonFormStyles.small.containerStyle;
    styleLabel = commonFormStyles.small.styleLabel;
  }

  let numberInputMaxLength = maxTextLength;
  if (numericLength && numericLength < maxTextLength) {
    numberInputMaxLength = numericLength;
  }

  function term(str, char) {
    const xStr = str.substring(0, str.length - 1);
    return xStr + char;
  }

  function autoFillWhenInputOnlySeparator(numberValue) {
    if (numberValue === '.') {
      numberValue = `0.${numberValue}`;
    }
    if (numberValue === ',') {
      numberValue = `0,${numberValue}`;
    }
    return numberValue;
  }

  const onChangeNumber = (text) => {
    const numberValue = autoFillWhenInputOnlySeparator(text);

    const countComma = numberValue.split('.').length - 1;
    const countDot = numberValue.split(',').length - 1;
    const decimalPart = numberValue.indexOf(',') > -1 ? numberValue.indexOf(',') : numberValue.indexOf('.');
    const valueInt = numberValue.substring(0, decimalPart);

    setIntValue(valueInt);

    // user input 2 dot
    if (countComma > 1 || countDot > 1) {
      const valWithSeparator = term(numberValue, '');
      setFieldValue(`${valWithSeparator}`);
      setNumber(`${valWithSeparator}`);
      return;
    }
    setFieldValue(`${numberValue}`);
    setNumber(`${numberValue}`);
  };

  const onBlurNumber = () => {
    const charRemaining = numericLength - number.length;
    if ((number.includes('.') || number.includes(',')) && numericLength !== number.length) {
      let decimalPrecision = '';
      for (let i = 0; i < charRemaining; i += 1) {
        decimalPrecision += '0';
      }
      setFieldValue(number + decimalPrecision);
    }
  };
  return (
    <FormControl label={label} error={error} translate={translate} required={required} styleLabel={styleLabel}>
      <Input
        style={[styles.input]}
        containerStyle={[inputStyle]}
        mode={mode}
        placeholder={I18n.t(inputPlaceHolder)}
        maxLength={numberInputMaxLength}
        isNotFocusNextInput
        keyboardType={precision === 0 ? 'number-pad' : 'decimal-pad'}
        border
        {...props}
        value={value}
        onChangeText={(text) => onChangeNumber(text)}
        onBlur={() => onBlurNumber()}
      />
    </FormControl>
  );
};

export default FormNumberInspection;

const styles = StyleSheet.create({
  input: {
    flex: 1,
  },
});
