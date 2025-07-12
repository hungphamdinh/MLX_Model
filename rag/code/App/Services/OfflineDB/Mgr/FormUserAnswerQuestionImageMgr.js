import { Q } from '@nozbe/watermelondb';
import _ from 'lodash';
import RNFS from 'react-native-fs';
import { differenceTwoArrayObject } from '../../../Utils/array';
import withBaseMgr, { mergeEntityWith } from './BaseMgr';

const FormUserAnswerQuestionImageMgr = (collection, baseMgr) => ({
  /**
   * Create, Update or delete image
   *
   * * */
  updateImages: async (images, formUserAnswerQuestionGuid) => {
    const originalOptionImages = await collection.query(
      Q.where('formUserAnswerQuestionGuid', Q.eq(formUserAnswerQuestionGuid))
    );
    const { created, updated, deleted } = differenceTwoArrayObject(originalOptionImages, images);
    // create
    await baseMgr.batchCreate(
      _.map(created, (item) => ({
        ...item,
        formUserAnswerQuestionGuid,
      }))
    );
    await baseMgr.batchUpdate(updated);
    await baseMgr.batchRemove(deleted.map((item) => item.id));
    return true;
  },

  updateServerImages: async (files) =>
    Promise.all(
      files.map(async (file) => {
        const fileName = file.fileName;
        const imageId = _.first(fileName.split('.'));
        return baseMgr.update(imageId, (obj) => {
          obj.files = file;
          obj.imageGuid = file.guid;
          obj.path = '';
        });
      })
    ),
  // use for images not found
  removeSyncImages: async (files) =>
    Promise.all(
      files.map(async (file) =>
        baseMgr.update(file.id, (obj) => {
          obj.path = '';
        })
      )
    ),
  patchUnsyncImagesImages: async () => {
    const unsyncedImages = await collection.query(
      Q.where('path', Q.eq('')),
      Q.where('imageGuid', Q.notEq('')),
      Q.where('remoteId', Q.eq(0)),
      Q.where('_status', Q.eq('synced'))
    );
    if (unsyncedImages.length > 0) {
      await Promise.all(
        unsyncedImages.map(async (item) =>
          baseMgr.update(item.id, (obj) => {
            obj._raw._status = 'created';
          })
        )
      );
    }

    return unsyncedImages;
  },

  // handle update for form question image to resolve issues when the images in form editor is out of date
  handleUpdateAnswerImage: async (list) =>
    Promise.all(
      list.map(async (newEntity) => {
        const { id, imageGuid, files, ...item } = newEntity;
        const entity = await collection.find(id);
        let isExistPath = false;
        if (_.size(item.path) > 10) {
          isExistPath = await RNFS.exists(item.path);
        }

        return entity.update((obj) => {
          if (files) {
            // case edit image
            if (isExistPath) {
              obj.files = files;
              obj.imageGuid = imageGuid;
            } else {
              // case reorder images, or add new images
              obj.path = '';
              if (entity.files) {
                obj.files = { ...entity.files, position: files.position };
              }
            }
          }
          mergeEntityWith(obj, item);
        });
      })
    ),
});

export default withBaseMgr('formUserAnswerQuestionImage')(FormUserAnswerQuestionImageMgr);
