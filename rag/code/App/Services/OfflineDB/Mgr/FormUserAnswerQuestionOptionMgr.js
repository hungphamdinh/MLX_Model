import { Q } from '@nozbe/watermelondb';
import withBaseMgr from './BaseMgr';
import { generateInspectionUUID, TableNames } from '../IDGenerator';

const FormUserAnswerQuestionOptionMgr = (collection, baseMgr) => ({
  /**
   * Create, Update or delete option
   * * */
  updateOptions: async (options, formUserAnswerQuestionGuid) => {
    // remove all the old answer and update a new one
    const originalOptionQuestions = await collection.query(
      Q.where('formUserAnswerQuestionGuid', Q.eq(formUserAnswerQuestionGuid))
    );
    const originalSize = originalOptionQuestions.length;

    await Promise.all(
      options.map(async (option, index) => {
        if (originalSize > index) {
          // update the old option
          const userAnswerQuestionOption = originalOptionQuestions[index];
          await userAnswerQuestionOption.update((obj) => {
            obj.formQuestionAnswerGuid = option.formQuestionAnswerGuid;
          });
        }
        if (originalSize <= index) {
          // create the new option
          await baseMgr.create((obj) => {
            obj.id = generateInspectionUUID(TableNames.formUserAnswerQuestionOption);
            obj.formQuestionAnswerGuid = option.formQuestionAnswerGuid;
            obj.formUserAnswerQuestionGuid = formUserAnswerQuestionGuid;
          });
        }
      })
    );
    if (originalSize - options.length > 0) {
      const deleteOptions = originalOptionQuestions.splice(options.length - 1, originalSize);
      await baseMgr.batchRemove(deleteOptions.map((item) => item.id));
    }
    return true;
  },
});

export default withBaseMgr('formUserAnswerQuestionOption')(FormUserAnswerQuestionOptionMgr);
