import React, { Fragment } from 'react';
import styled from 'styled-components/native';
import { getEmptySubUserAnswerQuestion } from '@Transforms/InspectionTransformer';
import { TableNames } from '@Services/OfflineDB/IDGenerator';
import _ from 'lodash';
import { FormCheckBox, FormInput } from '@Forms';
import { Modules, formItemTypes, MAX_TEXT_LENGTH } from '@Config/Constants';
import { useFormContext } from 'react-hook-form';
import { getEmptyOption } from '..';
import SubQuestionOption from '../SubQuestionOption';

const CheckBoxWrapper = styled.View`
  padding-horizontal: 20px;
`;

const advancedOptions = [
  {
    name: 'FORM_ADDITIONAL_ANSWER',
    value: 0,
    optionName: 'isAdditional',
  },
  {
    name: 'FORM_SUB_QUESTION',
    value: 1,
    optionName: 'isSubQuestion',
  },
];

const CheckBoxAdvance = ({ moduleId, questionTypes, setValue, ...props }) => {
  const { setValue: setFieldValue, watch } = useFormContext();
  const [subQuestion, isAdvance, isSubQuestion, isAdditional] = watch([
    'subQuestion',
    'isAdvance',
    'isSubQuestion',
    'isAdditional',
  ]);

  const defaultValues = isAdditional
    ? {
        description: '',
      }
    : {
        description: '',
        answers: [],
      };

  const addDefaultOptions = (answers, name) => {
    if (_.size(answers) < 2) {
      setFieldValue(name, [
        getEmptyOption(TableNames.formSubQuestionAnswer),
        getEmptyOption(TableNames.formSubQuestionAnswer),
      ]);
    }
  };

  const setSubQuestionValues = (val) => {
    setFieldValue('subQuestion', {
      ...subQuestion,
      ...val,
    });
  };

  React.useEffect(() => {
    if (isSubQuestion) {
      if (!_.size(subQuestion.answers)) {
        addDefaultOptions([], 'subQuestion.answers');
      }
      setSubQuestionValues({
        formQuestionTypeId: formItemTypes.MULTIPLE_CHOICE,
      });
    }

    if (isAdditional) {
      setSubQuestionValues({
        formQuestionTypeId: formItemTypes.TEXT_AREA,
      });
    }
  }, [isAdditional, isSubQuestion]);

  const isInspection = (condition) => Modules.SURVEY !== moduleId && condition;

  const onPressAdvanceItem = (_item, name) => {
    setSubQuestionValues(defaultValues);
    if (name === 'isAdditional') {
      setFieldValue('isSubQuestion', false);
      return;
    }
    setFieldValue('isAdditional', false);
  };

  const onChangeOption = (val) => {
    if (val) {
      setSubQuestionValues({
        ...getEmptySubUserAnswerQuestion(),
      });
      setFieldValue('isAdditional', true);
      setFieldValue('isSubQuestion', false);
      return;
    }
    setFieldValue('isAdditional', false);
    setFieldValue('isSubQuestion', false);
  };

  return (
    <Fragment>
      <FormCheckBox onChange={onChangeOption} label="FORM_ADVANCE" name="isAdvance" />
      {isInspection(isAdvance) && (
        <CheckBoxWrapper>
          {advancedOptions.map((item) => (
            <FormCheckBox
              key={item.value}
              onChange={onPressAdvanceItem}
              isRadioBtn
              label={item.name}
              name={item.optionName}
            />
          ))}
        </CheckBoxWrapper>
      )}
      {isAdditional && (
        <FormInput
          maxLength={MAX_TEXT_LENGTH}
          label="ADDITIONAL_ANSWER_HINT"
          name="subQuestion.description"
          multiline
          autoHeight
          placeholder="ADDITIONAL_ANSWER_PLACEHOLDER"
        />
      )}

      {isSubQuestion && <SubQuestionOption {...props} />}
    </Fragment>
  );
};

export default CheckBoxAdvance;
