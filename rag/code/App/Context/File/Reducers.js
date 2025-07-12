import {
  GET_FILE_REFERENCE_FAILURE,
  GET_FILE_REFERENCE_REQUEST,
  GET_FILE_REFERENCE_SUCCESS,
  UPLOAD_FILES_FAILURE,
  UPLOAD_FILES_REQUEST,
  UPLOAD_FILES_SUCCESS,
  DOWNLOAD_AND_VIEW_DOCUMENT_REQUEST,
  DOWNLOAD_AND_VIEW_DOCUMENT_SUCCESS,
  DOWNLOAD_AND_VIEW_DOCUMENT_FAILURE,
  GET_FILE_BY_GUID_REQUEST,
  GET_FILE_BY_GUID_FAILURE,
  GET_FILE_BY_GUID_SUCCESS,
  GET_FILE_BY_REFERENCE_ID_REQUEST,
  GET_FILE_BY_REFERENCE_ID_FAILURE,
  GET_FILE_BY_REFERENCE_ID_SUCCESS,
  GET_FILE_BY_REFERENCE_ID_AND_MODULE_NAMES_REQUEST,
  GET_FILE_BY_REFERENCE_ID_AND_MODULE_NAMES_FAILURE,
  GET_FILE_BY_REFERENCE_ID_AND_MODULE_NAMES_SUCCESS,
  RESET_FILES_REQUEST,
} from './Actions';
import { SWITCH_TO_USER_ACCOUNT_SUCCESS } from '../User/Actions';

export const INITIAL_STATE = {
  files: [],
  fileUrls: [],
  filesByGuid: [],
  referenceFiles: [],
  error: undefined,
  isLoading: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SWITCH_TO_USER_ACCOUNT_SUCCESS:
      return INITIAL_STATE;

    case UPLOAD_FILES_REQUEST: {
      return {
        ...state,
        files: [],
        isLoading: true,
      };
    }

    case UPLOAD_FILES_SUCCESS: {
      return {
        ...state,
        files: action.payload,
        isLoading: false,
      };
    }

    case UPLOAD_FILES_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case DOWNLOAD_AND_VIEW_DOCUMENT_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case DOWNLOAD_AND_VIEW_DOCUMENT_SUCCESS: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case DOWNLOAD_AND_VIEW_DOCUMENT_FAILURE:
      return {
        ...state,
        isLoading: false,
      };

    case GET_FILE_BY_REFERENCE_ID_REQUEST: {
      return {
        ...state,
        referenceFiles: [],
      };
    }

    case GET_FILE_BY_REFERENCE_ID_SUCCESS: {
      return {
        ...state,
        referenceFiles: action.payload,
      };
    }

    case GET_FILE_BY_REFERENCE_ID_FAILURE:
      return {
        ...state,
        error: action.payload,
      };

    case GET_FILE_BY_REFERENCE_ID_AND_MODULE_NAMES_REQUEST: {
      return {
        ...state,
        [action.payload.fieldName]: [],
      };
    }

    case GET_FILE_BY_REFERENCE_ID_AND_MODULE_NAMES_SUCCESS: {
      const { fieldName, result } = action.payload;
      return {
        ...state,
        [fieldName]: result,
      };
    }

    case GET_FILE_BY_REFERENCE_ID_AND_MODULE_NAMES_FAILURE:
      return {
        ...state,
        error: action.payload,
      };

    case GET_FILE_REFERENCE_REQUEST: {
      return {
        ...state,
        fileUrls: [],
      };
    }

    case GET_FILE_REFERENCE_SUCCESS: {
      return {
        ...state,
        fileUrls: action.payload,
      };
    }

    case GET_FILE_REFERENCE_FAILURE:
      return {
        ...state,
      };

    case GET_FILE_BY_GUID_REQUEST: {
      return {
        ...state,
        filesByGuid: [],
      };
    }

    case GET_FILE_BY_GUID_SUCCESS: {
      return {
        ...state,
        filesByGuid: action.payload,
      };
    }

    case GET_FILE_BY_GUID_FAILURE:
      return {
        ...state,
      };

    case RESET_FILES_REQUEST:
      return {
        ...state,
        files: [],
        fileUrls: [],
        filesByGuid: [],
        referenceFiles: [],
      };

    default:
      return state;
  }
};
