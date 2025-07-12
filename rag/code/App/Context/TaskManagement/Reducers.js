import _ from 'lodash';
import ListModel from '../Model/ListModel';
import {
  GET_ASSIGNEE_LIST,
  GET_CURRENT_TEAMS,
  GET_COMMENT_BY_TASK,
  GET_MENTION_USER,
  GET_PRIORITY_LIST,
  GET_STATUS_LIST,
  GET_TASK_LIST,
  GET_TEAMS_BY_TENANT,
  GET_TASK_DETAIL,
  RESET_TASK_DETAIL,
  GET_USERS_IN_TEAMS_BY_TENANTS,
  GET_EMPLOYEES_BY_TENANT,
  GET_TEAMS_FOR_TASK_DETAIL,
  GET_TENANTS_TASK_DETAIL
} from './Actions';
import { transformWithCOTags } from '../../Utils/func';

export const INITIAL_STATE = {
  list: new ListModel(),
  statusList: [],
  priorityList: [],
  teamList: [],
  assigneeList: [],
  taskDetail: null,
  teams: [],
  comments: [],
  usersInTeams: [],
  mentionUsersDic: {},
  employeesByTenant: new ListModel(),
  teamsTaskDetail: [],
  tenantsDetail: new ListModel(),
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_TASK_LIST.REQUEST: {
      const { list } = state;
      list.setPage(action.payload?.page);
      return {
        ...state,
        list: _.cloneDeep(list),
      };
    }
    case GET_TASK_LIST.SUCCESS: {
      const { list } = state;
      list.setData(action.payload);
      return {
        ...state,
        list: _.cloneDeep(list),
      };
    }
    case GET_TASK_LIST.FAILURE:
      return {
        ...state,
        error: action.payload,
      };

    case GET_STATUS_LIST.SUCCESS:
      return {
        ...state,
        statusList: action.payload,
      };

    case GET_PRIORITY_LIST.SUCCESS:
      return {
        ...state,
        priorityList: action.payload,
      };

    case GET_TEAMS_BY_TENANT.SUCCESS:
      return {
        ...state,
        teamList: transformWithCOTags(action.payload, false),
      };

    case GET_TEAMS_FOR_TASK_DETAIL.SUCCESS:
      return {
        ...state,
        teamsTaskDetail: transformWithCOTags(action.payload, false),
      };

    case GET_CURRENT_TEAMS.SUCCESS:
      return {
        ...state,
        teamList: action.payload,
      };

    case GET_ASSIGNEE_LIST.SUCCESS:
      return {
        ...state,
        assigneeList: transformWithCOTags(action.payload),
      };

    case GET_TASK_DETAIL.SUCCESS:
      return {
        ...state,
        taskDetail: action.payload,
      };

    case GET_COMMENT_BY_TASK.SUCCESS:
      return {
        ...state,
        comments: action.payload,
      };

    case GET_MENTION_USER.SUCCESS: {
      const { mentionUsers, key } = action.payload;
      const { mentionUsersDic } = state;
      mentionUsersDic[key] = mentionUsers;
      return {
        ...state,
        mentionUsersDic,
      };
    }

    case RESET_TASK_DETAIL: {
      return {
        ...state,
        taskDetail: null,
      };
    }

    case GET_USERS_IN_TEAMS_BY_TENANTS.REQUEST:
      return {
        ...state,
        usersInTeams: [],
      };

    case GET_USERS_IN_TEAMS_BY_TENANTS.SUCCESS:
      return {
        ...state,
        usersInTeams: transformWithCOTags(action.payload),
      };

    case GET_EMPLOYEES_BY_TENANT.REQUEST: {
      const { employeesByTenant } = state;
      employeesByTenant.setPage(action.payload?.page);
      return {
        ...state,
        employeesByTenant: _.cloneDeep(employeesByTenant),
      };
    }

    case GET_EMPLOYEES_BY_TENANT.SUCCESS: {
      const { employeesByTenant } = state;
      action.payload.items = transformWithCOTags(action.payload.items, false)
      employeesByTenant.setData(action.payload);
      return {
        ...state,
        employeesByTenant: _.cloneDeep(employeesByTenant),
      };
    }

    case GET_TENANTS_TASK_DETAIL.REQUEST: {
      const { tenantsDetail } = state;
      // no load more
      tenantsDetail.setPage(1);
      tenantsDetail.totalPage = 1;
      return {
        ...state,
        tenantsDetail: _.cloneDeep(tenantsDetail),
      };
    }
    case GET_TENANTS_TASK_DETAIL.SUCCESS: {
      const { tenantsDetail } = state;
      tenantsDetail.setData(action.payload);
      tenantsDetail.totalPage = 1;
      return {
        ...state,
        tenantsDetail: _.cloneDeep(tenantsDetail),
      };
    }

    default:
      return state;
  }
};
