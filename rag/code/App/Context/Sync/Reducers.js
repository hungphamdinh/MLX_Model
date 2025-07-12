import _ from 'lodash';
import {
  CHANGE_CONNECTION_TYPE,
  DO_SYNCHRONIZE_DB_FAILURE,
  DO_SYNCHRONIZE_DB_REQUEST,
  DO_SYNCHRONIZE_DB_SUCCESS,
  DO_SYNCHRONIZE_IMAGE_FAILURE,
  DO_SYNCHRONIZE_IMAGE_REQUEST,
  DO_SYNCHRONIZE_IMAGE_SUCCESS,
  DO_SYNCHRONIZE_SIGNATURES_FAILURE,
  DO_SYNCHRONIZE_SIGNATURES_REQUEST,
  DO_SYNCHRONIZE_SIGNATURES_SUCCESS,
  GET_LIST_UN_SYNC_FAILURE,
  GET_LIST_UN_SYNC_REQUEST,
  GET_LIST_UN_SYNC_SUCCESS,
  SET_LOCK_SYNC,
  SET_IS_LINKAGE,
  SET_IN_SYNC_PROGRESS,
  GET_UN_SYNC_PHOTOS_REQUEST,
  GET_UN_SYNC_PHOTOS_SUCCESS,
  GET_UN_SYNC_SIGNATURES_SUCCESS,
  GET_UN_SYNC_SIGNATURES_REQUEST,
  GET_UN_SYNC_SIGNATURES_FAILURE,
  RESET_SYNC_PHOTOS_AND_SIGNATURES,
  SEND_LOCAL_DB_TO_SERVER_REQUEST,
  SEND_LOCAL_DB_TO_SERVER_SUCCESS,
  SEND_LOCAL_DB_TO_SERVER_FAILURE,
} from './Actions';
import ListModel from '../Model/ListModel';
import { SyncState } from '../../Config/Constants';

function handleSyncMediaSuccess(workflows, unSyncMedias, syncedResults) {
  // update for sync image, signature list
  workflows.forEach((workflow) => {
    const totalSync = _.filter(syncedResults, (item) => item.workflowGuid === workflow.id).length;
    workflow.totalMediaSynced = (workflow.totalMediaSynced || 0) + totalSync;
  });

  // update for detail sync screen
  const syncedGuids = _.map(syncedResults, (image) => image.guid);
  unSyncMedias.forEach((item) => {
    if (syncedGuids.includes(item.guid)) {
      item.synced = true;
    }
  });

  return { workflows, unSyncMedias };
}

export const INITIAL_STATE = {
  synchronizeLog: null,
  isFirstPull: false,
  unSyncDataInspections: new ListModel(),
  unSyncImageInspections: new ListModel(),
  unSyncSignatureInspections: new ListModel(),
  isPullWithMigrations: null,
  syncingImageWorkflowIds: [],
  syncingSignatureWorkflowIds: [],
  error: undefined,
  lock: false,
  connectionType: 'wifi',
  inSyncProgress: false,
  isLinkage: false,
  isLoading: false,
  unSyncPhotos: new ListModel(),
  unSyncSignatures: [],
  syncingImages: [],
  syncingSignatures: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case DO_SYNCHRONIZE_DB_REQUEST: {
      const { isFirstPull, isPullWithMigrations } = action.payload;
      const { unSyncDataInspections } = state;
      unSyncDataInspections.data.forEach((item) => {
        item.syncState = SyncState.SYNCING;
      });
      return {
        ...state,
        isFirstPull,
        isLoading: isFirstPull || isPullWithMigrations,
        synchronizeLog: null,
        isSyncingDB: true,
        isPullWithMigrations,
        unSyncDataInspections: _.cloneDeep(unSyncDataInspections),
      };
    }

    case DO_SYNCHRONIZE_DB_SUCCESS: {
      const { unSyncDataInspections } = state;
      unSyncDataInspections.data.forEach((item) => {
        item.syncState = SyncState.SYNCED;
      });
      return {
        ...state,
        isFirstPull: false,
        isLoading: false,
        isPullWithMigrations: false,
        unSyncDataInspections: _.cloneDeep(unSyncDataInspections),
        synchronizeLog: action.payload,
        isSyncingDB: false,
        inSyncProgress: false,
      };
    }

    case DO_SYNCHRONIZE_DB_FAILURE:
      return {
        ...state,
        isFirstPull: false,
        isPullWithMigrations: false,
        error: action.payload,
        isSyncingDB: false,
        inSyncProgress: false,
      };
    case DO_SYNCHRONIZE_IMAGE_REQUEST: {
      const { payload } = action;

      return {
        ...state,
        syncingImageWorkflowIds: payload.syncingImageWorkflowIds,
        syncingImages: payload.syncingImages,
        isSyncingImage: true,
      };
    }

    case DO_SYNCHRONIZE_IMAGE_SUCCESS: {
      // remove success sync image from unSyncImageInspections
      const { syncingImages, isComplete } = action.payload;
      const { unSyncImageInspections, unSyncPhotos } = state;
      const { workflows, unSyncMedias } = handleSyncMediaSuccess(
        unSyncImageInspections.data,
        unSyncPhotos.data,
        syncingImages
      );
      unSyncImageInspections.updateData(workflows);
      unSyncPhotos.updateData(unSyncMedias);
      return {
        ...state,
        syncingImageWorkflowIds: isComplete ? [] : state.syncingImageWorkflowIds,
        unSyncImageInspections: _.cloneDeep(unSyncImageInspections),
        isSyncingImage: false,
        unSyncPhotos: _.cloneDeep(unSyncPhotos),
        syncingImages: [],
      };
    }

    case DO_SYNCHRONIZE_IMAGE_FAILURE:
      return {
        ...state,
        error: action.payload,
        isSyncingImage: false,
        syncingImages: [],
      };

    // Signatures
    case DO_SYNCHRONIZE_SIGNATURES_REQUEST: {
      const { payload } = action;
      return {
        ...state,
        syncingSignatureWorkflowIds: payload.syncingSignatureWorkflowIds,
        isSyncingSignature: true,
        syncingSignatures: payload.syncingSignatures,
      };
    }

    case DO_SYNCHRONIZE_SIGNATURES_SUCCESS: {
      const { syncingSignatures, isComplete } = action.payload;
      const { unSyncSignatureInspections, unSyncSignatures } = state;

      const { workflows, unSyncMedias } = handleSyncMediaSuccess(
        unSyncSignatureInspections.data,
        unSyncSignatures,
        syncingSignatures
      );
      unSyncSignatureInspections.updateData(workflows);
      return {
        ...state,
        syncingSignatureWorkflowIds: isComplete ? [] : state.syncingSignatureWorkflowIds,
        unSyncSignatureInspections: _.cloneDeep(unSyncSignatureInspections),
        isSyncingSignature: false,
        unSyncSignatures: _.cloneDeep(unSyncMedias),
        syncingSignatures: [],
      };
    }

    case DO_SYNCHRONIZE_SIGNATURES_FAILURE:
      return {
        ...state,
        error: action.payload,
        isSyncingSignature: false,
        syncingSignatures: [],
      };

    // team forms
    case GET_LIST_UN_SYNC_REQUEST: {
      const { unSyncImageInspections, unSyncDataInspections, unSyncSignatureInspections } = state;
      unSyncImageInspections.setPage(1);
      unSyncDataInspections.setPage(1);
      unSyncSignatureInspections.setPage(1);

      return {
        ...state,
        unSyncImageInspections: _.cloneDeep(unSyncImageInspections),
        unSyncDataInspections: _.cloneDeep(unSyncDataInspections),
        unSyncSignatureInspections: _.cloneDeep(unSyncSignatureInspections),
      };
    }

    case GET_LIST_UN_SYNC_SUCCESS: {
      const { payload } = action;
      const { unSyncImageInspections, unSyncDataInspections, unSyncSignatureInspections } = state;
      unSyncImageInspections.setData(payload.unSyncImageInspections);
      unSyncDataInspections.setData(payload.unSyncDataInspections);
      unSyncSignatureInspections.setData(payload.unSyncSignatureInspections);

      return {
        ...state,
        unSyncImageInspections: _.cloneDeep(unSyncImageInspections),
        unSyncDataInspections: _.cloneDeep(unSyncDataInspections),
        unSyncSignatureInspections: _.cloneDeep(unSyncSignatureInspections),
      };
    }

    case GET_LIST_UN_SYNC_FAILURE: {
      const { unSyncImageInspections, unSyncDataInspections, unSyncSignatureInspections } = state;
      unSyncImageInspections.setData(null);
      unSyncDataInspections.setData(null);
      unSyncSignatureInspections.setData(null);

      return {
        ...state,
        unSyncImageInspections: _.cloneDeep(unSyncImageInspections),
        unSyncDataInspections: _.cloneDeep(unSyncDataInspections),
        unSyncSignatureInspections: _.cloneDeep(unSyncSignatureInspections),
      };
    }

    case GET_UN_SYNC_PHOTOS_REQUEST: {
      const { unSyncPhotos } = state;
      unSyncPhotos.setPage(action.payload.page);

      return {
        ...state,
        unSyncPhotos: _.cloneDeep(unSyncPhotos),
      };
    }

    case GET_UN_SYNC_PHOTOS_SUCCESS: {
      const { unSyncPhotos } = state;
      unSyncPhotos.setData(action.payload);
      return {
        ...state,
        unSyncPhotos: _.cloneDeep(unSyncPhotos),
      };
    }

    case GET_UN_SYNC_SIGNATURES_REQUEST: {
      return {
        ...state,
        unSyncSignatures: '',
      };
    }
    case GET_UN_SYNC_SIGNATURES_SUCCESS: {
      return {
        ...state,
        unSyncSignatures: action.payload,
      };
    }

    case GET_UN_SYNC_SIGNATURES_FAILURE: {
      return {
        ...state,
      };
    }
    case SET_LOCK_SYNC: {
      return {
        ...state,
        lock: action.payload,
      };
    }

    case CHANGE_CONNECTION_TYPE: {
      return {
        ...state,
        connectionType: action.payload,
      };
    }
    case SET_IS_LINKAGE: {
      return {
        ...state,
        isLinkage: action.payload,
      };
    }

    case SET_IN_SYNC_PROGRESS: {
      return {
        ...state,
        inSyncProgress: action.payload,
      };
    }

    case RESET_SYNC_PHOTOS_AND_SIGNATURES: {
      return {
        ...state,
        unSyncPhotos: new ListModel(),
        unSyncSignatures: [],
      };
    }

    case SEND_LOCAL_DB_TO_SERVER_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case SEND_LOCAL_DB_TO_SERVER_SUCCESS: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case SEND_LOCAL_DB_TO_SERVER_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    default:
      return state;
  }
};
