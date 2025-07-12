/* @flow */
import DeviceInfo from 'react-native-device-info';
import CryptoJS from 'crypto-js';
import { LogBox } from 'react-native';
import { connectToDevTools } from 'react-devtools-core';
import _ from 'lodash';

if (__DEV__) {
  connectToDevTools({
    host: 'localhost',
    port: 8097,
  });
}

LogBox.ignoreAllLogs(true);
LogBox.ignoreLogs([
  'Animated: `useNativeDriver` was not specified.',
  'Require cycle:',
  'Non-serializable values were found in the navigation state',
]);
export const BUNDLE_ID = DeviceInfo.getBundleId();
const isBundleId = (bundleId) => _.includes(BUNDLE_ID, bundleId);
export const isSIBundleID = isBundleId('com.savills.inspection');
export const isSGBundleID = isBundleId('com.spms.admin.sg');
export const isMYBundleID = isBundleId('com.spms.admin.my');

export const isUatBundleId = isBundleId('com.savills.spms.admin.uat');
export const getKeyByBundle = (
  vnKey,
  sgKey,
  hkKey,
  thKey,
  uatKey,
  devKey,
  savillsInspectionKey,
  savillsInspectionDevKey,
  savillsInspectionUatKey,
  inKey,
  myKey
) => {
  switch (BUNDLE_ID) {
    case 'com.savills.spms.admin':
      return vnKey;
    case 'com.spms.admin.sg':
      return sgKey;
    case 'com.spms.admin.hk':
      return hkKey;
    case 'com.spms.admin.th':
      return thKey;
    case 'com.spms.inspection.india':
      return inKey;
    case 'com.spms.admin.in':
      return inKey;
    case 'com.spms.admin.my':
      return myKey;
    case 'com.savills.spms.admin.uat':
      return uatKey;
    case 'com.savills.spms.admin.dev':
      return devKey;
    case 'com.savills.inspection.prod':
      return savillsInspectionKey;
    case 'com.savills.inspection.dev':
      return savillsInspectionDevKey;
    case 'com.savills.inspection.uat':
      return savillsInspectionUatKey;
    default:
      return undefined;
  }
};

export const APP_STORE_LINK = getKeyByBundle(
  'https://itunes.apple.com/us/app/vn-admin-property-cube/id1473916401',
  'https://itunes.apple.com/us/app/sg-admin-property-cube/id1480147822',
  'https://itunes.apple.com/us/app/hk-admin-property-cube/id1525240464',
  'https://itunes.apple.com/us/app/th-admin-property-cube/id1481245607',
  'https://itunes.apple.com/us/app/vn-admin-property-cube/id1473916401',
  'https://itunes.apple.com/us/app/vn-admin-property-cube/id1473916401',
  'https://portal.savillsinspection.asia/download',
  'https://portal.savillsinspection.asia/download',
  'https://portal.savillsinspection.asia/download',
  'https://itunes.apple.com/us/app/india-property-cube-inspection/id1581570048',
  'https://itunes.apple.com/us/app/property-cube-hub-malaysia/id6503419106'
);

export const PLAY_STORE_LINK = getKeyByBundle(
  'market://details?id=com.savills.spms.admin',
  'market://details?id=com.spms.admin.sg',
  'market://details?id=com.spms.admin.hk',
  'market://details?id=com.spms.admin.th',
  'market://details?id=com.savills.spms.admin.uat',
  'market://details?id=com.savills.spms.admin.dev',
  'https://portal.savillsinspection.asia/download',
  'https://portal.savillsinspection.asia/download',
  'https://portal.savillsinspection.asia/download',
  'market://details?id=com.spms.inspection.india',
  'market://details?id=com.spms.admin.my'
);

export const SENDER_ID = getKeyByBundle(
  '96708806952',
  '1052200071140',
  '175665307272',
  '694627535575',
  '1041224770551',
  '839979583555',
  '348284074332',
  '752281561824',
  '477574161588',
  '701593996435',
  '675126414776'
);

export const PAGE_SIZE = 10;

export const DAY_FORMAT = 'DD/MM/YYYY';
export const SERVER_DATE_FORMAT = 'MM-DD-YYYY';

// synchronize between client and backend
export const SYNC_TIME = 500000;

export const DATABASE_NAME = 'data';

// sentry
export const DSN_SENTRY = getKeyByBundle(
  'https://52a5d4f5c3ec4273b1cd3fce3c0e2115@o1011832.ingest.sentry.io/5977077',
  'https://69882cc10c614c3b8f3ca79a8c27760f@o1011832.ingest.sentry.io/5977078',
  'https://33aa0c77adbf4bf98deb35924ab0d2b6@o1011832.ingest.sentry.io/5977079',
  'https://c08cffa04bb04cccbf7523d2cd9fa4d2@o1011832.ingest.sentry.io/5977080',
  'https://02bdf0d219464422a1b7bfb79cb312b4@o1011832.ingest.sentry.io/5977074',
  'https://e0b77d8a3f8248a7ae42addd29de9f70@o1011832.ingest.sentry.io/5977073',
  'https://d09190205f6846ea934575842869ab9c@o4505430860627968.ingest.sentry.io/4505430866198528',
  'https://0a7c73df5672460cac54a0e47cd929c0@o1011832.ingest.sentry.io/6417559',
  'https://4a9ce9e151e543deba1e887fa029abad@o1011832.ingest.sentry.io/6417561',
  'https://b3fc28de86c447a5ae9c27787aca0a94@o1011832.ingest.sentry.io/4505168836296704',
  'https://94e7161a57c77405386f3840e7a0c4d4@o1011832.ingest.us.sentry.io/4507343050833920'
);

const configs = {
  weatherEncryptedAPIKey: 'U2FsdGVkX1+GX7vtfwxTW9OXGVcpK3J7kitvEITW/fdm4qlUO6KPQRcp7D6p+1YV',
  weatherAPIKey: '',
  localPassword: '08e4c30dcbae61487893c9d46c700eb2',
};

export const encryptData = (plaintext, key) =>
  CryptoJS.AES.encrypt(plaintext, key, {
    mode: CryptoJS.mode.ECB,
  }).toString();

export const decryptData = (cipherText, key) =>
  CryptoJS.AES.decrypt(cipherText, key, {
    mode: CryptoJS.mode.ECB,
  }).toString(CryptoJS.enc.Utf8);

export const ZIP_PASSWORD = 'Savills@123';

export const keychainServices = {
  pinVerify: 'pinVerify',
  passwordVerify: 'passwordVerify',
};

export const DURATION_TIMEOUT_BEFORE_IN_APP_NOTICE = 30; // 30 minutes
export const DURATION_TIMEOUT_BEFORE_BANNER_NOTICE = 15; // 15 minutes

export default configs;
