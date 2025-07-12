import _ from 'lodash';

import {
  GET_ALL_FORM_QUESTION_ANSWER_TEMPLATE_FAILURE,
  GET_ALL_FORM_QUESTION_ANSWER_TEMPLATE_REQUEST,
  GET_ALL_FORM_QUESTION_ANSWER_TEMPLATE_SUCCESS,
  GET_DEFINE_FORM_SECTIONS_FAILURE,
  GET_DEFINE_FORM_SECTIONS_REQUEST,
  GET_DEFINE_FORM_SECTIONS_SUCCESS,
  GET_FORM_CATEGORIES_SUCCESS,
  GET_FORM_DETAIL,
  GET_FORM_SETTING_FAILURE,
  GET_FORM_SETTING_REQUEST,
  GET_FORM_SETTING_SUCCESS,
  GET_GLOBAL_FORMS_FAILURE,
  GET_GLOBAL_FORMS_REQUEST,
  GET_GLOBAL_FORMS_SUCCESS,
  GET_MY_FORMS_FAILURE,
  GET_MY_FORMS_REQUEST,
  GET_MY_FORMS_SUCCESS,
  GET_OFFLINE_FORMS_FAILURE,
  GET_OFFLINE_FORMS_REQUEST,
  GET_OFFLINE_FORMS_SUCCESS,
  GET_TEAM_FORMS_FAILURE,
  GET_TEAM_FORMS_REQUEST,
  GET_TEAM_FORMS_SUCCESS,
  SET_ACTION_TYPE,
  FILTER_FORM_QUESTION_SUMMARY_REQUEST,
  FILTER_FORM_QUESTION_SUMMARY_SUCCESS,
  FILTER_FORM_QUESTION_SUMMARY_FAILURE,
  GET_FORMS_LINK_MODULE_REQUEST,
  GET_FORMS_LINK_MODULE_SUCCESS,
  GET_FORMS_LINK_MODULE_FAILURE,
  PUBLISH_TO_TEAM_REQUEST,
  UN_PUBLISH_TO_TEAM_FAILURE,
  UN_PUBLISH_TO_TEAM_SUCCESS,
  UN_PUBLISH_TO_TEAM_REQUEST,
  PUBLISH_TO_TEAM_FAILURE,
  PUBLISH_TO_TEAM_SUCCESS,
  ADD_USER_ANSWER_FAILURE,
  ADD_USER_ANSWER_SUCCESS,
  ADD_USER_ANSWER_REQUEST,
  GET_ALL_FORMS_SUCCESS,
  GET_ALL_FORMS_FAILURE,
  GET_ALL_FORMS_REQUEST,
  CREATE_OR_EDIT_FORM_FAILURE,
  CREATE_OR_EDIT_FORM_REQUEST,
  CREATE_OR_EDIT_FORM_SUCCESS,
  CLONE_FROM_GLOBAL_REQUEST,
  CLONE_FROM_GLOBAL_FAILURE,
  CLONE_FROM_GLOBAL_SUCCESS,
  CLONE_HIDDEN_FORM_REQUEST,
  CLONE_HIDDEN_FORM_SUCCESS,
  CLONE_HIDDEN_FORM_FAILURE,
  GET_FORM_PAGE_GROUPS,
  GET_FORM_SETTINGS,
  SET_FORM_TYPE,
} from './Actions';
import ListModel from '../Model/ListModel';
import { FormEditorTypes } from '../../Config/Constants';
import { SWITCH_TO_USER_ACCOUNT_SUCCESS } from '../User/Actions';

export const INITIAL_STATE = {
  list: null,
  defineSections: [],
  offlineForms: new ListModel(),
  myForms: new ListModel(),
  formsLinkByModule: new ListModel(),
  formQuestionSummaries: new ListModel(),
  teamForms: new ListModel(),
  globalForms: new ListModel(),
  formCategories: [],
  optionAnswerTemplates: [],
  formDetail: {},
  isTeamLeader: false,
  actionType: FormEditorTypes.VIEW_FORM,
  isLoading: false,
  allForms: {
    myForms: null,
    teamForms: null,
    globalForms: null,
  },
  isLoadingForms: false,
  formPageGroups: [],
  formSettings: null,
  formType: 0,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SWITCH_TO_USER_ACCOUNT_SUCCESS:
      return INITIAL_STATE;

    case GET_OFFLINE_FORMS_REQUEST: {
      const { offlineForms } = state;
      offlineForms.setPage(action.payload.page);
      return {
        ...state,
        offlineForms: _.cloneDeep(offlineForms),
      };
    }

    case GET_OFFLINE_FORMS_SUCCESS: {
      const { offlineForms } = state;
      offlineForms.setData(action.payload);
      return {
        ...state,
        offlineForms: _.cloneDeep(offlineForms),
      };
    }

    case GET_OFFLINE_FORMS_FAILURE:
      return {
        ...state,
      };

    case GET_FORM_CATEGORIES_SUCCESS:
      return {
        ...state,
        formCategories: action.payload,
      };

    case GET_FORM_DETAIL.SUCCESS: {
      return {
        ...state,
        formDetail: action.payload,
        isLoading: false,
      };
    }

    case GET_FORM_SETTING_REQUEST: {
      return {
        ...state,
        isTeamLeader: false,
      };
    }

    case GET_FORM_SETTING_SUCCESS: {
      return {
        ...state,
        isTeamLeader: action.payload,
      };
    }

    case GET_FORM_SETTING_FAILURE:
      return {
        ...state,
      };

    case GET_FORM_SETTINGS.SUCCESS: {
      return {
        ...state,
        formSettings: action.payload,
      };
    }
    // my forms
    case GET_MY_FORMS_REQUEST: {
      const { myForms } = state;
      myForms.setPage(action.payload.page);
      return {
        ...state,
        myForms: _.cloneDeep(myForms),
      };
    }

    case GET_MY_FORMS_SUCCESS: {
      const { myForms } = state;
      myForms.setData(action.payload);
      return {
        ...state,
        myForms: _.cloneDeep(myForms),
      };
    }

    case GET_MY_FORMS_FAILURE: {
      const { myForms } = state;
      myForms.isRefresh = false;
      return {
        ...state,
        myForms: _.cloneDeep(myForms),
      };
    }

    case GET_FORMS_LINK_MODULE_REQUEST: {
      const { formsLinkByModule } = state;
      formsLinkByModule.setPage(action.payload.page);
      return {
        ...state,
        formsLinkByModule: _.cloneDeep(formsLinkByModule),
      };
    }

    case GET_FORMS_LINK_MODULE_SUCCESS: {
      const { formsLinkByModule } = state;
      formsLinkByModule.setData(action.payload);
      return {
        ...state,
        formsLinkByModule: _.cloneDeep(formsLinkByModule),
      };
    }

    case GET_FORMS_LINK_MODULE_FAILURE: {
      const { formsLinkByModule } = state;
      formsLinkByModule.isRefresh = false;
      return {
        ...state,
        formsLinkByModule: _.cloneDeep(formsLinkByModule),
      };
    }

    // team forms
    case GET_TEAM_FORMS_REQUEST: {
      const { teamForms } = state;
      teamForms.setPage(action.payload.page);
      return {
        ...state,
        teamForms: _.cloneDeep(teamForms),
      };
    }

    case GET_TEAM_FORMS_SUCCESS: {
      const { teamForms } = state;
      teamForms.setData(action.payload);
      return {
        ...state,
        teamForms: _.cloneDeep(teamForms),
      };
    }

    case GET_TEAM_FORMS_FAILURE:
      return {
        ...state,
      };

    // global forms
    case GET_GLOBAL_FORMS_REQUEST: {
      const { globalForms } = state;
      globalForms.setPage(action.payload.page);
      return {
        ...state,
        globalForms: _.cloneDeep(globalForms),
      };
    }

    case GET_GLOBAL_FORMS_SUCCESS: {
      const { globalForms } = state;
      globalForms.setData(action.payload);
      return {
        ...state,
        globalForms: _.cloneDeep(globalForms),
      };
    }

    case GET_GLOBAL_FORMS_FAILURE:
      return {
        ...state,
      };

    case SET_ACTION_TYPE:
      return {
        ...state,
        actionType: action.payload,
      };

    case GET_DEFINE_FORM_SECTIONS_REQUEST: {
      return {
        ...state,
        defineSections: [],
      };
    }

    case GET_DEFINE_FORM_SECTIONS_SUCCESS: {
      return {
        ...state,
        defineSections: action.payload,
      };
    }

    case GET_DEFINE_FORM_SECTIONS_FAILURE:
      return {
        ...state,
      };

    case GET_ALL_FORM_QUESTION_ANSWER_TEMPLATE_REQUEST: {
      return {
        ...state,
        defineSections: [],
      };
    }

    case GET_ALL_FORM_QUESTION_ANSWER_TEMPLATE_SUCCESS: {
      return {
        ...state,
        optionAnswerTemplates: action.payload,
      };
    }

    case GET_ALL_FORM_QUESTION_ANSWER_TEMPLATE_FAILURE:
      return {
        ...state,
      };

    case FILTER_FORM_QUESTION_SUMMARY_REQUEST: {
      const { formQuestionSummaries } = state;
      formQuestionSummaries.setPage(action.payload.page);
      return {
        ...state,
        formQuestionSummaries: _.cloneDeep(formQuestionSummaries),
      };
    }

    case FILTER_FORM_QUESTION_SUMMARY_SUCCESS: {
      const { formQuestionSummaries } = state;
      formQuestionSummaries.setData(action.payload);
      return {
        ...state,
        formQuestionSummaries: _.cloneDeep(formQuestionSummaries),
      };
    }

    case FILTER_FORM_QUESTION_SUMMARY_FAILURE:
      return {
        ...state,
      };

    case PUBLISH_TO_TEAM_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case PUBLISH_TO_TEAM_SUCCESS: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case PUBLISH_TO_TEAM_FAILURE:
      return {
        ...state,
        isLoading: false,
      };

    case UN_PUBLISH_TO_TEAM_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case UN_PUBLISH_TO_TEAM_SUCCESS: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case UN_PUBLISH_TO_TEAM_FAILURE:
      return {
        ...state,
        isLoading: false,
      };

    case ADD_USER_ANSWER_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case ADD_USER_ANSWER_SUCCESS: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case ADD_USER_ANSWER_FAILURE:
      return {
        ...state,
        isLoading: false,
      };

    case GET_ALL_FORMS_SUCCESS:
      return {
        ...state,
        allForms: action.payload,
        isLoadingForms: false,
      };

    case GET_ALL_FORMS_REQUEST:
      return {
        ...state,
        isLoadingForms: true,
      };

    case GET_ALL_FORMS_FAILURE:
      return {
        ...state,
        isLoadingForms: false,
      };

    case CREATE_OR_EDIT_FORM_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case CREATE_OR_EDIT_FORM_SUCCESS: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case CREATE_OR_EDIT_FORM_FAILURE:
      return {
        ...state,
        isLoading: false,
      };

    case CLONE_FROM_GLOBAL_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case CLONE_FROM_GLOBAL_SUCCESS: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case CLONE_FROM_GLOBAL_FAILURE:
      return {
        ...state,
        isLoading: false,
      };

    case CLONE_HIDDEN_FORM_REQUEST:
      return {
        ...state,
        isLoading: true,
      };

    case CLONE_HIDDEN_FORM_SUCCESS:
      return {
        ...state,
        isLoading: false,
      };

    case CLONE_HIDDEN_FORM_FAILURE:
      return {
        ...state,
        isLoading: false,
      };

    case GET_FORM_PAGE_GROUPS.SUCCESS:
      return {
        ...state,
        formPageGroups: action.payload,
      };
    case SET_FORM_TYPE:
      return {
        ...state,
        formType: action.payload,
      };
    default:
      return state;
  }
};
