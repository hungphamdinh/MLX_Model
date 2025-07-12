import { Dimensions, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

const dimen = Dimensions.get('window');

const { width, height } = dimen;

const DEFAULT_WIDTH = 350;
const DEFAULT_HEIGHT = 680;

export const scale = (size) => (width / DEFAULT_WIDTH) * size;

const Metric = {
  ScreenWidth: width,
  ScreenHeight: height,
  isIOS: Platform.OS === 'ios',
  isIPProMax: ['iPhone17,2', 'iPhone16,2', 'iPhone15,3', 'iPhone14,3', 'iPhone13,4', 'iPhone12,5'].includes(
    DeviceInfo.getDeviceId()
  ),
  isANDROID: Platform.OS === 'android',
  isIphoneX:
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (dimen.height === 812 ||
      dimen.width === 812 ||
      dimen.height === 896 ||
      dimen.width === 896 ||
      dimen.height === 780 ||
      dimen.width === 780 ||
      dimen.height === 844 ||
      dimen.width === 844 ||
      dimen.height === 926 ||
      dimen.width === 926),
  isIPhone12:
    Platform.OS === 'ios' && !Platform.isPad && !Platform.isTVOS
      ? height === 844 || width === 844 || height === 926 || width === 926 || height === 780 || height === 780
      : null,
  iconSize20: width <= 320 ? 15 : 20,
  iconSize50: width <= 320 ? 40 : 50,
  iconSize15: width <= 320 ? 13 : 15,
  iconSize10: 10,
  iconSize5: 5,

  space5: 5,
  space10: 10,
  space13: 13,
  space15: width <= 320 ? 12 : 15,
  Space: 12,
  space50: width <= 320 ? 40 : 50,
  space30: width <= 320 ? 25 : 30,
  space25: width <= 320 ? 20 : 25,
  space40: width <= 320 ? 30 : 40,
  space60: width <= 320 ? 50 : 60,
  space20: width <= 320 ? 10 : 20,

  borderRadius10: 10,
  borderRadius20: 20,
  borderRadius5: 5,

  titleHeader: scale(20),

  text20: width <= 320 ? 15 : 20,
  text10: 10,
  text13: 13,
  scale: (size) => scale(size),
};
export default Metric;
