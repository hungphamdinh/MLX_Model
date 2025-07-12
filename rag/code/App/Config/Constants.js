import { ImageResource } from '../Themes';
import { icons } from '../Resources/icon';
import { Platform } from 'react-native';

export const prefixFolder = Platform.OS === 'ios' ? '' : 'file://';

export const formItemTypes = {
  MULTIPLE_CHOICE: 1,
  DROPDOWN: 2,
  TEXT_BOX: 3,
  TEXT_AREA: 4,
  DATE_TIME: 5,
  NUMBER: 6,
  RATING: 7,
  Option: 8,
  METER_READING: 10,
  INVENTORY_QUANTITY: 11,
  VISUAL_DEFECTS: 12,
  MARCHING_IN_OUT: 13,
  Q_AND_A_TEXT_AREA: 14,
  IMAGE: 15,
};

export const fileTypes = {
  image: 'IMAGE',
  video: 'VIDEO',
  pdf: 'PDF',
  other: 'OTHER',
};

export const microsoftTenant = 'd929b288-ebb1-49e2-8435-99994c5663d6';

export const SENT_METHOD = {
  both: 0,
  email: 1,
  sms: 2,
};
export const Repeat = {
  daily: 1,
  weekly: 2,
  monthly: 3,
  yearly: 4,
};
export const validateMessage = {
  validateRequired: 'This field is required',
};

export const ActionType = {
  INSERT: 'INSERT',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
};

export const FormStatusCode = {
  UN_PUBLIC: 'FORMUNPUBLIC',
  PUBLIC: 'FORMPUBLIC',
  DELETED: 'FORMDELETED',
  ARCHIVE: 'FORMARCHIVE',
  CLOSE: 'FORMCLOSE',
  IN_PROGRESS: 'FORMINPROGRESS',
  SUBMITTED: 'FORMSUBMITTED',
  GLOBAL: 'FORMGLOBAL',
  READ_ONLY: 'FORMREADONLY',
};

export const ModuleNames = {
  ATTENDANCE: 'Attendance',
  ATTENDANCE_NOTIFICATION: 'TemperatureAttendance',
  WORK_ORDER: 'WorkOrder',
  PLAN_MAINTENANCE: 'PlanMaintenance',
  INSPECTION: 'InspectionProperty',
  InspectionAttachFile: 'InspectionAttachFile',
  InspectionSignatures: 'InspectionSignature',
  InspectionReport: 'InspectionReport',
};

export const Modules = {
  FEE: 1,
  WORKORDER: 2,
  BOOKING: 3,
  EVENT: 4,
  LIBRARY: 5,
  FEEDBACK: 6,
  COMMENTS: 7,
  SURVEY: 8,
  ONLINEFORM: 9,
  MEMBER: 10,
  UNIT: 11,
  DELIVERY: 12,
  INSTRUCTION: 13,
  INBOX: 14,
  OTHER: 15,
  WORKORDERMANAGEMENT: 16,
  WORKORDERTASK: 17,
  PLANMAINTENANCE: 18,
  PLANMAINTENANCETASK: 19,
  ENQUIRY: 20,
  VISITOR: 21,
  AMENITY: 22,
  AMENITYBLACKLIST: 23,
  AMENITYGROUP: 24,
  AMENITYMAINTENANCE: 25,
  CARD: 26,
  CARDPHYSICAL: 27,
  CONTACT: 28,
  CONTRACT: 29,
  EMPLOYEE: 30,
  ENQUIRYHEADOFFICE: 31,
  ENQUIRYNOTIFICATION: 32,
  NOTIFICATIONSETTING: 33,
  INVENTORY: 34,
  PROVIDER: 35,
  TEAM: 36,
  NOTIFICATIONEMAIL: 37,
  INSPECTION: 38,
  WORKFLOW: 39,
  INSPECTIONTASK: 40,
  ASSET: 41,
  LEASECONTRACT: 42,
  WELCOMEMESSAGE: 43,
  INSPECTIONPROPERTY: 44,
  QR_FEEDBACK: 45,
  TASK_MANAGEMENT: 66,
};

export const OFFLINE_INSPECTION_ID = 'Pages.StandardAloneInspection';

export const ReceiptType = {
  FEE_RECEIPT: 'receipt',
  CASH_ADVANCE: 'cashAdvanceReceipt',
};

export const TEAM_INSPECTION_ID = 'Pages.TeamInspectionJob';

export const homeModules = [
  {
    id: 'Pages.WorkOrdersV1',
    type: 'WO',
    icon: ImageResource.IC_WO,
    title: 'AD_HOME_TITLE_WO',
    screen: 'workOrder',
  },
  {
    id: 'Pages.Inspection',
    type: 'INSPECTION',
    title: 'AD_HOME_TITLE_INSPECTION',
    icon: ImageResource.IC_TASK,
    screen: 'Jobs',
  },
  {
    id: 'Pages.Delivery',
    type: 'DELIVERY',
    title: 'AD_HOME_TITLE_DELIVERY',
    icon: ImageResource.IC_DL,
    screen: 'listDelivery',
  },
  {
    id: 'Pages.Attendance',
    type: 'CHECK_IN/CHECK_OUT',
    title: 'AD_HOME_TITLE_CHECKIN',
    icon: ImageResource.IC_CHECK,
    screen: 'listHistoryCheckIn',
  },
  {
    id: 'Pages.Plan.Maintenance',
    type: 'PLAN',
    title: 'AD_HOME_PLAN_MAINTENANCE',
    icon: ImageResource.IC_PLAN,
    screen: 'listPlainMaintenance',
  },
  {
    id: 'Pages.Inventory',
    type: 'INVENTORY',
    title: 'AD_HOME_INVENTORY',
    icon: ImageResource.IC_INVENTORY,
    screen: 'listInventory',
  },
  {
    id: 'Pages.StandardAloneInspection',
    type: 'INSPECTION',
    icon: ImageResource.IC_PROPERTY_INSPECTON,
    screen: 'innovatorInspection',
  },
  {
    id: 'Pages.Survey',
    type: 'Survey',
    icon: ImageResource.IC_SURVEY,
    title: 'AD_HOME_SURVEY',
    screen: 'surveyDashboard',
  },
  {
    id: 'Pages.Survey.Employee',
    type: 'SurveyEmployee',
    icon: ImageResource.IC_EMPLOYEE_SURVEY,
    title: 'AD_HOME_EMPLOYEE_SURVEY',
    screen: 'employeeSurvey',
  },
  {
    id: 'Pages.MRManagement',
    type: 'MeterReading',
    icon: ImageResource.IC_VOLTAGE,
    title: 'METER_READING_TITLE',
    screen: 'meterReading',
  },
  {
    id: 'Pages.FeeStatement.FeeReceipt.CheckUniqueCode',
    type: 'FeeReceipt',
    icon: ImageResource.IC_RECEIPT,
    title: 'FEE_CHECK_RECEIPT_TITLEHEADER',
    screen: 'feeReceipt',
  },
];
export const VERIFY_COUNT_DOWN = 180;

export const FormEditorTypes = {
  CREATE_EDIT_FORM: 'CREATE_EDIT_FORM',
  VIEW_FORM: 'VIEW_FORM',
  SUBMIT_FORM: 'SUBMIT_FORM',
  CREATE_EDIT_INSPECTION: 'CREATE_EDIT_INSPECTION',
  ONLINE_CREATE_EDIT_INSPECTION: 'ONLINE_CREATE_EDIT_INSPECTION',
  VIEW_INSPECTION: 'VIEW_INSPECTION',
  VIEW_HISTORY: 'VIEW_HISTORY',
};

export const SyncState = {
  NOT_SYNC: 'NOT_SYNC',
  SYNCING: 'SYNCING',
  SYNCED: 'SYNCED',
};

export const InspectionStatus = {
  IFormInProgress: 6,
  IFormCompleted: 7,
  IFormSubmitted: 8,
};

export const WorkFlowStatusId = {
  inProgress: 1,
  new: 4,
  completed: 2,
};

export const WorkFlowStatusName = {
  inProgress: 'In progress',
  completed: 'Completed',
};
// Parcel Status
export const ParcelStatus = {
  WAITING_TO_RECEIVED: 1,
  REMINDER: 2,
  RECEIVED: 3,
  RETURN_PARCEL: 4,
};
// Survey

export const surveyStatusColor = {
  SURVEYUNPUBLISH: '#FF0101',
  SURVEYPUBLISH: '#55E618',
};

export const LEGEND_COLORS = [
  '#406EFB',
  '#56C9EF',
  '#FFAF4B',
  '#FD5674',
  '#87B84F',
  '#b8b5ff',
  '#56C9EF',
  '#810034',
  '#351f39',
  '#726a95',
  '#719fb0',
  '#a0c1b8',
];

export const getIconByModuleId = (moduleId) => {
  switch (moduleId) {
    case Modules.EVENT:
      return icons.event;
    case Modules.WORKORDER:
      return icons.jobRequest;
    case Modules.WORKORDERMANAGEMENT:
      return icons.jobRequest;
    case Modules.FEEDBACK:
      return icons.feedback;
    case Modules.DELIVERY:
      return icons.delivery;
    case Modules.VISITOR:
      return icons.visitor;
    case Modules.ONLINEFORM:
      return icons.form;
    case Modules.PLANMAINTENANCE:
      return icons.planMaintenance;
    case Modules.INVENTORY:
      return icons.inventory;
    case Modules.INSPECTION:
      return icons.inspection;
    case Modules.SURVEY:
      return icons.survey;

    default:
      return icons.notifySetting;
  }
};

export const DashboardStatisticTypes = {
  ALL_JR: 1,
  TEAM_JR: 2,
  MY_JR: 3,
  SURVEY: 4,
  PLAN_MAINTENANCE: 5,
  TEAM_PM: 6,
  MY_PM: 7,
};

export const getModuleIconTitleByScreen = (screen) => {
  switch (screen) {
    case 'delivery':
      return {
        icon: icons.delivery,
        title: 'HOME_TXT_DELIVERY',
      };
    case 'plainMaintenance':
      return {
        icon: icons.planMaintenance,
        title: 'AD_HOME_PLAN_MAINTENANCE',
      };
    case 'surveyDashboard':
      return {
        icon: icons.survey,
        title: 'AD_HOME_SURVEY',
      };
    case 'employeeSurvey':
      return {
        icon: icons.surveyEmployee,
        title: 'AD_HOME_EMPLOYEE_SURVEY',
      };
    case 'jobRequest':
      return {
        icon: icons.jobRequest,
        title: 'HOME_TXT_WORKORDER_V1',
      };
    case 'feedback':
      return {
        icon: icons.feedback,
        title: 'HOME_TEXT_FEEDBACK',
      };
    case 'meterReading':
      return {
        icon: icons.meterReading,
        title: 'METER_READING_TITLE',
      };
    case 'feeReceipt':
      return {
        icon: icons.receipt,
        title: 'FEE_CHECK_RECEIPT_TITLEHEADER',
      };

    case 'attendance':
      return {
        icon: icons.attendance,
        title: 'AD_HOME_TITLE_CHECKIN',
      };
    case 'inventory':
      return {
        icon: icons.inventory,
        title: 'AD_HOME_INVENTORY',
      };
    case 'asset':
      return {
        icon: icons.assetHome,
        title: 'ASSET_TXT',
      };
    case 'inspection':
      return {
        icon: icons.inspection,
        title: 'AD_HOME_TITLE_INSPECTION',
      };
    case 'sync':
      return {
        icon: icons.syncInactive,
        activeIcon: icons.inspection,
        title: 'INSPECTION_TAB_SYNC',
      };
    // case 'teamJob':
    //   return {
    //     icon: icons.formInactive,
    //     activeIcon: icons.tabForm,
    //     title: 'INSPECTION_TAB_TEAM_JOBS',
    //   };
    case 'form':
      return {
        icon: icons.formInactive,
        activeIcon: icons.tabForm,
        title: 'INSPECTION_TAB_FORMS',
      };
    case 'properties':
      return {
        icon: icons.propertyInactive,
        activeIcon: icons.tabProperty,
        title: 'INSPECTION_TAB_PROPERTIES',
      };
    case 'jobs':
      return {
        icon: icons.tabHome,
        title: 'INSPECTION_TAB_FORMS',
      };
    case 'home':
      return {
        icon: icons.home,
        title: 'HOME_TXT',
      };
    case 'inspectionHome':
      return {
        icon: icons.home,
        title: 'HOME_TXT',
      };
    case 'visitor':
      return {
        icon: icons.visitor,
        title: 'VISITOR_MANAGEMENT_TITLE',
      };
    case 'myReport':
      return {
        icon: icons.form,
        title: 'MY_REPORT_TXT',
      };
    case 'taskManagement':
      return {
        icon: icons.taskManagement,
        title: 'TASK_MANAGEMENT_TXT',
      };
    case 'booking':
      return {
        icon: icons.booking,
        title: 'BOOKING_MANAGEMENT_TITLE',
      };

    default:
      return {
        icon: icons.delivery,
        title: 'DEFAULT',
      };
  }
};

export const getInspectionQuestionIconById = (item) => {
  switch (item.id) {
    case formItemTypes.MULTIPLE_CHOICE:
      return {
        icon: 'radiobox-marked',
        ...item,
      };
    case formItemTypes.DROPDOWN:
      return {
        icon: 'form-dropdown',
        ...item,
      };
    case formItemTypes.TEXT_BOX:
      return {
        icon: 'form-textbox',
        ...item,
      };
    case formItemTypes.TEXT_AREA:
      return {
        icon: 'form-textarea',
        ...item,
      };
    case formItemTypes.DATE_TIME:
      return {
        icon: 'calendar-range',
        ...item,
      };
    case formItemTypes.NUMBER:
      return {
        icon: 'counter',
        ...item,
      };
    case formItemTypes.RATING:
      return {
        icon: 'star',
        ...item,
      };
    case formItemTypes.Option:
      return {
        icon: 'cog',
        ...item,
      };

    case formItemTypes.VISUAL_DEFECTS:
      return {
        icon: 'eye',
        ...item,
      };
    case formItemTypes.METER_READING:
      return {
        icon: 'speedometer',
        ...item,
      };
    case formItemTypes.INVENTORY_QUANTITY:
      return {
        icon: 'cube',
        ...item,
      };
    case formItemTypes.MARCHING_IN_OUT:
      return {
        icon: 'login',
        ...item,
      };
    case formItemTypes.Q_AND_A_TEXT_AREA:
      return {
        icon: 'comment-account',
        ...item,
      };
    default:
      return {
        icon: 'cube',
        ...item,
      };
  }
};

export const inspectionStandardModules = [
  {
    key: 'inspectionHome',
    screen: 'inspectionHome',
  },
  {
    key: 'properties',
    screen: 'properties',
  },
  {
    key: 'form',
    screen: 'form',
  },
  {
    key: 'sync',
    screen: 'sync',
  },
  {
    key: 'myReport',
    screen: 'myReport',
  },
];

export const TemplateTypes = {
  myForm: {
    colorCode: '#00c300',
    name: 'FORM_MY_FORM',
  },
  teamForm: {
    colorCode: '#d3b42d',
    name: 'FORM_TEAM_FORM',
  },
  globalForm: {
    colorCode: '#2d61d3',
    name: 'FORM_GLOBAL_FORM',
  },
};

export const InspectionFormTypes = {
  inspection: {
    colorCode: '#2d61d3',
    name: 'FORM_TYPE_INPECTION',
  },
  inventoryReport: {
    colorCode: '#2D6553',
    name: 'FORM_TYPE_INVENTORY_CHECKLIST',
  },
};

const previous10Year = new Date().getFullYear() - 10;
export const meterReadingYears = Array.from(new Array(20), (val, index) => ({
  label: (index + previous10Year).toString(),
  value: (index + previous10Year).toString(),
}));

export const meterReadingPeriods = Array.from(new Array(12), (val, index) => ({
  label: (index + 1).toString(),
  value: (index + 1).toString(),
}));

export const JR_STATUS_ID = {
  NEW: 11,
  RE_OPEN: 18,
  IN_PROGRESS: 13,
  ON_HOLD: 14,
  RESOLVED: 19,
  COMPLETED: 15,
  CANCELLED: 16,
  WAITING_PAYMENT: 17,
};

export const PM_STATUS_ID = {
  PLAN: 1,
  OPEN: 2,
  ON_HOLD: 3,
  CLOSED: 4,
  CANCEL: 5,
};

export const JR_SIGN_TYPE = {
  OFFICE_SIGNING: 'OfficeSigning',
  MAINTENANCE_SIGNING: 'MaintenanceSigning',
};

export const VISITOR_TRACKING_TYPE = {
  CHECK_IN: 1,
  CHECK_OUT: 0,
};

export const AssetLocationType = {
  Location: 0,
  Unit: 1,
};

export const JRLocationType = {
  Unit: 0,
  Location: 1,
};

export const FormTypes = {
  MY_FORM: 'myForm',
  TEAM_FORM: 'teamForm',
  GLOBAL_FORM: 'globalForm',
};

export const InspectionOrderByColumn = {
  remoteId: 0,
  startDate: 1,
  team: 2,
  inspectionPropertyName: 3,
  notes: 4,
  dueDate: 5,
  priority: 6,
  status: 7,
  assignedTo: 8,
  subject: 9,
};

export const InspectionPropertyOrderByColumn = {
  id: 0,
  name: 1,
  type: 2,
  unitFloorBuilding: 3,
  notes: 4,
  lastModifiedInfo: 5,
};

export const InspectionFormOrderByColumn = {
  none: 0,
  formTitle: 1,
  status: 2,
  question: 3,
  inspections: 4,
  createdBy: 5,
  createdOn: 6,
  updatedOn: 7,
  id: 8,
  category: 9,
};

export const FORM_STATUS_ID = {
  UN_PUBLIC: 1,
  PUBLIC: 2,
  GLOBAL: 12,
  PUBLIC_TEAM: 13,
};

export const JobRequestFromModules = {
  workOrder: 1,
  planMaintenance: 2,
  feedback: 3,
};

export const JR_EXTRA_SERVICE_CODE = 'EXTRASERVICE';

export const SIGNATURE_MODULE_NAME = {
  SIGNATURE_1: 'INSPECTIONSIGNATURE',
  SIGNATURE_2: 'INSPECTIONSIGNATURE2',
  SIGNATURE_3: 'INSPECTIONSIGNATURE3',
};

export const INSPECTION_MARCHING_TYPE = {
  IN: 0,
  OUT: 1,
};

export const MeterDeviceType = {
  sub: 0,
  master: 1,
};

export const SYNC_SUCCESS_MESSAGE = {
  IMAGE: 'IMAGE_SYNCED',
  SIGNATURE: 'SIGNATURE_SYNCED',
};

export const PM_SORT_TYPE = {
  ID: 8,
  CREATED_DATE: 6,
  TARGET_EXECUTION_DATE: 4,
};

export const INSPECTION_LINKAGE_JOB_TYPE = {
  PICKED_UP: 'PICKED_UP',
  RELEASED: 'RELEASED',
};

export const INSPECTION_FORM_TYPE = {
  INSPECTION: 0,
  INVENTORY_CHECK_LIST: 1,
};

export const ENTITY_CHANGE_TYPE = {
  NEW: 0,
  UPDATE: 1,
  DELETE: 2,
};

export const BIOMETRIC_STATUS = {
  ON: 'on',
  OFF: 'off',
  SKIP: 'skip',
  SESSION: 'session', // for session timeout
};

export const AUTH_MODAL_STATUS = {
  ON: 'on',
  OFF: 'off',
};

export const azureRestrictedTerms = [
  'system()',
  'Runtime.exec()',
  'Process.start()',
  'ShellExecute()',
  'CreateProcess()',
  'WScript.Shell.Run()',
  'eval()',
  'exec()',
  'spawn()',
  'open()',
];

export const MAX_TEXT_LENGTH = 500;

export const LIMIT_AZURE_FILE_SIZE = 20 * 1024 * 1024;

export const sorMode = {
  sor: 1,
  inventoryRequest: 0,
};

export const projectType = {
  residential: 'RESIDENTIAL',
  office: 'OFFICE',
};

export const INSPECTION_STATUS = {
  NEW: 'NEW',
  INPROGRESS: 'INPROGRESS',
  COMPLETED: 'COMPLETED',
};

export const MY_REPORT_STATUS_ID = {
  IN_PROGRESS: 0,
  COMPLETED: 1,
  FAILED: 2,
};

export const LOGIN_METHODS = {
  BIOMETRIC: 1,
  OTP: 2,
};

export const ControlOfficePrjId = 70;

export const TASK_FREQUENCY = {
  ONE_OFF: '1',
  DAILY: '2',
  WEEKLY: '3',
  MONTHLY: '4',
  YEARLY: '5',
};

export const FREQUENCIES = [
  { id: TASK_FREQUENCY.ONE_OFF, name: 'ONE_OFF' },
  { id: TASK_FREQUENCY.DAILY, name: 'DAILY' },
  { id: TASK_FREQUENCY.WEEKLY, name: 'WEEKLY' },
  { id: TASK_FREQUENCY.MONTHLY, name: 'MONTHLY' },
  { id: TASK_FREQUENCY.YEARLY, name: 'YEARLY' },
];

export const defaultCost = {
  text: '0',
  rawValue: 0,
};

export const SURVEY_PUBLISHED_TYPE = {
  RESIDENT: 1,
  UNIT: 2,
  ADMIN: 3,
};

export const bookingTargets = {
  occupier: 0,
  company: 1,
  outsider: 2,
};

export const bookingStatusCode = {
  REQUESTED: 'REQUESTED',
  APPROVED: 'APPROVED',
  DECLINED: 'DECLINED',
  CANCELED: 'CANCELED',
  EXPIRED: 'EXPIRED',
};

export const bookingPaymentStatusCode = {
  NOT_YET_DEPOSIT: 'NotYetDeposit',
  DEPOSITED: 'Deposited',
  NEED_REFUND: 'NeedRefund',
  REFUNDED: 'Refunded',
};

// Recurrence
export const FREQUENCY_TYPES = [
  { id: Repeat.daily, labelKey: 'AD_PM_DAILY' },
  { id: Repeat.weekly, labelKey: 'AD_PM_WEEKLY' },
  { id: Repeat.monthly, labelKey: 'AD_PM_MONTHLY' },
];

export const DAILY_TYPE_KEYS = ['AD_PM_RECURRENCE_DAY'];
export const ON_TYPE_KEYS = ['DAY', 'FIRST', 'SECOND', 'THIRD', 'FOURTH', 'LAST'];
export const WEEK_DAY_KEYS = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
