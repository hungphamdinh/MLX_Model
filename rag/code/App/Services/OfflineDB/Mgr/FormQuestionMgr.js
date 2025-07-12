import withBaseMgr, { mergeEntityWith } from './BaseMgr';
import FormQuestionAnswerMgr from './FormQuestionAnswerMgr';
import FormUserAnswerQuestionMgr from './FormUserAnswerQuestionMgr';
import {
  transformAnswerQuestionToDB,
  transformUserAnswerQuestionToDB,
} from '../../../Transforms/InspectionTransformer';

const FormQuestionMgr = (collection, baseMgr) => ({
  addOrEditQuestion: async ({ answers, formUserAnswerGuid, ...question }) => {
    const questionId = question.id || question.uid;
    if (question.id) {
      await baseMgr.update(question.id, (obj) => {
        mergeEntityWith(obj, question);
      });
    } else {
      await baseMgr.create((obj) => {
        mergeEntityWith(obj, question);
      });
    }
    // save options for question
    const answerQuestionData = transformAnswerQuestionToDB(answers);
    await FormQuestionAnswerMgr.createOrUpdateAnswers(answerQuestionData, questionId);

    // save answer for question
    const userAnswerQuestionData = transformUserAnswerQuestionToDB(question, formUserAnswerGuid);
    await FormUserAnswerQuestionMgr.createOrUpdateUserAnswerQuestion(userAnswerQuestionData);
    return true;
  },
  // handle when add question in inspection
  addQuestion: async ({ answers, ...question }) => {
    // create question
    const newQuestion = await baseMgr.create((obj) => {
      mergeEntityWith(obj, question);
    });

    // save options for question
    await FormQuestionAnswerMgr.createOrUpdateAnswers(answers, newQuestion.id);

    // save answer for question
    // await FormUserAnswerQuestionMgr.createOrUpdateAnswers(answers);
    return true;
  },
  // handle when update question in inspection

  updateQuestion: async ({ answers, ...question }) => {
    // create question
    await baseMgr.update(question.id, (obj) => {
      mergeEntityWith(obj, question);
    });

    // create or update answers
    // await FormQuestionAnswerMgr.createOrUpdateAnswers(answers, question.id);
    return true;
  },
  deleteQuestion: () => {},
});

export default withBaseMgr('formQuestion')(FormQuestionMgr);
