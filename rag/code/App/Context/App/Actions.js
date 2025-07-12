import { generateAction } from "../../Utils/AppAction";

export const BOOTSTRAP_APP_REQUEST = 'app/BOOTSTRAP_APP_REQUEST';
export const BOOTSTRAP_APP_SUCCESS = 'app/BOOTSTRAP_APP_SUCCESS';
export const BOOTSTRAP_APP_FAILURE = 'app/BOOTSTRAP_APP_FAILURE';

export const SET_VISIBLE_NOTICE_REQUEST = 'app/SET_VISIBLE_NOTICE_REQUEST';

export const SET_LANG_ID = 'app/SET_LANG_ID';

export const CHECK_FORCE_UPDATE_REQUEST = 'app/CHECK_FORCE_UPDATE_REQUEST';
export const CHECK_FORCE_UPDATE_SUCCESS = 'app/CHECK_FORCE_UPDATE_SUCCESS';
export const CHECK_FORCE_UPDATE_FAILURE = 'app/CHECK_FORCE_UPDATE_FAILURE';

export const GET_PASSWORD_COMPLEXITY_SETTING_REQUEST = 'app/GET_PASSWORD_COMPLEXITY_SETTING_REQUEST';
export const GET_PASSWORD_COMPLEXITY_SETTING_SUCCESS = 'app/GET_PASSWORD_COMPLEXITY_SETTING_SUCCESS';
export const GET_PASSWORD_COMPLEXITY_SETTING_FAILURE = 'app/GET_PASSWORD_COMPLEXITY_SETTING_FAILURE';

export const SET_ALLOW_SCAN_QR_CODE = 'app/SET_ALLOW_SCAN_QR_CODE';

export const GET_ALL_SETTINGS_REQUEST = 'app/GET_ALL_SETTINGS_REQUEST';
export const GET_ALL_SETTINGS_SUCCESS = 'app/GET_ALL_SETTINGS_SUCCESS';
export const GET_ALL_SETTINGS_FAILURE = 'app/GET_ALL_SETTINGS_FAILURE';

export const SET_DEVELOPER_MODE = 'app/SET_DEVELOPER_MODE';

export const GET_BIOMETRIC_TERM_CONDITIONS_REQUEST = 'app/GET_BIOMETRIC_TERM_CONDITIONS_REQUEST';
export const GET_BIOMETRIC_TERM_CONDITIONS_SUCCESS = 'app/GET_BIOMETRIC_TERM_CONDITIONS_SUCCESS';
export const GET_BIOMETRIC_TERM_CONDITIONS_FAILURE = 'app/GET_BIOMETRIC_TERM_CONDITIONS_FAILURE';

export const SHOW_LOADING = 'app/SHOW_LOADING';

export const GET_EMPLOYEES_BY_TENANT = generateAction('app/GET_EMPLOYEES_BY_TENANT');
export const GET_EMPLOYEES = generateAction('app/GET_EMPLOYEES');
export const GET_SIMPLE_COMPANIES = generateAction('app/GET_SIMPLE_COMPANIES');

export const bootstrapAppRequest = (payload) => ({
  type: BOOTSTRAP_APP_REQUEST,
  payload,
});

export const bootstrapAppSuccess = (payload) => ({
  type: BOOTSTRAP_APP_SUCCESS,
  payload,
});

export const bootstrapAppFailure = (payload) => ({
  type: BOOTSTRAP_APP_FAILURE,
  payload,
});
//

export const setVisibleNoticeRequest = (payload) => ({
  type: SET_VISIBLE_NOTICE_REQUEST,
  payload,
});

export const checkForceUpdateRequest = (payload) => ({
  type: CHECK_FORCE_UPDATE_REQUEST,
  payload,
});

export const checkForceUpdateSuccess = (payload) => ({
  type: CHECK_FORCE_UPDATE_SUCCESS,
  payload,
});

export const checkForceUpdateFailure = (payload) => ({
  type: CHECK_FORCE_UPDATE_FAILURE,
  payload,
});

export const setLangIdRequest = (payload, skipStoreStorage) => ({
  type: SET_LANG_ID,
  payload,
  skipStoreStorage,
});

export const getPasswordComplexitySettingRequest = (payload) => ({
  type: GET_PASSWORD_COMPLEXITY_SETTING_REQUEST,
  payload,
});

export const getPasswordComplexitySettingSuccess = (payload) => ({
  type: GET_PASSWORD_COMPLEXITY_SETTING_SUCCESS,
  payload,
});

export const getPasswordComplexitySettingFailure = (payload) => ({
  type: GET_PASSWORD_COMPLEXITY_SETTING_FAILURE,
  payload,
});

export const setAllowScanQRCodeRequest = (payload) => ({
  type: SET_ALLOW_SCAN_QR_CODE,
  payload,
});

export const getAllSettingsRequest = (payload) => ({
  type: GET_ALL_SETTINGS_REQUEST,
  payload,
});

export const getAllSettingsSuccess = (payload) => ({
  type: GET_ALL_SETTINGS_SUCCESS,
  payload,
});

export const getAllSettingsFailure = (payload) => ({
  type: GET_ALL_SETTINGS_FAILURE,
  payload,
});

export const setDeveloperModeRequest = (payload) => ({
  type: SET_DEVELOPER_MODE,
  payload,
});

export const getBiometricTermConditionsRequest = (payload) => ({
  type: GET_BIOMETRIC_TERM_CONDITIONS_REQUEST,
  payload,
});

export const getBiometricTermConditionsSuccess = (payload) => ({
  type: GET_BIOMETRIC_TERM_CONDITIONS_SUCCESS,
  payload,
});

export const getBiometricTermConditionsFailure = (payload) => ({
  type: GET_BIOMETRIC_TERM_CONDITIONS_FAILURE,
  payload,
});
