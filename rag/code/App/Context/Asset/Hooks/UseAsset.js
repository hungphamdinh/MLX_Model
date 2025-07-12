import { useStateValue, useHandlerAction } from '../../index';
import { RequestApi } from '../../../Services';
import {
  GET_ASSET_DETAIL,
  GET_ASSETS,
  ADD_ASSET,
  EDIT_ASSET,
  GET_COMPANIES,
  GET_ASSET_TYPES,
  GET_ASSET_BY_CODE,
  resetAssetDetailRequest,
  GET_ASSET_TYPES_FILTER,
  SEARCH_ASSETS,
  GET_INSPECTIONS_HISTORY,
} from '../Actions';

const useAsset = () => {
  const [{ asset }, dispatch] = useStateValue();
  const { withLoadingAndErrorHandling, withErrorHandling } = useHandlerAction();

  const getAssets = async (params) => {
    const response = await RequestApi.getAssets(params);
    return response;
  };

  const getAssetByCode = async ({ code, moduleId }) => {
    const response = await RequestApi.requestDetailAssetsByCode(code);
    return {
      ...response,
      moduleId,
    };
  };

  const getAssetDetail = async (id) => {
    const response = await RequestApi.getAssetDetail(id);
    return response;
  };

  const addAsset = async ({ params, files }) => {
    const response = await RequestApi.addAsset(params);
    if (files.length > 0) {
      await RequestApi.requestUploadFileWO(response.documentId, files);
    }
    return response;
  };

  const editAsset = async ({ params, files }) => {
    const response = await RequestApi.updateAsset(params);
    if (files.length > 0) {
      await RequestApi.requestUploadFileWO(response.documentId, files);
    }
    return response;
  };

  const getAssetTypes = async (params) => {
    const response = await RequestApi.getAssetTypes(params);
    return response;
  };

  const getCompanies = async (params) => {
    const response = await RequestApi.filterCompanies(params);
    return response;
  };

  const resetAssetDetail = async () => {
    dispatch(resetAssetDetailRequest());
  };

  const getAssetTypesFilter = async (params) => {
    const response = await RequestApi.getAssetTypes(params);
    return response;
  };

  const searchAssets = async () => RequestApi.searchAssets();

  const getInspectionsHistory = async (params) => RequestApi.getInspectionAsset(params);

  return {
    asset,
    getAssets: withErrorHandling(GET_ASSETS, getAssets),
    getAssetDetail: withLoadingAndErrorHandling(GET_ASSET_DETAIL, getAssetDetail),
    addAsset: withLoadingAndErrorHandling(ADD_ASSET, addAsset),
    editAsset: withLoadingAndErrorHandling(EDIT_ASSET, editAsset),
    getAssetTypes: withErrorHandling(GET_ASSET_TYPES, getAssetTypes),
    getCompanies: withErrorHandling(GET_COMPANIES, getCompanies),
    getAssetByCode: withLoadingAndErrorHandling(GET_ASSET_BY_CODE, getAssetByCode),
    getAssetTypesFilter: withErrorHandling(GET_ASSET_TYPES_FILTER, getAssetTypesFilter),
    searchAssets: withLoadingAndErrorHandling(SEARCH_ASSETS, searchAssets),
    getInspectionsHistory: withLoadingAndErrorHandling(GET_INSPECTIONS_HISTORY, getInspectionsHistory),

    resetAssetDetail,
  };
};

export default useAsset;
