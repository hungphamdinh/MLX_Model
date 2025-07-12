import { generateAction } from '@Utils/AppAction';

export const UPLOAD_FORM_PHOTO_REQUEST = 'inspection/UPLOAD_FORM_PHOTO_REQUEST';
export const UPLOAD_FORM_PHOTO_SUCCESS = 'inspection/UPLOAD_FORM_PHOTO_SUCCESS';
export const UPLOAD_FORM_PHOTO_FAILURE = 'inspection/UPLOAD_FORM_PHOTO_FAILURE';

export const CREATE_INSPECTION_REQUEST = 'inspection/CREATE_INSPECTION_REQUEST';
export const CREATE_INSPECTION_SUCCESS = 'inspection/CREATE_INSPECTION_SUCCESS';
export const CREATE_INSPECTION_FAILURE = 'inspection/CREATE_INSPECTION_FAILURE';

export const CREATE_ONLINE_INSPECTION_REQUEST = 'inspection/CREATE_ONLINE_INSPECTION_REQUEST';
export const CREATE_ONLINE_INSPECTION_SUCCESS = 'inspection/CREATE_ONLINE_INSPECTION_SUCCESS';
export const CREATE_ONLINE_INSPECTION_FAILURE = 'inspection/CREATE_ONLINE_INSPECTION_FAILURE';

export const UPDATE_ONLINE_INSPECTION_REQUEST = 'inspection/UPDATE_ONLINE_INSPECTION_REQUEST';
export const UPDATE_ONLINE_INSPECTION_SUCCESS = 'inspection/UPDATE_ONLINE_INSPECTION_SUCCESS';
export const UPDATE_ONLINE_INSPECTION_FAILURE = 'inspection/UPDATE_ONLINE_INSPECTION_FAILURE';

export const EXECUTE_INSPECTION_REQUEST = 'inspection/EXECUTE_INSPECTION_REQUEST';
export const EXECUTE_INSPECTION_SUCCESS = 'inspection/EXECUTE_INSPECTION_SUCCESS';
export const EXECUTE_INSPECTION_FAILURE = 'inspection/EXECUTE_INSPECTION_FAILURE';

export const CREATE_INSPECTION_LINKAGE_REQUEST = 'inspection/CREATE_INSPECTION_LINKAGE_REQUEST';
export const CREATE_INSPECTION_LINKAGE_SUCCESS = 'inspection/CREATE_INSPECTION_LINKAGE_SUCCESS';
export const CREATE_INSPECTION_LINKAGE_FAILURE = 'inspection/CREATE_INSPECTION_LINKAGE_FAILURE';

export const LINK_INSPECTION_REQUEST = 'inspection/LINK_INSPECTION_REQUEST';
export const LINK_INSPECTION_SUCCESS = 'inspection/LINK_INSPECTION_SUCCESS';
export const LINK_INSPECTION_FAILURE = 'inspection/LINK_INSPECTION_FAILURE';

export const UPDATE_INSPECTION_REQUEST = 'inspection/UPDATE_INSPECTION_REQUEST';
export const UPDATE_INSPECTION_SUCCESS = 'inspection/UPDATE_INSPECTION_SUCCESS';
export const UPDATE_INSPECTION_FAILURE = 'inspection/UPDATE_INSPECTION_FAILURE';

export const GET_INSPECTIONS_REQUEST = 'inspection/GET_INSPECTIONS_REQUEST';
export const GET_INSPECTIONS_SUCCESS = 'inspection/GET_INSPECTIONS_SUCCESS';
export const GET_INSPECTIONS_FAILURE = 'inspection/GET_INSPECTIONS_FAILURE';

export const GET_INSPECTIONS_BY_LINK_MODULE_REQUEST = 'inspection/GET_INSPECTIONS_BY_LINK_MODULE_REQUEST';
export const GET_INSPECTIONS_BY_LINK_MODULE_SUCCESS = 'inspection/GET_INSPECTIONS_BY_LINK_MODULE_SUCCESS';
export const GET_INSPECTIONS_BY_LINK_MODULE_FAILURE = 'inspection/GET_INSPECTIONS_BY_LINK_MODULE_FAILURE';

export const GET_HOME_INSPECTIONS_REQUEST = 'inspection/GET_HOME_INSPECTIONS_REQUEST';
export const GET_HOME_INSPECTIONS_SUCCESS = 'inspection/GET_HOME_INSPECTIONS_SUCCESS';
export const GET_HOME_INSPECTIONS_FAILURE = 'inspection/GET_HOME_INSPECTIONS_FAILURE';

export const GET_INSPECTIONS_DETAIL_REQUEST = 'inspection/GET_INSPECTIONS_DETAIL_REQUEST';
export const GET_INSPECTIONS_DETAIL_SUCCESS = 'inspection/GET_INSPECTIONS_DETAIL_SUCCESS';
export const GET_INSPECTIONS_DETAIL_FAILURE = 'inspection/GET_INSPECTIONS_DETAIL_FAILURE';

export const GET_INSPECTIONS_FORM_DETAIL_ONLINE_REQUEST = 'inspection/GET_INSPECTIONS_FORM_DETAIL_ONLINE_REQUEST';
export const GET_INSPECTIONS_FORM_DETAIL_ONLINE_SUCCESS = 'inspection/GET_INSPECTIONS_FORM_DETAIL_ONLINE_SUCCESS';
export const GET_INSPECTIONS_FORM_DETAIL_ONLINE_FAILURE = 'inspection/GET_INSPECTIONS_FORM_DETAIL_ONLINE_FAILURE';

export const GET_WORKFLOW_DETAIL_REQUEST = 'inspection/GET_WORKFLOW_DETAIL_REQUEST';
export const GET_WORKFLOW_DETAIL_SUCCESS = 'inspection/GET_WORKFLOW_DETAIL_SUCCESS';
export const GET_WORKFLOW_DETAIL_FAILURE = 'inspection/GET_WORKFLOW_DETAIL_FAILURE';

export const GET_INSPECTIONS_ONLINE_REQUEST = 'inspection/GET_INSPECTIONS_ONLINE_REQUEST';
export const GET_INSPECTIONS_ONLINE_SUCCESS = 'inspection/GET_INSPECTIONS_ONLINE_SUCCESS';
export const GET_INSPECTIONS_ONLINE_FAILURE = 'inspection/GET_INSPECTIONS_ONLINE_FAILURE';

export const GET_AUDIT_LOGS_REQUEST = 'inspection/GET_AUDIT_LOGS_REQUEST';
export const GET_AUDIT_LOGS_SUCCESS = 'inspection/GET_AUDIT_LOGS_SUCCESS';
export const GET_AUDIT_LOGS_FAILURE = 'inspection/GET_AUDIT_LOGS_FAILURE';

export const GET_INSPECTIONS_BY_PROPERTY_REQUEST = 'inspection/GET_INSPECTIONS_BY_PROPERTY_REQUEST';
export const GET_INSPECTIONS_BY_PROPERTY_SUCCESS = 'inspection/GET_INSPECTIONS_BY_PROPERTY_SUCCESS';
export const GET_INSPECTIONS_BY_PROPERTY_FAILURE = 'inspection/GET_INSPECTIONS_BY_PROPERTY_FAILURE';

export const GET_INSPECTION_FORM_DETAIL_REQUEST = 'inspection/GET_INSPECTION_FORM_DETAIL_REQUEST';
export const GET_INSPECTION_FORM_DETAIL_SUCCESS = 'inspection/GET_INSPECTION_FORM_DETAIL_SUCCESS';
export const GET_INSPECTION_FORM_DETAIL_FAILURE = 'inspection/GET_INSPECTION_FORM_DETAIL_FAILURE';

export const SAVE_INSPECTION_REQUEST = 'inspection/SAVE_INSPECTION_REQUEST';
export const SAVE_INSPECTION_SUCCESS = 'inspection/SAVE_INSPECTION_SUCCESS';
export const SAVE_INSPECTION_FAILURE = 'inspection/SAVE_INSPECTION_FAILURE';

export const GET_STATUS_CONFIGS_REQUEST = 'inspection/GET_STATUS_CONFIGS_REQUEST';
export const GET_STATUS_CONFIGS_SUCCESS = 'inspection/GET_STATUS_CONFIGS_SUCCESS';
export const GET_STATUS_CONFIGS_FAILURE = 'inspection/GET_STATUS_CONFIGS_FAILURE';

export const UPLOAD_INSPECTION_SIGNATURES_REQUEST = 'inspection/UPLOAD_INSPECTION_SIGNATURES_REQUEST';
export const UPLOAD_INSPECTION_SIGNATURES_SUCCESS = 'inspection/UPLOAD_INSPECTION_SIGNATURES_SUCCESS';
export const UPLOAD_INSPECTION_SIGNATURES_FAILURE = 'inspection/UPLOAD_INSPECTION_SIGNATURES_FAILURE';

export const SAVE_INSPECTION_SIGNATURES_REQUEST = 'inspection/SAVE_INSPECTION_SIGNATURES_REQUEST';
export const SAVE_INSPECTION_SIGNATURES_SUCCESS = 'inspection/SAVE_INSPECTION_SIGNATURES_SUCCESS';
export const SAVE_INSPECTION_SIGNATURES_FAILURE = 'inspection/SAVE_INSPECTION_SIGNATURES_FAILURE';

export const DELETE_INSPECTION_REQUEST = 'inspection/DELETE_INSPECTION_REQUEST';
export const DELETE_INSPECTION_SUCCESS = 'inspection/DELETE_INSPECTION_SUCCESS';
export const DELETE_INSPECTION_FAILURE = 'inspection/DELETE_INSPECTION_FAILURE';

export const DELETE_ONLINE_INSPECTION_REQUEST = 'inspection/DELETE_ONLINE_INSPECTION_REQUEST';
export const DELETE_ONLINE_INSPECTION_SUCCESS = 'inspection/DELETE_ONLINE_INSPECTION_SUCCESS';
export const DELETE_ONLINE_INSPECTION_FAILURE = 'inspection/DELETE_ONLINE_INSPECTION_FAILURE';

export const GET_LIST_STATUS_REQUEST = 'inspection/GET_LIST_STATUS_REQUEST';
export const GET_LIST_STATUS_SUCCESS = 'inspection/GET_LIST_STATUS_SUCCESS';
export const GET_LIST_STATUS_FAILURE = 'inspection/GET_LIST_STATUS_FAILURE';

export const UNLINK_INSPECTION_LINKAGE_REQUEST = 'inspection/UNLINK_INSPECTION_LINKAGE_REQUEST';
export const UNLINK_INSPECTION_LINKAGE_SUCCESS = 'inspection/UNLINK_INSPECTION_LINKAGE_SUCCESS';
export const UNLINK_INSPECTION_LINKAGE_FAILURE = 'inspection/UNLINK_INSPECTION_LINKAGE_FAILURE';

export const UPDATE_OFFLINE_INSPECTION_REQUEST = 'inspection/UPDATE_OFFLINE_INSPECTION_REQUEST';
export const UPDATE_OFFLINE_INSPECTION_SUCCESS = 'inspection/UPDATE_OFFLINE_INSPECTION_SUCCESS';
export const UPDATE_OFFLINE_INSPECTION_FAILURE = 'inspection/UPDATE_OFFLINE_INSPECTION_FAILURE';

export const GET_INSPECTION_SETTING_REQUEST = 'inspection/GET_INSPECTION_SETTING_REQUEST';
export const GET_INSPECTION_SETTING_SUCCESS = 'inspection/GET_INSPECTION_SETTING_SUCCESS';
export const GET_INSPECTION_SETTING_FAILURE = 'inspection/GET_INSPECTION_SETTING_FAILURE';

export const UPDATE_INSPECTION_SETTING_REQUEST = 'inspection/UPDATE_INSPECTION_SETTING_REQUEST';
export const UPDATE_INSPECTION_SETTING_SUCCESS = 'inspection/UPDATE_INSPECTION_SETTING_SUCCESS';
export const UPDATE_INSPECTION_SETTING_FAILURE = 'inspection/UPDATE_INSPECTION_SETTING_FAILURE';

export const PICK_UP_INSPECTION_REQUEST = 'inspection/PICK_UP_INSPECTION_REQUEST';
export const PICK_UP_INSPECTION_SUCCESS = 'inspection/PICK_UP_INSPECTION_SUCCESS';
export const PICK_UP_INSPECTION_FAILURE = 'inspection/PICK_UP_INSPECTION_FAILURE';

export const RELEASE_INSPECTION_REQUEST = 'inspection/RELEASE_INSPECTION_REQUEST';
export const RELEASE_INSPECTION_SUCCESS = 'inspection/RELEASE_INSPECTION_SUCCESS';
export const RELEASE_INSPECTION_FAILURE = 'inspection/RELEASE_INSPECTION_FAILURE';

export const UPLOAD_INSPECTION_DOCUMENT_REQUEST = 'inspection/UPLOAD_INSPECTION_DOCUMENT_REQUEST';
export const UPLOAD_INSPECTION_DOCUMENT_SUCCESS = 'inspection/UPLOAD_INSPECTION_DOCUMENT_SUCCESS';
export const UPLOAD_INSPECTION_DOCUMENT_FAILURE = 'inspection/UPLOAD_INSPECTION_DOCUMENT_FAILURE';

export const GET_INSPECTION_HEADERS_REQUEST = 'inspection/GET_INSPECTION_HEADERS_REQUEST';
export const GET_INSPECTION_HEADERS_SUCCESS = 'inspection/GET_INSPECTION_HEADERS_SUCCESS';
export const GET_INSPECTION_HEADERS_FAILURE = 'inspection/GET_INSPECTION_HEADERS_FAILURE';

export const GET_INSPECTION_FOOTERS_REQUEST = 'inspection/GET_INSPECTION_FOOTERS_REQUEST';
export const GET_INSPECTION_FOOTERS_SUCCESS = 'inspection/GET_INSPECTION_FOOTERS_SUCCESS';
export const GET_INSPECTION_FOOTERS_FAILURE = 'inspection/GET_INSPECTION_FOOTERS_FAILURE';

export const GET_LOCATIONS_REQUEST = 'inspection/GET_LOCATIONS_REQUEST';
export const GET_LOCATIONS_SUCCESS = 'inspection/GET_LOCATIONS_SUCCESS';
export const GET_LOCATIONS_FAILURE = 'inspection/GET_LOCATIONS_FAILURE';
export const RESET_LOCATIONS = 'inspection/RESET_LOCATIONS';

export const GET_SIGNATURE_BY_WORKFLOW_ID_REQUEST = 'inspection/GET_SIGNATURE_BY_WORKFLOW_ID_REQUEST';
export const GET_SIGNATURE_BY_WORKFLOW_ID_SUCCESS = 'inspection/GET_SIGNATURE_BY_WORKFLOW_ID_SUCCESS';
export const GET_SIGNATURE_BY_WORKFLOW_ID_FAILURE = 'inspection/GET_SIGNATURE_BY_WORKFLOW_ID_FAILURE';

export const RESET_SIGNATURE_IMAGE = 'inspection/RESET_SIGNATURE_IMAGE';

export const DELETE_INSPECTION_SIGNATURE_REQUEST = 'inspection/DELETE_INSPECTION_SIGNATURE_REQUEST';
export const DELETE_INSPECTION_SIGNATURE_SUCCESS = 'inspection/DELETE_INSPECTION_SIGNATURE_SUCCESS';
export const DELETE_INSPECTION_SIGNATURE_FAILURE = 'inspection/DELETE_INSPECTION_SIGNATURE_FAILURE';

export const GET_QUESTION_TYPES_REQUEST = 'inspection/GET_QUESTION_TYPES_REQUEST';
export const GET_QUESTION_TYPES_SUCCESS = 'inspection/GET_QUESTION_TYPES_SUCCESS';
export const GET_QUESTION_TYPES_FAILURE = 'inspection/GET_QUESTION_TYPES_FAILURE';

export const GET_QUESTION_TYPE_CATEGORIES_REQUEST = 'inspection/GET_QUESTION_TYPE_CATEGORIES_REQUEST';
export const GET_QUESTION_TYPE_CATEGORIES_SUCCESS = 'inspection/GET_QUESTION_TYPE_CATEGORIES_SUCCCESS';
export const GET_QUESTION_TYPE_CATEGORIES_FAILURE = 'inspection/GET_QUESTION_TYPE_CATEGORIES_FAILURE';

export const GET_INSPECTION_LINKAGE_DETAIL_REQUEST = 'inspection/GET_INSPECTION_LINKAGE_DETAIL_REQUEST';
export const GET_INSPECTION_LINKAGE_DETAIL_SUCCESS = 'inspection/GET_INSPECTION_LINKAGE_DETAIL_SUCCESS';
export const GET_INSPECTION_LINKAGE_DETAIL_FAILURE = 'inspection/GET_INSPECTION_LINKAGE_DETAIL_FAILURE';

export const SET_QUEQUE_AUTO_SAVE = 'inspection/SET_QUEQUE_AUTO_SAVE';

export const COMPLETE_INSPECTION_REQUEST = 'inspection/COMPLETE_INSPECTION_REQUEST';
export const COMPLETE_INSPECTION_SUCCESS = 'inspection/COMPLETE_INSPECTION_SUCCESS';
export const COMPLETE_INSPECTION_FAILURE = 'inspection/COMPLETE_INSPECTION_FAILURE';

export const GET_CHANGE_HISTORIES_REQUEST = 'inspection/GET_CHANGE_HISTORIES_REQUEST';
export const GET_CHANGE_HISTORIES_SUCCESS = 'inspection/GET_CHANGE_HISTORIES_SUCCESS';
export const GET_CHANGE_HISTORIES_FAILURE = 'inspection/GET_CHANGE_HISTORIES_FAILURE';

export const GET_USERS_HAVE_JOB_PICKED_REQUEST = 'inspection/GET_USERS_HAVE_JOB_PICKED_REQUEST';
export const GET_USERS_HAVE_JOB_PICKED_SUCCESS = 'inspection/GET_USERS_HAVE_JOB_PICKED_SUCCESS';
export const GET_USERS_HAVE_JOB_PICKED_FAILURE = 'inspection/GET_USERS_HAVE_JOB_PICKED_FAILURE';

export const GET_QUESTION_PROJECT_TYPES = generateAction('inspection/GET_QUESTION_PROJECT_TYPE');
export const GET_USER_ANSWER_QUESTION_IMAGE = generateAction('inspection/GET_USER_ANSWER_QUESTION_IMAGE');
export const GET_MY_REPORTS = generateAction('inspection/GET_MY_REPORTS');
export const VIEW_MY_REPORT = generateAction('inspection/VIEW_MY_REPORT');
export const VIEW_REPORT = generateAction('inspection/VIEW_REPORT');
export const GET_DEFECTS = generateAction('inspection/GET_DEFECTS');
export const GET_INSPECTION_DETAIL_INFO = generateAction('inspection/GET_INSPECTION_DETAIL_INFO');

export const CHANGE_CAMERA_FLASH_STATUS = 'CHANGE_CAMERA_FLASH_STATUS';

export const resetLocations = (payload) => ({
  type: RESET_LOCATIONS,
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

export const getStatusConfigsRequest = (payload) => ({
  type: GET_STATUS_CONFIGS_REQUEST,
  payload,
});

export const getStatusConfigsSuccess = (payload) => ({
  type: GET_STATUS_CONFIGS_SUCCESS,
  payload,
});

export const getStatusConfigsFailure = (payload) => ({
  type: GET_STATUS_CONFIGS_FAILURE,
  payload,
});

export const getListStatusRequest = (payload) => ({
  type: GET_LIST_STATUS_REQUEST,
  payload,
});

export const getListStatusSuccess = (payload) => ({
  type: GET_LIST_STATUS_SUCCESS,
  payload,
});

export const getListStatusFailure = (payload) => ({
  type: GET_LIST_STATUS_FAILURE,
  payload,
});

export const uploadFormPhotoRequest = (payload) => ({
  type: UPLOAD_FORM_PHOTO_REQUEST,
  payload,
});

export const uploadFormPhotoSuccess = (payload) => ({
  type: UPLOAD_FORM_PHOTO_SUCCESS,
  payload,
});

export const uploadFormPhotoFailure = (payload) => ({
  type: UPLOAD_FORM_PHOTO_FAILURE,
  payload,
});

export const createInspectionRequest = (payload) => ({
  type: CREATE_INSPECTION_REQUEST,
  payload,
});

export const createInspectionSuccess = (payload) => ({
  type: CREATE_INSPECTION_SUCCESS,
  payload,
});

export const createInspectionFailure = (payload) => ({
  type: CREATE_INSPECTION_FAILURE,
  payload,
});

export const createOnlineInspectionRequest = (payload) => ({
  type: CREATE_ONLINE_INSPECTION_REQUEST,
  payload,
});

export const createOnlineInspectionSuccess = (payload) => ({
  type: CREATE_ONLINE_INSPECTION_SUCCESS,
  payload,
});

export const createOnlineInspectionFailure = (payload) => ({
  type: CREATE_ONLINE_INSPECTION_FAILURE,
  payload,
});

export const updateOnlineInspectionRequest = (payload) => ({
  type: UPDATE_ONLINE_INSPECTION_REQUEST,
  payload,
});

export const updateOnlineInspectionSuccess = (payload) => ({
  type: UPDATE_ONLINE_INSPECTION_SUCCESS,
  payload,
});

export const updateOnlineInspectionFailure = (payload) => ({
  type: UPDATE_ONLINE_INSPECTION_FAILURE,
  payload,
});

export const executeInspectionRequest = (payload) => ({
  type: EXECUTE_INSPECTION_REQUEST,
  payload,
});

export const executeInspectionSuccess = (payload) => ({
  type: EXECUTE_INSPECTION_SUCCESS,
  payload,
});

export const executeInspectionFailure = (payload) => ({
  type: EXECUTE_INSPECTION_FAILURE,
  payload,
});

export const getInspectionLinkageDetailRequest = (payload) => ({
  type: GET_INSPECTION_LINKAGE_DETAIL_REQUEST,
  payload,
});

export const getInspectionLinkageDetailSuccess = (payload) => ({
  type: GET_INSPECTION_LINKAGE_DETAIL_SUCCESS,
  payload,
});

export const getInspectionLinkageDetailFailure = (payload) => ({
  type: GET_INSPECTION_LINKAGE_DETAIL_FAILURE,
  payload,
});

export const createInspectionLinkageRequest = (payload) => ({
  type: CREATE_INSPECTION_LINKAGE_REQUEST,
  payload,
});

export const createInspectionLinkageSuccess = (payload) => ({
  type: CREATE_INSPECTION_LINKAGE_SUCCESS,
  payload,
});

export const createInspectionLinkageFailure = (payload) => ({
  type: CREATE_INSPECTION_LINKAGE_FAILURE,
  payload,
});

export const linkInspectionRequest = (payload) => ({
  type: LINK_INSPECTION_REQUEST,
  payload,
});

export const linkInspectionSuccess = (payload) => ({
  type: LINK_INSPECTION_SUCCESS,
  payload,
});

export const linkInspectionFailure = (payload) => ({
  type: LINK_INSPECTION_FAILURE,
  payload,
});

export const updateInspectionRequest = (payload) => ({
  type: UPDATE_INSPECTION_REQUEST,
  payload,
});

export const updateInspectionSuccess = (payload) => ({
  type: UPDATE_INSPECTION_SUCCESS,
  payload,
});

export const updateInspectionFailure = (payload) => ({
  type: UPDATE_INSPECTION_FAILURE,
  payload,
});

export const getInspectionsRequest = (payload) => ({
  type: GET_INSPECTIONS_REQUEST,
  payload,
});

export const getInspectionsSuccess = (payload) => ({
  type: GET_INSPECTIONS_SUCCESS,
  payload,
});

export const getInspectionsFailure = (payload) => ({
  type: GET_INSPECTIONS_FAILURE,
  payload,
});

export const getWorkflowDetailRequest = (payload) => ({
  type: GET_WORKFLOW_DETAIL_REQUEST,
  payload,
});

export const getWorkflowDetailSuccess = (payload) => ({
  type: GET_WORKFLOW_DETAIL_SUCCESS,
  payload,
});

export const getWorkflowDetailFailure = (payload) => ({
  type: GET_WORKFLOW_DETAIL_FAILURE,
  payload,
});

export const getInspectionAuditLogRequest = (payload) => ({
  type: GET_AUDIT_LOGS_REQUEST,
  payload,
});

export const getInspectionAuditLogSuccess = (payload) => ({
  type: GET_AUDIT_LOGS_SUCCESS,
  payload,
});

export const getInspectionAuditLogFailure = (payload) => ({
  type: GET_AUDIT_LOGS_FAILURE,
  payload,
});

export const getInspectionsOnlineRequest = (payload, userId) => ({
  type: GET_INSPECTIONS_ONLINE_REQUEST,
  payload,
  userId,
});

export const getInspectionsOnlineSuccess = (payload) => ({
  type: GET_INSPECTIONS_ONLINE_SUCCESS,
  payload,
});

export const getInspectionsOnlineFailure = (payload) => ({
  type: GET_INSPECTIONS_ONLINE_FAILURE,
  payload,
});

export const getInspectionFormDetailOnlineRequest = (payload) => ({
  type: GET_INSPECTIONS_FORM_DETAIL_ONLINE_REQUEST,
  payload,
});

export const getInspectionFormDetailOnlineSuccess = (payload) => ({
  type: GET_INSPECTIONS_FORM_DETAIL_ONLINE_SUCCESS,
  payload,
});

export const getInspectionFormDetailOnlineFailure = (payload) => ({
  type: GET_INSPECTIONS_FORM_DETAIL_ONLINE_FAILURE,
  payload,
});

export const getInspectionsByPropertyRequest = (payload) => ({
  type: GET_INSPECTIONS_BY_PROPERTY_REQUEST,
  payload,
});

export const getInspectionsByPropertySuccess = (payload) => ({
  type: GET_INSPECTIONS_BY_PROPERTY_SUCCESS,
  payload,
});

export const getInspectionsByPropertyFailure = (payload) => ({
  type: GET_INSPECTIONS_BY_PROPERTY_FAILURE,
  payload,
});

export const getInspectionFormDetailRequest = (payload) => ({
  type: GET_INSPECTION_FORM_DETAIL_REQUEST,
  payload,
});

export const getInspectionFormDetailSuccess = (payload) => ({
  type: GET_INSPECTION_FORM_DETAIL_SUCCESS,
  payload,
});

export const getInspectionFormDetailFailure = (payload) => ({
  type: GET_INSPECTION_FORM_DETAIL_FAILURE,
  payload,
});

export const saveInspectionRequest = (payload) => ({
  type: SAVE_INSPECTION_REQUEST,
  payload,
});

export const saveInspectionSuccess = (payload) => ({
  type: SAVE_INSPECTION_SUCCESS,
  payload,
});

export const saveInspectionFailure = (payload) => ({
  type: SAVE_INSPECTION_FAILURE,
  payload,
});

export const uploadInspectionSignaturesRequest = (payload) => ({
  type: UPLOAD_INSPECTION_SIGNATURES_REQUEST,
  payload,
});

export const uploadInspectionSignaturesSuccess = (payload) => ({
  type: UPLOAD_INSPECTION_SIGNATURES_SUCCESS,
  payload,
});

export const uploadInspectionSignaturesFailure = (payload) => ({
  type: UPLOAD_INSPECTION_SIGNATURES_FAILURE,
  payload,
});

export const saveInspectionSignaturesRequest = (payload) => ({
  type: SAVE_INSPECTION_SIGNATURES_REQUEST,
  payload,
});

export const saveInspectionSignaturesSuccess = (payload) => ({
  type: SAVE_INSPECTION_SIGNATURES_SUCCESS,
  payload,
});

export const saveInspectionSignaturesFailure = (payload) => ({
  type: SAVE_INSPECTION_SIGNATURES_FAILURE,
  payload,
});

export const getHomeInspectionsRequest = (payload) => ({
  type: GET_HOME_INSPECTIONS_REQUEST,
  payload,
});

export const getHomeInspectionsSuccess = (payload) => ({
  type: GET_HOME_INSPECTIONS_SUCCESS,
  payload,
});

export const getHomeInspectionsFailure = (payload) => ({
  type: GET_HOME_INSPECTIONS_FAILURE,
  payload,
});

export const deleteInspectionRequest = (payload) => ({
  type: DELETE_INSPECTION_REQUEST,
  payload,
});

export const deleteInspectionSuccess = (payload) => ({
  type: DELETE_INSPECTION_SUCCESS,
  payload,
});

export const deleteInspectionFailure = (payload) => ({
  type: DELETE_INSPECTION_FAILURE,
  payload,
});

export const deleteOnlineInspectionRequest = (payload) => ({
  type: DELETE_ONLINE_INSPECTION_REQUEST,
  payload,
});

export const deleteOnlineInspectionSuccess = (payload) => ({
  type: DELETE_ONLINE_INSPECTION_SUCCESS,
  payload,
});

export const deleteOnlineInspectionFailure = (payload) => ({
  type: DELETE_ONLINE_INSPECTION_FAILURE,
  payload,
});

export const updateInspectionOfflineRequest = (payload) => ({
  type: UPDATE_OFFLINE_INSPECTION_REQUEST,
  payload,
});

export const updateInspectionOfflineSuccess = (payload) => ({
  type: UPDATE_OFFLINE_INSPECTION_SUCCESS,
  payload,
});

export const updateInspectionOfflineFailure = (payload) => ({
  type: UPDATE_OFFLINE_INSPECTION_FAILURE,
  payload,
});

export const getInspectionByLinkModuleRequest = (payload) => ({
  type: GET_INSPECTIONS_BY_LINK_MODULE_REQUEST,
  payload,
});

export const getInspectionByLinkModuleSuccess = (payload) => ({
  type: GET_INSPECTIONS_BY_LINK_MODULE_SUCCESS,
  payload,
});

export const getInspectionByLinkModuleFailure = (payload) => ({
  type: GET_INSPECTIONS_BY_LINK_MODULE_FAILURE,
  payload,
});

export const unlinkInspectionLinkageRequest = (payload, moduleId) => ({
  type: UNLINK_INSPECTION_LINKAGE_REQUEST,
  payload,
  moduleId,
});

export const unlinkInspectionLinkageSuccess = (payload) => ({
  type: UNLINK_INSPECTION_LINKAGE_SUCCESS,
  payload,
});

export const unlinkInspectionLinkageFailure = (payload) => ({
  type: UNLINK_INSPECTION_LINKAGE_FAILURE,
  payload,
});

export const getInspectionSettingRequest = (payload) => ({
  type: GET_INSPECTION_SETTING_REQUEST,
  payload,
});

export const getInspectionSettingSuccess = (payload) => ({
  type: GET_INSPECTION_SETTING_SUCCESS,
  payload,
});

export const getInspectionSettingFailure = (payload) => ({
  type: GET_INSPECTION_SETTING_FAILURE,
  payload,
});

export const updateInspectionSettingRequest = (payload) => ({
  type: UPDATE_INSPECTION_SETTING_REQUEST,
  payload,
});

export const updateInspectionSettingSuccess = (payload) => ({
  type: UPDATE_INSPECTION_SETTING_SUCCESS,
  payload,
});

export const updateInspectionSettingFailure = (payload) => ({
  type: UPDATE_INSPECTION_SETTING_FAILURE,
  payload,
});

export const pickUpInspectionRequest = (payload) => ({
  type: PICK_UP_INSPECTION_REQUEST,
  payload,
});

export const pickUpInspectionSuccess = (payload) => ({
  type: PICK_UP_INSPECTION_SUCCESS,
  payload,
});

export const pickUpInspectionFailure = (payload) => ({
  type: PICK_UP_INSPECTION_FAILURE,
  payload,
});

export const releaseInspectionRequest = (payload) => ({
  type: RELEASE_INSPECTION_REQUEST,
  payload,
});

export const releaseInspectionSuccess = (payload) => ({
  type: RELEASE_INSPECTION_SUCCESS,
  payload,
});

export const releaseInspectionFailure = (payload) => ({
  type: RELEASE_INSPECTION_FAILURE,
  payload,
});

export const getInspectionDetailRequest = (payload) => ({
  type: GET_INSPECTIONS_DETAIL_REQUEST,
  payload,
});

export const getInspectionDetailSuccess = (payload) => ({
  type: GET_INSPECTIONS_DETAIL_SUCCESS,
  payload,
});

export const getInspectionDetailFailure = (payload) => ({
  type: GET_INSPECTIONS_DETAIL_FAILURE,
  payload,
});

export const uploadInspectionDocumentRequest = (payload) => ({
  type: UPLOAD_INSPECTION_DOCUMENT_REQUEST,
  payload,
});

export const uploadInspectionDocumentSuccess = (payload) => ({
  type: UPLOAD_INSPECTION_DOCUMENT_SUCCESS,
  payload,
});

export const uploadInspectionDocumentFailure = (payload) => ({
  type: UPLOAD_INSPECTION_DOCUMENT_FAILURE,
  payload,
});

export const getInspectionHeadersRequest = (payload) => ({
  type: GET_INSPECTION_HEADERS_REQUEST,
  payload,
});

export const getInspectionHeadersSuccess = (payload) => ({
  type: GET_INSPECTION_HEADERS_SUCCESS,
  payload,
});

export const getInspectionHeadersFailure = (payload) => ({
  type: GET_INSPECTION_HEADERS_FAILURE,
  payload,
});

export const getSignatureByWorkflowIdRequest = (payload) => ({
  type: GET_SIGNATURE_BY_WORKFLOW_ID_REQUEST,
  payload,
});

export const getSignatureByWorkflowIdSuccess = (payload) => ({
  type: GET_SIGNATURE_BY_WORKFLOW_ID_SUCCESS,
  payload,
});

export const getSignatureByWorkflowIdFailure = (payload) => ({
  type: GET_SIGNATURE_BY_WORKFLOW_ID_FAILURE,
  payload,
});

export const resetSignatureImage = (payload) => ({
  type: RESET_SIGNATURE_IMAGE,
  payload,
});

export const deleteInspectionSignatureRequest = (payload) => ({
  type: DELETE_INSPECTION_SIGNATURE_REQUEST,
  payload,
});

export const deleteInspectionSignatureSuccess = (payload) => ({
  type: DELETE_INSPECTION_SIGNATURE_SUCCESS,
  payload,
});

export const deleteInspectionSignatureFailure = (payload) => ({
  type: DELETE_INSPECTION_SIGNATURE_FAILURE,
  payload,
});

export const getQuestionTypesRequest = (payload) => ({
  type: GET_QUESTION_TYPES_REQUEST,
  payload,
});

export const getQuestionTypesSuccess = (payload) => ({
  type: GET_QUESTION_TYPES_SUCCESS,
  payload,
});

export const getQuestionTypesFailure = (payload) => ({
  type: GET_QUESTION_TYPES_FAILURE,
  payload,
});

export const getQuestionTypeCategoriesRequest = (payload) => ({
  type: GET_QUESTION_TYPE_CATEGORIES_REQUEST,
  payload,
});

export const getQuestionTypeCategoriesSuccess = (payload) => ({
  type: GET_QUESTION_TYPE_CATEGORIES_SUCCESS,
  payload,
});

export const getQuestionTypeCategoriesFailure = (payload) => ({
  type: GET_QUESTION_TYPE_CATEGORIES_FAILURE,
  payload,
});

export const getInspectionFootersRequest = (payload) => ({
  type: GET_INSPECTION_FOOTERS_REQUEST,
  payload,
});

export const getInspectionFootersSuccess = (payload) => ({
  type: GET_INSPECTION_FOOTERS_SUCCESS,
  payload,
});

export const getInspectionFootersFailure = (payload) => ({
  type: GET_INSPECTION_FOOTERS_FAILURE,
  payload,
});

export const setQuequeAutoSave = (payload) => ({
  type: SET_QUEQUE_AUTO_SAVE,
  payload,
});

export const completeInspectionRequest = (payload) => ({
  type: COMPLETE_INSPECTION_REQUEST,
  payload,
});

export const completeInspectionSuccess = (payload) => ({
  type: COMPLETE_INSPECTION_SUCCESS,
  payload,
});

export const completeInspectionFailure = (payload) => ({
  type: COMPLETE_INSPECTION_FAILURE,
  payload,
});

export const getChangeHistoriesRequest = (payload) => ({
  type: GET_CHANGE_HISTORIES_REQUEST,
  payload,
});

export const getChangeHistoriesSuccess = (payload) => ({
  type: GET_CHANGE_HISTORIES_SUCCESS,
  payload,
});

export const getChangeHistoriesFailure = (payload) => ({
  type: GET_CHANGE_HISTORIES_FAILURE,
  payload,
});

export const getUsersHaveJobPickedRequest = (payload) => ({
  type: GET_USERS_HAVE_JOB_PICKED_REQUEST,
  payload,
});

export const getUsersHaveJobPickedSuccess = (payload) => ({
  type: GET_USERS_HAVE_JOB_PICKED_SUCCESS,
  payload,
});

export const getUsersHaveJobPickedFailure = (payload) => ({
  type: GET_USERS_HAVE_JOB_PICKED_FAILURE,
  payload,
});

export const changeCameraFlashStatus = () => ({
  type: CHANGE_CAMERA_FLASH_STATUS,
});
