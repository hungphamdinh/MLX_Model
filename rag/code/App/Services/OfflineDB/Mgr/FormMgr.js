import { Q } from '@nozbe/watermelondb';
import _ from 'lodash';
import { PAGE_SIZE } from '../../../Config';
import withBaseMgr from './BaseMgr';
import FormUserAnswerQuestionMgr from './FormUserAnswerQuestionMgr';
import {
  transformUserAnswerQuestionToEditor,
  transformSubUserAnswerToEditor,
} from '../../../Transforms/InspectionTransformer';
import FormUserAnswerMgr from './FormUserAnswerMgr';
import SyncDB from '../SyncDB';
import FormPageGroupMgr from './FormPageGroupMgr';
import FormSubQuestionMgr from './FormSubQuestionMgr';

// const inspectionCollection = database.get('inspection');
// const collection = database.get('form');
// const formPageCollection = database.get('formPage');

const mgr = (collection) => ({
  getFormInspectionDetail: async (workflow, user) => {
    // get form

    const formCategory = FormCategoryMgr.collection;
    const formData = await collection.query(Q.where('remoteId', parseInt(workflow.formId, 10))).fetch();
    const form = formData[0];
    let formPageGroups = [];

    let categoryName = '';
    if (form.formCategoryId) {
      const category = await formCategory.find(form.formCategoryId);
      categoryName = category.name;
    }

    if (workflow?.isMasterSection) {
      formPageGroups = await FormPageGroupMgr.getFormPageGroupByFormId(form.id);
    }

    // get inspection
    // const inspection = await InspectionMgr.find(workflow.parentGuid);
    let formUserAnswer = await FormUserAnswerMgr.queryOne(Q.where('parentGuid', workflow.parentGuid));

    if (!formUserAnswer && user) {
      // in case created by web admin
      await SyncDB.action(async () => {
        formUserAnswer = await FormUserAnswerMgr.createInspectionUserAnswer(
          workflow.parentGuid,
          `${_.get(user, 'id')}`
        );
      });
    }
    const formPages = await form.formPages;
    const formStatus = await form.formStatus;
    const formPageQuestions = await Promise.all(
      formPages.map(async (formPage) => {
        const questions = await formPage.questions.fetch();
        const formQuestionTypes = await Promise.all(questions.map((question) => question.formQuestionType));
        const formAnswers = await Promise.all(questions.map((question) => question.answers));
        const userAnswerQuestions = await Promise.all(
          questions.map((question) =>
            question && formUserAnswer
              ? FormUserAnswerQuestionMgr.getUserAnswerQuestion(question.id, formUserAnswer.id)
              : null
          )
        );

        const questionResults = await Promise.all(
          questions.map(async (item, index) => {
            const question = item.getValue();
            const subQuestion = await FormSubQuestionMgr.getByQuestionGuid(question.id);
            return {
              ...question,
              questionType: formQuestionTypes[index].getValue(),
              answers: formAnswers[index].map((answer) => answer.getValue()),
              ...transformUserAnswerQuestionToEditor(
                userAnswerQuestions[index],
                _.parseInt(question.formQuestionTypeId)
              ),
              subQuestion: await transformSubUserAnswerToEditor(
                subQuestion,
                _.first(userAnswerQuestions).formUserAnswerGuid,
                question
              ),
            };
          })
        );

        return _.sortBy(questionResults, ['questionIndex', 'remoteId']);
      })
    );

    const formPagesValues = await Promise.all(
      formPages.map(async (formPage, index) => {
        const values = {
          ...formPage.getValue(),
          formQuestions: formPageQuestions[index],
        };
        if (workflow?.isMasterSection) {
          const formPageGroup = await FormPageGroupMgr.getFormPageGroupById(formPage.formPageGroupGuid);
          return {
            ...values,
            formPageGroupName: formPageGroup?.name,
          };
        }
        return values;
      })
    );

    const questionCount = formPageQuestions.reduce((acc, curr) => acc + _.size(curr), 0);

    return {
      ...form.getValue(),
      status: formStatus.getValue(),
      creationTime: form.publicTime,
      categoryName,
      questionCount,
      formUserAnswer: formUserAnswer.getValue(),
      formPageGroups,
      formPages: _.sortBy(formPagesValues, ['pageIndex']),
    };
  },
  getFormDetail: async (formGuid) => {
    // get form
    const formCategory = FormCategoryMgr.collection;
    const form = await collection.find(formGuid);
    let categoryName = '';
    if (form.formCategoryId) {
      const category = await formCategory.find(form.formCategoryId);
      categoryName = category.name;
    }
    // get inspection
    const formPages = await form.formPages;
    const formStatus = await form.formStatus;
    const formPageQuestions = await Promise.all(
      formPages.map(async (formPage) => {
        const questions = await formPage.questions.fetch();
        return questions.map((question) => ({
          ...question.getValue(),
        }));
      })
    );
    const questionCount = formPageQuestions.reduce((acc, curr) => acc + _.size(curr), 0);
    return {
      ...form.getValue(),
      status: formStatus.getValue(),
      categoryName,
      creationTime: form.publicTime,
      questionCount,
      formPages: formPages.map((formPage, index) => ({
        ...formPage.getValue(),
        formQuestions: formPageQuestions[index],
      })),
    };
  },
  filterMyForm: async (page, keyword, statusId, creatorUserId) => {
    const query = collection.query(
      Q.where('formName', Q.like(`%${Q.sanitizeLikeString(keyword)}%`)),
      Q.where('statusId', Q.eq(statusId)),
      Q.where('creatorUserId', Q.eq(creatorUserId.toString())),
      Q.sortBy('created_at', Q.desc), // sorts ascending by `likes`
      Q.sortBy('remoteId', Q.desc), // sorts ascending by `likes`
      Q.skip((page - 1) * PAGE_SIZE),
      Q.take(PAGE_SIZE)
    );
    const queryCount = collection.query(
      Q.where('formName', Q.like(`%${Q.sanitizeLikeString(keyword)}%`)),
      Q.where('statusId', Q.eq(statusId)),
      Q.where('creatorUserId', Q.eq(creatorUserId.toString()))
    );
    const items = await query.fetch();
    const totalCount = await queryCount.fetchCount();
    const forms = await Promise.all(items.map(async (form) => FormMgr.getFormDetail(form.id)));
    return {
      items: forms,
      totalCount,
    };
  },
});

const FormMgr = withBaseMgr('form')(mgr);
const FormCategoryMgr = withBaseMgr('formCategory')(mgr);
export default FormMgr;
