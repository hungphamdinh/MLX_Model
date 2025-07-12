/* eslint-disable no-nested-ternary */
import RNFetchBlob from 'react-native-blob-util';
import _ from 'lodash';
import I18n from '@I18n';
import RNFS from 'react-native-fs';
import utf8 from 'utf8';
import Base64 from 'base-64';
import apiConfig from '../Config/apiConfig';
import { handleCultureToUrl, handleResponse } from '../Utils/Api';
import { convertUndefinedValue } from '../Transforms/ConvertObjectToQueryString';
import SentryService from './SentryService';
import { calculateFileSize, splitUploadFileSize } from '../Utils/file';
import { parseToJson } from '../Utils/func';
import { Platform } from 'react-native';
import { LIMIT_AZURE_FILE_SIZE } from '../Config/Constants';

export function getAuthHeader(contentType = 'multipart/form-data') {
  return {
    Authorization: `Bearer ${apiConfig.accessTokenAPI}`,
    'api-version': '3',
    'Content-Type': contentType,
  };
}

export function getBearerToken() {
  return {
    authorization: `Bearer ${apiConfig.accessTokenAPI}`,
  };
}

const getFormData = (json) => {
  const bytes = utf8.encode(JSON.stringify(json));
  const encoded = Base64.encode(bytes);
  return JSON.stringify({
    data: encoded,
  });
};

async function fetchBlob(rawUrl, data, method = 'POST', options = { timeout: 600000, hideAlertForCodes: [] }) {
  const { timeout } = options;
  const url = handleCultureToUrl(rawUrl);
  const response = await RNFetchBlob.config({ timeout }).fetch(method, url, getAuthHeader(), data);
  let responseData;
  try {
    responseData = JSON.parse(response.data);
  } catch (e) {
    SentryService.captureException(e);
    throw new Error(I18n.t('ERROR_SOMETHING_WENT_WRONG'));
  }
  const statusCode = _.get(response, 'respInfo.status');
  return handleResponse({
    data: responseData,
    ok: statusCode >= 200 && statusCode < 300,
  });
}

const getModelMultipart = (data) => ({
  name: 'model',
  data: RNFetchBlob.base64.encode(getFormData(data)),
  filename: 'blob',
  type: 'application/json',
});

export async function postMultipartData(rawUrl, data) {
  const model = getModelMultipart(data);
  return fetchBlob(rawUrl, [model]);
}
/**
 * Data have two types, one is array and the other is object
 * the file model is:
 * {
 *  file: 'file:///Volumes/Documents/image/png',
 *  description: 'abc',
 *  mimeType
 *  }
 *
 * */

export async function uploadMultipartFile(rawUrl, data, model, method = 'POST') {
  const files = _.isArray(data) ? data : [data];

  const parts = await Promise.all(files.map(async (file, index) => createImageFormData(file, index)));
  const bodyData = parts.filter((item) => item);
  const descriptions = files.reduce((accumulator, curr, index) => {
    const fileName = curr.fileName
      ? curr.fileName // Image file name
      : curr.name
      ? curr.name // Document file name
      : `part${index}.jpg`;
    let desObj = {
      name: `part${index}`,
      description: curr.description ? curr.description : '',
      fileName: utf8.encode(fileName),
      title: curr.title || '',
    };
    if (curr.longitude && curr.latitude) {
      desObj = {
        ...desObj,
        Longitude: curr.longitude,
        Latitude: curr.latitude,
      };
    }
    if (curr.position || curr.position === 0) {
      desObj = {
        ...desObj,
        position: curr.position,
      };
    }
    return [...accumulator, convertUndefinedValue(desObj)];
  }, []);

  if (model) {
    bodyData.push(getModelMultipart(model));
  }

  bodyData.push({
    name: 'file-description',
    data: RNFetchBlob.base64.encode(getFormData(descriptions)),
    filename: 'blob',
    type: 'application/json',
  });

  return fetchBlob(rawUrl, bodyData, method, 120000);
}

export async function uploadFile(rawUrl, data, model, method) {
  const files = _.isArray(data) ? data : [data];
  const localFiles = files.filter((item) => item.path);
  const totalLocalSize = calculateFileSize(localFiles);
  if (totalLocalSize > LIMIT_AZURE_FILE_SIZE && !model) {
    const files = splitUploadFileSize(localFiles);
    const uploadResults = await Promise.all(
      files.map(async (file) => uploadMultipartFile(rawUrl, file, model, method))
    );
    return uploadResults.flat();
  }
  return uploadMultipartFile(rawUrl, data, model, method);
}

const convertFilePathIOS = (path) => path.replace('file://', '');

const checkFileExistence = async (filePath, file) => {
  if (Platform.OS === 'ios') {
    filePath = filePath.split('%20').join(' ');
    if (!(await RNFS.exists(filePath))) {
      return convertFilePathIOS(file.fileCopyUri);
    }
  } else if (filePath.indexOf('content://') === -1) {
    if (!(await RNFS.exists(filePath))) {
      throw new Error('File not exist');
    }
  }
  return filePath;
};

const createImageFormData = async (file, index) => {
  try {
    const fileName = `part${index}`;
    let filePath =
      // Local Image
      file.file
        ? file.file.replace('file://', '')
        : file.uri
        ? file.uri.replace('file://', '')
        : // Image from server
        file.urls
        ? file.urls
        : file.fileUrl;
    const fileType = file.mimeType ? file.mimeType : 'image/jpeg';
    filePath = await checkFileExistence(filePath, file);

    const base64File = await RNFS.readFile(filePath, 'base64');
    return {
      name: `part${index}`,
      filename: fileName,
      type: fileType,
      data: RNFetchBlob.base64.encode(base64File),
    };
  } catch (e) {
    console.log(e);
  }
  return null;
};

// Download file
export const downLoadFile = async (rawUrl, localFile, body, method = 'POST') => {
  let data;
  if (method === 'POST' && body) {
    const bytes = utf8.encode(JSON.stringify(body));
    const encoded = Base64.encode(bytes);
    data = JSON.stringify({ data: encoded });
  }
  const url = handleCultureToUrl(rawUrl);
  const response = await RNFetchBlob.config({ timeout: 600000 }).fetch(
    method,
    url,
    getAuthHeader('application/json'),
    data
  );
  const statusCode = _.get(response, 'respInfo.status');
  if (statusCode >= 200 && statusCode < 300) {
    const responseData = parseToJson(response.data);
    const result = _.first(responseData.result);
    if (result) {
      return result;
    }
    if (responseData?.success) {
      return responseData;
    }

    await RNFS.writeFile(localFile, response.data, 'base64');
    return true;
  }
  throw new Error(I18n.t('ERROR_SOMETHING_WENT_WRONG'));
};

export const getLiveFiles = async (list) => {
  const files = await Promise.all(
    list.map(async (item) => {
      const isExist = await RNFS.exists(item.file);
      return {
        ...item,
        isExist,
      };
    })
  );
  return {
    existedFiles: files.filter((item) => item.isExist),
    notFounds: files.filter((item) => !item.isExist),
  };
};
