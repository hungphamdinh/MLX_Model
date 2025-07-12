/* @flow */
import _ from 'lodash';

const encodeValue = (value, skipEncodeUri) => (skipEncodeUri ? value : encodeURIComponent(value));

const pushPairArr = (pairs, obj, key, skipEncodeUri) => {
  const encode = (val) => encodeValue(val, skipEncodeUri);

  if (Array.isArray(obj[key])) {
    obj[key].forEach((value) => pairs.push(`${encode(key)}=${encode(value)}`));
  } else {
    pairs.push(`${encode(key)}=${encode(obj[key])}`);
  }
};

export default (obj, isRemoveNull = true, skipEncodeUri = false) => {
  const pairs = [];

  _.keys(obj).forEach((key) => {
    const value = obj[key];
    if (value !== undefined && !(isRemoveNull && value === null)) {
      pushPairArr(pairs, obj, key, skipEncodeUri);
    }
  });

  return pairs.length ? pairs.join('&') : '';
};

export const convertUndefinedValue = (data) => {
  for (const key in data) {
    if (data[key] === undefined) {
      data[key] = null;
    }
  }
  return data;
};
