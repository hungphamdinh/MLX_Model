import React, { Fragment, useEffect } from 'react';
import styled from 'styled-components/native';
import { Alert, Modal } from 'react-native';
import AwareScrollView from '@Components/Layout/AwareScrollView';
import * as Yup from 'yup';
import _ from 'lodash';
import { Button, IconButton } from '@Elements';
import { FormCheckBox, FormDropdown, FormInput } from '@Forms';
import BaseLayout from '@Components/Layout/BaseLayout';
import { formItemTypes, Modules, MAX_TEXT_LENGTH } from '@Config/Constants';
import { getEmptyUserAnswerQuestion } from '@Transforms/InspectionTransformer';
import { useCompatibleForm, useYupValidationResolver } from '@Utils/hook';
import { isGrantedAny } from '@Config/PermissionConfig';
import useInspection from '@Context/Inspection/Hooks/UseInspection';
import { generateInspectionUUID, TableNames } from '@Services/OfflineDB/IDGenerator';
import I18n from '@I18n';
import { Colors } from '@Themes';
import { isHKQuestionType } from '@Utils/inspectionUtils';
import { FormProvider } from 'react-hook-form';
import styles from './styles';
import RatingOptionView from './RatingOptionView';
import CheckBoxAdvance from './CheckBoxAdvance';
import ItemBudgetCode from './ItemBudgetCode';
import Row from '../../../../Grid/Row';
import DropdownQuestion from './DropdownQuestion';
import { Hud } from '../../../../../Elements';
import useApp from '../../../../../Context/App/Hooks/UseApp';
import DynamicComments from './DynamicComments';

const maxTextLength = MAX_TEXT_LENGTH;

const CheckBoxWrapper = styled.View`
  padding-horizontal: 20px;
`;

const RowWrapper = styled(Row)`
  flex-wrap: wrap;
`;

export function getEmptyOption(tableName = TableNames.formQuestionAnswer) {
  const id = generateInspectionUUID(tableName);
  return {
    id,
    value: id,
    description: '',
    guid: id,
  };
}

const getItemTypes = () => [
  {
    id: 1,
    name: I18n.t('FORM_MULTIPLE _CHOICE'),
    icon: 'radiobox-marked',
  },
  {
    id: 2,
    name: I18n.t('FORM_DROPDOWN'),
    icon: 'form-dropdown',
  },
  {
    id: 3,
    name: I18n.t('FORM_TEXTBOX'),
    icon: 'form-textbox',
  },
  {
    id: 4,
    name: I18n.t('FORM_TEXTAREA'),
    icon: 'form-textarea',
  },
  {
    id: 5,
    name: I18n.t('FORM_DATE_TIME'),
    icon: 'calendar-range',
  },
  {
    id: 6,
    name: I18n.t('FORM_NUMBER'),
    icon: 'counter',
  },
  {
    id: 7,
    name: I18n.t('FORM_RATING'),
    icon: 'star',
  },
  {
    id: 8,
    name: I18n.t('FORM_OPTION'),
    icon: 'cog',
  },
];

export const FormOption = ({ index, onRemove, suffixComponent, ...restProps }) => (
  <FormInput
    {...restProps}
    maxLength={maxTextLength}
    containerStyle={styles.optionInput}
    suffixComponent={
      <Row>
        {index > 1 && (
          <IconButton
            name="close-circle-outline"
            color="red"
            size={20}
            onPress={onRemove}
            style={styles.btRemoveOption}
          />
        )}
        {suffixComponent}
      </Row>
    }
  />
);

const AddOrEditItemModal = ({ selectedItem, visible, onClosePress, onComplete, moduleId, formUserAnswerGuid }) => {
  // eslint-disable-next-line prefer-destructuring
  const {
    inspection: { questionTypes, projectTypes },
  } = useInspection();

  const {
    app: { isLoading },
  } = useApp();

  const dropdownTypes = [formItemTypes.DROPDOWN, formItemTypes.MULTIPLE_CHOICE, formItemTypes.IMAGE];

  const handleDescriptionForAdditionalAnswer = (subQuestion) => {
    if (subQuestion.description) {
      subQuestion.isDescriptionDefined = true;
      return;
    }
    subQuestion.isDescriptionDefined = false;
    subQuestion.description = 'AdditionalAnswer';
  };

  const transformSubQuestion = (item) => {
    if (!item.isAdvance) {
      return null;
    }

    const { subQuestion } = item;

    subQuestion.formUserAnswerGuid = formUserAnswerGuid;
    subQuestion.formQuestionGuid = item.guid || item.id;
    subQuestion.formQuestionId = item.remoteId || item.id;

    if (!subQuestion.id) {
      const guid = generateInspectionUUID(TableNames.formSubQuestion);
      subQuestion.id = guid;
    }

    _.forEach(subQuestion.answers, (answer) => {
      answer.formSubQuestionGuid = subQuestion.id;
      answer.formSubQuestionId = subQuestion.remoteId;
    });
    return subQuestion;
  }; 

  const onSubmit = (item) => {
    if (item.subQuestion) {
      const { subQuestion } = item;
      if (formItemTypes.TEXT_AREA === subQuestion.formQuestionTypeId) {
        handleDescriptionForAdditionalAnswer(subQuestion);
      }
      if (formItemTypes.MULTIPLE_CHOICE === subQuestion.formQuestionTypeId) {
        const hasBlankAnswer = hasBlankAnswers(subQuestion);
        if (hasBlankAnswer) {
          showBlankAnswerError('INSPECTION_BLANK_OPTION_ERROR');
          return;
        }
      }
    }

    if(showDynamicComments) {
      const hasBlankComments = showDynamicComments && _.some(item.comments, (comment) => 
        _.isEmpty(_.trim(comment.titleComment))
      );

      if (hasBlankComments) {
        showBlankAnswerError('INSPECTION_BLANK_COMMENT_ERROR');
        return;
      }
    }

    onComplete({
      ...item,
      budgetCode: budgetCodes.join(','),
      subQuestion: transformSubQuestion(item),
    });
  };

  const hasBlankAnswers = ({ answers, description }) =>
    (_.size(answers) && answers.some((answer) => !answer.description)) || !description;
  
  const showBlankAnswerError = (message) => {
    Alert.alert(
      I18n.t('REQUEST_ERROR_TITLE'),
      I18n.t(message),
      [{ text: 'OK', onPress: () => {} }],
      {
        cancelable: false,
      }
    );
  };

  const itemTypes = questionTypes.length !== 0 ? questionTypes : getItemTypes();
  const isInspection = (condition) => Modules.SURVEY !== moduleId && condition;

  const requiredMessage = I18n.t('FORM_THIS_FIELD_IS_REQUIRED');
  const YupRequiredString = Yup.string().required(requiredMessage);
  const validationSchema = Yup.object().shape({
    description: YupRequiredString,
    answers: Yup.array().of(
      Yup.object().shape({
        label: YupRequiredString,
      })
    ),
  });


  const defaultValueForSpecialType = {
    isImage: false,
    isAllowComment: false,
    isScore: false,
    isMandatory: false,
    isRequiredLocation: false,
    isRequiredImage: false,
    isDeclareQuantity: false,
    isDeclareQuantityMandatory: false,
    isAdvance: false,
  };

  const getSurveyData = () => {
    if(showDynamicComments) {
      return {
        comments: []
      }
    }
    return {};
  }

  const formMethods = useCompatibleForm({
    resolver: useYupValidationResolver(validationSchema),
    defaultValues: {
      isMandatory: true,
      isActive: true,
      isAllowComment: false,
      isMultiAnswer: false,
      isIncludeTime: false,
      isImage: false,
      isDeclareQuantity: false,
      isRequiredImage: false,
      isRequiredLocation: false,
      isDeclareQuantityMandatory: false,
      labelFrom: '',
      labelTo: '',
      isScore: false,
      isAdvance: false,
      questionType: _.first(itemTypes),
      subQuestion: null,
      answers: [getEmptyOption(), getEmptyOption()],
      description: '',
      budgetCode: '',
      budgetCodes: [],
      projectTypeId: null,
      ...getEmptyUserAnswerQuestion(),
      ...getSurveyData()
    },
  });


  const updateInitialValues = () => {
    // Reset budget code
    setFieldValue('budgetCode', '');
    const subQuestion = watch('subQuestion');

    if (!subQuestion) {
      setFieldValue('isAdvance', false);
      return;
    }
    setFieldValue('isAdvance', true);

    if (subQuestion.formQuestionTypeId === formItemTypes.TEXT_AREA) {
      setFieldValue('isAdditional', true);
      if (!subQuestion.isDescriptionDefined) {
        setFieldValue('subQuestion.description', '');
      }
      return;
    }

    setFieldValue('isSubQuestion', true);
  };

  const { setFieldValue, values, watch } = formMethods;
  const [budgetCode, budgetCodes] = watch(['budgetCode', 'budgetCodes']);

  useEffect(() => {
    if (selectedItem) {
      formMethods.reset(selectedItem);
    }
  }, [selectedItem]);

  useEffect(() => {
    if (visible) {
      updateInitialValues();
    }
  }, [visible]);

  const questionType = watch('questionType');
  const groupCode = watch('groupCode');
  const isImage = watch('isImage');
  const isDeclareQuantity = watch('isDeclareQuantity');
  const type = _.parseInt(questionType?.id);

  const isNumberQuestion = questionType?.id === formItemTypes.NUMBER;
  const showDeclareQuantity = isGrantedAny('Inspection.ExportPdfVietnam') && type === formItemTypes.Option;
  const isQAndAQuestion = formItemTypes.Q_AND_A_TEXT_AREA === type;
  const showDynamicComments = moduleId === Modules.SURVEY && watch('isAllowComment') && isNumberQuestion && watch('isScore');

  const checkHKType = (data) =>
    [
      formItemTypes.METER_READING,
      formItemTypes.INVENTORY_QUANTITY,
      formItemTypes.VISUAL_DEFECTS,
      formItemTypes.MARCHING_IN_OUT,
    ].includes(data);

  const isHKType = isHKQuestionType(type);
  const showAdvance = isGrantedAny('Inspection.ExportPdfMasterQAVietnam') && !isHKType && !isQAndAQuestion;

  const mainLayoutProps = {
    title: selectedItem ? I18n.t('FORM_EDIT_ITEM') : I18n.t('FORM_ADD_ITEM'),
    onLeftPress: onClosePress,
    padding: true,
  };

  const addDefaultOptions = (answers, name) => {
    if (_.size(answers) < 2) {
      setFieldValue(name, [getEmptyOption(), getEmptyOption()]);
    }
  };

  const onQuestionTypeChange = (question, answers) => {
    if (checkHKType(question.id)) {
      Object.keys(defaultValueForSpecialType).forEach((key) => {
        setFieldValue(key, defaultValueForSpecialType[key]);
      });
      if (question.id === formItemTypes.MARCHING_IN_OUT) {
        onComplete(formMethods.getValues());
        return;
      }
    }

    if (_.includes(dropdownTypes, question.id)) {
      addDefaultOptions(answers, 'answers');
      return;
    }
    if (question.id === formItemTypes.Q_AND_A_TEXT_AREA) {
      setFieldValue('isAllowComment', true);
      setFieldValue('isAdvance', false);
    }
    setFieldValue('answers', []);
  };

  const onSubmitBudgetCode = () => {
    if (!budgetCode) {
      Alert.alert(I18n.t('INSPECTION_BUDGET_CODE_BLANK'));
      return;
    }
    const combinedBudgetCode = budgetCodes.concat(budgetCode);
    const budgetCodeList = Array.from(new Set(combinedBudgetCode));
    setFieldValue('budgetCodes', budgetCodeList);
    setFieldValue('budgetCode', '');
  };

  const onPressRemove = (index) => {
    setFieldValue(
      'budgetCodes',
      budgetCodes.filter((_item, idx) => index !== idx)
    );
  };

  const getComponentByType = () => {
    // const { groupCode } = values;
    if (!questionType) return null;
    const question = itemTypes.find((item) => item.id === type);
    let titleName = '';
    if (question) {
      switch (question.id) {
        case formItemTypes.METER_READING: {
          titleName = I18n.t('FORM_LABEL_METER_TYPE');
          break;
        }
        case formItemTypes.INVENTORY_QUANTITY: {
          titleName = I18n.t('FORM_INVENTORY_NAME');
          break;
        }
        case formItemTypes.VISUAL_DEFECTS: {
          titleName = I18n.t('FORM_VISUAL_DEFECTS_NAME');
          break;
        }
        default: {
          titleName = `${I18n.t('FORM_QUESTION_OF')} ${question.name}`;
          break;
        }
      }
    }

    return (
      <Fragment>
        <FormInput maxLength={maxTextLength} label={titleName} name="description" multiline autoHeight required />

        {_.includes(dropdownTypes, type) && (
          <DropdownQuestion questionType={type} formMethods={formMethods} name="answers" />
        )}
        {type === formItemTypes.RATING && (
          <Fragment>
            <FormInput maxLength={maxTextLength} label={I18n.t('FORM_LABEL_FOR_LOWEST_RATING')} name="labelFrom" />
            <FormInput maxLength={maxTextLength} label={I18n.t('FORM_LABEL_FOR_HIGHEST_RATING')} name="labelTo" />
          </Fragment>
        )}
        {(type === formItemTypes.MULTIPLE_CHOICE || type === formItemTypes.IMAGE) && (
          <FormCheckBox label={I18n.t('FORM_ALLOW_SELECT_MULTIPLE_ANSWERS')} name="isMultiAnswer" />
        )}
        {type === formItemTypes.Option && <RatingOptionView setFieldValue={setFieldValue} groupCode={groupCode} />}
      </Fragment>
    );
  };


  return (
    <Modal visible={visible}>
      <BaseLayout {...mainLayoutProps}>
        <FormProvider {...formMethods}>
          <AwareScrollView>
            {isInspection(showAdvance) && (
              <Fragment>
                <FormInput
                  onSubmitEditing={onSubmitBudgetCode}
                  maxLength={maxTextLength}
                  label="FORM_PROJECT_CODE"
                  name="budgetCode"
                  autoHeight
                  rightIcon={
                    <IconButton onPress={onSubmitBudgetCode} name="add-circle" color={Colors.azure} size={20} />
                  }
                />
                <RowWrapper>
                  {budgetCodes.map((item, index) => (
                    <ItemBudgetCode key={item} onPressRemove={() => onPressRemove(index)} item={item} />
                  ))}
                </RowWrapper>

                <FormDropdown label="FORM_PROJECT_TYPE" name="projectTypeId" options={projectTypes} />
              </Fragment>
            )}
            <FormDropdown
              label="FORM_QUESTION_TYPE"
              name="questionType"
              options={itemTypes}
              showValue={false}
              onChange={(question) => onQuestionTypeChange(question, values.answers)}
            />
            {!isHKType && <FormCheckBox label="FORM_QUESTION_MANDATORY" name="isMandatory" />}
            {getComponentByType()}
            {!isHKType && (
              <>
                <FormCheckBox
                  onChange={(val) => setFieldValue('isRequiredImage', isInspection(val))}
                  label="FORM_ALLOW_IMAGE_TO_BE_ATTACHED"
                  name="isImage"
                />
                {isInspection(isImage) && (
                  <CheckBoxWrapper>
                    <FormCheckBox label="FORM_IMAGE_MANDATORY" name="isRequiredImage" />
                    <FormCheckBox label="FORM_ALLOW_LOCATIONS" name="isRequiredLocation" />
                  </CheckBoxWrapper>
                )}

                {isInspection(showDeclareQuantity) && (
                  <FormCheckBox label="FORM_ALLOW_QUANTITY" name="isDeclareQuantity" />
                )}
                {isInspection(isDeclareQuantity) && (
                  <CheckBoxWrapper>
                    <FormCheckBox label="FORM_QUANTITY_MANDATORY" name="isDeclareQuantityMandatory" />
                  </CheckBoxWrapper>
                )}
                {isInspection(showAdvance) && (
                  <CheckBoxAdvance maxTextLength={maxTextLength} moduleId={moduleId} questionTypes={questionTypes} />
                )}
                {isNumberQuestion && <FormCheckBox label="FORM_ALLOW_SCORE" name="isScore" />}
                {!isQAndAQuestion && <FormCheckBox label="FORM_ALLOW_COMMENTS" name="isAllowComment" />}
                {showDynamicComments && <DynamicComments />}
              </>
            )}

            <Button
              rounded
              primary
              onPress={formMethods.handleSubmit(onSubmit)}
              title={I18n.t('AD_COMMON_SAVE')}
              containerStyle={styles.bottomButton}
            />
          </AwareScrollView>
        </FormProvider>
      </BaseLayout>
      <Hud loading={isLoading} />
    </Modal>
  );
};

export default AddOrEditItemModal;
