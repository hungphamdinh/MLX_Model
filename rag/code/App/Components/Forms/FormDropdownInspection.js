/**
 * Created by thienmd on 3/20/20
 */

import React from 'react';
import I18n from '@I18n';
import _ from 'lodash';
import FormControl, { commonFormStyles, useCommonFormController } from './FormControl';
import Dropdown from '../../Elements/Dropdown';
import { generateGUID } from '../../Utils/number';
import { TableNames } from '../../Services/OfflineDB/IDGenerator';

/**
* Option in FormDropdownInspection will have format:
*
* Ex:
* [
          { name: "Football", value: "football" },
          { name: "Baseball", value: "baseball" },
          { name: "Hockey", value: "hockey" }
   ]
* */

const FormDropdownInspection = ({
  name,
  label,
  options = [],
  required,
  onChange,
  translate,
  mode,
  labelStyle,
  placeholder,
  uaqId,
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

  const onValueChange = (item) => {
    let id = _.get(value, 'id');
    if (!id) {
      id = generateGUID(TableNames.formUserAnswerQuestionOption);
    }
    const newValue = { ...item, uaqId, id };

    setFieldValue(newValue);
  };

  return (
    <FormControl translate={translate} label={label} error={error} required={required} styleLabel={styleLabel}>
      <Dropdown
        {...props}
        placeholder={I18n.t(placeholder) || I18n.t('COMMON_SELECT')}
        onChange={(values) => {
          onValueChange(values);
          if (onChange) {
            onChange(values);
          }
        }}
        options={options}
        value={value}
        showValue={false}
        valKey="value"
        containerStyle={containerStyle}
        titleStyle={styleLabel && { fontSize: styleLabel.fontSize }}
      />
    </FormControl>
  );
};

export default FormDropdownInspection;
