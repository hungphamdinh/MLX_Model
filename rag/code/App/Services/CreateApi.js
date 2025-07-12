/* @flow */

import get from 'lodash/get';
import { Platform } from 'react-native';
import { ProtectedStorage } from '@Services/MMKVStorage';
import NavigationService from '@NavigationService';
import { Api, toast } from '../Utils';
import { handleResponse, handleResponseV1 } from '../Utils/Api';
import I18n from '@I18n';
import { clearAuth } from '../Context/App/Hooks/UseApp';

const createApi = (
  baseURL: string = '',
  isUpload: boolean = false,
  enableHandleResponse = false,
  showToast = false,
  options = {},
) => {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    deviceTypeId: Platform.OS === 'ios' ? 5 : 6,
    'cache-control': 'no-cache',
  };
  const api = new Api(baseURL, headers);
  if (isUpload) {
    api.setHeader('Content-Type', 'multipart/form-data');
  }
  api.setResponseTransform(async (response) => {
    if (response.status === 401 || response.data?.error?.details === '[Force user locked out]') {
      toast.showError(I18n.t('LOGIN_EXPIRED_ERROR', 'The login session has expired, Please login again'));
      clearAuth();
    }
    if (response.status === 299) {
      NavigationService.replace('maintenance');
      throw new Error('Service unavailable');
    }
    if (response) {
      if (
        (response.problem === 'TIMEOUT_ERROR' ||
          response.problem === 'CLIENT_ERROR' ||
          response.problem === 'NETWORK_ERROR') &&
        !response.data
      ) {
        response.data = {
          error: {
            status: response.status,
            key: 'TIMEOUT_ERROR',
            message: I18n.t('NO_INTERNET', 'There is no internet detected. Please check your network and try again.'),
          },
          isCustomError: true,
        };
      } else if (response.problem === 'SERVER_ERROR' && !response.data) {
        response.data = {
          error: {
            status: response.status,
            key: 'SERVER_ERROR',
            message: I18n.t('MODAL_ERROR_CONTENT', 'An error ocurred while loading, Please try again later'),
          },
          isCustomError: true,
        };
      }
      const errorKey = get(response, 'data.error.key');
      if (errorKey === 'USER_TOKEN_INVALID') {
        ProtectedStorage.delete('ACCESS_TOKEN');
        // TODO: CodePush.restartApp();
      }
    }

    if (enableHandleResponse) {
      return handleResponse(response, showToast, options);
    }
    return handleResponseV1(response, showToast, options);
  });

  return api;
};

export default createApi;
