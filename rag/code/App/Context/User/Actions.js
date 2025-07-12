import { generateAction } from "../../Utils/AppAction";

export const GET_PROFILE_PICTURE_REQUEST = 'user/GET_PROFILE_PICTURE_REQUEST';
export const GET_PROFILE_PICTURE_SUCCESS = 'user/GET_PROFILE_PICTURE_SUCCESS';
export const GET_PROFILE_PICTURE_FAILURE = 'user/GET_PROFILE_PICTURE_FAILURE';

export const GET_CURRENT_INFORMATION_REQUEST = 'user/GET_CURRENT_INFORMATION_REQUEST';
export const GET_CURRENT_INFORMATION_SUCCESS = 'user/GET_CURRENT_INFORMATION_SUCCESS';
export const GET_CURRENT_INFORMATION_FAILURE = 'user/GET_CURRENT_INFORMATION_FAILURE';

export const GET_EMAIL_REGEX_REQUEST = 'user/GET_EMAIL_REGEX_REQUEST';
export const GET_EMAIL_REGEX_SUCCESS = 'user/GET_EMAIL_REGEX_SUCCESS';
export const GET_EMAIL_REGEX_FAILURE = 'user/GET_EMAIL_REGEX_FAILURE';
// Auth Confirm
export const SET_VISIBLE_AUTH_CONFIRM = 'user/SET_VISIBLE_AUTH_CONFIRM';

export const CHECK_AUTH_CONFIRM_REQUEST = 'user/CHECK_AUTH_CONFIRM_REQUEST';
export const CHECK_AUTH_CONFIRM_SUCCESS = 'user/CHECK_AUTH_CONFIRM_SUCCESS';
export const CHECK_AUTH_CONFIRM_FAILURE = 'user/CHECK_AUTH_CONFIRM_FAILURE';

export const GET_SECURITY_SETTING_REQUEST = 'user/GET_SECURITY_SETTING_REQUEST';
export const GET_SECURITY_SETTING_SUCCESS = 'user/GET_SECURITY_SETTING_SUCCESS';
export const GET_SECURITY_SETTING_FAILURE = 'user/GET_SECURITY_SETTING_FAILURE';

export const LOGIN_REQUEST = 'user/LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'user/LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'user/LOGIN_FAILURE';

export const GET_LINKED_ACCOUNT_REQUEST = 'user/GET_LINKED_ACCOUNT_REQUEST';
export const GET_LINKED_ACCOUNT_SUCCESS = 'user/GET_LINKED_ACCOUNT_SUCCESS';
export const GET_LINKED_ACCOUNT_FAILURE = 'user/GET_LINKED_ACCOUNT_FAILURE';

export const SWITCH_TO_USER_ACCOUNT_REQUEST = 'user/SWITCH_TO_USER_ACCOUNT_REQUEST';
export const SWITCH_TO_USER_ACCOUNT_SUCCESS = 'user/SWITCH_TO_USER_ACCOUNT_SUCCESS';
export const SWITCH_TO_USER_ACCOUNT_FAILURE = 'user/SWITCH_TO_USER_ACCOUNT_FAILURE';

export const LINKED_ACCOUNT_AUTHENTICATE_REQUEST = 'user/LINKED_ACCOUNT_AUTHENTICATE_REQUEST';
export const LINKED_ACCOUNT_AUTHENTICATE_SUCCESS = 'user/LINKED_ACCOUNT_AUTHENTICATE_SUCCESS';
export const LINKED_ACCOUNT_AUTHENTICATE_FAILURE = 'user/LINKED_ACCOUNT_AUTHENTICATE_FAILURE';

export const BOOTSTRAP_USER = 'user/BOOTSTRAP_USER';

export const UPDATE_PROFILE_REQUEST = 'user/UPDATE_PROFILE_REQUEST';
export const UPDATE_PROFILE_SUCCESS = 'user/UPDATE_PROFILE_SUCCESS';
export const UPDATE_PROFILE_FAILURE = 'user/UPDATE_PROFILE_FAILURE';

export const SEND_PASSWORD_RESET_CODE_REQUEST = 'user/SEND_PASSWORD_RESET_CODE_REQUEST';
export const SEND_PASSWORD_RESET_CODE_SUCCESS = 'user/SEND_PASSWORD_RESET_CODE_SUCCESS';
export const SEND_PASSWORD_RESET_CODE_FAILURE = 'user/SEND_PASSWORD_RESET_CODE_FAILURE';

export const CHANGE_PASSWORD_REQUEST = 'user/CHANGE_PASSWORD_REQUEST';
export const CHANGE_PASSWORD_SUCCESS = 'user/CHANGE_PASSWORD_SUCCESS';
export const CHANGE_PASSWORD_FAILURE = 'user/CHANGE_PASSWORD_FAILURE';

export const RESET_PASSWORD_REQUEST = 'user/RESET_PASSWORD_REQUEST';
export const RESET_PASSWORD_SUCCESS = 'user/RESET_PASSWORD_SUCCESS';
export const RESET_PASSWORD_FAILURE = 'user/RESET_PASSWORD_FAILURE';

export const GET_ALL_HOST_SETTING = 'user/GET_ALL_HOST_SETTING';
export const GET_ALL_HOST_SETTING_SUCCESS = 'user/GET_ALL_HOST_SETTING_SUCCESS';
export const GET_ALL_HOST_SETTING_FAILURE = 'user/GET_ALL_HOST_SETTING_FAILURE';

export const GET_MFA_USER_SETTING_REQUEST = 'user/GET_ALL_HOST_SETTING';
export const GET_MFA_USER_SETTING_SUCCESS = 'user/GET_MFA_USER_SETTING_SUCCESS';
export const GET_MFA_USER_SETTING_FAILURE = 'user/GET_MFA_USER_SETTING_FAILURE';

export const EXTERNAL_MICROSOFT_AUTHENTICATE_REQUEST = 'user/EXTERNAL_MICROSOFT_AUTHENTICATE_REQUEST';
export const EXTERNAL_MICROSOFT_AUTHENTICATE_SUCCESS = 'user/EXTERNAL_MICROSOFT_AUTHENTICATE_SUCCESS';
export const EXTERNAL_MICROSOFT_AUTHENTICATE_FAILURE = 'user/EXTERNAL_MICROSOFT_AUTHENTICATE_FAILURE';

export const AUTHENTICATE_MFA_REQUEST = 'user/AUTHENTICATE_MFA_REQUEST';
export const AUTHENTICATE_MFA_SUCCESS = 'user/AUTHENTICATE_MFA_SUCCESS';
export const AUTHENTICATE_MFA_FAILURE = 'user/AUTHENTICATE_MFA_FAILURE';

export const AUTHENTICATE_ADMIN_REQUEST = 'user/AUTHENTICATE_ADMIN_REQUEST';
export const AUTHENTICATE_ADMIN_SUCCESS = 'user/AUTHENTICATE_ADMIN_SUCCESS';
export const AUTHENTICATE_ADMIN_FAILURE = 'user/AUTHENTICATE_ADMIN_FAILURE';

export const CHECK_USER_EMAIL_REQUEST = 'user/CHECK_USER_EMAIL_REQUEST';
export const CHECK_USER_EMAIL_SUCCESS = 'user/CHECK_USER_EMAIL_SUCCESS';
export const CHECK_USER_EMAIL_FAILURE = 'user/CHECK_USER_EMAIL_FAILURE';

export const GET_EMPLOYEES = generateAction('user/GET_EMPLOYEES');

export const CHECK_BIOMETRIC_SETTINGS_REQUEST = 'user/CHECK_BIOMETRIC_SETTINGS_REQUEST';
export const CHECK_BIOMETRIC_SETTINGS_SUCCESS = 'user/CHECK_BIOMETRIC_SETTINGS_SUCCESS';
export const CHECK_BIOMETRIC_SETTINGS_FAILURE = 'user/CHECK_BIOMETRIC_SETTINGS_FAILURE';

export const CHECK_AUTHENTICATE_REQUEST = 'user/CHECK_AUTHENTICATE_REQUEST';
export const CHECK_AUTHENTICATE_SUCCESS = 'user/CHECK_AUTHENTICATE_SUCCESS';
export const CHECK_AUTHENTICATE_FAILURE = 'user/CHECK_AUTHENTICATE_FAILURE';

export const SAVE_BIOMETRIC_SETTINGS_REQUEST = 'user/SAVE_BIOMETRIC_SETTINGS_REQUEST';

export const SET_BIOMETRICS_REQUEST = 'user/SET_BIOMETRICS_REQUEST';

// pin code
export const SETUP_PIN_CODE_REQUEST = 'user/SETUP_PIN_CODE_REQUEST';
export const SETUP_PIN_CODE_SUCCESS = 'user/SETUP_PIN_CODE_SUCCESS';
export const SETUP_PIN_CODE_FAILURE = 'user/SETUP_PIN_CODE_FAILURE';

export const CHANGE_PIN_CODE_REQUEST = 'user/CHANGE_PIN_CODE_REQUEST';
export const CHANGE_PIN_CODE_SUCCESS = 'user/CHANGE_PIN_CODE_SUCCESS';
export const CHANGE_PIN_CODE_FAILURE = 'user/CHANGE_PIN_CODE_FAILURE';

export const CHECK_AUTHEN_WITH_PIN_REQUEST = 'user/CHECK_AUTHEN_WITH_PIN_REQUEST';
export const CHECK_AUTHEN_WITH_PIN_SUCCESS = 'user/CHECK_AUTHEN_WITH_PIN_SUCCESS';
export const CHECK_AUTHEN_WITH_PIN_FAILURE = 'user/CHECK_AUTHEN_WITH_PIN_FAILURE';

export const SET_VISIBLE_SETUP_PIN = 'user/SET_VISIBLE_SETUP_PIN';
export const SET_STAYED_LOGGED_IN = 'user/SET_STAYED_LOGGED_IN';

export const SEND_PIN_RESET_CODE_REQUEST = 'user/SEND_PIN_RESET_CODE_REQUEST';
export const SEND_PIN_RESET_CODE_SUCCESS = 'user/SEND_PIN_RESET_CODE_SUCCESS';
export const SEND_PIN_RESET_CODE_FAILURE = 'user/SEND_PIN_RESET_CODE_FAILURE';

export const RESET_PIN_CODE_REQUEST = 'user/RESET_PIN_CODE_REQUEST';
export const RESET_PIN_CODE_SUCCESS = 'user/RESET_PIN_CODE_SUCCESS';
export const RESET_PIN_CODE_FAILURE = 'user/RESET_PIN_CODE_FAILURE';

export const UPDATE_USER_BIOMETRIC_REQUEST = 'user/UPDATE_USER_BIOMETRIC_REQUEST';
export const UPDATE_USER_BIOMETRIC_SUCCESS = 'user/UPDATE_USER_BIOMETRIC_SUCCESS';
export const UPDATE_USER_BIOMETRIC_FAILURE = 'user/UPDATE_USER_BIOMETRIC_FAILURE';

export const CHECK_AUTHENTICATE_ANONYMOUS = generateAction('user/CHECK_AUTHENTICATE_ANONYMOUS');
export const GENERATE_BIOMETRIC_GUID = generateAction('user/GENERATE_BIOMETRIC_GUID');
export const AUTHENTICATE_BIOMETRIC = generateAction('user/AUTHENTICATE_BIOMETRIC');

export const getProfilePictureRequest = (payload) => ({
  type: GET_PROFILE_PICTURE_REQUEST,
  payload,
});

export const getProfilePictureSuccess = (payload) => ({
  type: GET_PROFILE_PICTURE_SUCCESS,
  payload,
});

export const getProfilePictureFailure = (payload) => ({
  type: GET_PROFILE_PICTURE_FAILURE,
  payload,
});

export const getCurrentInformationRequest = (payload) => ({
  type: GET_CURRENT_INFORMATION_REQUEST,
  payload,
});

export const getCurrentInformationSuccess = (payload) => ({
  type: GET_CURRENT_INFORMATION_SUCCESS,
  payload,
});

export const getCurrentInformationFailure = (payload) => ({
  type: GET_CURRENT_INFORMATION_FAILURE,
  payload,
});

export const getEmailRegexRequest = (payload) => ({
  type: GET_EMAIL_REGEX_REQUEST,
  payload,
});

export const getEmailRegexSuccess = (payload) => ({
  type: GET_EMAIL_REGEX_SUCCESS,
  payload,
});

export const getEmailRegexFailure = (payload) => ({
  type: GET_EMAIL_REGEX_FAILURE,
  payload,
});

export const setVisibleAuthConfirm = (payload) => ({
  type: SET_VISIBLE_AUTH_CONFIRM,
  payload,
});

export const checkAuthConfirmAuthRequest = (payload) => ({
  type: CHECK_AUTH_CONFIRM_REQUEST,
  payload,
});

export const checkAuthConfirmAuthSuccess = (payload) => ({
  type: CHECK_AUTH_CONFIRM_SUCCESS,
  payload,
});

export const checkAuthConfirmAuthFailure = (payload) => ({
  type: CHECK_AUTH_CONFIRM_FAILURE,
  payload,
});

export const getSecuritySettingRequest = (payload) => ({
  type: GET_SECURITY_SETTING_REQUEST,
  payload,
});

export const getSecuritySettingSuccess = (payload) => ({
  type: GET_SECURITY_SETTING_SUCCESS,
  payload,
});

export const getSecuritySettingFailure = (payload) => ({
  type: GET_SECURITY_SETTING_FAILURE,
  payload,
});

export const getLinkedAccountRequest = (payload) => ({
  type: GET_LINKED_ACCOUNT_REQUEST,
  payload,
});

export const getLinkedAccountSuccess = (payload) => ({
  type: GET_LINKED_ACCOUNT_SUCCESS,
  payload,
});

export const getLinkedAccountFailure = (payload) => ({
  type: GET_LINKED_ACCOUNT_FAILURE,
  payload,
});

export const switchToUserAccountRequest = (payload) => ({
  type: SWITCH_TO_USER_ACCOUNT_REQUEST,
  payload,
});

export const switchToUserAccountSuccess = (payload) => ({
  type: SWITCH_TO_USER_ACCOUNT_SUCCESS,
  payload,
});

export const switchToUserAccountFailure = (payload) => ({
  type: SWITCH_TO_USER_ACCOUNT_FAILURE,
  payload,
});

export const linkedAccountAuthenticateRequest = (payload) => ({
  type: LINKED_ACCOUNT_AUTHENTICATE_REQUEST,
  payload,
});

export const linkedAccountAuthenticateSuccess = (payload) => ({
  type: LINKED_ACCOUNT_AUTHENTICATE_SUCCESS,
  payload,
});

export const linkedAccountAuthenticateFailure = (payload) => ({
  type: LINKED_ACCOUNT_AUTHENTICATE_FAILURE,
  payload,
});

export const loginRequest = (payload) => ({
  type: LOGIN_REQUEST,
  payload,
});

export const loginSuccess = (payload) => ({
  type: LOGIN_SUCCESS,
  payload,
});

export const loginFailure = (payload) => ({
  type: LOGIN_FAILURE,
  payload,
});

export const updateProfileRequest = (payload) => ({
  type: UPDATE_PROFILE_REQUEST,
  payload,
});

export const updateProfileSuccess = (payload) => ({
  type: UPDATE_PROFILE_SUCCESS,
  payload,
});

export const updateProfileFailure = (payload) => ({
  type: UPDATE_PROFILE_FAILURE,
  payload,
});

export const bootstrapUserRequest = (payload) => ({
  type: BOOTSTRAP_USER,
  payload,
});

export const sendPasswordResetCodeRequest = (payload) => ({
  type: SEND_PASSWORD_RESET_CODE_REQUEST,
  payload,
});

export const sendPasswordResetCodeSuccess = (payload) => ({
  type: SEND_PASSWORD_RESET_CODE_SUCCESS,
  payload,
});

export const sendPasswordResetCodeFailure = (payload) => ({
  type: SEND_PASSWORD_RESET_CODE_FAILURE,
  payload,
});

export const changePasswordRequest = (payload) => ({
  type: CHANGE_PASSWORD_REQUEST,
  payload,
});

export const changePasswordSuccess = (payload) => ({
  type: CHANGE_PASSWORD_SUCCESS,
  payload,
});

export const changePasswordFailure = (payload) => ({
  type: CHANGE_PASSWORD_FAILURE,
  payload,
});

export const resetPasswordRequest = (payload) => ({
  type: RESET_PASSWORD_REQUEST,
  payload,
});

export const resetPasswordSuccess = (payload) => ({
  type: RESET_PASSWORD_SUCCESS,
  payload,
});

export const resetPasswordFailure = (payload) => ({
  type: RESET_PASSWORD_FAILURE,
  payload,
});

export const externalMicrosoftRequest = (payload) => ({
  type: EXTERNAL_MICROSOFT_AUTHENTICATE_REQUEST,
  payload,
});

export const externalMicrosoftSuccess = (payload) => ({
  type: EXTERNAL_MICROSOFT_AUTHENTICATE_SUCCESS,
  payload,
});

export const externalMicrosoftFailure = (payload) => ({
  type: EXTERNAL_MICROSOFT_AUTHENTICATE_FAILURE,
  payload,
});

export const getAllHostSettingRequest = (payload) => ({
  type: GET_ALL_HOST_SETTING,
  payload,
});

export const getAllHostSettingSuccess = (payload) => ({
  type: GET_ALL_HOST_SETTING_SUCCESS,
  payload,
});

export const getAllHostSettingFailure = (payload) => ({
  type: GET_ALL_HOST_SETTING_FAILURE,
  payload,
});

export const authenticateMFARequest = (payload) => ({
  type: AUTHENTICATE_MFA_REQUEST,
  payload,
});

export const authenticateMFASuccess = (payload) => ({
  type: AUTHENTICATE_MFA_SUCCESS,
  payload,
});

export const authenticateMFAFailure = (payload) => ({
  type: AUTHENTICATE_MFA_FAILURE,
  payload,
});

export const authenticateAdminRequest = (payload) => ({
  type: AUTHENTICATE_ADMIN_REQUEST,
  payload,
});

export const authenticateAdminSuccess = (payload) => ({
  type: AUTHENTICATE_ADMIN_SUCCESS,
  payload,
});

export const authenticateAdminFailure = (payload) => ({
  type: AUTHENTICATE_ADMIN_FAILURE,
  payload,
});

export const checkUserEmailRequest = (payload) => ({
  type: CHECK_USER_EMAIL_REQUEST,
  payload,
});

export const checkUserEmailSuccess = (payload) => ({
  type: CHECK_USER_EMAIL_SUCCESS,
  payload,
});

export const checkUserEmailFailure = (payload) => ({
  type: CHECK_USER_EMAIL_FAILURE,
  payload,
});

export const getMFAUserSettingRequest = (payload) => ({
  type: GET_MFA_USER_SETTING_REQUEST,
  payload,
});

export const getMFAUserSettingSuccess = (payload) => ({
  type: GET_MFA_USER_SETTING_SUCCESS,
  payload,
});

export const getMFAUserSettingFailure = (payload) => ({
  type: GET_MFA_USER_SETTING_FAILURE,
  payload,
});

export const checkBiometricSettingsRequest = (payload) => ({
  type: CHECK_BIOMETRIC_SETTINGS_REQUEST,
  payload,
});

export const checkBiometricSettingSuccess = (payload) => ({
  type: CHECK_BIOMETRIC_SETTINGS_SUCCESS,
  payload,
});

export const checkBiometricSettingsFailure = (payload) => ({
  type: CHECK_BIOMETRIC_SETTINGS_FAILURE,
  payload,
});

export const checkAuthenticateRequest = (payload) => ({
  type: CHECK_AUTHENTICATE_REQUEST,
  payload,
});

export const checkAuthenticateSuccess = (payload) => ({
  type: CHECK_AUTHENTICATE_SUCCESS,
  payload,
});

export const checkAuthenticateFailure = (payload) => ({
  type: CHECK_AUTHENTICATE_FAILURE,
  payload,
});

export const setBiometricRequest = (payload) => ({
  type: SET_BIOMETRICS_REQUEST,
  payload,
});

export const saveBiometricSettingsRequest = (payload) => ({
  type: SAVE_BIOMETRIC_SETTINGS_REQUEST,
  payload,
});

export const setupPinCodeRequest = (payload) => ({
  type: SETUP_PIN_CODE_REQUEST,
  payload,
});

export const setupPinCodeSuccess = (payload) => ({
  type: SETUP_PIN_CODE_SUCCESS,
  payload,
});

export const setupPinCodeFailure = (payload) => ({
  type: SETUP_PIN_CODE_FAILURE,
  payload,
});

export const changePinCodeRequest = (payload) => ({
  type: CHANGE_PIN_CODE_REQUEST,
  payload,
});

export const changePinCodeSuccess = (payload) => ({
  type: CHANGE_PIN_CODE_SUCCESS,
  payload,
});

export const changePinCodeFailure = (payload) => ({
  type: CHANGE_PIN_CODE_FAILURE,
  payload,
});

export const checkAuthenWithPinRequest = (payload) => ({
  type: CHECK_AUTHEN_WITH_PIN_REQUEST,
  payload,
});

export const checkAuthenWithPinSuccess = (payload) => ({
  type: CHECK_AUTHEN_WITH_PIN_SUCCESS,
  payload,
});

export const checkAuthenWithPinFailure = (payload) => ({
  type: CHECK_AUTHEN_WITH_PIN_FAILURE,
  payload,
});

export const setVisibleSetupPin = (payload) => ({
  type: SET_VISIBLE_SETUP_PIN,
  payload,
});

export const setStayedLoggedInRequest = (payload) => ({
  type: SET_STAYED_LOGGED_IN,
  payload,
});

export const sendPinResetCodeRequest = (payload) => ({
  type: SEND_PIN_RESET_CODE_REQUEST,
  payload,
});

export const sendPinResetCodeSuccess = (payload) => ({
  type: SEND_PIN_RESET_CODE_SUCCESS,
  payload,
});

export const sendPinResetCodeFailure = (payload) => ({
  type: SEND_PIN_RESET_CODE_FAILURE,
  payload,
});

export const resetPinCodeRequest = (payload) => ({
  type: RESET_PIN_CODE_REQUEST,
  payload,
});

export const resetPinCodeSuccess = (payload) => ({
  type: RESET_PIN_CODE_SUCCESS,
  payload,
});

export const resetPinCodeFailure = (payload) => ({
  type: RESET_PIN_CODE_FAILURE,
  payload,
});

export const updateUserBiometricRequest = (payload) => ({
  type: UPDATE_USER_BIOMETRIC_REQUEST,
  payload,
});

export const updateUserBiometricSuccess = (payload) => ({
  type: UPDATE_USER_BIOMETRIC_SUCCESS,
  payload,
});

export const updateUserBiometricFailure = (payload) => ({
  type: UPDATE_USER_BIOMETRIC_FAILURE,
  payload,
});
