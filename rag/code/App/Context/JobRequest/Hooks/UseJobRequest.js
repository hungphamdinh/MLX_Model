import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import NavigationService from '@NavigationService';
import { Platform, DeviceEventEmitter } from 'react-native';
import { useHandlerAction, useStateValue } from '../../index';
import {
  detailJRFailure,
  detailJRRequest,
  detailJRSuccess,
  getAllJRFailure,
  getAllJRRequest,
  getAllJRSuccess,
  getAreasFailure,
  getAreasRequest,
  getAreasSuccess,
  getCountStatusFailure,
  getCountStatusRequest,
  getCountStatusSuccess,
  getSubCategoriesFailure,
  getSubCategoriesRequest,
  getSubCategoriesSuccess,
  getGroupCategoriesFailure,
  getGroupCategoriesRequest,
  getGroupCategoriesSuccess,
  getCategoriesFailure,
  getCategoriesRequest,
  getCategoriesSuccess,
  getMyJRRequest,
  getMyJRFailure,
  getMyJRSuccess,
  deleteTaskFailure,
  deleteTaskSuccess,
  deleteTaskRequest,
  detailTaskFailure,
  detailTaskSuccess,
  detailTaskRequest,
  editTaskFailure,
  editTaskSuccess,
  editTaskRequest,
  addQuickJRFailure,
  addQuickJRSuccess,
  addQuickJRRequest,
  addTaskFailure,
  addTaskSuccess,
  addTaskRequest,
  getQuickJRSettingFailure,
  getQuickJRSettingSuccess,
  getQuickJRSettingRequest,
  getMyTasksFailure,
  getMyTasksSuccess,
  getMyTasksRequest,
  getTasksFailure,
  getTasksSuccess,
  getTasksRequest,
  getTaskCountStatusFailure,
  getTaskCountStatusSuccess,
  getTaskCountStatusRequest,
  getTasksInJRFailure,
  getTasksInJRSuccess,
  getTasksInJRRequest,
  getTargetDateTimeSuccess,
  getTargetDateTimeRequest,
  getTargetDateTimeFailure,
  getSLASettingRequest,
  getSLASettingSuccess,
  getSLASettingFailure,
  getFormSigningJRRequest,
  getFormSigningJRSuccess,
  getFormSigningJRFailure,
  setVisibleSigningModalRequest,
  setVisiblePreviewModalRequest,
  uploadFileSignatureFailure,
  uploadFileSignatureSuccess,
  uploadFileSignatureRequest,
  previewReportRequest,
  previewReportSuccess,
  previewReportFailure,
  ADD_JR,
  EDIT_JR,
  GET_JR_SETTING,
  GET_VENDORS,
  clearJrDetailRequest,
  GET_ASSET_JR_HISTORY,
  DETAIL_TASK,
} from '../Actions';
import { RequestApi } from '../../../Services';

import { modal } from '../../../Utils';
import * as file from '../../../Utils/file';

const useJobRequest = () => {
  const [{ jobRequest }, dispatch] = useStateValue();
  const { withLoadingAndErrorHandling, withErrorHandling } = useHandlerAction();

  const setVisibleSigningModal = (params) => {
    dispatch(setVisibleSigningModalRequest(params));
  };

  const setVisiblePreviewModal = (params) => {
    dispatch(setVisiblePreviewModalRequest(params));
  };

  const uploadJRFileSignature = async (files, guid, reloadData) => {
    try {
      dispatch(
        uploadFileSignatureRequest({
          files,
          guid,
        })
      );
      const response = await RequestApi.uploadJRSignature(files, guid);
      if (response) {
        reloadData();
        NavigationService.goBack();
      }
      dispatch(uploadFileSignatureSuccess(response));
    } catch (err) {
      dispatch(uploadFileSignatureFailure(err));
    }
  };

  const getAllJR = async (params) => {
    try {
      dispatch(getAllJRRequest(params));
      const response = await RequestApi.requestGetWorkOrders(params);
      dispatch(getAllJRSuccess(response));
    } catch (err) {
      dispatch(getAllJRFailure(err));
    }
  };

  const getAssetJrHistory = async (params) => RequestApi.getAssetJrHistory(params);

  const viewReport = async (params) => {
    dispatch(previewReportRequest(params));
    try {
      // check local uri first
      const typeOption = params.isSimple ? 'simple' : 'detail';
      const reportType = params.isNUS ? `${typeOption}_NUS` : typeOption;

      const prefixFolder = Platform.OS === 'ios' ? '' : 'file://';
      const parentFolder = `${prefixFolder}${RNFS.DocumentDirectoryPath}/reports`;
      const localFile = `${parentFolder}/${params.id}_${reportType}.pdf`;
      await file.ensureFolder(parentFolder);

      await RequestApi.downloadJRReport(params, localFile);

      // download the pdf file
      dispatch(previewReportSuccess());
      // open pdf viewer
      await FileViewer.open(localFile);

      return localFile;
    } catch (err) {
      dispatch(previewReportFailure(err));
      modal.showError(err.message || I18n.t('ERROR_SOMETHING_WENT_WRONG'));
    }
    return null;
  };

  const getMyJR = async (params) => {
    try {
      dispatch(getMyJRRequest(params));
      const result = await RequestApi.requestGetMyWorkOrders(params);
      dispatch(getMyJRSuccess({ isAssignee: params.isAssignee, result }));
    } catch (err) {
      dispatch(getMyJRFailure(err));
    }
  };

  const addJR = async ({ files, ...params }) => {
    const response = await RequestApi.requestCreateWorkOrder(params);
    if (files.length > 0) {
      await RequestApi.requestUploadFileWO(response.documentId, files);
    }
    return response;
  };

  const editJR = async ({ files, ...params }) => {
    const response = await RequestApi.requestUpdateWorkOrder(params);
    if (files.length > 0) {
      await RequestApi.requestUploadFileWO(params.documentId, files);
    }
    return response;
  };

  const detailJR = async (id) => {
    try {
      dispatch(detailJRRequest(id));
      const response = await RequestApi.requestGetWorkOrderDetail(id);
      dispatch(detailJRSuccess(response));
    } catch (err) {
      dispatch(detailJRFailure(err));
    }
  };

  const getFormSigningJR = async (id) => {
    try {
      dispatch(getFormSigningJRRequest(id));
      const response = await RequestApi.getFormSigningJR(id);
      dispatch(getFormSigningJRSuccess(response));
      NavigationService.navigate('jobRequestFormSigning');
    } catch (err) {
      dispatch(getFormSigningJRFailure(err));
    }
  };

  const getGroupCategories = async (params) => {
    try {
      dispatch(getGroupCategoriesRequest(params));
      const response = await RequestApi.requestGetGroupCategories(params);
      dispatch(getGroupCategoriesSuccess(response));
    } catch (err) {
      dispatch(getGroupCategoriesFailure(err));
    }
  };

  const getCountStatus = async (params) => {
    try {
      dispatch(getCountStatusRequest(params));
      const response = await RequestApi.getJRCountStatus(params);
      dispatch(getCountStatusSuccess(response));
    } catch (err) {
      dispatch(getCountStatusFailure(err));
    }
  };

  const getAreas = async () => {
    try {
      dispatch(getAreasRequest());
      const response = await RequestApi.getAreas();
      dispatch(getAreasSuccess(response));
    } catch (err) {
      dispatch(getAreasFailure(err));
    }
  };

  const getCategories = async (categoryId) => {
    try {
      dispatch(getCategoriesRequest(categoryId));
      const response = await RequestApi.getCategories(categoryId);
      dispatch(getCategoriesSuccess(response));
    } catch (err) {
      dispatch(getCategoriesFailure(err));
    }
  };

  const getTargetDateTime = async (params) => {
    try {
      dispatch(getTargetDateTimeRequest(params));
      const response = await RequestApi.getTargetDateTime(params);
      dispatch(getTargetDateTimeSuccess(response));
      return response;
    } catch (err) {
      dispatch(getTargetDateTimeFailure(err));
      return null;
    }
  };

  const getSLASettings = async () => {
    try {
      dispatch(getSLASettingRequest());
      const response = await RequestApi.getSLASettings();
      dispatch(getSLASettingSuccess(response));
    } catch (err) {
      dispatch(getSLASettingFailure(err));
    }
  };

  const getSubCategories = async (params) => {
    try {
      const { categoryId, areaId } = params;
      dispatch(getSubCategoriesRequest(params));
      const response = await RequestApi.getSubCategories(areaId, categoryId);
      dispatch(getSubCategoriesSuccess(response));
    } catch (err) {
      dispatch(getSubCategoriesFailure(err));
    }
  };

  const getVendors = async (params) => RequestApi.getVendors(params);

  const addQuickJR = async ({ files, ...params }) => {
    try {
      dispatch(addQuickJRRequest(params));
      const response = await RequestApi.requestQuickCreateWorkOrder(params);
      if (files.length > 0) {
        await RequestApi.requestUploadFileWO(response.documentId, files);
      }
      NavigationService.goBack();
      DeviceEventEmitter.emit('UpdateListWorkOrder', 1);
      dispatch(addQuickJRSuccess(response));
      return response;
    } catch (err) {
      dispatch(addQuickJRFailure(err));
    }
    return null;
  };

  const getQuickJRSetting = async (params) => {
    try {
      dispatch(getQuickJRSettingRequest(params));
      const response = await RequestApi.requestWorkOrderSetting(params);
      dispatch(getQuickJRSettingSuccess(response));
    } catch (err) {
      dispatch(getQuickJRSettingFailure(err));
    }
  };

  // tasks

  const addTask = async ({ files, ...params }) => {
    try {
      dispatch(addTaskRequest({ params, files }));
      const response = await RequestApi.requestAddTaskWO(params);
      if (files.length > 0) {
        await RequestApi.requestUploadFileWorkOrderTask(response.documentId, files);
      }
      dispatch(addTaskSuccess(response));
      return response;
    } catch (err) {
      dispatch(addTaskFailure(err));
    }
    return null;
  };

  const editTask = async ({ files, ...params }) => {
    try {
      dispatch(editTaskRequest({ params, files }));
      const response = await RequestApi.requestUpdateTask(params);
      if (files.length > 0) {
        await RequestApi.requestUploadFileWorkOrderTask(params.documentId, files);
      }
      dispatch(editTaskSuccess(response));
      return response;
    } catch (err) {
      dispatch(editTaskFailure(err));
    }
    return null;
  };

  const detailTask = async (id) =>  await RequestApi.requestGetWorkOrderTaskDetail(id);

  const deleteTask = async (id) => {
    try {
      dispatch(deleteTaskRequest(id));
      const response = await RequestApi.requestDeleteTask(id);
      dispatch(deleteTaskSuccess(response));
    } catch (err) {
      dispatch(deleteTaskFailure(err));
    }
  };

  const getTasks = async (params) => {
    try {
      dispatch(getTasksRequest(params));
      const response = await RequestApi.requestGetWorkOrderTasks(params);
      dispatch(getTasksSuccess(response));
    } catch (err) {
      dispatch(getTasksFailure(err));
    }
  };

  const getMyTasks = async (params) => {
    try {
      dispatch(getMyTasksRequest(params));
      const response = await RequestApi.requestGetMyWorkOrderTasks(params);
      dispatch(getMyTasksSuccess(response));
    } catch (err) {
      dispatch(getMyTasksFailure(err));
    }
  };

  const getTaskCountStatus = async () => {
    try {
      dispatch(getTaskCountStatusRequest());
      const response = await RequestApi.getTaskStatus();
      dispatch(getTaskCountStatusSuccess(response));
    } catch (err) {
      dispatch(getTaskCountStatusFailure(err));
    }
  };

  const getTasksInJR = async (jrID) => {
    try {
      dispatch(getTasksInJRRequest());
      const response = await RequestApi.requestGetTasksByWoId(jrID);
      dispatch(getTasksInJRSuccess(response));
    } catch (err) {
      dispatch(getTasksInJRFailure(err));
    }
  };

  const clearJrDetail = () => {
    dispatch(clearJrDetailRequest());
  };

  const initJRConfigs = async () => {
    getGroupCategories();
    getCountStatus();
    getAreas();
    getQuickJRSetting();
    getTaskCountStatus();
  };

  const getJRSetting = async () => RequestApi.getJRSetting();

  return {
    jobRequest,
    getAllJR,
    getMyJR,
    detailJR,
    getCountStatus,
    getGroupCategories,
    getAreas,
    getCategories,
    getSubCategories,
    addQuickJR,
    getQuickJRSetting,
    addTask,
    editTask,
    detailTask,
    deleteTask,
    getTasks,
    getMyTasks,
    getTaskCountStatus,
    getTasksInJR,
    initJRConfigs,
    getTargetDateTime,
    getSLASettings,
    getFormSigningJR,
    setVisibleSigningModal,
    setVisiblePreviewModal,
    uploadJRFileSignature,
    viewReport,
    addJR: withLoadingAndErrorHandling(ADD_JR, addJR),
    editJR: withLoadingAndErrorHandling(EDIT_JR, editJR),
    getJRSetting: withErrorHandling(GET_JR_SETTING, getJRSetting),
    getVendors: withErrorHandling(GET_VENDORS, getVendors),
    clearJrDetail,
    getAssetJrHistory: withErrorHandling(GET_ASSET_JR_HISTORY, getAssetJrHistory),
    detailTask: withLoadingAndErrorHandling(DETAIL_TASK, detailTask),

  };
};

export default useJobRequest;
