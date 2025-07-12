/* eslint-disable no-restricted-globals */
import _ from 'lodash';
import I18n from '@I18n';
import {
  CREATE_INSPECTION_LINKAGE_FAILURE,
  CREATE_INSPECTION_LINKAGE_REQUEST,
  CREATE_INSPECTION_LINKAGE_SUCCESS,
  CREATE_ONLINE_INSPECTION_FAILURE,
  CREATE_ONLINE_INSPECTION_REQUEST,
  CREATE_ONLINE_INSPECTION_SUCCESS,
  DELETE_INSPECTION_FAILURE,
  DELETE_INSPECTION_REQUEST,
  DELETE_INSPECTION_SUCCESS,
  DELETE_ONLINE_INSPECTION_FAILURE,
  DELETE_ONLINE_INSPECTION_REQUEST,
  DELETE_ONLINE_INSPECTION_SUCCESS,
  EXECUTE_INSPECTION_FAILURE,
  EXECUTE_INSPECTION_REQUEST,
  EXECUTE_INSPECTION_SUCCESS,
  GET_AUDIT_LOGS_SUCCESS,
  GET_HOME_INSPECTIONS_FAILURE,
  GET_HOME_INSPECTIONS_REQUEST,
  GET_HOME_INSPECTIONS_SUCCESS,
  GET_INSPECTION_FORM_DETAIL_FAILURE,
  GET_INSPECTION_FORM_DETAIL_REQUEST,
  GET_INSPECTION_FORM_DETAIL_SUCCESS,
  GET_INSPECTION_HEADERS_FAILURE,
  GET_INSPECTION_HEADERS_REQUEST,
  GET_INSPECTION_HEADERS_SUCCESS,
  GET_INSPECTION_SETTING_FAILURE,
  GET_INSPECTION_SETTING_REQUEST,
  GET_INSPECTION_SETTING_SUCCESS,
  GET_INSPECTIONS_BY_LINK_MODULE_REQUEST,
  GET_INSPECTIONS_BY_LINK_MODULE_SUCCESS,
  GET_INSPECTIONS_BY_PROPERTY_FAILURE,
  GET_INSPECTIONS_BY_PROPERTY_REQUEST,
  GET_INSPECTIONS_BY_PROPERTY_SUCCESS,
  GET_INSPECTIONS_DETAIL_FAILURE,
  GET_INSPECTIONS_DETAIL_REQUEST,
  GET_INSPECTIONS_DETAIL_SUCCESS,
  GET_INSPECTIONS_FAILURE,
  GET_INSPECTIONS_ONLINE_REQUEST,
  GET_INSPECTIONS_ONLINE_SUCCESS,
  GET_INSPECTIONS_REQUEST,
  GET_INSPECTIONS_SUCCESS,
  GET_LIST_STATUS_FAILURE,
  GET_LIST_STATUS_REQUEST,
  GET_LIST_STATUS_SUCCESS,
  GET_STATUS_CONFIGS_FAILURE,
  GET_STATUS_CONFIGS_REQUEST,
  GET_STATUS_CONFIGS_SUCCESS,
  GET_WORKFLOW_DETAIL_FAILURE,
  GET_WORKFLOW_DETAIL_REQUEST,
  GET_WORKFLOW_DETAIL_SUCCESS,
  LINK_INSPECTION_FAILURE,
  LINK_INSPECTION_REQUEST,
  LINK_INSPECTION_SUCCESS,
  PICK_UP_INSPECTION_FAILURE,
  PICK_UP_INSPECTION_REQUEST,
  PICK_UP_INSPECTION_SUCCESS,
  RELEASE_INSPECTION_FAILURE,
  RELEASE_INSPECTION_REQUEST,
  RELEASE_INSPECTION_SUCCESS,
  SAVE_INSPECTION_FAILURE,
  SAVE_INSPECTION_REQUEST,
  SAVE_INSPECTION_SUCCESS,
  SAVE_INSPECTION_SIGNATURES_SUCCESS,
  UNLINK_INSPECTION_LINKAGE_FAILURE,
  UNLINK_INSPECTION_LINKAGE_REQUEST,
  UNLINK_INSPECTION_LINKAGE_SUCCESS,
  UPDATE_INSPECTION_SETTING_FAILURE,
  UPDATE_INSPECTION_SETTING_REQUEST,
  UPDATE_INSPECTION_SETTING_SUCCESS,
  UPDATE_ONLINE_INSPECTION_FAILURE,
  UPDATE_ONLINE_INSPECTION_REQUEST,
  UPDATE_ONLINE_INSPECTION_SUCCESS,
  UPLOAD_INSPECTION_DOCUMENT_FAILURE,
  UPLOAD_INSPECTION_DOCUMENT_REQUEST,
  UPLOAD_INSPECTION_DOCUMENT_SUCCESS,
  UPLOAD_INSPECTION_SIGNATURES_FAILURE,
  UPLOAD_INSPECTION_SIGNATURES_REQUEST,
  UPLOAD_INSPECTION_SIGNATURES_SUCCESS,
  GET_LOCATIONS_REQUEST,
  GET_LOCATIONS_SUCCESS,
  GET_LOCATIONS_FAILURE,
  RESET_LOCATIONS,
  GET_SIGNATURE_BY_WORKFLOW_ID_REQUEST,
  GET_SIGNATURE_BY_WORKFLOW_ID_SUCCESS,
  GET_SIGNATURE_BY_WORKFLOW_ID_FAILURE,
  SAVE_INSPECTION_SIGNATURES_REQUEST,
  RESET_SIGNATURE_IMAGE,
  DELETE_INSPECTION_SIGNATURE_REQUEST,
  DELETE_INSPECTION_SIGNATURE_SUCCESS,
  DELETE_INSPECTION_SIGNATURE_FAILURE,
  GET_QUESTION_TYPES_REQUEST,
  GET_QUESTION_TYPES_SUCCESS,
  GET_QUESTION_TYPES_FAILURE,
  GET_QUESTION_TYPE_CATEGORIES_REQUEST,
  GET_QUESTION_TYPE_CATEGORIES_SUCCESS,
  GET_QUESTION_TYPE_CATEGORIES_FAILURE,
  GET_INSPECTION_FOOTERS_REQUEST,
  GET_INSPECTION_FOOTERS_SUCCESS,
  GET_INSPECTION_FOOTERS_FAILURE,
  GET_INSPECTION_LINKAGE_DETAIL_REQUEST,
  GET_INSPECTION_LINKAGE_DETAIL_FAILURE,
  GET_INSPECTION_LINKAGE_DETAIL_SUCCESS,
  SET_QUEQUE_AUTO_SAVE,
  COMPLETE_INSPECTION_REQUEST,
  COMPLETE_INSPECTION_SUCCESS,
  COMPLETE_INSPECTION_FAILURE,
  GET_CHANGE_HISTORIES_FAILURE,
  GET_CHANGE_HISTORIES_REQUEST,
  GET_CHANGE_HISTORIES_SUCCESS,
  GET_INSPECTIONS_FORM_DETAIL_ONLINE_REQUEST,
  GET_INSPECTIONS_FORM_DETAIL_ONLINE_SUCCESS,
  GET_INSPECTIONS_FORM_DETAIL_ONLINE_FAILURE,
  GET_USERS_HAVE_JOB_PICKED_REQUEST,
  GET_USERS_HAVE_JOB_PICKED_SUCCESS,
  GET_USERS_HAVE_JOB_PICKED_FAILURE,
  GET_QUESTION_PROJECT_TYPES,
  GET_MY_REPORTS,
  CHANGE_CAMERA_FLASH_STATUS,
  GET_DEFECTS,
  GET_INSPECTION_DETAIL_INFO,
} from './Actions';
import ListModel from '../Model/ListModel';

const defaultSignature = {
  name: '',
};

export const INITIAL_STATE = {
  inspections: new ListModel(),
  onlineInspections: new ListModel(),
  allInspections: new ListModel(),
  newInspections: new ListModel(),
  inProgressInspections: new ListModel(),
  completedInspections: new ListModel(),
  pickedUpInspections: new ListModel(),
  defaultStatus: null,
  completedStatus: null,
  inspectionDetail: null,
  auditLogs: [],
  error: undefined,
  isUpdateInspection: false,
  isLoadingInspectionHome: true,
  isRefreshInspection: false,
  inspectionsLinkModule: new ListModel(),
  listStatus: [],
  workflowDetail: null,
  formDetail: null,
  inspectionSetting: null,
  isLoading: false,
  headers: [],
  footers: [],
  locations: null,
  signatories: [],
  signatureImage: null,
  hadSignature: false,
  questionTypes: [],
  questionTypeCategories: [],
  quequeAutoSave: null,
  isAutoSaveProcessing: false,
  changeHistories: new ListModel(),
  inspectionJobPicked: [],
  projectTypes: [],
  myReports: new ListModel(),
  flashTurnOn: false,
  defects: new ListModel(),
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_INSPECTIONS_BY_LINK_MODULE_REQUEST: {
      const { inspectionsLinkModule } = state;
      inspectionsLinkModule.setPage(action.payload.page);
      return {
        ...state,
        inspectionsLinkModule: _.cloneDeep(inspectionsLinkModule),
      };
    }

    case GET_INSPECTIONS_BY_LINK_MODULE_SUCCESS: {
      const { inspectionsLinkModule } = state;
      inspectionsLinkModule.setData(action.payload);
      action.payload.items.forEach((item) => (item.name = item.workflow.subject));
      return {
        ...state,
        inspectionsLinkModule: _.cloneDeep(inspectionsLinkModule),
      };
    }

    case GET_INSPECTIONS_REQUEST: {
      const { inspections } = state;
      inspections.setPage(action.payload.page);
      return {
        ...state,
        inspections: _.cloneDeep(inspections),
      };
    }

    case GET_INSPECTIONS_SUCCESS: {
      const { inspections } = state;
      inspections.setData(action.payload);
      return {
        ...state,
        inspections: _.cloneDeep(inspections),
      };
    }

    case GET_INSPECTIONS_DETAIL_REQUEST: {
      return {
        ...state,
        inspectionDetail: undefined,
        isLoading: true,
      };
    }

    case GET_INSPECTIONS_DETAIL_SUCCESS: {
      return {
        ...state,
        inspectionDetail: action.payload,
        isLoading: false,
      };
    }

    case GET_INSPECTIONS_DETAIL_FAILURE: {
      return {
        ...state,
        inspectionDetail: action.payload,
        isLoading: false,
      };
    }

    case RESET_LOCATIONS: {
      return {
        ...state,
        locations: null,
      };
    }

    case GET_LOCATIONS_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case GET_LOCATIONS_SUCCESS: {
      return {
        ...state,
        locations: action.payload,
        isLoading: false,
      };
    }

    case GET_LOCATIONS_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case GET_INSPECTIONS_ONLINE_REQUEST: {
      const { onlineInspections } = state;
      onlineInspections.setPage(action.payload.page);
      return {
        ...state,
        onlineInspections: _.cloneDeep(onlineInspections),
      };
    }

    case GET_INSPECTIONS_ONLINE_SUCCESS: {
      const { onlineInspections } = state;
      onlineInspections.setData(action.payload);
      return {
        ...state,
        onlineInspections: _.cloneDeep(onlineInspections),
      };
    }

    case GET_INSPECTIONS_FAILURE:
      return {
        ...state,
      };

    case GET_INSPECTIONS_BY_PROPERTY_REQUEST: {
      const { propertyInspections } = state;
      propertyInspections.setPage(action.payload.page);
      return {
        ...state,
        propertyInspections: _.cloneDeep(propertyInspections),
      };
    }

    case GET_INSPECTIONS_BY_PROPERTY_SUCCESS: {
      const { propertyInspections } = state;
      propertyInspections.setData(action.payload);
      return {
        ...state,
        propertyInspections: _.cloneDeep(propertyInspections),
      };
    }

    case GET_INSPECTIONS_BY_PROPERTY_FAILURE:
      return {
        ...state,
      };

    case GET_HOME_INSPECTIONS_REQUEST: {
      return {
        ...state,
        isLoadingInspectionHome: true,
      };
    }

    case GET_HOME_INSPECTIONS_SUCCESS: {
      return {
        ...state,
        ...action.payload,
        isLoadingInspectionHome: false,
      };
    }

    case GET_INSPECTION_FORM_DETAIL_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case GET_INSPECTION_FORM_DETAIL_SUCCESS: {
      return {
        ...state,
        formDetail: action.payload,
        isLoading: false,
      };
    }
    case GET_INSPECTION_FORM_DETAIL_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case GET_HOME_INSPECTIONS_FAILURE:
      return {
        ...state,
        isLoadingInspectionHome: false,
      };

    case SAVE_INSPECTION_REQUEST:
      return {
        ...state,
        isLoading: false,
      };
    case SAVE_INSPECTION_SUCCESS:
      return {
        ...state,
        isLoading: false,
      };
    case SAVE_INSPECTION_FAILURE:
      return {
        ...state,
        isUpdateInspection: false,
        isLoading: false,
      };

    case DELETE_INSPECTION_REQUEST:
      return {
        ...state,
        isUpdateInspection: true,
        isLoading: true,
      };
    case DELETE_INSPECTION_SUCCESS:
      return {
        ...state,
        isUpdateInspection: false,
        isLoading: false,
      };
    case DELETE_INSPECTION_FAILURE:
      return {
        ...state,
        isUpdateInspection: false,
        isLoading: false,
      };

    case GET_WORKFLOW_DETAIL_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case GET_WORKFLOW_DETAIL_SUCCESS: {
      return {
        ...state,
        workflowDetail: action.payload,
        isLoading: false,
      };
    }
    case GET_WORKFLOW_DETAIL_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case GET_AUDIT_LOGS_SUCCESS: {
      return {
        ...state,
        auditLogs: action.payload,
      };
    }
    case GET_INSPECTION_SETTING_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case GET_INSPECTION_SETTING_SUCCESS:
      return {
        ...state,
        isLoading: false,
        inspectionSetting: action.payload,
      };
    case GET_INSPECTION_SETTING_FAILURE:
      return {
        ...state,
        isLoading: false,
      };
    case UPDATE_INSPECTION_SETTING_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case UPDATE_INSPECTION_SETTING_SUCCESS: {
      const inspectionSetting = state.inspectionSetting || {};
      const { isSynchronizationViaCellular } = action.payload;
      return {
        ...state,
        inspectionSetting: { ...inspectionSetting, isSynchronizationViaCellular },
        isLoading: false,
      };
    }

    case UPDATE_INSPECTION_SETTING_FAILURE:
      return {
        ...state,
        isLoading: false,
      };

    case PICK_UP_INSPECTION_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case PICK_UP_INSPECTION_SUCCESS:
      return {
        ...state,
        isLoading: false,
      };
    case PICK_UP_INSPECTION_FAILURE:
      return {
        ...state,
        isLoading: false,
      };

    case RELEASE_INSPECTION_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case RELEASE_INSPECTION_SUCCESS:
      return {
        ...state,
        isLoading: false,
      };
    case RELEASE_INSPECTION_FAILURE:
      return {
        ...state,
        isLoading: false,
      };
    case UPDATE_ONLINE_INSPECTION_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case UPDATE_ONLINE_INSPECTION_SUCCESS:
      return {
        ...state,
        isLoading: false,
      };
    case UPDATE_ONLINE_INSPECTION_FAILURE:
      return {
        ...state,
        isLoading: false,
      };

    case CREATE_ONLINE_INSPECTION_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case CREATE_ONLINE_INSPECTION_SUCCESS:
      return {
        ...state,
        isLoading: false,
      };
    case CREATE_ONLINE_INSPECTION_FAILURE:
      return {
        ...state,
        isLoading: false,
      };
    case GET_INSPECTION_DETAIL_INFO.REQUEST:
      return {
        ...state,
        inspectionDetailInfo: undefined,
      };

    case GET_INSPECTION_DETAIL_INFO.SUCCESS:
      return {
        ...state,
        inspectionDetailInfo: action.payload,
      };

    case UPLOAD_INSPECTION_DOCUMENT_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case UPLOAD_INSPECTION_DOCUMENT_SUCCESS:
      return {
        ...state,
        isLoading: false,
      };
    case UPLOAD_INSPECTION_DOCUMENT_FAILURE:
      return {
        ...state,
        isLoading: false,
      };
    case GET_STATUS_CONFIGS_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case GET_STATUS_CONFIGS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        ...action.payload,
      };
    case GET_STATUS_CONFIGS_FAILURE:
      return {
        ...state,
        isLoading: false,
      };
    case GET_LIST_STATUS_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case GET_LIST_STATUS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        listStatus: action.payload,
      };
    case GET_LIST_STATUS_FAILURE:
      return {
        ...state,
        isLoading: false,
      };
    case CREATE_INSPECTION_LINKAGE_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case CREATE_INSPECTION_LINKAGE_SUCCESS:
      return {
        ...state,
        isLoading: false,
      };
    case CREATE_INSPECTION_LINKAGE_FAILURE:
      return {
        ...state,
        isLoading: false,
      };
    case LINK_INSPECTION_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case LINK_INSPECTION_SUCCESS:
      return {
        ...state,
        isLoading: false,
      };
    case LINK_INSPECTION_FAILURE:
      return {
        ...state,
        isLoading: false,
      };
    case UNLINK_INSPECTION_LINKAGE_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case UNLINK_INSPECTION_LINKAGE_SUCCESS:
      return {
        ...state,
        isLoading: false,
      };
    case UNLINK_INSPECTION_LINKAGE_FAILURE:
      return {
        ...state,
        isLoading: false,
      };
    case EXECUTE_INSPECTION_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case EXECUTE_INSPECTION_SUCCESS:
      return {
        ...state,
        isLoading: false,
      };
    case EXECUTE_INSPECTION_FAILURE:
      return {
        ...state,
        isLoading: false,
      };

    case UPLOAD_INSPECTION_SIGNATURES_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case UPLOAD_INSPECTION_SIGNATURES_SUCCESS:
      return {
        ...state,
        isLoading: false,
      };
    case UPLOAD_INSPECTION_SIGNATURES_FAILURE:
      return {
        ...state,
        isLoading: false,
      };
    case DELETE_ONLINE_INSPECTION_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case DELETE_ONLINE_INSPECTION_SUCCESS:
      return {
        ...state,
        isLoading: false,
      };
    case DELETE_ONLINE_INSPECTION_FAILURE:
      return {
        ...state,
        isLoading: false,
      };

    case GET_INSPECTION_HEADERS_REQUEST:
      return {
        ...state,
        headers: [],
      };
    case GET_INSPECTION_HEADERS_SUCCESS:
      return {
        ...state,
        headers: action.payload,
      };
    case GET_INSPECTION_HEADERS_FAILURE:
      return {
        ...state,
      };

    case GET_INSPECTION_FOOTERS_REQUEST:
      return {
        ...state,
        footers: [],
      };
    case GET_INSPECTION_FOOTERS_SUCCESS:
      return {
        ...state,
        footers: action.payload,
      };
    case GET_INSPECTION_FOOTERS_FAILURE:
      return {
        ...state,
      };

    case GET_SIGNATURE_BY_WORKFLOW_ID_REQUEST:
      return {
        ...state,
        signatories: getSignaturesByConfig(state.inspectionSetting),
        hadSignature: false,
      };
    case GET_SIGNATURE_BY_WORKFLOW_ID_SUCCESS: {
      let signatories =
        action.payload.length === 0
          ? getSignaturesByConfig(state.inspectionSetting)
          : updateSignatures(state.signatories, action.payload);
      signatories = sortByIndex(state.signatories, signatories);
      return {
        ...state,
        signatories,
        hadSignature: !!signatories.find((item) => item.title),
      };
    }
    case GET_SIGNATURE_BY_WORKFLOW_ID_FAILURE:
      return {
        ...state,
      };

    case SAVE_INSPECTION_SIGNATURES_REQUEST:
      return {
        ...state,
        // signatureImage: null,
      };

    case SAVE_INSPECTION_SIGNATURES_SUCCESS:
      return {
        ...state,
        signatureImage: action.payload,
      };

    case RESET_SIGNATURE_IMAGE:
      return {
        ...state,
        signatureImage: null,
      };

    case DELETE_INSPECTION_SIGNATURE_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case DELETE_INSPECTION_SIGNATURE_SUCCESS:
      return {
        ...state,
        isLoading: false,
      };
    case DELETE_INSPECTION_SIGNATURE_FAILURE:
      return {
        ...state,
        isLoading: false,
      };

    case GET_QUESTION_TYPES_REQUEST:
      return {
        ...state,
      };
    case GET_QUESTION_TYPES_SUCCESS:
      return {
        ...state,
        questionTypes: action.payload.map((item) => {
          item.name = I18n.t(`FORM_${item.name.toUpperCase().replace(/\s+/g, '_')}`);
          return item;
        }),
      };
    case GET_QUESTION_TYPES_FAILURE:
      return {
        ...state,
      };

    case GET_QUESTION_TYPE_CATEGORIES_REQUEST:
      return {
        ...state,
      };
    case GET_QUESTION_TYPE_CATEGORIES_SUCCESS:
      return {
        ...state,
        questionTypeCategories: action.payload,
      };
    case GET_QUESTION_TYPE_CATEGORIES_FAILURE:
      return {
        ...state,
      };

    case GET_INSPECTION_LINKAGE_DETAIL_REQUEST:
      return {
        ...state,
        isLoading: true,
      };

    case GET_INSPECTION_LINKAGE_DETAIL_SUCCESS:
      return {
        ...state,
        isLoading: false,
      };

    case GET_INSPECTION_LINKAGE_DETAIL_FAILURE:
      return {
        ...state,
        isLoading: false,
      };
    case SET_QUEQUE_AUTO_SAVE:
      return {
        ...state,
        quequeAutoSave: action.payload,
      };
    case COMPLETE_INSPECTION_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case COMPLETE_INSPECTION_SUCCESS:
      return {
        ...state,
        isLoading: false,
      };
    case COMPLETE_INSPECTION_FAILURE:
      return {
        ...state,
        isLoading: false,
      };
    case GET_CHANGE_HISTORIES_REQUEST: {
      const { changeHistories } = state;
      changeHistories.setPage(action.payload.page);
      return {
        ...state,
        isLoading: true,
        changeHistories: _.cloneDeep(changeHistories),
      };
    }
    case GET_CHANGE_HISTORIES_SUCCESS: {
      const { changeHistories } = state;
      changeHistories.setData(action.payload);
      return {
        ...state,
        isLoading: false,
        changeHistories: _.cloneDeep(changeHistories),
      };
    }
    case GET_CHANGE_HISTORIES_FAILURE:
      return {
        ...state,
        isLoading: false,
      };

    case GET_INSPECTIONS_FORM_DETAIL_ONLINE_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case GET_INSPECTIONS_FORM_DETAIL_ONLINE_SUCCESS:
      return {
        ...state,
        isLoading: false,
      };
    case GET_INSPECTIONS_FORM_DETAIL_ONLINE_FAILURE:
      return {
        ...state,
        isLoading: false,
      };

    case GET_USERS_HAVE_JOB_PICKED_REQUEST:
      return {
        ...state,
        isLoading: true,
      };

    case GET_USERS_HAVE_JOB_PICKED_SUCCESS:
      return {
        ...state,
        isLoading: false,
      };

    case GET_USERS_HAVE_JOB_PICKED_FAILURE:
      return {
        ...state,
        isLoading: false,
      };

    case GET_QUESTION_PROJECT_TYPES.SUCCESS:
      return {
        ...state,
        projectTypes: action.payload,
      };

    case GET_MY_REPORTS.REQUEST:
      const { myReports } = state;
      myReports.setPage(action.payload.page);
      return {
        ...state,
        myReports: _.cloneDeep(myReports),
      };

    case GET_MY_REPORTS.SUCCESS: {
      const { myReports } = state;
      myReports.setData(action.payload);
      return {
        ...state,
        myReports: _.cloneDeep(myReports),
      };
    }

    case CHANGE_CAMERA_FLASH_STATUS: {
      return {
        ...state,
        flashTurnOn: !state.flashTurnOn,
        };
    }
    case GET_DEFECTS.REQUEST: {
      const { defects } = state;
      defects.setPage(action.payload.page);
      return {
        ...state,
        defects: _.cloneDeep(defects),
      };
    }

    case GET_DEFECTS.SUCCESS: {
      const { defects } = state;
      const defectItems = {
        items: action.payload,
        totalCount: _.size(action.payload),
      };

      defects.setData(defectItems);
      return {
        ...state,
        defects: _.cloneDeep(defects),
      };
    }

    default:
      return state;
  }
};

const updateSignatures = (localSignatures, remoteSignatures) => {
  return localSignatures.map((localSig, index) => {
    const remoteSig = remoteSignatures[index];
    if (!remoteSig) {
      return localSig;
    }

    const moduleName = remoteSig.moduleName;
    const match = moduleName.match(/\d+$/); // Extract last numeric characters
    const indexFromName = Number(match && match[0]); // Get the extracted number

    // Set index based on whether the conversion was successful; default to 0 if not
    remoteSig.index = !indexFromName ? 1 : indexFromName;

    return remoteSig;
  });
};

const getSignaturesByConfig = (settings) => {
  if (!settings?.numberOfSignature) {
    return [];
  }
  return Array.from({ length: settings.numberOfSignature }, () => ({ ...defaultSignature }));
};

const sortByIndex = (currentData, newData) =>
  currentData.map((item, index) => {
    const newIndexData = newData.find((data) => data.index - 1 === index);
    if (newIndexData && newIndexData.index - 1 === index) {
      return newIndexData;
    }
    return item;
  });
