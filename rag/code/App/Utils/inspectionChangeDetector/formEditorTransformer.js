import _ from 'lodash';
import { TableNames } from '../../Services/OfflineDB/IDGenerator';
import { transformDateToFormSubmit } from '../convertDate';

const getAnswerContent = (value) => (value?.rawValue ? value.rawValue : value);

function validateMandatoryField(item, fields, tableName) {
  const errors = [];
  fields.forEach((field) => {
    if (!item[field]) {
      errors.push(field);
    }
  });
  if (errors.length === 0) {
    return;
  }

  throw new Error(`[${tableName}] Mandatory fields are missing: ${errors.join(', ')}`);
}

function toTableForm(item) {
  validateMandatoryField(item, ['id'], TableNames.form);
  return {
    id: item.id,
    guid: item.guid,
    formName: item.formName,
    formGroupId: item.formGroupId,
    formCategoryId: item.formCategoryId,
    moduleId: item.moduleId,
    statusId: item.statusId,
    tenantId: item.tenantId,
    header: item.header,
    footer: item.footer,
    isActive: item.isActive,
    publicTime: item.publicTime,

    category: item.category,
    creatorUserId: item.creatorUserId,
  };
}

function toTableFormPageGroup(item) {
  validateMandatoryField(item, ['formGuid', 'id'], TableNames.formPageGroup);
  return {
    id: item.id,
    guid: item.guid,
    formGuid: item.formGuid,
    name: item.name,
    formId: item.formId,
  };
}

function toTableFormPage(item) {
  validateMandatoryField(item, ['formGuid', 'id'], TableNames.formPage);
  return {
    id: item.id,
    guid: item.guid,
    formGuid: item.formGuid,
    name: item.name,
    isActive: item.isActive,
    pageIndex: item.pageIndex,
    formQuestionTypeCategoryId: item.formQuestionTypeCategoryId,
    formPageGroupId: item.formPageGroupId,
    formPageGroupGuid: item.formPageGroupGuid,
    formPageGroupName: item.formPageGroupName,
  };
}

function toTableFormQuestion(item) {
  validateMandatoryField(item, ['formPageGuid', 'id', 'questionType'], TableNames.formQuestion);
  return {
    id: item.id,
    guid: item.guid,
    formPageGuid: item.formPageGuid,
    formPageId: item.formPageId,
    description: item.description,
    formQuestionTypeId: `${item.questionType.id}`,
    isMandatory: item.isMandatory,
    isActive: item.isActive,
    isAllowComment: item.isAllowComment,
    isMultiAnswer: item.isMultiAnswer,
    isIncludeTime: item.isIncludeTime,
    isImage: item.isImage,
    isDeclareQuantity: item.isDeclareQuantity,
    isRequiredImage: item.isRequiredImage,
    isDeclareQuantityMandatory: item.isDeclareQuantityMandatory,
    isScore: item.isScore,
    labelFrom: item.labelFrom,
    labelTo: item.labelTo,
    questionIndex: item.questionIndex,
    groupCode: item.groupCode,
    budgetCode: item.budgetCode,
    projectTypeId: item.projectTypeId,
  };
}

function toTableFormSubQuestion(item) {
  validateMandatoryField(item, ['formQuestionGuid', 'id'], TableNames.formSubQuestion);
  return {
    id: item.id,
    guid: item.guid,
    formQuestionGuid: item.formQuestionGuid,
    formQuestionId: item.formQuestionId,
    description: item.description,
    isMultiAnswer: item.isMultiAnswer,
    formQuestionTypeId: item.formQuestionTypeId,
    isDescriptionDefined: item.isDescriptionDefined,
  };
}

function toTableFormSubQuestionAnswer(item) {
  validateMandatoryField(item, ['formSubQuestionGuid', 'description', 'id'], TableNames.formSubQuestionAnswer);
  return {
    id: item.id,
    guid: item.guid,
    formSubQuestionGuid: item.formSubQuestionGuid,
    formSubQuestionId: item.formSubQuestionId,
    description: item.description,
  };
}

function toTableFormQuestionAnswer(item) {
  validateMandatoryField(item, ['id', 'formQuestionGuid'], TableNames.formQuestionAnswer);
  return {
    id: item.id,
    guid: item.guid,
    formQuestionGuid: item.formQuestionGuid,
    // formQuestionId: item.formQuestionId,
    description: item.label || item.description,
    // groupCode: item.groupCode,
    formQuestionAnswerTemplateId: `${item.formQuestionAnswerTemplateId}`,
  };
}

function toTableFormUserAnswer(item) {
  validateMandatoryField(item, ['id', 'userAnswerId'], TableNames.formUserAnswer);

  return {
    id: item.id,
    guid: item.guid,
    parentId: item.parentId,
    parentGuid: item.parentGuid,
    moduleId: item.moduleId,
    userAnswerId: item.userAnswerId,
    unitId: item.unitId,
    statusId: item.statusId,
    fullUnitCode: item.fullUnitCode,
  };
}

function toTableFormUserAnswerQuestion(formQuestion) {
  validateMandatoryField(formQuestion, ['uaqId', 'id', 'formUserAnswerGuid'], TableNames.formUserAnswerQuestion);
  const uaqAnswerNumeric = formQuestion.uaqAnswerNumeric;

  let uaqAnswerNumericResult = uaqAnswerNumeric;
  if (typeof uaqAnswerNumeric === 'string' && _.size(uaqAnswerNumeric)) {
    uaqAnswerNumericResult = parseFloat(uaqAnswerNumeric?.replace(',', '.'));
  }

  return {
    id: formQuestion.uaqId,
    guid: formQuestion.uaqId,
    formUserAnswerGuid: formQuestion.formUserAnswerGuid,
    questionGuid: formQuestion.id,
    answerContent: getAnswerContent(formQuestion.uaqAnswerContent),
    answerDate: transformDateToFormSubmit(formQuestion.uaqAnswerDate),
    answerNumeric: uaqAnswerNumericResult,
    comment: formQuestion.uaqComment,
    defectDescription: formQuestion.uaqDefectDescription,
    isDefect: formQuestion.isDefect,
    declareQuantity: formQuestion.uaqDeclareQuantity,
  };
}

function toTableFormSubUserAnswerQuestion(formSubQuestion) {
  validateMandatoryField(formSubQuestion, ['id', 'formUserAnswerGuid'], TableNames.formSubUserAnswerQuestion);

  return {
    id: formSubQuestion.subUserAnswerQuestion?.id,
    guid: formSubQuestion.subUserAnswerQuestion?.id,
    formUserAnswerGuid: formSubQuestion.formUserAnswerGuid,
    questionGuid: formSubQuestion.id,
    questionId: formSubQuestion.id,
    answerContent: getAnswerContent(formSubQuestion.uaqAnswerContent),
    comment: formSubQuestion.uaqComment,
  };
}

function toTableFormUserAnswerQuestionOption(item) {
  validateMandatoryField(item, ['id', 'uaqId'], TableNames.formUserAnswerQuestionOption);

  return {
    id: item.id,
    formUserAnswerQuestionGuid: item.uaqId,
    formQuestionAnswerGuid: item.value,
    formQuestionAnswerTemplateId: item.formQuestionAnswerTemplateId,
  };
}

function toTableFormSubUserAnswerQuestionOption(item) {
  validateMandatoryField(item, ['id', 'uaqId'], TableNames.formSubUserAnswerQuestionOption);

  return {
    id: item.id,
    formUserAnswerQuestionGuid: item.uaqId,
    formQuestionAnswerGuid: item.value,
  };
}

function toTableFormUserAnswerQuestionImage(item) {
  validateMandatoryField(item, ['id', 'uaqId'], TableNames.formUserAnswerQuestionImage);
  return {
    id: item.id,
    guid: item.guid,
    formUserAnswerQuestionGuid: item.uaqId,
    imageGuid: item.imageGuid,
    path: item.path,
    files: item.files,
    workflowGuid: item.workflowGuid,
    description: item.description,
    longitude: item.longitude,
    latitude: item.latitude,
  };
}

function toTableFormUserAnswerQuestionMarching(item) {
  validateMandatoryField(item, ['uaqMarchingId', 'uaqId'], TableNames.formUserAnswerQuestionMarching);

  return {
    id: item.uaqMarchingId,
    formUserAnswerQuestionGuid: item.uaqId,
    marching: item.uaqAnswerMarching,
    isPhotographTaken: item.uaqAnswerIsPhotographTaken,
    texts: item.uaqAnswerTexts,
  };
}

function toTableInspection(item) {
  return {
    id: item.id,
    guid: item.guid,
    sourceId: item.sourceId,
    property: item.property,
    signature: item.signature,
    team: item.team,
    isRequiredLocation: item.isRequiredLocation,
    isRequiredSignature: item.isRequiredSignature,
    longitude: item.longitude,
    latitude: item.latitude,
    lastModificationTime: item.lastModificationTime,
    teamAssignee: item.teamAssignee,
  };
}

function toTableWorkflow(item) {
  return {
    id: item.id,
    guid: item.guid,
    statusId: item.statusId,
    trackerId: item.trackerId,
    roleId: item.roleId,
    assignedId: item.assignedId,
    priorityId: item.priorityId,
    parentId: item.parentId,
    parentGuid: item.parentGuid,
    formGuid: item.formGuid,
    formId: item.formId,
    subject: item.subject,
    description: item.description,
    dueDate: item.dueDate,
    startDate: item.startDate,
    closedDate: item.closedDate,
    inspection: item.inspection,
    rescheduleRemark: item.rescheduleRemark,
    rescheduleDate: item.rescheduleDate,
  };
}

const transformTableMap = {
  [TableNames.form]: toTableForm,
  [TableNames.formPage]: toTableFormPage,
  [TableNames.formQuestion]: toTableFormQuestion,
  [TableNames.formQuestionAnswer]: toTableFormQuestionAnswer,
  [TableNames.formUserAnswer]: toTableFormUserAnswer,
  [TableNames.formUserAnswerQuestion]: toTableFormUserAnswerQuestion,
  [TableNames.formUserAnswerQuestionOption]: toTableFormUserAnswerQuestionOption,
  [TableNames.formUserAnswerQuestionImage]: toTableFormUserAnswerQuestionImage,
  [TableNames.formUserAnswerQuestionMarching]: toTableFormUserAnswerQuestionMarching,
  [TableNames.workflow]: toTableWorkflow,
  [TableNames.inspection]: toTableInspection,
  [TableNames.formPageGroup]: toTableFormPageGroup,
  [TableNames.formSubQuestion]: toTableFormSubQuestion,
  [TableNames.formSubQuestionAnswer]: toTableFormSubQuestionAnswer,
  [TableNames.formSubUserAnswerQuestion]: toTableFormSubUserAnswerQuestion,
  [TableNames.formSubUserAnswerQuestionOption]: toTableFormSubUserAnswerQuestionOption,
};

const transformDeltaChangesToTables = (deltaChanges) => {
  const results = _.cloneDeep(deltaChanges);
  _.keys(deltaChanges).forEach((tableName) => {
    const tableChanges = deltaChanges[tableName];
    const transformFunc = transformTableMap[tableName];
    if (transformFunc) {
      results[tableName].created = tableChanges.created.map((item) => transformFunc(item));
      results[tableName].updated = tableChanges.updated.map((item) => transformFunc(item));
      results[tableName].deleted = tableChanges.deleted.map((item) => transformFunc(item));
    }
  });
  return results;
};

export {
  toTableForm,
  toTableFormPage,
  toTableFormQuestion,
  toTableFormQuestionAnswer,
  toTableFormUserAnswer,
  toTableFormUserAnswerQuestion,
  toTableFormUserAnswerQuestionOption,
  toTableFormUserAnswerQuestionImage,
  toTableFormUserAnswerQuestionMarching,
  toTableInspection,
  toTableWorkflow,
  toTableFormPageGroup,
  toTableFormSubQuestion,
  toTableFormSubQuestionAnswer,
  toTableFormSubUserAnswerQuestionOption,
  toTableFormSubUserAnswerQuestion,
  transformDeltaChangesToTables,
};
