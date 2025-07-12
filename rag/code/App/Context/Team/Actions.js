import { generateAction } from "../../Utils/AppAction";

export const GET_ALL_TEAM_MEMBERS_REQUEST = 'team/GET_ALL_TEAM_MEMBERS_REQUEST';
export const GET_ALL_TEAM_MEMBERS_SUCCESS = 'team/GET_ALL_TEAM_MEMBERS_SUCCESS';
export const GET_ALL_TEAM_MEMBERS_FAILURE = 'team/GET_ALL_TEAM_MEMBERS_FAILURE';

export const GET_TEAMS_REQUEST = 'team/GET_TEAMS_REQUEST';
export const GET_TEAMS_SUCCESS = 'team/GET_TEAMS_SUCCESS';
export const GET_TEAMS_FAILURE = 'team/GET_TEAMS_FAILURE';

export const GET_USER_IN_TEAM_REQUEST = 'team/GET_USER_IN_TEAM_REQUEST';
export const GET_USER_IN_TEAM_SUCCESS = 'team/GET_USER_IN_TEAM_SUCCESS';
export const GET_USER_IN_TEAM_FAILURE = 'team/GET_USER_IN_TEAM_FAILURE';

export const GET_LIST_OBSERVER_REQUEST = 'team/GET_LIST_OBSERVER_REQUEST';
export const GET_LIST_OBSERVER_SUCCESS = 'team/GET_LIST_OBSERVER_SUCCESS';
export const GET_LIST_OBSERVER_FAILURE = 'team/GET_LIST_OBSERVER_FAILURE';

export const GET_TEAM_INSPECTION_REQUEST = 'team/GET_TEAM_INSPECTION_REQUEST';
export const GET_TEAM_INSPECTION_SUCCESS = 'team/GET_TEAM_INSPECTION_SUCCESS';
export const GET_TEAM_INSPECTION_FAILURE = 'team/GET_TEAM_INSPECTION_FAILURE';

export const GET_TEAM_ATTENDANCE_REQUEST = 'team/GET_TEAM_ATTENDANCE_REQUEST';
export const GET_TEAM_ATTENDANCE_SUCCESS = 'team/GET_TEAM_ATTENDANCE_SUCCESS';
export const GET_TEAM_ATTENDANCE_FAILURE = 'team/GET_TEAM_ATTENDANCE_FAILURE';

export const GET_TEAM_PM_LINKAGE_REQUEST = 'team/GET_TEAM_PM_LINKAGE_REQUEST';
export const GET_TEAM_PM_LINKAGE_SUCCESS = 'team/GET_TEAM_PM_LINKAGE_SUCCESS';
export const GET_TEAM_PM_LINKAGE_FAILURE = 'team/GET_TEAM_PM_LINKAGE_FAILURE';

export const GET_TEAMS_BY_USERS = generateAction('taskManagement/GET_TEAMS_BY_USERS');

export const getAllTeamMembersRequest = (payload) => ({
  type: GET_ALL_TEAM_MEMBERS_REQUEST,
  payload,
});

export const getAllTeamMembersSuccess = (payload) => ({
  type: GET_ALL_TEAM_MEMBERS_SUCCESS,
  payload,
});

export const getAllTeamMembersFailure = (payload) => ({
  type: GET_ALL_TEAM_MEMBERS_FAILURE,
  payload,
});
//
export const getTeamsRequest = (payload) => ({
  type: GET_TEAMS_REQUEST,
  payload,
});

export const getTeamsSuccess = (payload) => ({
  type: GET_TEAMS_SUCCESS,
  payload,
});

export const getTeamsFailure = (payload) => ({
  type: GET_TEAMS_FAILURE,
  payload,
});

export const getUserInTeamRequest = (payload) => ({
  type: GET_USER_IN_TEAM_REQUEST,
  payload,
});

export const getUserInTeamSuccess = (payload) => ({
  type: GET_USER_IN_TEAM_SUCCESS,
  payload,
});

export const getUserInTeamFailure = (payload) => ({
  type: GET_USER_IN_TEAM_FAILURE,
  payload,
});

export const getListObserverRequest = (payload) => ({
  type: GET_LIST_OBSERVER_REQUEST,
  payload,
});

export const getListObserverSuccess = (payload) => ({
  type: GET_LIST_OBSERVER_SUCCESS,
  payload,
});

export const getListObserverFailure = (payload) => ({
  type: GET_LIST_OBSERVER_FAILURE,
  payload,
});

export const getTeamInspectionRequest = (payload) => ({
  type: GET_TEAM_INSPECTION_REQUEST,
  payload,
});

export const getTeamInspectionSuccess = (payload) => ({
  type: GET_TEAM_INSPECTION_SUCCESS,
  payload,
});

export const getTeamInspectionFailure = (payload) => ({
  type: GET_TEAM_INSPECTION_FAILURE,
  payload,
});

export const getTeamAttendanceRequest = (payload) => ({
  type: GET_TEAM_ATTENDANCE_REQUEST,
  payload,
});

export const getTeamAttendanceSuccess = (payload) => ({
  type: GET_TEAM_ATTENDANCE_SUCCESS,
  payload,
});

export const getTeamAttendanceFailure = (payload) => ({
  type: GET_TEAM_ATTENDANCE_FAILURE,
  payload,
});

export const getTeamPMLinkageRequest = (payload) => ({
  type: GET_TEAM_PM_LINKAGE_REQUEST,
  payload,
});

export const getTeamPMLinkageSuccess = (payload) => ({
  type: GET_TEAM_PM_LINKAGE_SUCCESS,
  payload,
});

export const getTeamPMLinkageFailure = (payload) => ({
  type: GET_TEAM_PM_LINKAGE_FAILURE,
  payload,
});
