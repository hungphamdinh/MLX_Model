import { useState } from 'react';
import { useStateValue } from '../../index';
import { checkFeeReceiptFailure, checkFeeReceiptRequest, checkFeeReceiptSuccess, closeModalRequest } from '../Actions';
import { RequestApi } from '../../../Services';
import { ReceiptType } from '../../../Config/Constants';


const useFee = () => {
  const [{ fee }, dispatch] = useStateValue();

  const checkFeeReceipt = async (params) => {
    try {
      const {code, feeType} = params;
      dispatch(checkFeeReceiptRequest(params));
      const response = feeType === ReceiptType.CASH_ADVANCE ? await RequestApi.checkFeeCashAdvanceReceipt(code) : await RequestApi.checkFeeReceipt(code);
      dispatch(checkFeeReceiptSuccess(response));
    } catch (err) {
      dispatch(checkFeeReceiptFailure(err));
    } finally {
    }
  };
  const closeSuccessModal = () => {
    dispatch(closeModalRequest());
  };

  return {
    fee, checkFeeReceipt, checkFeeReceiptRequest, closeSuccessModal,
  };
};

export default useFee;
