import { generateAction } from '../../Utils/AppAction';

export const ADD_JR = generateAction('jobRequest/ADD_JR');
export const EDIT_JR = generateAction('jobRequest/EDIT_JR');

export const GET_ALL_JR_REQUEST = 'jobRequest/GET_ALL_JR_REQUEST';
export const GET_ALL_JR_SUCCESS = 'jobRequest/GET_ALL_JR_SUCCESS';
export const GET_ALL_JR_FAILURE = 'jobRequest/GET_ALL_JR_FAILURE';

export const GET_FORM_SIGNING_JR_REQUEST = 'jobRequest/GET_FORM_SIGNING_JR_REQUEST';
export const GET_FORM_SIGNING_JR_SUCCESS = 'jobRequest/GET_FORM_SIGNING_JR_SUCCESS';
export const GET_FORM_SIGNING_JR_FAILURE = 'jobRequest/GET_FORM_SIGNING_JR_FAILURE';

export const GET_TARGET_DATE_TIME_REQUEST = 'jobRequest/GET_TARGET_DATE_TIME_REQUEST';
export const GET_TARGET_DATE_TIME_SUCCESS = 'jobRequest/GET_TARGET_DATE_TIME_SUCCESS';
export const GET_TARGET_DATE_TIME_FAILURE = 'jobRequest/GET_TARGET_DATE_TIME_FAILURE';

export const GET_MY_JR_REQUEST = 'jobRequest/GET_MY_JR_REQUEST';
export const GET_MY_JR_SUCCESS = 'jobRequest/GET_MY_JR_SUCCESS';
export const GET_MY_JR_FAILURE = 'jobRequest/GET_MY_JR_FAILURE';

export const ADD_QUICK_JR_REQUEST = 'jobRequest/ADD_QUICK_JR_REQUEST';
export const ADD_QUICK_JR_SUCCESS = 'jobRequest/ADD_QUICK_JR_SUCCESS';
export const ADD_QUICK_JR_FAILURE = 'jobRequest/ADD_QUICK_JR_FAILURE';

export const DETAIL_JR_REQUEST = 'jobRequest/DETAIL_JR_REQUEST';
export const DETAIL_JR_SUCCESS = 'jobRequest/DETAIL_JR_SUCCESS';
export const DETAIL_JR_FAILURE = 'jobRequest/DETAIL_JR_FAILURE';

export const ADD_TASK_REQUEST = 'jobRequest/ADD_TASK_REQUEST';
export const ADD_TASK_SUCCESS = 'jobRequest/ADD_TASK_SUCCESS';
export const ADD_TASK_FAILURE = 'jobRequest/ADD_TASK_FAILURE';

export const EDIT_TASK_REQUEST = 'jobRequest/EDIT_TASK_REQUEST';
export const EDIT_TASK_SUCCESS = 'jobRequest/EDIT_TASK_SUCCESS';
export const EDIT_TASK_FAILURE = 'jobRequest/EDIT_TASK_FAILURE';

export const DELETE_TASK_REQUEST = 'jobRequest/DELETE_TASK_REQUEST';
export const DELETE_TASK_SUCCESS = 'jobRequest/DELETE_TASK_SUCCESS';
export const DELETE_TASK_FAILURE = 'jobRequest/DELETE_TASK_FAILURE';

export const GET_GROUP_CATEGORIES_REQUEST = 'jobRequest/GET_GROUP_CATEGORIES_REQUEST';
export const GET_GROUP_CATEGORIES_SUCCESS = 'jobRequest/GET_GROUP_CATEGORIES_SUCCESS';
export const GET_GROUP_CATEGORIES_FAILURE = 'jobRequest/GET_GROUP_CATEGORIES_FAILURE';

export const GET_COUNT_STATUS_REQUEST = 'jobRequest/GET_COUNT_STATUS_REQUEST';
export const GET_COUNT_STATUS_SUCCESS = 'jobRequest/GET_COUNT_STATUS_SUCCESS';
export const GET_COUNT_STATUS_FAILURE = 'jobRequest/GET_COUNT_STATUS_FAILURE';

export const GET_AREAS_REQUEST = 'jobRequest/GET_AREAS_REQUEST';
export const GET_AREAS_SUCCESS = 'jobRequest/GET_AREAS_SUCCESS';
export const GET_AREAS_FAILURE = 'jobRequest/GET_AREAS_FAILURE';

export const GET_CATEGORIES_REQUEST = 'jobRequest/GET_CATEGORIES_REQUEST';
export const GET_CATEGORIES_SUCCESS = 'jobRequest/GET_CATEGORIES_SUCCESS';
export const GET_CATEGORIES_FAILURE = 'jobRequest/GET_CATEGORIES_FAILURE';

export const GET_SUB_CATEGORIES_REQUEST = 'jobRequest/GET_SUB_CATEGORIES_REQUEST';
export const GET_SUB_CATEGORIES_SUCCESS = 'jobRequest/GET_SUB_CATEGORIES_SUCCESS';
export const GET_SUB_CATEGORIES_FAILURE = 'jobRequest/GET_SUB_CATEGORIES_FAILURE';

export const GET_QUICK_JR_SETTING_REQUEST = 'jobRequest/GET_QUICK_JR_SETTING_REQUEST';
export const GET_QUICK_JR_SETTING_SUCCESS = 'jobRequest/GET_QUICK_JR_SETTING_SUCCESS';
export const GET_QUICK_JR_SETTING_FAILURE = 'jobRequest/GET_QUICK_JR_SETTING_FAILURE';

export const GET_TASKS_REQUEST = 'jobRequest/GET_TASKS_REQUEST';
export const GET_TASKS_SUCCESS = 'jobRequest/GET_TASKS_SUCCESS';
export const GET_TASKS_FAILURE = 'jobRequest/GET_TASKS_FAILURE';

export const GET_MY_TASKS_REQUEST = 'jobRequest/GET_MY_TASKS_REQUEST';
export const GET_MY_TASKS_SUCCESS = 'jobRequest/GET_MY_TASKS_SUCCESS';
export const GET_MY_TASKS_FAILURE = 'jobRequest/GET_MY_TASKS_FAILURE';

export const GET_TASK_COUNT_STATUS_REQUEST = 'jobRequest/GET_TASK_COUNT_STATUS_REQUEST';
export const GET_TASK_COUNT_STATUS_SUCCESS = 'jobRequest/GET_TASK_COUNT_STATUS_SUCCESS';
export const GET_TASK_COUNT_STATUS_FAILURE = 'jobRequest/GET_TASK_COUNT_STATUS_FAILURE';

export const GET_TASKS_IN_JR_REQUEST = 'jobRequest/GET_TASKS_IN_JR_REQUEST';
export const GET_TASKS_IN_JR_SUCCESS = 'jobRequest/GET_TASKS_IN_JR_SUCCESS';
export const GET_TASKS_IN_JR_FAILURE = 'jobRequest/GET_TASKS_IN_JR_FAILURE';

export const GET_SLA_SETTINGS_REQUEST = 'jobRequest/GET_SLA_SETTINGS_REQUEST';
export const GET_SLA_SETTINGS_SUCCESS = 'jobRequest/GET_SLA_SETTINGS_SUCCESS';
export const GET_SLA_SETTINGS_FAILURE = 'jobRequest/GET_SLA_SETTINGS_FAILURE';

export const SET_VISIBLE_SIGNING_MODAL = 'jobRequest/SET_VISIBLE_SIGNING_MODAL';
export const SET_VISIBLE_PREVIEW_MODAL = 'jobRequest/SET_VISIBLE_PREVIEW_MODAL';

export const PREVIEW_REPORT_REQUEST = 'jobRequest/PREVIEW_REPORT_REQUEST';
export const PREVIEW_REPORT_SUCCESS = 'jobRequest/PREVIEW_REPORT_SUCCESS';
export const PREVIEW_REPORT_FAILURE = 'jobRequest/PREVIEW_REPORT_FAILURE';

export const UPLOAD_FILE_SIGNATURE_JR_REQUEST = 'jobRequest/UPLOAD_FILE_SIGNATURE_JR_REQUEST';
export const UPLOAD_FILE_SIGNATURE_JR_SUCCESS = 'jobRequest/UPLOAD_FILE_SIGNATURE_JR_SUCCESS';
export const UPLOAD_FILE_SIGNATURE_JR_FAILURE = 'jobRequest/UPLOAD_FILE_SIGNATURE_JR_FAILURE';

export const GET_JR_SETTING = generateAction('jobRequest/GET_JR_SETTING');
export const GET_VENDORS = generateAction('jobRequest/GET_VENDORS');
export const CLEAR_JOB_REQUEST_DETAIL = 'jobRequest/CLEAR_JOB_REQUEST_DETAIL';

export const GET_ASSET_JR_HISTORY = generateAction('jobRequest/GET_ASSET_JR_HISTORY');

export const DETAIL_TASK = generateAction('jobRequest/DETAIL_TASK');

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

export const previewReportRequest = (payload) => ({
  type: PREVIEW_REPORT_REQUEST,
  payload,
});

export const previewReportSuccess = (payload) => ({
  type: PREVIEW_REPORT_SUCCESS,
  payload,
});

export const previewReportFailure = (payload) => ({
  type: PREVIEW_REPORT_FAILURE,
  payload,
});

export const setVisibleSigningModalRequest = (payload) => ({
  type: SET_VISIBLE_SIGNING_MODAL,
  payload,
});

export const setVisiblePreviewModalRequest = (payload) => ({
  type: SET_VISIBLE_PREVIEW_MODAL,
  payload,
});

export const getAllJRRequest = (payload) => ({
  type: GET_ALL_JR_REQUEST,
  payload,
});

export const getAllJRSuccess = (payload) => ({
  type: GET_ALL_JR_SUCCESS,
  payload,
});

export const getAllJRFailure = (payload) => ({
  type: GET_ALL_JR_FAILURE,
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

export const getTargetDateTimeRequest = (payload) => ({
  type: GET_TARGET_DATE_TIME_REQUEST,
  payload,
});

export const getTargetDateTimeSuccess = (payload) => ({
  type: GET_TARGET_DATE_TIME_SUCCESS,
  payload,
});

export const getTargetDateTimeFailure = (payload) => ({
  type: GET_TARGET_DATE_TIME_FAILURE,
  payload,
});

export const addQuickJRRequest = (payload) => ({
  type: ADD_QUICK_JR_REQUEST,
  payload,
});

export const addQuickJRSuccess = (payload) => ({
  type: ADD_QUICK_JR_SUCCESS,
  payload,
});

export const addQuickJRFailure = (payload) => ({
  type: ADD_QUICK_JR_FAILURE,
  payload,
});

export const detailJRRequest = (payload) => ({
  type: DETAIL_JR_REQUEST,
  payload,
});

export const detailJRSuccess = (payload) => ({
  type: DETAIL_JR_SUCCESS,
  payload,
});

export const detailJRFailure = (payload) => ({
  type: DETAIL_JR_FAILURE,
  payload,
});

export const getFormSigningJRRequest = (payload) => ({
  type: GET_FORM_SIGNING_JR_REQUEST,
  payload,
});

export const getFormSigningJRSuccess = (payload) => ({
  type: GET_FORM_SIGNING_JR_SUCCESS,
  payload,
});

export const getFormSigningJRFailure = (payload) => ({
  type: GET_FORM_SIGNING_JR_FAILURE,
  payload,
});

export const getGroupCategoriesRequest = (payload) => ({
  type: GET_GROUP_CATEGORIES_REQUEST,
  payload,
});

export const getGroupCategoriesSuccess = (payload) => ({
  type: GET_GROUP_CATEGORIES_SUCCESS,
  payload,
});

export const getGroupCategoriesFailure = (payload) => ({
  type: GET_GROUP_CATEGORIES_FAILURE,
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

export const getCountStatusRequest = (payload) => ({
  type: GET_COUNT_STATUS_REQUEST,
  payload,
});

export const getCountStatusSuccess = (payload) => ({
  type: GET_COUNT_STATUS_SUCCESS,
  payload,
});

export const getCountStatusFailure = (payload) => ({
  type: GET_COUNT_STATUS_FAILURE,
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

// TASKS

export const addTaskRequest = (payload) => ({
  type: ADD_TASK_REQUEST,
  payload,
});

export const addTaskSuccess = (payload) => ({
  type: ADD_TASK_SUCCESS,
  payload,
});

export const addTaskFailure = (payload) => ({
  type: ADD_TASK_FAILURE,
  payload,
});

export const editTaskRequest = (payload) => ({
  type: EDIT_TASK_REQUEST,
  payload,
});

export const editTaskSuccess = (payload) => ({
  type: EDIT_TASK_SUCCESS,
  payload,
});

export const editTaskFailure = (payload) => ({
  type: EDIT_TASK_FAILURE,
  payload,
});

export const deleteTaskRequest = (payload) => ({
  type: DELETE_TASK_REQUEST,
  payload,
});

export const deleteTaskSuccess = (payload) => ({
  type: DELETE_TASK_SUCCESS,
  payload,
});

export const deleteTaskFailure = (payload) => ({
  type: DELETE_TASK_FAILURE,
  payload,
});

export const getTasksRequest = (payload) => ({
  type: GET_TASKS_REQUEST,
  payload,
});

export const getTasksSuccess = (payload) => ({
  type: GET_TASKS_SUCCESS,
  payload,
});

export const getTasksFailure = (payload) => ({
  type: GET_TASKS_FAILURE,
  payload,
});

export const getMyTasksRequest = (payload) => ({
  type: GET_MY_TASKS_REQUEST,
  payload,
});

export const getMyTasksSuccess = (payload) => ({
  type: GET_MY_TASKS_SUCCESS,
  payload,
});

export const getMyTasksFailure = (payload) => ({
  type: GET_MY_TASKS_FAILURE,
  payload,
});

export const getTaskCountStatusRequest = (payload) => ({
  type: GET_TASK_COUNT_STATUS_REQUEST,
  payload,
});

export const getTaskCountStatusSuccess = (payload) => ({
  type: GET_TASK_COUNT_STATUS_SUCCESS,
  payload,
});

export const getTaskCountStatusFailure = (payload) => ({
  type: GET_TASK_COUNT_STATUS_FAILURE,
  payload,
});

export const getTasksInJRRequest = (payload) => ({
  type: GET_TASKS_IN_JR_REQUEST,
  payload,
});

export const getTasksInJRSuccess = (payload) => ({
  type: GET_TASKS_IN_JR_SUCCESS,
  payload,
});

export const getTasksInJRFailure = (payload) => ({
  type: GET_TASKS_IN_JR_FAILURE,
  payload,
});

export const clearJrDetailRequest = (payload) => ({
  type: CLEAR_JOB_REQUEST_DETAIL,
  payload,
});
