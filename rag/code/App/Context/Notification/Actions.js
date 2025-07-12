export const GET_ALL_NOTIFICATIONS_REQUEST = 'notification/GET_ALL_NOTIFICATIONS_REQUEST';
export const GET_ALL_NOTIFICATIONS_SUCCESS = 'notification/GET_ALL_NOTIFICATIONS_SUCCESS';
export const GET_ALL_NOTIFICATIONS_FAILURE = 'notification/GET_ALL_NOTIFICATIONS_FAILURE';

export const GET_UNREAD_COUNT_REQUEST = 'notification/GET_UNREAD_COUNT_REQUEST';
export const GET_UNREAD_COUNT_SUCCESS = 'notification/GET_UNREAD_COUNT_SUCCESS';
export const GET_UNREAD_COUNT_FAILURE = 'notification/GET_UNREAD_COUNT_FAILURE';

export const UPDATE_READ_REQUEST = 'notification/UPDATE_READ_REQUEST';
export const UPDATE_READ_SUCCESS = 'notification/UPDATE_READ_SUCCESS';
export const UPDATE_READ_FAILURE = 'notification/UPDATE_READ_FAILURE';

export const GET_NOTIFICATION_SETTING_REQUEST = 'notification/GET_NOTIFICATION_SETTING_REQUEST';
export const GET_NOTIFICATION_SETTING_SUCCESS = 'notification/GET_NOTIFICATION_SETTING_SUCCESS';
export const GET_NOTIFICATION_SETTING_FAILURE = 'notification/GET_NOTIFICATION_SETTING_FAILURE';

export const UPDATE_NOTIFICATION_SETTING_REQUEST = 'notification/UPDATE_NOTIFICATION_SETTING_REQUEST';
export const UPDATE_NOTIFICATION_SETTING_SUCCESS = 'notification/UPDATE_NOTIFICATION_SETTING_SUCCESS';
export const UPDATE_NOTIFICATION_SETTING_FAILURE = 'notification/UPDATE_NOTIFICATION_SETTING_FAILURE';

export const getAllNotificationsRequest = (payload) => ({
  type: GET_ALL_NOTIFICATIONS_REQUEST,
  payload,
});

export const getAllNotificationsSuccess = (payload) => ({
  type: GET_ALL_NOTIFICATIONS_SUCCESS,
  payload,
});

export const getAllNotificationsFailure = (payload) => ({
  type: GET_ALL_NOTIFICATIONS_FAILURE,
  payload,
});

export const getUnreadCountRequest = (payload) => ({
  type: GET_UNREAD_COUNT_REQUEST,
  payload,
});

export const getUnreadCountSuccess = (payload) => ({
  type: GET_UNREAD_COUNT_SUCCESS,
  payload,
});

export const getUnreadCountFailure = (payload) => ({
  type: GET_UNREAD_COUNT_FAILURE,
  payload,
});

export const updateReadRequest = (payload) => ({
  type: UPDATE_READ_REQUEST,
  payload,
});

export const updateReadSuccess = (payload) => ({
  type: UPDATE_READ_SUCCESS,
  payload,
});

export const updateReadFailure = (payload) => ({
  type: UPDATE_READ_FAILURE,
  payload,
});

export const getNotificationSettingRequest = (payload) => ({
  type: GET_NOTIFICATION_SETTING_REQUEST,
  payload,
});

export const getNotificationSettingSuccess = (payload) => ({
  type: GET_NOTIFICATION_SETTING_SUCCESS,
  payload,
});

export const getNotificationSettingFailure = (payload) => ({
  type: GET_NOTIFICATION_SETTING_FAILURE,
  payload,
});

export const updateNotificationSettingRequest = (payload) => ({
  type: UPDATE_NOTIFICATION_SETTING_REQUEST,
  payload,
});

export const updateNotificationSettingSuccess = (payload) => ({
  type: UPDATE_NOTIFICATION_SETTING_SUCCESS,
  payload,
});

export const updateNotificationSettingFailure = (payload) => ({
  type: UPDATE_NOTIFICATION_SETTING_FAILURE,
  payload,
});
