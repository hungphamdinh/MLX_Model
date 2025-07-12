import { generateAction } from '../../Utils/AppAction';

export const GET_HOME_MODULES_REQUEST = 'home/GET_HOME_MODULES_REQUEST';
export const GET_HOME_MODULES_SUCCESS = 'home/GET_HOME_MODULES_SUCCESS';
export const GET_HOME_MODULES_FAILURE = 'home/GET_HOME_MODULES_FAILURE';

export const GET_UNREAD_NOTIFICATION_REQUEST = 'home/GET_UNREAD_NOTIFICATION_REQUEST';
export const GET_UNREAD_NOTIFICATION_SUCCESS = 'home/GET_UNREAD_NOTIFICATION_SUCCESS';
export const GET_UNREAD_NOTIFICATION_FAILURE = 'home/GET_UNREAD_NOTIFICATION_FAILURE';

export const SET_DEEP_LINK_ACTION_REQUEST = 'home/SET_DEEP_LINK_ACTION_REQUEST';

export const GET_WEATHER_FORECAST_REQUEST = 'home/GET_WEATHER_FORECAST_REQUEST';
export const GET_WEATHER_FORECAST_SUCCESS = 'home/GET_WEATHER_FORECAST_SUCCESS';
export const GET_WEATHER_FORECAST_FAILURE = 'home/GET_WEATHER_FORECAST_FAILURE';

export const GET_DASHBOARD_STATISTIC_REQUEST = 'home/GET_DASHBOARD_STATISTIC_REQUEST';
export const GET_DASHBOARD_STATISTIC_SUCCESS = 'home/GET_DASHBOARD_STATISTIC_SUCCESS';
export const GET_DASHBOARD_STATISTIC_FAILURE = 'home/GET_DASHBOARD_STATISTIC_FAILURE';

export const GET_BUILDINGS_REQUEST = 'home/GET_BUILDINGS_REQUEST';
export const GET_BUILDINGS_SUCCESS = 'home/GET_BUILDINGS_SUCCESS';
export const GET_BUILDINGS_FAILURE = 'home/GET_BUILDINGS_FAILURE';

export const GET_COMPANIES = generateAction('home/GET_COMPANIES');

export const getHomeModulesRequest = (payload) => ({
  type: GET_HOME_MODULES_REQUEST,
  payload,
});

export const getHomeModulesSuccess = (payload) => ({
  type: GET_HOME_MODULES_SUCCESS,
  payload,
});

export const getHomeModulesFailure = (payload) => ({
  type: GET_HOME_MODULES_FAILURE,
  payload,
});

export const setDeepLinkActionRequest = (payload) => ({
  type: SET_DEEP_LINK_ACTION_REQUEST,
  payload,
});

export const getWeatherForecastRequest = (payload) => ({
  type: GET_WEATHER_FORECAST_REQUEST,
  payload,
});

export const getWeatherForecastSuccess = (payload) => ({
  type: GET_WEATHER_FORECAST_SUCCESS,
  payload,
});

export const getWeatherForecastFailure = (payload) => ({
  type: GET_WEATHER_FORECAST_FAILURE,
  payload,
});

export const getDashboardStatisticRequest = (payload) => ({
  type: GET_DASHBOARD_STATISTIC_REQUEST,
  payload,
});

export const getDashboardStatisticSuccess = (payload) => ({
  type: GET_DASHBOARD_STATISTIC_SUCCESS,
  payload,
});

export const getDashboardStatisticFailure = (payload) => ({
  type: GET_DASHBOARD_STATISTIC_FAILURE,
  payload,
});

export const getBuildingsRequest = () => ({
  type: GET_BUILDINGS_REQUEST,
});

export const getBuildingsSuccess = (payload) => ({
  type: GET_BUILDINGS_SUCCESS,
  payload,
});

export const getBuildingsFailure = (payload) => ({
  type: GET_BUILDINGS_FAILURE,
  payload,
});
