/* eslint-disable no-unused-expressions */
import { DeviceEventEmitter } from 'react-native';
import I18n from '@I18n';
import NavigationService from '@NavigationService';
import { useHandlerAction, useStateValue } from '../../index';
import {
  ADD_VISITOR,
  DEACTIVATE_VISITOR,
  DETAIL_VISITOR,
  EDIT_VISITOR,
  GET_ALL_VISITORS,
  GET_VISITOR_REASONS,
  SCAN_QR_VISITOR,
  TRACKING_VISITOR,
} from '../Actions';
import { RequestApi } from '../../../Services';
import { toast } from '../../../Utils';

const useVisitor = () => {
  const [{ visitor }] = useStateValue();
  const { withLoadingAndErrorHandling, withErrorHandling } = useHandlerAction();

  const scanQRVisitor = async (params) => RequestApi.getDetailVisitor(params);

  const getAllVisitors = async (params) => RequestApi.getListVisitor(params);

  const trackingVisitor = async (params) => {
    const response = await RequestApi.trackingVisitor(params);
    DeviceEventEmitter.emit('UpdateListVisitor');
    return response;
  };

  const detailVisitor = async (params) => RequestApi.getDetailVisitor(params);

  const getVisitorReasons = async (params) => {
    const response = await RequestApi.getVisitorReasons(params);
    return response.items || [];
  };

  const addVisitor = async ({ files, ...params }) => {
    const result = await RequestApi.addVisitor(params);
    await RequestApi.uploadFileVisitor(result.guid, files);
    toast.showSuccess(I18n.t('VS_ADD_SUCCESS'));
    return result;
  };

  const editVisitor = async ({ files, ...params }) => {
    const result = await RequestApi.editVisitor(params);
    await RequestApi.uploadFileVisitor(params.guid, files);
    toast.showSuccess(I18n.t('VS_EDIT_SUCCESS'));
    return result;
  };

  const deactivateVisitor = async (params) => {
    const result = await RequestApi.deactivateVisitor(params);
    toast.showSuccess(I18n.t('VS_DEACTIVATE_SUCCESS'));
    NavigationService.goBack();
    DeviceEventEmitter.emit('UpdateListVisitor');
    return result;
  };

  return {
    visitor,
    scanQRVisitor: withLoadingAndErrorHandling(SCAN_QR_VISITOR, scanQRVisitor),
    getAllVisitors: withLoadingAndErrorHandling(GET_ALL_VISITORS, getAllVisitors),
    getVisitorReasons: withErrorHandling(GET_VISITOR_REASONS, getVisitorReasons),
    detailVisitor: withLoadingAndErrorHandling(DETAIL_VISITOR, detailVisitor),
    trackingVisitor: withLoadingAndErrorHandling(TRACKING_VISITOR, trackingVisitor),
    addVisitor: withLoadingAndErrorHandling(ADD_VISITOR, addVisitor),
    editVisitor: withLoadingAndErrorHandling(EDIT_VISITOR, editVisitor),
    deactivateVisitor: withLoadingAndErrorHandling(DEACTIVATE_VISITOR, deactivateVisitor),
  };
};

export default useVisitor;
