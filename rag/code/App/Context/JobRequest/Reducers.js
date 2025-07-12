import _ from 'lodash';
import {
  DETAIL_JR_FAILURE,
  DETAIL_JR_REQUEST,
  DETAIL_JR_SUCCESS,
  GET_ALL_JR_FAILURE,
  GET_ALL_JR_REQUEST,
  GET_ALL_JR_SUCCESS,
  GET_AREAS_FAILURE,
  GET_AREAS_REQUEST,
  GET_AREAS_SUCCESS,
  GET_COUNT_STATUS_FAILURE,
  GET_COUNT_STATUS_REQUEST,
  GET_COUNT_STATUS_SUCCESS,
  GET_SUB_CATEGORIES_FAILURE,
  GET_SUB_CATEGORIES_REQUEST,
  GET_SUB_CATEGORIES_SUCCESS,
  GET_GROUP_CATEGORIES_FAILURE,
  GET_GROUP_CATEGORIES_REQUEST,
  GET_GROUP_CATEGORIES_SUCCESS,
  GET_MY_JR_FAILURE,
  GET_MY_JR_REQUEST,
  GET_MY_JR_SUCCESS,
  GET_CATEGORIES_FAILURE,
  GET_CATEGORIES_REQUEST,
  GET_CATEGORIES_SUCCESS,
  GET_QUICK_JR_SETTING_FAILURE,
  GET_QUICK_JR_SETTING_SUCCESS,
  GET_QUICK_JR_SETTING_REQUEST,
  GET_MY_TASKS_FAILURE,
  GET_MY_TASKS_SUCCESS,
  GET_MY_TASKS_REQUEST,
  GET_TASKS_FAILURE,
  GET_TASKS_SUCCESS,
  GET_TASKS_REQUEST,
  DETAIL_TASK,
  GET_TASK_COUNT_STATUS_FAILURE,
  GET_TASK_COUNT_STATUS_SUCCESS,
  GET_TASK_COUNT_STATUS_REQUEST,
  GET_TASKS_IN_JR_REQUEST,
  GET_TASKS_IN_JR_FAILURE,
  GET_TASKS_IN_JR_SUCCESS,
  DELETE_TASK_FAILURE,
  DELETE_TASK_SUCCESS,
  DELETE_TASK_REQUEST,
  EDIT_TASK_FAILURE,
  EDIT_TASK_SUCCESS,
  EDIT_TASK_REQUEST,
  ADD_TASK_FAILURE,
  ADD_TASK_SUCCESS,
  ADD_TASK_REQUEST,
  ADD_QUICK_JR_FAILURE,
  ADD_QUICK_JR_SUCCESS,
  ADD_QUICK_JR_REQUEST,
  GET_TARGET_DATE_TIME_FAILURE,
  GET_TARGET_DATE_TIME_SUCCESS,
  GET_TARGET_DATE_TIME_REQUEST,
  GET_SLA_SETTINGS_FAILURE,
  GET_SLA_SETTINGS_SUCCESS,
  GET_SLA_SETTINGS_REQUEST,
  GET_FORM_SIGNING_JR_FAILURE,
  GET_FORM_SIGNING_JR_SUCCESS,
  GET_FORM_SIGNING_JR_REQUEST,
  SET_VISIBLE_PREVIEW_MODAL,
  SET_VISIBLE_SIGNING_MODAL,
  UPLOAD_FILE_SIGNATURE_JR_FAILURE,
  UPLOAD_FILE_SIGNATURE_JR_REQUEST,
  UPLOAD_FILE_SIGNATURE_JR_SUCCESS,
  PREVIEW_REPORT_FAILURE,
  PREVIEW_REPORT_REQUEST,
  PREVIEW_REPORT_SUCCESS,
  GET_JR_ASSETS,
  GET_JR_ASSETS_BY_UNIT,
  GET_JR_SETTING,
  GET_VENDORS,
  CLEAR_JOB_REQUEST_DETAIL,
  GET_ASSET_JR_HISTORY,
} from './Actions';
import ListModel from '../Model/ListModel';
import { JR_SIGN_TYPE } from '../../Config/Constants';
import { SWITCH_TO_USER_ACCOUNT_SUCCESS } from '../User/Actions';

export const INITIAL_STATE = {
  list: new ListModel(),
  myList: new ListModel(),
  myTeamList: new ListModel(),
  tasks: new ListModel(),
  myTasks: new ListModel(),
  jrTasks: new ListModel(),
  error: undefined,
  jrDetail: undefined,
  taskDetail: undefined,
  groupCategories: [],
  countStatus: [],
  paymentStatusList: [],
  priorities: [],
  sources: [],
  statusList: [],
  areas: [],
  categories: [],
  subCategories: [],
  sourceIdDefault: undefined,
  priorityIdDefault: undefined,
  statusIdDefault: undefined,
  taskStatusIdDefault: undefined,
  quickJRSetting: {
    settingsCommons: [],
  },
  taskCountStatus: [],
  isLoading: false,
  targetTime: null,
  slaSettings: {},
  jrFormSigning: {},
  signingVisible: false,
  previewVisible: false,
  jrSetting: null,
  vendors: [],
  jrHistorylist: new ListModel(),
};

const checkSigning = (jrData) => {
  const haveOfficeSigning =
    (jrData?.signature || []).findIndex((item) => item.title === JR_SIGN_TYPE.OFFICE_SIGNING) > -1;
  const haveMaintenanceSigning =
    (jrData?.signature || []).findIndex((item) => item.title === JR_SIGN_TYPE.MAINTENANCE_SIGNING) > -1;
  return {
    ...jrData,
    haveOfficeSigning,
    haveMaintenanceSigning,
  };
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SWITCH_TO_USER_ACCOUNT_SUCCESS:
      return INITIAL_STATE;

    case GET_ALL_JR_REQUEST: {
      const { list } = state;
      list.setPage(action.payload?.page);
      return {
        ...state,
        list: _.cloneDeep(list),
      };
    }

    case GET_ALL_JR_SUCCESS: {
      const { list } = state;
      const data = {
        ...action.payload,
        items: action.payload.items.map((item) => checkSigning(item)),
      };
      list.setData(data);
      return {
        ...state,
        list: _.cloneDeep(list),
      };
    }

    case GET_ALL_JR_FAILURE:
      return {
        ...state,
        error: action.payload,
      };

    case GET_MY_JR_REQUEST: {
      const name = action.payload.isAssignee ? 'myList' : 'myTeamList';
      const list = state[name];
      list.setPage(action.payload?.page);
      return {
        ...state,
        [name]: _.cloneDeep(list),
      };
    }

    case GET_MY_JR_SUCCESS: {
      const { isAssignee, result } = action.payload;
      const name = isAssignee ? 'myList' : 'myTeamList';
      const list = state[name];
      const newResult = {
        ...result,
        items: result.items.map((item) => checkSigning(item)),
      };
      list.setData(newResult);
      return {
        ...state,
        [name]: _.cloneDeep(list),
      };
    }

    case GET_MY_JR_FAILURE:
      return {
        ...state,
        error: action.payload,
      };

    case GET_SLA_SETTINGS_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case GET_SLA_SETTINGS_SUCCESS: {
      return {
        ...state,
        slaSettings: action.payload,
        isLoading: false,
      };
    }

    case GET_SLA_SETTINGS_FAILURE:
      return {
        ...state,
        isLoading: false,
      };

    case GET_TARGET_DATE_TIME_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case GET_TARGET_DATE_TIME_SUCCESS: {
      return {
        ...state,
        targetTime: action.payload,
        isLoading: false,
      };
    }

    case GET_TARGET_DATE_TIME_FAILURE:
      return {
        ...state,
        isLoading: false,
      };

    case DETAIL_JR_REQUEST: {
      return {
        ...state,
        jrDetail: undefined,
        isLoading: true,
      };
    }

    case DETAIL_JR_SUCCESS: {
      return {
        ...state,
        jrDetail: checkSigning(action.payload),
        isLoading: false,
      };
    }

    case DETAIL_JR_FAILURE:
      return {
        ...state,
        isLoading: false,
      };

    case GET_FORM_SIGNING_JR_REQUEST: {
      return {
        ...state,
        jrFormSigning: undefined,
        isLoading: true,
      };
    }

    case GET_FORM_SIGNING_JR_SUCCESS: {
      return {
        ...state,
        jrFormSigning: action.payload,
        isLoading: false,
      };
    }

    case GET_FORM_SIGNING_JR_FAILURE:
      return {
        ...state,
        isLoading: false,
      };

    case GET_COUNT_STATUS_REQUEST: {
      return {
        ...state,
        countStatus: undefined,
      };
    }

    case GET_COUNT_STATUS_SUCCESS: {
      return {
        ...state,
        countStatus: action.payload,
      };
    }

    case GET_COUNT_STATUS_FAILURE:
      return {
        ...state,
      };
    case GET_GROUP_CATEGORIES_REQUEST: {
      return {
        ...state,
        groupCategories: undefined,
      };
    }

    case GET_GROUP_CATEGORIES_SUCCESS: {
      const { source, priorities, paymentStatus, status } = action.payload;
      const sourceIdDefault = _.get(
        source.find((item) => item.isDefault === true),
        'id'
      );
      const priorityIdDefault = _.get(
        priorities.find((item) => item.isDefault === true),
        'id'
      );
      const statusIdDefault = _.get(
        status.find((item) => item.isDefault === true),
        'id'
      );
      return {
        ...state,
        sources: source,
        priorities,
        paymentStatusList: paymentStatus,
        statusList: status,
        sourceIdDefault,
        priorityIdDefault,
        statusIdDefault,
      };
    }

    case GET_GROUP_CATEGORIES_FAILURE:
      return {
        ...state,
      };

    case GET_AREAS_REQUEST: {
      return {
        ...state,
        areas: [],
      };
    }

    case GET_AREAS_SUCCESS: {
      return {
        ...state,
        areas: action.payload,
      };
    }

    case GET_AREAS_FAILURE:
      return {
        ...state,
      };

    case GET_CATEGORIES_REQUEST: {
      return {
        ...state,
        categories: [],
      };
    }

    case GET_CATEGORIES_SUCCESS: {
      return {
        ...state,
        categories: action.payload,
      };
    }

    case GET_CATEGORIES_FAILURE:
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

    case GET_QUICK_JR_SETTING_REQUEST: {
      return {
        ...state,
      };
    }

    case GET_QUICK_JR_SETTING_SUCCESS: {
      return {
        ...state,
        quickJRSetting: action.payload,
      };
    }

    case GET_QUICK_JR_SETTING_FAILURE:
      return {
        ...state,
      };

    case GET_TASKS_REQUEST: {
      const { tasks } = state;
      tasks.setPage(action.payload?.page);
      return {
        ...state,
        tasks: _.cloneDeep(tasks),
      };
    }

    case GET_TASKS_SUCCESS: {
      const { tasks } = state;
      tasks.setData(action.payload);
      return {
        ...state,
        tasks: _.cloneDeep(tasks),
      };
    }

    case GET_TASKS_FAILURE:
      return {
        ...state,
        error: action.payload,
      };

    case GET_MY_TASKS_REQUEST: {
      const { myTasks } = state;
      myTasks.setPage(action.payload?.page);
      return {
        ...state,
        myTasks: _.cloneDeep(myTasks),
      };
    }

    case GET_MY_TASKS_SUCCESS: {
      const { myTasks } = state;
      myTasks.setData(action.payload);
      return {
        ...state,
        myTasks: _.cloneDeep(myTasks),
      };
    }

    case GET_MY_TASKS_FAILURE:
      return {
        ...state,
        error: action.payload,
      };

    case DETAIL_TASK.REQUEST: {
      return {
        ...state,
        taskDetail: undefined,
      };
    }

    case DETAIL_TASK.SUCCESS: {
      return {
        ...state,
        taskDetail: action.payload,
      };
    }


    case GET_TASK_COUNT_STATUS_REQUEST: {
      return {
        ...state,
        taskCountStatus: undefined,
      };
    }

    case GET_TASK_COUNT_STATUS_SUCCESS: {
      const { payload } = action;
      const taskStatusIdDefault = _.get(
        payload.find((item) => item.isDefault === true),
        'id'
      );
      return {
        ...state,
        taskCountStatus: action.payload,
        taskStatusIdDefault,
      };
    }

    case GET_TASK_COUNT_STATUS_FAILURE:
      return {
        ...state,
      };

    case GET_TASKS_IN_JR_REQUEST: {
      const { jrTasks } = state;
      jrTasks.setPage(1);
      return {
        ...state,
        jrTasks: _.cloneDeep(jrTasks),
      };
    }

    case GET_TASKS_IN_JR_SUCCESS: {
      const { jrTasks } = state;
      jrTasks.setData({
        items: action.payload,
      });
      return {
        ...state,
        jrTasks: _.cloneDeep(jrTasks),
      };
    }

    case GET_TASKS_IN_JR_FAILURE:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_QUICK_JR_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case ADD_QUICK_JR_SUCCESS:
      return {
        ...state,
        isLoading: false,
      };
    case ADD_QUICK_JR_FAILURE:
      return {
        ...state,
        isLoading: false,
      };

    case ADD_TASK_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case ADD_TASK_SUCCESS:
      return {
        ...state,
        isLoading: false,
      };
    case ADD_TASK_FAILURE:
      return {
        ...state,
        isLoading: false,
      };

    case EDIT_TASK_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case EDIT_TASK_SUCCESS:
      return {
        ...state,
        isLoading: false,
      };
    case EDIT_TASK_FAILURE:
      return {
        ...state,
        isLoading: false,
      };

    case DELETE_TASK_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case DELETE_TASK_SUCCESS:
      return {
        ...state,
        isLoading: false,
      };
    case DELETE_TASK_FAILURE:
      return {
        ...state,
        isLoading: false,
      };

    case SET_VISIBLE_SIGNING_MODAL: {
      return {
        ...state,
        signingVisible: action.payload,
      };
    }

    case SET_VISIBLE_PREVIEW_MODAL: {
      return {
        ...state,
        previewVisible: action.payload,
      };
    }

    case PREVIEW_REPORT_REQUEST:
      return {
        ...state,
        isLoading: true,
      };

    case PREVIEW_REPORT_SUCCESS:
      return {
        ...state,
        isLoading: false,
      };

    case PREVIEW_REPORT_FAILURE:
      return {
        ...state,
        isLoading: false,
      };

    case UPLOAD_FILE_SIGNATURE_JR_REQUEST:
      return {
        ...state,
        isLoading: true,
      };

    case UPLOAD_FILE_SIGNATURE_JR_SUCCESS:
      return {
        ...state,
        isLoading: false,
      };

    case UPLOAD_FILE_SIGNATURE_JR_FAILURE:
      return {
        ...state,
        isLoading: false,
      };

    case GET_JR_SETTING.SUCCESS:
      return {
        ...state,
        jrSetting: action.payload,
      };

    case GET_VENDORS.REQUEST: {
      return {
        ...state,
        vendors: [],
      };
    }

    case GET_VENDORS.SUCCESS: {
      return {
        ...state,
        vendors: action.payload,
      };
    }

    case CLEAR_JOB_REQUEST_DETAIL: {
      return {
        ...state,
        jrDetail: undefined,
      };
    }

    case GET_ASSET_JR_HISTORY.REQUEST: {
      const { jrHistorylist } = state;
      jrHistorylist.setPage(action.payload?.page);
      return {
        ...state,
        jrHistorylist: _.cloneDeep(jrHistorylist),
      };
    }

    case GET_ASSET_JR_HISTORY.SUCCESS: {
      const { jrHistorylist } = state;
      const data = {
        ...action.payload,
        items: action.payload.items.map((item) => checkSigning(item)),
      };
      jrHistorylist.setData(data);
      return {
        ...state,
        jrHistorylist: _.cloneDeep(jrHistorylist),
      };
    }

    case GET_ASSET_JR_HISTORY.FAILURE:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};
