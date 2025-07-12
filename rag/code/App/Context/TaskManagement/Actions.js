import { generateAction } from '../../Utils/AppAction';

export const GET_TASK_LIST = generateAction('taskManagement/GET_TASK_LIST');
export const GET_STATUS_LIST = generateAction('taskManagement/GET_STATUS_LIST');
export const GET_PRIORITY_LIST = generateAction('taskManagement/GET_PRIORITY_LIST');
export const GET_TEAMS_BY_TENANT = generateAction('taskManagement/GET_TEAMS_BY_TENANT');
export const GET_CURRENT_TEAMS = generateAction('taskManagement/GET_CURRENT_TEAMS');
export const GET_ASSIGNEE_LIST = generateAction('taskManagement/GET_ASSIGNEE_LIST');
export const GET_TASK_DETAIL = generateAction('taskManagement/GET_TASK_DETAIL');
export const ADD_TASK = generateAction('taskManagement/ADD_TASK');
export const UPDATE_TASK = generateAction('taskManagement/UPDATE_TASK');
export const GET_USERS_IN_TEAMS_BY_TENANTS = generateAction('taskManagement/GET_USERS_IN_TEAMS_BY_TENANTS');

export const GET_MENTION_USER = generateAction('taskManagement/GET_MENTION_USER');
export const GET_COMMENT_BY_TASK = generateAction('taskManagement/GET_COMMENT_BY_TASK');
export const ADD_COMMENT = generateAction('taskManagement/ADD_COMMENT');
export const RESET_TASK_DETAIL = 'taskManagement/RESET_TASK_DETAIL';
export const GET_EMPLOYEES_BY_TENANT = generateAction('taskManagement/GET_EMPLOYEES_BY_TENANT');
export const GET_TEAMS_FOR_TASK_DETAIL = generateAction('taskManagement/GET_TEAMS_FOR_TASK_DETAIL');
export const GET_TENANTS_TASK_DETAIL = generateAction('taskManagement/GET_TENANTS_TASK_DETAIL');

export const resetTaskDetailRequest = () => ({
  type: RESET_TASK_DETAIL,
});
