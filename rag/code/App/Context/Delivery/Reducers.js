import _ from 'lodash';
import {
  ADD_DELIVERY_FAILURE,
  ADD_DELIVERY_REQUEST,
  ADD_DELIVERY_SUCCESS,
  CHECK_OUT_FAILURE,
  CHECK_OUT_MULTI_FAILURE,
  CHECK_OUT_MULTI_REQUEST,
  CHECK_OUT_MULTI_SUCCESS,
  CHECK_OUT_REQUEST,
  CHECK_OUT_SUCCESS,
  DETAIL_DELIVERY_FAILURE,
  DETAIL_DELIVERY_REQUEST,
  DETAIL_DELIVERY_SUCCESS,
  GET_ALL_DELIVERIES_FAILURE,
  GET_ALL_DELIVERIES_REQUEST,
  GET_ALL_DELIVERIES_SUCCESS,
  GET_DELIVERY_STATUS_FAILURE,
  GET_DELIVERY_STATUS_REQUEST,
  GET_DELIVERY_STATUS_SUCCESS,
  GET_DELIVERY_TYPES_FAILURE,
  GET_DELIVERY_TYPES_REQUEST,
  GET_DELIVERY_TYPES_SUCCESS,
  GET_LIST_MEMBER_UNIT_SUCCESS,
  GET_LIST_UNIT_REQUEST,
  GET_LIST_UNIT_SUCCESS,
  GET_PARCELS_IN_UNIT_FAILURE,
  GET_PARCELS_IN_UNIT_REQUEST,
  GET_PARCELS_IN_UNIT_SUCCESS,
  GET_TRANSPORT_SERVICE_REQUEST,
  GET_TRANSPORT_SERVICE_SUCCESS,
  SCAN_PARCEL_RECEIPT_FAILURE,
  SCAN_PARCEL_RECEIPT_REQUEST,
  SCAN_PARCEL_RECEIPT_SUCCESS,
  UPDATE_DELIVERY_FAILURE,
  UPDATE_DELIVERY_REQUEST,
  UPDATE_DELIVERY_SUCCESS,
} from './Actions';
import ListModel from '../Model/ListModel';
import { SWITCH_TO_USER_ACCOUNT_SUCCESS } from '../User/Actions';

export const INITIAL_STATE = {
  deliveries: new ListModel(),
  types: [],
  deliveryDetail: undefined,
  error: undefined,
  listStatus: [],
  parcels: new ListModel(),
  units: new ListModel(),
  transportServices: new ListModel(),
  membersUnit: [],
  checkOutResponse: null,
  parcelReceipt: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SWITCH_TO_USER_ACCOUNT_SUCCESS:
      return INITIAL_STATE;

    case GET_LIST_UNIT_REQUEST: {
      const { units } = state;
      units.setPage(action.payload);
      return {
        ...state,
        units: _.cloneDeep(units),
      };
    }

    case GET_LIST_UNIT_SUCCESS: {
      const { units } = state;
      units.setData(action.payload);
      return {
        ...state,
        units: _.cloneDeep(units),
      };
    }

    case GET_TRANSPORT_SERVICE_REQUEST: {
      const { transportServices } = state;
      transportServices.setPage(action.payload);
      return {
        ...state,
        transportServices: _.cloneDeep(transportServices),
      };
    }

    case GET_TRANSPORT_SERVICE_SUCCESS: {
      const { transportServices } = state;
      transportServices.setData(action.payload);
      return {
        ...state,
        transportServices: _.cloneDeep(transportServices),
      };
    }

    case GET_LIST_MEMBER_UNIT_SUCCESS: {
      return {
        ...state,
        membersUnit: action.payload,
      };
    }
    case SCAN_PARCEL_RECEIPT_REQUEST: {
      return {
        ...state,
        parcelReceipt: undefined,
        isLoading: true,
      };
    }
    case SCAN_PARCEL_RECEIPT_SUCCESS: {
      return {
        ...state,
        parcelReceipt: action.payload,
        isLoading: false,
      };
    }
    case SCAN_PARCEL_RECEIPT_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case GET_ALL_DELIVERIES_REQUEST: {
      const { deliveries } = state;
      deliveries.setPage(action.payload?.page);
      return {
        ...state,
        deliveries: _.cloneDeep(deliveries),
      };
    }

    case GET_ALL_DELIVERIES_SUCCESS: {
      const { deliveries } = state;
      deliveries.setData(action.payload);
      return {
        ...state,
        deliveries: _.cloneDeep(deliveries),
      };
    }

    case GET_ALL_DELIVERIES_FAILURE:
      return {
        ...state,
        error: action.payload,
      };

    case GET_DELIVERY_TYPES_REQUEST: {
      return {
        ...state,
        types: [],
      };
    }

    case GET_DELIVERY_TYPES_SUCCESS: {
      return {
        ...state,
        types: action.payload,
      };
    }

    case GET_DELIVERY_TYPES_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    case DETAIL_DELIVERY_REQUEST: {
      return {
        ...state,
        deliveryDetail: undefined,
      };
    }

    case DETAIL_DELIVERY_SUCCESS: {
      return {
        ...state,
        deliveryDetail: action.payload,
      };
    }

    case DETAIL_DELIVERY_FAILURE:
      return {
        ...state,
        error: action.payload,
      };

    case GET_DELIVERY_STATUS_REQUEST: {
      return {
        ...state,
        listStatus: [],
      };
    }

    case GET_DELIVERY_STATUS_SUCCESS: {
      return {
        ...state,
        listStatus: action.payload,
      };
    }

    case GET_DELIVERY_STATUS_FAILURE:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_DELIVERY_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case ADD_DELIVERY_SUCCESS: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case ADD_DELIVERY_FAILURE:
      return {
        ...state,
        isLoading: false,
      };

    case UPDATE_DELIVERY_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case UPDATE_DELIVERY_SUCCESS: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case UPDATE_DELIVERY_FAILURE:
      return {
        ...state,
        isLoading: false,
      };

    case CHECK_OUT_MULTI_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case CHECK_OUT_MULTI_SUCCESS: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case CHECK_OUT_MULTI_FAILURE:
      return {
        ...state,
        isLoading: false,
      };

    case CHECK_OUT_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case CHECK_OUT_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        checkOutResponse: action.payload,
      };
    }

    case CHECK_OUT_FAILURE:
      return {
        ...state,
        isLoading: false,
      };
    case GET_PARCELS_IN_UNIT_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case GET_PARCELS_IN_UNIT_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        parcelsInUnit: action.payload,
      };
    }

    case GET_PARCELS_IN_UNIT_FAILURE:
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
};
