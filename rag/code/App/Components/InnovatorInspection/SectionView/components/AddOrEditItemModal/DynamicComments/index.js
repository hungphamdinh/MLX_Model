import React, { Fragment } from 'react';
import { View } from 'react-native';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import styled from 'styled-components/native';
import { FormInput } from '@Forms';
import Ionicons from 'react-native-vector-icons/Ionicons';
import I18n from '@I18n';
import { Button } from '@Elements';
import { Colors } from '@Themes';

const RemoveButton = styled.TouchableOpacity`
  padding: 4px;
  position: absolute;
  right: 0px;
  top: -5px;
`;

const DynamicComments = () => {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    keyName: 'uniqueId',
    control,
    name: 'comments',
  });

  const guid = useWatch({name: 'guid'})
  const formQuestionId = useWatch({name: 'id'})

  const removeInput = (index) => {
    if (fields.length > 0) {
      remove(index);
    }
  };
  
  const addInput = () => {
    if (fields.length < 5) {
      append({ titleComment: '', guid, formQuestionId });
    }
  };

  return (
    <Fragment>
      {fields.map((field, index) => (
        <View key={field.uniqueId}>
          <FormInput
            placeholder={'DYNAMIC_COMMENT_PLACE_HOLDER'}
            name={`comments.${index}.titleComment`}
            label={`${index + 1}. ${I18n.t('COMMENT')}`}
            required
          />
          <RemoveButton testID="button-remove" onPress={() => removeInput(index)}>
            <Ionicons name="close-circle-outline" size={20} color={Colors.red} />
          </RemoveButton>
        </View>
      ))}

      {fields.length < 5 && <Button icon="add-circle-outline" title="ADD_COMMENT" onPress={addInput} />}
    </Fragment>
  );
};

export default DynamicComments;
