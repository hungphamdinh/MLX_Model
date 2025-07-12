import _ from 'lodash';
import {
  ADD_INVENTORY_ALLOCATE_FAILURE,
  ADD_INVENTORY_ALLOCATE_REQUEST,
  ADD_INVENTORY_ALLOCATE_SUCCESS,
  ADD_INVENTORY_STOCK_FAILURE,
  ADD_INVENTORY_STOCK_REQUEST,
  ADD_INVENTORY_STOCK_SUCCESS,
  ADD_INVENTORY_ITEM_REQUEST,
  ADD_INVENTORY_ITEM_FAILURE,
  ADD_INVENTORY_ITEM_SUCCESS,
  EDIT_INVENTORY_ITEM_REQUEST,
  EDIT_INVENTORY_ITEM_SUCCESS,
  EDIT_INVENTORY_ITEM_FAILURE,
  DETAIL_INVENTORY_FAILURE,
  DETAIL_INVENTORY_REQUEST,
  DETAIL_INVENTORY_SUCCESS,
  GET_ALL_INVENTORIES_FAILURE,
  GET_ALL_INVENTORIES_REQUEST,
  GET_ALL_INVENTORIES_SUCCESS,
  GET_INVENTORY_HISTORIES_FAILURE,
  GET_INVENTORY_HISTORIES_REQUEST,
  GET_INVENTORY_HISTORIES_SUCCESS,
  GET_CATEGORIES_REQUEST,
  GET_CATEGORIES_SUCCESS,
  GET_SUB_CATEGORIES_REQUEST,
  GET_SUB_CATEGORIES_SUCCESS,
  GET_LOCATIONS_REQUEST,
  GET_LOCATIONS_SUCCESS,
  GET_WARE_HOUSES_REQUEST,
  GET_WARE_HOUSES_SUCCESS,
  GET_FILTER_CATEGORIES_REQUEST,
  GET_FILTER_CATEGORIES_SUCCESS,
} from './Actions';
import ListModel from '../Model/ListModel';

export const INITIAL_STATE = {
  inventories: new ListModel(),
  histories: new ListModel(),
  categories: new ListModel(),
  locations: new ListModel(),
  inventoryDetail: undefined,
  error: undefined,
  isLoading: false,
  subCategories: [],
  warehouses: new ListModel(),
  filterCategories: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_ALL_INVENTORIES_REQUEST: {
      const { inventories } = state;
      inventories.setPage(action.payload?.page);
      return {
        ...state,
        inventories: _.cloneDeep(inventories),
      };
    }

    case GET_ALL_INVENTORIES_SUCCESS: {
      const { inventories } = state;
      inventories.setData(action.payload);
      return {
        ...state,
        inventories: _.cloneDeep(inventories),
      };
    }

    case GET_ALL_INVENTORIES_FAILURE:
      return {
        ...state,
        error: action.payload,
      };

    case GET_INVENTORY_HISTORIES_REQUEST: {
      const { histories } = state;
      histories.setPage(action.payload?.page);
      return {
        ...state,
        histories: _.cloneDeep(histories),
      };
    }

    case GET_INVENTORY_HISTORIES_SUCCESS: {
      const { histories } = state;
      histories.setData(action.payload);
      return {
        ...state,
        histories: _.cloneDeep(histories),
      };
    }

    case GET_INVENTORY_HISTORIES_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    case DETAIL_INVENTORY_REQUEST: {
      return {
        ...state,
        inventoryDetail: undefined,
        isLoading: true,
      };
    }

    case DETAIL_INVENTORY_SUCCESS: {
      const inventoryDetail = action.payload;
      inventoryDetail.category = {
        ...inventoryDetail.category,
        localParentId: inventoryDetail.category.id,
      };
      return {
        ...state,
        inventoryDetail,
        isLoading: false,
      };
    }

    case DETAIL_INVENTORY_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case ADD_INVENTORY_STOCK_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case ADD_INVENTORY_STOCK_SUCCESS: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case ADD_INVENTORY_STOCK_FAILURE:
      return {
        ...state,
        isLoading: false,
      };

    case ADD_INVENTORY_ALLOCATE_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case ADD_INVENTORY_ALLOCATE_SUCCESS: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case ADD_INVENTORY_ALLOCATE_FAILURE:
      return {
        ...state,
        isLoading: false,
      };

    case ADD_INVENTORY_ITEM_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case ADD_INVENTORY_ITEM_SUCCESS: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case ADD_INVENTORY_ITEM_FAILURE:
      return {
        ...state,
        isLoading: false,
      };

    case EDIT_INVENTORY_ITEM_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case EDIT_INVENTORY_ITEM_SUCCESS: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case EDIT_INVENTORY_ITEM_FAILURE:
      return {
        ...state,
        isLoading: false,
      };

    case GET_CATEGORIES_REQUEST: {
      const { categories } = state;
      categories.setPage(action.payload?.page);
      return {
        ...state,
        categories,
      };
    }

    case GET_CATEGORIES_SUCCESS: {
      let list = action.payload.items;
      const { categories } = state;
      list = list.map((item) => {
        if (item.childs.length > 0) {
          const childs = item.childs.map((child) => {
            child.localParentId = item.id;
            return child;
          });
          return {
            ...item,
            childs,
          };
        }
        return item;
      });

      categories.setData({
        items: list,
        totalCount: action.payload.totalCount,
      });
      return {
        ...state,
        categories: _.cloneDeep(categories),
      };
    }

    case GET_FILTER_CATEGORIES_REQUEST: {
      return {
        ...state,
      };
    }

    case GET_FILTER_CATEGORIES_SUCCESS: {
      return {
        ...state,
        filterCategories: action.payload.items,
      };
    }

    case GET_SUB_CATEGORIES_REQUEST: {
      return {
        subCategories: [],
        ...state,
      };
    }

    case GET_SUB_CATEGORIES_SUCCESS: {
      return {
        ...state,
        subCategories: action.payload,
      };
    }

    case GET_WARE_HOUSES_REQUEST: {
      const { warehouses } = state;
      warehouses.setPage(action.payload?.page);
      return {
        ...state,
        warehouses,
      };
    }

    case GET_WARE_HOUSES_SUCCESS: {
      const { warehouses } = state;
      warehouses.setData(action.payload);
      return {
        ...state,
        warehouses,
      };
    }

    case GET_LOCATIONS_REQUEST: {
      const { locations } = state;
      locations.setPage(action.payload?.page);
      return {
        ...state,
        locations,
      };
    }

    case GET_LOCATIONS_SUCCESS: {
      const { locations } = state;
      locations.setData(action.payload);
      return {
        ...state,
        locations: _.cloneDeep(locations),
      };
    }

    default:
      return state;
  }
};
