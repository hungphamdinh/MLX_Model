import _ from 'lodash';
import { DETAIL_VISITOR, GET_ALL_VISITORS, GET_VISITOR_REASONS } from './Actions';
import ListModel from '../Model/ListModel';
import { SWITCH_TO_USER_ACCOUNT_SUCCESS } from '../User/Actions';

export const INITIAL_STATE = {
  visitors: new ListModel(),
  types: [],
  visitorDetail: undefined,
  error: undefined,
  isLoading: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SWITCH_TO_USER_ACCOUNT_SUCCESS:
      return INITIAL_STATE;

    case GET_ALL_VISITORS.REQUEST: {
      const { visitors } = state;
      visitors.setPage(action.payload?.page);
      return {
        ...state,
        visitors: _.cloneDeep(visitors),
      };
    }

    case GET_ALL_VISITORS.SUCCESS: {
      const { visitors } = state;
      visitors.setData(action.payload);
      return {
        ...state,
        visitors: _.cloneDeep(visitors),
      };
    }

    case GET_ALL_VISITORS.FAILURE:
      return {
        ...state,
        error: action.payload,
      };

    case GET_VISITOR_REASONS.REQUEST: {
      return {
        ...state,
        types: [],
      };
    }

    case GET_VISITOR_REASONS.SUCCESS: {
      return {
        ...state,
        types: action.payload,
      };
    }

    case GET_VISITOR_REASONS.FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    case DETAIL_VISITOR.REQUEST: {
      return {
        ...state,
        visitorDetail: undefined,
      };
    }

    case DETAIL_VISITOR.SUCCESS: {
      return {
        ...state,
        visitorDetail: action.payload,
      };
    }

    case DETAIL_VISITOR.FAILURE:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};
