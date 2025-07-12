import { Q } from '@nozbe/watermelondb';
import RNFS from 'react-native-fs';
import _ from 'lodash';
import { Platform } from 'react-native';
import WorkflowMgr from './WorkflowMgr';
import FormUserAnswerQuestionImageMgr from './FormUserAnswerQuestionImageMgr';
import { getExtension, getFileName } from '../../../Utils/file';
import SignatureImageMgr from './SignatureImageMgr';
import { TableNames } from '../IDGenerator';
import SyncDB from '../SyncDB';
import { PAGE_SIZE } from '../../../Config';

// cause document path always change after restart app, so we will get path by document folder
function getFilePaths(images, folder) {
  return images.map((image) => {
    const fileName = getFileName(image.path);
    // use it to easily update question image
    const newFileName = `${image.id}${getExtension(fileName)}`;
    const filePath = Platform.OS === 'ios' ? `${RNFS.DocumentDirectoryPath}/${folder}/${fileName}` : image.path;
    return {
      ...image.getValue(),
      fileName: newFileName,
      file: filePath,
    };
  });
}

const getWorkflowByIds = async (workflowIds) => {
  const items = await WorkflowMgr.collection.query(Q.where('id', Q.oneOf(workflowIds))).fetch();
  const totalCount = await WorkflowMgr.collection.query(Q.where('id', Q.oneOf(workflowIds))).fetchCount();
  return WorkflowMgr.getFullDataForWorkFlows(items, totalCount, null, true);
};
const queriesGetPhotos = (workflowGuid) => [
  Q.where('path', Q.like('file://%')),
  Q.where('workflowGuid', Q.eq(workflowGuid)),
  Q.sortBy('created_at', Q.desc),
];

const SyncMgr = {
  getUnSyncInspections: async () => {
    const items = await WorkflowMgr.collection.query(Q.where('_status', Q.notEq('synced'))).fetch();
    const totalCount = await WorkflowMgr.collection.query(Q.where('_status', Q.notEq('synced'))).fetchCount();
    return WorkflowMgr.getFullDataForWorkFlows(items, totalCount);
  },

  getImagesNotSync: async (id) => {
    let queries = [Q.where('path', Q.like('file://%')), Q.sortBy('created_at', Q.asc)];
    if (id) {
      queries = [...queries, Q.where(Q.eq(id))];
    }
    const images = await FormUserAnswerQuestionImageMgr.collection.query(...queries);
    return getFilePaths(images, 'images');
  },

  // signatures
  getUnSyncSignatures: async () => {
    /**
     * only get one inspection per time
     * */
    const signatures = await SignatureImageMgr.collection
      .query(Q.and(Q.where('fileUrl', Q.eq('')), Q.where('path', Q.notEq('done'))))
      .fetch();

    const unSyncWorkflowIds = _.uniqBy(signatures, 'workflowGuid').map((item) => item.workflowGuid);

    const firstWorkflowGuid = _.get(_.first(signatures), 'workflowGuid');
    const firstWorkFlowSignatures = getFilePaths(
      signatures.filter((signature) => signature.workflowGuid === firstWorkflowGuid),
      'signatures'
    );
    return {
      firstWorkflowGuid,
      firstWorkFlowSignatures,
      unSyncWorkflowIds,
    };
  },

  // check every things have completed sync to backend
  getSyncStatus: async () => {
    const images = await FormUserAnswerQuestionImageMgr.collection.query(
      Q.where('path', Q.like('file://%')),
      Q.sortBy('created_at', Q.asc)
    );
    const workflows = await WorkflowMgr.collection.query(Q.where('_status', Q.notEq('synced'))).fetch();
    const signatures = await SignatureImageMgr.collection
      .query(Q.and(Q.where('files', Q.eq('')), Q.where('fileUrl', Q.eq(''))))
      .fetch();
    if (images.length > 0 || workflows.length > 0 || signatures.length > 0) {
      return false;
    }
    return true;
  },
  // getListSync
  getListUnSync: async () => {
    // get workflow images
    const imagesNotSync = await FormUserAnswerQuestionImageMgr.collection.query(
      Q.where('path', Q.like('file://%')),
      Q.sortBy('created_at', Q.asc)
    );
    const unSyncImageWorkflowIds = _.uniqBy(imagesNotSync, 'workflowGuid').map((item) => item.workflowGuid);
    const unSyncImageInspections = await getWorkflowByIds(unSyncImageWorkflowIds);

    // get workflow table
    const workflowNotSyncs = await WorkflowMgr.collection.query(Q.where('_status', Q.notEq('synced'))).fetch();
    const unSyncDataInspections = await WorkflowMgr.getFullDataForWorkFlows(workflowNotSyncs, workflowNotSyncs.length);
    // get workflow signatures
    const signatureNotSyncs = await SignatureImageMgr.collection.query(Q.where('path', Q.notEq('done'))).fetch();
    const unSyncSignatureWorkflowIds = _.uniqBy(signatureNotSyncs, 'workflowGuid').map((item) => item.workflowGuid);
    const unSyncSignatureInspections = await getWorkflowByIds(unSyncSignatureWorkflowIds);

    return {
      unSyncImageInspections,
      unSyncDataInspections,
      unSyncSignatureInspections,
    };
  },

  // get localdb ids
  getLocalDBIds: async () => {
    const tableNames = _.keys(TableNames);
    const localIds = {};
    await Promise.all(
      tableNames.map(async (tableName) => {
        const ids = await SyncDB.database.get(tableName).query().fetchIds();
        localIds[tableName] = ids;
        return ids;
      })
    );
    return localIds;
  },
  getUnSyncPhotosByWorkflowId: async (page, workflowGuid) => {
    const queries = queriesGetPhotos(workflowGuid);

    const listQuery = [...queries, Q.skip((page - 1) * PAGE_SIZE), Q.take(PAGE_SIZE)];
    const items = await FormUserAnswerQuestionImageMgr.collection.query(...listQuery).fetch();
    const totalCount = await FormUserAnswerQuestionImageMgr.collection.query(...queries).fetchCount();
    return {
      items: items.map((item) => item.getValue()),
      totalCount,
    };
  },
  getUnSyncSignaturesByWorkflowId: async (workflowGuid) => {
    const queries = [Q.where('path', Q.notEq('done')), Q.where('workflowGuid', Q.eq(workflowGuid))];
    const signatures = await SignatureImageMgr.collection.query(...queries).fetch();
    return signatures.map((item) => item.getValue());
  },
};

export default SyncMgr;
