import { Q } from '@nozbe/watermelondb';
import withBaseMgr, { getChildrenValues, mergeEntityWith } from './BaseMgr';
import FormUserAnswerQuestionOptionMgr from './FormUserAnswerQuestionOptionMgr';
import FormUserAnswerQuestionImageMgr from './FormUserAnswerQuestionImageMgr';
import FormUserAnswerQuestionMarchingMgr from './FormUserAnswerQuestionMarchingMgr';
import { TableNames, generateInspectionUUID } from '../IDGenerator';
import SyncDB from '../SyncDB';

const FormUserAnswerQuestionMgr = (collection, baseMgr) => ({
  /**
   * save answers
   * assign form question id if it is't exist
   * steps
   * Create formUserAnswerQuestion
   * Create formUserAnswerQuestionOption
   * Create formUserAnswerQuestionImage
   * */
  createOrUpdateUserAnswerQuestion: async (payload) => {
    // const userAnswerEntity = baseMgr.find(userAnswerQuestion.id);
    const { images, options, answerMarching, ...userAnswerQuestion } = payload;
    if (userAnswerQuestion.id) {
      await baseMgr.update(userAnswerQuestion.id, (obj) => {
        mergeEntityWith(obj, userAnswerQuestion);
      });
    } else {
      await baseMgr.create((obj) => {
        mergeEntityWith(obj, userAnswerQuestion);
      });
    }

    const userAnswerQuestionGuid = userAnswerQuestion.id || userAnswerQuestion.uid;
    await FormUserAnswerQuestionMarchingMgr.createOrEditAnswer(answerMarching, userAnswerQuestionGuid);
    // create or edit options
    await FormUserAnswerQuestionOptionMgr.updateOptions(options, userAnswerQuestionGuid);

    // create or edit images
    await FormUserAnswerQuestionImageMgr.updateImages(images, userAnswerQuestionGuid);
  },
  /**
   * Get all answers for question
   * return empty answer if not found
   * */
  getUserAnswerQuestion: async (questionGuid, formUserAnswerGuid) => {
    let userAnswerQuestion = await baseMgr.queryOne(
      Q.where('questionGuid', Q.eq(questionGuid)),
      Q.where('formUserAnswerGuid', Q.eq(formUserAnswerGuid))
    );

    if (!userAnswerQuestion) {
      userAnswerQuestion = await SyncDB.action(async () =>
        baseMgr.create((obj) =>
          mergeEntityWith(obj, {
            id: generateInspectionUUID(TableNames.formUserAnswerQuestion),
            questionGuid,
            formUserAnswerGuid,
          })
        )
      );
    }

    if (userAnswerQuestion) {
      const userAnswerMarchingQuestion = await FormUserAnswerQuestionMarchingMgr.getDataByGuid(userAnswerQuestion.guid);
      const options = await getChildrenValues(userAnswerQuestion.options);
      const images = await getChildrenValues(userAnswerQuestion.images);
      // handle default files if image file is empty
      images.forEach((image) => {
        if (!image.files) {
          image.files = { position: 0 };
        }
      });
      let result = {
        ...userAnswerQuestion.getValue(),
        images,
        options,
      };

      if (userAnswerMarchingQuestion) {
        const userAnswerMarchingData = userAnswerMarchingQuestion.getValue();
        result = {
          ...result,
          formUserAnswerQuestionGuid: userAnswerMarchingData.formUserAnswerQuestionGuid,
          formUserAnswerQuestionId: userAnswerMarchingData.formUserAnswerQuestionId,
          marching: userAnswerMarchingData.marching,
          isPhotographTaken: userAnswerMarchingData.isPhotographTaken,
          texts: userAnswerMarchingData.texts,
          uaqMarchingId: userAnswerMarchingData.id,
        };
      }
      return result;
    }
    return null;
  },
});
export default withBaseMgr('formUserAnswerQuestion')(FormUserAnswerQuestionMgr);
