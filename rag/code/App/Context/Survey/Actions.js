import { generateAction } from '../../Utils/AppAction';

export const FILTER_SURVEY_REQUEST = 'survey/FILTER_SURVEY_REQUEST';
export const FILTER_SURVEY_SUCCESS = 'survey/FILTER_SURVEY_SUCCESS';
export const FILTER_SURVEY_FAILURE = 'survey/FILTER_SURVEY_FAILURE';

export const FILTER_EXISTING_SURVEY_REQUEST = 'survey/FILTER_EXISTING_SURVEY_REQUEST';
export const FILTER_EXISTING_SURVEY_SUCCESS = 'survey/FILTER_EXISTING_SURVEY_SUCCESS';
export const FILTER_EXISTING_SURVEY_FAILURE = 'survey/FILTER_EXISTING_SURVEY_FAILURE';

export const GET_SURVEY_DETAIL_REQUEST = 'survey/GET_SURVEY_DETAIL_REQUEST';
export const GET_SURVEY_DETAIL_SUCCESS = 'survey/GET_SURVEY_DETAIL_SUCCESS';
export const GET_SURVEY_DETAIL_FAILURE = 'survey/GET_SURVEY_DETAIL_FAILURE';

export const FILTER_SURVEY_USERS_REQUEST = 'survey/FILTER_SURVEY_USERS_REQUEST';
export const FILTER_SURVEY_USERS_SUCCESS = 'survey/FILTER_SURVEY_USERS_SUCCESS';
export const FILTER_SURVEY_USERS_FAILURE = 'survey/FILTER_SURVEY_USERS_FAILURE';

export const FILTER_SURVEY_RESPONSE_REQUEST = 'survey/FILTER_SURVEY_RESPONSE_REQUEST';
export const FILTER_SURVEY_RESPONSE_SUCCESS = 'survey/FILTER_SURVEY_RESPONSE_SUCCESS';
export const FILTER_SURVEY_RESPONSE_FAILURE = 'survey/FILTER_SURVEY_RESPONSE_FAILURE';

export const ADD_SURVEY_REQUEST = 'survey/ADD_SURVEY_REQUEST';
export const ADD_SURVEY_SUCCESS = 'survey/ADD_SURVEY_SUCCESS';
export const ADD_SURVEY_FAILURE = 'survey/ADD_SURVEY_FAILURE';

export const UPDATE_SURVEY_TITLE_REQUEST = 'survey/UPDATE_SURVEY_TITLE_REQUEST';
export const UPDATE_SURVEY_TITLE_SUCCESS = 'survey/UPDATE_SURVEY_TITLE_SUCCESS';
export const UPDATE_SURVEY_TITLE_FAILURE = 'survey/UPDATE_SURVEY_TITLE_FAILURE';

export const GET_OPTIONS_FOR_PUBLISH_SURVEY_REQUEST = 'survey/GET_OPTIONS_FOR_PUBLISH_SURVEY_REQUEST';
export const GET_OPTIONS_FOR_PUBLISH_SURVEY_SUCCESS = 'survey/GET_OPTIONS_FOR_PUBLISH_SURVEY_SUCCESS';
export const GET_OPTIONS_FOR_PUBLISH_SURVEY_FAILURE = 'survey/GET_OPTIONS_FOR_PUBLISH_SURVEY_FAILURE';

export const GET_LIST_UNITS_FOR_PUBLISH_REQUEST = 'survey/GET_LIST_UNITS_FOR_PUBLISH_REQUEST';
export const GET_LIST_UNITS_FOR_PUBLISH_SUCCESS = 'survey/GET_LIST_UNITS_FOR_PUBLISH_SUCCESS';
export const GET_LIST_UNITS_FOR_PUBLISH_FAILURE = 'survey/GET_LIST_UNITS_FOR_PUBLISH_FAILURE';

export const GET_EMAIL_MEMBERS_FOR_PUBLISH_REQUEST = 'survey/GET_EMAIL_MEMBERS_FOR_PUBLISH_REQUEST';
export const GET_EMAIL_MEMBERS_FOR_PUBLISH_SUCCESS = 'survey/GET_EMAIL_MEMBERS_FOR_PUBLISH_SUCCESS';
export const GET_EMAIL_MEMBERS_FOR_PUBLISH_FAILURE = 'survey/GET_EMAIL_MEMBERS_FOR_PUBLISH_FAILURE';

export const GET_LIST_EMPLOYEE_FOR_PUBLISH_REQUEST = 'survey/GET_LIST_EMPLOYEE_FOR_PUBLISH_REQUEST';
export const GET_LIST_EMPLOYEE_FOR_PUBLISH_SUCCESS = 'survey/GET_LIST_EMPLOYEE_FOR_PUBLISH_SUCCESS';
export const GET_LIST_EMPLOYEE_FOR_PUBLISH_FAILURE = 'survey/GET_LIST_EMPLOYEE_FOR_PUBLISH_FAILURE';

export const PUBLIC_SURVEY_REQUEST = 'survey/PUBLIC_SURVEY_REQUEST';
export const PUBLIC_SURVEY_SUCCESS = 'survey/PUBLIC_SURVEY_SUCCESS';
export const PUBLIC_SURVEY_FAILURE = 'survey/PUBLIC_SURVEY_FAILURE';

export const UPLOAD_SURVEY_SIGNATURE_REQUEST = 'survey/UPLOAD_SURVEY_SIGNATURE_REQUEST';
export const UPLOAD_SURVEY_SIGNATURE_SUCCESS = 'survey/UPLOAD_SURVEY_SIGNATURE_SUCCESS';
export const UPLOAD_SURVEY_SIGNATURE_FAILURE = 'survey/UPLOAD_SURVEY_SIGNATURE_FAILURE';

export const FILTER_SURVEY_UNITS = generateAction('survey/FILTER_SURVEY_UNITS');

// Upload survey signature
export const uploadSurveySignatureRequest = (payload) => ({
  type: UPLOAD_SURVEY_SIGNATURE_REQUEST,
  payload,
});

export const uploadSurveySignatureSuccess = (payload) => ({
  type: UPLOAD_SURVEY_SIGNATURE_SUCCESS,
  payload,
});

export const uploadSurveySignatureFailure = (payload) => ({
  type: UPLOAD_SURVEY_SIGNATURE_FAILURE,
  payload,
});

export const filterSurveyRequest = (payload) => ({
  type: FILTER_SURVEY_REQUEST,
  payload,
});

export const filterSurveySuccess = (payload) => ({
  type: FILTER_SURVEY_SUCCESS,
  payload,
});

export const filterSurveyFailure = (payload) => ({
  type: FILTER_SURVEY_FAILURE,
  payload,
});

// filter existing survey
export const filterExistingSurveyRequest = (payload) => ({
  type: FILTER_EXISTING_SURVEY_REQUEST,
  payload,
});

export const filterExistingSurveySuccess = (payload) => ({
  type: FILTER_EXISTING_SURVEY_SUCCESS,
  payload,
});

export const filterExistingSurveyFailure = (payload) => ({
  type: FILTER_EXISTING_SURVEY_FAILURE,
  payload,
});

// detail
export const getSurveyDetailRequest = (payload) => ({
  type: GET_SURVEY_DETAIL_REQUEST,
  payload,
});

export const getSurveyDetailSuccess = (payload) => ({
  type: GET_SURVEY_DETAIL_SUCCESS,
  payload,
});

export const getSurveyDetailFailure = (payload) => ({
  type: GET_SURVEY_DETAIL_FAILURE,
  payload,
});

// filter users
export const filterSurveyUsersRequest = (payload) => ({
  type: FILTER_SURVEY_USERS_REQUEST,
  payload,
});

export const filterSurveyUsersSuccess = (payload) => ({
  type: FILTER_SURVEY_USERS_SUCCESS,
  payload,
});

export const filterSurveyUsersFailure = (payload) => ({
  type: FILTER_SURVEY_USERS_FAILURE,
  payload,
});

// filter response
export const filterSurveyResponseRequest = (payload) => ({
  type: FILTER_SURVEY_RESPONSE_REQUEST,
  payload,
});

export const filterSurveyResponseSuccess = (payload) => ({
  type: FILTER_SURVEY_RESPONSE_SUCCESS,
  payload,
});

export const filterSurveyResponseFailure = (payload) => ({
  type: FILTER_SURVEY_RESPONSE_FAILURE,
  payload,
});

// add survey
export const addSurveyRequest = (payload) => ({
  type: ADD_SURVEY_REQUEST,
  payload,
});

export const addSurveySuccess = (payload) => ({
  type: ADD_SURVEY_SUCCESS,
  payload,
});

export const addSurveyFailure = (payload) => ({
  type: ADD_SURVEY_FAILURE,
  payload,
});

// update survey title
export const updateSurveyTitleRequest = (payload) => ({
  type: UPDATE_SURVEY_TITLE_REQUEST,
  payload,
});

export const updateSurveyTitleSuccess = (payload) => ({
  type: UPDATE_SURVEY_TITLE_SUCCESS,
  payload,
});

export const updateSurveyTitleFailure = (payload) => ({
  type: UPDATE_SURVEY_TITLE_FAILURE,
  payload,
});

// getOptionsForPublishSurvey
export const getOptionsForPublishSurveyRequest = (payload) => ({
  type: GET_OPTIONS_FOR_PUBLISH_SURVEY_REQUEST,
  payload,
});

export const getOptionsForPublishSurveySuccess = (payload) => ({
  type: GET_OPTIONS_FOR_PUBLISH_SURVEY_SUCCESS,
  payload,
});

export const getOptionsForPublishSurveyFailure = (payload) => ({
  type: GET_OPTIONS_FOR_PUBLISH_SURVEY_FAILURE,
  payload,
});

// getListUnitsForPublish
export const getListUnitsForPublishRequest = (payload) => ({
  type: GET_LIST_UNITS_FOR_PUBLISH_REQUEST,
  payload,
});

export const getListUnitsForPublishSuccess = (payload) => ({
  type: GET_LIST_UNITS_FOR_PUBLISH_SUCCESS,
  payload,
});

export const getListUnitsForPublishFailure = (payload) => ({
  type: GET_LIST_UNITS_FOR_PUBLISH_FAILURE,
  payload,
});

// getEmailMemberForPublish
export const getEmailMembersForPublishRequest = (payload) => ({
  type: GET_EMAIL_MEMBERS_FOR_PUBLISH_REQUEST,
  payload,
});

export const getEmailMembersForPublishSuccess = (payload) => ({
  type: GET_EMAIL_MEMBERS_FOR_PUBLISH_SUCCESS,
  payload,
});

export const getEmailMembersForPublishFailure = (payload) => ({
  type: GET_EMAIL_MEMBERS_FOR_PUBLISH_FAILURE,
  payload,
});

// getListEmployeeForPublish
export const getListEmployeeForPublishRequest = (payload) => ({
  type: GET_LIST_EMPLOYEE_FOR_PUBLISH_REQUEST,
  payload,
});

export const getListEmployeeForPublishSuccess = (payload) => ({
  type: GET_LIST_EMPLOYEE_FOR_PUBLISH_SUCCESS,
  payload,
});

export const getListEmployeeForPublishFailure = (payload) => ({
  type: GET_LIST_EMPLOYEE_FOR_PUBLISH_FAILURE,
  payload,
});

// publicSurvey
export const publicSurveyRequest = (payload) => ({
  type: PUBLIC_SURVEY_REQUEST,
  payload,
});

export const publicSurveySuccess = (payload) => ({
  type: PUBLIC_SURVEY_SUCCESS,
  payload,
});

export const publicSurveyFailure = (payload) => ({
  type: PUBLIC_SURVEY_FAILURE,
  payload,
});
