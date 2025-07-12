import { Q } from '@nozbe/watermelondb';
import withBaseMgr from './BaseMgr';

const FormSubQuestionAnswerMgr = (collection) => ({
  getAnswerBySubQuestionId: async (id) => {
    const list = await collection.query(Q.where('formSubQuestionGuid', id)).fetch();
    return list.map((item) => item.getValue());
  },
});

export default withBaseMgr('formSubQuestionAnswer')(FormSubQuestionAnswerMgr);
