import _ from 'lodash';
import { useHandlerAction, useStateValue } from '../../index';
import {
  addPMFailure,
  addPMRequest,
  addPMSuccess,
  detailPMFailure,
  detailPMRequest,
  detailPMSuccess,
  editPMFailure,
  editPMRequest,
  editPMSuccess,
  getPlanTaskFailure,
  getPlanTaskRequest,
  getPlanTaskSuccess,
  getAllPMFailure,
  getAllPMRequest,
  getAllPMSuccess,
  getAssetPlanRequest,
  getAssetPlanFailure,
  getAssetPlanSuccess,
  getSubCategoriesFailure,
  getSubCategoriesRequest,
  getSubCategoriesSuccess,
  getFilterPlanCategoryFailure,
  getFilterPlanCategorySuccess,
  getFilterPlanCategoryRequest,
  getTeamPlansRequest,
  getTeamPlansSuccess,
  getTeamPlansFailure,
  createPMSuccess,
  createPMFailure,
  createPMRequest,
  getCategoriesPlanFailure,
  getCategoriesPlanRequest,
  getCategoriesPlanSuccess,
  getMyPMRequest,
  getMyPMFailure,
  getMyPMSuccess,
  getMyPlanTaskRequest,
  getMyPlanTaskFailure,
  getMyPlanTaskSuccess,
  addTaskFailure,
  addTaskRequest,
  addTaskSuccess,
  editTaskFailure,
  editTaskRequest,
  editTaskSuccess,
  deleteTaskFailure,
  deleteTaskRequest,
  deleteTaskSuccess,
  detailTaskFailure,
  detailTaskRequest,
  detailTaskSuccess,
  getTaskStatusRequest,
  getTaskStatusFailure,
  getTaskStatusSuccess,
  getTasksInPMFailure,
  getTasksInPMRequest,
  getTasksInPMSuccess,
  detailAssetRequest,
  detailAssetSuccess,
  detailAssetFailure,
  getListAssetsRequest,
  getListAssetsSuccess,
  getListAssetsFailure,
  getMyTeamPMFailure,
  getMyTeamPMSuccess,
  getMyTeamPMRequest,
  getPrioritiesRequest,
  getPrioritiesSuccess,
  getPrioritiesFailure,
  updateItemPMRequest,
  updateItemPMSuccess,
  updateItemPMFailure,
  filterListSync,
  resetAssetDetailRequest,
  GET_TASK_PRIORITIES,
} from '../Actions';
import { RequestApi } from '../../../Services';
import { Modules } from '../../../Config/Constants';
import { modal } from '../../../Utils';
import I18n from '../../../I18n';
import { getUserInTeamRequest } from '../../Team/Actions';
import { transformListAsset } from '../../../Transforms/PlanMaintenanceTransformer';

const usePlanMaintenance = () => {
  const [{ planMaintenance }, dispatch] = useStateValue();
  const { withErrorHandling } = useHandlerAction();

  const getAllPM = async (params) => {
    try {
      dispatch(getAllPMRequest(params));
      const response = await RequestApi.getListPlanMaintenance(params);
      dispatch(getAllPMSuccess(response));
    } catch (err) {
      dispatch(getAllPMFailure(err));
    }
  };

  const getMyPM = async (params) => {
    try {
      dispatch(getMyPMRequest(params));
      const response = await RequestApi.getMyPlanMaintenance(params);
      dispatch(getMyPMSuccess(response));
    } catch (err) {
      dispatch(getMyPMFailure(err));
    }
  };

  const getMyTeamPM = async (params) => {
    try {
      dispatch(getMyTeamPMRequest(params));
      const response = await RequestApi.getTeamPlanMaintenance(params);
      dispatch(getMyTeamPMSuccess(response));
    } catch (err) {
      dispatch(getMyTeamPMFailure(err));
    }
  };

  const getPlanTask = async (params) => {
    try {
      dispatch(getPlanTaskRequest(params));
      const response = await RequestApi.requestGetPlanTasks(params);
      dispatch(getPlanTaskSuccess(response));
    } catch (err) {
      dispatch(getPlanTaskFailure(err));
    }
  };

  const getMyPlanTask = async (params) => {
    try {
      params.isOnlyMyTask = true;
      dispatch(getMyPlanTaskRequest(params));
      const response = await RequestApi.requestGetPlanTasks(params);
      dispatch(getMyPlanTaskSuccess(response));
    } catch (err) {
      dispatch(getMyPlanTaskFailure(err));
    }
  };

  const uploadPMFiles = async (documentId, files) => {
    if (documentId && files.length > 0) {
      return RequestApi.uploadFilePM(documentId, files);
    }
    return null;
  };

  const addPM = async (params) => {
    try {
      dispatch(addPMRequest(params));
      const response = await RequestApi.addPlanMaintenance(params);
      dispatch(addPMSuccess(response));
    } catch (err) {
      dispatch(addPMFailure(err));
    }
  };

  const editPM = async (params, files) => {
    try {
      dispatch(
        editPMRequest({
          params,
          files,
        })
      );
      let response = null;
      const documentId = params.isSeries ? params.schedule.documentId : params.documentId;
      if (params.isSeries) {
        params.isSeries = undefined;
        response = await RequestApi.updateSeriesPlanMaintenance(params, []);
      } else {
        response = await RequestApi.updatePlanMaintenanceV1(params, []);
      }

      await uploadPMFiles(documentId, files);

      dispatch(editPMSuccess(response));
      dispatch(getUserInTeamRequest());
      return response;
    } catch (err) {
      dispatch(editPMFailure(err));
    }
    return null;
  };

  const detailPM = async (params) => {
    try {
      dispatch(detailPMRequest(params));
      const response = await RequestApi.getDetailPlan(params);
      response.assets = transformListAsset(response.assets);
      dispatch(detailPMSuccess(response));
      return response;
    } catch (err) {
      dispatch(detailPMFailure(err));
    }
    return null;
  };

  const updateItemPM = async (params) => {
    try {
      dispatch(updateItemPMRequest(params));
      const response = await RequestApi.getDetailPlan(params);
      dispatch(
        updateItemPMSuccess({
          ...params,
          pmDetail: response,
        })
      );
    } catch (err) {
      dispatch(updateItemPMFailure(params));
    }
  };

  const detailAsset = async (code, moduleId) => {
    try {
      dispatch(detailAssetRequest(code));
      const response = await RequestApi.requestDetailAssetsByCode(code);
      dispatch(detailAssetSuccess({ ...response, moduleId }));
      return response;
    } catch (err) {
      dispatch(detailAssetFailure(err));
    }
    return null;
  };

  const getCategoriesPlan = async () => {
    try {
      dispatch(getCategoriesPlanRequest());
      const response = await RequestApi.getCategoriesPlan();
      dispatch(getCategoriesPlanSuccess(response));
    } catch (err) {
      dispatch(getCategoriesPlanFailure(err));
    }
  };

  const getPriorities = async () => {
    try {
      dispatch(getPrioritiesRequest());
      const response = await RequestApi.getPriorities(Modules.PLANMAINTENANCE);
      dispatch(getPrioritiesSuccess(response));
    } catch (err) {
      dispatch(getPrioritiesFailure(err));
    }
  };
  const getTeamPlans = async () => {
    try {
      dispatch(getTeamPlansRequest());
      const response = await RequestApi.getTeamsPlan();
      dispatch(getTeamPlansSuccess(response));
    } catch (err) {
      dispatch(getTeamPlansFailure(err));
    }
  };

  const getFilterPlanCategory = async () => {
    try {
      dispatch(getFilterPlanCategoryRequest());
      const response = await RequestApi.getFilterCategoryPlan();
      dispatch(getFilterPlanCategorySuccess(response));
    } catch (err) {
      dispatch(getFilterPlanCategoryFailure(err));
    }
  };

  const getAssetsPlan = async (params) => {
    try {
      dispatch(getAssetPlanRequest(params));
      const response = await RequestApi.getListPlanMaintenance(params);
      dispatch(getAssetPlanSuccess(response));
    } catch (err) {
      dispatch(getAssetPlanFailure(err));
    }
  };

  const getListAssets = async (params) => {
    try {
      dispatch(getListAssetsRequest(params));
      const response = await RequestApi.getAssetsPlan(params);
      const items = transformListAsset(response.items);
      dispatch(getListAssetsSuccess({ ...response, items }));
    } catch (err) {
      dispatch(getListAssetsFailure(err));
    }
  };

  const createPM = async (params, files) => {
    try {
      dispatch(
        createPMRequest({
          params,
          files,
        })
      );
      const response = params.schedule
        ? await RequestApi.addPlanMaintenancesWithSchedule(params, [])
        : await RequestApi.addPlanMaintenanceV1(params, []);
      const documentId = params.schedule ? _.first(response)?.schedule?.documentId : response.documentId;
      await uploadPMFiles(documentId, files);
      dispatch(createPMSuccess(response));
      dispatch(getUserInTeamRequest());
      return response;
    } catch (err) {
      dispatch(createPMFailure(err));
    }
    return null;
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

  const addTask = async (params) => {
    try {
      dispatch(addTaskRequest({ params }));
      const response = await RequestApi.addTaskPlan(params);
      dispatch(addTaskSuccess(response));
      return response;
    } catch (err) {
      dispatch(addTaskFailure(err));
    }
    return null;
  };

  const editTask = async (params) => {
    try {
      dispatch(editTaskRequest({ params }));
      const response = await RequestApi.requestUpdateTaskPlan(params);
      dispatch(editTaskSuccess(response));
      return response;
    } catch (err) {
      dispatch(editTaskFailure(err));
    }
    return null;
  };

  const detailTask = async (id) => {
    try {
      dispatch(detailTaskRequest(id));
      const response = await RequestApi.getDetailPlanTask(id);
      dispatch(detailTaskSuccess(response));
    } catch (err) {
      dispatch(detailTaskFailure(err));
    }
  };

  const deleteTask = async (id) => {
    try {
      dispatch(deleteTaskRequest(id));
      const response = await RequestApi.removeTaskPlan(id);
      dispatch(deleteTaskSuccess(response));
    } catch (err) {
      dispatch(deleteTaskFailure(err));
    }
  };

  const getTasksInPM = async (pmID) => {
    try {
      dispatch(getTasksInPMRequest(pmID));
      const response = await RequestApi.requestGetTasksByPmId(pmID);
      dispatch(getTasksInPMSuccess(response));
    } catch (err) {
      dispatch(getTasksInPMFailure(err));
    }
  };
  const getTaskStatus = async () => {
    try {
      dispatch(getTaskStatusRequest());
      const response = await RequestApi.getTaskStatus();
      dispatch(getTaskStatusSuccess(response));
    } catch (err) {
      dispatch(getTaskStatusFailure(err));
    }
  };

  const filterInspectionsSync = (payload) => {
    try {
      dispatch(filterListSync(payload));
    } catch (err) {
      modal.showError(I18n.t('SOMETHING_WENT_WRONG'));
    }
  };

  const resetAssetDetail = () => {
    try {
      dispatch(resetAssetDetailRequest());
    } catch (err) {
      modal.showError(I18n.t('SOMETHING_WENT_WRONG'));
    }
  };

  const getTaskPriorities = async () => {
    const response = await RequestApi.getAllPriorities();
    return response;
  };

  return {
    planMaintenance,
    getAllPM,
    getPlanTask,
    addPM,
    editPM,
    detailPM,
    getAssetsPlan,
    getFilterPlanCategory,
    getSubCategories,
    getCategoriesPlan,
    getTeamPlans,
    getMyPM,
    getMyTeamPM,
    getMyPlanTask,
    createPM,
    addTask,
    editTask,
    detailTask,
    deleteTask,
    getTaskStatus,
    getTasksInPM,
    detailAsset,
    getListAssets,
    getPriorities,
    updateItemPM,
    filterInspectionsSync,
    resetAssetDetail,
    getTaskPriorities: withErrorHandling(GET_TASK_PRIORITIES, getTaskPriorities),
  };
};

export default usePlanMaintenance;
