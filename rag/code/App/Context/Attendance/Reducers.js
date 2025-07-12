import _ from 'lodash';
import {
  DETAIL_ATTENDANCE_FAILURE,
  DETAIL_ATTENDANCE_REQUEST,
  DETAIL_ATTENDANCE_SUCCESS,
  GET_ALL_ATTENDANCES_FAILURE,
  GET_ALL_ATTENDANCES_REQUEST,
  GET_ALL_ATTENDANCES_SUCCESS,
  GET_DISTANCE_AREA_FAILURE,
  GET_DISTANCE_AREA_REQUEST,
  GET_DISTANCE_AREA_SUCCESS,
  GET_CURRENT_LOCATION_FAILURE,
  GET_CURRENT_LOCATION_REQUEST,
  GET_CURRENT_LOCATION_SUCCESS,
  CHECK_OUT_LOCATION_FAILURE,
  CHECK_OUT_LOCATION_SUCCESS,
  CHECK_OUT_LOCATION_REQUEST,
  CHECK_IN_LOCATION_FAILURE,
  CHECK_IN_LOCATION_SUCCESS,
  CHECK_IN_LOCATION_REQUEST,
} from './Actions';
import ListModel from '../Model/ListModel';
import { SWITCH_TO_USER_ACCOUNT_SUCCESS } from '../User/Actions';

export const INITIAL_STATE = {
  attendances: new ListModel(),
  attendanceListDetail: new ListModel(),
  error: undefined,
  distanceArea: undefined,
  currentLocation: undefined,
  isLoading: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SWITCH_TO_USER_ACCOUNT_SUCCESS:
      return INITIAL_STATE;

    case GET_ALL_ATTENDANCES_REQUEST: {
      const { attendances } = state;
      attendances.setPage(action.payload?.page);
      return {
        ...state,
        attendances: _.cloneDeep(attendances),
      };
    }

    case GET_ALL_ATTENDANCES_SUCCESS: {
      const { attendances } = state;
      attendances.setData(action.payload);
      return {
        ...state,
        attendances: _.cloneDeep(attendances),
      };
    }

    case GET_ALL_ATTENDANCES_FAILURE:
      return {
        ...state,
        error: action.payload,
      };

    case GET_CURRENT_LOCATION_REQUEST: {
      return {
        ...state,
        currentLocation: undefined,
        isLoading: true,
      };
    }

    case GET_CURRENT_LOCATION_SUCCESS: {
      return {
        ...state,
        currentLocation: action.payload,
        isLoading: false,
      };
    }

    case GET_CURRENT_LOCATION_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case DETAIL_ATTENDANCE_REQUEST: {
      const { attendanceListDetail } = state;
      attendanceListDetail.setPage(action.payload?.page);
      return {
        ...state,
        attendanceListDetail: _.cloneDeep(attendanceListDetail),
      };
    }

    case DETAIL_ATTENDANCE_SUCCESS: {
      const { attendanceListDetail } = state;
      attendanceListDetail.setData(action.payload);
      return {
        ...state,
        attendanceListDetail: _.cloneDeep(attendanceListDetail),
      };
    }

    case DETAIL_ATTENDANCE_FAILURE:
      return {
        ...state,
        error: action.payload,
      };

    case GET_DISTANCE_AREA_REQUEST: {
      return {
        ...state,
        distanceArea: undefined,
        isLoading: true,
      };
    }

    case GET_DISTANCE_AREA_SUCCESS: {
      return {
        ...state,
        distanceArea: action.payload,
        isLoading: false,
      };
    }

    case GET_DISTANCE_AREA_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case CHECK_IN_LOCATION_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case CHECK_IN_LOCATION_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        currentLocation: undefined,
      };
    }

    case CHECK_IN_LOCATION_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case CHECK_OUT_LOCATION_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case CHECK_OUT_LOCATION_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        currentLocation: undefined,
      };
    }

    case CHECK_OUT_LOCATION_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    default:
      return state;
  }
};
