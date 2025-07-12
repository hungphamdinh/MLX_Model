export const GET_ALL_INVENTORIES_REQUEST = 'inventory/GET_ALL_INVENTORIES_REQUEST';
export const GET_ALL_INVENTORIES_SUCCESS = 'inventory/GET_ALL_INVENTORIES_SUCCESS';
export const GET_ALL_INVENTORIES_FAILURE = 'inventory/GET_ALL_INVENTORIES_FAILURE';

export const DETAIL_INVENTORY_REQUEST = 'inventory/DETAIL_INVENTORY_REQUEST';
export const DETAIL_INVENTORY_SUCCESS = 'inventory/DETAIL_INVENTORY_SUCCESS';
export const DETAIL_INVENTORY_FAILURE = 'inventory/DETAIL_INVENTORY_FAILURE';

export const GET_INVENTORY_HISTORIES_REQUEST = 'inventory/GET_INVENTORY_HISTORIES_REQUEST';
export const GET_INVENTORY_HISTORIES_SUCCESS = 'inventory/GET_INVENTORY_HISTORIES_SUCCESS';
export const GET_INVENTORY_HISTORIES_FAILURE = 'inventory/GET_INVENTORY_HISTORIES_FAILURE';

export const ADD_INVENTORY_ALLOCATE_REQUEST = 'inventory/ADD_INVENTORY_ALLOCATE_REQUEST';
export const ADD_INVENTORY_ALLOCATE_SUCCESS = 'inventory/ADD_INVENTORY_ALLOCATE_SUCCESS';
export const ADD_INVENTORY_ALLOCATE_FAILURE = 'inventory/ADD_INVENTORY_ALLOCATE_FAILURE';

export const ADD_INVENTORY_ITEM_REQUEST = 'inventory/ADD_INVENTORY_ITEM_REQUEST';
export const ADD_INVENTORY_ITEM_SUCCESS = 'inventory/ADD_INVENTORY_ITEM_SUCCESS';
export const ADD_INVENTORY_ITEM_FAILURE = 'inventory/ADD_INVENTORY_ITEM_FAILURE';

export const EDIT_INVENTORY_ITEM_REQUEST = 'inventory/EDIT_INVENTORY_ITEM_REQUEST';
export const EDIT_INVENTORY_ITEM_SUCCESS = 'inventory/EDIT_INVENTORY_ITEM_SUCCESS';
export const EDIT_INVENTORY_ITEM_FAILURE = 'inventory/EDIT_INVENTORY_ITEM_FAILURE';

export const ADD_INVENTORY_STOCK_REQUEST = 'inventory/ADD_INVENTORY_STOCK_REQUEST';
export const ADD_INVENTORY_STOCK_SUCCESS = 'inventory/ADD_INVENTORY_STOCK_SUCCESS';
export const ADD_INVENTORY_STOCK_FAILURE = 'inventory/ADD_INVENTORY_STOCK_FAILURE';

export const GET_CATEGORIES_REQUEST = 'inventory/GET_CATEGORIES_REQUEST';
export const GET_CATEGORIES_SUCCESS = 'inventory/GET_CATEGORIES_SUCCESS';
export const GET_CATEGORIES_FAILURE = 'inventory/GET_CATEGORIES_FAILURE';

export const GET_SUB_CATEGORIES_REQUEST = 'inventory/GET_SUB_CATEGORIES_REQUEST';
export const GET_SUB_CATEGORIES_SUCCESS = 'inventory/GET_SUB_CATEGORIES_SUCCESS';
export const GET_SUB_CATEGORIES_FAILURE = 'inventory/GET_SUB_CATEGORIES_FAILURE';

export const GET_LOCATIONS_REQUEST = 'inventory/GET_LOCATIONS_REQUEST';
export const GET_LOCATIONS_SUCCESS = 'inventory/GET_LOCATIONS_SUCCESS';
export const GET_LOCATIONS_FAILURE = 'inventory/GET_LOCATIONS_FAILURE';

export const GET_WARE_HOUSES_REQUEST = 'inventory/GET_WARE_HOUSES_REQUEST';
export const GET_WARE_HOUSES_SUCCESS = 'inventory/GET_WARE_HOUSES_SUCCESS';
export const GET_WARE_HOUSES_FAILURE = 'inventory/GET_WARE_HOUSES_FAILURE';

export const GET_FILTER_CATEGORIES_REQUEST = 'inventory/GET_FILTER_CATEGORIES_REQUEST';
export const GET_FILTER_CATEGORIES_SUCCESS = 'inventory/GET_FILTER_CATEGORIES_SUCCESS';
export const GET_FILTER_CATEGORIES_FAILURE = 'inventory/GET_FILTER_CATEGORIES_FAILURE';

export const getAllInventoriesRequest = (payload) => ({
  type: GET_ALL_INVENTORIES_REQUEST,
  payload,
});

export const getAllInventoriesSuccess = (payload) => ({
  type: GET_ALL_INVENTORIES_SUCCESS,
  payload,
});

export const getAllInventoriesFailure = (payload) => ({
  type: GET_ALL_INVENTORIES_FAILURE,
  payload,
});

export const detailInventoryRequest = (payload) => ({
  type: DETAIL_INVENTORY_REQUEST,
  payload,
});

export const detailInventorySuccess = (payload) => ({
  type: DETAIL_INVENTORY_SUCCESS,
  payload,
});

export const detailInventoryFailure = (payload) => ({
  type: DETAIL_INVENTORY_FAILURE,
  payload,
});

export const getInventoryHistoriesRequest = (payload) => ({
  type: GET_INVENTORY_HISTORIES_REQUEST,
  payload,
});

export const getInventoryHistoriesSuccess = (payload) => ({
  type: GET_INVENTORY_HISTORIES_SUCCESS,
  payload,
});

export const getInventoryHistoriesFailure = (payload) => ({
  type: GET_INVENTORY_HISTORIES_FAILURE,
  payload,
});

export const addInventoryAllocateRequest = (payload) => ({
  type: ADD_INVENTORY_ALLOCATE_REQUEST,
  payload,
});

export const addInventoryAllocateSuccess = (payload) => ({
  type: ADD_INVENTORY_ALLOCATE_SUCCESS,
  payload,
});

export const addInventoryAllocateFailure = (payload) => ({
  type: ADD_INVENTORY_ALLOCATE_FAILURE,
  payload,
});

export const addInventoryStockRequest = (payload) => ({
  type: ADD_INVENTORY_STOCK_REQUEST,
  payload,
});

export const addInventoryStockSuccess = (payload) => ({
  type: ADD_INVENTORY_STOCK_SUCCESS,
  payload,
});

export const addInventoryStockFailure = (payload) => ({
  type: ADD_INVENTORY_STOCK_FAILURE,
  payload,
});

export const addInventoryItemRequest = (params, files) => ({
  type: ADD_INVENTORY_ITEM_REQUEST,
  payload: {
    params,
    files,
  },
});

export const addInventoryItemSuccess = (payload) => ({
  type: ADD_INVENTORY_ITEM_SUCCESS,
  payload,
});

export const addInventoryItemFailure = (payload) => ({
  type: ADD_INVENTORY_ITEM_FAILURE,
  payload,
});

export const getCategoriesRequest = (payload) => ({
  type: GET_CATEGORIES_REQUEST,
  payload,
});

export const getCategoriesSuccess = (payload) => ({
  type: GET_CATEGORIES_SUCCESS,
  payload,
});

export const getCategoriesFailure = (payload) => ({
  type: GET_CATEGORIES_FAILURE,
  payload,
});

export const getSubCategoriesRequest = (payload) => ({
  type: GET_SUB_CATEGORIES_REQUEST,
  payload,
});

export const getSubCategoriesSuccess = (payload) => ({
  type: GET_SUB_CATEGORIES_SUCCESS,
  payload,
});

export const getSubCategoriesFailure = (payload) => ({
  type: GET_SUB_CATEGORIES_FAILURE,
  payload,
});


export const getLocationsRequest = (payload) => ({
  type: GET_LOCATIONS_REQUEST,
  payload,
});

export const getLocationsSuccess = (payload) => ({
  type: GET_LOCATIONS_SUCCESS,
  payload,
});

export const getLocationsFailure = (payload) => ({
  type: GET_LOCATIONS_FAILURE,
  payload,
});

export const editInventoryItemRequest = (params, files) => ({
  type: EDIT_INVENTORY_ITEM_REQUEST,
  payload: {
    params,
    files,
  },
});

export const editInventoryItemSuccess = (payload) => ({
  type: EDIT_INVENTORY_ITEM_SUCCESS,
  payload,
});

export const editInventoryItemFailure = (payload) => ({
  type: EDIT_INVENTORY_ITEM_FAILURE,
  payload,
});

export const getWarehousesRequest = (payload) => ({
  type: GET_WARE_HOUSES_REQUEST,
  payload,
});

export const getWarehousesSuccess = (payload) => ({
  type: GET_WARE_HOUSES_SUCCESS,
  payload,
});

export const getWarehousesFailure = (payload) => ({
  type: GET_WARE_HOUSES_FAILURE,
  payload,
});

export const getFilterCategoriesRequest = (payload) => ({
  type: GET_FILTER_CATEGORIES_REQUEST,
  payload,
});

export const getFilterCategoriesSuccess = (payload) => ({
  type: GET_FILTER_CATEGORIES_SUCCESS,
  payload,
});

export const getFilterCategoriesFailure = (payload) => ({
  type: GET_FILTER_CATEGORIES_FAILURE,
  payload,
});
