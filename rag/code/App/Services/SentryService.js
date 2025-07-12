import * as Sentry from '@sentry/react-native';
import logService from './LogService';

const SentryService = {
  captureException: async (error) => {
    logService.error(error);
    if (__DEV__) {
      return;
    }
    Sentry.captureException(error);
  },
  captureMessage: (...parameters) => {
    if (__DEV__) {
      return;
    }
    Sentry.captureMessage(...parameters);
  },
};

export default SentryService;
