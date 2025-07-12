import { RESULTS, check, request, PERMISSIONS } from 'react-native-permissions';
import { Platform } from 'react-native';

const platformVersion = typeof Platform.Version === 'string' ? parseInt(Platform.Version, 10) : Platform.Version;
const TIRAMISU_VERSION_CODE = 33;

export const checkPermission = async (permission, onSuccess, onDeny) => {
  const result = await check(permission);
  if (result === RESULTS.GRANTED && onSuccess) {
    onSuccess();
    return;
  }
  if (result === RESULTS.DENIED || result === RESULTS.BLOCKED) {
    if (onDeny) {
      onDeny();
    }
  }
};

export const requestPermission = (permission, callBack) => {
  check(permission)
    .then((result) => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          // alert(unAvailableErr);
          break;
        case RESULTS.DENIED:
          request(permission).then((res) => {
            if (res === RESULTS.GRANTED || res === RESULTS.BLOCKED || res === RESULTS.DENIED) {
              if (callBack) {
                callBack();
              }
            }
          });
          break;
        case RESULTS.GRANTED:
          if (callBack) {
            callBack();
          }
          break;
        case RESULTS.BLOCKED:
          // alert(DeniedErr);
          break;
        default:
          break;
      }
    })
    .catch((err) => {
      console.log(err);
      // alert(DeniedErr);
      // …
    });
};

export const requestLocationPermission = async (onSuccess, onError) => {
  if (Platform.OS === 'ios') {
    if (onSuccess) {
      onSuccess();
    }
  } else {
    requestPermission(
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      () => {
        if (onSuccess) {
          onSuccess();
        }
      },
      () => {
        if (onError) {
          onError();
        }
      }
    );
  }
};

const requestAndroidPermission = async (permission, minVersion, onSuccess) => {
  if (Platform.OS === 'android' && platformVersion >= minVersion) {
    requestPermission(permission, onSuccess);
    return;
  }
  onSuccess();
};

export const requestReadMediaPermission = async (onSuccess) => {
  requestAndroidPermission(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES, TIRAMISU_VERSION_CODE, onSuccess);
};

export const requestPostNotiPermission = async (onSuccess) => {
  requestAndroidPermission(PERMISSIONS.ANDROID.POST_NOTIFICATIONS, TIRAMISU_VERSION_CODE, onSuccess);
};
