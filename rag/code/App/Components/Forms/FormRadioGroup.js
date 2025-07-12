/**
 * Created by thienmd on 3/26/20
 */
import React from 'react';
import { LayoutAnimation, View } from 'react-native';
import PropTypes from 'prop-types';
import { CheckBox } from './FormCheckBox';
import FormControl, { commonFormStyles, useCommonFormController } from './FormControl';

const RadioGroup = ({ options, allowMultiple, values, onValueChange, disabled }) => {
  const onCheckBoxPress = (item) => {
    if (allowMultiple) {
      if (isExist(item)) {
        onValueChange(values.filter((value) => value !== item.value));
        return;
      }
      onValueChange([...values, item.value]);
      return;
    }

    onValueChange([item.value]);
    // LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  const isExist = (item) => values.findIndex((value) => value === item.value) > -1;

  return options.map((item) => {
    const checked = isExist(item);
    return (
      <CheckBox
        key={item.value}
        checkboxType="circle"
        value={checked}
        label={item.label}
        onCheckBoxPress={() => onCheckBoxPress(item)}
        containerStyle={{ marginRight: 10 }}
        disabled={disabled}
      />
    );
  });
};

const Value = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);

const Option = PropTypes.shape({
  label: PropTypes.string,
  value: Value,
});

RadioGroup.propTypes = {
  options: PropTypes.arrayOf(Option),
  allowMultiple: PropTypes.bool,
  values: PropTypes.arrayOf(Value),
};

RadioGroup.defaultProps = {
  options: [],
  allowMultiple: false,
  values: [],
};

const FormRadioGroup = ({
  label,
  options,
  name,
  translate,
  containerStyle,
  horizontal = false,
  onChange,
  required,
  mode,
  ...restProps
}) => {
  const { value, setFieldValue, error } = useCommonFormController(name);
  let styleLabel;
  if (mode === 'small') {
    styleLabel = commonFormStyles.small.styleLabel;
  }
  const onValueChange = (values) => {
    setFieldValue(values);
    if (onChange) {
      onChange(values);
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  return (
    <FormControl
      label={label}
      error={error}
      translate={translate}
      styleLabel={styleLabel}
      style={containerStyle}
      required={required}
    >
      <View style={{ flexDirection: horizontal ? 'row' : 'column' }}>
        <RadioGroup options={options} values={value} onValueChange={onValueChange} {...restProps} />
      </View>
    </FormControl>
  );
};

export default FormRadioGroup;
