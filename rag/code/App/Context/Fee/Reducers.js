import {
  CHECK_FEE_RECEIPT_REQUEST_FAILURE,
  CHECK_FEE_RECEIPT_REQUEST,
  CHECK_FEE_RECEIPT_REQUEST_SUCCESS,
  CLOSE_SUCCESS_MODAL,
} from './Actions';
import { SWITCH_TO_USER_ACCOUNT_SUCCESS } from '../User/Actions';

export const INITIAL_STATE = {
  feeReceipt: null,
  isShowSuccessModal: false,
  isLoading: false,
  error: '',
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SWITCH_TO_USER_ACCOUNT_SUCCESS:
      return INITIAL_STATE;

    case CHECK_FEE_RECEIPT_REQUEST: {
      return {
        ...state,
        feeReceipt: null,
        isLoading: true,
      };
    }

    case CHECK_FEE_RECEIPT_REQUEST_SUCCESS: {
      return {
        ...state,
        feeReceipt: action.payload,
        isShowSuccessModal: true,
        isLoading: false,
      };
    }

    case CHECK_FEE_RECEIPT_REQUEST_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case CLOSE_SUCCESS_MODAL:
      return {
        ...state,
        isShowSuccessModal: false,
      };
    default:
      return state;
  }
};
