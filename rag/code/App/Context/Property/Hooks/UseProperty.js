import { useStateValue } from '../../index';
import {
  createPropertyFailure,
  createPropertyRequest,
  createPropertySuccess,
  deletePropertyFailure,
  deletePropertyRequest,
  deletePropertySuccess,
  getDetailPropertyFailure,
  getDetailPropertyRequest,
  getDetailPropertySuccess,
  getOfflinePropertiesFailure,
  getOfflinePropertiesRequest,
  getOfflinePropertiesSuccess,
  getPropertiesFailure,
  getPropertiesRequest,
  getPropertiesSuccess,
  getPropertyTypesSuccess,
  updatePropertyFailure,
  updatePropertyRequest,
  updatePropertySuccess,
  uploadPropertyPhotoFailure,
  uploadPropertyPhotoRequest,
  uploadPropertyPhotoSuccess,
  getAllPropertyBuildingTypeSuccess,
  getAllPropertyBuildingTypeFailure,
  getAllPropertyBuildingTypeRequest,
  getAllPropertyUnitTypeRequest,
  getAllPropertyUnitTypeSuccess,
  getAllPropertyUnitTypeFailure,
  getTeamPropertiesRequest,
  getTeamPropertiesSuccess,
  getTeamPropertiesFailure,
  getDistrictsRequest,
  getDistrictsSuccess,
  getDistrictsFailure,
  getPropertySettingsRequest,
  getPropertySettingsSuccess,
  getPropertySettingsFailure,
  clearPropertyDetail,
  getPropertiesToSelectRequest,
  getPropertiesToSelectFailure,
  getPropertiesToSelectSuccess
} from '../Actions';
import { RequestApi } from '../../../Services';
import PropertyMgr from '../../../Services/OfflineDB/Mgr/PropertyMgr';
import { NetWork, toast } from '../../../Utils';
import I18n from '../../../I18n';
import SentryService from '../../../Services/SentryService';

const useProperty = () => {
  const [{ property }, dispatch] = useStateValue();

  const getProperties = async (payload) => {
    try {
      dispatch(getPropertiesRequest(payload));
      const response = await NetWork.handleCacheRequest(RequestApi.filterPropertyList, payload);
      dispatch(getPropertiesSuccess(response));
    } catch (err) {
      dispatch(getPropertiesFailure(err));
      SentryService.captureException(err);
    }
  };

  const getPropertiesToSelect = async (payload) => {
    try {
      dispatch(getPropertiesToSelectRequest(payload));
      const response = await NetWork.handleCacheRequest(RequestApi.getPropertyList, payload);
      dispatch(getPropertiesToSelectSuccess(response));
    } catch (err) {
      dispatch(getPropertiesToSelectFailure(err));
      SentryService.captureException(err);
    }
  };

  const getOfflineProperties = async (payload) => {
    try {
      const { page, keyword = '' } = payload;
      dispatch(getOfflinePropertiesRequest(payload));
      const response = await PropertyMgr.getPropertyList(page, keyword);
      // const response = await RequestApi.getPropertyList(page, keyword);
      dispatch(getOfflinePropertiesSuccess(response));
    } catch (err) {
      dispatch(getOfflinePropertiesFailure(err));
      SentryService.captureException(err);
    }
  };

  const getDetailProperty = async (id) => {
    try {
      dispatch(getDetailPropertyRequest(id));
      const response = await NetWork.handleOffline(RequestApi.propertyDetail, PropertyMgr.getPropertyDetail, id);

      dispatch(getDetailPropertySuccess(response));
      return response;
    } catch (err) {
      dispatch(getDetailPropertyFailure(err));
      SentryService.captureException(err);
    }
  };

  const getPropertyTypes = async () => {
    try {
      const response = await NetWork.handleCacheRequest(RequestApi.getAllPropertyType);
      dispatch(getPropertyTypesSuccess(response));
    } catch (err) {
      // dispatch(getPropertyTypesSuccess(err));
    }
  };

  const getAllPropertyBuildingType = async () => {
    try {
      dispatch(getAllPropertyBuildingTypeRequest());
      const response = await NetWork.handleCacheRequest(RequestApi.getAllPropertyBuildingType);
      dispatch(getAllPropertyBuildingTypeSuccess(response));
    } catch (err) {
      dispatch(getAllPropertyBuildingTypeFailure(err));
    }
  };

  const getAllPropertyUnitType = async () => {
    try {
      dispatch(getAllPropertyUnitTypeRequest());
      const response = await NetWork.handleCacheRequest(RequestApi.getAllPropertyUnitType);
      dispatch(getAllPropertyUnitTypeSuccess(response));
    } catch (err) {
      dispatch(getAllPropertyUnitTypeFailure(err));
    }
  };

  const createProperty = async (params) => {
    dispatch(createPropertyRequest(params));
    try {
      const propertyId = await RequestApi.createProperty(params);
      dispatch(createPropertySuccess());
      toast.showSuccess(I18n.t('CREATE_PROPERTY_SUCCESSFULLY'));
      return propertyId;
    } catch (err) {
      dispatch(createPropertyFailure(err));
    }
    return null;
  };

  const updateProperty = async (params) => {
    dispatch(updatePropertyRequest(params));
    try {
      await RequestApi.updateProperty(params);
      dispatch(updatePropertySuccess());
      return true;
    } catch (err) {
      dispatch(updatePropertyFailure(err));
    }
    return false;
  };

  const deleteProperty = async (id) => {
    dispatch(deletePropertyRequest(id));
    try {
      await RequestApi.activeProperty(id, false);
      await RequestApi.deleteProperty(id);
      dispatch(setIsRefreshInspection(true));
      dispatch(deletePropertySuccess());
    } catch (err) {
      dispatch(deletePropertyFailure(err));
    }
  };

  const uploadPropertyPhoto = async (params) => {
    dispatch(uploadPropertyPhotoRequest(params));
    try {
      const { guid, file } = params;
      await RequestApi.uploadFileInspectionProperty(guid, file);
      dispatch(uploadPropertyPhotoSuccess());
    } catch (err) {
      dispatch(uploadPropertyPhotoFailure(err));
    }
  };

  const getTeamProperties = async (payload) => {
    try {
      dispatch(getTeamPropertiesRequest(payload));
      const response = await RequestApi.requestGetInspectionTeams();
      dispatch(getTeamPropertiesSuccess(response));
    } catch (err) {
      dispatch(getTeamPropertiesFailure(err));
      SentryService.captureException(err);
    }
  };

  const getDistricts = async (payload) => {
    try {
      dispatch(getDistrictsRequest(payload));
      const response = await RequestApi.getPropertyDistricts();
      dispatch(getDistrictsSuccess(response));
    } catch (err) {
      dispatch(getDistrictsFailure(err));
      SentryService.captureException(err);
    }
  };

  const getPropertySettings = async (payload) => {
    try {
      dispatch(getPropertySettingsRequest(payload));
      const response = await RequestApi.getPropertySettings();
      dispatch(getPropertySettingsSuccess(response));
    } catch (err) {
      dispatch(getPropertySettingsFailure(err));
      SentryService.captureException(err);
    }
  };

  const clearPropertyDetailData = () => {
    dispatch(clearPropertyDetail());
  };

  return {
    property,
    getProperties,
    getOfflineProperties,
    getPropertyTypes,
    createProperty,
    updateProperty,
    deleteProperty,
    uploadPropertyPhoto,
    getDetailProperty,
    getAllPropertyBuildingType,
    getAllPropertyUnitType,
    getTeamProperties,
    getDistricts,
    getPropertySettings,
    clearPropertyDetailData,
    getPropertiesToSelect,
  };
};

export default useProperty;
