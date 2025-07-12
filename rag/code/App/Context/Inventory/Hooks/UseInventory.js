import { useStateValue } from '../../index';
import {
  addInventoryAllocateFailure,
  addInventoryAllocateRequest,
  addInventoryAllocateSuccess,
  addInventoryStockFailure,
  addInventoryStockRequest,
  addInventoryStockSuccess,
  detailInventoryFailure,
  detailInventoryRequest,
  detailInventorySuccess,
  getAllInventoriesFailure,
  getAllInventoriesRequest,
  getAllInventoriesSuccess,
  getInventoryHistoriesFailure,
  getInventoryHistoriesRequest,
  getInventoryHistoriesSuccess,
  getCategoriesRequest,
  getCategoriesSuccess,
  getCategoriesFailure,
  getLocationsRequest,
  getLocationsSuccess,
  getLocationsFailure,
  addInventoryItemRequest,
  addInventoryItemSuccess,
  addInventoryItemFailure,
  editInventoryItemFailure,
  editInventoryItemRequest,
  editInventoryItemSuccess,
  getSubCategoriesRequest,
  getSubCategoriesSuccess,
  getSubCategoriesFailure,
  getWarehousesRequest,
  getWarehousesFailure,
  getWarehousesSuccess,
  getFilterCategoriesRequest,
  getFilterCategoriesSuccess,
  getFilterCategoriesFailure,
} from '../Actions';
import { RequestApi } from '../../../Services';

const useInventory = () => {
  const [{ inventory }, dispatch] = useStateValue();

  const getAllInventories = async (params) => {
    try {
      dispatch(getAllInventoriesRequest(params));
      const response = await RequestApi.getListInventory(params);
      dispatch(getAllInventoriesSuccess(response));
    } catch (err) {
      dispatch(getAllInventoriesFailure(err));
    }
  };

  const addInventoryStock = async (params) => {
    try {
      dispatch(addInventoryStockRequest(params));
      const response = await RequestApi.addInventoryStock(params);
      dispatch(addInventoryStockSuccess(response));
      return response;
    } catch (err) {
      dispatch(addInventoryStockFailure(err));
    }
    return null;
  };

  const addInventoryItem = async ({ params, files }) => {
    try {
      dispatch(addInventoryItemRequest({ params, files }));
      const response = await RequestApi.addInventory(params);
      if (files.images.length > 0) {
        await RequestApi.uploadFileInventory(response.guid, files.images);
      }
      if (files.documents.length > 0) {
        await RequestApi.uploadFileInventory(response.documentId, files.documents);
      }
      dispatch(addInventoryItemSuccess(response));
      return response;
    } catch (err) {
      dispatch(addInventoryItemFailure(err));
    }
    return null;
  };

  const addInventoryAllocate = async (params) => {
    try {
      dispatch(addInventoryAllocateRequest(params));
      const response = await RequestApi.addInventoryAllocate(params);
      dispatch(addInventoryAllocateSuccess(response));
      return response;
    } catch (err) {
      dispatch(addInventoryAllocateFailure(err));
    }
    return null;
  };

  const editInventoryItem = async ({ params, files }) => {
    try {
      dispatch(editInventoryItemRequest({ params, files }));
      const response = await RequestApi.editInventory(params);
      if (files.images && files.images.length > 0) {
        await RequestApi.uploadFileInventory(response.guid, files.images);
      }
      if (files.documents && files.documents.length > 0) {
        await RequestApi.uploadFileInventory(response.documentId, files.documents);
      }
      dispatch(editInventoryItemSuccess(response));
      return response;
    } catch (err) {
      dispatch(editInventoryItemFailure(err));
    }
    return null;
  };

  const detailInventory = async (params) => {
    try {
      dispatch(detailInventoryRequest(params));
      const response = await RequestApi.getInventoryDetail(params);
      dispatch(detailInventorySuccess(response));
    } catch (err) {
      dispatch(detailInventoryFailure(err));
    }
  };

  const getInventoryHistories = async (params) => {
    try {
      dispatch(getInventoryHistoriesRequest(params));
      const response = await RequestApi.getInventoryHistory(params);
      dispatch(getInventoryHistoriesSuccess(response));
    } catch (err) {
      dispatch(getInventoryHistoriesFailure(err));
    }
  };

  const getCategories = async (params) => {
    try {
      dispatch(getCategoriesRequest(params));
      const response = await RequestApi.getInventoryCategories(params);
      dispatch(getCategoriesSuccess(response));
    } catch (err) {
      dispatch(getCategoriesFailure(err));
    }
  };

  const getFilterCategories = async (params) => {
    try {
      dispatch(getFilterCategoriesRequest(params));
      const response = await RequestApi.getInventoryCategories(params);
      dispatch(getFilterCategoriesSuccess(response));
    } catch (err) {
      dispatch(getFilterCategoriesFailure(err));
    }
  };

  const getSubCategories = async (params) => {
    try {
      dispatch(getSubCategoriesRequest(params));
      const response = await RequestApi.getInventoryCategories({
        isParent: false,
        pageSize: 1000,
        page: 1,
        ...params,
      });
      dispatch(getSubCategoriesSuccess(response.items));
    } catch (err) {
      dispatch(getSubCategoriesFailure(err));
    }
  };

  const getLocations = async (params) => {
    try {
      dispatch(getLocationsRequest(params));
      const response = await RequestApi.getInventoryLocations(params);
      dispatch(getLocationsSuccess(response));
    } catch (err) {
      dispatch(getLocationsFailure(err));
    }
  };

  const getWareHouses = async (params) => {
    try {
      dispatch(getWarehousesRequest(params));
      const response = await RequestApi.filterWareHouse(params);
      dispatch(getWarehousesSuccess(response));
    } catch (err) {
      dispatch(getWarehousesFailure(err));
    }
  };

  return {
    inventory,
    getAllInventories,
    addInventoryAllocate,
    addInventoryStock,
    getInventoryHistories,
    detailInventory,
    getCategories,
    getSubCategories,
    getLocations,
    addInventoryItem,
    editInventoryItem,
    getWareHouses,
    getFilterCategories,
  };
};

export default useInventory;
