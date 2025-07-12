import I18n from '@I18n';
import _ from 'lodash';
import NavigationService from '@NavigationService';
import AsyncStorage from '@react-native-community/async-storage';
import isEmpty from 'lodash/isEmpty';
import RNRestart from 'react-native-restart';
import DeviceInfo from 'react-native-device-info';
import PushNotification from 'react-native-push-notification';
import { DeviceStore, ProtectedStorage, getStorageInfo, initProtectedStorage } from '../../../Services/MMKVStorage';
import { useHandlerAction, useStateValue } from '../../index';
import {
  bootstrapAppFailure,
  bootstrapAppRequest,
  bootstrapAppSuccess,
  checkForceUpdateFailure,
  checkForceUpdateRequest,
  checkForceUpdateSuccess,
  getPasswordComplexitySettingFailure,
  getPasswordComplexitySettingRequest,
  getPasswordComplexitySettingSuccess,
  setLangIdRequest,
  setVisibleNoticeRequest,
  setAllowScanQRCodeRequest,
  getAllSettingsRequest,
  getAllSettingsSuccess,
  getAllSettingsFailure,
  setDeveloperModeRequest,
  getBiometricTermConditionsRequest,
  getBiometricTermConditionsSuccess,
  getBiometricTermConditionsFailure,
  SHOW_LOADING,
  GET_EMPLOYEES_BY_TENANT,
  GET_EMPLOYEES,
  GET_SIMPLE_COMPANIES,
} from '../Actions';
import { RequestApi } from '../../../Services';
import { NetWork, modal } from '../../../Utils';
import keyDeviceStore from '../../../Utils/keyDeviceStore';
import useUser from '../../User/Hooks/UseUser';
import useHome from '../../Home/Hooks/UseHome';
import ApiConfig from '../../../Config/apiConfig';
import { compareVersion } from '../../../Utils/version';
import { handleCacheRequestFromAsyncStorage } from '../../../Utils/network';
import { clearOldLogs } from '../../../Services/LogService';
import { AUTH_MODAL_STATUS, BIOMETRIC_STATUS } from '../../../Config/Constants';
import { analytics } from '../../../Services/AnalyticService';

const clearStorage = async () => {
  const allKeys = await AsyncStorage.getAllKeys();
  if (_.size(allKeys) > 0) {
    AsyncStorage.getAllKeys().then((keys) => AsyncStorage.multiRemove(keys));
  }
};

export const clearDeviceStore = async () => {
  const biometricSetting = await DeviceStore.get(keyDeviceStore.BIOMETRIC_SETTING);
  const keys = DeviceStore.getAllKeys();

  keys.forEach((key) => {
    const shouldKeepKey =
      (biometricSetting === BIOMETRIC_STATUS.ON && key === keyDeviceStore.BIOMETRIC_SETTING) ||
      key === keyDeviceStore.LANGUAGEID;

    if (!shouldKeepKey) {
      DeviceStore.mmkvStorage.delete(key);
    }
  });
};

export const deleteProtectedStorage = async () => {
  if (ProtectedStorage) {
    ProtectedStorage.delete(keyDeviceStore.ACCESSTOKEN_ACCOUNT);
    ProtectedStorage.delete(keyDeviceStore.ACCESSTOKEN_API);
    ProtectedStorage.delete(keyDeviceStore.ENCTOKEN);
    ProtectedStorage.delete(keyDeviceStore.TANENTSELECTED);
    ProtectedStorage.delete(keyDeviceStore.LISTTANENT);
    ProtectedStorage.delete(keyDeviceStore.USER);
    ProtectedStorage.delete(keyDeviceStore.ACCOUNT_USER_ID);
  }
};

export const clearAuth = async () => {
  setTimeout(() => {
    RNRestart.Restart();
  }, 500);
  clearDeviceStore();
  clearStorage();
  deleteProtectedStorage();
  ApiConfig.accessToken = undefined;
  ApiConfig.accessTokenAPI = undefined;
  ApiConfig.encToken = undefined;

  analytics.clearUserProperties();
};

const useApp = () => {
  const [{ app }, dispatch] = useStateValue();
  const {
    getSecuritySetting,
    boostrapUser,
    getAllHostSetting,
    getEmailRegex,
    setVisibleAuthConfirmModal,
    updateBiometricSettings,
    getStayedLoggedIn,
    getCurrentInformation,
  } = useUser();
  const { getHomeModules } = useHome();
  const { withLoadingAndErrorHandling, withErrorHandling } = useHandlerAction();


  const checkForceUpdate = async () => {
    let haveNewVersion = false;
    try {
      dispatch(checkForceUpdateRequest());
      const result = await handleCacheRequestFromAsyncStorage(RequestApi.getSystemVersion);
      const { buildNumber, version } = result;
      const currentVersion = DeviceInfo.getVersion();
      const currentBuildNumber = DeviceInfo.getBuildNumber();

      if (compareVersion(version, currentVersion) === 1) {
        haveNewVersion = true;
      }
      if (compareVersion(version, currentVersion) === 0 && buildNumber > currentBuildNumber) {
        haveNewVersion = true;
      }

      dispatch(checkForceUpdateSuccess(haveNewVersion));
    } catch (e) {
      dispatch(checkForceUpdateFailure(e));
    }
    return haveNewVersion;
  };

  const bootstrapLanguage = async () => {
    const languages = await handleCacheRequestFromAsyncStorage(RequestApi.requestGetLanguage);
    const languageID =
      (await getStorageInfo(keyDeviceStore.LANGUAGEID, DeviceStore)) ||
      languages.find((item) => item.isDefaultLanguageName)?.id ||
      'en';

    I18n.init(languages, languageID);
    setLangId(languageID, true);
  };

  const bootstrapApp = async (params) => {
    try {
      dispatch(bootstrapAppRequest(params));
      const encryptionKey = await DeviceStore.get(keyDeviceStore.ENCRYPTED_PASSWORD);
      if (encryptionKey) {
        initProtectedStorage(encryptionKey);
      }
      const accessTokenApi = await getStorageInfo(keyDeviceStore.ACCESSTOKEN_API);
      const accessTokenAcc = await getStorageInfo(keyDeviceStore.ACCESSTOKEN_ACCOUNT);
      const encToken = await getStorageInfo(keyDeviceStore.ENCTOKEN);

      const tenantSelected = await getStorageInfo(keyDeviceStore.TANENTSELECTED);
      const user = await getStorageInfo(keyDeviceStore.USER);
      const accountUserId = await getStorageInfo(keyDeviceStore.ACCOUNT_USER_ID);

      const authConfirmVisible = await getStorageInfo(keyDeviceStore.AUTH_CONFIRM_MODAL_VISIBLE);
      const isLoggedIn = !(isEmpty(accessTokenAcc) || isEmpty(tenantSelected));
      if (isLoggedIn) {
        ApiConfig.accessToken = accessTokenAcc;
        ApiConfig.accessTokenAPI = accessTokenApi;
        ApiConfig.encToken = encToken;
      }
      await bootstrapLanguage();
      const haveUpdate = await NetWork.handleOffline(checkForceUpdate);
      if (haveUpdate) return;
      getPasswordComplexitySetting();
      getEmailRegex();
      clearOldLogs();
      const biometricSetting = await updateBiometricSettings();
      getStayedLoggedIn();
      if (!isLoggedIn) {
        getAllHostSetting();
        NavigationService.navigate(biometricSetting === BIOMETRIC_STATUS.ON ? 'nonSavillsLogin' : 'login');
      } else {
        boostrapUser({ user, accountUserId, isLoggedIn: true });
        if (!accountUserId) {
          // logout
          resetApp();

          return;
        }

        await getSecuritySetting({ tenant: tenantSelected, userId: accountUserId });
        await getCurrentInformation(accountUserId);
        await getHomeModules();
        if (authConfirmVisible === AUTH_MODAL_STATUS.ON) {
          setVisibleAuthConfirmModal(true);
        }
      }
      dispatch(bootstrapAppSuccess());
    } catch (err) {
      dispatch(bootstrapAppFailure(err));
    }
  };

  const resetApp = async () => {
    clearAuth();
    PushNotification.setApplicationIconBadgeNumber(0);
  };

  const logout = async () => {
    await RequestApi.logout();
    await resetApp();
  };

  const setVisibleNotice = (payload) => {
    dispatch(setVisibleNoticeRequest(payload));
  };

  const setLangId = (payload, skipStoreStorage) => {
    if (!skipStoreStorage) {
      DeviceStore.save(keyDeviceStore.LANGUAGEID, payload);
    }
    I18n.setLanguageId(payload);
    dispatch(setLangIdRequest(payload));
  };

  const getPasswordComplexitySetting = async () => {
    try {
      dispatch(getPasswordComplexitySettingRequest());
      const result = await handleCacheRequestFromAsyncStorage(RequestApi.getPasswordComplexitySetting);

      const passwordSetting = result.setting;
      let pattern = '^';
      if (passwordSetting.requireDigit) {
        pattern += '(?=.*[0-9])';
      }
      if (passwordSetting.requireLowercase) {
        pattern += '(?=.*[a-z])';
      }
      if (passwordSetting.requireUppercase) {
        pattern += '(?=.*[A-Z])';
      }
      if (passwordSetting.requireNonAlphanumeric) {
        pattern += '(?=.*[@!#$%^&+-])';
      }
      pattern += `.{${passwordSetting.requiredLength}}`;
      const regexPassword = new RegExp(pattern);

      dispatch(getPasswordComplexitySettingSuccess({ regexPassword, passwordSetting }));
    } catch (e) {
      dispatch(getPasswordComplexitySettingFailure(e));
    }
  };

  const setAllowScanQRCode = (allowScan) => {
    try {
      dispatch(setAllowScanQRCodeRequest(allowScan));
    } catch (err) {
      modal.showError(I18n.t('SOMETHING_WENT_WRONG'));
    }
  };

  const getAllSettings = async () => {
    try {
      dispatch(getAllSettingsRequest());
      const response = await handleCacheRequestFromAsyncStorage(RequestApi.getAllSettings);
      dispatch(getAllSettingsSuccess(response));
    } catch (err) {
      dispatch(getAllSettingsFailure(err));
    }
  };

  const setDeveloperMode = (isDeveloperMode) => {
    dispatch(setDeveloperModeRequest(isDeveloperMode));
  };

  const getBiometricTermConditions = async () => {
    try {
      dispatch(getBiometricTermConditionsRequest());
      const response = await RequestApi.getBiometricTermConditions();
      dispatch(getBiometricTermConditionsSuccess(response));
    } catch (err) {
      dispatch(getBiometricTermConditionsFailure(err));
    }
  };

  const getEmployeesByTenant = async (params) => {
    const response = await RequestApi.getListEmployeesByTenant(params);
    return response;
  };

  const getEmployees = async (params) => {
    const response = await RequestApi.getSimpleEmployees(params);
    return response;
  };

  const showLoading = (loading) => {
    dispatch({
      type: SHOW_LOADING,
      payload: loading,
    });
  };

  const getSimpleCompanies = async (params) => {
    const response = await RequestApi.getSimpleCompanies(params);
    return response;
  };

  return {
    app,
    bootstrapApp,
    resetApp,
    setVisibleNotice,
    setLangId,
    checkForceUpdate,
    getPasswordComplexitySetting,
    setAllowScanQRCode,
    getAllSettings,
    setDeveloperMode,
    getBiometricTermConditions,
    showLoading,
    bootstrapLanguage,
    logout,
    getEmployeesByTenant: withErrorHandling(GET_EMPLOYEES_BY_TENANT, getEmployeesByTenant),
    getEmployees: withErrorHandling(GET_EMPLOYEES, getEmployees),
    getSimpleCompanies: withErrorHandling(GET_SIMPLE_COMPANIES, getSimpleCompanies),
  };
};

export default useApp;
