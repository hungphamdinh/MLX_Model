import _ from 'lodash';
import {
  FILTER_EXISTING_SURVEY_REQUEST,
  FILTER_EXISTING_SURVEY_SUCCESS,
  FILTER_EXISTING_SURVEY_FAILURE,
  FILTER_SURVEY_FAILURE,
  FILTER_SURVEY_REQUEST,
  FILTER_SURVEY_RESPONSE_FAILURE,
  FILTER_SURVEY_RESPONSE_REQUEST,
  FILTER_SURVEY_RESPONSE_SUCCESS,
  FILTER_SURVEY_SUCCESS,
  FILTER_SURVEY_USERS_FAILURE,
  FILTER_SURVEY_USERS_REQUEST,
  FILTER_SURVEY_USERS_SUCCESS,
  GET_SURVEY_DETAIL_FAILURE,
  GET_SURVEY_DETAIL_REQUEST,
  GET_SURVEY_DETAIL_SUCCESS,
  UPDATE_SURVEY_TITLE_FAILURE,
  UPDATE_SURVEY_TITLE_SUCCESS,
  UPDATE_SURVEY_TITLE_REQUEST,
  GET_OPTIONS_FOR_PUBLISH_SURVEY_REQUEST,
  GET_OPTIONS_FOR_PUBLISH_SURVEY_SUCCESS,
  GET_OPTIONS_FOR_PUBLISH_SURVEY_FAILURE,
  GET_LIST_UNITS_FOR_PUBLISH_REQUEST,
  GET_LIST_UNITS_FOR_PUBLISH_SUCCESS,
  GET_LIST_UNITS_FOR_PUBLISH_FAILURE,
  GET_EMAIL_MEMBERS_FOR_PUBLISH_REQUEST,
  GET_EMAIL_MEMBERS_FOR_PUBLISH_SUCCESS,
  GET_EMAIL_MEMBERS_FOR_PUBLISH_FAILURE,
  GET_LIST_EMPLOYEE_FOR_PUBLISH_REQUEST,
  GET_LIST_EMPLOYEE_FOR_PUBLISH_SUCCESS,
  GET_LIST_EMPLOYEE_FOR_PUBLISH_FAILURE,
  FILTER_SURVEY_UNITS,
} from './Actions';

import ListModel from '../Model/ListModel';
import { REOPEN_FORM_USER_ANSWER_SUCCESS } from '../Form/Actions';

export const INITIAL_STATE = {
  surveys: new ListModel(),
  existingSurveys: new ListModel(),
  surveyUsers: new ListModel(),
  employeeSurveys: new ListModel(),
  surveyUnits: new ListModel(),
  surveyDetail: null,
  surveyDetailId: null,
  error: undefined,
  buildings: [],
  unitTypes: [],
  tenantRoles: [],
  units: [],
  employees: [],
  members: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FILTER_SURVEY_REQUEST: {
      const { surveys } = state;
      surveys.setPage(action.payload.page);
      return {
        ...state,
        surveys: _.cloneDeep(surveys),
      };
    }

    case FILTER_SURVEY_SUCCESS: {
      const { surveys } = state;
      surveys.setData(action.payload);
      return {
        ...state,
        surveys: _.cloneDeep(surveys),
      };
    }

    case FILTER_SURVEY_FAILURE:
      return {
        ...state,
      };

    case FILTER_EXISTING_SURVEY_REQUEST: {
      const { existingSurveys } = state;
      existingSurveys.setPage(action.payload.page);
      return {
        ...state,
        existingSurveys: _.cloneDeep(existingSurveys),
      };
    }

    case FILTER_EXISTING_SURVEY_SUCCESS: {
      const { existingSurveys } = state;
      existingSurveys.setData(action.payload);
      return {
        ...state,
        existingSurveys: _.cloneDeep(existingSurveys),
      };
    }

    case FILTER_EXISTING_SURVEY_FAILURE:
      return {
        ...state,
      };

    case FILTER_SURVEY_USERS_REQUEST: {
      const { surveyUsers } = state;
      surveyUsers.setPage(action.payload.page);
      return {
        ...state,
        surveyUsers: _.cloneDeep(surveyUsers),
      };
    }

    case FILTER_SURVEY_USERS_SUCCESS: {
      const { surveyUsers } = state;
      surveyUsers.setData(action.payload);
      return {
        ...state,
        surveyUsers: _.cloneDeep(surveyUsers),
      };
    }

    case FILTER_SURVEY_USERS_FAILURE:
      return {
        ...state,
      };

    case FILTER_SURVEY_RESPONSE_REQUEST: {
      const { employeeSurveys } = state;
      employeeSurveys.setPage(action.payload.page);
      return {
        ...state,
        employeeSurveys: _.cloneDeep(employeeSurveys),
      };
    }

    case FILTER_SURVEY_RESPONSE_SUCCESS: {
      const { employeeSurveys } = state;
      employeeSurveys.setData(action.payload);
      return {
        ...state,
        employeeSurveys: _.cloneDeep(employeeSurveys),
      };
    }

    case FILTER_SURVEY_RESPONSE_FAILURE:
      return {
        ...state,
      };

    case GET_SURVEY_DETAIL_REQUEST: {
      return {
        ...state,
        surveyDetailId: action.payload,
        surveyDetail: null,
      };
    }

    case GET_SURVEY_DETAIL_SUCCESS: {
      return {
        ...state,
        surveyDetail: action.payload,
      };
    }

    case GET_SURVEY_DETAIL_FAILURE:
      return {
        ...state,
      };

    case UPDATE_SURVEY_TITLE_REQUEST: {
      return {
        ...state,
      };
    }

    case UPDATE_SURVEY_TITLE_SUCCESS: {
      const { surveys, surveyDetail } = state;
      const surveyDetailClone = _.clone(surveyDetail);
      surveyDetailClone.name = action.payload;

      const survey = surveys.data.find((item) => item.id === surveyDetail.id);
      survey.name = action.payload;

      return {
        ...state,
        surveyDetail: surveyDetailClone,
        surveys,
      };
    }

    case UPDATE_SURVEY_TITLE_FAILURE:
      return {
        ...state,
      };

    case GET_OPTIONS_FOR_PUBLISH_SURVEY_REQUEST: {
      return {
        ...state,
      };
    }

    case GET_OPTIONS_FOR_PUBLISH_SURVEY_SUCCESS: {
      return {
        ...state,
        ...action.payload,
      };
    }

    case GET_OPTIONS_FOR_PUBLISH_SURVEY_FAILURE:
      return {
        ...state,
      };

    case GET_LIST_UNITS_FOR_PUBLISH_REQUEST: {
      return {
        ...state,
      };
    }

    case GET_LIST_UNITS_FOR_PUBLISH_SUCCESS: {
      return {
        ...state,
        units: action.payload,
      };
    }

    case GET_LIST_UNITS_FOR_PUBLISH_FAILURE:
      return {
        ...state,
      };

    case GET_EMAIL_MEMBERS_FOR_PUBLISH_REQUEST: {
      return {
        ...state,
      };
    }

    case GET_EMAIL_MEMBERS_FOR_PUBLISH_SUCCESS: {
      return {
        ...state,
        members: action.payload,
      };
    }

    case GET_EMAIL_MEMBERS_FOR_PUBLISH_FAILURE:
      return {
        ...state,
      };

    case GET_LIST_EMPLOYEE_FOR_PUBLISH_REQUEST: {
      return {
        ...state,
      };
    }

    case GET_LIST_EMPLOYEE_FOR_PUBLISH_SUCCESS: {
      return {
        ...state,
        employees: action.payload,
      };
    }

    case GET_LIST_EMPLOYEE_FOR_PUBLISH_FAILURE:
      return {
        ...state,
      };

    case REOPEN_FORM_USER_ANSWER_SUCCESS: {
      const { employeeSurveys } = state;
      const selectedSurvey = employeeSurveys.data.find((item) => item.surveyId === action.payload.parentId);
      if (selectedSurvey) {
        selectedSurvey.isSubmitted = false;
      }
      return {
        ...state,
        selectedSurvey,
      };
    }

    case FILTER_SURVEY_UNITS.REQUEST: {
      const { surveyUnits } = state;
      surveyUnits.setPage(action.payload.page);
      return {
        ...state,
        surveyUnits: _.cloneDeep(surveyUnits),
      };
    }

    case FILTER_SURVEY_UNITS.SUCCESS: {
      const { surveyUnits } = state;
      surveyUnits.setData(action.payload);
      return {
        ...state,
        surveyUnits: _.cloneDeep(surveyUnits),
      };
    }

    default:
      return state;
  }
};
