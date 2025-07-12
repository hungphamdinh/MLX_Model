import propertyReducer from './Property/Reducers';
import teamReducer from './Team/Reducers';
import formReducer from './Form/Reducers';
import homeReducer from './Home/Reducers';
import userReducer from './User/Reducers';
import syncReducer from './Sync/Reducers';
import inspectionReducer from './Inspection/Reducers';
import surveyReducer from './Survey/Reducers';
import fileReducer from './File/Reducers';
import meterReadingReducer from './MeterReading/Reducers';
import feeReducer from './Fee/Reducers';
import jobRequestReducer from './JobRequest/Reducers';
import planMaintenanceReducer from './PlanMaintenance/Reducers';
import inventoryReducer from './Inventory/Reducers';
import deliveryReducer from './Delivery/Reducers';
import conversationReducer from './Conversation/Reducers';
import notificationReducer from './Notification/Reducers';
import appReducer from './App/Reducers';
import attendanceReducer from './Attendance/Reducers';
import feedbackReducer from './Feedback/Reducers';
import visitorReducer from './Visitor/Reducers';
import workflowReducer from './Workflow/Reducers';
import inventoryRequestReducer from './InventoryRequest/Reducers';
import assetReducer from './Asset/Reducers';
import taskMangementReducer from './TaskManagement/Reducers';
import tenantReducer from './Tenant/Reducers';
import bookingReducer from './Booking/Reducers'

export default (
  {
    property,
    team,
    form,
    home,
    user,
    sync,
    inspection,
    survey,
    file,
    fee,
    meterReading,
    jobRequest,
    planMaintenance,
    inventory,
    delivery,
    conversation,
    notification,
    app,
    attendance,
    feedback,
    visitor,
    workflow,
    inventoryRequest,
    asset,
    taskManagement,
    tenant,
    booking,
  },
  action
) => ({
  property: propertyReducer(property, action),
  meterReading: meterReadingReducer(meterReading, action),
  form: formReducer(form, action),
  team: teamReducer(team, action),
  home: homeReducer(home, action),
  user: userReducer(user, action),
  sync: syncReducer(sync, action),
  inspection: inspectionReducer(inspection, action),
  survey: surveyReducer(survey, action),
  delivery: deliveryReducer(delivery, action),
  file: fileReducer(file, action),
  fee: feeReducer(fee, action),
  jobRequest: jobRequestReducer(jobRequest, action),
  planMaintenance: planMaintenanceReducer(planMaintenance, action),
  inventory: inventoryReducer(inventory, action),
  conversation: conversationReducer(conversation, action),
  notification: notificationReducer(notification, action),
  app: appReducer(app, action),
  attendance: attendanceReducer(attendance, action),
  feedback: feedbackReducer(feedback, action),
  visitor: visitorReducer(visitor, action),
  workflow: workflowReducer(workflow, action),
  inventoryRequest: inventoryRequestReducer(inventoryRequest, action),
  asset: assetReducer(asset, action),
  taskManagement: taskMangementReducer(taskManagement, action),
  tenant: tenantReducer(tenant, action),
  booking: bookingReducer(booking, action)
});
