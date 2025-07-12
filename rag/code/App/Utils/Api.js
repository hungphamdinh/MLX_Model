/* @flow */
/* eslint no-underscore-dangle: 0 */
import Base64 from 'base-64';
import utf8 from 'utf8';
import _ from 'lodash';
import I18n from '@I18n';
import apiConfig from '../Config/apiConfig';
import { modal, toast } from './index';
import { convertUndefinedValue } from '../Transforms/ConvertObjectToQueryString';
import { isParamValid } from './regex';
import { azureRestrictedTerms } from '../Config/Constants';

export default class Api {
  baseURL: string;
  headers: Object;
  useRequestTransform: boolean;
  requestTransform: Function;
  useResponseTransform: boolean;
  responseTransform: Function;

  constructor(baseURL: string, headers: Object) {
    this.baseURL = baseURL.endsWith('/') ? baseURL : `${baseURL}/`;
    this.headers = headers;
    this.useRequestTransform = false;
    this.useResponseTransform = false;
  }

  _createRequest = (method: 'POST' | 'GET' | 'PUT' | 'DELETE', uri: string, param: ?Object = null) => {
    const requestConfig = {
      method,
      headers: this.headers,
      url: uri.startsWith('/') ? this.baseURL + uri.substring(1) : this.baseURL + uri,
      body: convertUndefinedValue(param),
    };
    if (method === 'GET' && !isParamValid(requestConfig.url)) {
      modal.showError(I18n.t('INVALID_TERMS_IN_PARAMS', null, azureRestrictedTerms.join(', ')));
      return;
    }
    if (this.useRequestTransform) return this.requestTransform(requestConfig);
    return requestConfig;
  };

  _excuteRequest = async (rawUrl: string, param: Object, isEncrypt = false) => {
    const url = handleCultureToUrl(rawUrl);
    let status = null;
    let data = null;
    let ok = false;
    let originalError = null;
    let statusText = null;
    let problem = null;
    let config = {
      ...param,
      cache: 'no-store',
      url,
    };
    if (isEncrypt) {
      const bytes = utf8.encode(param.body);
      const encoded = Base64.encode(bytes);
      config.body = JSON.stringify({ data: encoded });

      config.headers = {
        ...config.headers,
        'api-version': 1,
      };
    }

    try {
      const responseRequest = await fetch(url, config);
      const { status: statusResponse, ok: okResponse, statusText: statusTextResponse, headers = {} } =
        responseRequest || {};
      status = statusResponse;
      ok = okResponse;
      statusText = statusTextResponse;
      config = { ...config, ...headers };
      if (statusResponse >= 400 && statusResponse < 500) {
        problem = 'CLIENT_ERROR';
      }
      if (statusResponse >= 500) {
        problem = 'SERVER_ERROR';
      }
      data = await responseRequest.json();
    } catch (error) {
      originalError = `${error}`;
      problem = `${error.message}`.startsWith('Network request failed')
        ? 'NETWORK_ERROR'
        : error.message === 'timeout'
        ? 'TIMEOUT_ERROR'
        : 'UNKNOWN_ERROR';
    }

    const response = {
      status,
      data,
      ok,
      originalError,
      statusText,
      problem,
      config,
    };
    if (this.useResponseTransform) return this.responseTransform(response);
    return response;
  };

  timeout = (ms, promise) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('timeout'));
      }, ms);
      promise.then(resolve, reject);
    });
  setBaseURL = (baseURL: string) => {
    this.baseURL = baseURL.endsWith('/') ? baseURL : `${baseURL}/`;
  };

  setHeader = (key: string, value: string) => {
    this.headers[key] = value;
  };

  setAuthHeader = (isAccountToken) => {
    const token = isAccountToken ? apiConfig.accessToken : apiConfig.accessTokenAPI;

    if (token) {
      this.setHeader('Authorization', `Bearer ${token}`);
    }
  };

  getHeader = (key: string) => this.headers[key] || '';

  setHeaders = (headerObject: Object) => {
    this.headers = { ...this.headers, ...headerObject };
  };

  setRequestTransform = (callBack: Function) => {
    this.useRequestTransform = true;
    this.requestTransform = callBack;
  };

  removeRequestTransform = () => {
    this.useRequestTransform = false;
    this.requestTransform = () => {};
  };

  setResponseTransform = (callBack: Function) => {
    this.useResponseTransform = true;
    this.responseTransform = callBack;
  };

  removeResponseTransform = () => {
    this.useResponseTransform = false;
    this.responseTransform = () => {};
  };

  get = async (uri: string, isAccountToken) => {
    this.setAuthHeader(isAccountToken);
    const { method, url, headers } = this._createRequest('GET', uri);

    const response = await this._excuteRequest(url, { method, headers });
    return response;
  };

  getWithOutToken = async (uri) => {
    const { method, url, headers } = this._createRequest('GET', uri);
    const response = await this._excuteRequest(url, { method, headers });
    return response;
  };

  delete = async (uri: string) => {
    this.setAuthHeader(false);
    const { method, url, headers } = this._createRequest('DELETE', uri);

    const response = await this._excuteRequest(url, { method, headers });
    return response;
  };

  put = async (uri: string, requestParams: Object, isArrayBody) => {
    const { isAccountToken, ...param } = requestParams;
    this.setAuthHeader(isAccountToken);
    const { method, url, body, headers } = this._createRequest('PUT', uri, isArrayBody ? requestParams : param);

    const response = await this._excuteRequest(
      url,
      {
        method,
        headers,
        body: JSON.stringify(body),
      },
      true
    );
    return response;
  };

  post = async (uri: string, requestParams: Object = {}, isArrayBody) => {
    const { isAccountToken, ...param } = requestParams;
    this.setAuthHeader(isAccountToken);
    const { method, url, body, headers } = this._createRequest('POST', uri, isArrayBody ? requestParams : param);

    const response = await this._excuteRequest(
      url,
      {
        method,
        headers,
        body: JSON.stringify(body),
      },
      true
    );
    return response;
  };

  postUpload = async (uri: string, requestParams: Object) => {
    const { isAccountToken, ...param } = requestParams;
    this.setAuthHeader(isAccountToken);
    const { method, url, body, headers } = this._createRequest('POST', uri, param);

    const response = await this._excuteRequest(url, { method, headers, body });
    return response;
  };
}

export const handleResponse = (response, showToast = false) => {
  const { ok, data } = response;

  if (ok && _.get(data, 'success')) {
    return _.get(data, 'result');
  }

  const errorResponse = _.get(response, 'data.error', {});
  const errMessage = errorResponse.details || errorResponse.message || I18n.t('ERROR_SOMETHING_WENT_WRONG');
  !showToast ? modal.showError(errMessage) : toast.showError(errMessage);
  throw new Error(errMessage);
};

export const handleResponseV1 = (response, showToast = false, options = {}) => {
  const dataError = _.get(response, 'data.error');
  if (dataError) {
    if (options.hideErrDialog) {
      return;
    }
    const errMessage = dataError.message || I18n.t('MODAL_ERROR_CONTENT');
    showToast ? toast.showError(errMessage) : modal.showError(errMessage);
  }
  return response;
};

export const handleCultureToUrl = (url) => {
  if (url.indexOf('culture=') > -1) return url;
  const regex = /(\?)([^=]+)/gm;
  const match = url.match(regex);
  const cultureParam = `culture=${I18n.languageId}`;
  if (match) {
    return `${url}&${cultureParam}`;
  }
  return `${url}?${cultureParam}`;
};
