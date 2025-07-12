import _ from 'lodash';
import * as Keychain from 'react-native-keychain';
import I18n from '@I18n';
import * as Sentry from '@sentry/react-native';
import NavigationService from '@NavigationService';
import { Platform, Linking, DeviceEventEmitter, Alert } from 'react-native';
import AzureAuth from 'react-native-azure-auth';
import CookieManager from '@react-native-cookies/cookies';
import AsyncStorage from '@react-native-community/async-storage';
import { useHandlerAction, useStateValue } from '../../index';
import {
  authenticateAdminFailure,
  authenticateAdminRequest,
  authenticateAdminSuccess,
  authenticateMFAFailure,
  authenticateMFARequest,
  authenticateMFASuccess,
  bootstrapUserRequest,
  changePasswordFailure,
  changePasswordRequest,
  changePasswordSuccess,
  checkAuthConfirmAuthFailure,
  checkAuthConfirmAuthRequest,
  checkAuthConfirmAuthSuccess,
  checkAuthenticateFailure,
  checkAuthenticateRequest,
  checkAuthenticateSuccess,
  checkBiometricSettingSuccess,
  checkBiometricSettingsFailure,
  checkBiometricSettingsRequest,
  checkUserEmailFailure,
  checkUserEmailRequest,
  checkUserEmailSuccess,
  externalMicrosoftFailure,
  externalMicrosoftRequest,
  externalMicrosoftSuccess,
  getAllHostSettingFailure,
  getAllHostSettingRequest,
  getAllHostSettingSuccess,
  getCurrentInformationFailure,
  getCurrentInformationRequest,
  getCurrentInformationSuccess,
  getEmailRegexFailure,
  getEmailRegexRequest,
  getEmailRegexSuccess,
  getLinkedAccountFailure,
  getLinkedAccountRequest,
  getLinkedAccountSuccess,
  getMFAUserSettingFailure,
  getMFAUserSettingRequest,
  getMFAUserSettingSuccess,
  getProfilePictureFailure,
  getProfilePictureRequest,
  getProfilePictureSuccess,
  getSecuritySettingFailure,
  getSecuritySettingRequest,
  getSecuritySettingSuccess,
  linkedAccountAuthenticateFailure,
  linkedAccountAuthenticateRequest,
  linkedAccountAuthenticateSuccess,
  loginFailure,
  loginRequest,
  loginSuccess,
  resetPasswordFailure,
  resetPasswordRequest,
  resetPasswordSuccess,
  sendPasswordResetCodeFailure,
  sendPasswordResetCodeRequest,
  sendPasswordResetCodeSuccess,
  setBiometricRequest,
  setVisibleAuthConfirm,
  switchToUserAccountFailure,
  switchToUserAccountRequest,
  switchToUserAccountSuccess,
  updateProfileFailure,
  updateProfileRequest,
  updateProfileSuccess,
  // pin code
  checkAuthenWithPinRequest,
  checkAuthenWithPinSuccess,
  checkAuthenWithPinFailure,
  changePinCodeRequest,
  changePinCodeSuccess,
  changePinCodeFailure,
  setupPinCodeRequest,
  setupPinCodeSuccess,
  setupPinCodeFailure,
  setVisibleSetupPin,
  sendPinResetCodeRequest,
  sendPinResetCodeSuccess,
  sendPinResetCodeFailure,
  resetPinCodeRequest,
  resetPinCodeSuccess,
  resetPinCodeFailure,
  setStayedLoggedInRequest,
  updateUserBiometricRequest,
  updateUserBiometricFailure,
  updateUserBiometricSuccess,
  CHECK_AUTHENTICATE_ANONYMOUS,
  AUTHENTICATE_BIOMETRIC,
  GENERATE_BIOMETRIC_GUID,
  GET_EMPLOYEES,
} from '../Actions';
import { RequestApi } from '../../../Services';
import { handleCacheRequestFromAsyncStorage } from '../../../Utils/network';
import { NetWork, keyDeviceStore, toast } from '../../../Utils';
import RequestAccountApi from '../../../Services/RequestAccountApi';
import ApiConfig from '../../../Config/apiConfig';
import useHome from '../../Home/Hooks/UseHome';
import { AUTH_MODAL_STATUS, BIOMETRIC_STATUS, microsoftTenant } from '../../../Config/Constants';
import { handleResponse } from '../../../Utils/Api';
import { setPMUserId } from '../../PlanMaintenance/Actions';
import configs, { decryptData, keychainServices } from '../../../Config';
import { DeviceStore, initProtectedStorage, ProtectedStorage } from '../../../Services/MMKVStorage';
import { checkEmailSavills } from '../../../Utils/regex';
import { clearAuth } from '../../App/Hooks/UseApp';
import { generateGUID } from '../../../Utils/number';
import { analytics } from '../../../Services/AnalyticService';

async function getInitialURL(moduleId = 'AS', deepLinkPath) {
  const url = deepLinkPath !== 'default' && deepLinkPath ? deepLinkPath : await Linking.getInitialURL();
  let tenantId = null;

  if (url) {
    const path = url.substring(url.lastIndexOfEnd('dynamic/'), url.indexOf('&') > -1 ? url.indexOf('&') : url.length);
    tenantId = path.substring(path.indexOf('/') + 1, path.indexOf(moduleId));
  }
  return parseInt(tenantId, 10);
}

const useUser = () => {
  const [{ user }, dispatch] = useStateValue();
  const { getHomeModules } = useHome();
  const {withLoadingAndErrorHandling} = useHandlerAction();

  const {withErrorHandling} = useHandlerAction();

  const getProfilePicture = async () => {
    try {
      dispatch(getProfilePictureRequest());
      const result = await handleCacheRequestFromAsyncStorage(RequestApi.requestGetProfilePicture);
      const profilePicture = _.get(result, 'profilePicture', '');

      const avatar = _.size(profilePicture) > 0 ? `data:image/png;base64,${profilePicture}` : undefined;
      dispatch(getProfilePictureSuccess(avatar));
    } catch (err) {
      dispatch(getProfilePictureFailure(err));
    }
  };
  
  const handleBiometricSettings = (params) => {
    const {securitySetting, biometricSetting, emailAddress, emailRegex} = params;
    if (!securitySetting?.isBiometricAuthenticationAdmin) return;
  
    const validBiometricStatuses = [BIOMETRIC_STATUS.ON, BIOMETRIC_STATUS.OFF, undefined];
    if (!validBiometricStatuses.includes(biometricSetting)) return;
  
    const isSavillsEmail = checkEmailSavills(emailAddress, emailRegex?.regexEmails);
    if (!isSavillsEmail) {
      biometricSetting === BIOMETRIC_STATUS.ON 
        ? updateUserBiometric(biometricSetting, true) 
        : dispatch(setBiometricRequest(undefined));
    }

  };

  const getCurrentInformation = async (accountId) => {
    try {
      dispatch(getCurrentInformationRequest());
      const response = await handleCacheRequestFromAsyncStorage(RequestApi.requestGetCurrentInformation);
      const { user: currentUser, tenant } = response;
      ProtectedStorage.save(keyDeviceStore.USER, currentUser);
      Sentry.setUser({ username: currentUser.userName, email: currentUser.emailAddress });
      Sentry.setContext('Tenant', {
        name: tenant.tenantName,
        id: tenant.id,
      });

      await analytics.setUserProperties(currentUser.id, accountId, tenant.id);
      dispatch(setPMUserId(currentUser.id));
      dispatch(getCurrentInformationSuccess(response));
    } catch (err) {
      dispatch(getCurrentInformationFailure(err));
    }
  };

  async function migrateData() {
    const accessTokenFromStorage = await AsyncStorage.getItem(keyDeviceStore.ACCESSTOKEN_API);
    if (accessTokenFromStorage) {
      const migrated = await DeviceStore.migrateFromAsyncStorage();
      const migratedSensitive = await ProtectedStorage.migrateFromAsyncStorage();
      if (migrated && migratedSensitive) {
        AsyncStorage.getAllKeys().then((keys) => AsyncStorage.multiRemove(keys));
      }
    }
  }

  const getSecuritySetting = async (payload) => {
    try {
      dispatch(getSecuritySettingRequest(payload));
      const response = await handleCacheRequestFromAsyncStorage(RequestApi.getSecuritySetting);
      if (!response.isBiometricAuthenticationAdmin) {
        DeviceStore.delete(keyDeviceStore.BIOMETRIC_SETTING);
      }
      const initResponse = await initSensitiveStore(payload, response.encryptedPassword);
      if (initResponse) {
        await migrateData();
      }

      dispatch(getSecuritySettingSuccess(response));
    } catch (err) {
      dispatch(getSecuritySettingFailure(err));
    }
  };

  const initSensitiveStore = async (payload, encryptedPassword) => {
    const weatherAPIKey = decryptData(configs.weatherEncryptedAPIKey, encryptedPassword);
    configs.weatherAPIKey = weatherAPIKey;

    // check password from Storage
    const localPassword = await DeviceStore.get(keyDeviceStore.ENCRYPTED_PASSWORD);
    let initResponse = true;
    if (!localPassword) {
      DeviceStore.save(keyDeviceStore.ENCRYPTED_PASSWORD, encryptedPassword);
      if (!localPassword && encryptedPassword) {
        initResponse = initProtectedStorage(encryptedPassword);
      }
    }

    if (initResponse) {
      ProtectedStorage.save(keyDeviceStore.TANENTSELECTED, payload.tenant);
      ProtectedStorage.save(keyDeviceStore.ACCESSTOKEN_API, ApiConfig.accessTokenAPI);
      ProtectedStorage.save(keyDeviceStore.ENCTOKEN, ApiConfig.encToken);
      ProtectedStorage.save(keyDeviceStore.ACCESSTOKEN_ACCOUNT, ApiConfig.accessToken);
      ProtectedStorage.save(keyDeviceStore.ACCOUNT_USER_ID, `${payload.userId}`);
    }
    return initResponse;
  };

  const getEmailRegex = async () => {
    try {
      dispatch(getEmailRegexRequest());
      const result = await handleCacheRequestFromAsyncStorage(RequestApi.getEmailRegexSettings);
      dispatch(getEmailRegexSuccess(result));
    } catch (err) {
      dispatch(getEmailRegexFailure(err));
    }
  };

  const checkAuthConfirmAuth = async (password) => {
    try {
      dispatch(checkAuthConfirmAuthRequest(password));
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        if (password === credentials.password) {
          dispatch(checkAuthConfirmAuthSuccess());
          return;
        }
      }
      throw new Error('Fail to check credential');
    } catch (err) {
      toast.showError(I18n.t('AUTH_FAIL_TO_CHECK_CREDENTIAL'));
      dispatch(checkAuthConfirmAuthFailure(err));
    }
  };

  const setVisibleAuthConfirmModal = (isOn) => {
    ProtectedStorage?.save(
      keyDeviceStore.AUTH_CONFIRM_MODAL_VISIBLE,
      isOn ? AUTH_MODAL_STATUS.ON : AUTH_MODAL_STATUS.OFF
    );
    dispatch(setVisibleAuthConfirm(isOn));
  };

  const clearSecuritySetting = () => {
    dispatch(getSecuritySettingSuccess());
  };

  const login = async (userName, password) => {
    try {
      dispatch(loginRequest({ userName, password }));
      const response = await RequestAccountApi.login(userName, password);
      await Keychain.setGenericPassword(userName, password);
      dispatch(loginSuccess(response));
      ApiConfig.accessToken = response.accessToken;

      getLinkedAccount({
        userId: response.userId,
      });
    } catch (err) {
      dispatch(loginFailure(err));
    }
  };

  const getLinkedAccount = async ({ tenantId, userId }) => {
    try {
      dispatch(getLinkedAccountRequest({ tenantId, userId }));
      const tenants = await RequestApi.getLinkedAccount({
        MaxResultCount: 10,
        SkipCount: 0,
      });
      dispatch(getLinkedAccountSuccess(tenants));
      if (_.size(tenants) === 1) {
        switchToUserAccount({ tenant: _.first(tenants), userId });
        return;
      }
      if (tenantId) {
        const tenant = tenants.find((item) => item.tenantId === tenantId);
        switchToUserAccount({ tenant, userId });
        return;
      }
      NavigationService.navigate('selectTenant');
    } catch (err) {
      dispatch(getLinkedAccountFailure(err));
    }
  };

  const switchToUserAccount = async ({ tenant, userId }) => {
    try {
      dispatch(switchToUserAccountRequest({ tenant, userId }));
      const response = await RequestApi.switchToUserAccount({
        targetTenantId: tenant.tenantId,
        targetUserId: tenant.id,
      });
      dispatch(switchToUserAccountSuccess(response));
      linkedAccountAuthenticate({
        isAccountToken: true,
        switchAccountToken: response.switchAccountToken,
        tenant,
        userId,
      });
    } catch (err) {
      dispatch(switchToUserAccountFailure(err));
    }
  };

  const linkedAccountAuthenticate = async (params) => {
    try {
      dispatch(linkedAccountAuthenticateRequest(params));
      const response = await RequestApi.linkedAccountAuthenticate(params);

      dispatch(linkedAccountAuthenticateSuccess(response));
      ApiConfig.accessTokenAPI = response.accessToken;
      ApiConfig.encToken = response.encryptedAccessToken;
      const languages = await handleCacheRequestFromAsyncStorage(RequestApi.requestGetLanguage);
      I18n.setLanguages(languages);

      await getSecuritySetting({ tenant: params.tenant, userId: params.userId });
      await getCurrentInformation(params.userId);
      await getHomeModules();
    } catch (err) {
      dispatch(linkedAccountAuthenticateFailure(err));
    }
  };

  const boostrapUser = (payload) => {
    dispatch(bootstrapUserRequest(payload));
  };

  const updateProfile = async (params) => {
    try {
      dispatch(updateProfileRequest(params));
      const result = await RequestApi.uploadProfilePicture(params);
      const updateParams = {
        fileName: result.fileName || '',
        x: 0,
        y: 0,
        width: result.width || 500,
        height: result.height || 500,
        mimeType: 'image/jpeg',
      };
      const response = await RequestApi.UpdateProfilePicture(updateParams);
      getProfilePicture();
      dispatch(updateProfileSuccess(response));
    } catch (err) {
      dispatch(updateProfileFailure(err));
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      dispatch(changePasswordRequest({ currentPassword, newPassword }));
      const result = await RequestAccountApi.changePassword(currentPassword, newPassword);
      dispatch(changePasswordSuccess(result));
      return true;
    } catch (err) {
      dispatch(changePasswordFailure(err));
      return false;
    }
  };

  const sendPasswordResetCode = async (email) => {
    try {
      dispatch(sendPasswordResetCodeRequest(email));
      await RequestAccountApi.sendCodeReset(email);

      dispatch(sendPasswordResetCodeSuccess(email));
      NavigationService.navigate('resetPassword');
    } catch (err) {
      dispatch(sendPasswordResetCodeFailure(err));
    }
  };

  const resetPassword = async (payload) => {
    try {
      dispatch(resetPasswordRequest(payload));
      const result = await RequestAccountApi.resetPassword(payload);
      dispatch(resetPasswordSuccess(result));
      return true;
    } catch (err) {
      dispatch(resetPasswordFailure(err));
      return false;
    }
  };

  const getAllHostSetting = async () => {
    try {
      dispatch(getAllHostSettingRequest());
      const response = await RequestAccountApi.getAllHostSetting();
      dispatch(getAllHostSettingSuccess(handleResponse(response)));
    } catch (err) {
      dispatch(getAllHostSettingFailure(err));
    }
  };

  const getMFAUserSetting = async (email) => {
    try {
      dispatch(getMFAUserSettingRequest(email));
      const result = await RequestApi.getMfaUserSetting(email);
      dispatch(getMFAUserSettingSuccess(result));
    } catch (err) {
      dispatch(getMFAUserSettingFailure(err));
    }
  };

  const authenticateOTP = async ({ email, guid, otp, deepLinkPath }) => {
    try {
      dispatch(
        authenticateAdminRequest({
          email,
          guid,
          otp,
        })
      );
      const result = await RequestAccountApi.loginByOTP(email, guid, otp);
      if (result) {
        if (result.shouldResetPassword) {
          NavigationService.navigate('resetPassword', {
            passwordResetCode: result.passwordResetCode,
          });
        } else if (result.accessToken) {
          ApiConfig.accessToken = result.accessToken;
          const tenantId = await getInitialURL('AS', deepLinkPath);

          getLinkedAccount({
            tenantId,
            userId: result.userId,
          });
        }
      }
      dispatch(authenticateAdminSuccess(result));
    } catch (err) {
      dispatch(authenticateAdminFailure(err));
    }
  };

  const loginWithMicrosoftAccount = async (email, deepLinkPath) => {
    try {
      const {
        hostSetting: { mfa },
      } = user;
      const { androidSetting, iosSetting } = mfa;
      const azureAuth = new AzureAuth({
        clientId: mfa.clientId,
        tenant: microsoftTenant,
        redirectUri: Platform.OS === 'android' ? androidSetting.redirectUri : iosSetting.redirectUri,
      });
      const scope = mfa.scope;
      dispatch(
        externalMicrosoftRequest({
          azureAuth,
          scope,
        })
      );
      const tokens = await azureAuth.webAuth.authorize({
        scope,
        login_hint: email,
        prompt: __DEV__ ? '' : 'login',
      });
      const params = {
        accessToken: tokens.accessToken,
      };

      const res = await RequestAccountApi.externalAuthenticateMicrosoft(params);
      const result = handleResponse(res);
      dispatch(externalMicrosoftSuccess(result));
      ApiConfig.accessToken = result.accessToken;
      const tenantId = await getInitialURL('AS', deepLinkPath);

      getLinkedAccount({ tenantId, userId: result.userId });
      // clear azure auth cache
      await AsyncStorage.clear();
      await CookieManager.clearAll();
    } catch (err) {
      dispatch(externalMicrosoftFailure(err));
    }
  };

  const authenticateMfa = async (email, password, sentMethod) => {
    dispatch(
      authenticateMFARequest({
        email,
        password,
        sentMethod,
      })
    );
    try {
      const res = await RequestAccountApi.authenticateMFA(email, password, sentMethod);
      dispatch(authenticateMFASuccess(res));
      await Keychain.setGenericPassword(email, password);
      if (res.isFirstLogin) {
        const contractorLoginRes = await RequestAccountApi.login(email, password, res.isFirstLogin);
        if (contractorLoginRes.shouldResetPassword) {
          dispatch(sendPasswordResetCodeSuccess(email));
          NavigationService.navigate('resetPassword', {
            passwordResetCode: contractorLoginRes.passwordResetCode,
          });
        }
        return res;
      }
      NavigationService.navigate('verifyOTPCode', {
        password,
        email,
      });
      return res;
    } catch (err) {
      dispatch(authenticateMFAFailure(err));
    }
    return null;
  };

  const checkUserEmail = async (email) => {
    try {
      dispatch(checkUserEmailRequest(email));
      const result = await RequestAccountApi.checkUserEmail(email);
      if (result) {
        NavigationService.navigate('passwordFill', { email });

      }
      dispatch(checkUserEmailSuccess(result));
    } catch (err) {
      dispatch(checkUserEmailFailure(err));
    }
  };

  const getEmployees = async (params) => await RequestApi.getSimpleEmployees(params);

  const checkBiometricSettings = async (payload) => {
    try {
      const { biometricSetting, isBiometricAuthenticationAdmin } = payload;
      dispatch(checkBiometricSettingsRequest({ biometricSetting, isBiometricAuthenticationAdmin }));
      const isSavillsEmail = checkEmailSavills(user.user?.emailAddress, user?.emailRegex.regexEmails);
      if (!biometricSetting && !isSavillsEmail && isBiometricAuthenticationAdmin) {
        NavigationService.navigate('biometric');
      }
      dispatch(checkBiometricSettingSuccess(biometricSetting));
    } catch (err) {
      dispatch(checkBiometricSettingsFailure(err));
    }
  };

  const validatePassword = async (password) => {
    if (NetWork.isConnected) {
      const response = await RequestAccountApi.checkAuthenticate(password);
      return response;
    }

    const credentials = await Keychain.getGenericPassword();
    if (password === credentials?.password) {
      return true;
    }

    toast.showError(I18n.t('BIOMETRIC_WRONG_PASSWORD'));
    return false;
  };

  const checkAuthenticate = async (payload) => {
    try {
      const { username, password } = payload;
      dispatch(checkAuthenticateRequest({ username, password }));

      const response = await validatePassword(password);
      if (response) {
        await Keychain.setGenericPassword(username, password);
      }
      dispatch(checkAuthenticateSuccess(response));
      return response;
    } catch (err) {
      dispatch(checkAuthenticateFailure(err));
      return null;
    }
  };

  const updateBiometricSettings = async () => {
    const biometricSetting = await DeviceStore.get(keyDeviceStore.BIOMETRIC_SETTING);
    dispatch(setBiometricRequest(biometricSetting));
    return biometricSetting;
  };

  const saveBiometricSetting = (payload) => {
    DeviceStore.save(keyDeviceStore.BIOMETRIC_SETTING, payload);
    dispatch(setBiometricRequest(payload));
  };

  const setupPinCode = async (payload) => {
    try {
      dispatch(setupPinCodeRequest(payload));
      const response = await RequestApi.setupPinCode(payload);
      dispatch(setupPinCodeSuccess(response));
      setVisibleAuthConfirmModal(false);
      setVisibleSetupPinModal(false);
      toast.showSuccess(I18n.t('AUTH_SETUP_PIN_SUCCESS'));
      return true;
    } catch (err) {
      dispatch(setupPinCodeFailure(err));
    }
    return false;
  };

  const changePinCode = async (payload) => {
    try {
      dispatch(changePinCodeRequest(payload));
      const response = await RequestApi.changePinCode(payload);
      dispatch(changePinCodeSuccess(response));
      toast.showSuccess(I18n.t('AUTH_CHANGE_PIN_SUCCESS'));
      return true;
    } catch (err) {
      dispatch(changePinCodeFailure(err));
    }
    return false;
  };

  const validatePin = async (pinCode, username) => {
    if (NetWork.isConnected) {
      const response = await RequestApi.verifyPinCode({ pinCode });
      response.hideAlert = true;
      if (!response.ok && _.get(response, 'data.error.code') === 406) {
        Alert.alert(
          I18n.t('AUTH_PIN_EXCEED_TITLE'),
          I18n.t('AUTH_PIN_EXCEED_MAX_ATTEMPTS'),
          [{ text: 'OK', onPress: () => clearAuth() }],
          { cancelable: false }
        );
        throw new Error(I18n.t('AUTH_PIN_EXCEED_MAX_ATTEMPTS'));
      }

      handleResponse(response);
      await Keychain.setGenericPassword(username, pinCode, { service: keychainServices.pinVerify });
      return true;
    }

    const credentials = await Keychain.getGenericPassword({ service: keychainServices.pinVerify });
    if (pinCode === credentials?.password) {
      return true;
    }
    const message = I18n.t('AUTH_WRONG_PIN');
    throw new Error(message);
  };

  const checkAuthenWithPin = async (payload) => {
    try {
      const { username, pinCode } = payload;
      dispatch(checkAuthenWithPinRequest(payload));
      const response = await validatePin(pinCode, username);
      dispatch(checkAuthenWithPinSuccess(response));
      setVisibleAuthConfirmModal(false);
    } catch (err) {
      dispatch(checkAuthenWithPinFailure(err));
    }
  };

  const setVisibleSetupPinModal = (payload) => {
    dispatch(setVisibleSetupPin(payload));
  };

  const sendPinResetCode = async (params) => {
    try {
      dispatch(sendPinResetCodeRequest(params));
      const result = await RequestAccountApi.sendSessionVerificationCodeByEmail({ ...params, isAccountToken: true });
      dispatch(sendPinResetCodeSuccess(result));
      DeviceEventEmitter.emit('sendPinResetCodeSuccess');
    } catch (err) {
      dispatch(sendPinResetCodeFailure(err));
    }
  };

  const resetPinCode = async (payload) => {
    try {
      dispatch(resetPinCodeRequest(payload));
      const result = await RequestApi.resetPinCode(payload);
      dispatch(resetPinCodeSuccess(result));
      toast.showSuccess(I18n.t('AUTH_RESET_PIN_SUCCESS'));
      NavigationService.goBack();
    } catch (err) {
      dispatch(resetPinCodeFailure(err));
    }
  };

  const setStayedLoggedIn = (isOn) => {
    DeviceStore.save(keyDeviceStore.STAYED_LOGGED_IN, isOn);
    dispatch(setStayedLoggedInRequest(isOn));
  };

  const getStayedLoggedIn = () => {
    const isStay = DeviceStore?.getBoolean(keyDeviceStore.STAYED_LOGGED_IN);
    dispatch(setStayedLoggedInRequest(isStay || false));
  };

  const updateUserBiometric = async (payload, hideToast = false) => {
    try {
      dispatch(updateUserBiometricRequest(payload));

      const isUserEnableBiometric = _.includes([BIOMETRIC_STATUS.ON, BIOMETRIC_STATUS.SESSION], payload);
      const message = isUserEnableBiometric ? 'BIOMETRIC_LOGIN_ENABLED' : 'BIOMETRIC_LOGIN_DISABLED';
      const result = await RequestApi.updateUserBiometric({
        isUserEnableBiometric,
      });
      if (result) {
        if (!hideToast) {
          toast.showSuccess(I18n.t(message));
        }
        saveBiometricSetting(payload);
      }
      dispatch(updateUserBiometricSuccess(payload));
    } catch (err) {
      dispatch(updateUserBiometricFailure(err));
    }
  };

  const getBiometricKeys = async (emailAddress) => {
    const credentials = await Keychain.getGenericPassword();
    const storedPrivateKey = await DeviceStore.get(keyDeviceStore.BIOMETRIC_PRIVATE_KEY);
  
    const isDifferentUser = !storedPrivateKey || (storedPrivateKey && emailAddress !== credentials?.username);
    return { storedPrivateKey, isDifferentUser };
  };
  
  const getOrGenerateDeviceCode = async () => {
    let deviceCode = await DeviceStore.get(keyDeviceStore.BIOMETRIC_DEVICE_CODE);
    if (!deviceCode) {
      deviceCode = generateGUID();
      DeviceStore.save(keyDeviceStore.BIOMETRIC_DEVICE_CODE, deviceCode);
    }
    return deviceCode;
  };

  const generateAndStoreBiometricKey = async (emailAddress, deviceCode) => {
    const biometricGuid = await generateBiometricGuid({ emailAddress, deviceCode });
    DeviceStore.save(keyDeviceStore.BIOMETRIC_PRIVATE_KEY, biometricGuid);
    return biometricGuid;
  };
  
  const checkAuthenticateAnonymous = async (params) => {
    const emailAddress = params.userNameOrEmailAddress;
    const result = await RequestAccountApi.checkAuthenticateAnonymous(params);
    if (result.isFirstLogin) { // force change pass as first login
      const contractorLoginRes = await RequestAccountApi.login(emailAddress, params.password, result.isFirstLogin);
      if (contractorLoginRes.shouldResetPassword) {
        dispatch(sendPasswordResetCodeSuccess(emailAddress));
        NavigationService.navigate('resetPasswordFirstTime', {
          passwordResetCode: contractorLoginRes.passwordResetCode,
        });
        return;
      }
    }

    const { storedPrivateKey, isDifferentUser } = await getBiometricKeys(emailAddress);
    let privateKey = storedPrivateKey;
  
    if (isDifferentUser) {
      const deviceCode = await getOrGenerateDeviceCode();
      privateKey = await generateAndStoreBiometricKey(emailAddress, deviceCode);
    }
  
    return { privateKey, token: result.token };
  };

  const generateBiometricGuid = async (params) => {
    const result = await RequestAccountApi.generateBiometricGuid(params);
    return result;
  };

  const authenticateBiometric = async (params) => {
    const result = await RequestAccountApi.authenticateBiometric({
      token: params.token,
      guid: params.guid
    });
    if (result.shouldResetPassword) {
      dispatch(sendPasswordResetCodeSuccess(params.username));
      NavigationService.navigate('resetPassword', {
        passwordResetCode: result.passwordResetCode,
      });
      return;
    }
    ApiConfig.accessToken = result.accessToken;
    await Keychain.setGenericPassword(params.username, params.password);
    getLinkedAccount({
      userId: result.userId,
    });
    return result;
  };

  return {
    user,
    getProfilePicture,
    getCurrentInformation,
    checkAuthConfirmAuth,
    setVisibleAuthConfirmModal,
    getSecuritySetting,
    clearSecuritySetting,
    login,
    getLinkedAccount,
    switchToUserAccount,
    linkedAccountAuthenticate,
    boostrapUser,
    updateProfile,
    sendPasswordResetCode,
    resetPassword,
    changePassword,
    getEmailRegex,
    getAllHostSetting,
    loginWithMicrosoftAccount,
    authenticateMfa,
    authenticateOTP,
    checkUserEmail,
    getMFAUserSetting,
    getEmployees: withErrorHandling(GET_EMPLOYEES, getEmployees),
    checkBiometricSettings,
    checkAuthenticate,
    updateBiometricSettings,
    saveBiometricSetting,
    setupPinCode,
    changePinCode,
    checkAuthenWithPin,
    setVisibleSetupPinModal,
    sendPinResetCode,
    resetPinCode,
    setStayedLoggedIn,
    getStayedLoggedIn,
    updateUserBiometric,
    checkAuthenticateAnonymous: withLoadingAndErrorHandling(CHECK_AUTHENTICATE_ANONYMOUS, checkAuthenticateAnonymous),
    generateBiometricGuid: withLoadingAndErrorHandling(GENERATE_BIOMETRIC_GUID, generateBiometricGuid),
    authenticateBiometric: withLoadingAndErrorHandling(AUTHENTICATE_BIOMETRIC, authenticateBiometric),
    handleBiometricSettings,
  };
};

export default useUser;
