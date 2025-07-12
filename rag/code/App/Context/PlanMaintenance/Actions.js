import { generateAction } from '../../Utils/AppAction';

export const GET_ALL_PM_REQUEST = 'planMaintenance/GET_ALL_PM_REQUEST';
export const GET_ALL_PM_SUCCESS = 'planMaintenance/GET_ALL_PM_SUCCESS';
export const GET_ALL_PM_FAILURE = 'planMaintenance/GET_ALL_PM_FAILURE';

export const GET_MY_PM_REQUEST = 'planMaintenance/GET_MY_PM_REQUEST';
export const GET_MY_PM_SUCCESS = 'planMaintenance/GET_MY_PM_SUCCESS';
export const GET_MY_PM_FAILURE = 'planMaintenance/GET_MY_PM_FAILURE';

export const GET_MY_TEAM_PM_REQUEST = 'planMaintenance/GET_MY_TEAM_PM_REQUEST';
export const GET_MY_TEAM_PM_SUCCESS = 'planMaintenance/GET_MY_TEAM_PM_SUCCESS';
export const GET_MY_TEAM_PM_FAILURE = 'planMaintenance/GET_MY_TEAM_PM_FAILURE';

export const GET_PLAN_TASK_REQUEST = 'planMaintenance/GET_PLAN_TASK_REQUEST';
export const GET_PLAN_TASK_SUCCESS = 'planMaintenance/GET_PLAN_TASK_SUCCESS';
export const GET_PLAN_TASK_FAILURE = 'planMaintenance/GET_PLAN_TASK_FAILURE';

export const GET_MY_PLAN_TASK_REQUEST = 'planMaintenance/GET_MY_PLAN_TASK_REQUEST';
export const GET_MY_PLAN_TASK_SUCCESS = 'planMaintenance/GET_MY_PLAN_TASK_SUCCESS';
export const GET_MY_PLAN_TASK_FAILURE = 'planMaintenance/GET_MY_PLAN_TASK_FAILURE';

export const ADD_PM_REQUEST = 'planMaintenance/ADD_PM_REQUEST';
export const ADD_PM_SUCCESS = 'planMaintenance/ADD_PM_SUCCESS';
export const ADD_PM_FAILURE = 'planMaintenance/ADD_PM_FAILURE';

export const EDIT_PM_REQUEST = 'planMaintenance/EDIT_PM_REQUEST';
export const EDIT_PM_SUCCESS = 'planMaintenance/EDIT_PM_SUCCESS';
export const EDIT_PM_FAILURE = 'planMaintenance/EDIT_PM_FAILURE';

export const DETAIL_PM_REQUEST = 'planMaintenance/DETAIL_PM_REQUEST';
export const DETAIL_PM_SUCCESS = 'planMaintenance/DETAIL_PM_SUCCESS';
export const DETAIL_PM_FAILURE = 'planMaintenance/DETAIL_PM_FAILURE';

export const UPDATE_ITEM_PM_REQUEST = 'planMaintenance/UPDATE_ITEM_PM_REQUEST';
export const UPDATE_ITEM_PM_SUCCESS = 'planMaintenance/UPDATE_ITEM_PM_SUCCESS';
export const UPDATE_ITEM_PM_FAILURE = 'planMaintenance/UPDATE_ITEM_PM_FAILURE';

export const GET_FILTER_PLAN_CATEGORIES_REQUEST = 'planMaintenance/GET_FILTER_PLAN_CATEGORIES_REQUEST';
export const GET_FILTER_PLAN_CATEGORIES_SUCCESS = 'planMaintenance/GET_FILTER_PLAN_CATEGORIES_SUCCESS';
export const GET_FILTER_PLAN_CATEGORIES_FAILURE = 'planMaintenance/GET_FILTER_PLAN_CATEGORIES_FAILURE';

export const GET_ASSETS_PLAN_REQUEST = 'planMaintenance/GET_ASSETS_PLAN_REQUEST';
export const GET_ASSETS_PLAN_SUCCESS = 'planMaintenance/GET_ASSETS_PLAN_SUCCESS';
export const GET_ASSETS_PLAN_FAILURE = 'planMaintenance/GET_ASSETS_PLAN_FAILURE';

export const GET_LIST_ASSETS_REQUEST = 'planMaintenance/GET_LIST_ASSETS_REQUEST';
export const GET_LIST_ASSETS_SUCCESS = 'planMaintenance/GET_LIST_ASSETS_SUCCESS';
export const GET_LIST_ASSETS_FAILURE = 'planMaintenance/GET_LIST_ASSETS_FAILURE';

export const GET_TEAM_PLANS_REQUEST = 'planMaintenance/GET_TEAM_PLANS_REQUEST';
export const GET_TEAM_PLANS_SUCCESS = 'planMaintenance/GET_TEAM_PLANS_SUCCESS';
export const GET_TEAM_PLANS_FAILURE = 'planMaintenance/GET_TEAM_PLANS_FAILURE';

export const CREATE_PM_REQUEST = 'planMaintenance/CREATE_PM_REQUEST';
export const CREATE_PM_SUCCESS = 'planMaintenance/CREATE_PM_SUCCESS';
export const CREATE_PM_FAILURE = 'planMaintenance/CREATE_PM_FAILURE';

export const GET_CATEGORIES_PLAN_REQUEST = 'planMaintenance/GET_CATEGORIES_PLAN_REQUEST';
export const GET_CATEGORIES_PLAN_SUCCESS = 'planMaintenance/GET_CATEGORIES_PLAN_SUCCESS';
export const GET_CATEGORIES_PLAN_FAILURE = 'planMaintenance/GET_CATEGORIES_PLAN_FAILURE';

export const GET_SUB_CATEGORIES_REQUEST = 'planMaintenance/GET_SUB_CATEGORIES_REQUEST';
export const GET_SUB_CATEGORIES_SUCCESS = 'planMaintenance/GET_SUB_CATEGORIES_SUCCESS';
export const GET_SUB_CATEGORIES_FAILURE = 'planMaintenance/GET_SUB_CATEGORIES_FAILURE';

export const ADD_TASK_REQUEST = 'planMaintenance/ADD_TASK_REQUEST';
export const ADD_TASK_SUCCESS = 'planMaintenance/ADD_TASK_SUCCESS';
export const ADD_TASK_FAILURE = 'planMaintenance/ADD_TASK_FAILURE';

export const EDIT_TASK_REQUEST = 'planMaintenance/EDIT_TASK_REQUEST';
export const EDIT_TASK_SUCCESS = 'planMaintenance/EDIT_TASK_SUCCESS';
export const EDIT_TASK_FAILURE = 'planMaintenance/EDIT_TASK_FAILURE';

export const DETAIL_TASK_REQUEST = 'planMaintenance/DETAIL_TASK_REQUEST';
export const DETAIL_TASK_SUCCESS = 'planMaintenance/DETAIL_TASK_SUCCESS';
export const DETAIL_TASK_FAILURE = 'planMaintenance/DETAIL_TASK_FAILURE';

export const DELETE_TASK_REQUEST = 'planMaintenance/DELETE_TASK_REQUEST';
export const DELETE_TASK_SUCCESS = 'planMaintenance/DELETE_TASK_SUCCESS';
export const DELETE_TASK_FAILURE = 'planMaintenance/DELETE_TASK_FAILURE';

export const GET_TASK_STATUS_REQUEST = 'planMaintenance/GET_TASK_STATUS_REQUEST';
export const GET_TASK_STATUS_SUCCESS = 'planMaintenance/GET_TASK_STATUS_SUCCESS';
export const GET_TASK_STATUS_FAILURE = 'planMaintenance/GET_TASK_STATUS_FAILURE';

export const GET_TASKS_IN_PM_REQUEST = 'planMaintenance/GET_TASKS_IN_PM_REQUEST';
export const GET_TASKS_IN_PM_SUCCESS = 'planMaintenance/GET_TASKS_IN_PM_SUCCESS';
export const GET_TASKS_IN_PM_FAILURE = 'planMaintenance/GET_TASKS_IN_PM_FAILURE';

export const GET_PRIORITIES_REQUEST = 'planMaintenance/GET_PRIORITIES_REQUEST';
export const GET_PRIORITIES_SUCCESS = 'planMaintenance/GET_PRIORITIES_SUCCESS';
export const GET_PRIORITIES_FAILURE = 'planMaintenance/GET_PRIORITIES_FAILURE';

export const GET_ASSET_DETAIL_REQUEST = 'planMaintenance/GET_ASSET_DETAIL_REQUEST';
export const GET_ASSET_DETAIL_SUCCESS = 'planMaintenance/GET_ASSET_DETAIL_SUCCESS';
export const GET_ASSET_DETAIL_FAILURE = 'planMaintenance/GET_ASSET_DETAIL_FAILURE';

export const FILTER_LIST_SYNC = 'planMaintenance/FILTER_LIST_SYNC';
export const SET_PM_USER_ID = 'planMaintenance/SET_PM_USER_ID';

export const RESET_ASSET_DETAIL_REQUEST = 'planMaintenance/RESET_ASSET_DETAIL_REQUEST';

export const GET_TASK_PRIORITIES = generateAction('planMaintenance/GET_TASK_PRIORITIES');

export const setPMUserId = (payload) => ({
  type: SET_PM_USER_ID,
  payload,
});

export const getMyPMRequest = (payload) => ({
  type: GET_MY_PM_REQUEST,
  payload,
});

export const getMyPMSuccess = (payload) => ({
  type: GET_MY_PM_SUCCESS,
  payload,
});

export const getMyPMFailure = (payload) => ({
  type: GET_MY_PM_FAILURE,
  payload,
});

export const getMyTeamPMRequest = (payload) => ({
  type: GET_MY_TEAM_PM_REQUEST,
  payload,
});

export const getMyTeamPMSuccess = (payload) => ({
  type: GET_MY_TEAM_PM_SUCCESS,
  payload,
});

export const getMyTeamPMFailure = (payload) => ({
  type: GET_MY_TEAM_PM_FAILURE,
  payload,
});

export const getAllPMRequest = (payload) => ({
  type: GET_ALL_PM_REQUEST,
  payload,
});

export const getAllPMSuccess = (payload) => ({
  type: GET_ALL_PM_SUCCESS,
  payload,
});

export const getAllPMFailure = (payload) => ({
  type: GET_ALL_PM_FAILURE,
  payload,
});

export const getPlanTaskRequest = (payload) => ({
  type: GET_PLAN_TASK_REQUEST,
  payload,
});

export const getPlanTaskSuccess = (payload) => ({
  type: GET_PLAN_TASK_SUCCESS,
  payload,
});

export const getPlanTaskFailure = (payload) => ({
  type: GET_PLAN_TASK_FAILURE,
  payload,
});

export const getMyPlanTaskRequest = (payload) => ({
  type: GET_MY_PLAN_TASK_REQUEST,
  payload,
});

export const getMyPlanTaskSuccess = (payload) => ({
  type: GET_MY_PLAN_TASK_SUCCESS,
  payload,
});

export const getMyPlanTaskFailure = (payload) => ({
  type: GET_MY_PLAN_TASK_FAILURE,
  payload,
});

export const addPMRequest = (payload) => ({
  type: ADD_PM_REQUEST,
  payload,
});

export const addPMSuccess = (payload) => ({
  type: ADD_PM_SUCCESS,
  payload,
});

export const addPMFailure = (payload) => ({
  type: ADD_PM_FAILURE,
  payload,
});

export const editPMRequest = (payload) => ({
  type: EDIT_PM_REQUEST,
  payload,
});

export const editPMSuccess = (payload) => ({
  type: EDIT_PM_SUCCESS,
  payload,
});

export const editPMFailure = (payload) => ({
  type: EDIT_PM_FAILURE,
  payload,
});

export const detailPMRequest = (payload) => ({
  type: DETAIL_PM_REQUEST,
  payload,
});

export const detailPMSuccess = (payload) => ({
  type: DETAIL_PM_SUCCESS,
  payload,
});

export const detailPMFailure = (payload) => ({
  type: DETAIL_PM_FAILURE,
  payload,
});

export const getFilterPlanCategoryRequest = (payload) => ({
  type: GET_FILTER_PLAN_CATEGORIES_REQUEST,
  payload,
});

export const getFilterPlanCategorySuccess = (payload) => ({
  type: GET_FILTER_PLAN_CATEGORIES_SUCCESS,
  payload,
});

export const getFilterPlanCategoryFailure = (payload) => ({
  type: GET_FILTER_PLAN_CATEGORIES_FAILURE,
  payload,
});

export const getListAssetsRequest = (payload) => ({
  type: GET_LIST_ASSETS_REQUEST,
  payload,
});

export const getListAssetsSuccess = (payload) => ({
  type: GET_LIST_ASSETS_SUCCESS,
  payload,
});

export const getListAssetsFailure = (payload) => ({
  type: GET_LIST_ASSETS_FAILURE,
  payload,
});

export const getAssetPlanRequest = (payload) => ({
  type: GET_ASSETS_PLAN_REQUEST,
  payload,
});

export const getAssetPlanSuccess = (payload) => ({
  type: GET_ASSETS_PLAN_SUCCESS,
  payload,
});

export const getAssetPlanFailure = (payload) => ({
  type: GET_ASSETS_PLAN_FAILURE,
  payload,
});

export const resetAssetDetailRequest = (payload) => ({
  type: RESET_ASSET_DETAIL_REQUEST,
  payload,
});

export const getTeamPlansRequest = (payload) => ({
  type: GET_TEAM_PLANS_REQUEST,
  payload,
});

export const getTeamPlansSuccess = (payload) => ({
  type: GET_TEAM_PLANS_SUCCESS,
  payload,
});

export const getTeamPlansFailure = (payload) => ({
  type: GET_TEAM_PLANS_FAILURE,
  payload,
});

export const createPMRequest = (payload) => ({
  type: CREATE_PM_REQUEST,
  payload,
});

export const createPMSuccess = (payload) => ({
  type: CREATE_PM_SUCCESS,
  payload,
});

export const createPMFailure = (payload) => ({
  type: CREATE_PM_FAILURE,
  payload,
});

export const getCategoriesPlanRequest = (payload) => ({
  type: GET_CATEGORIES_PLAN_REQUEST,
  payload,
});

export const getCategoriesPlanSuccess = (payload) => ({
  type: GET_CATEGORIES_PLAN_SUCCESS,
  payload,
});

export const getCategoriesPlanFailure = (payload) => ({
  type: GET_CATEGORIES_PLAN_FAILURE,
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

// TASKS

export const addTaskRequest = (payload) => ({
  type: ADD_TASK_REQUEST,
  payload,
});

export const addTaskSuccess = (payload) => ({
  type: ADD_TASK_SUCCESS,
  payload,
});

export const addTaskFailure = (payload) => ({
  type: ADD_TASK_FAILURE,
  payload,
});

export const editTaskRequest = (payload) => ({
  type: EDIT_TASK_REQUEST,
  payload,
});

export const editTaskSuccess = (payload) => ({
  type: EDIT_TASK_SUCCESS,
  payload,
});

export const editTaskFailure = (payload) => ({
  type: EDIT_TASK_FAILURE,
  payload,
});

export const detailTaskRequest = (payload) => ({
  type: DETAIL_TASK_REQUEST,
  payload,
});

export const detailTaskSuccess = (payload) => ({
  type: DETAIL_TASK_SUCCESS,
  payload,
});

export const detailTaskFailure = (payload) => ({
  type: DETAIL_TASK_FAILURE,
  payload,
});

export const deleteTaskRequest = (payload) => ({
  type: DELETE_TASK_REQUEST,
  payload,
});

export const deleteTaskSuccess = (payload) => ({
  type: DELETE_TASK_SUCCESS,
  payload,
});

export const deleteTaskFailure = (payload) => ({
  type: DELETE_TASK_FAILURE,
  payload,
});

export const getTaskStatusRequest = (payload) => ({
  type: GET_TASK_STATUS_REQUEST,
  payload,
});

export const getTaskStatusSuccess = (payload) => ({
  type: GET_TASK_STATUS_SUCCESS,
  payload,
});

export const getTaskStatusFailure = (payload) => ({
  type: GET_TASK_STATUS_FAILURE,
  payload,
});

export const getTasksInPMRequest = (payload) => ({
  type: GET_TASKS_IN_PM_REQUEST,
  payload,
});

export const getTasksInPMSuccess = (payload) => ({
  type: GET_TASKS_IN_PM_SUCCESS,
  payload,
});

export const getTasksInPMFailure = (payload) => ({
  type: GET_TASKS_IN_PM_FAILURE,
  payload,
});

export const detailAssetRequest = (payload) => ({
  type: GET_ASSET_DETAIL_REQUEST,
  payload,
});

export const detailAssetSuccess = (payload) => ({
  type: GET_ASSET_DETAIL_SUCCESS,
  payload,
});

export const detailAssetFailure = (payload) => ({
  type: GET_ASSET_DETAIL_FAILURE,
  payload,
});

export const getPrioritiesRequest = (payload) => ({
  type: GET_PRIORITIES_REQUEST,
  payload,
});

export const getPrioritiesSuccess = (payload) => ({
  type: GET_PRIORITIES_SUCCESS,
  payload,
});

export const getPrioritiesFailure = (payload) => ({
  type: GET_PRIORITIES_FAILURE,
  payload,
});

export const updateItemPMRequest = (payload) => ({
  type: UPDATE_ITEM_PM_REQUEST,
  payload,
});

export const updateItemPMSuccess = (payload) => ({
  type: UPDATE_ITEM_PM_SUCCESS,
  payload,
});

export const updateItemPMFailure = (payload) => ({
  type: UPDATE_ITEM_PM_FAILURE,
  payload,
});

export const filterListSync = (payload) => ({
  type: FILTER_LIST_SYNC,
  payload,
});
