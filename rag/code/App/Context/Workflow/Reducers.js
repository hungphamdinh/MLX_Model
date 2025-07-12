import { INSPECTION_STATUS } from '../../Config/Constants';
import {
  GET_WORKFLOW_SETTINGS_FAILURE,
  GET_WORKFLOW_SETTINGS_REQUEST,
  GET_WORKFLOW_SETTINGS_SUCCESS,
  GET_WORKFLOW_STATUS,
} from './Actions';

export const INITIAL_STATE = {
  statusList: [],
  priorities: [],
  tracker: [],
  fields: [],
  error: undefined,
  isLoading: false,
  workflowStatusId: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_WORKFLOW_SETTINGS_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case GET_WORKFLOW_SETTINGS_SUCCESS: {
      const { statusList } = action.payload;
      const newStatus = statusList.find((item) => item.code === INSPECTION_STATUS.NEW)?.id;
      const inProgress = statusList.find((item) => item.code === INSPECTION_STATUS.INPROGRESS)?.id;
      const completed = statusList.find((item) => item.isIssueClosed || item.code === INSPECTION_STATUS.COMPLETED)?.id;
      return {
        ...state,
        ...action.payload,
        workflowStatusId: {
          newStatus,
          inProgress,
          completed,
        },
      };
    }

    case GET_WORKFLOW_SETTINGS_FAILURE:
      return {
        ...state,
        error: action.payload,
      };

    case GET_WORKFLOW_STATUS.SUCCESS:
      return {
        ...state,
        statusList: action.payload,
      };

    default:
      return state;
  }
};
