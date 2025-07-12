import { Q } from '@nozbe/watermelondb';
import withBaseMgr, { getChildrenValues, getEntityValue } from './BaseMgr';

const mgr = (collection, baseMgr) => ({
  sortPages: async (ids) =>
    Promise.all(
      ids.map((id, index) =>
        baseMgr.update(id, (obj) => {
          obj.pageIndex = index;
        })
      )
    ),
  getDetailSection: async (id) => {
    const formPage = await collection.find(id);
    const formPageQuestions = await formPage.questions;
    const formAnswers = await Promise.all(formPageQuestions.map((question) => getChildrenValues(question.answers)));
    const formQuestionTypes = await Promise.all(
      formPageQuestions.map((question) => getEntityValue(question.formQuestionType))
    );

    return {
      ...formPage.getValue(),
      formQuestions: formPageQuestions.map((question, index) => ({
        ...question.getValue(),
        answers: formAnswers[index],
        questionType: formQuestionTypes[index],
      })),
    };
  },
  getDefineSections: async () => {
    const items = await collection.query(Q.where('formId', Q.eq(''))).fetch();
    return Promise.all(items.map((item) => FormPageMgr.getDetailSection(item.id)));
  },

  getFormPageByGroupId: async (groupId) => {
    const formPages = await collection.query(Q.where('formPageGroupGuid', groupId)).fetch();
    return formPages.map((item) => item.getValue());
  },
});

const FormPageMgr = withBaseMgr('formPage')(mgr);

export default FormPageMgr;
