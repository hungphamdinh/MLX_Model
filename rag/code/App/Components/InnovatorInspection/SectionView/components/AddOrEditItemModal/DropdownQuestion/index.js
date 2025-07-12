import React, { Fragment } from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { Button } from '@Elements';
import I18n from '@I18n';
import _ from 'lodash';
import { formItemTypes } from '@Config/Constants';
import { FormOption, getEmptyOption } from '..';
import ImageFormQuestion from './ImageFormQuestion';
import ImagePicker from './ImagePicker';

const AddButton = styled(Button).attrs(() => ({
  containerStyle: {
    marginTop: 10,
  },
}))``;

const DropdownQuestion = ({ formMethods, questionType, name, labelName = 'label' }) => {
  const { watch } = formMethods;
  const setFieldValue = formMethods.setFieldValue || formMethods.setValue;
  const listDropdown = watch(name);

  const isImageQuestion = questionType === formItemTypes.IMAGE;

  const handleAddOption = () => {
    const newOption = getEmptyOption();
    setFieldValue(name, [...listDropdown, newOption]);
  };

  const handleRemoveOption = (id) => {
    const filteredOptions = listDropdown.filter((option) => option.id !== id);
    setFieldValue(name, filteredOptions);
  };

  const updateImageOptions = (optionId, selectedImage) => {
    const updatedOptions = listDropdown.map((option) => {
      if (option.id === optionId) {
        return { ...option, image: selectedImage };
      }
      return option;
    });

    setFieldValue(name, updatedOptions);
  };

  return (
    <Fragment>
      {_.map(listDropdown, (item, index) => {
        const optionName = `${I18n.t('FORM_OPTION')} ${index + 1}`;
        const allowAddImage = isImageQuestion && !item.image;

        return (
          <View key={item.uniqueId || item.id}>
            <FormOption
              required
              index={index}
              label={optionName}
              placeholder={optionName}
              name={`${name}.${index}.${labelName}`}
              onRemove={() => handleRemoveOption(item.id)}
              testID={`form-option-${index}`}
              suffixComponent={
                allowAddImage && (
                  <ImagePicker
                    item={item}
                    setFieldValue={setFieldValue}
                    listDropdown={listDropdown}
                    updateImageOptions={updateImageOptions}
                  />
                )
              }
            />
            {item.image && (
              <ImageFormQuestion allowDelete updateImageOptions={updateImageOptions} item={item} name={name} />
            )}
          </View>
        );
      })}
      <AddButton outline icon="add-outline" title={I18n.t('FORM_ADD_ANOTHER_OPTION')} onPress={handleAddOption} />
    </Fragment>
  );
};

export default DropdownQuestion;
