import _ from 'lodash';
import { validateFields } from './changeDectorConst';
import { TableNames } from '../../Services/OfflineDB/IDGenerator';
import { formItemTypes } from '../../Config/Constants';

const debugMode = false;
function logFunctionCall(func, ...args) {
  if (debugMode && __DEV__) {
    console.log(`Calling function ${func.name} with arguments:`, ...args);
  }
}

export const emptyAction = {
  created: [],
  updated: [],
  deleted: [],
};

const stringifyValue = (value) => {
  if (Array.isArray(value) || typeof value === 'object') {
    return JSON.stringify(value);
  }
  return value;
};

const compareValues = (lastValue, currentValue) => {
  lastValue = stringifyValue(lastValue);
  currentValue = stringifyValue(currentValue);
  return lastValue !== currentValue;
};

const checkHasUpdate = (last, current, checkFields) => {
  const isDifferent = checkFields.some((field) => {
    const lastValue = last[field];
    const currentValue = current[field];
    if (Number.isNaN(lastValue) && Number.isNaN(currentValue)) {
      return false;
    }
    const isDiff = compareValues(lastValue, currentValue);
    if (isDiff) {
      logFunctionCall(compareValues, lastValue, currentValue, isDiff, field);
    }
    return isDiff;
  });
  return isDifferent;
};

export function getDefaultDeltaChanges() {
  const results = {};
  _.keys(TableNames).forEach((tableName) => {
    results[tableName] = _.cloneDeep(emptyAction);
  });
  return results;
}
let deltaResults;
/**
 * Classify the changes between oldArray and newArray based on checkFields
 */

const classifyObjectChange = (last, current, checkFields) => (tableName) => {
  logFunctionCall(classifyObjectChange, last, current, checkFields, tableName);
  const result = _.cloneDeep(emptyAction);
  if (!last && !current) {
    return result;
  }
  if (!last) {
    result.created.push(current);
  }
  if (!current) {
    result.deleted.push(last);
  }
  if (last && current) {
    if (checkHasUpdate(last, current, checkFields)) {
      result.updated.push(current);
    }
  }
  if (tableName) {
    deltaResults[tableName].created.push(...result.created);
    deltaResults[tableName].updated.push(...result.updated);
    deltaResults[tableName].deleted.push(...result.deleted);
  }
  return result;
};

const classifyArrayChanges = (oldArray = [], newArray = [], checkFields) => (tableName) => {
  logFunctionCall(classifyArrayChanges, oldArray, newArray, checkFields, tableName);
  try {
    const oldMap = new Map(oldArray.map((item) => [item.id, item]));
    const newMap = new Map(newArray.map((item) => [item.id, item]));

    const created = newArray.filter((item) => !oldMap.has(item.id));
    // const updated = newArray.filter((item) => oldMap.has(item.id) && !isEqual(oldMap.get(item.id), item));
    const deleted = oldArray.filter((item) => !newMap.has(item.id));
    // existed object
    const lastExisted = oldArray.filter((item) => newMap.has(item.id));
    const currentExisted = newArray.filter((item) => oldMap.has(item.id));
    const updated = currentExisted.filter((item) => checkHasUpdate(oldMap.get(item.id), item, checkFields));

    if (tableName) {
      deltaResults[tableName].created.push(...created);
      deltaResults[tableName].updated.push(...updated);
      deltaResults[tableName].deleted.push(...deleted);
    }
    return { created, updated, deleted, lastExisted, currentExisted };
  } catch (err) {
    functionCallError(classifyArrayChanges, err);
    throw err;
  }
};

const getMarchingObject = (formQuestion) => {
  if (_.get(formQuestion, 'uaqMarchingId')) {
    return { ...formQuestion, id: formQuestion.uaqMarchingId };
  }
  return undefined;
};

/**
 * Question, Answer, Option, Image will be added to created
 */

const handleCreatedFormPages = (formPages) => {
  logFunctionCall(handleCreatedFormPages, formPages);
  formPages.forEach((formPage) => {
    if (_.size(formPage.formQuestions)) {
      deltaResults.formQuestion.created.push(...formPage.formQuestions);
      deltaResults.formUserAnswerQuestion.created.push(...formPage.formQuestions);
      handleCreatedFormQuestions(formPage.formQuestions);
    }
  });
};

const handleDeletedFormPages = (formPages) => {
  logFunctionCall(handleDeletedFormPages, formPages);
  formPages.forEach((formPage) => {
    if (_.size(formPage.formQuestions)) {
      deltaResults.formQuestion.deleted.push(...formPage.formQuestions);
      deltaResults.formUserAnswerQuestion.deleted.push(...formPage.formQuestions);
      handleDeletedFormQuestions(formPage.formQuestions);
    }
  });
};

// handle changes not related to form page
const handleExistedFormPages = (lastFormPages, currentFormPages) => {
  logFunctionCall(handleExistedFormPages, lastFormPages, currentFormPages);
  lastFormPages.forEach((lastFormPage) => {
    const currentFormPage = _.find(currentFormPages, { id: lastFormPage.id });
    const formQuestionChanges = classifyArrayChanges(
      lastFormPage.formQuestions,
      currentFormPage.formQuestions,
      validateFields.formQuestion
    )(TableNames.formQuestion);
    classifyArrayChanges(
      lastFormPage.formQuestions,
      currentFormPage.formQuestions,
      validateFields.formUserAnswerQuestion
    )(TableNames.formUserAnswerQuestion);
    // deltaResults.formQuestion.updated = formQuestionChanges.updated;
    handleCreatedFormQuestions(formQuestionChanges.created);
    handleDeletedFormQuestions(formQuestionChanges.deleted);
    handleExistedFormQuestions(formQuestionChanges.lastExisted, formQuestionChanges.currentExisted);
  });
};

// formSubQuestion

const handleSubUserAnswerContent = (subQuestion, lastSubQuestion) => {
  if (subQuestion.subUserAnswerQuestion) {
    classifyObjectChange(
      lastSubQuestion,
      subQuestion,
      validateFields.formSubUserAnswerQuestion
    )(TableNames.formSubUserAnswerQuestion);
    return;
  }

  // Add answerContent for formSubUserAnswerQuestion
  if (_.size(subQuestion.uaqAnswerContent)) {
    deltaResults.formSubUserAnswerQuestion.created.push(subQuestion);
  }
};

const handleSubUserAnswerMultiple = (subQuestion, lastSubQuestion) => {
  if (subQuestion.subUserAnswerQuestion && !lastSubQuestion?.subUserAnswerQuestion) {
    deltaResults.formSubUserAnswerQuestion.created.push(subQuestion);
  }
  classifyArrayChanges(
    handleEmptyArr(lastSubQuestion, 'answers'),
    subQuestion.answers,
    validateFields.formSubQuestionAnswer
  )(TableNames.formSubQuestionAnswer);

  classifyArrayChanges(
    handleEmptyArr(lastSubQuestion, 'uaqOptions'),
    subQuestion.uaqOptions,
    validateFields.formSubUserAnswerQuestionOption
  )(TableNames.formSubUserAnswerQuestionOption);
};

function handleExistedFormSubQuestion(currentFormQuestion, lastFormQuestion) {
  const subQuestion = currentFormQuestion?.subQuestion;
  const lastSubQuestion = lastFormQuestion?.subQuestion;

  classifyObjectChange(lastSubQuestion, subQuestion, validateFields.formSubQuestion)(TableNames.formSubQuestion);

  if (subQuestion.formQuestionTypeId === formItemTypes.MULTIPLE_CHOICE) {
    handleSubUserAnswerMultiple(subQuestion, lastSubQuestion);
    return;
  }

  // Remove old answers when change Sub Question to Additional Answer
  if (
    lastSubQuestion?.formQuestionTypeId === formItemTypes.MULTIPLE_CHOICE &&
    subQuestion.formQuestionTypeId === formItemTypes.TEXT_AREA
  ) {
    handleDeleteFormSubAnswer(lastSubQuestion);
  }
  handleSubUserAnswerContent(subQuestion, lastSubQuestion);
}

const handleDeleteFormSubAnswer = (subQuestion) => {
  deltaResults.formSubQuestionAnswer.deleted.push(...subQuestion.answers);
  if (_.size(subQuestion.uaqOptions)) {
    deltaResults.formSubUserAnswerQuestionOption.deleted.push(...subQuestion.uaqOptions);
  }
};

const handleNotExistedFormSubQuestion = (lastFormQuestion) => {
  if (lastFormQuestion.subQuestion) {
    const subQuestion = lastFormQuestion.subQuestion;
    deltaResults.formSubQuestion.deleted.push(subQuestion);
    if (_.size(subQuestion.answers)) {
      handleDeleteFormSubAnswer(subQuestion);
    }
  }
};

// form questions
const handleCreatedFormQuestions = (formQuestions) => {
  logFunctionCall(handleCreatedFormQuestions, formQuestions);
  formQuestions.forEach((formQuestion) => {
    const questionTypeId = _.get(formQuestion, 'questionType.id');
    if (_.size(formQuestion.answers)) {
      deltaResults.formQuestionAnswer.created.push(...formQuestion.answers);
    }
    if (_.size(formQuestion.uaqImages)) {
      deltaResults.formUserAnswerQuestionImage.created.push(...formQuestion.uaqImages);
    }
    if (_.size(formQuestion.uaqOptions) && questionTypeId === formItemTypes.MULTIPLE_CHOICE) {
      deltaResults.formUserAnswerQuestionOption.created.push(...formQuestion.uaqOptions);
    }
    if (formQuestion.uaqDropdownValue && _.includes([formItemTypes.Option, formItemTypes.DROPDOWN], questionTypeId)) {
      deltaResults.formUserAnswerQuestionOption.created.push(formQuestion.uaqDropdownValue);
    }
    if (questionTypeId === formItemTypes.MARCHING_IN_OUT) {
      deltaResults.formUserAnswerQuestionMarching.created.push(getMarchingObject(formQuestion));
    }
    if (formQuestion.subQuestion) {
      const { subQuestion } = formQuestion;
      deltaResults.formSubQuestion.created.push(subQuestion);
      if (subQuestion.formQuestionTypeId === formItemTypes.MULTIPLE_CHOICE) {
        deltaResults.formSubQuestionAnswer.created.push(...subQuestion.answers);
      }
    }
  });
};

const handleDeletedFormQuestions = (formQuestions) => {
  logFunctionCall(handleDeletedFormQuestions, formQuestions);
  // append form questions to deleted
  formQuestions.forEach((formQuestion) => {
    const questionTypeId = _.get(formQuestion, 'questionType.id');
    if (_.size(formQuestion.answers)) {
      deltaResults.formQuestionAnswer.deleted.push(...formQuestion.answers);
    }
    if (_.size(formQuestion.uaqImages)) {
      deltaResults.formUserAnswerQuestionImage.deleted.push(...formQuestion.uaqImages);
    }
    if (_.size(formQuestion.uaqOptions) && questionTypeId === formItemTypes.MULTIPLE_CHOICE) {
      deltaResults.formUserAnswerQuestionOption.deleted.push(...formQuestion.uaqOptions);
    }
    if (formQuestion.uaqDropdownValue && _.includes([formItemTypes.Option, formItemTypes.DROPDOWN], questionTypeId)) {
      deltaResults.formUserAnswerQuestionOption.deleted.push(formQuestion.uaqDropdownValue);
    }
    if (questionTypeId === formItemTypes.MARCHING_IN_OUT) {
      deltaResults.formUserAnswerQuestionMarching.deleted.push(getMarchingObject(formQuestion));
    }
    if (formQuestion.subQuestion) {
      handleNotExistedFormSubQuestion(formQuestion);
    }
  });
};

const handleExistedFormQuestions = (lastFormQuestions, currentFormQuestions) => {
  logFunctionCall(handleExistedFormQuestions, lastFormQuestions, currentFormQuestions);
  lastFormQuestions.forEach((lastFormQuestion) => {
    const currentFormQuestion = _.find(currentFormQuestions, { id: lastFormQuestion.id });
    const questionTypeId = _.get(currentFormQuestion, 'questionType.id');
    classifyArrayChanges(
      lastFormQuestion.answers,
      currentFormQuestion.answers,
      validateFields.formQuestionAnswer
    )(TableNames.formQuestionAnswer);

    classifyArrayChanges(
      lastFormQuestion.uaqImages,
      currentFormQuestion.uaqImages,
      validateFields.formUserAnswerQuestionImage
    )(TableNames.formUserAnswerQuestionImage);

    if (_.includes([formItemTypes.MULTIPLE_CHOICE], questionTypeId)) {
      classifyArrayChanges(
        lastFormQuestion.uaqOptions,
        currentFormQuestion.uaqOptions,
        validateFields.formUserAnswerQuestionOption
      )(TableNames.formUserAnswerQuestionOption);
    }

    if (_.includes([formItemTypes.Option, formItemTypes.DROPDOWN], questionTypeId)) {
      classifyObjectChange(
        lastFormQuestion.uaqDropdownValue,
        currentFormQuestion.uaqDropdownValue,
        validateFields.formUserAnswerQuestionOption
      )(TableNames.formUserAnswerQuestionOption);
    }

    if (questionTypeId === formItemTypes.MARCHING_IN_OUT) {
      classifyObjectChange(
        getMarchingObject(lastFormQuestion),
        getMarchingObject(currentFormQuestion),
        validateFields.formUserAnswerQuestionMarching
      )(TableNames.formUserAnswerQuestionMarching);
    }

    if (currentFormQuestion.subQuestion) {
      handleExistedFormSubQuestion(currentFormQuestion, lastFormQuestion);
    }
    if (!currentFormQuestion.subQuestion) {
      handleNotExistedFormSubQuestion(lastFormQuestion);
    }
  });
};

export function getDeltaChanges(last, current) {
  deltaResults = getDefaultDeltaChanges();
  logFunctionCall(getDeltaChanges, last, current);
  // formPages
  const formPageChanges = classifyArrayChanges(
    last.formPages,
    current.formPages,
    validateFields.formPage
  )(TableNames.formPage);

  classifyArrayChanges(
    last.formPageGroups,
    current.formPageGroups,
    validateFields.formPageGroups
  )(TableNames.formPageGroup);

  handleCreatedFormPages(formPageChanges.created);
  handleDeletedFormPages(formPageChanges.deleted);
  handleExistedFormPages(formPageChanges.lastExisted, formPageChanges.currentExisted);

  return deltaResults;
}

export function getDeltaChangesOnly(last, current) {
  const result = getDeltaChanges(last, current);
  // Remove key if empty created, deleted, updated
  _.keys(deltaResults).forEach((key) => {
    const value = deltaResults[key];
    if (_.isEmpty(value.created) && _.isEmpty(value.updated) && _.isEmpty(value.deleted)) {
      delete deltaResults[key];
    }
  });
  return result;
}

const handleEmptyArr = (data, name) => (data ? data[name] : []);
