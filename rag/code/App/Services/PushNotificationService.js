import { PureComponent } from 'react';
import { Platform } from 'react-native';
import { PERMISSIONS, request } from 'react-native-permissions';
import _ from 'lodash';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import DeviceInfo from 'react-native-device-info';
import NavigationService from '@NavigationService';
import i18n from '@I18n';
import { RequestApi } from '../Services';
import { DURATION_TIMEOUT_BEFORE_BANNER_NOTICE, SENDER_ID } from '../Config';
import { Modules } from '../Config/Constants';
import { NetWork, keyDeviceStore } from '../Utils';
import { checkPermission, requestPostNotiPermission } from '../Utils/permissions';
import { handleTimeUntilExpire, transformTimeToShow } from '../Utils/transformData';
import apiConfig from '../Config/apiConfig';
import { DeviceStore } from './MMKVStorage';
import { AlertNative } from '../Components';

const NOTIFICATION_CHANNEL_ID = 'App';

export const mapNavigateToScreen = (type, parentId) => {
  let screen;
  switch (type) {
    case Modules.WORKORDERMANAGEMENT:
      screen = 'editJobRequest';
      break;
    case Modules.WORKORDERTASK:
      screen = 'editJobRequestTask';
      break;
    case Modules.PLANMAINTENANCE:
      screen = 'detailPlan';
      break;
    case Modules.PLANMAINTENANCETASK:
      screen = 'editPlanTask';
      break;
    case Modules.FEEDBACK:
      screen = 'editFeedback';
      break;
    case Modules.VISITOR:
      screen = 'visitorDetail';
      break;
    case Modules.INSPECTION:
      screen = 'editJob';
      break;
    case Modules.TASK_MANAGEMENT:
      screen = 'editTask';
      break;
    case Modules.INVENTORY:
      screen = 'inventory';
      break;
    case Modules.ASSET:
      screen = 'detailAssets';
      break;
    default:
      break;
  }
  if (type === Modules.INVENTORY && !parentId) {
    NavigationService.navigate(screen);
    return;
  }
  if (screen && parentId > 0) {
    NavigationService.navigate(screen, {
      id: parentId,
      taskId: parentId,
    });
  }
};
class PushNotificationService extends PureComponent {
  // BackHandler.addEventListener('hardwareBackPress', this.handleHardwareBackPress);
  componentDidMount() {
    requestPostNotiPermission(this.setupPushNotification);
    PushNotification.createChannel(
      {
        channelId: NOTIFICATION_CHANNEL_ID, // (required)
        channelName: NOTIFICATION_CHANNEL_ID, // (required)
        channelDescription: 'A channel to categorise your notifications', // (optional) default: undefined.
        playSound: false, // (optional) default: true
        soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
        importance: 4, // (optional) default: 4. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
      },
      (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    );
    this.handleSessionDurationNotification();
  }

  setupPushNotification = async () => {
    const { onReceiveForegroundNotification } = this.props;
    await PushNotification.configure({
      onRegister: (token) => {
        this.registerNotification(token);
      },
      onNotification: (notification) => {
        let notificationData = _.get(notification, 'data', {});

        if (Platform.OS === 'android') {
          try {
            notificationData = JSON.parse(notificationData.data);
          } catch (e) {}
        }
        if (notification.foreground && onReceiveForegroundNotification) {
          // recall api get unread notification, if is in foreground
          onReceiveForegroundNotification();
        }
        if (notification.userInteraction) {
          this.handleNotificationOpen(notificationData);
        }
        // (required) Called when a remote is received or opened, or local notification is opened
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
      channelId: NOTIFICATION_CHANNEL_ID,
      channelName: NOTIFICATION_CHANNEL_ID, // (required)
      channelDescription: 'A channel to categorise your notifications', // (optional) default: undefined.

      senderID: SENDER_ID,
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
  };

  calculateNotificationDelay = (timeUntilExpiration, beforeExpireSeconds) => {
    const remainingTimeInSeconds = timeUntilExpiration - beforeExpireSeconds;
    return Math.max(remainingTimeInSeconds, 1) * 1000; // Ensuring at least 1 second delay
  };

  scheduleNotification = (message, delay) => {
    PushNotification.localNotificationSchedule({
      channelId: NOTIFICATION_CHANNEL_ID,
      message,
      date: new Date(Date.now() + delay),
    });
  };

  handleSessionDurationNotification = () => {
    const pushedLocalNotification = DeviceStore.getBoolean(keyDeviceStore.PUSHED_LOCAL_NOTIFICATION);
    const isDeniedScheduleAlarm = DeviceStore.getBoolean(keyDeviceStore.DENYING_SCHEDULE_ALARM);
    if (pushedLocalNotification || !this.props.isNotifyUsersBeforeReachedSessionDuration) {
      return;
    }
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const alarmPermission = PERMISSIONS.ANDROID.SCHEDULE_EXACT_ALARM;
      // Request again if, user didn't deny in-app.
      if (!isDeniedScheduleAlarm) {
        checkPermission(alarmPermission, this.handlePushBackground, () => {
          AlertNative(
            i18n.t('ALERT'),
            i18n.t('SCHEDULE_ALARM_REQUIRE'),
            () => request(alarmPermission),
            i18n.t('GO_TO_SETTINGS'),
            i18n.t('DENY'),
            () => DeviceStore.setBoolean(keyDeviceStore.DENYING_SCHEDULE_ALARM, true)
          );
        });
        return;
      }
      // user denied in-app but go to setting to turn on manual
      checkPermission(alarmPermission, this.handlePushBackground);
      return;
    }
    this.handlePushBackground();
  };

  handlePushBackground = () => {
    DeviceStore.setBoolean(keyDeviceStore.DENYING_SCHEDULE_ALARM, false);
    const beforeExpireSeconds = DURATION_TIMEOUT_BEFORE_BANNER_NOTICE * 60;
    const timeUntilExpiration = handleTimeUntilExpire(apiConfig.accessTokenAPI);
    const delayForNotification = this.calculateNotificationDelay(timeUntilExpiration, beforeExpireSeconds);
    const minuteToShow = timeUntilExpiration < beforeExpireSeconds ? timeUntilExpiration + 60 : beforeExpireSeconds;

    const { minutes } = transformTimeToShow(minuteToShow);
    const message = i18n.t('DURATION_EXPIRE_NOTIFICATION_CONTENT', null, minutes);

    this.scheduleNotification(message, delayForNotification);
    DeviceStore.save(keyDeviceStore.PUSHED_LOCAL_NOTIFICATION, true);
  };

  registerNotification = async (token) => {
    const uniqueId = DeviceInfo.getUniqueId();
    const params = {
      deviceTypeId: Platform.OS === 'ios' ? 5 : 6,
      deviceToken: token.token,
      deviceCode: uniqueId,
    };
    if (NetWork.isConnected) {
      await RequestApi.registerNotification(params);
    }
  };

  handleNotificationOpen = (notificationData) => {
    const type = _.parseInt(notificationData.type);
    const parentId = _.parseInt(notificationData.parentid);
    mapNavigateToScreen(type, parentId);
  };

  render() {
    return null;
  }
}

export default PushNotificationService;
