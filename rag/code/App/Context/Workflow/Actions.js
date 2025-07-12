import { generateAction } from '../../Utils/AppAction';

export const GET_WORKFLOW_SETTINGS_REQUEST = 'workflow/GET_WORKFLOW_SETTINGS_REQUEST';
export const GET_WORKFLOW_SETTINGS_SUCCESS = 'workflow/GET_WORKFLOW_SETTINGS_SUCCESS';
export const GET_WORKFLOW_SETTINGS_FAILURE = 'workflow/GET_WORKFLOW_SETTINGS_FAILURE';

export const GET_WORKFLOW_STATUS = generateAction('workflow/GET_WORKFLOW_STATUS');

export const getWorkflowSettingsRequest = (payload) => ({
  type: GET_WORKFLOW_SETTINGS_REQUEST,
  payload,
});

export const getWorkflowSettingsSuccess = (payload) => ({
  type: GET_WORKFLOW_SETTINGS_SUCCESS,
  payload,
});

export const getWorkflowSettingsFailure = (payload) => ({
  type: GET_WORKFLOW_SETTINGS_FAILURE,
  payload,
});
