import _ from 'lodash';
import {
  DETAIL_FB_FAILURE,
  DETAIL_FB_REQUEST,
  DETAIL_FB_SUCCESS,
  GET_LIST_FB_FAILURE,
  GET_LIST_FB_REQUEST,
  GET_LIST_FB_SUCCESS,
  GET_AREAS_FAILURE,
  GET_AREAS_REQUEST,
  GET_AREAS_SUCCESS,
  GET_TYPES_FAILURE,
  GET_TYPES_SUCCESS,
  GET_TYPES_REQUEST,
  GET_CATEGORIES_FAILURE,
  GET_CATEGORIES_REQUEST,
  GET_CATEGORIES_SUCCESS,
  GET_FEEDBACK_STATUS_REQUEST,
  GET_FEEDBACK_STATUS_SUCCESS,
  GET_FEEDBACK_STATUS_FAILURE,
  GET_SOURCES_REQUEST,
  GET_SOURCES_FAILURE,
  GET_SOURCES_SUCCESS,
  GET_LIST_FB_QR_REQUEST,
  GET_LIST_FB_QR_FAILURE,
  GET_LIST_FB_QR_SUCCESS,
  GET_LOCATIONS_REQUEST,
  GET_LOCATIONS_FAILURE,
  GET_LOCATIONS_SUCCESS,
  DETAIL_FB_QR_FAILURE,
  DETAIL_FB_QR_REQUEST,
  DETAIL_FB_QR_SUCCESS,
  EDIT_QR_FB_FAILURE,
  EDIT_QR_FB_REQUEST,
  EDIT_QR_FB_SUCCESS,
  GET_FEEDBACK_DIVISION,
  GET_QR_FEEDBACK_SETTING,
} from './Actions';
import ListModel from '../Model/ListModel';
import { SWITCH_TO_USER_ACCOUNT_SUCCESS } from '../User/Actions';

export const INITIAL_STATE = {
  list: new ListModel(),
  listQRFeedback: new ListModel(),
  error: undefined,
  fbDetail: undefined,
  qrFBDetail: undefined,
  groupCategories: [],
  sources: [],
  statusList: [],
  areas: [],
  types: [],
  locations: new ListModel(),
  isLoading: false,
  divisionList: [],
  qrFeedbackSetting: undefined,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SWITCH_TO_USER_ACCOUNT_SUCCESS:
      return INITIAL_STATE;

    case GET_LIST_FB_REQUEST: {
      const { list } = state;
      list.setPage(action.payload?.page);
      return {
        ...state,
        list: _.cloneDeep(list),
      };
    }

    case GET_LIST_FB_SUCCESS: {
      const { list } = state;
      const data = {
        ...action.payload,
        items: action.payload.items.map((item) => {
          item.id = item.commentBoxId;
          item.fullName = item.creatorUser?.displayName;
          item.phoneNumber = item.creatorUser?.phoneNumber;
          item.emailAddress = item.creatorUser?.emailAddress;
          return item;
        }),
      };
      list.setData(data);
      return {
        ...state,
        list: _.cloneDeep(list),
      };
    }

    case GET_LIST_FB_FAILURE:
      return {
        ...state,
        error: action.payload,
      };

    case GET_LIST_FB_QR_REQUEST: {
      const { listQRFeedback } = state;
      listQRFeedback.setPage(action.payload?.page);
      return {
        ...state,
        listQRFeedback: _.cloneDeep(listQRFeedback),
      };
    }

    case GET_LIST_FB_QR_SUCCESS: {
      const { listQRFeedback } = state;
      const data = {
        ...action.payload,
        items: action.payload.items,
      };
      listQRFeedback.setData(data);
      return {
        ...state,
        listQRFeedback: _.cloneDeep(listQRFeedback),
      };
    }

    case GET_LIST_FB_QR_FAILURE:
      return {
        ...state,
        error: action.payload,
      };

    case DETAIL_FB_REQUEST: {
      return {
        ...state,
        fbDetail: undefined,
        isLoading: true,
      };
    }

    case DETAIL_FB_SUCCESS: {
      return {
        ...state,
        fbDetail: action.payload,
        isLoading: false,
      };
    }

    case DETAIL_FB_FAILURE:
      return {
        ...state,
        isLoading: false,
      };

    case DETAIL_FB_QR_REQUEST: {
      return {
        ...state,
        qrFBDetail: undefined,
        isLoading: true,
      };
    }

    case DETAIL_FB_QR_SUCCESS: {
      return {
        ...state,
        qrFBDetail: action.payload,
        isLoading: false,
      };
    }

    case DETAIL_FB_QR_FAILURE:
      return {
        ...state,
        isLoading: false,
      };

    case GET_SOURCES_REQUEST: {
      return {
        ...state,
      };
    }

    case GET_SOURCES_SUCCESS: {
      return {
        ...state,
        sources: action.payload,
      };
    }

    case GET_SOURCES_FAILURE:
      return {
        ...state,
      };

    case GET_TYPES_REQUEST: {
      return {
        ...state,
      };
    }

    case GET_TYPES_SUCCESS: {
      return {
        ...state,
        types: action.payload,
      };
    }

    case GET_TYPES_FAILURE:
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

    case GET_FEEDBACK_STATUS_REQUEST: {
      return {
        ...state,
        // statusList: [],
      };
    }

    case GET_FEEDBACK_STATUS_SUCCESS: {
      return {
        ...state,
        statusList: action.payload,
      };
    }

    case GET_FEEDBACK_STATUS_FAILURE:
      return {
        ...state,
      };

    case GET_FEEDBACK_DIVISION.SUCCESS: {
      return {
        ...state,
        divisionList: action.payload,
      };
    }

    case GET_QR_FEEDBACK_SETTING.SUCCESS: {
      return {
        ...state,
        qrFeedbackSetting: action.payload,
      };
    }

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

    case EDIT_QR_FB_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case EDIT_QR_FB_SUCCESS:
      return {
        ...state,
        isLoading: false,
      };
    case EDIT_QR_FB_FAILURE:
      return {
        ...state,
        isLoading: false,
      };

    case GET_LOCATIONS_REQUEST: {
      const { locations } = state;
      locations.setPage(action.payload?.page);
      return {
        ...state,
        locations: _.cloneDeep(locations),
      };
    }

    case GET_LOCATIONS_SUCCESS: {
      const { locations } = state;
      const data = {
        ...action.payload,
        items: action.payload.items,
      };
      locations.setData(data);
      return {
        ...state,
        locations: _.cloneDeep(locations),
      };
    }

    case GET_LOCATIONS_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};
