import React from 'react';
import { LayoutAnimation, View } from 'react-native';
import _ from 'lodash';
import { CheckBox } from './FormCheckBox';
import FormControl, { useCommonFormController } from './FormControl';
import { generateInspectionUUID, TableNames } from '../../Services/OfflineDB/IDGenerator';
import ImageFormQuestion from '../InnovatorInspection/SectionView/components/AddOrEditItemModal/DropdownQuestion/ImageFormQuestion';

const MultipleChoice = ({ options, allowMultiple, selectedChoices, onValueChange, uaqId }) => {
  const selectedChoiceValues = _.map(selectedChoices, 'value');

  const toggleValue = (choice) => {
    const newChoice = { ...choice, uaqId, id: generateInspectionUUID(TableNames.formUserAnswerQuestionOption) };
    if (allowMultiple && selectedChoices) {
      const newSelectedChoices = selectedChoiceValues.includes(choice.value)
        ? selectedChoices.filter((item) => item.value !== choice.value)
        : [...selectedChoices, newChoice];
      onValueChange(newSelectedChoices);
    } else {
      onValueChange([newChoice]);
    }
  };

  return options.map((item) => {
    const checked = selectedChoiceValues.includes(item.value);
    return (
      <View>
        <CheckBox
          key={item.value}
          checkboxType="circle"
          value={checked}
          label={item.label}
          onCheckBoxPress={() => toggleValue(item)}
          containerStyle={{ marginRight: 10 }}
        />
        {item.image && <ImageFormQuestion item={item} iconStyle={{ width: 100, height: 100, marginBottom: 10 }} />}
      </View>
    );
  });
};

const FormMultipleChoiceInspection = ({
  label,
  options,
  name,
  translate,
  containerStyle,
  horizontal = false,
  onChange,
  ...restProps
}) => {
  const { value, setFieldValue, error } = useCommonFormController(name);

  const onValueChange = (values) => {
    setFieldValue(values);
    if (onChange) {
      onChange(values);
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  return (
    <FormControl label={label} error={error} translate={translate} style={containerStyle}>
      <View style={{ flexDirection: horizontal ? 'row' : 'column' }}>
        <MultipleChoice options={options} selectedChoices={value} onValueChange={onValueChange} {...restProps} />
      </View>
    </FormControl>
  );
};

export default FormMultipleChoiceInspection;
