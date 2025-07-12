import { generateAction } from '../../Utils/AppAction';

export const GET_ASSETS = generateAction('asset/GET_ASSETS');
export const GET_ASSET_DETAIL = generateAction('asset/GET_ASSET_DETAIL');
export const ADD_ASSET = generateAction('asset/ADD_ASSET');
export const EDIT_ASSET = generateAction('asset/EDIT_ASSET');
export const GET_ASSET_TYPES = generateAction('asset/GET_ASSET_TYPES');
export const GET_COMPANIES = generateAction('asset/GET_COMPANIES');
export const GET_ASSET_BY_CODE = generateAction('asset/GET_ASSET_BY_CODE');
export const GET_ASSET_TYPES_FILTER = generateAction('asset/GET_ASSET_TYPES_FILTER');
export const SEARCH_ASSETS = generateAction('asset/SEARCH_ASSETS');
export const GET_INSPECTIONS_HISTORY = generateAction('asset/GET_INSPECTIONS_HISTORY');

export const RESET_ASSET_DETAIL = 'asset/RESET_ASSET_DETAIL';

export const resetAssetDetailRequest = () => ({
  type: RESET_ASSET_DETAIL,
});
