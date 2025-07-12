import { generateAction } from '../../Utils/AppAction';

export const DOWNLOAD_AND_VIEW_DOCUMENT_REQUEST = 'team/DOWNLOAD_AND_VIEW_DOCUMENT_REQUEST';
export const DOWNLOAD_AND_VIEW_DOCUMENT_SUCCESS = 'team/DOWNLOAD_AND_VIEW_DOCUMENT_SUCCESS';
export const DOWNLOAD_AND_VIEW_DOCUMENT_FAILURE = 'team/DOWNLOAD_AND_VIEW_DOCUMENT_FAILURE';

export const UPLOAD_FILES_REQUEST = 'file/UPLOAD_FILES_REQUEST';
export const UPLOAD_FILES_SUCCESS = 'file/UPLOAD_FILES_SUCCESS';
export const UPLOAD_FILES_FAILURE = 'file/UPLOAD_FILES_FAILURE';

export const DELETE_FILE = generateAction('FILE/DELETE_FILE');
export const DOWNLOAD_IMAGE_REQUEST = 'file/DOWNLOAD_IMAGE_REQUEST';
export const DOWNLOAD_IMAGE_SUCCESS = 'file/DOWNLOAD_IMAGE_SUCCESS';
export const DOWNLOAD_IMAGE_FAILURE = 'file/DOWNLOAD_IMAGE_FAILURE';

export const GET_FILE_REFERENCE_REQUEST = 'file/GET_FILE_REFERENCE_REQUEST';
export const GET_FILE_REFERENCE_SUCCESS = 'file/GET_FILE_REFERENCE_SUCCESS';
export const GET_FILE_REFERENCE_FAILURE = 'file/GET_FILE_REFERENCE_FAILURE';

export const GET_FILE_BY_GUID_REQUEST = 'file/GET_FILE_BY_GUID_REQUEST';
export const GET_FILE_BY_GUID_SUCCESS = 'file/GET_FILE_BY_GUID_SUCCESS';
export const GET_FILE_BY_GUID_FAILURE = 'file/GET_FILE_BY_GUID_FAILURE';
export const GET_FILE_BY_REFERENCE_ID_REQUEST = 'file/GET_FILE_BY_REFERENCE_ID_REQUEST';
export const GET_FILE_BY_REFERENCE_ID_SUCCESS = 'file/GET_FILE_BY_REFERENCE_ID_SUCCESS';
export const GET_FILE_BY_REFERENCE_ID_FAILURE = 'file/GET_FILE_BY_REFERENCE_ID_FAILURE';

export const GET_FILE_BY_REFERENCE_ID_AND_MODULE_NAMES_REQUEST =
  'file/GET_FILE_BY_REFERENCE_ID_AND_MODULE_NAMES_REQUEST';
export const GET_FILE_BY_REFERENCE_ID_AND_MODULE_NAMES_SUCCESS =
  'file/GET_FILE_BY_REFERENCE_ID_AND_MODULE_NAMES_SUCCESS';
export const GET_FILE_BY_REFERENCE_ID_AND_MODULE_NAMES_FAILURE =
  'file/GET_FILE_BY_REFERENCE_ID_AND_MODULE_NAMES_FAILURE';

export const RESET_FILES_REQUEST = 'file/RESET_FILES_REQUEST';

export const downloadAndViewDocumentRequest = (payload) => ({
  type: DOWNLOAD_AND_VIEW_DOCUMENT_REQUEST,
  payload,
});

export const downloadAndViewDocumentSuccess = (payload) => ({
  type: DOWNLOAD_AND_VIEW_DOCUMENT_SUCCESS,
  payload,
});

export const uploadFilesRequest = (payload) => ({
  type: UPLOAD_FILES_REQUEST,
  payload,
});

export const uploadFilesSuccess = (payload) => ({
  type: UPLOAD_FILES_SUCCESS,
  payload,
});

export const uploadFilesFailure = (payload) => ({
  type: UPLOAD_FILES_FAILURE,
  payload,
});

export const downloadAndViewDocumentFailure = (payload) => ({
  type: DOWNLOAD_AND_VIEW_DOCUMENT_FAILURE,
  payload,
});

export const deleteFileRequest = (payload) => ({
  type: DELETE_FILE_REQUEST,
  payload,
});

export const deleteFileSuccess = (payload) => ({
  type: DELETE_FILE_SUCCESS,
  payload,
});

export const deleteFileFailure = (payload) => ({
  type: DELETE_FILE_FAILURE,
  payload,
});

export const downloadImageFailure = (payload) => ({
  type: DOWNLOAD_IMAGE_FAILURE,
  payload,
});
export const downloadImageRequest = (payload) => ({
  type: DOWNLOAD_IMAGE_REQUEST,
  payload,
});

export const downloadImageSuccess = (payload) => ({
  type: DOWNLOAD_IMAGE_SUCCESS,
  payload,
});

export const getFileReferenceRequest = (payload) => ({
  type: GET_FILE_REFERENCE_REQUEST,
  payload,
});

export const getFileReferenceSuccess = (payload) => ({
  type: GET_FILE_REFERENCE_SUCCESS,
  payload,
});

export const getFileReferenceFailure = (payload) => ({
  type: GET_FILE_REFERENCE_FAILURE,
  payload,
});

export const getFileByGuidRequest = (payload) => ({
  type: GET_FILE_BY_GUID_REQUEST,
  payload,
});

export const getFileByGuidSuccess = (payload) => ({
  type: GET_FILE_BY_GUID_SUCCESS,
  payload,
});

export const getFileByGuidFailure = (payload) => ({
  type: GET_FILE_BY_GUID_FAILURE,
  payload,
});

export const getFileByReferenceIdRequest = (payload) => ({
  type: GET_FILE_BY_REFERENCE_ID_REQUEST,
  payload,
});

export const getFileByReferenceIdSuccess = (payload) => ({
  type: GET_FILE_BY_REFERENCE_ID_SUCCESS,
  payload,
});

export const getFileByReferenceIdFailure = (payload) => ({
  type: GET_FILE_BY_REFERENCE_ID_FAILURE,
  payload,
});

export const getByReferenceIdAndModuleNamesRequest = (payload) => ({
  type: GET_FILE_BY_REFERENCE_ID_AND_MODULE_NAMES_REQUEST,
  payload,
});

export const getByReferenceIdAndModuleNamesSuccess = (payload) => ({
  type: GET_FILE_BY_REFERENCE_ID_AND_MODULE_NAMES_SUCCESS,
  payload,
});

export const getByReferenceIdAndModuleNamesFailure = (payload) => ({
  type: GET_FILE_BY_REFERENCE_ID_AND_MODULE_NAMES_FAILURE,
  payload,
});

export const resetFilesRequest = () => ({ type: RESET_FILES_REQUEST });
