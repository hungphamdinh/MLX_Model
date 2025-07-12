import { Q } from '@nozbe/watermelondb';
import withBaseMgr from './BaseMgr';
import FormSubQuestionAnswerMgr from './FormSubQuestionAnswerMgr';
import { formItemTypes } from '../../../Config/Constants';

const mgr = (_collection, baseMgr) => ({
  getByQuestionGuid: async (id) => {
    const result = await baseMgr.queryOne(Q.where('formQuestionGuid', id));
    const subQuestion = result ? result.getValue() : null;
    if (subQuestion && subQuestion.formQuestionTypeId === formItemTypes.MULTIPLE_CHOICE) {
      return {
        ...subQuestion,
        answers: await FormSubQuestionAnswerMgr.getAnswerBySubQuestionId(subQuestion.id),
      };
    }
    return subQuestion;
  },
});

const FormSubQuestionMgr = withBaseMgr('formSubQuestion')(mgr);

export default FormSubQuestionMgr;
