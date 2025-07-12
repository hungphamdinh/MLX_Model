/**
 * Created by thienmd on 10/14/20
 */

import Toast from 'react-native-simple-toast';
import _ from 'lodash';
import I18n from '@I18n';
import { BUNDLE_ID } from '../Config';

function showMessage(message) {
  Toast.show(message, Toast.SHORT, Toast.CENTER);
}

export default {
  showError: (message) => {
    showMessage(message);
  },
  showSuccess: (message) => {
    showMessage(message);
  },
  showDevError: (message) => {
    if (_.includes(['com.savills.spms.admin.dev', 'com.spms.inspection.dev'], BUNDLE_ID)) {
      showMessage(message);
    }
  },
  showExceptionMessage: (err) => {
    Toast.showShortCenter(err.message || I18n.t('ERROR_SOMETHING_WENT_WRONG'));
  },
};
