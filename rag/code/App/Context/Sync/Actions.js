export const DO_SYNCHRONIZE_DB_REQUEST = 'sync/DO_SYNCHRONIZE_DB_REQUEST';
export const DO_SYNCHRONIZE_DB_SUCCESS = 'sync/DO_SYNCHRONIZE_DB_SUCCESS';
export const DO_SYNCHRONIZE_DB_FAILURE = 'sync/DO_SYNCHRONIZE_DB_FAILURE';

export const DO_SYNCHRONIZE_IMAGE_REQUEST = 'sync/DO_SYNCHRONIZE_IMAGE_REQUEST';
export const DO_SYNCHRONIZE_IMAGE_SUCCESS = 'sync/DO_SYNCHRONIZE_IMAGE_SUCCESS';
export const DO_SYNCHRONIZE_IMAGE_FAILURE = 'sync/DO_SYNCHRONIZE_IMAGE_FAILURE';

export const DO_SYNCHRONIZE_SIGNATURES_REQUEST = 'sync/DO_SYNCHRONIZE_SIGNATURES_REQUEST';
export const DO_SYNCHRONIZE_SIGNATURES_SUCCESS = 'sync/DO_SYNCHRONIZE_SIGNATURES_SUCCESS';
export const DO_SYNCHRONIZE_SIGNATURES_FAILURE = 'sync/DO_SYNCHRONIZE_SIGNATURES_FAILURE';

export const GET_LIST_UN_SYNC_REQUEST = 'sync/GET_LIST_UN_SYNC_REQUEST';
export const GET_LIST_UN_SYNC_SUCCESS = 'sync/GET_LIST_UN_SYNC_SUCCESS';
export const GET_LIST_UN_SYNC_FAILURE = 'sync/GET_LIST_UN_SYNC_FAILURE';

export const GET_UN_SYNC_PHOTOS_REQUEST = 'sync/GET_UN_SYNC_PHOTOS_REQUEST';
export const GET_UN_SYNC_PHOTOS_SUCCESS = 'sync/GET_UN_SYNC_PHOTOS_SUCCESS';
export const GET_UN_SYNC_PHOTOS_FAILURE = 'sync/GET_UN_SYNC_PHOTOS_FAILURE';

export const GET_UN_SYNC_SIGNATURES_REQUEST = 'sync/GET_UN_SYNC_SIGNATURES_REQUEST';
export const GET_UN_SYNC_SIGNATURES_SUCCESS = 'sync/GET_UN_SYNC_SIGNATURES_SUCCESS';
export const GET_UN_SYNC_SIGNATURES_FAILURE = 'sync/GET_UN_SYNC_SIGNATURES_FAILURE';

export const SET_LOCK_SYNC = 'sync/SET_LOCK_SYNC';
export const CHANGE_CONNECTION_TYPE = 'sync/CHANGE_CONNECTION_TYPE';
export const SET_IS_LINKAGE = 'sync/SET_IS_LINKAGE';
export const SET_IN_SYNC_PROGRESS = 'sync/SET_IN_SYNC_PROGRESS';

export const GET_LOCAL_DB_IDS_REQUEST = 'sync/GET_LOCAL_DB_IDS_REQUEST';
export const GET_LOCAL_DB_IDS_SUCCESS = 'sync/GET_LOCAL_DB_IDS_SUCCESS';
export const GET_LOCAL_DB_IDS_FAILURE = 'sync/GET_LOCAL_DB_IDS_FAILURE';
export const RESET_SYNC_PHOTOS_AND_SIGNATURES = 'sync/RESET_SYNC_PHOTOS_AND_SIGNATURES';
export const PATCH_UNSYNC_IMAGES_REQUEST = 'sync/PATCH_UNSYNC_IMAGES_REQUEST';
export const PATCH_UNSYNC_IMAGES_SUCCESS = 'sync/PATCH_UNSYNC_IMAGES_SUCCESS';
export const PATCH_UNSYNC_IMAGES_FAILURE = 'sync/PATCH_UNSYNC_IMAGES_FAILURE';

export const SEND_LOCAL_DB_TO_SERVER_REQUEST = 'sync/SEND_LOCAL_DB_TO_SERVER_REQUEST';
export const SEND_LOCAL_DB_TO_SERVER_SUCCESS = 'sync/SEND_LOCAL_DB_TO_SERVER_SUCCESS';
export const SEND_LOCAL_DB_TO_SERVER_FAILURE = 'sync/SEND_LOCAL_DB_TO_SERVER_FAILURE';

export const setLockSync = (payload) => ({
  type: SET_LOCK_SYNC,
  payload,
});

export const setInSyncProgress = (payload) => ({
  type: SET_IN_SYNC_PROGRESS,
  payload,
});

export const doSynchronizeDBRequest = (payload) => ({
  type: DO_SYNCHRONIZE_DB_REQUEST,
  payload,
});

export const doSynchronizeDBSuccess = (payload) => ({
  type: DO_SYNCHRONIZE_DB_SUCCESS,
  payload,
});

export const doSynchronizeDBFailure = (payload) => ({
  type: DO_SYNCHRONIZE_DB_FAILURE,
  payload,
});

export const doSynchronizeImageRequest = (payload) => ({
  type: DO_SYNCHRONIZE_IMAGE_REQUEST,
  payload,
});

export const doSynchronizeImageSuccess = (payload) => ({
  type: DO_SYNCHRONIZE_IMAGE_SUCCESS,
  payload,
});

export const doSynchronizeImageFailure = (payload) => ({
  type: DO_SYNCHRONIZE_IMAGE_FAILURE,
  payload,
});

export const doSynchronizeSignatureRequest = (payload) => ({
  type: DO_SYNCHRONIZE_SIGNATURES_REQUEST,
  payload,
});

export const doSynchronizeSignatureSuccess = (payload) => ({
  type: DO_SYNCHRONIZE_SIGNATURES_SUCCESS,
  payload,
});

export const doSynchronizeSignatureFailure = (payload) => ({
  type: DO_SYNCHRONIZE_SIGNATURES_FAILURE,
  payload,
});

export const getListUnSyncRequest = (payload) => ({
  type: GET_LIST_UN_SYNC_REQUEST,
  payload,
});

export const getListUnSyncSuccess = (payload) => ({
  type: GET_LIST_UN_SYNC_SUCCESS,
  payload,
});

export const getListUnSyncFailure = (payload) => ({
  type: GET_LIST_UN_SYNC_FAILURE,
  payload,
});

export const changeConnectionTypeRequest = (payload) => ({
  type: CHANGE_CONNECTION_TYPE,
  payload,
});

export const setIsLinkageRequest = (payload) => ({
  type: SET_IS_LINKAGE,
  payload,
});

export const getLocalDBIdsRequest = (payload) => ({
  type: GET_LOCAL_DB_IDS_REQUEST,
  payload,
});

export const getLocalDBIdsSuccess = (payload) => ({
  type: GET_LOCAL_DB_IDS_SUCCESS,
  payload,
});

export const getLocalDBIdsFailure = (payload) => ({
  type: GET_LOCAL_DB_IDS_FAILURE,
  payload,
});

export const getUnSyncPhotosRequest = (payload) => ({
  type: GET_UN_SYNC_PHOTOS_REQUEST,
  payload,
});

export const getUnSyncPhotosSuccess = (payload) => ({
  type: GET_UN_SYNC_PHOTOS_SUCCESS,
  payload,
});

export const getUnSyncPhotosFailure = (payload) => ({
  type: GET_UN_SYNC_PHOTOS_FAILURE,
  payload,
});

export const getUnSyncSignaturesRequest = (payload) => ({
  type: GET_UN_SYNC_SIGNATURES_REQUEST,
  payload,
});

export const getUnSyncSignaturesSuccess = (payload) => ({
  type: GET_UN_SYNC_SIGNATURES_SUCCESS,
  payload,
});

export const getUnSyncSignaturesFailure = (payload) => ({
  type: GET_UN_SYNC_SIGNATURES_FAILURE,
  payload,
});

export const resetSyncPhotosAndSignaturesRequest = (payload) => ({
  type: RESET_SYNC_PHOTOS_AND_SIGNATURES,
  payload,
});

export const patchUnsyncImagesImagesRequest = (payload) => ({
  type: PATCH_UNSYNC_IMAGES_REQUEST,
  payload,
});

export const patchUnsyncImagesImagesSuccess = (payload) => ({
  type: PATCH_UNSYNC_IMAGES_SUCCESS,
  payload,
});

export const patchUnsyncImagesImagesFailure = (payload) => ({
  type: PATCH_UNSYNC_IMAGES_FAILURE,
  payload,
});

export const sendLocalDBToServerRequest = (payload) => ({
  type: SEND_LOCAL_DB_TO_SERVER_REQUEST,
  payload,
});

export const sendLocalDBToServerSuccess = (payload) => ({
  type: SEND_LOCAL_DB_TO_SERVER_SUCCESS,
  payload,
});

export const sendLocalDBToServerFailure = (payload) => ({
  type: SEND_LOCAL_DB_TO_SERVER_FAILURE,
  payload,
});
