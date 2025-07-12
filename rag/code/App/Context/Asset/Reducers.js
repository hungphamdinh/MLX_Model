import _ from 'lodash';
import {
  GET_ASSETS,
  GET_ASSET_DETAIL,
  GET_ASSET_TYPES,
  GET_COMPANIES,
  GET_ASSET_BY_CODE,
  RESET_ASSET_DETAIL,
  GET_ASSET_TYPES_FILTER,
  SEARCH_ASSETS,
  GET_INSPECTIONS_HISTORY,
} from './Actions';
import ListModel from '../Model/ListModel';

export const INITIAL_STATE = {
  list: new ListModel(),
  assetDetail: undefined,
  assetTypes: new ListModel(),
  companies: new ListModel(),
  assetTypesFilter: new ListModel(),
  assets: [],
  inspectionsHistory: new ListModel(),
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_ASSETS.REQUEST: {
      const { list } = state;
      list.setPage(action.payload?.page);
      return {
        ...state,
        list: _.cloneDeep(list),
      };
    }

    case GET_ASSETS.SUCCESS: {
      const { list } = state;
      list.setData(action.payload);
      return {
        ...state,
        list: _.cloneDeep(list),
      };
    }

    case GET_ASSET_DETAIL.SUCCESS: {
      return {
        ...state,
        assetDetail: action.payload,
      };
    }

    case GET_ASSET_TYPES.REQUEST: {
      const { assetTypes } = state;
      assetTypes.setPage(action.payload?.page);
      return {
        ...state,
        assetTypes: _.cloneDeep(assetTypes),
      };
    }

    case GET_ASSET_TYPES.SUCCESS: {
      const { assetTypes } = state;
      action.payload.items.forEach((item) => {
        item.name = item.assetTypeName;
      });
      assetTypes.setData(action.payload);
      return {
        ...state,
        assetTypes: _.cloneDeep(assetTypes),
      };
    }

    case GET_COMPANIES.REQUEST: {
      const { companies } = state;
      companies.setPage(action.payload?.page);
      return {
        ...state,
        companies: _.cloneDeep(companies),
      };
    }

    case GET_COMPANIES.SUCCESS: {
      const { companies } = state;
      action.payload.items.forEach((item) => {
        item.name = item.companyName;
      });
      companies.setData(action.payload);
      return {
        ...state,
        companies: _.cloneDeep(companies),
      };
    }

    case GET_ASSET_BY_CODE.SUCCESS: {
      return {
        ...state,
        assetDetail: action.payload,
      };
    }

    case RESET_ASSET_DETAIL: {
      return {
        ...state,
        assetDetail: null,
      };
    }

    case GET_ASSET_TYPES_FILTER.REQUEST: {
      const { assetTypesFilter } = state;
      assetTypesFilter.setPage(action.payload?.page);
      return {
        ...state,
        assetTypesFilter: _.cloneDeep(assetTypesFilter),
      };
    }

    case GET_ASSET_TYPES_FILTER.SUCCESS: {
      const { assetTypesFilter } = state;
      action.payload.items.forEach((item) => {
        item.name = item.assetTypeName;
      });
      assetTypesFilter.setData(action.payload);
      return {
        ...state,
        assetTypesFilter: _.cloneDeep(assetTypesFilter),
      };
    }

    case SEARCH_ASSETS.SUCCESS: {
      return {
        ...state,
        assets: action.payload,
      };
    }

    case GET_INSPECTIONS_HISTORY.SUCCESS: {
      const { inspectionsHistory } = state;
      inspectionsHistory.setData(action.payload);
      return {
        ...state,
        inspectionsHistory: _.cloneDeep(inspectionsHistory),
      };
    }

    default:
      return state;
  }
};
