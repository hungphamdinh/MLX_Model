/* eslint-disable no-unused-expressions */
import NavigationService from '@NavigationService';
import { DeviceEventEmitter } from 'react-native';
import { useStateValue } from '../../index';
import {
  checkOutRequestSuccess,
  checkOutRequestFailure,
  uploadSignatureFailure,
  getListUnitV2,
  getListUnitV2Success,
  getListUnitV2Failure,
  getListMemberUnitSuccess,
  getListMemberUnitFailure,
  getListMemberUnit,
  scanParcelReceiptSuccess,
  scanParcelReceiptFailure,
  scanParcelReceipt as scanParcelRequest,
  checkOutMultiRequest,
  checkOutMultiSuccess,
  checkOutMultiFailure,
  getTransportServices,
  getTransportServicesSuccess,
  getTransportServicesFailure,
  addDeliveryFailure,
  addDeliveryRequest,
  addDeliverySuccess,
  updateDeliveryFailure,
  updateDeliveryRequest,
  updateDeliverySuccess,
  detailDeliveryFailure,
  detailDeliveryRequest,
  detailDeliverySuccess,
  getAllDeliveriesFailure,
  getAllDeliveriesRequest,
  getAllDeliveriesSuccess,
  getDeliveryTypesFailure,
  getDeliveryTypesRequest,
  getDeliveryTypesSuccess,
  getDeliveryStatusFailure,
  getDeliveryStatusSuccess,
  getDeliveryStatusRequest,
  getParcelsInUnitSuccess,
  getParcelsInUnitFailure,
  getParcelsInUnitRequest,
} from '../Actions';
import { RequestApi } from '../../../Services';

import { toast } from '../../../Utils';
import I18n from '../../../I18n';
import { ParcelStatus } from '../../../Config/Constants';

const useDelivery = () => {
  const [{ delivery }, dispatch] = useStateValue();

  const checkOutDelivery = async (params, files, guid, screenAmounts) => {
    try {
      const response = await RequestApi.updateDelivery(params);
      if (files) {
        const signatureParams = {
          guid: response.receiveSignedId,
          files,
        };
        uploadFileSignature(signatureParams, screenAmounts, [response]);
      }
      dispatch(checkOutRequestSuccess(response));
    } catch (err) {
      dispatch(checkOutRequestFailure(err));
    }
  };

  const checkOutDeliveries = async (params, files, guid, screenAmounts) => {
    try {
      dispatch(checkOutMultiRequest(params));

      const response = await RequestApi.updateDeliveries(params);
      dispatch(checkOutMultiSuccess(response));
      if (files) {
        const signatureParams = {
          guid: response[0].receiveSignedId,
          files,
        };
        uploadFileSignature(signatureParams, screenAmounts, response);
      } else {
        toast.showSuccess(I18n.t('DELIVERY_CHECK_OUT_SUCCESS'));
        DeviceEventEmitter.emit('UpdateListDelivery', 1);
      }

      return response;
    } catch (err) {
      dispatch(checkOutMultiFailure(err));
    }
  };

  const getListUnit = async (params) => {
    try {
      dispatch(getListUnitV2(params.page));
      const result = await RequestApi.getListUnitsV2(params);
      dispatch(getListUnitV2Success(result));
    } catch (err) {
      dispatch(getListUnitV2Failure(err));
    }
    return null;
  };

  const getListTransportService = async (params) => {
    try {
      dispatch(getTransportServices(params.page));
      const result = await RequestApi.getTransportServices(params);
      dispatch(getTransportServicesSuccess(result));
    } catch (err) {
      dispatch(getTransportServicesFailure(err));
    }
    return null;
  };
  const getMembersUnit = async (params) => {
    try {
      dispatch(getListMemberUnit(params));
      const result = await RequestApi.getDeliveryUser(params);
      dispatch(getListMemberUnitSuccess(result));
    } catch (err) {
      dispatch(getListMemberUnitFailure(err));
    }
    return null;
  };

  const clearMembersUnit = async () => {
    dispatch(getListMemberUnitSuccess([]));
  };

  const uploadFileSignature = async (params, screenAmounts, checkOutResponse) => {
    try {
      const { guid, files } = params;
      const response = await RequestApi.uploadFileDeliverySignature(guid, [files]);
      if (response) {
        DeviceEventEmitter.emit('UpdateListDelivery', 1);
        DeviceEventEmitter.emit('ask_to_check_out', checkOutResponse);
        NavigationService.pop(screenAmounts);
      }
    } catch (err) {
      dispatch(uploadSignatureFailure(err));
    }
  };

  const scanQRParcelReceipt = async (guid) => {
    try {
      dispatch(scanParcelRequest(guid));
      const response = await RequestApi.getDeliveryByGuid(guid);
      dispatch(scanParcelReceiptSuccess(response));
    } catch (err) {
      dispatch(scanParcelReceiptFailure(err));
    }
  };

  const clearParcelReceipt = async () => {
    dispatch(scanParcelReceiptSuccess(null));
  };
  const getAllDeliveries = async (params) => {
    try {
      dispatch(getAllDeliveriesRequest(params));
      const response = await RequestApi.getListDelivery(params);
      dispatch(getAllDeliveriesSuccess(response));
    } catch (err) {
      dispatch(getAllDeliveriesFailure(err));
    }
  };

  const updateDelivery = async (params) => {
    try {
      dispatch(updateDeliveryRequest(params));
      const response = await RequestApi.updateDelivery(params);
      dispatch(updateDeliverySuccess(response));
      return response;
    } catch (err) {
      dispatch(updateDeliveryFailure(err));
    }
    return null;
  };

  const addDelivery = async (params) => {
    try {
      dispatch(addDeliveryRequest(params));
      const response = await RequestApi.createDelivery(params);
      dispatch(addDeliverySuccess(response));
      return response;
    } catch (err) {
      dispatch(addDeliveryFailure(err));
    }
    return null;
  };

  const detailDelivery = async (params) => {
    try {
      dispatch(detailDeliveryRequest(params));
      const response = await RequestApi.getDetailDelivery(params);
      dispatch(detailDeliverySuccess(response));
    } catch (err) {
      dispatch(detailDeliveryFailure(err));
    }
  };

  const getDeliveryTypes = async (params) => {
    try {
      dispatch(getDeliveryTypesRequest(params));
      const response = await RequestApi.getDeliveryTypes(params);
      dispatch(getDeliveryTypesSuccess(response));
    } catch (err) {
      dispatch(getDeliveryTypesFailure(err));
    }
  };

  const getDeliveryStatus = async (params) => {
    try {
      dispatch(getDeliveryStatusRequest(params));
      const response = await RequestApi.getDeliveryStatus(params);
      dispatch(getDeliveryStatusSuccess(response));
    } catch (err) {
      dispatch(getDeliveryStatusFailure(err));
    }
  };

  const getParcelsInUnit = async (unitId) => {
    try {
      const params = {
        page: 1,
        pageSize: 1000,
        unitId,
        statusIds: ParcelStatus.WAITING_TO_RECEIVED,
      };
      dispatch(getParcelsInUnitRequest(params));
      const response = await RequestApi.getListDelivery(params);
      dispatch(getParcelsInUnitSuccess(response.items));
      return response.items;
    } catch (err) {
      dispatch(getParcelsInUnitFailure(err));
    }
    return [];
  };

  return {
    checkOutDelivery,
    delivery,
    getParcelsInUnit,
    uploadFileSignature,
    getListUnit,
    getMembersUnit,
    scanQRParcelReceipt,
    clearParcelReceipt,
    clearMembersUnit,
    checkOutDeliveries,
    getListTransportService,
    getAllDeliveries,
    addDelivery,
    updateDelivery,
    getDeliveryTypes,
    getDeliveryStatus,
    detailDelivery,
  };
};

export default useDelivery;
