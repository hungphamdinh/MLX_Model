import { generateAction } from '../../Utils/AppAction';

export const ADD_FB = generateAction('feedback/ADD_FB');
export const EDIT_FB = generateAction('feedback/EDIT_FB');

export const GET_LIST_FB_REQUEST = 'feedback/GET_LIST_FB_REQUEST';
export const GET_LIST_FB_SUCCESS = 'feedback/GET_LIST_FB_SUCCESS';
export const GET_LIST_FB_FAILURE = 'feedback/GET_LIST_FB_FAILURE';

export const GET_LIST_FB_QR_REQUEST = 'feedback/GET_LIST_FB_QR_REQUEST';
export const GET_LIST_FB_QR_SUCCESS = 'feedback/GET_LIST_FB_QR_SUCCESS';
export const GET_LIST_FB_QR_FAILURE = 'feedback/GET_LIST_FB_QR_FAILURE';

export const ADD_QUICK_JR_REQUEST = 'feedback/ADD_QUICK_JR_REQUEST';
export const ADD_QUICK_JR_SUCCESS = 'feedback/ADD_QUICK_JR_SUCCESS';
export const ADD_QUICK_JR_FAILURE = 'feedback/ADD_QUICK_JR_FAILURE';

export const EDIT_QR_FB_REQUEST = 'feedback/EDIT_QR_FB_REQUEST';
export const EDIT_QR_FB_SUCCESS = 'feedback/EDIT_QR_FB_SUCCESS';
export const EDIT_QR_FB_FAILURE = 'feedback/EDIT_QR_FB_FAILURE';

export const DETAIL_FB_REQUEST = 'feedback/DETAIL_FB_REQUEST';
export const DETAIL_FB_SUCCESS = 'feedback/DETAIL_FB_SUCCESS';
export const DETAIL_FB_FAILURE = 'feedback/DETAIL_FB_FAILURE';

export const DETAIL_FB_QR_REQUEST = 'feedback/DETAIL_FB_QR_REQUEST';
export const DETAIL_FB_QR_SUCCESS = 'feedback/DETAIL_FB_QR_SUCCESS';
export const DETAIL_FB_QR_FAILURE = 'feedback/DETAIL_FB_QR_FAILURE';

export const GET_GROUP_CATEGORIES_REQUEST = 'feedback/GET_GROUP_CATEGORIES_REQUEST';
export const GET_GROUP_CATEGORIES_SUCCESS = 'feedback/GET_GROUP_CATEGORIES_SUCCESS';
export const GET_GROUP_CATEGORIES_FAILURE = 'feedback/GET_GROUP_CATEGORIES_FAILURE';

export const GET_TYPES_REQUEST = 'feedback/GET_TYPES_REQUEST';
export const GET_TYPES_SUCCESS = 'feedback/GET_TYPES_SUCCESS';
export const GET_TYPES_FAILURE = 'feedback/GET_TYPES_FAILURE';

export const GET_AREAS_REQUEST = 'feedback/GET_AREAS_REQUEST';
export const GET_AREAS_SUCCESS = 'feedback/GET_AREAS_SUCCESS';
export const GET_AREAS_FAILURE = 'feedback/GET_AREAS_FAILURE';

export const GET_CATEGORIES_REQUEST = 'feedback/GET_CATEGORIES_REQUEST';
export const GET_CATEGORIES_SUCCESS = 'feedback/GET_CATEGORIES_SUCCESS';
export const GET_CATEGORIES_FAILURE = 'feedback/GET_CATEGORIES_FAILURE';

export const GET_SOURCES_REQUEST = 'feedback/GET_SOURCES_REQUEST';
export const GET_SOURCES_SUCCESS = 'feedback/GET_SOURCES_SUCCESS';
export const GET_SOURCES_FAILURE = 'feedback/GET_SOURCES_FAILURE';

export const GET_QUICK_JR_SETTING_REQUEST = 'feedback/GET_QUICK_JR_SETTING_REQUEST';
export const GET_QUICK_JR_SETTING_SUCCESS = 'feedback/GET_QUICK_JR_SETTING_SUCCESS';
export const GET_QUICK_JR_SETTING_FAILURE = 'feedback/GET_QUICK_JR_SETTING_FAILURE';

export const GET_SLA_SETTINGS_REQUEST = 'feedback/GET_SLA_SETTINGS_REQUEST';
export const GET_SLA_SETTINGS_SUCCESS = 'feedback/GET_SLA_SETTINGS_SUCCESS';
export const GET_SLA_SETTINGS_FAILURE = 'feedback/GET_SLA_SETTINGS_FAILURE';

export const GET_FEEDBACK_STATUS_REQUEST = 'feedback/GET_FEEDBACK_STATUS_REQUEST';
export const GET_FEEDBACK_STATUS_SUCCESS = 'feedback/GET_FEEDBACK_STATUS_SUCCESS';
export const GET_FEEDBACK_STATUS_FAILURE = 'feedback/GET_FEEDBACK_STATUS_FAILURE';

export const GET_LOCATIONS_REQUEST = 'feedback/GET_LOCATIONS_REQUEST';
export const GET_LOCATIONS_SUCCESS = 'feedback/GET_LOCATIONS_SUCCESS';
export const GET_LOCATIONS_FAILURE = 'feedback/GET_LOCATIONS_FAILURE';

export const getFeedbackStatusRequest = (payload) => ({
  type: GET_FEEDBACK_STATUS_REQUEST,
  payload,
});

export const getFeedbackStatusSuccess = (payload) => ({
  type: GET_FEEDBACK_STATUS_SUCCESS,
  payload,
});

export const getFeedbackStatusFailure = (payload) => ({
  type: GET_FEEDBACK_STATUS_FAILURE,
  payload,
});

export const uploadFileSignatureRequest = (payload) => ({
  type: UPLOAD_FILE_SIGNATURE_JR_REQUEST,
  payload,
});

export const uploadFileSignatureSuccess = (payload) => ({
  type: UPLOAD_FILE_SIGNATURE_JR_SUCCESS,
  payload,
});

export const uploadFileSignatureFailure = (payload) => ({
  type: UPLOAD_FILE_SIGNATURE_JR_FAILURE,
  payload,
});

export const setVisiblePreviewModalRequest = (payload) => ({
  type: SET_VISIBLE_PREVIEW_MODAL,
  payload,
});

export const getListFBRequest = (payload) => ({
  type: GET_LIST_FB_REQUEST,
  payload,
});

export const getListFBSuccess = (payload) => ({
  type: GET_LIST_FB_SUCCESS,
  payload,
});

export const getListFBFailure = (payload) => ({
  type: GET_LIST_FB_FAILURE,
  payload,
});

export const getListQRFeedbackRequest = (payload) => ({
  type: GET_LIST_FB_QR_REQUEST,
  payload,
});

export const getListQRFeedbackSuccess = (payload) => ({
  type: GET_LIST_FB_QR_SUCCESS,
  payload,
});

export const getListQRFeedbackFailure = (payload) => ({
  type: GET_LIST_FB_QR_FAILURE,
  payload,
});

export const getSLASettingRequest = (payload) => ({
  type: GET_SLA_SETTINGS_REQUEST,
  payload,
});

export const getSLASettingSuccess = (payload) => ({
  type: GET_SLA_SETTINGS_SUCCESS,
  payload,
});

export const getSLASettingFailure = (payload) => ({
  type: GET_SLA_SETTINGS_FAILURE,
  payload,
});

export const getMyJRRequest = (payload) => ({
  type: GET_MY_JR_REQUEST,
  payload,
});

export const getMyJRSuccess = (payload) => ({
  type: GET_MY_JR_SUCCESS,
  payload,
});

export const getMyJRFailure = (payload) => ({
  type: GET_MY_JR_FAILURE,
  payload,
});

export const editQrFBRequest = (payload) => ({
  type: EDIT_QR_FB_REQUEST,
  payload,
});

export const editQrFBSuccess = (payload) => ({
  type: EDIT_QR_FB_SUCCESS,
  payload,
});

export const editQrFBFailure = (payload) => ({
  type: EDIT_QR_FB_FAILURE,
  payload,
});

export const detailFBRequest = (payload) => ({
  type: DETAIL_FB_REQUEST,
  payload,
});

export const detailFBSuccess = (payload) => ({
  type: DETAIL_FB_SUCCESS,
  payload,
});

export const detailFBFailure = (payload) => ({
  type: DETAIL_FB_FAILURE,
  payload,
});

export const detailQRFeedbackRequest = (payload) => ({
  type: DETAIL_FB_QR_REQUEST,
  payload,
});

export const detailQRFeedbackSuccess = (payload) => ({
  type: DETAIL_FB_QR_SUCCESS,
  payload,
});

export const detailQRFeedbackFailure = (payload) => ({
  type: DETAIL_FB_QR_FAILURE,
  payload,
});

export const getSourceRequest = (payload) => ({
  type: GET_SOURCES_REQUEST,
  payload,
});

export const getSourceSuccess = (payload) => ({
  type: GET_SOURCES_SUCCESS,
  payload,
});

export const getSourceFailure = (payload) => ({
  type: GET_SOURCES_FAILURE,
  payload,
});

export const getQuickJRSettingRequest = (payload) => ({
  type: GET_QUICK_JR_SETTING_REQUEST,
  payload,
});

export const getQuickJRSettingSuccess = (payload) => ({
  type: GET_QUICK_JR_SETTING_SUCCESS,
  payload,
});

export const getQuickJRSettingFailure = (payload) => ({
  type: GET_QUICK_JR_SETTING_FAILURE,
  payload,
});

export const getTypesRequest = (payload) => ({
  type: GET_TYPES_REQUEST,
  payload,
});

export const getTypesSuccess = (payload) => ({
  type: GET_TYPES_SUCCESS,
  payload,
});

export const getTypesFailure = (payload) => ({
  type: GET_TYPES_FAILURE,
  payload,
});

export const getAreasRequest = (payload) => ({
  type: GET_AREAS_REQUEST,
  payload,
});

export const getAreasSuccess = (payload) => ({
  type: GET_AREAS_SUCCESS,
  payload,
});

export const getAreasFailure = (payload) => ({
  type: GET_AREAS_FAILURE,
  payload,
});

export const getCategoriesRequest = (payload) => ({
  type: GET_CATEGORIES_REQUEST,
  payload,
});

export const getCategoriesSuccess = (payload) => ({
  type: GET_CATEGORIES_SUCCESS,
  payload,
});

export const getCategoriesFailure = (payload) => ({
  type: GET_CATEGORIES_FAILURE,
  payload,
});

export const getSubCategoriesRequest = (payload) => ({
  type: GET_SUB_CATEGORIES_REQUEST,
  payload,
});

export const getSubCategoriesSuccess = (payload) => ({
  type: GET_SUB_CATEGORIES_SUCCESS,
  payload,
});

export const getSubCategoriesFailure = (payload) => ({
  type: GET_SUB_CATEGORIES_FAILURE,
  payload,
});

export const getLocationsRequest = (payload) => ({
  type: GET_LOCATIONS_REQUEST,
  payload,
});

export const getLocationsSuccess = (payload) => ({
  type: GET_LOCATIONS_SUCCESS,
  payload,
});

export const getLocationsFailure = (payload) => ({
  type: GET_LOCATIONS_FAILURE,
  payload,
});

export const GET_FEEDBACK_DIVISION = generateAction('feedback/GET_FEEDBACK_DIVISION');
export const GET_QR_FEEDBACK_SETTING = generateAction('feedback/GET_QR_FEEDBACK_SETTING');
