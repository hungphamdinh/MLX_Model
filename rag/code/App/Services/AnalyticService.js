import fbAnalytics from '@react-native-firebase/analytics';
import * as Sentry from '@sentry/react-native';
import _ from 'lodash';

import logService from './LogService';

const log = logService.extend('Analytics');

const notLoggedInRoutes = [
  'forgotPassword',
  'changePassword',
  'resetPassword',
  'login',
  'passwordFill',
  'verifyOTPCode',
  'selectTenant',
  'splash',
];

class Analytics {
  constructor() {
    if (Analytics._instance) {
      throw new Error('Error: Instantiation failed: Use SingletonClass.getInstance() instead of new.');
    }
    userId = null;
    accountId = null;
    tenantId = null;
  }

  static getInstance() {
    if (!Analytics._instance) {
      Analytics._instance = new Analytics();
    }
    return Analytics._instance;
  }

  async logScreenView(currentRouteName) {
    log.info(`Log screen view: ${currentRouteName}`);
    log.info('User Properties ', { userId: this.userId, accountId: this.accountId, tenantId: this.tenantId });
    // only logs screen view for logged screen if maintab is exist and have userid
    if (!notLoggedInRoutes.includes(currentRouteName) && (!this.userId || !this.accountId || !this.tenantId)) {
      const errorMessage = 'User ID is blank';
      log.error(errorMessage, currentRouteName);
      const error = new Error(errorMessage);
      Sentry.captureException(error);

      return;
    }

    if (!_.isEmpty(currentRouteName)) {
      await fbAnalytics().logScreenView({
        screen_name: currentRouteName,
        screen_class: currentRouteName,
      });
    }
  }

  async clearUserProperties() {
    this.userId = null;
    this.accountId = null;
    this.tenantId = null;
    await fbAnalytics().setUserId(null);
    await fbAnalytics().setUserProperty('tenant_id', null);
    await fbAnalytics().setUserProperty('account_id', null);
    await fbAnalytics().setUserProperty('release_number', '1');
  }

  async setUserProperties(userId, accountId, tenantId) {
    this.userId = userId;
    this.accountId = accountId;
    this.tenantId = tenantId;
    await fbAnalytics().setUserId(`${userId}`);
    await fbAnalytics().setUserProperty('tenant_id', `${tenantId}`);
    await fbAnalytics().setUserProperty('account_id', `${accountId}`);
    await fbAnalytics().setUserProperty('release_number', '1');
  }
}

export const analytics = Analytics.getInstance();
