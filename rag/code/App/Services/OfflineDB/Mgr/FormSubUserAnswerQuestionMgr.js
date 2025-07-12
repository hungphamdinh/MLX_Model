import { Q } from '@nozbe/watermelondb';
import withBaseMgr from './BaseMgr';

const FormSubUserAnswerQuestionMgr = (collection, baseMgr) => ({
  getByQuestionAndFormUserAnswerGuid: async ({ questionGuid, formUserAnswerGuid }) => {
    if (!questionGuid) {
      return null;
    }
    const result = await baseMgr.queryOne(
      Q.where('questionGuid', questionGuid),
      Q.where('formUserAnswerGuid', Q.eq(formUserAnswerGuid))
    );
    return result ? result.getValue() : null;
  },
});
export default withBaseMgr('formSubUserAnswerQuestion')(FormSubUserAnswerQuestionMgr);
