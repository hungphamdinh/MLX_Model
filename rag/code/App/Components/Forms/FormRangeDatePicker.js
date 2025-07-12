/**
 * Created by thienmd on 3/20/20
 */

import React from 'react';
import { get } from 'lodash';

import FormControl, { useCommonFormController } from './FormControl';
import RangeDatePiker from '../Commons/RangeDatePicker';
import { Divider } from '../../Elements';

const FormRangeDatePicker = ({ name, label, required, placeholder, inputStyle, app, ...props }) => {
  const { value, setFieldValue, error } = useCommonFormController(name);

  const fromDate = get(value, 'fromDate');
  const toDate = get(value, 'toDate');
  const onDateChange = (fDate, tDate) => {
    setFieldValue({
      fromDate: fDate,
      toDate: tDate,
    });
  };
  return (
    <FormControl label={label} error={error} required={required}>
      <Divider />
      <RangeDatePiker
        onDateChange={onDateChange}
        value={value}
        fromDate={fromDate}
        toDate={toDate}
        placeholder={placeholder}
        {...props}
      />
    </FormControl>
  );
};

export default FormRangeDatePicker;
