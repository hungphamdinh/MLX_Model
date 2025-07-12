import { useStateValue, useHandlerAction } from '../../index';
import {
  getAreasFailure,
  getAreasRequest,
  getAreasSuccess,
  getSubCategoriesFailure,
  getSubCategoriesRequest,
  getSubCategoriesSuccess,
  getCategoriesFailure,
  getCategoriesRequest,
  getCategoriesSuccess,
  getQuickJRSettingFailure,
  getQuickJRSettingSuccess,
  getQuickJRSettingRequest,
  getListFBSuccess,
  getListFBFailure,
  getListFBRequest,
  getTypesRequest,
  getTypesSuccess,
  getTypesFailure,
  getFeedbackStatusSuccess,
  getFeedbackStatusFailure,
  getFeedbackStatusRequest,
  getSourceRequest,
  getSourceSuccess,
  getSourceFailure,
  detailFBRequest,
  detailFBSuccess,
  detailFBFailure,
  getListQRFeedbackRequest,
  getListQRFeedbackSuccess,
  getLocationsRequest,
  getListQRFeedbackFailure,
  getLocationsSuccess,
  getLocationsFailure,
  detailQRFeedbackRequest,
  detailQRFeedbackFailure,
  detailQRFeedbackSuccess,
  editQrFBRequest,
  editQrFBFailure,
  editQrFBSuccess,
  ADD_FB,
  EDIT_FB,
  GET_FEEDBACK_DIVISION,
  GET_QR_FEEDBACK_SETTING,
} from '../Actions';
import { RequestApi } from '../../../Services';

const useFeedback = () => {
  const [{ feedback }, dispatch] = useStateValue();
  const { withLoadingAndErrorHandling, withErrorHandling } = useHandlerAction();

  const getListFB = async (params) => {
    try {
      dispatch(getListFBRequest(params));
      const response = await RequestApi.getListFB(params);
      dispatch(getListFBSuccess(response));
    } catch (err) {
      dispatch(getListFBFailure(err));
    }
  };

  const getListQRFeedback = async (params) => {
    try {
      dispatch(getListQRFeedbackRequest(params));
      const response = await RequestApi.getListQRFeedback(params);
      dispatch(getListQRFeedbackSuccess(response));
    } catch (err) {
      dispatch(getListQRFeedbackFailure(err));
    }
  };

  const addFB = async ({ params, files }) => {
    const response = await RequestApi.createFeedback(params, []);
    if (response) {
      await RequestApi.uploadFileFeedback({ guid: response.guid, isNewCommentBox: true }, files);
    }
    return response;
  };

  const editFB = async ({ params, files }) => {
    const response = await RequestApi.updateFeedback(params, []);
    if (response) {
      await RequestApi.uploadFileFeedback({ guid: response.guid, isNewCommentBox: false }, files);
    }
    return response;
  };

  const editQrFB = async (params) => {
    try {
      dispatch(editQrFBRequest(params));
      await RequestApi.updateQRFeedback(params);
      dispatch(editQrFBSuccess(true));
      return true;
    } catch (err) {
      dispatch(editQrFBFailure(err));
    }
    return null;
  };

  const detailFB = async (id) => {
    try {
      dispatch(detailFBRequest(id));
      const response = await RequestApi.getDetailFB(id);
      dispatch(detailFBSuccess(response));
    } catch (err) {
      dispatch(detailFBFailure(err));
    }
  };

  const detailQRFeedback = async (id) => {
    try {
      dispatch(detailQRFeedbackRequest(id));
      const response = await RequestApi.getDetailQRFeedback(id);
      dispatch(detailQRFeedbackSuccess(response));
    } catch (err) {
      dispatch(detailQRFeedbackFailure(err));
    }
  };

  const getSources = async (params) => {
    try {
      dispatch(getSourceRequest(params));
      const response = await RequestApi.getFeedbackSources(params);
      dispatch(getSourceSuccess(response));
    } catch (err) {
      dispatch(getSourceFailure(err));
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

  const getCategories = async () => {
    try {
      dispatch(getCategoriesRequest());
      const response = await RequestApi.getFeedbackCategories();
      dispatch(getCategoriesSuccess(response));
    } catch (err) {
      dispatch(getCategoriesFailure(err));
    }
  };

  const getTypes = async () => {
    try {
      dispatch(getTypesRequest());
      const response = await RequestApi.getFeedbackTypes();
      dispatch(getTypesSuccess(response));
    } catch (err) {
      dispatch(getTypesFailure(err));
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

  const addQuickJR = async (params) => {
    try {
      dispatch(addQuickJRRequest(params));
      const response = await RequestApi.requestQuickCreateWorkOrder(params);
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

  const getFeedbackStatus = async () => {
    try {
      dispatch(getFeedbackStatusRequest());
      const response = await RequestApi.getFeedbackStatus();
      dispatch(getFeedbackStatusSuccess(response));
    } catch (err) {
      dispatch(getFeedbackStatusFailure(err));
    }
  };

  const getLocations = async (payload) => {
    try {
      dispatch(getLocationsRequest(payload));
      const response = await RequestApi.getListLocation(payload);
      dispatch(getLocationsSuccess(response));
    } catch (err) {
      dispatch(getLocationsFailure(err));
    }
  };

  const getFeedbackDivision = async () => {
    const response = await RequestApi.getFeedbackDivision();
    return response.items;
  };

  const getQrFeedbackSetting = async () => {
    const response = await RequestApi.getQrFeedbackSetting();
    return response;
  };

  return {
    feedback,
    getListFB,
    detailFB,
    getSources,
    getAreas,
    getCategories,
    getSubCategories,
    addQuickJR,
    getQuickJRSetting,
    getFeedbackStatus,
    getTypes,
    getListQRFeedback,
    getLocations,
    detailQRFeedback,
    editQrFB,
    addFB: withLoadingAndErrorHandling(ADD_FB, addFB),
    editFB: withLoadingAndErrorHandling(EDIT_FB, editFB),
    getFeedbackDivision: withErrorHandling(GET_FEEDBACK_DIVISION, getFeedbackDivision),
    getQrFeedbackSetting: withErrorHandling(GET_QR_FEEDBACK_SETTING, getQrFeedbackSetting),
  };
};

export default useFeedback;
