import I18n from '@I18n';
import _ from 'lodash';

import {
  BOOTSTRAP_APP_FAILURE,
  BOOTSTRAP_APP_REQUEST,
  BOOTSTRAP_APP_SUCCESS,
  CHECK_FORCE_UPDATE_FAILURE,
  CHECK_FORCE_UPDATE_REQUEST,
  CHECK_FORCE_UPDATE_SUCCESS,
  GET_PASSWORD_COMPLEXITY_SETTING_FAILURE,
  GET_PASSWORD_COMPLEXITY_SETTING_REQUEST,
  GET_PASSWORD_COMPLEXITY_SETTING_SUCCESS,
  SET_LANG_ID,
  SET_VISIBLE_NOTICE_REQUEST,
  SET_ALLOW_SCAN_QR_CODE,
  GET_ALL_SETTINGS_FAILURE,
  GET_ALL_SETTINGS_REQUEST,
  GET_ALL_SETTINGS_SUCCESS,
  GET_BIOMETRIC_TERM_CONDITIONS_SUCCESS,
  SET_DEVELOPER_MODE,
  SHOW_LOADING,
  GET_EMPLOYEES_BY_TENANT,
  GET_EMPLOYEES,
  GET_SIMPLE_COMPANIES,
} from './Actions';
import ListModel from '../Model/ListModel';
import { ControlOfficePrjId } from '../../Config/Constants';
import { transformWithRoleTags } from '../../Utils/func';

export const INITIAL_STATE = {
  error: undefined,
  haveNewVersion: false,
  isShowNotice: true,
  message: 'Success',
  notice: undefined,
  languageId: 'en',
  isLoading: false,
  passwordSetting: {
    requireDigit: true,
    requireLowercase: true,
    requireNonAlphanumeric: true,
    requireUppercase: true,
    requiredLength: 8,
  },
  regexPassword: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@!#$%^&+-]).{8}/,
  locations: [],
  allowScanQRCode: true,
  allSettings: {
    general: null,
  },
  isDeveloperMode: false,
  biometricTermConditions: null,
  isAgreeRootDisclaimer: undefined,
  employeesByTenant: new ListModel(),
  employees: new ListModel(),
  simpleCompanies: new ListModel(),
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case BOOTSTRAP_APP_REQUEST: {
      return {
        ...state,
      };
    }

    case BOOTSTRAP_APP_SUCCESS: {
      return {
        ...state,
      };
    }

    case BOOTSTRAP_APP_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    case CHECK_FORCE_UPDATE_REQUEST: {
      return {
        ...state,
      };
    }

    case CHECK_FORCE_UPDATE_SUCCESS: {
      return {
        ...state,
        haveNewVersion: action.payload,
      };
    }

    case CHECK_FORCE_UPDATE_FAILURE:
      return {
        ...state,
        error: action.payload,
      };

    case SET_VISIBLE_NOTICE_REQUEST: {
      return {
        ...state,
        notice: action.payload,
      };
    }

    case SET_LANG_ID: {
      return {
        ...state,
        languageId: action.payload,
        currentLang: I18n.currentLang,
      };
    }

    case GET_PASSWORD_COMPLEXITY_SETTING_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case GET_PASSWORD_COMPLEXITY_SETTING_SUCCESS: {
      return {
        ...state,
        ...action.payload,
        isLoading: false,
      };
    }

    case GET_PASSWORD_COMPLEXITY_SETTING_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case SET_ALLOW_SCAN_QR_CODE:
      return {
        ...state,
        allowScanQRCode: action.payload,
      };

    case GET_ALL_SETTINGS_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case GET_ALL_SETTINGS_SUCCESS: {
      return {
        ...state,
        allSettings: action.payload,
        isLoading: false,
      };
    }

    case GET_ALL_SETTINGS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case SET_DEVELOPER_MODE:
      return {
        ...state,
        isDeveloperMode: action.payload,
      };

    case GET_BIOMETRIC_TERM_CONDITIONS_SUCCESS: {
      return {
        ...state,
        biometricTermConditions: action.payload.find((item) => item.name === state.languageId)?.html || '',
      };
    }

    case GET_EMPLOYEES_BY_TENANT.REQUEST: {
      const { employeesByTenant } = state;
      employeesByTenant.setPage(action.payload?.page);
      return {
        ...state,
        employeesByTenant: _.cloneDeep(employeesByTenant),
      };
    }

    case GET_EMPLOYEES_BY_TENANT.SUCCESS: {
      const { employeesByTenant } = state;
      employeesByTenant.setData(action.payload);

      action.payload.items.forEach((item) => {
        item.tagName = item.tenantId === ControlOfficePrjId ? 'CO' : '';
      });
      return {
        ...state,
        employeesByTenant: _.cloneDeep(employeesByTenant),
      };
    }

    case GET_EMPLOYEES.REQUEST: {
      const { employees } = state;
      employees.setPage(action.payload?.page);
      return {
        ...state,
        employees: _.cloneDeep(employees),
      };
    }

    case GET_EMPLOYEES.SUCCESS: {
      const { employees } = state;
      const data = transformWithRoleTags(action.payload.items);
      employees.setData({
        ...action.payload,
        items: data,
      });
      return {
        ...state,
        employees: _.cloneDeep(employees),
      };
    }

    case GET_SIMPLE_COMPANIES.REQUEST: {
      const { simpleCompanies } = state;
      simpleCompanies.setPage(action.payload?.page);
      return {
        ...state,
        simpleCompanies: _.cloneDeep(simpleCompanies),
      };
    }
    case GET_SIMPLE_COMPANIES.SUCCESS: {
      const { simpleCompanies } = state;
      simpleCompanies.setData(action.payload);
      return {
        ...state,
        simpleCompanies: _.cloneDeep(simpleCompanies),
      };
    }

    case SHOW_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};
