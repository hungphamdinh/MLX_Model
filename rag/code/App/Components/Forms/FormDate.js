/**
 * Created by thienmd on 3/20/20
 */

import React from 'react';

import FormControl, { commonFormStyles, useCommonFormController } from './FormControl';
import DatePicker from '../../Elements/DatePicker';

const FormDate = ({
  label,
  required,
  placeholder,
  inputStyle,
  app,
  isIncludeTime = false,
  minimumDate,
  mode = 'date',
  containerStyle,
  small,
  noBorder,
  overflow = true,
  onChangeDate,
  name,
  ...props
}) => {
  const { value, setFieldValue, error } = useCommonFormController(name);

  const onDateChange = (date) => {
    const now = new Date();
    if (isIncludeTime) {
      date.setHours(now.getHours(), now.getMinutes(), now.getSeconds());
    }
    if (onChangeDate) {
      onChangeDate(date);
    }
    setFieldValue(date);
  };

  let styleLabel;
  if (small) {
    styleLabel = commonFormStyles.small.styleLabel;
  }
  if (noBorder) {
    inputStyle = {
      ...commonFormStyles.noBorder.containerStyle,
    };
  }

  return (
    <FormControl
      label={label}
      error={error}
      required={required}
      styleLabel={styleLabel}
      labelChild={props.labelChild}
      style={overflow ? { flex: 1 } : null}
    >
      <DatePicker
        mode={mode}
        onDateChange={onDateChange}
        containerStyle={[inputStyle, props.containerStyle]}
        value={value}
        minimumDate={minimumDate}
        placeholder={placeholder}
        small={small}
        {...props}
      />
    </FormControl>
  );
};

export default FormDate;
