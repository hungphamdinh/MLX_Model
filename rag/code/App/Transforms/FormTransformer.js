import _ from 'lodash';
import moment from 'moment';

import { transformDateToFormSubmit } from '../Utils/convertDate';
import LocaleConfig from '../Config/LocaleConfig';
import { formItemTypes } from '../Config/Constants';

export const transformFormDetailToAnswerForm = (data, userAnswers) => {
  if (!data) return {};

  const { formPages, ...restData } = data;
  const detailForm = {
    ...restData,
    formPages: _.map(formPages, (formPage) => ({
      ...formPage,
      formQuestions: _.map(formPage.formQuestions, ({ answers, ...restQuestion }) => ({
        ...restQuestion,
        answers: _.map(answers, (item) => ({
          label: item.description,
          value: item.id,
          formQuestionAnswerTemplateId: _.get(item, 'formQuestionAnswerTemplate.id'),
          id: item.id,
          image: item?.image,
        })),
        uaqAnswerContent: '',
        uaqAnswerDate: undefined,
        uaqAnswerNumeric: undefined,
        uaqComment: '',
        uaqImages: [],
        uaqOptions: [],
        subQuestion: '',
        uaqDefectDescription: '',
        isDefect: false,
        uaqComments: []
      })),
    })),
  };

  const getUaqDropdownValue = (questionTypeId, option) => {
    const answerId = _.get(option, 'answerId');
    if (questionTypeId === formItemTypes.DROPDOWN) {
      return {
        id: option.id,
        value: answerId,
      };
    }

    if (questionTypeId === formItemTypes.Option) {
      return {
        id: option.id,
        value: answerId,
      };
    }

    return undefined;
  };

  // mapping answers
  if (_.size(userAnswers) > 0) {
    userAnswers.forEach((answer) => {
      for (let i = 0; i <= detailForm.formPages.length; i += 1) {
        const detailFormItem = detailForm.formPages[i];
        const question = detailFormItem
          ? detailFormItem.formQuestions.find((item) => item.id === answer.questionId)
          : null;
        const questionCommentsById = _.size(question?.comments) ? question.comments.reduce((lookup, comment) => {
          lookup[comment.id] = comment;
          return lookup;
        }, {}) : [];
        if (question) {
          const questionTypeId = question.questionType.id;
          question.userAnswerId = answer.id;
          question.uaqAnswerContent = answer.answerContent;
          question.uaqAnswerDate = answer.answerDate ? moment(answer.answerDate) : undefined;
          question.uaqAnswerNumeric =
            answer.answerNumeric && answer.answerNumeric.toString().indexOf('.' || ',') > -1
              ? answer.answerNumeric.toString().replace('.' || ',', LocaleConfig.decimalSeparator)
              : answer.answerNumeric;
          question.uaqComment = answer.comment;
          question.uaqDefectDescription = answer.defectDescription;
          question.isDefect = answer.isDefect;
          question.uaqImages = _.map(answer.images, (image) => ({
            ...image,
            uid: image.imageGuid,
          }));
          question.uaqDropdownValue =
            _.size(answer.options) > 0 ? getUaqDropdownValue(questionTypeId, _.first(answer.options)) : null;
          question.uaqOptions = _.includes([formItemTypes.MULTIPLE_CHOICE, formItemTypes.IMAGE], questionTypeId)
            ? answer.options.map((option) => ({ value: option.answerId }))
            : [];
          question.uaqComments = _.map(answer?.comments, (item) => {
            const matchedComment = questionCommentsById[item.formQuestionCommentId];
            return matchedComment
              ? { ...item, titleComment: matchedComment.titleComment }
              : { ...item };
          });
          break;
        }
      }
    });
  }

  return detailForm;
};

export const transformAnswerData = (formData) => {
  let answers = [];
  formData.formPages.forEach((formPage) => {
    answers = answers.concat(
      formPage.formQuestions.map(
        ({
          id,
          userAnswerId,
          uaqAnswerContent,
          uaqAnswerDate,
          uaqAnswerNumeric,
          uaqComment,
          uaqImages,
          uaqOptions,
          uaqDropdownValue,
          uaqDefectDescription,
          isDefect,
          uaqComments,
        }) => ({
          questionId: id,
          id: userAnswerId,
          answerContent: uaqAnswerContent,
          answerDate: transformDateToFormSubmit(uaqAnswerDate),
          answerNumeric:
            typeof uaqAnswerNumeric === 'string'
              ? parseFloat(uaqAnswerNumeric && uaqAnswerNumeric.replace(',', '.'))
              : uaqAnswerNumeric,
          comment: uaqComment,
          images: _.map(uaqImages, (image) => ({
            imageGuid: image.imageGuid,
            position: image?.files ? image?.files.position : image?.position,
          })),
          options: uaqDropdownValue
            ? [{ answerId: uaqDropdownValue.value }]
            : _.map(uaqOptions, (uaqOption) => ({ answerId: uaqOption.value })),
          defectDescription: uaqDefectDescription,
          isDefect,
          comments: uaqComments
        })
      )
    );
  });
  return answers;
};

export const filterIsRequiredImage = (formData) => {
  let answers = [];
  formData.formPages.forEach((formPage) => {
    answers = answers.concat(
      formPage.formQuestions.filter((item) => item.isRequiredImage && (item.uaqImages?.length === 0 || !item.uaqImages))
    );
  });
  return answers;
};

export const transformPredefinedSections = (data) =>
  data.map(({ formQuestions, ...section }) => ({
    ...section,
    formQuestions: formQuestions.map(({ answers, ...formQuestion }) => ({
      ...formQuestion,
      answers: answers.map(({ description, id, formQuestionAnswerTemplate }) => ({
        label: description,
        value: id,
        formQuestionAnswerTemplateId: _.get(formQuestionAnswerTemplate, 'id'),
      })),
    })),
  }));

const updateFormPageId = (formPages, formPageFromGroup) => {
  const groupUpdated = formPageFromGroup.map((item) => {
    item.id = formPages.find((page) => page.guid === item.id)?.id;
    return item;
  });
  return groupUpdated;
};

export const transformIdForEachFormPage = (formPages, formPageGroups) => {
  if (!_.size(formPageGroups)) return [];
  return formPageGroups.map((item) => {
    item.formPages = updateFormPageId(formPages, item.formPages);
    return item;
  });
};

export const transformToAddFormPageGroup = (formPageGroups) => {
  if (!_.size(formPageGroups)) return [];
  return formPageGroups.map((item) => ({
    ...item,
    id: null,
    formPages: [],
  }));
};

export const transformFormPageGroupsToEditor = (formPageGroups) => {
  if (!_.size(formPageGroups)) {
    return [];
  }
  return formPageGroups.map((item) => {
    item.remoteId = item.id;
    item.id = item.guid;
    return item;
  });
};

export const transformFormRemoteId = (form) => ({
  ...form,
  remoteId: form.id,
});

const getGeneralFormPageGroups = (item, form) => ({
  formId: form?.remoteId,
  remoteId: item.remoteId,
  name: item.name,
});

export const transformFormPageGroupToDB = (formPageGroups, form) => {
  if (!_.size(formPageGroups)) return [];
  return formPageGroups.map((item) => ({
    formGuid: form.id,
    id: item.id,
    formPages: item.formPages.map((page) => ({
      name: page.name,
      id: page.id,
    })),
    ...getGeneralFormPageGroups(item, form),
  }));
};

export const transformFormPageGroupParams = (formPageGroups, form) => {
  if (!_.size(formPageGroups)) return [];
  return formPageGroups.map((item) => ({
    formGuid: null,
    id: item.remoteId || item.id,
    guid: item.guid || item.id,
    formPages: item.formPages.map((page) => ({
      name: page.name,
      id: page.guid || page.id,
    })),
    ...getGeneralFormPageGroups(item, form),
  }));
};

// Handle mapping local FormPages to response
export const mapFormPageToResponse = (results, formPageGroups) => {
  if (!_.size(results)) {
    return [];
  }
  return results.map((item) => {
    const localGroup = formPageGroups.find((pageGroup) => pageGroup.guid === item.guid);
    item.formPages = localGroup?.formPages;
    item.remoteId = item.id;
    return item;
  });
};

export const convertFormPageGroups = (formPageGroups) => {
  const formPagesNotExisting = _.size(formPageGroups) ? formPageGroups.filter((item) => !item.remoteId) : [];
  const formPagesExisting = _.size(formPageGroups) ? formPageGroups.filter((item) => item.remoteId) : [];

  return {
    formPagesExisting,
    formPagesNotExisting,
    formPageGroupsAdd: transformToAddFormPageGroup(formPagesNotExisting),
  };
};

export const convertFormPageGroupsToFormPages = (formPages, formPageGroups) => {
  if (!_.size(formPageGroups)) return formPages;

  // Create a lookup table for page IDs to their group data
  const pageGroupLookup = formPageGroups.reduce((acc, group) => {
    group.formPages.forEach((page) => {
      acc[page.id] = { guid: group.id, name: group.name, groupId: group.remoteId };
    });
    return acc;
  }, {});

  // Map over formPages to update their group data based on the lookup table
  return formPages.map((page) => {
    const groupData = pageGroupLookup[page.id];
    if (groupData) {
      page.formPageGroupGuid = groupData.guid;
      page.formPageGroupName = groupData.name;
      page.formPageGroupId = groupData.groupId;
    } else {
      // force re-render for case Delete FormPageGroup
      page.formPageGroupName = '';
    }

    // need for case add new FormPageGroup
    page.guid = page.id;
    return page;
  });
};
