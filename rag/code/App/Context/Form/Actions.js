import { generateAction } from '@Utils/AppAction';

export const GET_OFFLINE_FORMS_REQUEST = 'form/GET_OFFLINE_FORMS_REQUEST';
export const GET_OFFLINE_FORMS_SUCCESS = 'form/GET_OFFLINE_FORMS_SUCCESS';
export const GET_OFFLINE_FORMS_FAILURE = 'form/GET_OFFLINE_FORMS_FAILURE';

export const GET_MY_FORMS_REQUEST = 'form/GET_MY_FORMS_REQUEST';
export const GET_MY_FORMS_SUCCESS = 'form/GET_MY_FORMS_SUCCESS';
export const GET_MY_FORMS_FAILURE = 'form/GET_MY_FORMS_FAILURE';

export const GET_FORMS_LINK_MODULE_REQUEST = 'form/GET_FORMS_LINK_MODULE_REQUEST';
export const GET_FORMS_LINK_MODULE_SUCCESS = 'form/GET_FORMS_LINK_MODULE_SUCCESS';
export const GET_FORMS_LINK_MODULE_FAILURE = 'form/GET_FORMS_LINK_MODULE_FAILURE';

export const GET_TEAM_FORMS_REQUEST = 'form/GET_TEAM_FORMS_REQUEST';
export const GET_TEAM_FORMS_SUCCESS = 'form/GET_TEAM_FORMS_SUCCESS';
export const GET_TEAM_FORMS_FAILURE = 'form/GET_TEAM_FORMS_FAILURE';

export const GET_GLOBAL_FORMS_REQUEST = 'form/GET_GLOBAL_FORMS_REQUEST';
export const GET_GLOBAL_FORMS_SUCCESS = 'form/GET_GLOBAL_FORMS_SUCCESS';
export const GET_GLOBAL_FORMS_FAILURE = 'form/GET_GLOBAL_FORMS_FAILURE';

export const GET_FORM_TYPES_SUCCESS = 'form/GET_FORM_TYPES_SUCCESS';

export const CREATE_OR_EDIT_FORM_REQUEST = 'form/CREATE_OR_EDIT_FORM_REQUEST';
export const CREATE_OR_EDIT_FORM_SUCCESS = 'form/CREATE_OR_EDIT_FORM_SUCCESS';
export const CREATE_OR_EDIT_FORM_FAILURE = 'form/CREATE_OR_EDIT_FORM_FAILURE';

export const GET_FORM_CATEGORIES_REQUEST = 'form/GET_FORM_CATEGORIES_REQUEST';
export const GET_FORM_CATEGORIES_SUCCESS = 'form/GET_FORM_CATEGORIES_SUCCESS';
export const GET_FORM_CATEGORIES_FAILURE = 'form/GET_FORM_CATEGORIES_FAILURE';

export const DELETE_FORM_REQUEST = 'form/DELETE_FORM_REQUEST';
export const DELETE_FORM_SUCCESS = 'form/DELETE_FORM_SUCCESS';
export const DELETE_FORM_FAILURE = 'form/DELETE_FORM_FAILURE';

export const PUBLISH_TO_TEAM_REQUEST = 'form/PUBLISH_TO_TEAM_REQUEST';
export const PUBLISH_TO_TEAM_SUCCESS = 'form/PUBLISH_TO_TEAM_SUCCESS';
export const PUBLISH_TO_TEAM_FAILURE = 'form/PUBLISH_TO_TEAM_FAILURE';

export const UN_PUBLISH_TO_TEAM_REQUEST = 'form/UN_PUBLISH_TO_TEAM_REQUEST';
export const UN_PUBLISH_TO_TEAM_SUCCESS = 'form/UN_PUBLISH_TO_TEAM_SUCCESS';
export const UN_PUBLISH_TO_TEAM_FAILURE = 'form/UN_PUBLISH_TO_TEAM_FAILURE';

export const PUBLIC_FORM_REQUEST = 'form/PUBLIC_FORM_REQUEST';
export const PUBLIC_FORM_SUCCESS = 'form/PUBLIC_FORM_SUCCESS';
export const PUBLIC_FORM_FAILURE = 'form/PUBLIC_FORM_FAILURE';

export const PUBLISH_TO_GLOBAL_REQUEST = 'form/PUBLISH_TO_GLOBAL_REQUEST';
export const PUBLISH_TO_GLOBAL_SUCCESS = 'form/PUBLISH_TO_GLOBAL_SUCCESS';
export const PUBLISH_TO_GLOBAL_FAILURE = 'form/PUBLISH_TO_GLOBAL_FAILURE';

export const CLONE_FROM_GLOBAL_REQUEST = 'form/CLONE_FROM_GLOBAL_REQUEST';
export const CLONE_FROM_GLOBAL_SUCCESS = 'form/CLONE_FROM_GLOBAL_SUCCESS';
export const CLONE_FROM_GLOBAL_FAILURE = 'form/CLONE_FROM_GLOBAL_FAILURE';

export const CLONE_MY_FORM_REQUEST = 'form/CLONE_MY_FORM_REQUEST';
export const CLONE_MY_FORM_SUCCESS = 'form/CLONE_MY_FORM_SUCCESS';
export const CLONE_MY_FORM_FAILURE = 'form/CLONE_MY_FORM_FAILURE';

export const GET_FORM_SETTING_REQUEST = 'form/GET_FORM_SETTING_REQUEST';
export const GET_FORM_SETTING_SUCCESS = 'form/GET_FORM_SETTING_SUCCESS';
export const GET_FORM_SETTING_FAILURE = 'form/GET_FORM_SETTING_FAILURE';

export const GET_DEFINE_FORM_SECTIONS_REQUEST = 'form/GET_DEFINE_FORM_SECTIONS_REQUEST';
export const GET_DEFINE_FORM_SECTIONS_SUCCESS = 'form/GET_DEFINE_FORM_SECTIONS_SUCCESS';
export const GET_DEFINE_FORM_SECTIONS_FAILURE = 'form/GET_DEFINE_FORM_SECTIONS_FAILURE';

export const GET_DETAIL_SECTION_REQUEST = 'form/GET_DETAIL_SECTION_REQUEST';
export const GET_DETAIL_SECTION_SUCCESS = 'form/GET_DETAIL_SECTION_SUCCESS';
export const GET_DETAIL_SECTION_FAILURE = 'form/GET_DETAIL_SECTION_FAILURE';

export const GET_ALL_FORM_QUESTION_ANSWER_TEMPLATE_REQUEST = 'form/GET_ALL_FORM_QUESTION_ANSWER_TEMPLATE_REQUEST';
export const GET_ALL_FORM_QUESTION_ANSWER_TEMPLATE_SUCCESS = 'form/GET_ALL_FORM_QUESTION_ANSWER_TEMPLATE_SUCCESS';
export const GET_ALL_FORM_QUESTION_ANSWER_TEMPLATE_FAILURE = 'form/GET_ALL_FORM_QUESTION_ANSWER_TEMPLATE_FAILURE';

export const FILTER_FORM_QUESTION_SUMMARY_REQUEST = 'form/FILTER_FORM_QUESTION_SUMMARY_REQUEST';
export const FILTER_FORM_QUESTION_SUMMARY_SUCCESS = 'form/FILTER_FORM_QUESTION_SUMMARY_SUCCESS';
export const FILTER_FORM_QUESTION_SUMMARY_FAILURE = 'form/FILTER_FORM_QUESTION_SUMMARY_FAILURE';

export const ADD_USER_ANSWER_REQUEST = 'form/ADD_USER_ANSWER_REQUEST';
export const ADD_USER_ANSWER_SUCCESS = 'form/ADD_USER_ANSWER_SUCCESS';
export const ADD_USER_ANSWER_FAILURE = 'form/ADD_USER_ANSWER_FAILURE';

export const UPDATE_USER_ANSWER_REQUEST = 'form/UPDATE_USER_ANSWER_REQUEST';
export const UPDATE_USER_ANSWER_SUCCESS = 'form/UPDATE_USER_ANSWER_SUCCESS';
export const UPDATE_USER_ANSWER_FAILURE = 'form/UPDATE_USER_ANSWER_FAILURE';

export const REOPEN_FORM_USER_ANSWER_REQUEST = 'form/REOPEN_FORM_USER_ANSWER_REQUEST';
export const REOPEN_FORM_USER_ANSWER_SUCCESS = 'form/REOPEN_FORM_USER_ANSWER_SUCCESS';
export const REOPEN_FORM_USER_ANSWER_FAILURE = 'form/REOPEN_FORM_USER_ANSWER_FAILURE';

export const GET_USER_ANSWER_REQUEST = 'form/GET_USER_ANSWER_REQUEST';
export const GET_USER_ANSWER_SUCCESS = 'form/GET_USER_ANSWER_SUCCESS';
export const GET_USER_ANSWER_FAILURE = 'form/GET_USER_ANSWER_FAILURE';

export const GET_USER_ANSWER_BY_PARENT_ID_REQUEST = 'form/GET_USER_ANSWER_BY_PARENT_ID_REQUEST';
export const GET_USER_ANSWER_BY_PARENT_ID_SUCCESS = 'form/GET_USER_ANSWER_BY_PARENT_ID_SUCCESS';
export const GET_USER_ANSWER_BY_PARENT_ID_FAILURE = 'form/GET_USER_ANSWER_BY_PARENT_ID_FAILURE';

export const SET_ACTION_TYPE = 'form/SET_ACTION_TYPE';

export const SELECT_FORM_PROPERTY_INSPECTION = 'form/SELECT_FORM_PROPERTY_INSPECTION';

export const UPLOAD_FORM_IMAGE = 'form/UPLOAD_FORM_IMAGE';

export const GET_ALL_FORMS_REQUEST = 'form/GET_ALL_FORMS_REQUEST';
export const GET_ALL_FORMS_SUCCESS = 'form/GET_ALL_FORMS_SUCCESS';
export const GET_ALL_FORMS_FAILURE = 'form/GET_ALL_FORMS_FAILURE';

export const SET_FORM_TO_NON_EDIT_REQUEST = 'form/SET_FORM_TO_NON_EDIT_REQUEST';
export const SET_FORM_TO_NON_EDIT_SUCCESS = 'form/SET_FORM_TO_NON_EDIT_SUCCESS';
export const SET_FORM_TO_NON_EDIT_FAILURE = 'form/SET_FORM_TO_NON_EDIT_FAILURE';

export const GET_FORM_DETAIL_AFTER_REQUEST = 'form/GET_FORM_DETAIL_AFTER_REQUEST';
export const GET_FORM_DETAIL_AFTER_SUCCESS = 'form/GET_FORM_DETAIL_AFTER_SUCCESS';
export const GET_FORM_DETAIL_AFTER_FAILURE = 'form/GET_FORM_DETAIL_AFTER_FAILURE';

export const CLONE_HIDDEN_FORM_REQUEST = 'form/CLONE_HIDDEN_FORM_REQUEST';
export const CLONE_HIDDEN_FORM_SUCCESS = 'form/CLONE_HIDDEN_FORM_SUCCESS';
export const CLONE_HIDDEN_FORM_FAILURE = 'form/CLONE_HIDDEN_FORM_FAILURE';

export const GET_FORM_PAGE_GROUPS = generateAction('form/GET_FORM_PAGE_GROUPS');
export const GET_FORM_DETAIL = generateAction('form/GET_FORM_DETAIL');
export const GET_FORM_SETTINGS = generateAction('form/GET_FORM_SETTINGS');

export const SET_FORM_TYPE = 'form/SET_FORM_TYPE';
export const UPLOAD_FILE_FORM_QUESTION_ANSWER = generateAction('form/UPLOAD_FILE_FORM_QUESTION_ANSWER');

export const getOfflineFormsRequest = (payload) => ({
  type: GET_OFFLINE_FORMS_REQUEST,
  payload,
});

export const getOfflineFormsSuccess = (payload) => ({
  type: GET_OFFLINE_FORMS_SUCCESS,
  payload,
});

export const getOfflineFormsFailure = (payload) => ({
  type: GET_OFFLINE_FORMS_FAILURE,
  payload,
});

export const getMyFormsRequest = (payload) => ({
  type: GET_MY_FORMS_REQUEST,
  payload,
});

export const getMyFormsSuccess = (payload) => ({
  type: GET_MY_FORMS_SUCCESS,
  payload,
});

export const getMyFormsFailure = (payload) => ({
  type: GET_MY_FORMS_FAILURE,
  payload,
});

export const getFormsLinkModuleRequest = (payload) => ({
  type: GET_FORMS_LINK_MODULE_REQUEST,
  payload,
});

export const getFormsLinkModuleSuccess = (payload) => ({
  type: GET_FORMS_LINK_MODULE_SUCCESS,
  payload,
});

export const getFormsLinkModuleFailure = (payload) => ({
  type: GET_FORMS_LINK_MODULE_FAILURE,
  payload,
});

export const getTeamFormsRequest = (payload) => ({
  type: GET_TEAM_FORMS_REQUEST,
  payload,
});

export const getTeamFormsSuccess = (payload) => ({
  type: GET_TEAM_FORMS_SUCCESS,
  payload,
});

export const getTeamFormsFailure = (payload) => ({
  type: GET_TEAM_FORMS_FAILURE,
  payload,
});

export const getGlobalFormsRequest = (payload) => ({
  type: GET_GLOBAL_FORMS_REQUEST,
  payload,
});

export const getGlobalFormsSuccess = (payload) => ({
  type: GET_GLOBAL_FORMS_SUCCESS,
  payload,
});

export const getGlobalFormsFailure = (payload) => ({
  type: GET_GLOBAL_FORMS_FAILURE,
  payload,
});

export const createOrEditFormRequest = (payload) => ({
  type: CREATE_OR_EDIT_FORM_REQUEST,
  payload,
});

export const createOrEditFormSuccess = (payload) => ({
  type: CREATE_OR_EDIT_FORM_SUCCESS,
  payload,
});

export const createOrEditFormFailure = (payload) => ({
  type: CREATE_OR_EDIT_FORM_FAILURE,
  payload,
});

export const getFormCategoriesRequest = (payload) => ({
  type: GET_FORM_CATEGORIES_REQUEST,
  payload,
});

export const getFormCategoriesSuccess = (payload) => ({
  type: GET_FORM_CATEGORIES_SUCCESS,
  payload,
});

export const getFormCategoriesFailure = (payload) => ({
  type: GET_FORM_CATEGORIES_FAILURE,
  payload,
});

export const deleteFormRequest = (payload) => ({
  type: DELETE_FORM_REQUEST,
  payload,
});

export const deleteFormSuccess = (payload) => ({
  type: DELETE_FORM_SUCCESS,
  payload,
});

export const deleteFormFailure = (payload) => ({
  type: DELETE_FORM_FAILURE,
  payload,
});

export const getFormSettingRequest = (payload) => ({
  type: GET_FORM_SETTING_REQUEST,
  payload,
});

export const getFormSettingSuccess = (payload) => ({
  type: GET_FORM_SETTING_SUCCESS,
  payload,
});

export const getFormSettingFailure = (payload) => ({
  type: GET_FORM_SETTING_FAILURE,
  payload,
});

// actions

export const publishToGlobalRequest = (payload) => ({
  type: PUBLISH_TO_GLOBAL_REQUEST,
  payload,
});

export const publishToGlobalSuccess = (payload) => ({
  type: PUBLISH_TO_GLOBAL_SUCCESS,
  payload,
});

export const publishToGlobalFailure = (payload) => ({
  type: PUBLISH_TO_GLOBAL_FAILURE,
  payload,
});

export const publishToTeamRequest = (payload) => ({
  type: PUBLISH_TO_TEAM_REQUEST,
  payload,
});

export const publishToTeamSuccess = (payload) => ({
  type: PUBLISH_TO_TEAM_SUCCESS,
  payload,
});

export const publishToTeamFailure = (payload) => ({
  type: PUBLISH_TO_TEAM_FAILURE,
  payload,
});

export const unPublishToTeamRequest = (payload) => ({
  type: UN_PUBLISH_TO_TEAM_REQUEST,
  payload,
});

export const unPublishToTeamSuccess = (payload) => ({
  type: UN_PUBLISH_TO_TEAM_SUCCESS,
  payload,
});

export const unPublishToTeamFailure = (payload) => ({
  type: UN_PUBLISH_TO_TEAM_FAILURE,
  payload,
});

export const publicFormRequest = (payload) => ({
  type: PUBLIC_FORM_REQUEST,
  payload,
});

export const publicFormSuccess = (payload) => ({
  type: PUBLIC_FORM_SUCCESS,
  payload,
});

export const publicFormFailure = (payload) => ({
  type: PUBLIC_FORM_FAILURE,
  payload,
});

export const cloneFromGlobalRequest = (payload) => ({
  type: CLONE_FROM_GLOBAL_REQUEST,
  payload,
});

export const cloneFromGlobalSuccess = (payload) => ({
  type: CLONE_FROM_GLOBAL_SUCCESS,
  payload,
});

export const cloneFromGlobalFailure = (payload) => ({
  type: CLONE_FROM_GLOBAL_FAILURE,
  payload,
});

export const cloneMyFormRequest = (payload) => ({
  type: CLONE_MY_FORM_REQUEST,
  payload,
});

export const cloneMyFormSuccess = (payload) => ({
  type: CLONE_MY_FORM_SUCCESS,
  payload,
});

export const cloneMyFormFailure = (payload) => ({
  type: CLONE_MY_FORM_FAILURE,
  payload,
});

// pre-defined form pages
export const getDefineSectionsRequest = (payload) => ({
  type: GET_DEFINE_FORM_SECTIONS_REQUEST,
  payload,
});

export const getDefineSectionsSuccess = (payload) => ({
  type: GET_DEFINE_FORM_SECTIONS_SUCCESS,
  payload,
});

export const getDefineSectionsFailure = (payload) => ({
  type: GET_DEFINE_FORM_SECTIONS_FAILURE,
  payload,
});

export const getDetailSectionRequest = (payload) => ({
  type: GET_DETAIL_SECTION_REQUEST,
  payload,
});

export const getDetailSectionSuccess = (payload) => ({
  type: GET_DETAIL_SECTION_SUCCESS,
  payload,
});

export const getDetailSectionFailure = (payload) => ({
  type: GET_DETAIL_SECTION_FAILURE,
  payload,
});

export const setActionTypeRequest = (payload) => ({
  type: SET_ACTION_TYPE,
  payload,
});

// pre-defined form pages
export const getAllFormQuestionAnswerTemplateRequest = (payload) => ({
  type: GET_ALL_FORM_QUESTION_ANSWER_TEMPLATE_REQUEST,
  payload,
});

export const getAllFormQuestionAnswerTemplateSuccess = (payload) => ({
  type: GET_ALL_FORM_QUESTION_ANSWER_TEMPLATE_SUCCESS,
  payload,
});

export const getAllFormQuestionAnswerTemplateFailure = (payload) => ({
  type: GET_ALL_FORM_QUESTION_ANSWER_TEMPLATE_FAILURE,
  payload,
});

// filter question summary
export const filterFormQuestionSummaryRequest = (payload) => ({
  type: FILTER_FORM_QUESTION_SUMMARY_REQUEST,
  payload,
});

export const filterFormQuestionSummarySuccess = (payload) => ({
  type: FILTER_FORM_QUESTION_SUMMARY_SUCCESS,
  payload,
});

export const filterFormQuestionSummaryFailure = (payload) => ({
  type: FILTER_FORM_QUESTION_SUMMARY_FAILURE,
  payload,
});

// addUserAnswer
export const addUserAnswerRequest = (payload) => ({
  type: ADD_USER_ANSWER_REQUEST,
  payload,
});

export const addUserAnswerSuccess = (payload) => ({
  type: ADD_USER_ANSWER_SUCCESS,
  payload,
});

export const addUserAnswerFailure = (payload) => ({
  type: ADD_USER_ANSWER_FAILURE,
  payload,
});

export const updateUserAnswerRequest = (payload) => ({
  type: UPDATE_USER_ANSWER_REQUEST,
  payload,
});

export const updateUserAnswerSuccess = (payload) => ({
  type: UPDATE_USER_ANSWER_SUCCESS,
  payload,
});

export const updateUserAnswerFailure = (payload) => ({
  type: UPDATE_USER_ANSWER_FAILURE,
  payload,
});

// reopenFormUserAnswer
export const reopenFormUserAnswerRequest = (payload) => ({
  type: REOPEN_FORM_USER_ANSWER_REQUEST,
  payload,
});

export const reopenFormUserAnswerSuccess = (payload) => ({
  type: REOPEN_FORM_USER_ANSWER_SUCCESS,
  payload,
});

export const reopenFormUserAnswerFailure = (payload) => ({
  type: REOPEN_FORM_USER_ANSWER_FAILURE,
  payload,
});

// getUserAnswer
export const getUserAnswerRequest = (payload) => ({
  type: GET_USER_ANSWER_REQUEST,
  payload,
});

export const getUserAnswerSuccess = (payload) => ({
  type: GET_USER_ANSWER_SUCCESS,
  payload,
});

export const getUserAnswerFailure = (payload) => ({
  type: GET_USER_ANSWER_FAILURE,
  payload,
});

export const getUserAnswerByIdRequest = (payload) => ({
  type: GET_USER_ANSWER_BY_PARENT_ID_REQUEST,
  payload,
});

export const getUserAnswerByIdSuccess = (payload) => ({
  type: GET_USER_ANSWER_BY_PARENT_ID_SUCCESS,
  payload,
});

export const getUserAnswerByIdFailure = (payload) => ({
  type: GET_USER_ANSWER_BY_PARENT_ID_FAILURE,
  payload,
});

export const getAllFormsRequest = (payload) => ({
  type: GET_ALL_FORMS_REQUEST,
  payload,
});

export const getAllFormsSuccess = (payload) => ({
  type: GET_ALL_FORMS_SUCCESS,
  payload,
});

export const getAllFormsFailure = (payload) => ({
  type: GET_ALL_FORMS_FAILURE,
  payload,
});

export const setFormToNonEditRequest = (payload) => ({
  type: SET_FORM_TO_NON_EDIT_REQUEST,
  payload,
});

export const setFormToNonEditSuccess = (payload) => ({
  type: SET_FORM_TO_NON_EDIT_SUCCESS,
  payload,
});

export const setFormToNonEditFailure = (payload) => ({
  type: SET_FORM_TO_NON_EDIT_FAILURE,
  payload,
});

export const getFormDetailAfterDateRequest = (payload) => ({
  type: GET_FORM_DETAIL_AFTER_REQUEST,
  payload,
});

export const getFormDetailAfterDateSuccess = (payload) => ({
  type: GET_FORM_DETAIL_AFTER_SUCCESS,
  payload,
});

export const getFormDetailAfterDateFailure = (payload) => ({
  type: GET_FORM_DETAIL_AFTER_FAILURE,
  payload,
});

export const cloneHiddenFormRequest = (payload) => ({
  type: CLONE_HIDDEN_FORM_REQUEST,
  payload,
});

export const cloneHiddenFormSuccess = (payload) => ({
  type: CLONE_HIDDEN_FORM_SUCCESS,
  payload,
});

export const cloneHiddenFormFailure = (payload) => ({
  type: CLONE_HIDDEN_FORM_FAILURE,
  payload,
});

export const setFormType = (payload) => ({
  type: SET_FORM_TYPE,
  payload,
});
