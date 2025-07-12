/**
 * Created by thienmd on 8/11/20
 */

import { getKeyByBundle } from './index';

class APIConfig {
  static _instance: APIConfig;
  apiCore = '';
  apiAccount = '';
  apiCommon = '';
  apiBooking = '';
  accessToken = '';
  accessTokenAPI = '';
  encToken = '';

  constructor() {
    if (APIConfig._instance) {
      throw new Error('Error: Instantiation failed: Use SingletonClass.getInstance() instead of new.');
    }
    const serviceApi = getKeyByBundle(
      'https://admin-vn.propertycube.asia',
      'https://admin-sg.propertycube.asia',
      'https://admin-hk.propertycube.asia',
      'https://admin-th.propertycube.asia',
      'https://uat-admin.propertycube.asia',
      'https://dev-admin.propertycube.asia',
      'https://portal.savillsinspection.asia',
      'https://dev.savillsinspection.asia',
      'https://uat.savillsinspection.asia',
      'https://admin-id.propertycube.asia',
      'https://admin-my.propertycube.asia'
    );

    this.apiCore = `${serviceApi}/core`;
    this.apiCommon = `${serviceApi}/common`;
    this.apiBooking = `${serviceApi}/booking`;

    this.apiAccount = getKeyByBundle(
      'https://accounts-vn.propertycube.asia/api',
      'https://accounts-sg.propertycube.asia/api',
      'https://accounts-hk.propertycube.asia/api',
      'https://accounts-th.propertycube.asia/api',
      'https://uat-auth.propertycube.asia/api',
      'https://dev-auth.propertycube.asia/api',
      'https://portal.savillsinspection.asia/auth/api',
      'https://dev.savillsinspection.asia/auth/api',
      'https://uat.savillsinspection.asia/auth/api',
      'https://accounts-id.propertycube.asia/api',
      'https://accounts-my.propertycube.asia/api'
    );
  }

  static getInstance(): APIConfig {
    if (!APIConfig._instance) {
      APIConfig._instance = new APIConfig();
    }
    return this._instance;
  }
}

export default APIConfig.getInstance();
