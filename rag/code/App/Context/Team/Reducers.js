import _ from 'lodash';
import {
  GET_ALL_TEAM_MEMBERS_FAILURE,
  GET_ALL_TEAM_MEMBERS_REQUEST,
  GET_ALL_TEAM_MEMBERS_SUCCESS,
  GET_LIST_OBSERVER_FAILURE,
  GET_LIST_OBSERVER_REQUEST,
  GET_LIST_OBSERVER_SUCCESS,
  GET_TEAMS_FAILURE,
  GET_TEAMS_REQUEST,
  GET_TEAMS_SUCCESS,
  GET_USER_IN_TEAM_FAILURE,
  GET_USER_IN_TEAM_REQUEST,
  GET_USER_IN_TEAM_SUCCESS,
  GET_TEAM_INSPECTION_SUCCESS,
  GET_TEAM_ATTENDANCE_FAILURE,
  GET_TEAM_ATTENDANCE_SUCCESS,
  GET_TEAM_ATTENDANCE_REQUEST,
  GET_TEAM_PM_LINKAGE_FAILURE,
  GET_TEAM_PM_LINKAGE_REQUEST,
  GET_TEAM_PM_LINKAGE_SUCCESS,
  GET_TEAMS_BY_USERS,
} from './Actions';
import ListModel from '../Model/ListModel';
import { transformWithCOTags } from '../../Utils/func';

export const INITIAL_STATE = {
  allTeamMembers: new ListModel(),
  error: undefined,
  teams: [],
  teamLeadIds: [],
  usersInTeam: [],
  listObserver: [],
  attendanceTeams: [],
  inspectionTeams: [],
  assignedInspectionTeams: [],
  teamInspectionLinkages: [],
  teamsByUsers: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_ALL_TEAM_MEMBERS_REQUEST: {
      const { allTeamMembers } = state;
      allTeamMembers.setPage(action.payload?.page);
      return {
        ...state,
        allTeamMembers: _.cloneDeep(allTeamMembers),
      };
    }

    case GET_ALL_TEAM_MEMBERS_SUCCESS: {
      const { allTeamMembers } = state;
      allTeamMembers.setData(action.payload);
      return {
        ...state,
        allTeamMembers: _.cloneDeep(allTeamMembers),
      };
    }

    case GET_TEAM_INSPECTION_SUCCESS: {
      return {
        ...state,
        ...action.payload,
      };
    }

    case GET_ALL_TEAM_MEMBERS_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    case GET_TEAMS_REQUEST:
      return {
        ...state,
        teams: [],
      };
    case GET_TEAMS_SUCCESS:
      return {
        ...state,
        ...action.payload,
      };
    case GET_TEAMS_FAILURE:
      return {
        ...state,
      };
    case GET_USER_IN_TEAM_REQUEST:
      return {
        ...state,
        usersInTeam: [],
      };
    case GET_USER_IN_TEAM_SUCCESS:
      return {
        ...state,
        usersInTeam: action.payload,
      };
    case GET_USER_IN_TEAM_FAILURE:
      return {
        ...state,
      };
    case GET_LIST_OBSERVER_REQUEST:
      return {
        ...state,
        listObserver: [],
      };
    case GET_LIST_OBSERVER_SUCCESS:
      return {
        ...state,
        listObserver: action.payload,
      };
    case GET_LIST_OBSERVER_FAILURE:
      return {
        ...state,
      };
    case GET_TEAM_ATTENDANCE_REQUEST:
      return {
        ...state,
        attendanceTeams: [],
      };
    case GET_TEAM_ATTENDANCE_SUCCESS:
      return {
        ...state,
        attendanceTeams: action.payload,
      };
    case GET_TEAM_ATTENDANCE_FAILURE:
      return {
        ...state,
      };

    case GET_TEAM_PM_LINKAGE_REQUEST:
      return {
        ...state,
        teamInspectionLinkages: [],
      };

    case GET_TEAM_PM_LINKAGE_SUCCESS:
      return {
        ...state,
        teamInspectionLinkages: action.payload,
      };

    case GET_TEAM_PM_LINKAGE_FAILURE:
      return {
        ...state,
      };

    case GET_TEAMS_BY_USERS.SUCCESS:
      return {
        ...state,
        teamsByUsers: transformWithCOTags(action.payload, false),
      };
    default:
      return state;
  }
};
