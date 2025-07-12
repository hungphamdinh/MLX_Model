import { Q } from '@nozbe/watermelondb';
import withBaseMgr from './BaseMgr';

const FormSubUserAnswerQuestionOptionMgr = (collection) => ({
  getByUserAnswerQuestionGuid: async (id) => {
    if (!id) {
      return [];
    }
    const result = await collection.query(Q.where('formUserAnswerQuestionGuid', id)).fetch();
    return result ? result.map((item) => item.getValue()) : [];
  },
});

export default withBaseMgr('formSubUserAnswerQuestionOption')(FormSubUserAnswerQuestionOptionMgr);
