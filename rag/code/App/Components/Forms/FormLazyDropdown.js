/**
 * Created by thienmd on 3/20/20
 */

import React from 'react';
import I18n from '@I18n';

import FormControl, { commonFormStyles, useCommonFormController } from './FormControl';
import LazyDropdownItem from '../../Elements/LazyDropdownItem';

const FormLazyDropdown = ({
  name,
  label,
  options = [],
  required,
  onChange,
  translate,
  mode,
  placeholder = 'COMMON_SELECT',
  ...props
}) => {
  const { value, setFieldValue, error } = useCommonFormController(name);

  const small = mode === 'small';
  let styleLabel;
  if (small) {
    styleLabel = commonFormStyles.small.styleLabel;
  }
  return (
    <FormControl translate={translate} label={label} error={error} required={required} styleLabel={styleLabel}>
      <LazyDropdownItem
        {...props}
        placeholder={I18n.t(placeholder)}
        onChange={(values) => {
          setFieldValue(values);
          if (onChange) {
            onChange(values);
          }
        }}
        small={small}
        options={options}
        value={value}
      />
    </FormControl>
  );
};

export default FormLazyDropdown;
