/**
 * Created by thienmd on 3/26/20
 */
import React from 'react';
import { LayoutAnimation } from 'react-native';
import FilterCheckBox from '../FilterCheckBox';
import { useCommonFormController } from './FormControl';

const FormFilterCheckBox = ({ data, name, onSelectedValue }) => {
  const { value, setFieldValue } = useCommonFormController(name);
  const onCheckBoxPress = (val) => {
    setFieldValue(val);
    if (onSelectedValue) {
      onSelectedValue(val);
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  return <FilterCheckBox selectedFilter={value} data={data} onSelectedValue={onCheckBoxPress} />;
};
export default FormFilterCheckBox;
