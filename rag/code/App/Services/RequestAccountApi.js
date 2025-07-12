/* @flow */
import CreateApi from './CreateApi';
import APIConfig from '../Config/apiConfig';
import { BUNDLE_ID } from '../Config';
import ConvertObjectToQueryString from '../Transforms/ConvertObjectToQueryString';

const api = CreateApi(APIConfig.apiAccount, false, true);
const apiV1 = CreateApi(APIConfig.apiAccount);
const apiWithToast = CreateApi(APIConfig.apiAccount, false, true, true);

export default {
  getHeader: (key: string) => api.getHeader(key),
  setHeader: (key: string, value: string) => {
    api.setHeader(key, value);
  },
  setBaseURL: (uri: string) => {
    api.setBaseURL(uri);
  },
  getAllHostSetting: () => apiV1.getWithOutToken('/services/app/HostSettings/GetAllSettings'),

  externalAuthenticateMicrosoft: (params) => apiV1.post('/TokenAuth/ExternalAuthenticateMicrosoft', params),

  checkUserEmail: (email) => api.post(`/services/app/Account/UserCheckingByEmail?email=${email}`),

  authenticateMFA: (userNameOrEmailAddress, password, sentMethod) =>
    api.post('/TokenAuth/AuthenticateMfa', {
      userNameOrEmailAddress,
      password,
      sentMethod,
    }),

  checkAuthenticate: (password) =>
    apiWithToast.post('/TokenAuth/CheckAuthenticate', {
      password,
      isAccountToken: true,
    }),

  loginByOTP: (userNameOrEmailAddress, guid, otp) =>
    api.post('/TokenAuth/AuthenticateOtp', {
      userNameOrEmailAddress,
      guid,
      otp,
    }),

  login: (userNameOrEmailAddress, password, shouldChangePassword) =>
    api.post('/TokenAuth/AuthenticateAdmin', {
      userNameOrEmailAddress,
      password,
      shouldChangePassword
    }),
  oldLogin: (userNameOrEmailAddress, password) =>
    api.post('/TokenAuth/Authenticate', {
      userNameOrEmailAddress,
      password,
    }),
  sendCodeReset: (emailAddress) =>
    api.post('/services/app/Account/SendPasswordResetCode', {
      emailAddress,
    }),
  resetPassword: (params) => api.post('/services/app/Account/AppResetPasswordAdmin', params),
  changePassword: (currentPassword, newPassword) =>
    // api.setHeader('Authorization', `Bearer ${token}`);
    api.post('/services/app/Account/ChangePasswordAdmin', {
      isAccountToken: true,
      currentPassword,
      newPassword,
    }),
  sendSessionVerificationCodeByEmail: (params) =>
    api.post('/services/app/Account/SendSessionVerificationCodeByEmail', params),

  checkAuthenticateAnonymous: (params) => api.post('/TokenAuth/CheckAuthenticateAnonymous', params),
  generateBiometricGuid: (params) => api.get(`/TokenAuth/GenerateBiometricGuid?${ConvertObjectToQueryString(params)}`),
  authenticateBiometric: (params) => api.post('/TokenAuth/AuthenticateBiometric', params),

};
