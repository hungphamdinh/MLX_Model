/* @flow */

import { createStackNavigator } from '@react-navigation/stack';
import { createCompatNavigatorFactory } from '@react-navigation/compat';
import SplashScreen from '../../Screens/SplashScreen';
import HomeScreen from '../../Screens/HomeScreen';
import MainTabNavigator from '../MainTabNavigator';
import NotificationScreen from '../../Screens/NotificationScreen';
import ListPlainMaintenance from '../../Screens/PlanMaintenance';
import PlanTask from '../../Screens/PlanMaintenance/PlanTask';
import DetailInventory from '../../Screens/Inventory/DetailInventory';
import AddOrEditPlanTask from '../../Screens/PlanMaintenance/AddOrEditPlanTask';
import AddOrEditPM from '../../Screens/PlanMaintenance/AddOrEditPM';
import AddOrEditAsset from '../../Screens/Asset/AddOrEditAsset';
import InspectionTabNavigation from '../../Screens/InnovatorInspection/InspectionTabNavigation';
import PropertyScreen from '../../Screens/InnovatorInspection/Property/PropertyScreen';
import AddOrEditPropertyScreen from '../../Screens/InnovatorInspection/Property/AddOrEditPropertyScreen';
import PropertyDetailScreen from '../../Screens/InnovatorInspection/Property/PropertyDetailScreen';
import CreateOrEditForm from '../../Screens/InnovatorInspection/Template/CreateOrEditForm';
import CreateOrEditJob from '../../Screens/InnovatorInspection/Inspection/EditJob';
import SelectProperty from '../../Screens/InnovatorInspection/Inspection/CreateJobScreen/SelectPropertyScreen';
import AddJobFromPM from '../../Screens/InnovatorInspection/Template/AddJobFromPM';
import FormEditorScreen from '../../Screens/InnovatorInspection/Template/FormEditorScreen';
import ReorderSectionScreen from '../../Screens/InnovatorInspection/Template/ReorderSectionScreen';
import InspectionExcecution from '../../Screens/InnovatorInspection/Inspection/InspectionExcecution';
import SelectFormScreen from '../../Screens/InnovatorInspection/Inspection/CreateJobScreen/SelectFormScreen';
import GeneralInfoScreen from '../../Screens/InnovatorInspection/Inspection/CreateJobScreen/GeneralInfoScreen';

import SignatureScreen from '../../Screens/InnovatorInspection/Inspection/SignatureScreen';
import SurveySignatureScreen from '../../Screens/Survey/SignatureScreen';
import DetailSyncPhotoScreen from '../../Screens/InnovatorInspection/Sync/DetailSyncPhotoScreen';
import DetailSyncSignatureScreen from '../../Screens/InnovatorInspection/Sync/DetailSyncSignatureScreen';

import CommonSignature from '../../Screens/Signature';

import FormNote from '../../Screens/InnovatorInspection/Inspection/FormNote';
import AttachImages from '../../Screens/InnovatorInspection/Inspection/AttachImageScreen';
import InspectionCamera from '../../Screens/InnovatorInspection/Inspection/InspectionCamera';

import InspectionListScreen from '../../Screens/InnovatorInspection/Inspection/InspectionListScreen';
import SurveyDashboard from '../../Screens/Survey/SurveyDashboard';
import AddSurvey from '../../Screens/Survey/AddSurvey';
import EmployeeSurvey from '../../Screens/Survey/EmployeeSurvey';
import MeterReading from '../../Screens/MeterReading';
import CreateMeterRecordManual from '../../Screens/MeterReading/CreateMeterRecord';
import PublishSurvey from '../../Screens/Survey/PublishSurvey';
import SelectItemToPublish from '../../Screens/Survey/SelectItemToPublish';
import ConfigPublishSurvey from '../../Screens/Survey/ConfigPublishSurvey';
import SurveyDetail from '../../Screens/Survey/SurveyDetail';
import UpdateSurvey from '../../Screens/Survey/UpdateSurvey';
import SurveySummary from '../../Screens/Survey/SurveySummary';
import SurveyRawData from '../../Screens/Survey/SurveyRawData';
import EmployeeSurveyEditor from '../../Screens/Survey/EmployeeSurveyEditor';
import DesignSurvey from '../../Screens/Survey/DesignSurvey';
import FeeReceipt from '../../Screens/FeeReceipt/QRCodeScan';
import ConfirmModal from '../../Screens/ConfirmModal';
import ChatTaskModal from '../../Screens/ChatTaskModal';
import Setting from '../../Screens/Setting';
import Profile from '../../Screens/Setting/Profile';
import ChangeLanguage from '../../Screens/Setting/ChangeLanguage';
import SettingNotification from '../../Screens/Setting/Notification';
import JobRequest from '../../Screens/JobRequest';
import Feedback from '../../Screens/Feedback';
import AddOrEditFeedback from '../../Screens/Feedback/AddOrEditFeedback';
import EditQRFeedback from '../../Screens/Feedback/EditQRFeedback';
import AddOrEditJobRequest from '../../Screens/JobRequest/AddOrEditJobRequest';
import AddQuickJobRequest from '../../Screens/JobRequest/AddQuickJobRequest';
import AddOrEditTask from '../../Screens/JobRequest/AddOrEditTask';
import JobRequestTask from '../../Screens/JobRequest/JobRequestTask';
import ScanQRCode from '../../Screens/ScanQRCode';
import Delivery from '../../Screens/DeliveryScreen';
import AddOrEditDelivery from '../../Screens/DeliveryScreen/AddOrEditDelivery';
// import CheckOutParcel from '../../Screens/DeliveryScreen/CheckOutParcel';
import AddInventoryItem from '../../Screens/Inventory/AddInventoryItem';
import Inventory from '../../Screens/Inventory';
import LoginScreen from '../../Screens/Auths/Login';
import BiometricScreen from '../../Screens/Auths/Biometric';
import PasswordScreen from '../../Screens/Auths/PasswordScreen';
import SelectTenant from '../../Screens/Auths/SelectTenant';
import ForgotPassword from '../../Screens/Auths/ForgotPassword';
import ChangePassword from '../../Screens/Auths/ChangePassword';
import Attendance from '../../Screens/Attendance';
import DetailAttendance from '../../Screens/Attendance/DetailAttendance';
import AddAttendance from '../../Screens/Attendance/AddAttendance';
import AddInventoryStock from '../../Screens/Inventory/AddInventoryStock';
import CheckOutDelivery from '../../Screens/DeliveryScreen/CheckOutParcel';
import SignatureCheckOut from '../../Screens/DeliveryScreen/SignatureCheckOut';
import VerifyOtpCode from '../../Screens/Auths/VerifyOtpCode';
import MeterReadingDetail from '../../Screens/MeterReading/MeterReadingDetail';
import Visitor from '../../Screens/Visitor';
import VisitorDetail from '../../Screens/Visitor/VisitorDetail';
import InspectionSyncSetting from '../../Screens/Setting/InspectionSyncSetting';
import Maintenance from '../../Screens/Maintenance';
import ChangeHistory from '../../Screens/InnovatorInspection/Inspection/ChangeHistory';
import BiometricTermAndConditions from '../../Screens/Auths/Biometric/TermAndConditions';
import SetupPinCode from '../../Screens/Auths/SetupPinCode';
import ForgotPinCode from '../../Screens/Auths/ForgotPinCode';
import AddOrEditVisitor from '../../Screens/Visitor/AddOrEditVisitor';
import SetUpMasterSection from '../../Screens/InnovatorInspection/Template/SetUpMasterSection';
import Asset from '../../Screens/Asset';
import DefectDetail from '../../Screens/InnovatorInspection/Inspection/DefectDetail';
import ChooseLoginMethod from '../../Screens/Auths/ChooseLoginMethod';
import TaskManagement from '../../Screens/TaskManagement';
import TaskDetail from '../../Screens/TaskManagement/TaskDetail';
import AddOrEditBooking from '../../Screens/Booking/AddOrEditBooking';
import Booking from '../../Screens/Booking';

export default createCompatNavigatorFactory(createStackNavigator)(
  {
    splash: {
      screen: SplashScreen,
      path: 'splash',
    },
    mainTab: MainTabNavigator,
    // setting
    Setting: {
      screen: Setting,
    },
    Profile: {
      screen: Profile,
    },
    ChangeLanguage: {
      screen: ChangeLanguage,
    },
    SettingNotification: {
      screen: SettingNotification,
    },
    login: LoginScreen,
    passwordFill: PasswordScreen,
    nonSavillsLogin: PasswordScreen,
    verifyOTPCode: VerifyOtpCode,
    selectTenant: SelectTenant,
    delivery: Delivery,
    addDelivery: AddOrEditDelivery,
    editDelivery: AddOrEditDelivery,
    checkOutDelivery: CheckOutDelivery,
    signatureCheckOut: SignatureCheckOut,
    forgotPassword: ForgotPassword,
    changePassword: ChangePassword,
    resetPassword: ChangePassword,
    resetPasswordFirstTime: ChangePassword,
    chooseLoginMethod: ChooseLoginMethod,
    chooseLoginMethodFirstTime: ChooseLoginMethod,
    notification: {
      screen: NotificationScreen,
    },

    home: {
      screen: HomeScreen,
      path: 'receipt/:code',
    },
    addJobRequest: AddOrEditJobRequest,
    editJobRequest: AddOrEditJobRequest,
    addQuickJobRequest: AddQuickJobRequest,
    addJobRequestTask: AddOrEditTask,
    editJobRequestTask: AddOrEditTask,
    jobRequestTask: JobRequestTask,
    jobRequest: JobRequest,
    feedback: Feedback,
    addFeedback: AddOrEditFeedback,
    editFeedback: AddOrEditFeedback,
    editQRFeedback: EditQRFeedback,
    scanQRCode: ScanQRCode,
    plainMaintenance: {
      screen: ListPlainMaintenance,
    },
    detailInventory: {
      screen: DetailInventory,
    },
    inventory: Inventory,
    addInventoryStock: AddInventoryStock,
    addInventoryItem: AddInventoryItem,

    detailPlan: {
      screen: AddOrEditPM,
    },
    addPlanTask: AddOrEditPlanTask,
    editPlanTask: AddOrEditPlanTask,
    planTask: PlanTask,

    createPlan: {
      screen: AddOrEditPM,
    },

    detailAssets: {
      screen: AddOrEditAsset,
      path: 'assets/:assetCode',
    },

    addAsset: {
      screen: AddOrEditAsset,
    },

    inspection: {
      screen: InspectionTabNavigation,
    },

    property: {
      screen: PropertyScreen,
    },

    addProperty: {
      screen: AddOrEditPropertyScreen,
    },

    updateProperty: {
      screen: AddOrEditPropertyScreen,
    },

    propertyDetail: {
      screen: PropertyDetailScreen,
    },

    addForm: {
      screen: CreateOrEditForm,
    },
    addJobFromPM: {
      screen: AddJobFromPM,
    },
    addJob: {
      screen: CreateOrEditJob,
    },
    editJob: {
      screen: CreateOrEditJob,
    },
    updateForm: {
      screen: CreateOrEditForm,
    },

    formEditor: {
      screen: FormEditorScreen,
    },

    formDetail: {
      screen: CreateOrEditForm,
    },

    reorderSection: {
      screen: ReorderSectionScreen,
    },

    inspectionDetail: {
      screen: InspectionExcecution,
    },

    detailSyncPhoto: {
      screen: DetailSyncPhotoScreen,
    },

    detailSyncSignature: {
      screen: DetailSyncSignatureScreen,
    },

    assignJob: {
      screen: CreateOrEditJob,
    },

    selectProperty: {
      screen: PropertyScreen,
    },
    selectPropertyToCreate: {
      screen: SelectProperty,
    },
    selectFormToCreate: {
      screen: SelectFormScreen,
    },
    generalInfo: {
      screen: GeneralInfoScreen,
    },
    signature: {
      screen: SignatureScreen,
    },
    surveySignature: {
      screen: SurveySignatureScreen,
    },
    addSignature: {
      screen: SignatureScreen,
    },
    detailSignature: {
      screen: SignatureScreen,
    },
    formNote: {
      screen: FormNote,
    },
    formNotes: {
      screen: FormNote,
    },
    formDefect: {
      screen: FormNote,
    },
    formAdditionalAnswer: {
      screen: FormNote,
    },
    formQuantity: {
      screen: FormNote,
    },
    attachImages: {
      screen: AttachImages,
    },
    inspectionCamera: {
      screen: InspectionCamera,
    },

    inspectionList: {
      screen: InspectionListScreen,
    },

    // survey
    surveyDashboard: {
      screen: SurveyDashboard,
    },
    addSurvey: {
      screen: AddSurvey,
    },
    employeeSurvey: {
      screen: EmployeeSurvey,
    },
    meterReading: MeterReading,
    createMeterManual: CreateMeterRecordManual,
    meterReadingDetail: MeterReadingDetail,
    publishSurveyToUnit: {
      screen: PublishSurvey,
    },
    publishSurveyToTenant: {
      screen: PublishSurvey,
    },
    publishSurveyToEmployee: {
      screen: PublishSurvey,
    },
    selectUnitToPublish: {
      screen: SelectItemToPublish,
    },
    selectTenantToPublish: {
      screen: SelectItemToPublish,
    },
    selectEmployeeToPublish: {
      screen: SelectItemToPublish,
    },
    configPublishSurvey: {
      screen: ConfigPublishSurvey,
    },
    surveyDetail: {
      screen: SurveyDetail,
    },
    updateSurvey: {
      screen: UpdateSurvey,
    },
    surveySummary: {
      screen: SurveySummary,
    },
    surveyRawData: {
      screen: SurveyRawData,
    },
    employeeSurveyEditor: {
      screen: EmployeeSurveyEditor,
    },
    employeeSurveyDetail: {
      screen: EmployeeSurveyEditor,
    },
    designSurvey: {
      screen: DesignSurvey,
    },
    feeReceipt: {
      screen: FeeReceipt,
    },

    confirmModal: {
      screen: ConfirmModal,
    },

    chatTask: {
      screen: ChatTaskModal,
    },
    // attendance
    attendance: Attendance,
    detailAttendance: DetailAttendance,
    addAttendance: AddAttendance,
    commonSignature: CommonSignature,

    // visitor
    visitor: Visitor,
    visitorDetail: VisitorDetail,
    addVisitor: AddOrEditVisitor,
    editVisitor: AddOrEditVisitor,

    inspectionSyncSetting: InspectionSyncSetting,
    maintenance: Maintenance,
    changeHistory: ChangeHistory,
    biometric: BiometricScreen,
    biometricTermConditions: BiometricTermAndConditions,
    // setup pin
    setupPinCode: SetupPinCode,
    changePinCode: SetupPinCode,
    forgotPinCode: ForgotPinCode,
    setUpMasterSectionInspection: SetUpMasterSection,
    setUpMasterSectionForm: SetUpMasterSection,

    // asset
    asset: Asset,
    defectDetail: DefectDetail,

    // task management
    taskManagement: TaskManagement,
    addTask: TaskDetail,
    editTask: TaskDetail,

    addSubTask: TaskDetail,
    editSubTask: TaskDetail,

    addBooking: AddOrEditBooking,
    editBooking: AddOrEditBooking,
    booking: Booking,
  },
  {
    headerMode: 'none',
    initialRouteName: 'splash',
    defaultNavigationOptions: {
      gesturesEnabled: false,
    },
  }
);
