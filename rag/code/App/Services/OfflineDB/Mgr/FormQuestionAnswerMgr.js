import withBaseMgr, { mergeEntityWith } from './BaseMgr';

const FormQuestionAnswerMgr = (collection, baseMgr) => ({
  createOrUpdateAnswers: async (answers, questionGuid) =>
    Promise.all(answers.map((answer) => {
      if (answer.id && !answer.isAddNew) {
        return baseMgr.update(answer.id, (obj) => {
          obj.formQuestionGuid = questionGuid;
          mergeEntityWith(obj, answer);
        });
      }
      return baseMgr.create((obj) => {
        obj.formQuestionGuid = questionGuid;
        mergeEntityWith(obj, answer);
      });
    }))
  ,
  // deleteAnswers = async (answers) => {
  //
  // }
});

export default withBaseMgr('formQuestionAnswer')(FormQuestionAnswerMgr);

