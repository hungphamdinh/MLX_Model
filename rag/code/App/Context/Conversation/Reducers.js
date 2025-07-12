import {
  GET_USER_COMMENTS_REQUEST,
  GET_ADMIN_COMMENTS_SUCCESS,
  GET_ADMIN_COMMENTS_REQUEST,
  GET_USER_COMMENTS_SUCCESS,
} from './Actions';
import { SWITCH_TO_USER_ACCOUNT_SUCCESS } from '../User/Actions';

export const INITIAL_STATE = {
  listAdminComments: [],
  listUserComments: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SWITCH_TO_USER_ACCOUNT_SUCCESS:
      return INITIAL_STATE;

    case GET_ADMIN_COMMENTS_REQUEST: {
      return {
        ...state,
        // listAdminComments: [],
      };
    }

    case GET_ADMIN_COMMENTS_SUCCESS: {
      return {
        ...state,
        listAdminComments: action.payload.items,
      };
    }
    case GET_USER_COMMENTS_REQUEST: {
      return {
        ...state,
        // listUserComments: [],
      };
    }

    case GET_USER_COMMENTS_SUCCESS: {
      return {
        ...state,
        listUserComments: action.payload.items,
      };
    }

    default:
      return state;
  }
};
