/* eslint-disable */
import moment from 'moment';
import LocaleConfig from '../Config/LocaleConfig';
import jwtDecode from 'jwt-decode';

const isType = (data, type) => {
  const dataType = typeof data;
  return dataType === type;
};

const redirect = (key, itemData, itemFormat) => {
  if (!Array.isArray(itemFormat)) {
    throw new Error('format much is "array"');
  }
  const [type] = itemFormat;
  if (type === 'string') {
    return getString(itemData, itemFormat);
  }
  if (type === 'number') {
    return getNumber(itemData, itemFormat);
  }
  if (type === 'boolean') {
    return getBoolean(itemData, itemFormat);
  }
  if (type === 'object') {
    return getObject(itemData, itemFormat);
  }
  if (type === 'array') {
    return getArray(itemData, itemFormat);
  }
  if (type === 'alias') {
    return getAlias(itemData, itemFormat);
  }
  throw new Error(`Type of ${key} much is "string" or "number" or "boolean" or "object" or "array" or "alias"`);
};

const getString = (data, format) => {
  const [, defaultValue, matchList] = format;
  const validData = data || '';
  if (isType(validData, 'object')) return defaultValue;
  if (matchList) {
    if (Array.isArray(matchList)) {
      if (matchList.includes(validData)) return validData;
      else return defaultValue;
    }
    if (isType(matchList, 'object')) {
      if (matchList.hasOwnProperty(validData)) return matchList[validData];
      else return defaultValue;
    }
    if (isType(matchList, 'function')) {
      return matchList(validData);
    }
    throw new Error(`paramater invalid, ex: ['string', 'defaultvalue', [] or {} or (value)=>{return value} `);
  }
  return validData || defaultValue;
};

const getNumber = (data, format) => {
  const [, defaultValue, matchList] = format;
  const validData = data || '';
  if (isType(validData, 'object')) return defaultValue;
  return validData || defaultValue;
};

const getBoolean = (data, format) => {
  const [, defaultValue] = format;
  if (data === true || data === 'true') return true;
  if (data === false || data === 'false') return false;
  return defaultValue;
};

const getObject = (data, format) => {
  let result = {};
  let validData = {};

  if (data && !Array.isArray(data) && isType(data, 'object')) validData = data;
  else if (data) console.warn(data, ' is not an object');

  const [, objectFormat] = format;
  Object.entries(objectFormat).forEach(([key, itemFormat]) => {
    const [itemType] = itemFormat;
    if (itemType === 'alias') result = { ...result, ...redirect(key, validData[key], itemFormat) };
    else result[key] = redirect(key, validData[key], itemFormat);
  });
  return result;
};

const getArray = (data, format) => {
  const result = [];
  let validData = [];

  if (Array.isArray(data)) validData = data;
  else if (data) {
    console.warn(data, ' is not an array');
  }

  const [, itemFormat] = format;
  validData.forEach((item) => {
    result.push(redirect('array item', item, itemFormat));
  });
  return result;
};

const getAlias = (data, format) => {
  const result = {};
  const [, objectFormat] = format;
  Object.entries(objectFormat).forEach(([key, itemFormat]) => {
    result[key] = redirect(key, data, itemFormat);
  });
  return result;
};

export const getMinuteDisplayFromSecond = (second) => {
  const minute = second % 60;
  return `${parseInt(second / 60)}:${minute < 10 ? `0${minute}` : minute}`;
};

export default (data, format) => {
  const [type] = format;
  if (type === 'object') {
    return getObject(data, format);
  }
  if (type === 'array') {
    return getArray(data, format);
  }
  return null;
};

export const parseJson = (str) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    return null;
  }
};

export const parseDate = (date) => {
  if (date) {
    return new Date(date);
  }
  return undefined;
};

export const formatDate = (date, format = LocaleConfig.dateTimeFormat) => {
  if (date) {
    return moment(date).format(format);
  }
  return undefined;
};
/* format
  * [type, defaultValue]
    - type: is 'boolean' or 'number'
  * ['string', defaultValue, match]
    - match: is array<string> or object or funtion
  * [type, format]
    - type: is 'object' or 'alias'
    - format: is a object, format children of object
  * ['array', format]
    - format: is a [type, defaultValue], format item of array
ex:
  const format = ['object', {
    id: ['string', ''],
    gender: ['alias', {
      genderCode: ['string', '', ['male', 'female']],
      genderName: ['string', 'Chưa xác định', { male: 'Nam', female: 'Nữ' }],
      genderX: ['string', '', (gender) => gender + '-X'],
    }],
    isProcessed: ['boolean', false],
    costPrice: ['number', 0],
    medicalTest: ['object', {
      operatorId: ['string', 'chưa định'],
      allowClinicIds: ['array', ['string', '']],
      allowClinicalServices: ['array', ['object', {
        id: ['string', ''],
        name: ['string', 'Chưa xác định'],
      }]],
    }],
  }];
*/

export const getDefaultTitle = ({ moduleDetail, fieldName, preConditions }) => {
  if (moduleDetail && preConditions) {
    return moduleDetail[fieldName]?.name;
  }
  return '';
};

export const handleTimeUntilExpire = (accessTokenAPI) => {
  const decoded = jwtDecode(accessTokenAPI);
  const now = Date.now().valueOf() / 1000;
  return decoded.exp - now;
};

export const transformTimeToShow = (remainingTime) => ({
  minutes: Math.floor(remainingTime / 60),
  seconds: parseInt(remainingTime % 60, 10),
});
