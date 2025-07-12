import React, { Fragment } from 'react';
import { FormCheckBox, FormInput } from '@Forms';
import { useFormContext } from 'react-hook-form';
import { MAX_TEXT_LENGTH } from '@Config/Constants';
import DropdownQuestion from '../DropdownQuestion';

const SubQuestionOption = () => {
  const formMethods = useFormContext();

  return (
    <Fragment>
      <FormInput
        maxLength={MAX_TEXT_LENGTH}
        label="FORM_SUB_QUESTION"
        name="subQuestion.description"
        multiline
        autoHeight
        required
      />
      <DropdownQuestion
        formMethods={formMethods}
        name="subQuestion.answers"
        labelName="description"
      />
      <FormCheckBox label="FORM_ALLOW_SELECT_MULTIPLE_ANSWERS" name="subQuestion.isMultiAnswer" />
    </Fragment>
  );
};

export default SubQuestionOption;
