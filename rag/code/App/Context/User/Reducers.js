import {
  GET_PROFILE_PICTURE_FAILURE,
  GET_PROFILE_PICTURE_REQUEST,
  GET_PROFILE_PICTURE_SUCCESS,
  GET_CURRENT_INFORMATION_FAILURE,
  GET_CURRENT_INFORMATION_REQUEST,
  GET_CURRENT_INFORMATION_SUCCESS,
  GET_EMAIL_REGEX_SUCCESS,
  GET_EMAIL_REGEX_REQUEST,
  CHECK_AUTH_CONFIRM_REQUEST,
  CHECK_AUTH_CONFIRM_SUCCESS,
  CHECK_AUTH_CONFIRM_FAILURE,
  SET_VISIBLE_AUTH_CONFIRM,
  GET_SECURITY_SETTING_REQUEST,
  GET_SECURITY_SETTING_SUCCESS,
  GET_SECURITY_SETTING_FAILURE,
  GET_LINKED_ACCOUNT_REQUEST,
  GET_LINKED_ACCOUNT_SUCCESS,
  GET_LINKED_ACCOUNT_FAILURE,
  LINKED_ACCOUNT_AUTHENTICATE_REQUEST,
  LINKED_ACCOUNT_AUTHENTICATE_FAILURE,
  LINKED_ACCOUNT_AUTHENTICATE_SUCCESS,
  LOGIN_FAILURE,
  LOGIN_SUCCESS,
  LOGIN_REQUEST,
  BOOTSTRAP_USER,
  UPDATE_PROFILE_FAILURE,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_REQUEST,
  CHANGE_PASSWORD_FAILURE,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_REQUEST,
  SEND_PASSWORD_RESET_CODE_FAILURE,
  SEND_PASSWORD_RESET_CODE_SUCCESS,
  SEND_PASSWORD_RESET_CODE_REQUEST,
  RESET_PASSWORD_FAILURE,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_REQUEST,
  GET_ALL_HOST_SETTING,
  GET_ALL_HOST_SETTING_FAILURE,
  GET_ALL_HOST_SETTING_SUCCESS,
  AUTHENTICATE_ADMIN_FAILURE,
  AUTHENTICATE_ADMIN_REQUEST,
  AUTHENTICATE_ADMIN_SUCCESS,
  AUTHENTICATE_MFA_REQUEST,
  AUTHENTICATE_MFA_SUCCESS,
  GET_MFA_USER_SETTING_SUCCESS,
  AUTHENTICATE_MFA_FAILURE,
  EXTERNAL_MICROSOFT_AUTHENTICATE_FAILURE,
  EXTERNAL_MICROSOFT_AUTHENTICATE_REQUEST,
  EXTERNAL_MICROSOFT_AUTHENTICATE_SUCCESS,
  CHECK_USER_EMAIL_FAILURE,
  CHECK_USER_EMAIL_REQUEST,
  CHECK_USER_EMAIL_SUCCESS,
  SWITCH_TO_USER_ACCOUNT_REQUEST,
  SWITCH_TO_USER_ACCOUNT_FAILURE,
  SWITCH_TO_USER_ACCOUNT_SUCCESS,
  CHECK_AUTHENTICATE_REQUEST,
  CHECK_AUTHENTICATE_SUCCESS,
  CHECK_AUTHENTICATE_FAILURE,
  SET_BIOMETRICS_REQUEST,
  SET_VISIBLE_SETUP_PIN,
  CHECK_AUTHEN_WITH_PIN_REQUEST,
  CHECK_AUTHEN_WITH_PIN_SUCCESS,
  CHECK_AUTHEN_WITH_PIN_FAILURE,
  SETUP_PIN_CODE_REQUEST,
  SETUP_PIN_CODE_SUCCESS,
  SETUP_PIN_CODE_FAILURE,
  CHANGE_PIN_CODE_REQUEST,
  CHANGE_PIN_CODE_SUCCESS,
  CHANGE_PIN_CODE_FAILURE,
  SET_STAYED_LOGGED_IN,
  GET_EMPLOYEES,
} from './Actions';
import ListModel from '../Model/ListModel';
import { BIOMETRIC_STATUS, projectType, ControlOfficePrjId } from '../../Config/Constants';
import _ from 'lodash';
import { transformWithRoleTags } from '../../Utils/func';

export const INITIAL_STATE = {
  tenantList: [],
  user: null,
  tenant: null,
  profilePicture: null,
  emailRegex: [],
  error: undefined,
  securitySetting: undefined,
  visibleAuthConfirm: false,
  tenants: [],
  tenantAccount: undefined,
  account: undefined,
  accountUserId: undefined,
  requestEmail: undefined,
  isLoading: false,
  isLoggedIn: false,
  hostSetting: null,
  authInfo: null,
  mfaAuthentication: null,
  mfaUserSetting: null,
  employees: new ListModel(),
  biometricSetting: false,
  failedPinAttempts: 0,
  visibleSetupPin: false,
  stayedLoggedIn: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_EMAIL_REGEX_REQUEST: {
      return {
        ...state,
      };
    }

    case GET_EMAIL_REGEX_SUCCESS: {
      return {
        ...state,
        emailRegex: action.payload,
      };
    }

    case GET_PROFILE_PICTURE_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case GET_PROFILE_PICTURE_SUCCESS: {
      return {
        ...state,
        profilePicture: action.payload,
        isLoading: false,
      };
    }

    case GET_PROFILE_PICTURE_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case GET_CURRENT_INFORMATION_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case GET_CURRENT_INFORMATION_SUCCESS: {
      const { user, tenant } = action.payload;
      return {
        ...state,
        user,
        tenant,
        isLoading: false,
        biometricSetting: user.isUserEnableBiometric ? BIOMETRIC_STATUS.ON : BIOMETRIC_STATUS.OFF,
        isOfficeSite: _.get(tenant, 'tenantAddress.propertyType.code') === projectType.office,
        isControlOffice: tenant?.id === ControlOfficePrjId,
      };
    }

    case GET_CURRENT_INFORMATION_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case CHECK_AUTH_CONFIRM_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case CHECK_AUTH_CONFIRM_SUCCESS: {
      return {
        ...state,
        visibleAuthConfirm: false,
        isLoading: false,
      };
    }

    case CHECK_AUTH_CONFIRM_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case SET_VISIBLE_AUTH_CONFIRM:
      return {
        ...state,
        visibleAuthConfirm: action.payload,
      };

    case GET_SECURITY_SETTING_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case GET_SECURITY_SETTING_SUCCESS: {
      return {
        ...state,
        securitySetting: action.payload,
        isLoading: false,
      };
    }

    case GET_SECURITY_SETTING_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case GET_LINKED_ACCOUNT_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case GET_LINKED_ACCOUNT_SUCCESS: {
      return {
        ...state,
        tenants: action.payload,
        isLoading: false,
      };
    }

    case GET_LINKED_ACCOUNT_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case LINKED_ACCOUNT_AUTHENTICATE_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case LINKED_ACCOUNT_AUTHENTICATE_SUCCESS: {
      return {
        ...state,
        tenantAccount: action.payload,
        isLoading: false,
        isLoggedIn: true,
      };
    }

    case LINKED_ACCOUNT_AUTHENTICATE_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case LOGIN_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case LOGIN_SUCCESS: {
      return {
        ...state,
        account: action.payload,
        accountUserId: action.payload.id,
        isLoading: false,
      };
    }

    case LOGIN_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case BOOTSTRAP_USER:
      return {
        ...state,
        ...action.payload,
      };

    case UPDATE_PROFILE_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case UPDATE_PROFILE_SUCCESS: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case UPDATE_PROFILE_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case RESET_PASSWORD_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case RESET_PASSWORD_SUCCESS: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case RESET_PASSWORD_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case SEND_PASSWORD_RESET_CODE_REQUEST: {
      return {
        ...state,
        isLoading: true,
        requestEmail: undefined,
      };
    }

    case SEND_PASSWORD_RESET_CODE_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        requestEmail: action.payload,
      };
    }

    case SEND_PASSWORD_RESET_CODE_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case CHANGE_PASSWORD_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case CHANGE_PASSWORD_SUCCESS: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case CHANGE_PASSWORD_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case EXTERNAL_MICROSOFT_AUTHENTICATE_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case EXTERNAL_MICROSOFT_AUTHENTICATE_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        account: action.payload,
        accountUserId: action.payload.userId,
      };
    }

    case EXTERNAL_MICROSOFT_AUTHENTICATE_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case CHECK_USER_EMAIL_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case CHECK_USER_EMAIL_SUCCESS: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case CHECK_USER_EMAIL_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case AUTHENTICATE_MFA_REQUEST: {
      return {
        ...state,
        isLoading: true,
        visibleAuthConfirm: false,
      };
    }

    case AUTHENTICATE_MFA_SUCCESS: {
      return {
        ...state,
        mfaAuthentication: action.payload,
        isLoading: false,
      };
    }

    case AUTHENTICATE_MFA_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case GET_MFA_USER_SETTING_SUCCESS: {
      return {
        ...state,
        mfaUserSetting: action.payload,
      };
    }

    case GET_ALL_HOST_SETTING: {
      return {
        ...state,
      };
    }

    case GET_ALL_HOST_SETTING_SUCCESS: {
      return {
        ...state,
        hostSetting: action.payload,
      };
    }

    case GET_ALL_HOST_SETTING_FAILURE:
      return {
        ...state,
        error: action.payload,
      };

    case AUTHENTICATE_ADMIN_REQUEST: {
      return {
        ...state,
        isLoading: true,
        requestEmail: action.payload.email,
      };
    }

    case AUTHENTICATE_ADMIN_SUCCESS: {
      return {
        ...state,
        account: action.payload,
        accountUserId: action.payload.userId,
        isLoading: false,
      };
    }

    case AUTHENTICATE_ADMIN_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case SWITCH_TO_USER_ACCOUNT_REQUEST: {
      return {
        ...state,
        isLoading: true,
        tenant: null,
      };
    }

    case SWITCH_TO_USER_ACCOUNT_SUCCESS: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case SWITCH_TO_USER_ACCOUNT_FAILURE:
      return {
        ...state,
        isLoading: false,
      };

    case GET_EMPLOYEES.REQUEST: {
      const { employees } = state;
      employees.setPage(action.payload?.page);
      return {
        ...state,
        employees,
      };
    }

    case GET_EMPLOYEES.SUCCESS: {
      const { employees } = state;
      const data = transformWithRoleTags(action.payload.items)
      employees.setData({
        ...action.payload,
        items: data, 
      });
      return {
        ...state,
        employees,
      };
    }

    case CHECK_AUTHENTICATE_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case CHECK_AUTHENTICATE_SUCCESS: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case CHECK_AUTHENTICATE_FAILURE:
      return {
        ...state,
        isLoading: false,
      };

    case SET_BIOMETRICS_REQUEST:
      return {
        ...state,
        biometricSetting: action.payload,
      };

    // authen with pin
    case CHECK_AUTHEN_WITH_PIN_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case CHECK_AUTHEN_WITH_PIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        failedPinAttempts: 0,
      };
    case CHECK_AUTHEN_WITH_PIN_FAILURE: {
      const { failedPinAttempts } = state;
      return {
        ...state,
        isLoading: false,
        failedPinAttempts: failedPinAttempts + 1,
      };
    }

    case SET_VISIBLE_SETUP_PIN:
      return {
        ...state,
        visibleSetupPin: action.payload,
      };
    case SETUP_PIN_CODE_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case SETUP_PIN_CODE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        user: { ...state.user, hasPinCode: true },
      };

    case SETUP_PIN_CODE_FAILURE:
      return {
        ...state,
        isLoading: false,
      };
    case CHANGE_PIN_CODE_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case CHANGE_PIN_CODE_SUCCESS:
      return {
        ...state,
        isLoading: false,
      };
    case CHANGE_PIN_CODE_FAILURE:
      return {
        ...state,
        isLoading: false,
      };

    case SET_STAYED_LOGGED_IN:
      return {
        ...state,
        stayedLoggedIn: action.payload,
      };

    default:
      return state;
  }
};
