import _ from 'lodash';
import { Q } from '@nozbe/watermelondb';
import withBaseMgr from './BaseMgr';

const SignatureImageMgr = (collection, baseMgr) => ({
  updateServerImages: async (files) =>
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
  // use for signatures not found
  removeSyncImages: async (files) =>
    Promise.all(
      files.map(async (file) =>
        baseMgr.update(file.id, (obj) => {
          obj.files = 'done';
        })
      )
    ),
  getSignatureByWorkflowId: async (workflowGuid) => {
    const result = await collection.query(Q.where('referenceId', workflowGuid)).fetch();
    return result;
  },
});

export default withBaseMgr('signatureImage')(SignatureImageMgr);
