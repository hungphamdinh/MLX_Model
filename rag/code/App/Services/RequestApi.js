/* @flow */
import CreateApi from './CreateApi';
import ConvertObjectToQueryString from '../Transforms/ConvertObjectToQueryString';
import APIConfig from '../Config/apiConfig';
import { downLoadFile, postMultipartData, uploadFile } from './FileService';
import configs, { PAGE_SIZE } from '../Config';
// import Config from '../Config';
import { Modules } from '../Config/Constants';

const baseServiceUrl = `${APIConfig.apiCore}/api/services/app`;
const api = CreateApi(APIConfig.apiCore, false, true);
const apiWithError = CreateApi(APIConfig.apiCore, false, false, true);
const apiV2 = CreateApi(baseServiceUrl, false, true);
const apiBookingV2 = CreateApi(`${APIConfig.apiBooking}/api`, false, true);
const apiBooking = CreateApi(APIConfig.apiBooking, false, true);

const weatherApi = CreateApi('https://api.weatherapi.com', false, false, false, { hideErrDialog: true });
const METHOD_PUT = 'PUT';

export default {
  getHeader: (key: string) => api.getHeader(key),
  setHeader: (key: string, value: string) => {
    api.setHeader(key, value);
  },
  setBaseURL: (uri: string) => {
    api.setBaseURL(uri);
  },

  // initData
  requestGetDisableFeatureTenant: () => apiV2.get('/FeatureRollOut/GetDisableFeatureTenant'),

  requestInitData: () => api.get('default/init_data'),
  getLinkedAccount: (params: Object) =>
    api.get(`/api/UserLink/GetLinkedAccount?${ConvertObjectToQueryString(params)}`, true),

  requestModuleHome: () => apiV2.get('/UserSetting/GetEmployeeModuleSetting'),

  switchToUserAccount: (params: Object) =>
    api.get(`/api/UserLink/SwitchToUserAccount?${ConvertObjectToQueryString(params)}`, true),

  linkedAccountAuthenticate: (params: Object) =>
    api.post(`/api/TokenAuth/LinkedAccountAuthenticate?${ConvertObjectToQueryString(params)}`, params),

  logout: () => api.post('/api/TokenAuth/Logout'),

  requestGetProfilePicture: () => apiV2.get('/Profile/GetProfilePicture'),

  UpdateProfilePicture: (params) => apiV2.put('/Profile/UpdateProfilePicture', params),

  requestGetCurrentInformation: () => apiV2.get('/Session/GetCurrentLoginInformations'),
  getAllSettings: () => apiV2.get('/TenantSettings/GetAllSettings'),

  // FB
  getListFB: (params) => apiBookingV2.get(`/commentboxes/filter?${ConvertObjectToQueryString(params)}`),
  getListQRFeedback: (params) => apiV2.get(`/CommentBox/GetCommentBoxes?${ConvertObjectToQueryString(params)}`),
  getDetailFB: (id) => apiBookingV2.get(`/commentboxes/?commentBoxId=${id}`),
  getDetailQRFeedback: (id) => apiV2.get(`/CommentBox/GetCommentBoxDetail?id=${id}`),
  getFeedbackCategories: () => apiBookingV2.get('/commentboxes/categories'),
  getFeedbackTypes: () => apiBookingV2.get('/commentboxes/types?isActive=true'),
  getFeedbackStatus: () => apiBookingV2.get('/commentboxes/status'),
  getFeedbackDivision: () => apiV2.get('/CommentBoxDivision/Filter?isActive=true'),
  getFeedbackSources: () => apiBookingV2.get('/commentboxes/sources'),
  createFeedback: (params, file) => uploadFile(`${APIConfig.apiBooking}/api/commentboxes/admin-create`, file, params),
  updateFeedback: (params, file) => uploadFile(`${APIConfig.apiBooking}/api/commentboxes/admin-update`, file, params),
  updateQRFeedback: (params) => apiV2.put('/CommentBox/UpdateCommentBoxStatus', params),
  getQrFeedbackSetting: () => apiV2.get('/TenantSettings/GetQrFeedbackSettings'),
  uploadFileFeedback: (params, file) =>
    uploadFile(`${APIConfig.apiCore}/api/File/UploadFileComentBoxs?${ConvertObjectToQueryString(params)}`, file),

  // WO
  requestGetWorkOrders: (params: Object) =>
    apiV2.get(`/WorkOrderManagements/GetWorkOrders?${ConvertObjectToQueryString(params)}`),

  requestGetMyWorkOrders: (params: Object) =>
    apiV2.get(`/WorkOrderManagements/GetMyWorkOrders?${ConvertObjectToQueryString(params)}`),

  requestGetWorkOrderDetail: (id) => apiV2.get(`/WorkOrderManagements/GetWorkOrderDetail?id=${id}`),

  getFormSigningJR: (id) => apiV2.post(`/WorkOrderManagements/PrintWorkOrder?id=${id}`),

  requestGetGroupCategories: () => apiV2.get('/WorkOrderCategories/GetGroupCategories'),

  getJRCountStatus: () => apiV2.get('/WorkOrderCategories/GetCountStatus?isActive=true'),

  sendDeliverytoResident: (params: Object) => apiV2.get('/DeliveriesAppServices/SendDeliveryToResident', params),

  requestGetFilterWOCategories: () => apiV2.get('/WorkOrderCategories/GetFilterCategories'),

  requestGetWorkOrderOverview: () => apiV2.get('/WorkOrderManagements/GetWorkOrderOverview'),

  requestLocalSettings: () => apiV2.get('/NotificationSettings/GetLocaleSettings'),

  searchAssets: (params) => apiV2.get(`/AssetManagement/SearchAssets?${ConvertObjectToQueryString(params)}`),
  getJRSetting: () => apiV2.get('/TenantSettings/GetWorkOrderGeneralSettings'),

  getAssetJrHistory: (params) =>
    apiV2.get(`/WorkOrderManagements/GetWorkOrderAsset?${ConvertObjectToQueryString(params)}`),

  downloadJRReport: (params, localFile) =>
    downLoadFile(`${APIConfig.apiCore}/api/File/PrintWorkOrderDetail?${ConvertObjectToQueryString(params)}`, localFile),
  // task

  requestGetTaskOverview: () => apiV2.get('/WorkOrderManagements/GetTaskOverview'),

  requestGetTaskStatus: () => apiV2.get('/WorkOrderCategories/GetTaskCountStatus?isOwner=false'),

  requestGetWorkOrderTasks: (params: Object) =>
    apiV2.get(`/WorkOrderManagements/GetWorkOrderTasks?${ConvertObjectToQueryString(params)}`),
  requestGetMyWorkOrderTasks: (params: Object) =>
    apiV2.get(`/WorkOrderManagements/GetMyWorkOrderTasks?${ConvertObjectToQueryString(params)}`),

  requestGetWorkOrderTaskDetail: (taskId: number) =>
    apiV2.get(`/WorkOrderManagements/GetWorkOrderTaskDetail?id=${taskId}`),

  getListDefect: (id) => apiV2.get(`/WorkOrderManagements/GetListDefect?inspectionId=${id}`),

  requestUploadFileWorkOrderTask(guid, file) {
    return uploadFile(`${APIConfig.apiCore}/api/File/UploadFileWorkOrderTask?guid=${guid}`, file);
  },

  requestUpdateTask: (params: Object) => apiV2.put('/WorkOrderManagements/UpdateTask', params),

  requestGetTeams: (params) =>
    apiV2.get(`/TeamManagements/GetTeams?isActive=true&${ConvertObjectToQueryString(params)}`),

  requestGetAreas: () => apiV2.get('/WorkOrderCategories/GetAreas'),

  requestGetInspectionTeams: () =>
    apiV2.get('/TeamManagements/GetTeams?target=InspectionProperty&isActive=true&isMyTeam=true'),
  getInspectionSetting: () => apiV2.get('/WorkflowInspection/GetInspectionSettings'),
  updateInspectionSetting: (params) => apiV2.put('/WorkflowInspection/UpdateInspectionSettings', params),

  pickUpInspection: (id) => apiV2.post(`/WorkflowInspection/PickInspectionJob?id=${id}&isPick=true`),
  releaseInspection: (id) => apiV2.post(`/WorkflowInspection/PickInspectionJob?id=${id}&isPick=false`),
  getInspectionJobPicked: () => apiV2.get('/WorkflowInspection/GetInspectionJobPicked'),

  getMyReports: (params) =>
    apiV2.get(
      `/ReportHistory/GetSortingReportHistories?moduleId=${Modules.INSPECTION}&${ConvertObjectToQueryString(params)}`
    ),

  // category workOrder
  getAreas: () => apiV2.get('/WorkOrderCategories/GetCategories'),

  getCategories: (categoryId) => apiV2.get(`/WorkOrderCategories/GetSubCategories?categoryId=${categoryId}`),

  getSubCategories: (categoryID, subCategoryId) =>
    apiV2.get(
      `/WorkOrderCategories/GetFurtherSubcategoryBySubCategory?subCategoryId=${subCategoryId}&categoryId=${categoryID}`
    ),

  getVendors: (params) => apiV2.get(`/WorkOrderVendorManagement/GetAll?${ConvertObjectToQueryString(params)}`),

  getListLocation: (params) =>
    apiV2.get(`/CommentBox/GetLocations?pageSize=${PAGE_SIZE}&${ConvertObjectToQueryString(params)}`),

  requestUploadFileWO(guid, file) {
    return uploadFile(`${APIConfig.apiCore}/api/File/UploadFileWorkOrderManagement?guid=${guid}`, file);
  },

  requestUpdateWorkOrder: (params: Object) => apiV2.put('/WorkOrderManagements/UpdateWorkOrder', params),

  requestReopenWorkOrder: (params: Object) => apiV2.put('/WorkOrderManagements/UpdateWorkOrderStatus', params),

  requestGetUsersInTeam: (TeamId) => apiV2.get(`/TeamManagements/GetUsersInTeam?TeamId=${TeamId}`),

  getListObserver: (target) => apiV2.get(`/TeamManagements/GetAllMemberInTeams?isObserver=true&target=${target}`),

  requestGetCategoriesByArea: (areaID) => apiV2.get(`/WorkOrderCategories/GetCategoriesByArea?areaId=${areaID}`),

  requestGetSubCategories: (categoryID: number) =>
    apiV2.get(`/WorkOrderCategories/GetSubCategories?categoryId=${categoryID}`),

  requestDeleteFile: (id: number) => api.delete(`/api/File/DeleteFile?fileId=${id}`),

  requestGetListMemberByKeyword: (params) =>
    apiV2.get(`/UserInfo/GetListMemberByKeyword?${ConvertObjectToQueryString(params)}`),

  getMemberUnitByKeyword: (params) =>
    apiV2.get(`/UserInfo/GetMemberUnitByKeyword?${ConvertObjectToQueryString(params)}`),

  requestGetMemberDetail: (memberID: number) => apiV2.get(`/UserInfo/GetMember?memberId=${memberID}`),

  requestCreateWorkOrder: (params: Object) => apiV2.post('/WorkOrderManagements/CreateWorkOrder', params),

  requestQuickCreateWorkOrder: (params: Object) => apiV2.post('/WorkOrderManagements/QuickCreateWorkOrder', params),

  requestGetTasksByWoId: (woID: number) => apiV2.get(`/WorkOrderManagements/GetListTasks?workOrderId=${woID}`),

  requestAddTaskWO: (params: Object) => apiV2.post('/WorkOrderManagements/AddTask', params),

  requestDeleteTask: (taskId: string) => apiV2.delete(`/WorkOrderManagements/RemoveTask?taskId=${taskId}`),

  requestWorkOrderSetting: () => apiV2.get('/WorkOrderManagements/GetWorkOrderSettings'),

  uploadJRSignature: (files, guid) =>
    uploadFile(`${APIConfig.apiCore}/api/File/UploadFileJobRequestSignature?guid=${guid}`, files),

  // NOTIFICATION
  requestGetNotifications: (params: Object) =>
    apiV2.get(`/Notification/GetUserNotifications?${ConvertObjectToQueryString(params)}`),

  requestSetNotificationAsRead: (id) => apiV2.post('/Notification/SetNotificationAsRead', { id }),

  registerNotification: (params: Object) => apiV2.post('/DevicesAppServices/InsertOrUpdateDevices', params),

  getUserUnreadNotifications: () => apiV2.get('/Notification/GetUserUnreadNotifications'),

  // MAP CHECKIN/CHECKOUT

  checkInLocation: (params: Object) => apiV2.post('/Attendance/CheckIn', params),

  checkOutLocation: (params: Object) => apiV2.post('/Attendance/CheckOut', params),

  getCurrentLocation: () => apiV2.get('/Attendance/GetCurrentLocation'),

  getDistanceArea: () => apiV2.get('/Attendance/GetDistanceArea'),

  getAttendanceLogs: (params: Object) =>
    apiV2.get(`/Attendance/GetAttendanceLogs?${ConvertObjectToQueryString(params)}`),

  getAttendanceTeams: (params: Object) => apiV2.get(`/Attendance/GetTeams?${ConvertObjectToQueryString(params)}`),

  getUsersInTeam: (params: Object) => apiV2.get(`/Attendance/GetUsersInTeam?${ConvertObjectToQueryString(params)}`),

  getAttendanceDetailLogs: (params: Object) =>
    apiV2.get(`/Attendance/GetAttendanceDetailLogs?${ConvertObjectToQueryString(params)}`),

  // DELIVERY

  getListDelivery: (params: Object) => api.get(`/api/DeliveriesAdmin/filters?${ConvertObjectToQueryString(params)}`),

  getDeliveryTypes: () => apiV2.get('/DeliveriesAppServices/GetDeliveryTypes'),

  getDeliveryStatus: () => apiV2.get('/DeliveriesAppServices/GetDeliveryStatus'),

  createDelivery: (params: Object) => apiV2.post('/DeliveriesAppServices/CreateDelivery', params),

  createDeliveries: (params) => api.post('/api/services/app/DeliveriesAppServices/createDeliveries', params, true),

  getDetailDelivery: (params: Object) =>
    apiV2.get(`/DeliveriesAppServices/GetDelivery?${ConvertObjectToQueryString(params)}`),

  updateDelivery: (params: Object) => apiV2.put('/DeliveriesAppServices/UpdateDelivery', params),
  updateDeliveries: (params: Object) => apiV2.put('/DeliveriesAppServices/UpdateDeliveries', params, true),
  uploadFileDeliverySignature(guid, file) {
    return uploadFile(`${APIConfig.apiCore}/api/File/UploadFileDeliverySignature?guid=${guid}`, file);
  },

  requestUploadFileDelivery(guid, file) {
    return uploadFile(`${APIConfig.apiCore}/api/File/UploadFileDelivery?guid=${guid}`, file);
  },

  // PlanMaintenance

  requestGetPlanOverview: () => apiV2.get('/PlanMaintenance/GetPlanMaintenanceOverview'),

  requestUpdateTaskPlan: (params: Object) => apiV2.put('/PlanMaintenance/UpdateTask', params),

  // requestUploadFilePlanTask: ( guid: string, params: Object) => {
  //
  //   return api.post(`/api/File/UploadFilePlanMaintenanceTask?guid=${guid}`, params);
  // },

  requestGetPlanTasks: (params) =>
    apiV2.get(`/PlanMaintenance/GetPlanMaintenanceTasks?${ConvertObjectToQueryString(params)}`),

  getStatusMantenance: () => apiV2.get('/PlanMaintenance/GetCountStatus'),

  getListPlanMaintenance: (params) =>
    apiV2.get(`/PlanMaintenance/GetPlanMaintenance?${ConvertObjectToQueryString(params)}`),

  getMyPlanMaintenance: (params: Object) =>
    apiV2.get(`/PlanMaintenance/GetMyPlanMaintenance?${ConvertObjectToQueryString(params)}`),

  getTeamPlanMaintenance: (params: Object) =>
    apiV2.get(`/PlanMaintenance/GetTeamPlanMaintenance?${ConvertObjectToQueryString(params)}`),

  getDetailPlan: (params: Object) =>
    apiV2.get(`/PlanMaintenance/GetPlanMaintenanceDetail?${ConvertObjectToQueryString(params)}`),

  getAssetsPlan: (params) => apiV2.get(`/AssetManagement/GetAssets?${ConvertObjectToQueryString(params)}`),
  getFileReference: (id) =>
    api.get(`/api/File/GetByReferenceId?fileReferenceId=${id}&sorting=creationTime desc&isPrivate=false`),
  getFileByGuid: (id) => api.get(`/api/File/GetFileByGuid?guid=${id}`),

  getCategoriesPlan: () => apiV2.get('/PlanMaintenance/GetGroupCategories'),

  getTeamsPlan: () => apiV2.get('/TeamManagements/GetTeams?target=PlanMaintenance'),

  getStatusPlan: () => apiV2.get('/PlanMaintenance/GetStatus'),

  addPlanMaintenanceV1: (params, file) =>
    uploadFile(`${APIConfig.apiCore}/api/services/app/PlanMaintenance/AddPlanMaintenanceV1`, file, params),

  updatePlanMaintenanceV1: (params, file) =>
    uploadFile(
      `${APIConfig.apiCore}/api/services/app/PlanMaintenance/UpdatePlanMaintenanceV1`,
      file,
      params,
      METHOD_PUT
    ),

  updateSeriesPlanMaintenance: (params, file) =>
    uploadFile(
      `${APIConfig.apiCore}/api/services/app/PlanMaintenance/UpdatePlanMaintenancesWithSchedule`,
      file,
      params,
      METHOD_PUT
    ),

  addPlanMaintenance: (params: Object) =>
    api.post('/api/services/app/PlanMaintenance/AddPlanMaintenance?', { ...params }),
  addPlanMaintenancesWithSchedule: (params, file) =>
    uploadFile(`${APIConfig.apiCore}/api/services/app/PlanMaintenance/AddPlanMaintenancesWithSchedule`, file, params),

  updatePlanMaintenance: (token: string, lang: string, params: Object, id) =>
    api.put(`/api/services/app/PlanMaintenance/UpdatePlanMaintenance?id=${id}&culture=${lang}`, { ...params }),

  uploadFilePM: (documentId, files) =>
    uploadFile(`${APIConfig.apiCore}/api/File/UploadFilePlanMaintence?guid=${documentId}`, files),

  removePlanMaintenance: (id) => apiV2.delete(`/PlanMaintenance/RemovePlanMaintenance?id=${id}`),

  removePlanMaintenanceWithSchedule: (id) =>
    apiV2.delete(`/PlanMaintenance/RemovePlanMaintenanceWithSchedule?scheduleId=${id}`),

  getFilterCategoryPlan: (token: string, lang: string) =>
    api.get(`/api/services/app/PlanMaintenance/GetFilterCategories?&culture=${lang}`),

  addTaskPlan: (params: Object) => apiV2.post('/PlanMaintenance/AddTask', params),

  requestGetTasksByPmId: (pmID: number) =>
    apiV2.get(`/PlanMaintenance/GetPlanMaintenanceTasks?planMaintenanceId=${pmID}&page=1&pageSize=1000`),

  removeTaskPlan: (taskId: number) => apiV2.delete(`/PlanMaintenance/RemoveTask?taskId=${taskId}`),

  getDetailPlanTask: (taskId: number) => apiV2.get(`/PlanMaintenance/GetPlanMaintenanceTaskDetail?id=${taskId}`),

  getPriorities: (moduleId) => apiV2.get(`/WorkOrderCategories/GetPriorities?moduleId=${moduleId}`),
  requestUploadFilePlanTask(guid, file) {
    return uploadFile(`${APIConfig.apiCore}/api/File/UploadFilePlanMaintenanceTask?guid=${guid}`, file);
  },

  requestUploadFilePlan(guid, file) {
    return uploadFile(`${APIConfig.apiCore}/api/File/UploadFilePlanMaintenance?guid=${guid}`, file);
  },
  getAllPriorities: () => apiV2.get(`/WorkOrderCategories/GetPriorities`),

  // assets

  requestDetailAssetsByCode: (code) => apiV2.get(`/AssetManagement/GetAssetByCodeV1?code=${code}`),

  getTaskStatus: () => apiV2.get('/WorkOrderCategories/GetTaskStatus'),

  // Form
  getFormSettings: () => apiV2.get('/Form/GetFormSettings'),

  getListInspection: (params: Object) => apiV2.get(`/WorkflowInspection/Filter?${ConvertObjectToQueryString(params)}`),

  detailInspection: (params) => apiV2.get(`/WorkflowInspection/Detail?${ConvertObjectToQueryString(params)}`),

  filterInspection: (type: String) => apiV2.get(`/Workflow${type}/GetAll`),

  getWorkflowField: (params: Object) => apiV2.get(`/Workflow/GetWorkflowFields?${ConvertObjectToQueryString(params)}`),

  getSourceInspection: (params: Object) =>
    apiV2.get(`/WorkOrderCategories/GetSource?${ConvertObjectToQueryString(params)}`),

  getNextStatus: (params: Object) => apiV2.get(`/Workflow/GetNextStatus?${ConvertObjectToQueryString(params)}`),

  getListForm: (params: Object) => apiV2.get(`/Form/FilterForm?${ConvertObjectToQueryString(params)}`),

  getPriorityInspection: (params: Object) =>
    apiV2.get(`/WorkflowPriority/GetAll?${ConvertObjectToQueryString(params)}`),

  getTeamsInspection: (params: Object) => apiV2.get(`/Inspection/GetAssignUsers?${ConvertObjectToQueryString(params)}`),

  getAssignUserInspection: (params: Object) =>
    apiV2.get(`/Inspection/GetAssignUsers?${ConvertObjectToQueryString(params)}`),

  getUserAnswerForm: (params: Object) =>
    apiV2.get(`/FormUserAnswer/GetUserAnswerByParentId?${ConvertObjectToQueryString(params)}`),

  getFormDetailInspection: (params: Object) => apiV2.get(`/Form/GetFormDetail?${ConvertObjectToQueryString(params)}`),

  saveDrafUserAnswer: (params: Object) => apiV2.put('/FormUserAnswer/UpdateUserAnswer', params),

  addDrafUserAnswerNew: (params: Object) => apiV2.post('/FormUserAnswer/AddUserAnswer', params),

  submitUserAnswer: (params: Object) => apiV2.put('/FormUserAnswer/UpdateUserAnswer', params),

  updateInspection: (params: Object) => apiV2.put('/WorkflowInspection/Update', params),

  createInspection: (params: Object) => apiV2.post('/WorkflowInspection/Create', params),

  linkInspection: (params) => apiV2.post('/InspectionLinkage/LinkInspection', params),
  executeInspection: (id) => apiV2.post(`/InspectionLinkage/ExecuteInspection?id=${id}`),

  unlinkInspection: (params, moduleId) =>
    apiV2.post(`/InspectionLinkage/UnLinkInspection?${ConvertObjectToQueryString(params)}`, moduleId, true),
  getInspectionLinkageTeams: (params) => apiV2.get('/TeamManagements/GetInspectionLinkageTeams', params),

  createInspectionLinkage: (params) => apiV2.post('/InspectionLinkage/CreateInspectionLinkage', params),

  downloadMyReport: (params, localFile) =>
    downLoadFile(
      `${APIConfig.apiCore}/api/File/GetFileByGuid?${ConvertObjectToQueryString(params)}`,
      localFile,
      null,
      'GET'
    ),

  getListInventory: (params: Object) =>
    apiV2.get(`/InventoryManagement/GetSortingInventories?${ConvertObjectToQueryString(params)}`),

  getInventoryCategories: (params) =>
    apiV2.get(
      `/InventoryCategoryManagement/GetCategories?${ConvertObjectToQueryString(
        params
      )}&isActive=true&pageSize=100&isIncludeParentNotChild=true`
    ),

  getInventoryLocations: (params) =>
    apiV2.get(
      `/InventoryLocationManagement/Filter?${ConvertObjectToQueryString(params)}&isActive=true&pageSize=${PAGE_SIZE}`
    ),

  getInventoryDetail: (params: Object) =>
    apiV2.get(`/InventoryManagement/GetInventoryDetail?${ConvertObjectToQueryString(params)}`),

  addInventoryAllocate: (params: Object) => apiV2.post('/InventoryManagement/AddInventoryStockOut', params),

  addInventory: (params) => apiV2.post('/InventoryManagement/AddInventory', params),

  editInventory: (params) => apiV2.put('/InventoryManagement/UpdateInventory', params),

  addInventoryStock: (params: Object) => apiV2.post('/InventoryManagement/AddInventoryStockIn', params),

  getInventoryHistory: (params: Object) =>
    apiV2.get(`/InventoryManagement/GetInventoryHistories?${ConvertObjectToQueryString(params)}`),

  uploadFileInventory: (guid, file) =>
    uploadFile(`${APIConfig.apiCore}/api/File/UploadFileInventory?guid=${guid}`, file),

  filterWareHouse: (params: Object) =>
    apiV2.get(
      `/InventoryWarehouseManagement/Filter?${ConvertObjectToQueryString(params)}&pageSize=${PAGE_SIZE}&isActive=true`
    ),

  getBrands: (params: Object) =>
    apiV2.get(`/InventoryBrandManagement/GetBrands?${ConvertObjectToQueryString(params)}&pageSize=${PAGE_SIZE}`),

  filterCompanies: (params: Object) =>
    api.get(`/api/Contracts/filter-companies?${ConvertObjectToQueryString(params)}&pageSize=${PAGE_SIZE}`),

  requestUploadFileInventoryStock(guid, file) {
    return uploadFile(`${APIConfig.apiCore}/api/File/UploadFileInventoryStock?guid=${guid}&culture=en`, file);
  },

  requestUploadFileInspection(file) {
    return uploadFile(`${APIConfig.apiCore}/api/File/UploadFile?culture=en`, file);
  },

  // get reportby

  getUserReportBy: (params: Object) =>
    apiV2.get(`/TeamManagements/GetAllMemberInTeams?${ConvertObjectToQueryString(params)}`),

  // get notification setting

  getNotificationSetting: () => apiV2.get('/Notification/GetNotificationUserSettings?isAdmin=true'),

  updateNotificationSetting: (params: Object) =>
    apiV2.put('/Notification/UpdateNotificationUserSettings?isAdmin=true', {
      ...params,
    }),

  // check version
  getSystemVersion: () => apiV2.get('/SystemSettings/GetSystemVersion'),

  requestGetLanguage: () =>
    apiV2.get('/Language/GetClientSourceLanguageTexts?sourceName=MobileSource&sorting=key%20asc'),

  // innovator inspection
  createOnlineInspection: (params) => api.post('api/services/app/WorkflowInspection/Create', params),

  // property
  createProperty: (params) => apiV2.post('/WorkflowInspectionProperty/Create', params),

  updateProperty: (params) => apiV2.put('/WorkflowInspectionProperty/Update', params),

  deleteProperty: (id) => apiV2.delete(`/WorkflowInspectionProperty/Delete?id=${id}`),

  activeProperty: (id, isActive) => apiV2.post(`/WorkflowInspectionProperty/Active?id=${id}&isActive=${isActive}`),

  propertyDetail: (id) => apiV2.get(`/WorkflowInspectionProperty/Detail?id=${id}`),

  getAllPropertyType: () => apiV2.get('/WorkflowInspectionProperty/GetAllPropertyType'),

  getAllPropertyBuildingType: () => apiV2.get('/WorkflowInspectionProperty/GetAllPropertyBuildingType'),

  getAllPropertyUnitType: () => apiV2.get('/WorkflowInspectionProperty/GetAllPropertyUnitType'),

  getPropertyList: (params) =>
    apiV2.get(
      `/WorkflowInspectionProperty/SearchOwner?PageSize=${PAGE_SIZE}&isActive=true&${ConvertObjectToQueryString(
        params
      )}`
    ),

  filterPropertyList: (params) =>
    apiV2.get(
      `/WorkflowInspectionProperty/Filter?PageSize=${PAGE_SIZE}&isActive=true&${ConvertObjectToQueryString(params)}`
    ),

  getAllMemberInTeams: () => apiV2.get('/TeamManagements/GetAllMemberInTeams'),

  filterMemberInTeams: (params) =>
    apiV2.get(`/TeamManagements/FilterMemberInTeams?pageSize=${PAGE_SIZE}&${ConvertObjectToQueryString(params)}`),

  uploadFileInspectionProperty: (guid, file) =>
    uploadFile(`${APIConfig.apiCore}/api/File/UploadFileInspectionProperty?guid=${guid}`, file),

  getPropertyDistricts: () => apiV2.get('/DistrictAppServices/GetList'),
  getPropertySettings: () => apiV2.get('/WorkflowInspectionProperty/GetSettings'),

  // question
  addQuestion: (params, isCopy = false) => apiV2.post(`/FormQuestion/AddQuestion?isCopy=${isCopy}`, params),

  updateQuestion: (params) => apiV2.put('/FormQuestion/UpdateQuestion', params),

  deleteQuestion: (id) => apiV2.delete(`/FormQuestion/Delete?questionId=${id}`),

  moveQuestion: (params) => apiV2.post('/FormQuestion/MoveQuestion', params),

  copyQuestion: (params) => apiV2.post('/FormQuestion/CopyQuestion', params),

  getAllFormQuestionAnswerTemplate: () => apiV2.get('/FormQuestion/GetAllFormQuestionAnswerTemplate'),

  getInspectionByLinkModule: (params) =>
    apiV2.get(`/WorkflowInspection/FilterByLinkModule?pageSize=${PAGE_SIZE}&${ConvertObjectToQueryString(params)}`),

  // formPage
  addFormPageGroup: (params) => apiV2.post('/FormPageGroup/AddFromMobile', params, true),
  updateFormPageGroup: (formId, params) =>
    apiV2.put(`/FormPageGroup/UpdateFormPageGroup?formId=${formId}`, params, true),

  getFormPageGroup: (formId) => apiV2.get(`FormPageGroup/GetFormPageGroupByFormId?formId=${formId}`),

  addFormPage: (params) => apiV2.post('/FormPage/AddFormPage', params),

  updateFormPage: (params) => apiV2.put('/FormPage/UpdateTitle', params),

  moveFormPage: (params) => apiV2.post('/FormPage/Move', params),

  copyFormPage: (params) => apiV2.post('/FormPage/Copy', params),

  publicFormPage: (params) => apiV2.post('/FormPage/Public', params),

  unPublicFormPage: (params) => apiV2.post('/FormPage/UnPublic', params),

  deleteFormPage: (id) => apiV2.delete(`/FormPage/Delete?formPageId=${id}`),

  getDefineSections: () => apiV2.get('/FormPage/GetDefine'),

  getDetailSection: (id) => apiV2.get(`/FormPage/detail?formPageId=${id}`),

  updateFormQuestionTypeCategory: (params) =>
    apiV2.put(
      `FormPage/UpdateFormQuestionTypeCategory?id=${params.id}&&formQuestionTypeCategoryId=${params.formQuestionTypeCategoryId}`,
      {}
    ),

  // form

  addForm: (params) => apiV2.post('/Form/AddForm', params),

  updateForm: (params) => apiV2.put('/Form/UpdateTitle', params),

  copyForm: (params) => apiV2.post('/Form/Copy', params),

  publicForm: (id) => apiV2.post(`/Form/Public?formId=${id}`),

  unPublicForm: (id) => apiV2.post(`/Form/UnPublic?formId=${id}`),

  sortForm: (params) => apiV2.post('/Form/Sort', params),

  deleteForm: (id) => apiV2.delete(`/Form/Delete?formId=${id}`),

  getFormDetail: (id) => apiV2.get(`/Form/GetFormDetail?formId=${id}`),

  getFormDetailForResponse: (id) => apiV2.get(`/Form/GetFormDetail4Response?formId=${id}`),

  getFormDetailAfterDate: (params) => apiV2.get(`/Form/GetFormDetailAfterDate?${ConvertObjectToQueryString(params)}`),

  getFormList: (page, keyword) => apiV2.get(`/Form/FilterForm?keyword=${keyword}&PageSize=${PAGE_SIZE}&Page=${page}`),

  setFormToNonEdit: (id) => apiV2.post(`/Form/SetFormToNonEdit?id=${id}`),

  getFormChanges: (params) =>
    apiV2.get(`/Form/FormChanges?${ConvertObjectToQueryString(params)}&pageSize=${PAGE_SIZE}`),

  // categories
  getFormCategories: () => apiV2.get('/FormCategory/GetAll?pageSize=1000&page=1'),

  // global form
  cloneFromGlobal: (params) => apiV2.post('/Form/CloneFromGlobal', params),
  cloneHiddenForm: (params) => apiV2.post('/Form/CloneHiddenForm', params),

  publishToGlobal: (id, isPublish) => apiV2.post(`/Form/PublishToGlobal?formId=${id}&isPublish=${isPublish}`),

  publishToLeader: (id, isPublish) => apiV2.post(`/Form/PublishToLeader?formId=${id}&isPublish=${isPublish}`),

  publishToTeam: (params) => apiV2.post('/Form/PublishToTeam', params),
  unPublishToTeam: (params) => apiV2.post('/Form/UnPublishToTeam', params),

  filterGlobalForm: (params) =>
    apiV2.get(
      `/Form/FilterGlobalForm?PageSize=${PAGE_SIZE}&${ConvertObjectToQueryString(params)}&moduleId=${
        Modules.INSPECTION
      }`
    ),
  // team

  filterMyForm: (params) =>
    apiV2.get(
      `/Form/FilterMyForm?pageSize=${PAGE_SIZE}&moduleId=${Modules.INSPECTION}&${ConvertObjectToQueryString(params)}`
    ),
  filterTeamFormPublished: (params) =>
    apiV2.get(
      `/Form/FilterTeamFormPublished?pageSize=${PAGE_SIZE}&moduleId=${Modules.INSPECTION}&${ConvertObjectToQueryString(
        params
      )}`
    ),
  filterFormByLinkModule: (params) =>
    apiV2.get(
      `/Form/FilterFormByLinkModule?&pageSize=${PAGE_SIZE}&moduleId=${Modules.INSPECTION}&${ConvertObjectToQueryString(
        params
      )}`
    ),

  filterTeamForm: (params) =>
    apiV2.get(
      `/Form/FilterTeamFormV1?&pageSize=${PAGE_SIZE}&moduleId=${Modules.INSPECTION}&${ConvertObjectToQueryString(
        params
      )}`
    ),

  // setting
  getFormSetting: () => apiV2.get('/Form/GetFormSetting'),

  getPullChanges: (lastPulledAt) =>
    apiV2.get(`/SynchronizationInspection/PullChanges?lastPulledAt=${lastPulledAt || ''}`),

  pushChanges: (payload) =>
    postMultipartData(`${APIConfig.apiCore}/api/services/app/SynchronizationInspection/PushChangesMultipart`, payload),

  pullChangesV1: (payload) =>
    postMultipartData(`${APIConfig.apiCore}/api/services/app/SynchronizationInspection/PullChangesMultipart`, payload),

  uploadFiles: (referenceId, files) =>
    uploadFile(`${APIConfig.apiCore}/api/File/UploadFile?referenceId=${referenceId}&hasThumbnail=true`, files),

  uploadInspectionDocument: (referenceId, files) =>
    uploadFile(`${APIConfig.apiCore}/api/File/UploadFileInspectionAttachFile?referenceId=${referenceId}`, files),

  uploadFileFormQuestionAnswers: (referenceId, files) =>
    uploadFile(
      `${APIConfig.apiCore}/api/Form/UploadFileFormQuestionAnswers?referenceId=${referenceId}&hasThumbnail=true`,
      files
    ),

  getByReferenceIdAndModuleNames: (referenceId, moduleName) => {
    let url = `/api/File/getByReferenceIdAndModuleNames?referenceId=${referenceId}`;
    if (moduleName) {
      url += `&moduleNames=${moduleName}`;
    }
    return api.get(url);
  },

  uploadFileInspectionSignatures: (files, referenceId) =>
    uploadFile(`${APIConfig.apiCore}/api/File/UploadFileInspectionSignature?referenceId=${referenceId}`, files),

  uploadFileInspectionSignaturesV2: (files, params) =>
    uploadFile(
      `${APIConfig.apiCore}/api/File/SaveUploadFileInspectionSignature?${ConvertObjectToQueryString(params)}`,
      files
    ),

  downloadInspectionReport: (inspectionId, localFile) =>
    downLoadFile(
      `${APIConfig.apiCore}/api/WorkflowInspection/ExportDefaultWorkflowInspection?inspectionId=${inspectionId}`,
      localFile
    ),

  // surve
  filterSurvey: (params) => apiV2.get(`/Survey/FilterSurvey?${ConvertObjectToQueryString(params)}`),

  getSurveyDetail: (id) => apiV2.get(`/Survey/GetDetail?id=${id}`),

  filterFormQuestionSummary: (params) =>
    apiV2.get(`/FormQuestion/FitlerFormQuestionSummary?${ConvertObjectToQueryString(params)}`),

  filterSurveyUsers: (params) => apiV2.get(`/Survey/FilterSurveyUsers?${ConvertObjectToQueryString(params)}`),
  filterSurveyUnits: (params) => apiV2.get(`/Survey/FilterSurveyUnits?${ConvertObjectToQueryString(params)}`),

  getListCatType: (params) => apiV2.get(`/Units/GetListCatType?${ConvertObjectToQueryString(params)}`),

  getBuildings: () => api.get('/api/units/Buildings'),

  filterSurveyResponse: (params) => apiV2.get(`/Survey/FilterSurveyResponse?${ConvertObjectToQueryString(params)}`),

  getUserAnswer: (id) => apiV2.get(`/FormUserAnswer/GetUserAnswer?id=${id}`),

  getUserAnswerByParentId: (params) =>
    apiV2.get(`/FormUserAnswer/GetUserAnswerByParentId?${ConvertObjectToQueryString(params)}`),

  getInspectionsOnline: (params) =>
    apiV2.get(
      `/WorkflowInspection/Filter?pageSize=${PAGE_SIZE}&inclueArchived=false&${ConvertObjectToQueryString(params)}`
    ),

  deleteInspection: (id) => apiV2.delete(`WorkflowInspection/Delete?id=${id}`),
  getInspectionAuditLog: (id) => apiV2.get(`/Workflow/GetAuditLogs?id=${id}`),

  reopenFormUserAnswer: (params) => apiV2.post('/FormUserAnswer/Reopen', params),

  updateSurveyTitle: (params) => apiV2.put('/Survey/UpdateTitle', params),

  addSurvey: (params) => apiV2.post('/Survey/AddSurvey', params),

  publicSurvey: (params) => apiV2.post('/Survey/Public', params),

  uploadSurveySignature: (files, referenceId) =>
    uploadFile(`${APIConfig.apiCore}/api/File/UploadFileSurveySignature?referenceId=${referenceId}`, files),

  addUserAnswer: (params) => apiV2.post('/FormUserAnswer/AddUserAnswer', params),

  updateUserAnswer: (params) => apiV2.put('/FormUserAnswer/UpdateUserAnswer', params),

  requestUpdateInspection: (params) => apiV2.put('/WorkflowInspection/Update', params),
  getListUnitsV1: (params) => apiV2.get(`/Units/GetListUnitsV1?${ConvertObjectToQueryString(params)}`),

  getEmailMemberV1: (params) => apiV2.post('/Units/GetEmailMemberV1', params),

  getListEmployees: (params) =>
    apiV2.get(`/UserInfo/getListEmployees?filterStatusId=2&page=1&pageSize=1000&${ConvertObjectToQueryString(params)}`),

  getSimpleEmployees: (params) =>
    apiV2.get(
      `/UserInfo/GetListSimpleEmployees?filterStatusId=2&page=1&pageSize=1000&${ConvertObjectToQueryString(
        params
      )}&isIncludeProvider=true`
    ),

  getListEmployeesByTenant: (params) =>
    apiV2.get(
      `/UserInfo/GetListEmployeesByTenants?filterStatusId=2&page=1&pageSize=1000&${ConvertObjectToQueryString(params)}`
    ),

  getSimpleCompanies: (params) =>
    apiV2.get(`/Contracts/GetSimpleCompanies?pageSize=${PAGE_SIZE}&${ConvertObjectToQueryString(params)}`),
  // Meter Reading
  getMeteDeviceByCode: (serialCode) => apiV2.get(`/MeterReadingManagement/GetMeterDeviceByCode?code=${serialCode}`),
  getMeterDevices: (page, params) =>
    apiV2.get(
      `/MeterReadingManagement/GetMeterDevices?${ConvertObjectToQueryString(params)}&pageSize=1000&page=${page}`
    ),
  getMeterReadingHistories: (meterReadingId) =>
    apiV2.get(`/MeterReadingManagement/GetMeterReadingHistories?meterReadingId=${meterReadingId}`),
  getMeterReadingCurrentMonth: (meterReadingId) =>
    apiV2.get(`/MeterReadingManagement/getMeterReadingCurrentMonth?meterReadingId=${meterReadingId}`),
  getMeterTypes: () => apiV2.get('/MeterReadingManagement/GetMeterTypes?isActive=true&pageSize=1000&page=1'),
  getMeterReadings: (params) =>
    apiV2.get(
      `/MeterReadingManagement/GetSortingMeterReadings?pageSize=${PAGE_SIZE}&sorting=id desc&${ConvertObjectToQueryString(
        params,
        true,
        true
      )}`
    ),
  getMeterSetting: () => apiV2.get('/MeterReadingManagement/GetMeterSetting'),

  createMeterReading: (params, file) =>
    uploadFile(`${APIConfig.apiCore}/api/services/app/MeterReadingManagement/AddMeterReading`, file, params),
  getMeterDeviceRelationship: (id) => apiV2.get(`/MeterReadingManagement/GetMeterDeviceRelationship?id=${id}`),
  getListSimpleUnits: (params) =>
    apiV2.get(`/Units/GetListSimpleUnits?page=1&pageSize=1000&${ConvertObjectToQueryString(params)}`),
  // fee
  checkFeeReceipt: (code) => apiV2.post(`/FeesAppServices/ValidateReceipt?code=${code}`),
  checkFeeCashAdvanceReceipt: (code) => apiV2.post(`/CashAdvance/ValidateCashAdvanceReceipt?code=${code}`),

  // MFA
  getEmailRegexSettings: () => apiV2.get('/TenantSettings/GetRegexEmailSettings'),
  getSecuritySetting: () => apiV2.get('/TenantSettings/GetSecuritySettingsForMobile'),

  getMfaUserSetting: (email) => apiV2.get(`/TenantSettings/GetMfaUserSettings?emailAddress=${email}`),

  getCurrentWeather: (lat, lon) =>
    weatherApi.getWithOutToken(`/v1/forecast.json?q=${lat},${lon}&days=3&key=${configs.weatherAPIKey}`),

  getTenantAddress: () => apiV2.get('/UserSetting/GetTenantAddress'),

  uploadProfilePicture: (file) => uploadFile(`${APIConfig.apiCore}/Profile/UploadProfilePicture`, file),

  getDashboardMobile: () => apiV2.get('/Dashboard/GetDashboardMobile'),

  getPasswordComplexitySetting: () => apiV2.get('/Profile/GetPasswordComplexitySetting'),
  // sla
  getTargetDateTime: (params) =>
    apiV2.get(`/SettingEscalation/GetTargetDateTime?${ConvertObjectToQueryString(params)}`),
  getSLASettings: () => apiV2.get('/TenantSettings/GetSLASettings'),

  getListUnitsV2: (params) =>
    apiV2.get(`/Units/GetListUnitsV2?pageSize=${PAGE_SIZE}&${ConvertObjectToQueryString(params)}`),

  getTransportServices: (params) =>
    apiV2.get(
      `/DeliveriesAppServices/GetTransportServices?pageSize=${PAGE_SIZE}&${ConvertObjectToQueryString(params)}`
    ),

  getListMemberUnit: (params) =>
    apiV2.get(`/UserInfo/GetListMember?pageSize=${PAGE_SIZE}&${ConvertObjectToQueryString(params)}`),

  getDeliveryUser: (params) =>
    apiV2.get(`/DeliveriesAppServices/GetDeliveryUsers?page=1&pageSize=1000&${ConvertObjectToQueryString(params)}`),

  getDeliveryByGuid: (guid) => apiV2.get(`/DeliveriesAppServices/GetDeliveryByGuid?guidId=${guid}`),

  // visitor
  getListVisitor: (params) =>
    apiBooking.get(`/api/visitors/sorting?pageSize=${PAGE_SIZE}&${ConvertObjectToQueryString(params)}`),
  getDetailVisitor: (params) => apiBooking.get(`/api/visitors?${ConvertObjectToQueryString(params)}`),
  editVisitor: (params) => apiBooking.put('/api/visitors/', params),
  addVisitor: (params) => apiBooking.post('/api/visitors/', params),
  trackingVisitor: (params) => apiBooking.post('/api/visitors/tracking', params),
  getVisitorReasons: (params) => apiBooking.get('/api/visitors/reasons', params),
  createFeedback: (params, file) => uploadFile(`${APIConfig.apiBooking}/api/commentboxes/admin-create`, file, params),
  uploadFileVisitor: (guid, file) => uploadFile(`${APIConfig.apiCore}/api/File/UploadFileVisitor?guid=${guid}`, file),
  deactivateVisitor: (params) => apiBooking.put('/api/visitors/Deactivate', params),

  // workflow
  getWorkflowStatus: (moduleId) => apiV2.get(`/WorkflowStatus/GetAll?moduleId=${moduleId}`),
  getWorkflowPriorities: (moduleId) => apiV2.get(`/WorkflowPriority/GetAll?moduleId=${moduleId}`),
  getWorkflowTrackers: (moduleId) => apiV2.get(`/WorkflowTracker/GetAll?moduleId=${moduleId}`),
  getWorkflowFields: (moduleId) => apiV2.get(`/Workflow/GetWorkflowFields?moduleId=${moduleId}`),

  getInspectionHeaders: () => apiV2.get('/WorkflowInspection/GetInspectionHeaders'),
  getInspectionFooters: () => apiV2.get('/WorkflowInspection/GetInspectionFooters?page=1&pageSize=1000'),
  getQuestionTypes: (moduleId) => apiV2.get(`/FormQuestion/GetQuestionTypes?moduleId=${moduleId}`),
  getQuestionTypeCategories: () => apiV2.get('/FormQuestion/GetQuestionTypeCategories'),
  getUserPickedByJob: (params) =>
    apiV2.get(`/WorkflowInspection/AreJobPickedByUsers?${ConvertObjectToQueryString(params)}`),
  getQuestionProjectType: () => apiV2.get('/FormQuestion/GetQuestionProjectType'),
  getBiometricTermConditions: () => apiV2.get('/Utilities/GetBiometricTermAndConditionContents'),
  // pin code
  setupPinCode: (params) => apiV2.post('/Session/SetupPinCode', params),
  changePinCode: (params) => apiV2.post('/Session/ChangePinCode', params),
  verifyPinCode: (params) => apiWithError.post('/api/services/app/Session/VerifyPinCode', params),
  resetPinCode: (params) => apiV2.post('/Session/ResetPinCode', params),
  updateUserBiometric: (params) => apiV2.put('/Session/UpdateUserBiometric', params),
  getInventoryRequests: (params) =>
    apiV2.get(`/InventoryRequestManagement/GetInventoryRequestForFaultReporting?${ConvertObjectToQueryString(params)}`),
  getIRSetting: () => apiV2.get('/InventoryRequestManagement/GetInventoryRequestSettings'),

  // asset
  getAssetTypes: (params) =>
    apiV2.get(`/AssetManagement/GetAssetType?${ConvertObjectToQueryString(params)}&isActive=true`),
  getAssets: (params) => apiV2.get(`/AssetManagement/GetSortingAssets?${ConvertObjectToQueryString(params)}`),
  getAssetDetail: (id) => apiV2.post(`/AssetManagement/Detail?id=${id}`),
  addAsset: (data) => apiV2.post('/AssetManagement/AddAsset', data),
  updateAsset: (data) => apiV2.put(`/AssetManagement/UpdateAsset?id=${data.id}`, data),
  getListUnits: (params) => apiV2.get(`/Units/GetListUnits?${ConvertObjectToQueryString(params)}`),
  getInspectionAsset: (params) =>
    apiV2.get(
      `/WorkflowInspection/GetInspectionAsset?pageSize=${PAGE_SIZE}&inclueArchived=false&${ConvertObjectToQueryString(
        params
      )}`
    ),

  // task managment
  getTaskList: (params) => apiV2.get(`/TaskManagement/GetAll?${ConvertObjectToQueryString(params)}`),
  getStatusList: () => apiV2.get('/TaskManagement/GetStatus'),
  getPriorityList: () => apiV2.get('/TaskManagement/GetPriority'),
  getTMCurrentTeamList: () => apiV2.get('/TeamManagements/GetCurrentTeam'),
  getTMTeamList: (params) => apiV2.get(`/TeamManagements/GetTeamsByTenant?${ConvertObjectToQueryString(params)}`),
  getUsersInTeamByTenant: (params) =>
    apiV2.get(`/TeamManagements/GetUsersInTeamByTenant?${ConvertObjectToQueryString(params)}`),
  getUsersInTeamByTenants: (params) =>
    apiV2.get(`/TeamManagements/GetUsersInTeamByTenants?${ConvertObjectToQueryString(params)}`),
  addTask: (params) => apiV2.post('/TaskManagement/Create', params),
  updateTask: (params) => apiV2.put('/TaskManagement/Update', params),
  getTeamsByUsers: (params) => apiV2.get(`/TeamManagements/GetTeamByUsers?${ConvertObjectToQueryString(params)}`),
  getTenantList: (params) =>
    apiV2.get(`/Tenant/GetTenants?${ConvertObjectToQueryString(params)}&maxResultCount=50&skipCount=0`),
  getMentionUsers: (params) => apiV2.get(`/TaskManagement/GetMentionUsers?${ConvertObjectToQueryString(params)}`),
  addComment: (params) => apiV2.post('/TaskManagement/Comment', params),
  getCommentByTask: (params) => apiV2.get(`/TaskManagement/GetCommentByTask?${ConvertObjectToQueryString(params)}`),
  getTaskDetail: (id) => apiV2.get(`/TaskManagement/Get?id=${id}`),

  uploadTaskManagementFiles: (referenceId, tenantId, files) =>
    uploadFile(`${APIConfig.apiCore}/api/TaskManagement/UploadFile?guid=${referenceId}&tenantId=${tenantId}`, files),

  // Booking API endpoints
  getBookingStatus: () => apiBooking.get('/api/bookings/status'),

  getTopRecentBookings: (params) => apiBooking.get(`/api/bookings/toprecent?${ConvertObjectToQueryString(params)}`),

  filterStatisticByUnit: (params) =>
    apiBooking.get(`/api/reports/amenity/filters?${ConvertObjectToQueryString(params)}`),

  exportStatisticByUnit: (params) =>
    apiBooking.get(`/api/reports/amenity/export?${ConvertObjectToQueryString(params)}`),

  filterBookings: (params) => apiBooking.get(`/api/bookings/sorting?${ConvertObjectToQueryString(params)}`),

  filterBookingsForMember: (params) => apiBooking.get(`/api/bookings/mybookings?${ConvertObjectToQueryString(params)}`),

  getAllTimeSlots: (params) => {
    return apiBooking.get(`/api/amenities/get-all-timeslot?${ConvertObjectToQueryString(params)}`);
  },

  getTimeSlots: (params) => apiBooking.get(`/api/amenities/timeslots?${ConvertObjectToQueryString(params)}`),

  getBookingDetail: (reservationId) => apiBooking.get(`/api/bookings/${reservationId}`),

  getPaymentStatus: () => apiBooking.get('/api/bookings/paymentstatus'),

  addBooking: (data) => apiBooking.post('/api/bookings', data),

  updateBooking: (data) => apiBooking.put('/api/bookings', data),

  updateBookingStatus: (statusCode, reservationId) =>
    apiBooking.put('/api/bookings/status', { reservationId, status: statusCode }),

  addBookingForMember: (data) => apiBooking.post('/api/bookings/create', data, true),

  updateBookingForMember: (data) => apiBooking.put('/api/bookings/resident', data, true),

  updateBookingStatusForMember: (statusCode, reservationId) =>
    apiBooking.put('/api/bookings/resident', { reservationId, status: statusCode }, true),

  getAuditLogs: (params) =>
    apiBooking.get(`/api/services/app/AuditLogStoreService/GetAuditLog?${ConvertObjectToQueryString(params)}`),

  getBookingPeriod: (params) =>
    apiBooking.get(`/api/amenities/getPeriodAmenities?${ConvertObjectToQueryString(params)}`),

  validateRecurringBooking: (data) => apiBooking.post('/api/bookings/ValidateBookingRecurring', data),

  recurringBooking: (data) => apiBooking.post('/api/bookings/Recurring', data),

  getAmenityDetail: (amenityId) => apiBooking.get(`api/amenities/${amenityId}`),

  getBookingPurpose: () => apiV2.get('BookingPurpose/GetBookingPurpose'),

  getAmenities: (params) => apiBooking.get(`/api/amenities/get-amenities?${ConvertObjectToQueryString(params)}`),
  uploadBookingFiles: (params, file) =>
    uploadFile(`${APIConfig.apiCore}/api/File/UploadFileBooking?${ConvertObjectToQueryString(params)}`, file),
};
