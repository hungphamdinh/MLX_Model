/**
 * Created by thienmd on 10/27/20
 */
import _ from 'lodash';
import moment from 'moment';
// import { getDateBySystemFormat, transformDateToFormSubmit } from '../utils/date';
import { ActionType, formItemTypes, FormStatusCode, Modules } from '../Config/Constants';
import { transformDateToFormSubmit } from '../Utils/convertDate';
import LocaleConfig from '../Config/LocaleConfig';
import { generateInspectionUUID, TableNames } from '../Services/OfflineDB/IDGenerator';
import FormSubUserAnswerQuestionMgr from '../Services/OfflineDB/Mgr/FormSubUserAnswerQuestionMgr';
import FormSubUserAnswerQuestionOptionMgr from '../Services/OfflineDB/Mgr/FormSubUserAnswerQuestionOptionMgr';

const defaultAnswerTexts = ['', '', '', '', ''];

export const getEmptyUserAnswerQuestion = () => ({
  uaqId: generateInspectionUUID(TableNames.formUserAnswerQuestion),
  uaqAnswerContent: '',
  uaqAnswerDate: undefined,
  uaqAnswerNumeric: undefined,
  uaqComment: '',
  uaqImages: [],
  uaqOptions: [],
  uaqDropdownValue: null,
  uaqAnswerTexts: defaultAnswerTexts,
  uaqAnswerMarching: null,
  uaqAnswerIsPhotographTaken: undefined,
  uaqDeclareQuantity: undefined,
  uaqDefectDescription: '',
  isDefect: '',
  uaqComments: [],
});

export const getEmptySubUserAnswerQuestion = () => ({
  uaqId: generateInspectionUUID(TableNames.formSubUserAnswerQuestion),
  uaqAnswerContent: '',
  uaqAnswerDate: undefined,
  uaqAnswerNumeric: undefined,
  uaqComment: '',
  uaqOptions: [],
  uaqDropdownValue: null,
});

const cloneSubQuestionAnswers = (answers, subQuestionId) => {
  if (_.size(answers) === 0) {
    return [];
  }

  return answers.map((answer) => {
    const guid = generateInspectionUUID(TableNames.formSubQuestionAnswer);
    return {
      ...answer,
      id: guid,
      value: guid,
      guid,
      formSubQuestionGuid: subQuestionId,
    };
  });
};

const cloneSubQuestion = (question, questionId) => {
  const { subQuestion } = question;
  if (!subQuestion) {
    return null;
  }

  const subQuestionId = generateInspectionUUID(TableNames.formSubQuestion);

  return {
    ...subQuestion,
    id: subQuestionId,
    formQuestionGuid: questionId,
    formQuestionId: question.remoteId,
    uaqAnswerContent: '',
    uaqComment: '',
    uaqOptions: [],
    uaqDropdownValue: null,
    subUserAnswerQuestion: null,
    answers: cloneSubQuestionAnswers(subQuestion.answers, subQuestionId),
  };
};

export const cloneFormQuestion = ({ answers, ...item }, isCopy) => {
  const questionId = generateInspectionUUID(TableNames.formQuestion);
  let uaqMarchingId;
  if (item.questionType.id === formItemTypes.MARCHING_IN_OUT) {
    uaqMarchingId = generateInspectionUUID(TableNames.formUserAnswerQuestionMarching);
  }

  return {
    ...item,
    id: questionId,
    answers: _.map(answers, ({ ...answer }) => {
      const answerId = generateInspectionUUID(TableNames.formQuestionAnswer);

      return {
        ...answer,
        formQuestionGuid: questionId,
        isAddNew: true,
        id: answerId,
        value: answerId,
      };
    }),
    ...getEmptyUserAnswerQuestion(),
    uaqMarchingId,
    subQuestion: cloneSubQuestion(item, questionId),
    isCopy,
  };
};

const transformOption = (opt) => {
  if (opt) {
    return {
      id: opt.id,
      value: opt.formQuestionAnswerGuid, // id: formQuestionAnswer - formSubQuestionAnswer
      uaqId: opt.formUserAnswerQuestionGuid, // id: formUserAnswerQuestion - formSubUserAnswerQuestion
    };
  }
  return null;
};

const transformUaqOptions = (options, questionTypeId) => {
  if (questionTypeId === formItemTypes.MULTIPLE_CHOICE) {
    return options.map((option) => transformOption(option));
  }
  return [];
};

export const transformUserAnswerQuestionToEditor = (data, questionTypeId) => {
  if (!data) {
    return getEmptyUserAnswerQuestion();
  }

  return {
    uaqId: data.id,
    uaqMarchingId: data?.uaqMarchingId,
    uaqAnswerContent: data.answerContent,
    uaqAnswerDate: data.answerDate,
    uaqAnswerNumeric:
      data.answerNumeric && data.answerNumeric.toString().indexOf('.' || ',') > -1
        ? data.answerNumeric.toString().replace('.' || ',', LocaleConfig.decimalSeparator)
        : data.answerNumeric,
    uaqComment: data.comment,
    uaqDefectDescription: data.defectDescription,
    uaqImages: data.images.map((item) => ({
      ...item,
      uaqId: item.formUserAnswerQuestionGuid,
      position: _.get(item, 'files.position', 0),
    })),
    uaqOptions: transformUaqOptions(data.options, questionTypeId),
    uaqDropdownValue:
      (questionTypeId === formItemTypes.DROPDOWN || questionTypeId === formItemTypes.Option) &&
      transformOption(_.first(data.options), questionTypeId),
    uaqAnswerTexts: _.size(data.texts) > 0 ? data.texts : defaultAnswerTexts,
    uaqAnswerMarching: data.marching,
    uaqAnswerIsPhotographTaken: data.isPhotographTaken,
    formUserAnswerGuid: data.formUserAnswerGuid,
    uaqDeclareQuantity: data.declareQuantity,
    isDefect: data.isDefect,
  };
};

const augmentAnswersWithDetails = (answers, subUserAnswerQuestion) => {
  if (!_.size(answers)) return answers;

  return answers.map((answer) => ({
    ...answer,
    value: answer.id,
    uaqId: subUserAnswerQuestion?.id,
  }));
};

export const transformSubUserAnswerToEditor = async (subQuestion, formUserAnswerGuid) => {
  if (!subQuestion) return;

  const subUserAnswerQuestion = await FormSubUserAnswerQuestionMgr.getByQuestionAndFormUserAnswerGuid({
    questionGuid: subQuestion.id,
    formUserAnswerGuid,
  });
  const options = subUserAnswerQuestion
    ? await FormSubUserAnswerQuestionOptionMgr.getByUserAnswerQuestionGuid(subUserAnswerQuestion.id)
    : [];

  const answers = augmentAnswersWithDetails(subQuestion.answers, subUserAnswerQuestion);

  return {
    ...subQuestion,
    uaqAnswerContent: subUserAnswerQuestion?.answerContent,
    uaqComment: subUserAnswerQuestion?.comment,
    uaqOptions: transformUaqOptions(options, formItemTypes.MULTIPLE_CHOICE),
    formUserAnswerGuid,
    subUserAnswerQuestion,
    answers,
  };
};

export const transformAnswerQuestionToDB = (answers) =>
  _.map(answers, (answer) => ({
    ...answer,
    formQuestionAnswerTemplateId: `${answer.formQuestionAnswerTemplateId}`,
  }));

export const transformUserAnswerQuestionToDB = (question, formUserAnswerGuid) => {
  const {
    uaqId,
    uaqAnswerContent,
    uaqAnswerDate,
    uaqAnswerNumeric,
    uaqComment,
    uaqImages,
    uaqOptions,
    uaqDropdownValue,
    uaqDeclareQuantity,
    uaqDefectDescription,
    isDefect,
  } = question;

  const optionValues = uaqDropdownValue ? [uaqDropdownValue.value] : uaqOptions;
  const uaqAnswerNumericResult =
    typeof uaqAnswerNumeric === 'string'
      ? parseFloat(uaqAnswerNumeric && uaqAnswerNumeric.replace(',', '.'))
      : uaqAnswerNumeric;

  return {
    id: uaqId,
    questionGuid: question.guid || question.uid,
    answerContent: getAnswerContent(uaqAnswerContent),
    answerDate: transformDateToFormSubmit(uaqAnswerDate),
    answerNumeric: uaqAnswerNumericResult,
    answerMarching: {
      marching: question.uaqAnswerMarching,
      texts: question.uaqAnswerTexts,
      isPhotographTaken: question.uaqAnswerIsPhotographTaken,
      id: question.uaqMarchingId,
    },
    comment: uaqComment,
    formUserAnswerGuid,
    images: uaqImages.map((image) => ({
      id: image.id,
      uid: image.uid,
      formUserAnswerQuestionGuid: uaqId,
      path: image.path,
      description: image.description,
      workflowGuid: image.workflowGuid,
      longitude: image.longitude,
      latitude: image.latitude,
      files: image.files,
    })),
    options: optionValues.map((option) => ({
      // id: option.id,
      formQuestionAnswerTemplateId: option.formQuestionAnswerTemplateId,
      formUserAnswerQuestionGuid: uaqId,
      formQuestionAnswerGuid: option,
    })),
    declareQuantity: uaqDeclareQuantity,
    defectDescription: uaqDefectDescription,
    isDefect,
  };
};

export const transformFormDetailToEditor = (data) => {
  if (!data) return {};
  const isPublish = _.get(data, 'status.code') !== FormStatusCode.UN_PUBLIC;
  const { formPages, formName, category, ...restData } = data;

  return {
    ...restData,
    name: formName,
    isPublish,
    formCategoryId: _.get(category, 'id', 0),
    formPages: _.map(formPages, (formPage) => ({
      ...formPage,
      formQuestions: _.map(
        formPage.formQuestions,
        ({ answers, subQuestion, questionType, uaqAnswerDate, ...restQuestion }) => ({
          ...restQuestion,
          remoteId: restQuestion.remoteId || restQuestion.id,
          uaqAnswerDate: uaqAnswerDate ? moment(uaqAnswerDate) : undefined,
          questionType: questionType && {
            ...questionType,
            id: _.parseInt(questionType.id),
          },
          answers: _.map(answers, (item) => ({
            id: item.id,
            label: item.description,
            value: item.id,
            formQuestionAnswerTemplateId: item.formQuestionAnswerTemplateId,
            formQuestionGuid: item.formQuestionGuid,
            guid: item.guid,
            image: item?.image,
          })),
          subQuestion: subQuestion && {
            ...subQuestion,
            remoteId: subQuestion.id,
            formQuestionTypeId: subQuestion.formQuestionTypeId || subQuestion.questionType?.id,
          },
          budgetCodes: restQuestion.budgetCode ? restQuestion.budgetCode.split(',') : [],
          uaqComments: _.map(restQuestion?.comments, (item) => ({
            ...item,
            formQuestionCommentId: item.id,
          })),
        })
      ),
    })),
  };
};

const getAnswerContent = (value) => (value?.rawValue ? value.rawValue : value);

// for insert
/**
 * this function used to detect changes between two object current and the original
 * detect question inserted
 * detect question deleted
 * detect question update
 * detect formPage insert
 * detect formPage update
 * detect formPage deleted
 * detect formPage sort
 * detect form insert
 * detect form deleted
 * detect form deleted
 * {
  template: {
    name: ""
  },
  formPages: [{
    body: {
      name: ""
    },
    formItems: [
      item1,
      item2
    ]
  }]
}
 * */

// compare form page keys
// question is check all object
// const questionKeys = ['', '', ]
const getAddedItems = (currentItems, originalItems) => {
  const oldMap = new Map(originalItems.map((item) => [item.id, item]));
  return currentItems.filter((item) => !oldMap.has(item.id));
};

const getExistingItems = (currentItems, originalItems) => {
  const oldMap = new Map(originalItems.map((item) => [item.id, item]));
  return currentItems.filter((item) => oldMap.has(item.id));
};

const getRemovedItems = (currentItems, originalItems) =>
  originalItems.filter((item) => currentItems.findIndex((currentItem) => currentItem.id === item.id) === -1);

// export const convertQuestionToSubmitForm
export const convertSubmitDataFromFormEditor = (formData, originalData) => {
  try {
    if (!originalData) {
      // is add new
      return {
        adds: formData.formPages,
        updates: [],
        removes: [],
        name: formData.name,
        formCategoryId: formData.formCategoryId,
        isPublish: formData.isPublish,
      };
    }
    const { formPages: currentFormPages } = formData;
    const { formPages: originalFormPages } = originalData;
    // form pages
    // detect add or remove first
    const addFormPages = getAddedItems(currentFormPages, originalFormPages);
    const removeFormPages = getRemovedItems(currentFormPages, originalFormPages);

    // detect updated

    const existingFormPages = getExistingItems(currentFormPages, originalFormPages);
    existingFormPages.forEach((formPage) => {
      const originalFormPage = originalFormPages.find((item) => item.id === formPage.id);
      const isUpdateFormPage =
        formPage.name !== originalFormPage.name ||
        formPage.formQuestionTypeCategoryId !== originalFormPage.formQuestionTypeCategoryId;
      // check update for formpage
      if (isUpdateFormPage) {
        formPage.actionType = ActionType.UPDATE;
      }
      // check questions
      const { formQuestions: currentQuestions } = formPage;
      const { formQuestions: originalQuestions } = originalFormPage;
      const addQuestions = getAddedItems(currentQuestions, originalQuestions);
      const removeQuestions = getRemovedItems(currentQuestions, originalQuestions);
      const existingQuestions = getExistingItems(currentQuestions, originalQuestions);
      existingQuestions.forEach((question, index) => {
        const originalQuestion = originalQuestions.find((item) => item.id === question.id);
        if (
          JSON.stringify(question) !== JSON.stringify(originalQuestion) ||
          (question.questionIndex === 0 && index > 0) ||
          removeQuestions.length > 0
        ) {
          question.questionIndex = index;
          question.actionType = ActionType.UPDATE;
        }
      });
      formPage.actionType = isUpdateFormPage ? ActionType.UPDATE : undefined;
      formPage.adds = addQuestions.map((question, index) => ({
        ...question,
        questionIndex: existingQuestions.length + index,
      }));
      formPage.removes = removeQuestions;
      formPage.updates = existingQuestions;
    });

    return {
      name: formData.name,
      id: formData.id,
      formCategoryId: formData.formCategoryId,
      isPublish: formData.isPublish,
      actionType:
        formData.name !== originalData.name || formData.formCategoryId !== originalData.formCategoryId
          ? ActionType.UPDATE
          : undefined,
      adds: addFormPages,
      removes: removeFormPages,
      updates: existingFormPages,
    };
  } catch (e) {
    console.log('convertSubmitDataFromFormEditor ', e);
  }
};

/**
 * Depend on isInspection we decide return id or not
 * */

const transformSubAnswer = (subQuestion) => {
  if (subQuestion.formQuestionTypeId !== formItemTypes.MULTIPLE_CHOICE) {
    return [];
  }
  return subQuestion.answers.map(({ description, remoteId, ...restAnswer }) => ({
    ...restAnswer,
    description,
    id: remoteId,
    value: remoteId ? value : null,
  }));
};

const transformSubQuestion = (subQuestion) => {
  if (!subQuestion) return null;

  return {
    ...subQuestion,
    questionType: {
      id: subQuestion.formQuestionTypeId,
    },
    answers: transformSubAnswer(subQuestion),
  };
};

export const transformSubQuestionForAddQuestion = (subQuestion) => {
  if (!subQuestion) {
    return;
  }
  return {
    ...subQuestion,
    id: null,
    formQuestionId: null,
  };
};

export const transformQuestionEditorToSubmitData = ({ answers, questionType, subQuestion, ...question }, isAddNew) => ({
  ...question,
  id: isAddNew ? 0 : question.id,
  formQuestionTypeId: `${questionType.id}`,
  questionType,
  answers: answers.map(({ label, value, ...restAnswer }) => {
    const notSurveyImageAnswer = !question.isCopy && !restAnswer?.image; // add new question but not image

    return {
      ...restAnswer,
      formQuestionId: isAddNew ? 0 : question.id,
      description: label,
      id: isAddNew ? 0 : restAnswer.id,
      guid: notSurveyImageAnswer ? null : restAnswer.guid,
      image: question.isCopy ? null : restAnswer?.image,
    };
  }),
  subQuestion: transformSubQuestion(subQuestion),
});

export const transformInspectionOnline = (list, userId, isOnline = true) => ({
  ...list,
  items: list.items
    .filter((item) => !userId || item.pickedByUserId !== userId || item.workflow.status.isIssueClosed)
    .map((item) => {
      item.workflow.inspection = {
        guid: item.guid,
        id: item.guid,
        remoteId: item?.id,
        signatures: [],
        property: item.inspectionProperty,
        team: item.team,
        workOrderId: item.workOrderId,
      };
      item.workflow = {
        ...item.workflow,
        id: item.workflow.guid,
        isOnline,
        property: item.inspectionProperty,
        pickedByUserId: item.pickedByUserId,
        creatorUserId: item.workflow?.creatorUser?.id,
        listAssigneeIds: item?.listAssigneeIds,
        parentGuid: item.guid,
        formId: item.workflow.form ? `${item.workflow.form.id}` : '',
        parentId: item.workflow.parentId,
        remoteId: item.workflow.id,
        statusId: `${item.workflow.status.id}`,
        // formGuid: item.workflow.form.guid,
      };
      return item.workflow;
    }),
});
