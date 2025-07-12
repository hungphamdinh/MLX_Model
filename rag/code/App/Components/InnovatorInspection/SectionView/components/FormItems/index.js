/* eslint-disable no-case-declarations */
/**
 * Created by thienmd on 10/19/20
 */
import React, { Fragment } from 'react';
import {
  FormDate,
  FormInput,
  FormRating,
  FormRatingInspection,
  FormDropdownInspection,
  FormMultipleChoiceInspection,
  FormNumberInspection,
} from '@Components/Forms';
import _ from 'lodash';
import { useFormMemo } from '@Utils/hook';
import { MAX_TEXT_LENGTH, formItemTypes } from '@Config/Constants';
import I18n from '@I18n';
import { useFormContext } from 'react-hook-form';
import withFormItem from './FormItemHoc';
import {
  InspectionMeterReading,
  InspectionVisualDefect,
  InspectionMarching,
  InspectionInventoryQuantity,
} from '../../../SpecialQuestion';

export const DateTime = withFormItem(FormDate);

export const TextInput = withFormItem(FormInput);

export const Dropdown = withFormItem(FormDropdownInspection);

export const Rating = withFormItem(FormRating);

export const MultipleChoose = withFormItem(FormMultipleChoiceInspection);

export const RatingInspection = withFormItem(FormRatingInspection);

export const MeterReading = withFormItem(InspectionMeterReading);

export const VisualDefect = withFormItem(InspectionVisualDefect);

export const Marching = withFormItem(InspectionMarching);

export const InventoryQuantity = withFormItem(InspectionInventoryQuantity);

export const NumberInput = withFormItem(FormNumberInspection);

export const FormItemComponent = ({
  question,
  formName,
  index,
  setIsEditItem,
  setSelectedForm,
  actionType,
  remove,
  uaqImages,
  setFieldValue,
  isNonEditable,
  uaqComment,
  pageEntityChangeType,
  uaqDeclareQuantity,
  uaqDefectDefectDescription,
  isDefect,
  uaqComments,
  ...props
}) => {
  const itemType = _.parseInt(_.get(question, 'questionType.id'));

  const maxTextLength = MAX_TEXT_LENGTH;

  const marchingOptions = [
    {
      id: '0',
      name: I18n.t('INSPECTION_MARCHING_OPTION_IN'),
    },
    {
      id: '1',
      name: I18n.t('INSPECTION_MARCHING_OPTION_OUT'),
    },
  ];

  const onEditPress = () => {
    setIsEditItem(true);
    setSelectedForm({
      item: question,
      idx: index,
    });
  };

  const baseProps = {
    onEditPress,
    actionType,
    onRemovePress: () => remove(index),
    mode: 'small',
    isImage: question?.isImage,
    isScore: question?.isScore,
    allowMultiple: question?.isMultiAnswer,
    isAllowComment: question?.isAllowComment,
    isDeclareQuantity: question?.isDeclareQuantity,
    isMandatory: question?.isMandatory,
    isRequiredImage: question?.isRequiredImage,
    isRequiredLocation: question?.isRequiredLocation,
    isDeclareQuantityMandatory: question?.isDeclareQuantityMandatory,
    comment: uaqComment,
    images: uaqImages,
    declareQuantity: uaqDeclareQuantity,
    formName,
    uaqId: question?.uaqId,
    isNonEditable,
    entityChangeType: pageEntityChangeType === 2 ? pageEntityChangeType : question?.entityChangeType,
    subQuestion: question?.subQuestion,
    projectTypeId: question?.projectTypeId,
    budgetCodes: question?.budgetCodes,
    defectDescription: uaqDefectDefectDescription,
    isDefect,
    comments: uaqComments,
    ...props,
  };

  const inputTextProps = {
    placeholder: I18n.t('COMMON_PLACE_HOLDER_INPUT_TEXT'),
    maxLength: maxTextLength,
  };

  const textFieldProps = {
    maxLength: maxTextLength,
    label: question.description,
    name: `${formName}.uaqAnswerContent`,
  };

  switch (itemType) {
    case formItemTypes.MULTIPLE_CHOICE:
      return (
        <Fragment>
          <MultipleChoose
            showValue
            options={question.answers}
            label={question.description}
            name={`${formName}.uaqOptions`}
            {...baseProps}
          />
        </Fragment>
      );
    case formItemTypes.DROPDOWN:
      return (
        <Fragment>
          <Dropdown
            options={question.answers}
            label={question.description}
            name={`${formName}.uaqDropdownValue`}
            placeholder="INSPECTION_PLEASE_CHOOSE_AN_OPTION"
            multiline
            valKey="value"
            {...baseProps}
          />
        </Fragment>
      );

    case formItemTypes.TEXT_BOX:
      return <TextInput {...textFieldProps} {...baseProps} />;
    case formItemTypes.TEXT_AREA:
      return <TextInput {...textFieldProps} multiline {...baseProps} />;
    case formItemTypes.Q_AND_A_TEXT_AREA:
      return <TextInput {...textFieldProps} multiline isQAndAQuestion {...baseProps} />;
    case formItemTypes.DATE_TIME: {
      const { mode, ...dateProps } = baseProps;

      return <DateTime label={question.description} name={`${formName}.uaqAnswerDate`} multiline {...dateProps} />;
    }
    case formItemTypes.METER_READING: {
      return (
        <MeterReading
          {...baseProps}
          label={question.description}
          dateProps={{ name: `${formName}.uaqAnswerDate` }}
          meterNoProps={{
            name: `${formName}.uaqAnswerContent`,
            ...inputTextProps,
          }}
          registeredProps={{
            name: `${formName}.uaqComment`,
            ...inputTextProps,
          }}
        />
      );
    }
    case formItemTypes.INVENTORY_QUANTITY: {
      return (
        <InventoryQuantity
          label={question.description}
          inputProps={{ name: `${formName}.uaqAnswerContent`, ...inputTextProps }}
          {...baseProps}
        />
      );
    }

    case formItemTypes.VISUAL_DEFECTS:
      return (
        <VisualDefect
          {...baseProps}
          label={question.description}
          inputProps={{ name: `${formName}.uaqAnswerContent`, ...inputTextProps }}
        />
      );

    case formItemTypes.MARCHING_IN_OUT: {
      const dropdownProps = {
        label: 'FORM_QUESTION_MARCHING_TITLE',
        options: marchingOptions,
        name: `${formName}.uaqAnswerMarching`,
      };

      const optionProps = {
        groupCode: question.groupCode,
        options: question.answers,
        name: `${formName}.uaqAnswerIsPhotographTaken`,
      };

      return (
        <Marching
          formName={formName}
          setFieldValue={setFieldValue}
          optionProps={optionProps}
          dropdownProps={dropdownProps}
          {...baseProps}
        />
      );
    }
    case formItemTypes.NUMBER:
      const name = `${formName}.uaqAnswerNumeric`;
      return <NumberInput label={question.description} name={name} {...baseProps} />;
    case formItemTypes.RATING:
      return (
        <Fragment>
          <Rating
            label={question.description}
            name={`${formName}.uaqAnswerNumeric`}
            prefix={question.labelFrom}
            postfix={question.labelTo}
            multiline
            {...baseProps}
          />
        </Fragment>
      );
    case formItemTypes.Option:
      return (
        <RatingInspection
          groupCode={question.groupCode}
          label={question.description}
          options={question.answers}
          name={`${formName}.uaqDropdownValue`}
          multiline
          {...baseProps}
        />
      );

    case formItemTypes.IMAGE:
      return (
        <Fragment>
          <MultipleChoose
            showValue
            options={question.answers}
            label={question.description}
            name={`${formName}.uaqOptions`}
            {...baseProps}
          />
        </Fragment>
      );
    default:
      return null;
  }
};

const compareFields = [
  'formQuestionTypeId',
  'isRequiredLocation',
  'formPageId',
  'isImage',
  'guid',
  'isMandatory',
  'formPageGuid',
  'questionIndex',
  'isRequiredImage',
  'uaqImages',
  'uaqComment',
  'uaqOptions',
  'remoteId',
  'isIncludeTime',
  'description',
  'answers',
  'groupCode',
  'uaqAnswerContent',
  'questionType',
  'id',
  'isAllowComment',
  'isMultiAnswer',
  'labelFrom',
  'labelTo',
  'isScore',
  'question',
  'hadSignature',
  'formName',
  'uaqAnswerMarching',
  'uaqAnswerTexts',
  'subQuestion',
  'isDeclareQuantity',
  'isDeclareQuantityMandatory',
  'uaqDeclareQuantity',
  'subQuestion.uaqAnswerContent',
  'subQuestion.description',
  'uaqDefectDescription',
  'isDefect',
  'uaqComments',
];
const FormItemComponentMemo = useFormMemo(FormItemComponent, compareFields);

export const FormItem = ({ formName, ...props }) => {
  const { watch } = useFormContext();
  const [
    question,
    uaqImages,
    uaqComment,
    subQuestion,
    uaqDeclareQuantity,
    subUaqAnswerContent,
    uaqDefectDescription,
    isDefect,
    uaqComments
  ] = watch([
    `${formName}`,
    `${formName}.uaqImages`,
    `${formName}.uaqComment`,
    `${formName}.subQuestion`,
    `${formName}.uaqDeclareQuantity`,
    `${formName}.subQuestion.uaqAnswerContent`,
    `${formName}.uaqDefectDescription`,
    `${formName}.isDefect`,
    `${formName}.uaqComments`
  ]);

  return (
    <FormItemComponentMemo
      {...props}
      formName={formName}
      question={question}
      uaqImages={uaqImages}
      uaqComment={uaqComment}
      subQuestion={subQuestion}
      uaqDeclareQuantity={uaqDeclareQuantity}
      subUaqAnswerContent={subUaqAnswerContent}
      uaqDefectDescription={uaqDefectDescription}
      isDefect={isDefect}
      uaqComments={uaqComments}
    />
  );
};
