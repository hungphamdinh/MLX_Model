
export const CHECK_FEE_RECEIPT_REQUEST = 'fee/CHECK_FEE_RECEIPT_REQUEST';
export const CHECK_FEE_RECEIPT_REQUEST_SUCCESS = 'fee/CHECK_FEE_RECEIPT_REQUEST_SUCCESS';
export const CHECK_FEE_RECEIPT_REQUEST_FAILURE = 'fee/CHECK_FEE_RECEIPT_REQUEST_FAILURE';

export const CLOSE_SUCCESS_MODAL = 'fee/CLOSE_SUCCESS_MODAL';

export const checkFeeReceiptRequest = payload => ({
  type: CHECK_FEE_RECEIPT_REQUEST,
  payload,
});

export const checkFeeReceiptSuccess = payload => ({
  type: CHECK_FEE_RECEIPT_REQUEST_SUCCESS,
  payload,
});

export const checkFeeReceiptFailure = payload => ({
  type: CHECK_FEE_RECEIPT_REQUEST_FAILURE,
  payload,
});

export const closeModalRequest = () => ({
  type: CLOSE_SUCCESS_MODAL,
});
