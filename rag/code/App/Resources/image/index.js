import _ from 'lodash';
import { isSIBundleID } from '../../Config';

export const images = {
  logo: isSIBundleID ? require('./logo.png') : require('./logo-hub.png'),
  weather01: require('./weathers/01.png'),
  weather01Night: require('./weathers/01-night.png'),
  weather02: require('./weathers/02.png'),
  weather02Night: require('./weathers/02-night.png'),
  weather03: require('./weathers/03.png'),
  weather04: require('./weathers/04.png'),
  weather09: require('./weathers/09.png'),
  weather10: require('./weathers/10.png'),
  weather10Night: require('./weathers/10-night.png'),
  weather11: require('./weathers/11.png'),
  weather13: require('./weathers/13.png'),
  weather50: require('./weathers/50.png'),
  weatherCloudBackground: require('./weathers/cloud_background.png'),
  imagePlaceholder: require('./image-placeholder.png'),
  loginBackground: require('./login-background.png'),
  surveyTotalBox: require('./survey-total-box.png'),
  maintenance: require('./warning.png'),
  pinCode: require('./pin-code.png'),
};
