import _ from 'lodash';
import {
  DETAIL_PM_FAILURE,
  DETAIL_PM_REQUEST,
  DETAIL_PM_SUCCESS,
  GET_ALL_PM_FAILURE,
  GET_ALL_PM_REQUEST,
  GET_ALL_PM_SUCCESS,
  GET_TEAM_PLANS_FAILURE,
  GET_TEAM_PLANS_SUCCESS,
  GET_TEAM_PLANS_REQUEST,
  GET_ASSETS_PLAN_SUCCESS,
  GET_ASSETS_PLAN_FAILURE,
  GET_ASSETS_PLAN_REQUEST,
  GET_SUB_CATEGORIES_FAILURE,
  GET_SUB_CATEGORIES_REQUEST,
  GET_SUB_CATEGORIES_SUCCESS,
  GET_FILTER_PLAN_CATEGORIES_FAILURE,
  GET_FILTER_PLAN_CATEGORIES_SUCCESS,
  GET_PLAN_TASK_FAILURE,
  GET_PLAN_TASK_REQUEST,
  GET_PLAN_TASK_SUCCESS,
  GET_CATEGORIES_PLAN_FAILURE,
  GET_CATEGORIES_PLAN_SUCCESS,
  GET_CATEGORIES_PLAN_REQUEST,
  GET_MY_PM_REQUEST,
  GET_MY_PM_FAILURE,
  GET_MY_PM_SUCCESS,
  GET_MY_PLAN_TASK_REQUEST,
  GET_MY_PLAN_TASK_SUCCESS,
  GET_MY_PLAN_TASK_FAILURE,
  DETAIL_TASK_REQUEST,
  DETAIL_TASK_FAILURE,
  DETAIL_TASK_SUCCESS,
  GET_TASK_STATUS_SUCCESS,
  GET_TASKS_IN_PM_REQUEST,
  GET_TASKS_IN_PM_SUCCESS,
  GET_TASKS_IN_PM_FAILURE,
  GET_ASSET_DETAIL_SUCCESS,
  GET_LIST_ASSETS_FAILURE,
  GET_LIST_ASSETS_SUCCESS,
  GET_LIST_ASSETS_REQUEST,
  ADD_PM_FAILURE,
  ADD_PM_SUCCESS,
  ADD_PM_REQUEST,
  EDIT_PM_FAILURE,
  EDIT_PM_SUCCESS,
  EDIT_PM_REQUEST,
  EDIT_TASK_FAILURE,
  EDIT_TASK_SUCCESS,
  EDIT_TASK_REQUEST,
  ADD_TASK_FAILURE,
  ADD_TASK_SUCCESS,
  ADD_TASK_REQUEST,
  GET_ASSET_DETAIL_REQUEST,
  GET_ASSET_DETAIL_FAILURE,
  DELETE_TASK_FAILURE,
  DELETE_TASK_SUCCESS,
  DELETE_TASK_REQUEST,
  GET_MY_TEAM_PM_FAILURE,
  GET_MY_TEAM_PM_SUCCESS,
  GET_MY_TEAM_PM_REQUEST,
  GET_PRIORITIES_REQUEST,
  GET_PRIORITIES_SUCCESS,
  GET_PRIORITIES_FAILURE,
  UPDATE_ITEM_PM_FAILURE,
  UPDATE_ITEM_PM_SUCCESS,
  UPDATE_ITEM_PM_REQUEST,
  CREATE_PM_REQUEST,
  CREATE_PM_FAILURE,
  CREATE_PM_SUCCESS,
  FILTER_LIST_SYNC,
  SET_PM_USER_ID,
  RESET_ASSET_DETAIL_REQUEST,
  GET_TASK_PRIORITIES,
} from './Actions';
import ListModel from '../Model/ListModel';
import { SWITCH_TO_USER_ACCOUNT_SUCCESS } from '../User/Actions';

export const INITIAL_STATE = {
  list: new ListModel(),
  myList: new ListModel(),
  myTeamList: new ListModel(),
  taskList: new ListModel(),
  myTaskList: new ListModel(),
  pmTasks: new ListModel(),
  error: undefined,
  pmDetail: undefined,
  taskDetail: undefined,
  taskStatus: [],
  taskStatusIdDefault: undefined,
  groupCategories: [],
  assetPlans: new ListModel(),
  teamPlans: [],
  priorities: [],
  sources: [],
  statusList: [],
  areas: [],
  planCategories: {},
  subCategories: [],
  assetDetail: null,
  listAssets: new ListModel(),
  defaultStatusId: {},
  workflowLinkage: [],
  pmUserId: null,
  taskPriorities: [],
};

function handleStatusWorkflow(item) {
  if (item.workflowInspections) {
    item.inspectionsCompleted = item.workflowInspections.filter((child) => {
      child.name = `${child.workflow.parentId} - ${child.workflow.subject}`;
      if (child.workflow.status?.isIssueClosed) {
        return true;
      }
      return false;
    });
  } else {
    item.inspectionsCompleted = [];
  }

  if (item.workflowInspections) {
    item.inspectionsInProgress = item.workflowInspections.filter((child) => {
      child.name = `${child.workflow.parentId} - ${child.workflow.subject}`;
      if (!child.workflow.status?.isIssueClosed && child.canStartInspection) {
        return true;
      }
      return false;
    });
  } else {
    item.inspectionsInProgress = [];
  }
}

const filterUnSyncInspection = (syncs, workflowLinkage) => {
  syncs.map((itemSync) => {
    workflowLinkage.forEach((workflow) => {
      if (itemSync.remoteId === workflow.workflow.id) {
        workflow.workflow = itemSync;
      }
      return null;
    });
    return null;
  });
  return workflowLinkage;
};
function initInspection(items, userId) {
  items.forEach((item) => {
    handleStatusWorkflow(item, userId);
  });
}

const loadingItem = (list, id, isLoading = true, data) =>
  list.data.forEach((item) => {
    if (item.id === id) {
      item.isLoading = isLoading;
      if (data) {
        item.inspectionsCompleted = data.inspectionsCompleted;
        item.inspectionsInProgress = data.inspectionsInProgress;
      }
    }
    return null;
  });

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SWITCH_TO_USER_ACCOUNT_SUCCESS:
      return INITIAL_STATE;

    case GET_ALL_PM_REQUEST: {
      const { list } = state;
      list.setPage(action.payload?.page);
      return {
        ...state,
        list: _.cloneDeep(list),
      };
    }

    case GET_ALL_PM_SUCCESS: {
      const { list, pmUserId } = state;
      list.setData(action.payload);
      initInspection(action.payload.items, pmUserId);
      return {
        ...state,
        list: _.cloneDeep(list),
      };
    }

    case GET_ALL_PM_FAILURE:
      return {
        ...state,
        error: action.payload,
      };

    case GET_MY_PM_REQUEST: {
      const { myList } = state;
      myList.setPage(action.payload?.page);
      return {
        ...state,
        myList: _.cloneDeep(myList),
      };
    }

    case GET_MY_PM_SUCCESS: {
      const { myList, pmUserId } = state;
      myList.setData(action.payload);
      initInspection(action.payload.items, pmUserId);
      return {
        ...state,
        myList: _.cloneDeep(myList),
      };
    }

    case GET_MY_PM_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    case GET_MY_TEAM_PM_REQUEST: {
      const { myTeamList } = state;
      myTeamList.setPage(action.payload?.page);
      return {
        ...state,
        myTeamList: _.cloneDeep(myTeamList),
      };
    }

    case GET_MY_TEAM_PM_SUCCESS: {
      const { myTeamList, pmUserId } = state;
      myTeamList.setData(action.payload);
      initInspection(action.payload.items, pmUserId);
      return {
        ...state,
        myTeamList: _.cloneDeep(myTeamList),
      };
    }

    case GET_MY_TEAM_PM_FAILURE:
      return {
        ...state,
        error: action.payload,
      };

    case GET_PLAN_TASK_REQUEST: {
      const { taskList } = state;
      taskList.setPage(action.payload?.page);
      return {
        ...state,
        taskList: _.cloneDeep(taskList),
      };
    }

    case GET_PLAN_TASK_SUCCESS: {
      const { taskList } = state;
      taskList.setData(action.payload);
      return {
        ...state,
        taskList: _.cloneDeep(taskList),
      };
    }

    case GET_PLAN_TASK_FAILURE:
      return {
        ...state,
        error: action.payload,
      };

    case GET_MY_PLAN_TASK_REQUEST: {
      const { myTaskList } = state;
      myTaskList.setPage(action.payload?.page);
      return {
        ...state,
        myTaskList: _.cloneDeep(myTaskList),
      };
    }

    case GET_MY_PLAN_TASK_SUCCESS: {
      const { myTaskList } = state;
      myTaskList.setData(action.payload);
      return {
        ...state,
        myTaskList: _.cloneDeep(myTaskList),
      };
    }

    case GET_MY_PLAN_TASK_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    case DETAIL_PM_REQUEST: {
      return {
        ...state,
        files: [],
        isLoading: true,
        pmDetail: false,
      };
    }

    case DETAIL_PM_SUCCESS: {
      handleStatusWorkflow(action.payload, state.pmUserId);
      return {
        ...state,
        pmDetail: action.payload,
        isLoading: false,
        workflowLinkage: action.payload.workflowInspections,
      };
    }

    case DETAIL_PM_FAILURE:
      return {
        ...state,
        isLoading: false,
      };

    case FILTER_LIST_SYNC: {
      const { workflowLinkage } = state;
      const data = filterUnSyncInspection(action.payload, workflowLinkage);
      return {
        ...state,
        workflowLinkage: data,
      };
    }
    case UPDATE_ITEM_PM_REQUEST: {
      const data = action.payload;
      loadingItem(data.list, data.id);
      return {
        ...state,
        // list,
      };
    }

    case UPDATE_ITEM_PM_SUCCESS: {
      const data = action.payload;
      handleStatusWorkflow(data.pmDetail, state.pmUserId);
      loadingItem(data.list, data.id, false, data.pmDetail);

      return {
        ...state,
        // list,
      };
    }

    case UPDATE_ITEM_PM_FAILURE: {
      const data = action.payload;
      loadingItem(data.list, data.id, false);
      return {
        ...state,
        // list,
      };
    }
    case GET_ASSETS_PLAN_REQUEST: {
      const { assetPlans } = state;
      assetPlans.setPage(action.payload?.page);
      return {
        ...state,
        assetPlans: _.cloneDeep(assetPlans),
      };
    }

    case GET_ASSETS_PLAN_SUCCESS: {
      const { assetPlans, pmUserId } = state;
      assetPlans.setData(action.payload);
      initInspection(action.payload.items, pmUserId);
      return {
        ...state,
        assetPlans: _.cloneDeep(assetPlans),
      };
    }

    case GET_ASSETS_PLAN_FAILURE:
      return {
        ...state,
      };

    case GET_LIST_ASSETS_REQUEST: {
      const { listAssets } = state;
      listAssets.setPage(action.payload?.page);
      return {
        ...state,
        listAssets: _.cloneDeep(listAssets),
      };
    }

    case GET_LIST_ASSETS_SUCCESS: {
      const { listAssets } = state;
      listAssets.setData(action.payload);
      return {
        ...state,
        listAssets: _.cloneDeep(listAssets),
      };
    }

    case GET_LIST_ASSETS_FAILURE:
      return {
        ...state,
      };

    case GET_FILTER_PLAN_CATEGORIES_SUCCESS: {
      const defaultStatusId = _.get(
        action.payload.status.data.find((item) => item.isDefault),
        'id'
      );
      return {
        ...state,
        groupCategories: action.payload,
        defaultStatusId,
      };
    }

    case GET_FILTER_PLAN_CATEGORIES_FAILURE:
      return {
        ...state,
      };

    case GET_TEAM_PLANS_REQUEST: {
      return {
        ...state,
        teamPlans: [],
      };
    }

    case GET_TEAM_PLANS_SUCCESS: {
      return {
        ...state,
        teamPlans: action.payload,
      };
    }

    case GET_TEAM_PLANS_FAILURE:
      return {
        ...state,
      };

    case GET_CATEGORIES_PLAN_REQUEST: {
      return {
        ...state,
        planCategories: {},
      };
    }

    case GET_CATEGORIES_PLAN_SUCCESS: {
      return {
        ...state,
        planCategories: action.payload,
      };
    }

    case GET_CATEGORIES_PLAN_FAILURE:
      return {
        ...state,
      };

    case GET_SUB_CATEGORIES_REQUEST: {
      return {
        ...state,
        subCategories: [],
      };
    }

    case GET_SUB_CATEGORIES_SUCCESS: {
      return {
        ...state,
        subCategories: action.payload,
      };
    }

    case GET_SUB_CATEGORIES_FAILURE:
      return {
        ...state,
      };

    case DETAIL_TASK_REQUEST: {
      return {
        ...state,
        taskDetail: undefined,
        isLoading: true,
      };
    }

    case DETAIL_TASK_SUCCESS: {
      return {
        ...state,
        taskDetail: action.payload,
        isLoading: false,
      };
    }

    case DETAIL_TASK_FAILURE:
      return {
        ...state,
        isLoading: false,
      };

    case GET_TASK_STATUS_SUCCESS: {
      const { payload } = action;
      const taskStatusIdDefault = _.get(
        payload.find((item) => item.isDefault === true),
        'id'
      );
      return {
        ...state,
        taskStatus: action.payload,
        taskStatusIdDefault,
      };
    }

    case GET_TASKS_IN_PM_REQUEST: {
      const { pmTasks } = state;
      pmTasks.setPage(1);
      return {
        ...state,
        pmTasks: _.cloneDeep(pmTasks),
      };
    }

    case GET_TASKS_IN_PM_SUCCESS: {
      const { pmTasks } = state;
      pmTasks.setData(action.payload);
      return {
        ...state,
        pmTasks: _.cloneDeep(pmTasks),
      };
    }

    case GET_TASKS_IN_PM_FAILURE:
      return {
        ...state,
        error: action.payload,
      };

    case GET_ASSET_DETAIL_REQUEST:
      return {
        ...state,
        isLoading: true,
        assetDetail: null,
      };

    case GET_ASSET_DETAIL_SUCCESS:
      return {
        ...state,
        assetDetail: action.payload,
        isLoading: false,
      };

    case GET_ASSET_DETAIL_FAILURE:
      return {
        ...state,
        isLoading: false,
      };

    case RESET_ASSET_DETAIL_REQUEST:
      return {
        ...state,
        assetDetail: null,
      };

    case ADD_PM_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case ADD_PM_SUCCESS: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case ADD_PM_FAILURE:
      return {
        ...state,
        isLoading: false,
      };

    case CREATE_PM_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case CREATE_PM_SUCCESS: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case CREATE_PM_FAILURE:
      return {
        ...state,
        isLoading: false,
      };

    case EDIT_PM_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case EDIT_PM_SUCCESS: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case EDIT_PM_FAILURE:
      return {
        ...state,
        isLoading: false,
      };
    case ADD_TASK_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case ADD_TASK_SUCCESS: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case ADD_TASK_FAILURE:
      return {
        ...state,
        isLoading: false,
      };

    case EDIT_TASK_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case EDIT_TASK_SUCCESS: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case EDIT_TASK_FAILURE:
      return {
        ...state,
        isLoading: false,
      };
    case DELETE_TASK_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case DELETE_TASK_SUCCESS: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case DELETE_TASK_FAILURE:
      return {
        ...state,
        isLoading: false,
      };

    case GET_PRIORITIES_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case GET_PRIORITIES_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        priorities: action.payload,
      };
    }

    case GET_PRIORITIES_FAILURE:
      return {
        ...state,
        isLoading: false,
      };

    case SET_PM_USER_ID:
      return {
        ...state,
        pmUserId: action.payload,
      };

    case GET_TASK_PRIORITIES.SUCCESS: {
      return {
        ...state,
        taskPriorities: action.payload,
      };
    }

    default:
      return state;
  }
};
