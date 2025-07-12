import _ from 'lodash';
import {
  GET_METER_DEVICE_FAILURE,
  GET_METER_DEVICE_REQUEST,
  GET_METER_DEVICE_SUCCESS,
  GET_METER_READING_HISTORIES_FAILURE,
  GET_METER_READING_HISTORIES_REQUEST,
  GET_METER_READING_HISTORIES_SUCCESS,
  GET_METER_READINGS_FAILURE,
  GET_METER_READINGS_REQUEST,
  GET_METER_READINGS_SUCCESS,
  GET_METER_TYPES_FAILURE,
  GET_METER_TYPES_REQUEST,
  GET_METER_TYPES_SUCCESS,
  GET_QR_CODE_METER_DEVICE_FAILURE,
  GET_QR_CODE_METER_DEVICE_REQUEST,
  GET_QR_CODE_METER_DEVICE_SUCCESS,
  CREATE_METER_READING_FAILURE,
  CREATE_METER_READING_REQUEST,
  CREATE_METER_READING_SUCCESS,
  GET_METER_READING_CURRENT_MONTH_REQUEST,
  GET_METER_READING_CURRENT_MONTH_FAILURE,
  GET_METER_READING_CURRENT_MONTH_SUCCESS,
  GET_METER_DEVICE_RELATIONSHIP_FAILURE,
  GET_METER_DEVICE_RELATIONSHIP_SUCCESS,
  GET_METER_DEVICE_RELATIONSHIP_REQUEST,
  GET_METER_SETTINGS_REQUEST,
  GET_METER_SETTINGS_SUCCESS,
  GET_METER_SETTINGS_FAILURE,
} from './Actions';
import ListModel from '../Model/ListModel';
import { SWITCH_TO_USER_ACCOUNT_SUCCESS } from '../User/Actions';

export const INITIAL_STATE = {
  list: null,
  meterDevices: new ListModel(),
  meterReadings: new ListModel(),
  meterDeviceByCode: null,
  histories: new ListModel(),
  currentMonthReadings: new ListModel(),
  meterTypes: [],
  masterDevice: undefined,
  subDevices: [],
  isLoading: false,
  settings: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SWITCH_TO_USER_ACCOUNT_SUCCESS:
      return INITIAL_STATE;

    case GET_METER_DEVICE_REQUEST: {
      const { meterDevices } = state;
      meterDevices.setPage(action.payload.page);
      return {
        ...state,
        meterDevices: _.cloneDeep(meterDevices),
      };
    }

    case GET_METER_DEVICE_SUCCESS: {
      const { meterDevices } = state;
      action.payload.items.map((item) => (item.meterName = `${item.meterType.name} - ${item.serialNumber}`));
      meterDevices.setData(action.payload);
      meterDevices.totalPage = 1;
      return {
        ...state,
        meterDevices: _.cloneDeep(meterDevices),
      };
    }

    case GET_METER_DEVICE_FAILURE:
      return {
        ...state,
      };

    case GET_QR_CODE_METER_DEVICE_REQUEST: {
      return {
        ...state,
        meterDeviceByCode: null,
      };
    }

    case GET_QR_CODE_METER_DEVICE_SUCCESS: {
      return {
        ...state,
        meterDeviceByCode: action.payload,
      };
    }

    case GET_QR_CODE_METER_DEVICE_FAILURE:
      return {
        ...state,
      };

    case GET_METER_READINGS_REQUEST: {
      const { meterReadings } = state;
      meterReadings.setPage(action.payload.page);
      return {
        ...state,
        meterReadings: _.cloneDeep(meterReadings),
      };
    }

    case GET_METER_READINGS_SUCCESS: {
      const { meterReadings } = state;
      meterReadings.setData(action.payload);
      return {
        ...state,
        meterReadings: _.cloneDeep(meterReadings),
      };
    }

    case GET_METER_READINGS_FAILURE:
      return {
        ...state,
      };

    case GET_METER_TYPES_REQUEST: {
      return {
        ...state,
        meterTypes: [],
      };
    }

    case GET_METER_TYPES_SUCCESS: {
      return {
        ...state,
        meterTypes: action.payload,
      };
    }

    case GET_METER_TYPES_FAILURE:
      return {
        ...state,
      };

    case GET_METER_READING_HISTORIES_REQUEST: {
      const { histories } = state;
      histories.setPage(1);
      return {
        ...state,
        histories: _.cloneDeep(histories),
      };
    }

    case GET_METER_READING_HISTORIES_SUCCESS: {
      const { histories } = state;
      histories.setData(action.payload);
      return {
        ...state,
        histories: _.cloneDeep(histories),
      };
    }

    case GET_METER_READING_HISTORIES_FAILURE:
      return {
        ...state,
      };

    case GET_METER_READING_CURRENT_MONTH_REQUEST: {
      const { currentMonthReadings } = state;
      currentMonthReadings.setPage(1);
      return {
        ...state,
        currentMonthReadings,
      };
    }

    case GET_METER_READING_CURRENT_MONTH_SUCCESS: {
      const { currentMonthReadings } = state;
      currentMonthReadings.setData(action.payload);
      return {
        ...state,
        currentMonthReadings: _.cloneDeep(currentMonthReadings),
      };
    }

    case GET_METER_READING_CURRENT_MONTH_FAILURE:
      return {
        ...state,
      };

    case CREATE_METER_READING_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case CREATE_METER_READING_SUCCESS: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case CREATE_METER_READING_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case GET_METER_DEVICE_RELATIONSHIP_REQUEST: {
      return {
        ...state,
        isLoading: true,
        masterDevice: undefined,
        subDevices: [],
      };
    }

    case GET_METER_DEVICE_RELATIONSHIP_SUCCESS: {
      const { masterDevice, subDevices } = action.payload;
      return {
        ...state,
        isLoading: false,
        masterDevice,
        subDevices,
      };
    }

    case GET_METER_DEVICE_RELATIONSHIP_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case GET_METER_SETTINGS_REQUEST: {
      return {
        ...state,
      };
    }

    case GET_METER_SETTINGS_SUCCESS: {
      return {
        ...state,
        settings: action.payload,
      };
    }

    case GET_METER_SETTINGS_FAILURE: {
      return {
        ...state,
      };
    }
    default:
      return state;
  }
};
