import NavigationService from '@NavigationService';
import _ from 'lodash';
import { useStateValue } from '../../index';
import {
  getAllNotificationsFailure,
  getAllNotificationsRequest,
  getAllNotificationsSuccess,
  getNotificationSettingFailure,
  getNotificationSettingRequest,
  getNotificationSettingSuccess,
  getUnreadCountFailure,
  getUnreadCountRequest,
  getUnreadCountSuccess,
  updateNotificationSettingFailure,
  updateNotificationSettingRequest,
  updateNotificationSettingSuccess,
  updateReadFailure,
  updateReadRequest,
  updateReadSuccess,
} from '../Actions';
import { RequestApi } from '../../../Services';
import PushNotification from 'react-native-push-notification';
import { handleCacheRequestFromAsyncStorage } from '../../../Utils/network';

const useNotification = () => {
  const [{ notification }, dispatch] = useStateValue();

  const getAllNotifications = async (params) => {
    try {
      dispatch(getAllNotificationsRequest(params));
      const response = await RequestApi.requestGetNotifications(params);
      dispatch(getAllNotificationsSuccess(response));
    } catch (err) {
      dispatch(getAllNotificationsFailure(err));
    }
  };

  const updateRead = async (id) => {
    try {
      dispatch(updateReadRequest(id));
      await RequestApi.requestSetNotificationAsRead(id);
      dispatch(updateReadSuccess(id));
      getUnreadCount();
    } catch (err) {
      dispatch(updateReadFailure(err));
    }
  };

  const getUnreadCount = async () => {
    try {
      dispatch(getUnreadCountRequest());
      const result = await handleCacheRequestFromAsyncStorage(RequestApi.getUserUnreadNotifications);
      const unreadCount = _.get(result, 'unreadCount', 0);
      PushNotification.setApplicationIconBadgeNumber(unreadCount);
      dispatch(getUnreadCountSuccess(unreadCount));
    } catch (err) {
      dispatch(getUnreadCountFailure(err));
    }
  };

  const getNotificationSetting = async () => {
    try {
      dispatch(getNotificationSettingRequest());
      const response = await RequestApi.getNotificationSetting();
      dispatch(getNotificationSettingSuccess(response));
    } catch (err) {
      dispatch(getNotificationSettingFailure(err));
    }
  };

  const updateNotificationSetting = async (payload) => {
    try {
      dispatch(updateNotificationSettingRequest(payload));
      const response = await RequestApi.updateNotificationSetting(payload);
      dispatch(updateNotificationSettingSuccess(response));
      NavigationService.goBack();
    } catch (err) {
      dispatch(updateNotificationSettingFailure(err));
    }
  };

  return {
    notification,
    getAllNotifications,
    updateRead,
    getUnreadCount,
    getNotificationSetting,
    updateNotificationSetting,
  };
};

export default useNotification;
