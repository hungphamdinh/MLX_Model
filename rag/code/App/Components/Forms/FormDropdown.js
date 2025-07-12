/**
 * Created by thienmd on 3/20/20
 */

import React from 'react';
import I18n from '@I18n';

import FormControl, { commonFormStyles, useCommonFormController } from './FormControl';
import Dropdown from '../../Elements/Dropdown';

/**
* Option in FormDropdown will have format:
*
* Ex:
* [
          { name: "Football", value: "football" },
          { name: "Baseball", value: "baseball" },
          { name: "Hockey", value: "hockey" }
   ]
* */

const FormDropdown = ({
  name,
  label,
  options = [],
  required,
  onChange,
  translate,
  mode,
  labelStyle,
  placeholder,
  ...props
}) => {
  const { value, setFieldValue, error } = useCommonFormController(name);

  let containerStyle;
  let styleLabel;
  if (mode === 'small') {
    containerStyle = commonFormStyles.small.containerStyle;
    styleLabel = {
      ...commonFormStyles.small.styleLabel,
      ...labelStyle,
    };
  }

  return (
    <FormControl translate={translate} label={label} error={error} required={required} styleLabel={styleLabel}>
      <Dropdown
        {...props}
        placeholder={I18n.t(placeholder) || I18n.t('COMMON_SELECT')}
        onChange={(values, item) => {
          setFieldValue(values);
          if (onChange) {
            onChange(values, item);
          }
        }}
        options={options}
        value={value}
        containerStyle={containerStyle}
        titleStyle={styleLabel && { fontSize: styleLabel?.fontSize }}
      />
    </FormControl>
  );
};

export default FormDropdown;
