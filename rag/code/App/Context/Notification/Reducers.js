import _ from 'lodash';
import {
  GET_UNREAD_COUNT_FAILURE,
  GET_UNREAD_COUNT_REQUEST,
  GET_UNREAD_COUNT_SUCCESS,
  GET_ALL_NOTIFICATIONS_FAILURE,
  GET_ALL_NOTIFICATIONS_REQUEST,
  GET_ALL_NOTIFICATIONS_SUCCESS,
  UPDATE_READ_REQUEST,
  UPDATE_READ_FAILURE,
  UPDATE_READ_SUCCESS,
  UPDATE_NOTIFICATION_SETTING_FAILURE,
  UPDATE_NOTIFICATION_SETTING_SUCCESS,
  UPDATE_NOTIFICATION_SETTING_REQUEST,
  GET_NOTIFICATION_SETTING_FAILURE,
  GET_NOTIFICATION_SETTING_SUCCESS,
  GET_NOTIFICATION_SETTING_REQUEST,
} from './Actions';
import ListModel from '../Model/ListModel';
import { SWITCH_TO_USER_ACCOUNT_SUCCESS } from '../User/Actions';

export const INITIAL_STATE = {
  notifications: new ListModel(),
  unreadCount: 0,
  error: undefined,
  notificationSetting: undefined,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SWITCH_TO_USER_ACCOUNT_SUCCESS:
      return INITIAL_STATE;

    case GET_ALL_NOTIFICATIONS_REQUEST: {
      const { notifications } = state;
      notifications.setPage(action.payload?.page);
      return {
        ...state,
        notifications: _.cloneDeep(notifications),
      };
    }

    case GET_ALL_NOTIFICATIONS_SUCCESS: {
      const { notifications } = state;
      notifications.setData(action.payload);
      return {
        ...state,
        notifications: _.cloneDeep(notifications),
      };
    }

    case GET_ALL_NOTIFICATIONS_FAILURE:
      return {
        ...state,
        error: action.payload,
      };

    case GET_UNREAD_COUNT_REQUEST: {
      return {
        ...state,
      };
    }

    case GET_UNREAD_COUNT_SUCCESS: {
      return {
        ...state,
        unreadCount: action.payload,
      };
    }

    case GET_UNREAD_COUNT_FAILURE:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_READ_REQUEST: {
      return {
        ...state,
      };
    }

    case UPDATE_READ_SUCCESS: {
      const { notifications } = state;
      const notification = notifications.data.find((item) => item.id === action.payload);
      notification.state = 1;
      return {
        ...state,
        notifications: _.cloneDeep(notifications),
      };
    }

    case UPDATE_READ_FAILURE:
      return {
        ...state,
        error: action.payload,
      };

    case GET_NOTIFICATION_SETTING_REQUEST: {
      return {
        ...state,
        notificationSetting: undefined,
        isLoading: true,
      };
    }

    case GET_NOTIFICATION_SETTING_SUCCESS: {
      return {
        ...state,
        notificationSetting: action.payload,
        isLoading: false,
      };
    }

    case GET_NOTIFICATION_SETTING_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case UPDATE_NOTIFICATION_SETTING_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case UPDATE_NOTIFICATION_SETTING_SUCCESS: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case UPDATE_NOTIFICATION_SETTING_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};
