import { Q } from '@nozbe/watermelondb';
import withBaseMgr from './BaseMgr';

const FormUserAnswerQuestionMarchingMgr = (collection, baseMgr) => ({
  updateMarching: async (files) =>
    Promise.all(
      files.map(async (file) => {
        const fileName = file.fileName;
        const imageId = _.first(fileName.split('.'));
        return baseMgr.update(imageId, (obj) => {
          obj.files = file;
          obj.path = 'done';
        });
      })
    ),
  getDataByGuid: (guid) => baseMgr.queryOne(Q.where('formUserAnswerQuestionGuid', Q.eq(guid))),
  createOrEditAnswer: async (answerMarching, userAnswerQuestionGuid) => {
    if (answerMarching) {
      if (answerMarching.id) {
        await baseMgr.update(answerMarching.id, (obj) => {
          obj.marching = answerMarching.marching;
          obj.texts = answerMarching.texts;
          if (answerMarching.isPhotographTaken) {
            obj.isPhotographTaken = 1;
          } else if (answerMarching.isPhotographTaken === false) {
            obj.isPhotographTaken = 0;
          }
        });
      } else {
        await baseMgr.create((obj) => {
          obj.marching = answerMarching.marching;
          obj.texts = answerMarching.texts;
          obj.formUserAnswerQuestionGuid = userAnswerQuestionGuid;
          if (answerMarching.isPhotographTaken) {
            obj.isPhotographTaken = 1;
          } else if (answerMarching.isPhotographTaken === false) {
            obj.isPhotographTaken = 0;
          }
        });
      }
    }
  },
});
export default withBaseMgr('formUserAnswerQuestionMarching')(FormUserAnswerQuestionMarchingMgr);
