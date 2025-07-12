import {
  GET_BUILDINGS_FAILURE,
  GET_BUILDINGS_REQUEST,
  GET_BUILDINGS_SUCCESS,
  GET_DASHBOARD_STATISTIC_FAILURE,
  GET_DASHBOARD_STATISTIC_REQUEST,
  GET_DASHBOARD_STATISTIC_SUCCESS,
  GET_HOME_MODULES_FAILURE,
  GET_HOME_MODULES_REQUEST,
  GET_HOME_MODULES_SUCCESS,
  GET_UNREAD_NOTIFICATION_FAILURE,
  GET_UNREAD_NOTIFICATION_REQUEST,
  GET_UNREAD_NOTIFICATION_SUCCESS,
  GET_WEATHER_FORECAST_FAILURE,
  GET_WEATHER_FORECAST_REQUEST,
  GET_WEATHER_FORECAST_SUCCESS,
  SET_DEEP_LINK_ACTION_REQUEST,
  GET_COMPANIES,
} from './Actions';
import ListModel from '../Model/ListModel';
import _ from 'lodash';
import { getCompanyRepresentativeName } from '../../Utils/common';

export const INITIAL_STATE = {
  homeModules: [],
  unreadCount: 0,
  error: undefined,
  isOfflineInspection: false,
  deepLinkPath: undefined,
  userModuleConfig: undefined,
  moduleHome: [],
  modules: [],
  bottomModules: [],
  weatherForecast: undefined,
  dashboardStatistic: [],
  buildings: [],
  companies: new ListModel(),
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_HOME_MODULES_REQUEST: {
      return {
        ...state,
        homeModules: [],
      };
    }

    case GET_HOME_MODULES_SUCCESS: {
      return {
        ...state,
        ...action.payload,
      };
    }

    case GET_HOME_MODULES_FAILURE:
      return {
        ...state,
        error: action.payload,
      };

    case GET_UNREAD_NOTIFICATION_REQUEST: {
      return {
        ...state,
        homeModules: [],
      };
    }

    case GET_UNREAD_NOTIFICATION_SUCCESS: {
      return {
        ...state,
        unreadCount: action.payload,
      };
    }

    case GET_UNREAD_NOTIFICATION_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    case SET_DEEP_LINK_ACTION_REQUEST:
      return {
        ...state,
        deepLinkPath: action.payload,
      };

    case GET_WEATHER_FORECAST_REQUEST: {
      return {
        ...state,
      };
    }

    case GET_WEATHER_FORECAST_SUCCESS: {
      const { current } = action.payload;
      return {
        ...state,
        weatherForecast: current,
      };
    }

    case GET_WEATHER_FORECAST_FAILURE:
      return {
        ...state,
        error: action.payload,
      };

    case GET_DASHBOARD_STATISTIC_REQUEST: {
      return {
        ...state,
      };
    }

    case GET_DASHBOARD_STATISTIC_SUCCESS: {
      return {
        ...state,
        dashboardStatistic: action.payload,
      };
    }

    case GET_DASHBOARD_STATISTIC_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    case GET_BUILDINGS_REQUEST: {
      return {
        ...state,
      };
    }

    case GET_BUILDINGS_SUCCESS: {
      return {
        ...state,
        buildings: action.payload,
      };
    }

    case GET_BUILDINGS_FAILURE:
      return {
        ...state,
        error: action.payload,
      };

    case GET_COMPANIES.REQUEST: {
      const { companies } = state;
      companies.setPage(action.payload?.page);
      return {
        ...state,
        companies: _.cloneDeep(companies),
      };
    }

    case GET_COMPANIES.SUCCESS: {
      const { companies } = state;
      companies.setData(action.payload);
      companies.data = _.map(companies.data, (item) => {
        item.companyRepresentative = getCompanyRepresentativeName(item);
        return item;
      });
      return {
        ...state,
        companies: _.cloneDeep(companies),
      };
    }

    case GET_COMPANIES.FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};
