import _ from 'lodash';
import {
  GET_PROPERTY_DETAIL_FAILURE,
  GET_PROPERTY_DETAIL_REQUEST,
  GET_PROPERTY_DETAIL_SUCCESS,
  GET_PROPERTIES_FAILURE,
  GET_PROPERTIES_REQUEST,
  GET_PROPERTIES_SUCCESS,
  GET_PROPERTIES_TO_SELECT_FAILURE,
  GET_PROPERTIES_TO_SELECT_REQUEST,
  GET_PROPERTIES_TO_SELECT_SUCCESS,
  GET_PROPERTY_TYPES_SUCCESS,
  GET_OFFLINE_PROPERTIES_REQUEST,
  GET_OFFLINE_PROPERTIES_SUCCESS,
  GET_OFFLINE_PROPERTIES_FAILURE,
  GET_ALL_PROPERTY_BUILDING_TYPE_FAILURE,
  GET_ALL_PROPERTY_BUILDING_TYPE_REQUEST,
  GET_ALL_PROPERTY_BUILDING_TYPE_SUCCESS,
  GET_ALL_PROPERTY_UNIT_TYPE_FAILURE,
  GET_ALL_PROPERTY_UNIT_TYPE_REQUEST,
  GET_ALL_PROPERTY_UNIT_TYPE_SUCCESS,
  UPDATE_PROPERTY_FAILURE,
  UPDATE_PROPERTY_REQUEST,
  UPDATE_PROPERTY_SUCCESS,
  UPLOAD_PROPERTY_PHOTO_REQUEST,
  UPLOAD_PROPERTY_PHOTO_FAILURE,
  UPLOAD_PROPERTY_PHOTO_SUCCESS,
  CREATE_PROPERTY_FAILURE,
  CREATE_PROPERTY_REQUEST,
  CREATE_PROPERTY_SUCCESS,
  GET_TEAM_PROPERTIES_REQUEST,
  GET_TEAM_PROPERTIES_FAILURE,
  GET_TEAM_PROPERTIES_SUCCESS,
  GET_DISTRICTS_REQUEST,
  GET_DISTRICTS_FAILURE,
  GET_DISTRICTS_SUCCESS,
  GET_PROPERTY_SETTINGS_REQUEST,
  GET_PROPERTY_SETTINGS_SUCCESS,
  GET_PROPERTY_SETTINGS_FAILURE,
  CLEAR_PROPERTY_DETAIL,
} from './Actions';
import ListModel from '../Model/ListModel';
import { SWITCH_TO_USER_ACCOUNT_SUCCESS } from '../User/Actions';

export const INITIAL_STATE = {
  list: null,
  properties: new ListModel(),
  offlineProperties: new ListModel(),
  propertyTypes: [],
  propertyDetail: {},
  isLoading: false,
  unitTypes: [],
  propertyBuildingTypes: [],
  teams: [],
  districts: [],
  propertySettings: null,
  propertiesToSelect: new ListModel(),
};

const transformProperty = (list) =>
  list.map((item) => {
    item.userId = item.id;
    return item;
  });

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SWITCH_TO_USER_ACCOUNT_SUCCESS:
      return INITIAL_STATE;

    case GET_PROPERTIES_REQUEST: {
      const { properties } = state;
      properties.setPage(action.payload.page);
      return {
        ...state,
        properties: _.cloneDeep(properties),
      };
    }

    case GET_PROPERTIES_SUCCESS: {
      const { properties } = state;
      properties.setData(action.payload);
      return {
        ...state,
        properties: _.cloneDeep(properties),
      };
    }

    case GET_PROPERTIES_FAILURE: {
      const { properties } = state;
      properties.isRefresh = false;
      properties.isLoadMore = false;
      return {
        ...state,
        properties: _.cloneDeep(properties),
      };
    }

    case GET_PROPERTIES_TO_SELECT_REQUEST: {
      const { propertiesToSelect } = state;
      propertiesToSelect.setPage(action.payload.page);
      return {
        ...state,
        propertiesToSelect: _.cloneDeep(propertiesToSelect),
      };
    }

    case GET_PROPERTIES_TO_SELECT_SUCCESS: {
      const { propertiesToSelect } = state;
      propertiesToSelect.setData(action.payload);
      return {
        ...state,
        propertiesToSelect: _.cloneDeep(propertiesToSelect),
      };
    }

    case GET_PROPERTIES_TO_SELECT_FAILURE: {
      const { propertiesToSelect } = state;
      propertiesToSelect.isRefresh = false;
      propertiesToSelect.isLoadMore = false;
      return {
        ...state,
        propertiesToSelect: _.cloneDeep(propertiesToSelect),
      };
    }
    case GET_OFFLINE_PROPERTIES_REQUEST: {
      const { offlineProperties } = state;
      offlineProperties.setPage(action.payload.page);
      return {
        ...state,
        offlineProperties: _.cloneDeep(offlineProperties),
      };
    }

    case GET_OFFLINE_PROPERTIES_SUCCESS: {
      const { offlineProperties } = state;
      offlineProperties.setData(action.payload);
      return {
        ...state,
        offlineProperties: _.cloneDeep(offlineProperties),
      };
    }

    case GET_OFFLINE_PROPERTIES_FAILURE:
      return {
        ...state,
      };

    case GET_PROPERTY_TYPES_SUCCESS:
      return {
        ...state,
        propertyTypes: action.payload,
      };

    case GET_PROPERTY_DETAIL_REQUEST: {
      return {
        ...state,
        propertyDetail: {},
        isLoading: true,
      };
    }

    case GET_PROPERTY_DETAIL_SUCCESS: {
      const propertyDetail = action.payload;
      propertyDetail.users = transformProperty(propertyDetail.users);

      return {
        ...state,
        propertyDetail,
        isLoading: false,
      };
    }

    case GET_PROPERTY_DETAIL_FAILURE:
      return {
        ...state,
        isLoading: false,
      };

    case GET_ALL_PROPERTY_BUILDING_TYPE_REQUEST: {
      return {
        ...state,
      };
    }

    case GET_ALL_PROPERTY_BUILDING_TYPE_SUCCESS: {
      return {
        ...state,
        propertyBuildingTypes: action.payload,
      };
    }

    case GET_ALL_PROPERTY_BUILDING_TYPE_FAILURE:
      return {
        ...state,
      };

    case GET_ALL_PROPERTY_UNIT_TYPE_REQUEST: {
      return {
        ...state,
      };
    }

    case GET_ALL_PROPERTY_UNIT_TYPE_SUCCESS: {
      return {
        ...state,
        unitTypes: action.payload,
      };
    }

    case GET_ALL_PROPERTY_UNIT_TYPE_FAILURE:
      return {
        ...state,
      };

    case UPDATE_PROPERTY_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case UPDATE_PROPERTY_SUCCESS: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case UPDATE_PROPERTY_FAILURE:
      return {
        ...state,
        isLoading: false,
      };

    case UPLOAD_PROPERTY_PHOTO_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case UPLOAD_PROPERTY_PHOTO_SUCCESS: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case UPLOAD_PROPERTY_PHOTO_FAILURE:
      return {
        ...state,
        isLoading: false,
      };
    case CREATE_PROPERTY_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case CREATE_PROPERTY_SUCCESS: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case CREATE_PROPERTY_FAILURE:
      return {
        ...state,
        isLoading: false,
      };

    case GET_TEAM_PROPERTIES_REQUEST: {
      return {
        ...state,
      };
    }

    case GET_TEAM_PROPERTIES_SUCCESS: {
      return {
        ...state,
        teams: action.payload.map((item) => {
          item.members = [...(item.members || []), ...(item.observers || []), ...(item.leaders || [])];
          item.members.forEach((member) => (member.teamId = item.id));
          return item;
        }),
      };
    }

    case GET_TEAM_PROPERTIES_FAILURE:
      return {
        ...state,
      };

    case GET_DISTRICTS_REQUEST: {
      return {
        ...state,
      };
    }

    case GET_DISTRICTS_SUCCESS: {
      return {
        ...state,
        districts: action.payload,
      };
    }

    case GET_DISTRICTS_FAILURE:
      return {
        ...state,
      };

    case GET_PROPERTY_SETTINGS_REQUEST: {
      return {
        ...state,
      };
    }

    case GET_PROPERTY_SETTINGS_SUCCESS: {
      return {
        ...state,
        propertySettings: action.payload,
      };
    }

    case GET_PROPERTY_SETTINGS_FAILURE:
      return {
        ...state,
      };

    case CLEAR_PROPERTY_DETAIL:
      return {
        ...state,
        propertyDetail: {},
      };
    default:
      return state;
  }
};
