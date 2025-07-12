import React from 'react';
import { View } from 'react-native';
import { Text } from '@Elements';
import styled from 'styled-components';
import { FormDropdown } from '@Forms';
import { TableNames, generateInspectionUUID } from '../../../../../../Services/OfflineDB/IDGenerator';

const Label = styled(Text)`
  margin-bottom: 10px;
`;

const generateOptionsWithIds = (answers, subQuestionId) =>
  answers.map((answer) => ({
    ...answer,
    value: answer.value || answer.id,
    uaqId: answer.uaqId || subQuestionId,
    id: generateInspectionUUID(TableNames.formSubUserAnswerQuestionOption),
  }));

const SubQuestion = ({ subQuestion, setFieldValue, ...props }) => {
  const formName = props.formName;

  const onChangeAnswers = (answers) => {
    const subUserAnswerQuestionId = generateInspectionUUID(TableNames.formSubUserAnswerQuestion);
    const subUserAnswerQuestion = subQuestion.subUserAnswerQuestion || { id: subUserAnswerQuestionId };
    const uaqOptions = generateOptionsWithIds(answers, subUserAnswerQuestion.id);

    setFieldValue(`${formName}.subQuestion.uaqOptions`, uaqOptions);
    setFieldValue(`${formName}.subQuestion.subUserAnswerQuestion`, subUserAnswerQuestion);
  };

  return (
    <View>
      <Label preset="medium" text={subQuestion.description} />
      <FormDropdown
        multiple={subQuestion.isMultiAnswer}
        isArrayResults
        options={subQuestion.answers.map((item) => ({ ...item, value: item.id }))}
        mode="small"
        name={`${formName}.subQuestion.uaqOptions`}
        fieldName="description"
        valKey="value"
        showValue={false}
        onChange={onChangeAnswers}
        {...props}
      />
    </View>
  );
};

export default SubQuestion;
