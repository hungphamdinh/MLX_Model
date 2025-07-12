import { useCallback } from 'react';
import NavigationService from '@NavigationService';
import _ from 'lodash';
import I18n from '@I18n';
import { Q } from '@nozbe/watermelondb';
import { DeviceEventEmitter, Platform } from 'react-native';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';

import { useStateValue, useHandlerAction } from '../../index';
import {
  createInspectionFailure,
  createInspectionRequest,
  createInspectionSuccess,
  createOnlineInspectionFailure,
  createOnlineInspectionRequest,
  createOnlineInspectionSuccess,
  deleteInspectionFailure,
  deleteInspectionRequest,
  deleteInspectionSuccess,
  getHomeInspectionsFailure,
  getHomeInspectionsRequest,
  getHomeInspectionsSuccess,
  getInspectionFormDetailFailure,
  getInspectionFormDetailOnlineFailure,
  getInspectionFormDetailOnlineRequest,
  getInspectionFormDetailOnlineSuccess,
  getInspectionFormDetailRequest,
  getInspectionFormDetailSuccess,
  getInspectionsFailure,
  getInspectionsOnlineFailure,
  getInspectionsOnlineRequest,
  getInspectionsOnlineSuccess,
  getInspectionsRequest,
  getInspectionsSuccess,
  getListStatusFailure,
  getListStatusRequest,
  getListStatusSuccess,
  getStatusConfigsFailure,
  getStatusConfigsRequest,
  getStatusConfigsSuccess,
  getWorkflowDetailFailure,
  getWorkflowDetailRequest,
  getWorkflowDetailSuccess,
  pickUpInspectionFailure,
  pickUpInspectionRequest,
  pickUpInspectionSuccess,
  releaseInspectionFailure,
  releaseInspectionRequest,
  releaseInspectionSuccess,
  saveInspectionFailure,
  saveInspectionRequest,
  saveInspectionSignaturesFailure,
  saveInspectionSignaturesRequest,
  saveInspectionSignaturesSuccess,
  saveInspectionSuccess,
  updateInspectionOfflineFailure,
  updateInspectionOfflineRequest,
  updateInspectionOfflineSuccess,
  updateInspectionSettingFailure,
  updateInspectionSettingRequest,
  updateInspectionSettingSuccess,
  updateOnlineInspectionFailure,
  updateOnlineInspectionRequest,
  updateOnlineInspectionSuccess,
  uploadInspectionDocumentFailure,
  uploadInspectionDocumentRequest,
  uploadInspectionDocumentSuccess,
  deleteOnlineInspectionRequest,
  getInspectionDetailRequest,
  getInspectionDetailSuccess,
  getInspectionDetailFailure,
  uploadInspectionSignaturesRequest,
  uploadInspectionSignaturesSuccess,
  uploadInspectionSignaturesFailure,
  getInspectionAuditLogRequest,
  getInspectionAuditLogSuccess,
  getInspectionAuditLogFailure,
  getInspectionByLinkModuleRequest,
  getInspectionByLinkModuleSuccess,
  getInspectionByLinkModuleFailure,
  linkInspectionRequest,
  linkInspectionSuccess,
  linkInspectionFailure,
  createInspectionLinkageRequest,
  createInspectionLinkageSuccess,
  createInspectionLinkageFailure,
  executeInspectionRequest,
  executeInspectionSuccess,
  executeInspectionFailure,
  unlinkInspectionLinkageRequest,
  unlinkInspectionLinkageFailure,
  unlinkInspectionLinkageSuccess,
  getInspectionSettingRequest,
  getInspectionSettingFailure,
  getInspectionSettingSuccess,
  getInspectionHeadersFailure,
  getInspectionHeadersSuccess,
  getInspectionHeadersRequest,
  getLocationsRequest,
  getLocationsSuccess,
  getLocationsFailure,
  resetLocations,
  getSignatureByWorkflowIdRequest,
  getSignatureByWorkflowIdSuccess,
  getSignatureByWorkflowIdFailure,
  resetSignatureImage,
  deleteInspectionSignatureRequest,
  deleteInspectionSignatureSuccess,
  deleteInspectionSignatureFailure,
  getQuestionTypesFailure,
  getQuestionTypesRequest,
  getQuestionTypesSuccess,
  getQuestionTypeCategoriesRequest,
  getQuestionTypeCategoriesSuccess,
  getQuestionTypeCategoriesFailure,
  getInspectionFootersRequest,
  getInspectionFootersSuccess,
  getInspectionFootersFailure,
  getInspectionLinkageDetailRequest,
  getInspectionLinkageDetailSuccess,
  getInspectionLinkageDetailFailure,
  completeInspectionRequest,
  completeInspectionSuccess,
  completeInspectionFailure,
  getChangeHistoriesRequest,
  getChangeHistoriesSuccess,
  getChangeHistoriesFailure,
  getUsersHaveJobPickedRequest,
  getUsersHaveJobPickedFailure,
  getUsersHaveJobPickedSuccess,
  GET_QUESTION_PROJECT_TYPES,
  GET_USER_ANSWER_QUESTION_IMAGE,
  GET_MY_REPORTS,
  VIEW_REPORT,
  VIEW_MY_REPORT,
  changeCameraFlashStatus,
  GET_DEFECTS,
  GET_INSPECTION_DETAIL_INFO,
} from '../Actions';
import { RequestApi } from '../../../Services';
import InspectionMgr from '../../../Services/OfflineDB/Mgr/InspectionMgr';
import FormMgr from '../../../Services/OfflineDB/Mgr/FormMgr';
import {
  convertSubmitDataFromFormEditor,
  transformFormDetailToEditor,
  transformInspectionOnline,
  transformQuestionEditorToSubmitData,
} from '../../../Transforms/InspectionTransformer';
import SyncDB from '../../../Services/OfflineDB/SyncDB';
import FormPageMgr from '../../../Services/OfflineDB/Mgr/FormPageMgr';
import WorkflowMgr from '../../../Services/OfflineDB/Mgr/WorkflowMgr';
import FormQuestionMgr from '../../../Services/OfflineDB/Mgr/FormQuestionMgr';
import { ActionType, Modules, getInspectionQuestionIconById, prefixFolder } from '../../../Config/Constants';
import StatusMgr from '../../../Services/OfflineDB/Mgr/StatusMgr';
import FormUserAnswerMgr from '../../../Services/OfflineDB/Mgr/FormUserAnswerMgr';
import SignatureImageMgr from '../../../Services/OfflineDB/Mgr/SignatureImageMgr';
import { modal, convertDate, NetWork } from '../../../Utils';
import * as file from '../../../Utils/file';
import { downLoadFile, getLiveFiles } from '../../../Services/FileService';
import { makeSyncRequest } from '../../../Services/SynchronizeService';
import useSync from '../../Sync/Hooks/UseSync';
import { handleCacheRequestFromAsyncStorage } from '../../../Utils/network';
import { setIsLinkageRequest } from '../../Sync/Actions';
import toast from '../../../Utils/toast';
import useForm from '../../../Context/Form/Hooks/UseForm';
import { getCurrentLocation } from '../../../Utils/location';
import { getMgrByTableName } from '../../../Services/OfflineDB/Mgr';
import { getDeltaChangesOnly } from '../../../Utils/inspectionChangeDetector/changeDetector';
import { transformDeltaChangesToTables } from '../../../Utils/inspectionChangeDetector/formEditorTransformer';
import logService from '../../../Services/LogService';
import SentryService from '../../../Services/SentryService';
import { formatDate } from '../../../Utils/transformData';
import FormUserAnswerQuestionImageMgr from '../../../Services/OfflineDB/Mgr/FormUserAnswerQuestionImageMgr';
import LocaleConfig from '../../../Config/LocaleConfig';
import { GET_FORM_DETAIL } from '../../Form/Actions';
import { TableNames } from '../../../Services/OfflineDB/IDGenerator';

const log = logService.extend('UseInspection');
const parentFolder = `${prefixFolder}${RNFS.DocumentDirectoryPath}/reports`;

const useInspection = () => {
  const [{ inspection, user }, dispatch] = useStateValue();
  const { doSynchronize, getLocalDBIds, ensureSyncCompleted } = useSync();
  const {
    form: { formSettings },
    getUserAnswerByParentId,
    getDetailForm,
    getFormDetailAfterDate,
  } = useForm();
  const { withErrorHandling, withLoadingAndErrorHandling } = useHandlerAction();

  // auto sync after make changes, debounce 2 minutes
  const doSyncDebounce = useCallback(
    _.debounce(() => {
      log.info('do sync debounce', new Date());
      doSynchronize();
    }, 120000),
    []
  );

  const getStatusConfigs = async () => {
    dispatch(getStatusConfigsRequest());
    try {
      let defaultStatus;
      let closedStatus;
      let inProgressStatus;
      const listStatus = await StatusMgr.getListStatus();
      _.forEach(listStatus.items, (item) => {
        if (item.isDefault) {
          defaultStatus = item;
          return;
        }
        if (item?.isIssueClosed) {
          closedStatus = item;
          return;
        }
        inProgressStatus = item;
      });

      dispatch(
        getStatusConfigsSuccess({
          defaultStatus,
          closedStatus,
          inProgressStatus,
        })
      );
      return listStatus;
    } catch (err) {
      dispatch(getStatusConfigsFailure(err));
      SentryService.captureException(err);
    }
    return null;
  };

  const getListStatus = async () => {
    dispatch(getListStatusRequest());
    try {
      const response = await StatusMgr.getListStatus();
      dispatch(getListStatusSuccess(response.items));
    } catch (err) {
      dispatch(getListStatusFailure(err));
      SentryService.captureException(err);
    }
    return null;
  };

  // inspection

  const createInspection = async (payload) => {
    try {
      log.info('createInspection', payload);
      dispatch(createInspectionRequest(payload));
      const workflow = await InspectionMgr.createInspection(payload);
      workflow.isMasterSection = formSettings?.isMasterSection;
      const formRaw = await FormMgr.getFormInspectionDetail(workflow);
      const formData = transformFormDetailToEditor(formRaw);
      NavigationService.replace('inspectionDetail', { formData, workflow });
      dispatch(createInspectionSuccess(workflow));
      log.info('createInspection success', workflow);
    } catch (err) {
      dispatch(createInspectionFailure(err));
      SentryService.captureException(err);
    }
  };

  const createOnlineInspection = async (payload, user, isCreatorAutoAssignmentOff) => {
    try {
      dispatch(createOnlineInspectionRequest(payload));
      const id = await RequestApi.createOnlineInspection(payload);

      if (isCreatorAutoAssignmentOff) {
        NavigationService.popTo('inspection');
        toast.showSuccess(I18n.t('INSPECTION_CREATE_SUCCESSFUL'));
        DeviceEventEmitter.emit('ReloadHomeInspections');
        dispatch(createOnlineInspectionSuccess());
        return null;
      }

      const result = await RequestApi.detailInspection({ id });
      const workflow = transformInspectionOnline({ items: [result] }, user, false)?.items[0];
      // only pull changes
      const synced = await makeSyncRequest(true);
      if (synced) {
        const formData = await getInspectionFormDetail(workflow, user);
        NavigationService.popTo('inspection');
        NavigationService.navigate('inspectionDetail', { formData, workflow });
        dispatch(createOnlineInspectionSuccess(result));
      }

      return result;
    } catch (err) {
      dispatch(createOnlineInspectionFailure(err));
      SentryService.captureException(err);
    }
    return null;
  };

  const updateInspectionOffline = async (payload) => {
    try {
      dispatch(updateInspectionOfflineRequest(payload));
      const response = await InspectionMgr.updateInspection(payload);
      NavigationService.goBack();
      dispatch(updateInspectionOfflineSuccess(response));
    } catch (err) {
      dispatch(updateInspectionOfflineFailure(err));
      SentryService.captureException(err);
    }
  };

  const getInspectionFormDetailOnline = async (workflowData) => {
    try {
      dispatch(getInspectionFormDetailOnlineRequest(workflowData));
      const detailInfo = await getInspectionDetailInfo({
        id: workflowData.parentId,
      });

      const workflow = {
        ...workflowData,
        ...detailInfo.workflow,
        workOrderId: detailInfo?.workOrderId,
      };

      const params = {
        parentId: workflow.parentId,
        moduleId: Modules.INSPECTION,
        creationTime: workflow.lastModificationTime
          ? workflow.lastModificationTime
          : workflow.inspection?.lastModificationTime,
        // userId: user.id,
      };

      const formData = detailInfo.formAnswer
        ? await getUserAnswerByParentId(params)
        : await getFormDetailAfterDate({
            formId: workflow.form.id,
            afterDate: workflow.lastModificationTime,
          });

      if (formData && detailInfo && !workflow?.isNotNavigate) {
        NavigationService.navigate('inspectionDetail', { formData, workflow, inspection: workflow });
      }
      dispatch(getInspectionFormDetailOnlineSuccess(workflow));
      return {
        formData,
        detailInfo,
      };
    } catch (err) {
      dispatch(getInspectionFormDetailOnlineFailure(err));
    }
    return null;
  };

  const createInspectionLinkage = async (payload) => {
    try {
      dispatch(createInspectionLinkageRequest(payload));
      const response = await RequestApi.createInspectionLinkage(payload);
      dispatch(createInspectionLinkageSuccess(response));
      return {};
    } catch (err) {
      dispatch(createInspectionLinkageFailure(err));
      SentryService.captureException(err);
    }
    return null;
  };

  const linkInspection = async (payload) => {
    try {
      dispatch(linkInspectionRequest(payload));
      const response = await RequestApi.linkInspection(payload);
      dispatch(linkInspectionSuccess(response));
      return response;
    } catch (err) {
      dispatch(linkInspectionFailure(err));
      SentryService.captureException(err);
    }
    return null;
  };

  const unlinkInspection = async (payload, moduleId) => {
    try {
      dispatch(unlinkInspectionLinkageRequest(payload, moduleId));
      const response = await RequestApi.unlinkInspection(payload, moduleId);
      dispatch(unlinkInspectionLinkageSuccess(response));
      DeviceEventEmitter.emit('reloadPMDetail', {});
      DeviceEventEmitter.emit('update_item_pm');
    } catch (err) {
      dispatch(unlinkInspectionLinkageFailure(err));
      SentryService.captureException(err);
    }
  };
  const executeInspection = async (payload, user) => {
    try {
      dispatch(executeInspectionRequest(payload.workflow.parentId));
      await RequestApi.executeInspection(payload.workflow.parentId);
      if (payload.pickedByUserId) {
        getInspectionLinkageDetail(payload, user);
      }
      dispatch(executeInspectionSuccess(true));
      return payload;
    } catch (err) {
      dispatch(executeInspectionFailure(err));
      SentryService.captureException(err);
    }
    return null;
  };

  const getInspectionLinkageDetail = async (payload, user) => {
    try {
      dispatch(getInspectionLinkageDetailRequest(payload));
      const item = await WorkflowMgr.findWorkFlowByGuid({
        ...payload.workflow,
        parentGuid: payload.guid
      });
      const formData = await getInspectionFormDetail(item, user);
      if (formData) {
        dispatch(setIsLinkageRequest(true));
        NavigationService.navigate('inspectionDetail', {
          formData,
          workflow: item,
          isDetail: true,
          fromPM: {
            isLinkage: true,
          },
        });
      }
      dispatch(getInspectionLinkageDetailSuccess(formData));
    } catch (error) {
      dispatch(getInspectionLinkageDetailFailure(error));
    }
  };

  const getInspectionDetailInfo = async (payload) => {
    const result = await RequestApi.detailInspection(payload);
    return result;
  };

  const getInspectionDetail = async (payload, navigateToDetail = true) => {
    try {
      dispatch(getInspectionDetailRequest(payload));
      const result = await RequestApi.detailInspection({
        id: payload.id,
      });
      const workflow = {
        ...result.workflow,
        isOnline: true,
        creatorUserId: result.workflow.creatorUser.id,
      };

      const params = {
        parentId: payload.id,
        moduleId: Modules.INSPECTION,
        // userId: user.id,
      };
      const formData = payload.formAnswer
        ? await getUserAnswerByParentId(params)
        : await getDetailForm(workflow.form.id);

      if (formData && result && navigateToDetail) {
        NavigationService.navigate('inspectionDetail', { formData, workflow, inspection: payload, isTeamJob });
      }
      dispatch(getInspectionDetailSuccess(result));
      return result;
    } catch (err) {
      modal.showError(err.message ? err.message : I18n.t('ERROR_SOMETHING_WENT_WRONG'));
      dispatch(getInspectionDetailFailure(err));
    }
    return null;
  };
  const getWorkFlowDetail = async (id) => {
    try {
      dispatch(getWorkflowDetailRequest(id));
      const response = await WorkflowMgr.getDetailWorkflow(id);
      dispatch(getWorkflowDetailSuccess(response));
    } catch (err) {
      modal.showError(I18n.t('ERROR_SOMETHING_WENT_WRONG'));
      dispatch(getWorkflowDetailFailure(err));
    }
    return null;
  };

  const getInspections = async (payload) => {
    try {
      const { keyword, statusIds, propertyId, sortData, typeIds } = payload;
      const type = _.size(typeIds) === 1 ? typeIds[0] : undefined;
      dispatch(getInspectionsRequest(payload));
      const response = await InspectionMgr.getList({ keyword, propertyId, statusIds, sortData, type });
      dispatch(getInspectionsSuccess(response));
    } catch (err) {
      dispatch(getInspectionsFailure(err));
      SentryService.captureException(err);
    }
  };

  const getInspectionsByLinkModule = async (payload) => {
    try {
      dispatch(getInspectionByLinkModuleRequest(payload));
      const response = await RequestApi.getInspectionByLinkModule(payload);
      dispatch(getInspectionByLinkModuleSuccess(response));
    } catch (err) {
      dispatch(getInspectionByLinkModuleFailure(err));
      SentryService.captureException(err);
    }
  };

  const getInspectionsOnline = async (payload, userId) => {
    try {
      dispatch(getInspectionsOnlineRequest(payload, userId));
      const response = await handleCacheRequestFromAsyncStorage(RequestApi.getInspectionsOnline, payload);
      dispatch(getInspectionsOnlineSuccess(transformInspectionOnline(response, userId)));
      return response;
    } catch (err) {
      dispatch(getInspectionsOnlineFailure(err));
      SentryService.captureException(err);
    }
    return null;
  };

  const getInspectionAuditLogs = async (id) => {
    try {
      dispatch(getInspectionAuditLogRequest(id));
      const response = await RequestApi.getInspectionAuditLog(id);
      dispatch(getInspectionAuditLogSuccess(response));
    } catch (err) {
      dispatch(getInspectionAuditLogFailure(err));
      SentryService.captureException(err);
    }
  };

  const getHomeInspections = async (workflowStatus, isMyJob = false, userId, inspectionJobPicked, type) => {
    try {
      dispatch(getHomeInspectionsRequest({ workflowStatus, isMyJob, userId, inspectionJobPicked, type }));
      const params = {
        page: 1,
        keyword: '',
        isMyJob,
        orderByColumn: 0,
        isDescending: true,
        type,
      };

      const defaultVal = {
        items: [],
        totalCount: 0,
      };
      const pickedUpInspections = await InspectionMgr.getList({
        keyword: '',
        statusIds: [],
        inspectionJobPicked,
        type,
      });
      pickedUpInspections.items = pickedUpInspections.items.filter((item, index) => {
        const showOfflineJobs =
          !item.status?.isIssueClosed || !(item.status?.isIssueClosed && item.syncStatus === 'synced');
        return index < 10 && showOfflineJobs;
      });
      let newInspections = defaultVal;
      let completedInspections = defaultVal;
      let allInspections = defaultVal;
      let inProgressInspections = defaultVal;

      if (NetWork.isConnected) {
        newInspections = await RequestApi.getInspectionsOnline({
          ...params,
          statusIds: workflowStatus.newStatus,
        });
        completedInspections = await RequestApi.getInspectionsOnline({
          ...params,
          statusIds: workflowStatus.completed,
        });
        allInspections = await RequestApi.getInspectionsOnline({
          ...params,
        });
        inProgressInspections = await RequestApi.getInspectionsOnline({
          ...params,
          statusIds: workflowStatus.inProgress,
        });
      }

      // const allInspections = await InspectionMgr.getList(1, '', undefined, []);

      dispatch(
        getHomeInspectionsSuccess({
          newInspections: transformInspectionOnline(newInspections, userId),
          pickedUpInspections,
          completedInspections: transformInspectionOnline(completedInspections, userId),
          inProgressInspections: transformInspectionOnline(inProgressInspections, userId),
          allInspections: transformInspectionOnline(allInspections, userId),
        })
      );
    } catch (err) {
      dispatch(getHomeInspectionsFailure(err));
      toast.showError(err.message);
      SentryService.captureException(err);
    }
  };

  const getInspectionFormDetail = async (workflow, user) => {
    try {
      dispatch(getInspectionFormDetailRequest(workflow, user));
      await getLocalDBIds();
      // get detail form of workflow
      await getSignatureByWorkflowId(workflow.parentGuid);
      workflow.isMasterSection = formSettings?.isMasterSection;
      const response = await FormMgr.getFormInspectionDetail(workflow, user);
      const result = transformFormDetailToEditor(response);
      dispatch(getInspectionFormDetailSuccess(result));
      SyncDB.orginalInspectionForm = result;
      return result;
    } catch (err) {
      modal.showError('ERROR_SOMETHING_WENT_WRONG');
      dispatch(getInspectionFormDetailFailure(err));
      SentryService.captureException(err);
    }
    return null;
  };

  const updateOnlineInspections = async (payload, callBack) => {
    try {
      const {
        isRequiredLocation,
        isRequiredSignature,
        teamAssigneeId,
        teamId,
        workflow: { subject },
      } = payload;
      dispatch(updateOnlineInspectionRequest(payload));
      const response = await RequestApi.requestUpdateInspection(payload);
      dispatch(updateOnlineInspectionSuccess(response));
      if (callBack) {
        DeviceEventEmitter.emit('ReloadHomeInspections', {});
        callBack({ subject, isRequiredLocation, isRequiredSignature, teamAssignee: [teamAssigneeId], team: [teamId] });
        DeviceEventEmitter.emit('save_inspection_success', {});
      }

      return response;
    } catch (err) {
      dispatch(updateOnlineInspectionFailure(err));
      SentryService.captureException(err);
    }
    return null;
  };

  const uploadInspectionDocument = async (documentId, uploadFiles) => {
    try {
      dispatch(uploadInspectionDocumentRequest({ documentId, uploadFiles }));
      const result = await RequestApi.uploadInspectionDocument(documentId, uploadFiles);
      dispatch(uploadInspectionDocumentSuccess(result));
      return result;
    } catch (err) {
      dispatch(uploadInspectionDocumentFailure(err));
      SentryService.captureException(err);
    }
    return null;
  };

  const completeInspection = async (workflow) => {
    try {
      log.info('completeInspection', workflow);
      dispatch(completeInspectionRequest(workflow));
      const closedStatus = await StatusMgr.getClosedStatus();
      const { locations } = inspection;
      if (!closedStatus) {
        const errorMessage = I18n.t('INSPECTION_CLOSED_STATUS_NOT_EXIST');
        modal.showError(errorMessage);
        throw Error(errorMessage);
      }

      SyncDB.action(async () => {
        await WorkflowMgr.update(workflow.id, (obj) => {
          obj.subject = workflow.subject;
          obj.statusId = closedStatus.id;
          obj.closedDate = convertDate.stringToISOString(new Date());
        });

        await InspectionMgr.update(workflow.parentGuid, (obj) => {
          obj.lastModificationTime = convertDate.stringToISOString(new Date());
          if (workflow.inspection?.isRequiredLocation) {
            obj.longitude = locations?.longitude;
            obj.latitude = locations?.latitude;
          }
        });
      });

      toast.showSuccess(I18n.t('INSPECTION_SAVE_SUCCESSFULLY'));
      log.info('completeInspectionSuccess');
      NavigationService.goBack();
      DeviceEventEmitter.emit('ReloadHomeInspections');
      dispatch(completeInspectionSuccess(workflow));
    } catch (err) {
      dispatch(completeInspectionFailure(err));
      SentryService.captureException(err);
      log.info('completeInspectionFailure');
    }
  };

  const saveInspectionV2 = async (formData) => {
    try {
      if (SyncDB.isAutoSaveProcessing) {
        SyncDB.queueAutoSave = formData;
        return;
      }

      SyncDB.isAutoSaveProcessing = true;
      // dispatch(
      //   saveInspectionRequest({
      //     formData,
      //   })
      // );

      const deltaChanges = getDeltaChangesOnly(SyncDB.orginalInspectionForm, formData);
      const tableChanges = transformDeltaChangesToTables(deltaChanges);
      log.warn('tableChanges', tableChanges);
      await SyncDB.action(async () => {
        const actionPromises = _.keys(deltaChanges).map((tableName) => {
          const { created, updated, deleted } = tableChanges[tableName];
          const tableMgr = getMgrByTableName(tableName);
          const createPromise = tableMgr.batchCreate(created);
          let updatePromise;
          if (tableName === TableNames.formUserAnswerQuestionImage) {
            updatePromise = FormUserAnswerQuestionImageMgr.handleUpdateAnswerImage(updated);
          } else {
            tableMgr.batchUpdate(updated);
          }
          const removePromise = tableMgr.batchRemove(deleted.map((item) => item.id));
          return Promise.all([createPromise, updatePromise, removePromise]);
        });
        await Promise.all(actionPromises);
        if (actionPromises.length > 0) {
          await WorkflowMgr.update(formData.workflowGuid, (obj) => {
            obj._raw._status = 'updated';
          });

          // trigger sync process
          doSyncDebounce();
        }
      });
      // dispatch(saveInspectionSuccess(tableChanges));
      SyncDB.orginalInspectionForm = formData;

      // check queue autosave
      if (SyncDB.queueAutoSave) {
        SyncDB.isAutoSaveProcessing = false;
        saveInspectionV2(SyncDB.queueAutoSave);
        SyncDB.queueAutoSave = null;
      }
    } catch (err) {
      // dispatch(saveInspectionFailure(err));
      modal.showError(err.message || I18n.t('ERROR_SOMETHING_WENT_WRONG'));
      log.info('saveInspectionFormData', formData);
      log.info('inspectionFormOriginal', SyncDB.orginalInspectionForm);
      log.error('saveInspectionFailure', err);
      SentryService.captureException(err);
    } finally {
      SyncDB.isAutoSaveProcessing = false;
    }
  };

  // inspection offline
  const saveInspection = async (formData, originalForm, workflow, user, isUpdatedSignature, fromPM) => {
    dispatch(
      saveInspectionRequest({
        formData,
        originalForm,
        workflow,
        user,
        isUpdatedSignature,
        fromPM,
      })
    );
    try {
      const params = convertSubmitDataFromFormEditor(formData, originalForm);
      const { locations } = inspection;
      const { adds: formPageAdds, updates: formPageUpdates, removes: formPageRemoves } = params;
      const formId = params.id;
      await SyncDB.action(async () => {
        const closedStatus = await StatusMgr.getClosedStatus();
        if (!closedStatus) {
          const errorMessage = I18n.t('INSPECTION_CLOSED_STATUS_NOT_EXIST');
          modal.showError(errorMessage);
          throw Error(errorMessage);
        }

        await WorkflowMgr.update(workflow.id, (obj) => {
          obj.subject = workflow.subject;
          obj.statusId = isUpdatedSignature ? closedStatus.id : workflow.statusId;
          obj.closedDate = isUpdatedSignature ? convertDate.stringToISOString(new Date()) : null;
        });

        await InspectionMgr.update(workflow.parentGuid, (obj) => {
          obj.lastModificationTime = convertDate.stringToISOString(new Date());
          if (isUpdatedSignature && workflow.inspection?.isRequiredLocation) {
            obj.longitude = locations?.longitude;
            obj.latitude = locations?.latitude;
          }
        });
        // get form user answer, create a new one if it isn't exist
        const inspectionEntity = await InspectionMgr.find(workflow.parentGuid);
        let formUserAnswer = await FormUserAnswerMgr.queryOne(Q.where('parentGuid', workflow.parentGuid));
        if (!formUserAnswer) {
          formUserAnswer = await FormUserAnswerMgr.createInspectionUserAnswer(
            inspectionEntity.id,
            `${_.get(user, 'id')}`
          );
        }

        // create form pages
        await Promise.all(
          formPageAdds.map(async (formPage) => {
            const formQuestions = formPage.formQuestions;
            const formPageResult = await FormPageMgr.create((obj) => {
              obj.formGuid = formId;
              obj.name = formPage.name;
              obj.uid = formPage.uid;
              obj.formQuestionTypeCategoryId = formPage.formQuestionTypeCategoryId;
            });
            // add questions
            await Promise.all(
              formQuestions.map(async (formQuestion, questionIndex) => {
                const question = transformQuestionEditorToSubmitData(formQuestion, true);
                const questionParam = {
                  ...question,
                  formPageGuid: formPageResult.id,
                  formUserAnswerGuid: formUserAnswer.id,
                  questionIndex,
                };
                return FormQuestionMgr.addOrEditQuestion(questionParam);
              })
            );
            return formPageResult;
          })
        );

        /**
         * Remove form pages
         * Remove all form question belong to form page
         * Remove formQuestionAnswer belong to form page
         * Remove forUserAnswerQuestions
         */

        await FormPageMgr.batchRemove(formPageRemoves.map((formPage) => formPage.id));

        // update form pages
        await Promise.all(
          formPageUpdates.map(async (formPage) => {
            const { adds: questionAdds, updates: questionUpdates, removes: questionRemoves } = formPage;
            if (formPage.actionType === ActionType.UPDATE) {
              await FormPageMgr.update(formPage.id, (obj) => {
                obj.name = formPage.name;
                obj.formQuestionTypeCategoryId = formPage.formQuestionTypeCategoryId;
              });
            }
            // handle questions
            // add questions
            await Promise.all(
              questionAdds.map(async (question) => {
                const transQuestion = transformQuestionEditorToSubmitData(question, true);
                const questionParam = {
                  ...transQuestion,
                  formPageGuid: formPage.id,
                  formUserAnswerGuid: formUserAnswer.id,
                };
                return FormQuestionMgr.addOrEditQuestion(questionParam);
              })
            );

            // remove questions
            await FormQuestionMgr.batchRemove(questionRemoves.map((question) => question.id));

            // update questions
            await Promise.all(
              questionUpdates.map(async (formQuestion) => {
                const question = transformQuestionEditorToSubmitData(formQuestion, true);
                const questionParam = {
                  ...question,
                  formUserAnswerGuid: formUserAnswer.id,
                };
                if (question.actionType === ActionType.UPDATE) {
                  await FormQuestionMgr.addOrEditQuestion(questionParam);
                  // await FormQuestionAnswerMgr.createOrUpdateAnswers(questionParam.answers, question.id);
                }
              })
            );
          })
        );

        // sort sections only apply for the update form
        if (originalForm) {
          const pageIds = formData.formPages
            .filter((formPage) => formPage.uid)
            .map((formPage) => formPage.id || formPage.uid);
          await FormPageMgr.sortPages(pageIds);
        }
      });

      dispatch(saveInspectionSuccess());

      if (fromPM) {
        if (fromPM.isLinkage) {
          doSynchronize();
        }
      }
      // NavigationService.goBack();

      return formId;
    } catch (err) {
      modal.showError(err.message || I18n.t('ERROR_SOMETHING_WENT_WRONG'));
      dispatch(saveInspectionFailure(err));
      SentryService.captureException(err);
    }
    return null;
  };

  const uploadInspectionSignature = async (params) => {
    dispatch(uploadInspectionSignaturesRequest(params));
    try {
      const { signatures, workflowId } = params;
      // signatures.map(item => item.file = item.path);
      const fileLive = await getLiveFiles(signatures);
      if (fileLive.existedFiles.length > 0 && fileLive.notFounds.length === 0) {
        const response = await RequestApi.uploadFileInspectionSignatures(signatures, workflowId);
        if (response) {
          dispatch(uploadInspectionSignaturesSuccess([]));
          NavigationService.goBack();
          DeviceEventEmitter.emit('update_signatures');
        }
      }
    } catch (err) {
      dispatch(uploadInspectionSignaturesFailure(err));
    }
  };

  const saveInspectionSignatures = async (payload) => {
    try {
      const { workflowParentId, signatures, index, workflowId } = payload;
      dispatch(saveInspectionSignaturesRequest(payload));
      await SyncDB.action(async () => {
        // save paths to signature images table for syncing purpose
        const signatureImages = await Promise.all(
          signatures.map(async ({ guid, path, title, description, moduleName }) => {
            if (!guid) {
              return SignatureImageMgr.create((obj) => {
                obj.path = path;
                obj.title = title;
                obj.description = description;
                obj.workflowGuid = workflowId;
                obj.referenceId = workflowParentId;
                obj.index = `${index}`;
                obj.moduleName = moduleName;
              });
            }
            return SignatureImageMgr.update(guid, (obj) => {
              obj.path = path;
              obj.title = title;
              obj.description = description;
              obj.moduleName = moduleName;
            });
          })
        );
        dispatch(saveInspectionSignaturesSuccess(_.first(signatureImages)));
        // go back

        return signatureImages;
      });
      NavigationService.goBack();

      getSignatureByWorkflowId(workflowParentId);
      toast.showSuccess(I18n.t('INSPECTION_SIGNATURE_UPDATE_INFO_SUCCESSFULLY'));
      // return _.first(signatures);
      // DeviceEventEmitter.emit('update_signatures');
    } catch (err) {
      modal.showError(err.message || I18n.t('ERROR_SOMETHING_WENT_WRONG'));
      dispatch(saveInspectionSignaturesFailure(err));
      SentryService.captureException(err);
    }
    return null;
  };

  const deleteInspectionSignature = async (payload) => {
    try {
      const { signature, workflowParentId } = payload;
      dispatch(deleteInspectionSignatureRequest(payload));
      await SyncDB.action(async () => {
        SignatureImageMgr.remove(signature.guid);

        return signature;
      });
      getSignatureByWorkflowId(workflowParentId);
      toast.showSuccess(I18n.t('INSPECTION_SIGNATURE_DELETE_SUCCESSFULLY'));
      dispatch(deleteInspectionSignatureSuccess(signature));
    } catch (err) {
      modal.showError(err.message || I18n.t('ERROR_SOMETHING_WENT_WRONG'));
      dispatch(deleteInspectionSignatureFailure(err));
      SentryService.captureException(err);
    }
    return null;
  };

  const handleFileDownload = async ({ data, parentId, propertyName, date, isCompleted }) => {
    const { fileUrl, creationTime } = data;
    const previewFile = !isCompleted ? '_draft' : '';
    const fileName = `${propertyName} - ${formatDate(date, 'DDMMYYYY')} - id${parentId}${previewFile} - ${formatDate(
      creationTime,
      'DDMMYYYY_HH_mm_ss'
    )}`;
    const modifiedFileName = fileName.replace(/\//g, '_');
    const localFile = `${parentFolder}/${modifiedFileName}.pdf`;

    await file.ensureFolder(parentFolder);
    const isExist = await RNFS.exists(localFile);
    if (!isExist || !isCompleted) {
      await downLoadFile(fileUrl, localFile, null, 'GET');
    }

    await FileViewer.open(localFile);
    return localFile;
  };

  const viewReport = async ({ workflowData, isOnlineForm = false, isCompleted = true }) => {
    const { id, parentId } = workflowData;
    const unsyncWorkflow = await WorkflowMgr.getUnsyncWorkflow(id);
    if (unsyncWorkflow) {
      modal.showError(I18n.t('INSPECTION_MUST_SYNC_MESSAGE'));
      return;
    }
    let workflow = null;
    if (isOnlineForm) {
      workflow = {
        parentId,
        // closedDate: baseWorkflow.closedDate,
      };
    } else {
      workflow = await WorkflowMgr.find(id);
      if (!workflow.parentId) {
        modal.showError(I18n.t('INSPECTION_PLEASE_SYNC_INSPECTION_FIRST'));
        return;
      }
    }
    const propertyName = workflowData?.inspectionPropertyName || workflowData?.property?.name;
    const date = workflowData.startDate || workflowData.closedDate || new Date();

    const result = await RequestApi.downloadInspectionReport(workflow.parentId);
    if (result.success) {
      toast.showSuccess(I18n.t('REPORT_SENT_TO_EMAIL', undefined, user.user?.emailAddress));
      return null;
    }
    if (result?.fileUrl) {
      return handleFileDownload({
        data: result,
        parentId,
        propertyName,
        date,
        isCompleted,
      });
    }
    return null;
  };

  const deleteInspection = async (workflow, formDetail) => {
    try {
      dispatch(deleteInspectionRequest(formDetail));
      await InspectionMgr.deleteInspection(workflow, formDetail);

      dispatch(deleteInspectionSuccess());
    } catch (err) {
      toast.showExceptionMessage(err);
      dispatch(deleteInspectionFailure(err));
      SentryService.captureException(err);
    }
    return false;
  };

  const deleteOnlineInspection = async (id) => {
    try {
      dispatch(deleteOnlineInspectionRequest(id));
      const response = await RequestApi.deleteInspection(id);
      dispatch(deleteInspectionSuccess(response));
      DeviceEventEmitter.emit('ReloadHomeInspections');
    } catch (err) {
      toast.showExceptionMessage(err);
      dispatch(deleteInspectionFailure(err));
      SentryService.captureException(err);
    }
    return false;
  };

  const getInspectionSetting = async () => {
    try {
      dispatch(getInspectionSettingRequest());
      const response = await NetWork.handleCacheRequest(RequestApi.getInspectionSetting);
      dispatch(getInspectionSettingSuccess(response));
    } catch (err) {
      dispatch(getInspectionSettingFailure(err));
      SentryService.captureException(err);
    }
  };

  const updateInspectionSetting = async (payload) => {
    try {
      dispatch(updateInspectionSettingRequest());
      await RequestApi.updateInspectionSetting(payload);
      dispatch(updateInspectionSettingSuccess(payload));
      NavigationService.goBack();
    } catch (err) {
      dispatch(updateInspectionSettingFailure(err));
      SentryService.captureException(err);
    }
  };

  const pickUpInspection = async (payload, fromListView) => {
    try {
      dispatch(pickUpInspectionRequest(payload));
      const response = await RequestApi.pickUpInspection(payload);
      // only pull changes
      await makeSyncRequest(true);
      dispatch(pickUpInspectionSuccess(response));
      const event = fromListView ? 'ReloadInspectionList' : 'ReloadHomeInspections';
      DeviceEventEmitter.emit(event, {});
      // NavigationService.goBack();
    } catch (err) {
      dispatch(pickUpInspectionFailure(err));
      SentryService.captureException(err);
    }
  };

  const releaseInspection = async (remoteId, id, fromListView) => {
    try {
      dispatch(releaseInspectionRequest({ remoteId, id }));
      const response = await RequestApi.releaseInspection(remoteId);

      // destroyPermanently inspection in local database
      await SyncDB.action(async () => {
        const data = await WorkflowMgr.collection.query(Q.where('id', Q.eq(id)));
        const workflow = data[0];
        if (workflow) {
          await workflow.destroyPermanently();
        }
      });
      const event = fromListView ? 'ReloadInspectionList' : 'ReloadHomeInspections';
      DeviceEventEmitter.emit(event, {});
      dispatch(releaseInspectionSuccess(response));
      return true;
    } catch (err) {
      dispatch(releaseInspectionFailure(err));
      SentryService.captureException(err);
      toast.showExceptionMessage(err);
    }
    return null;
  };

  const getInspectionHeaders = async () => {
    try {
      dispatch(getInspectionHeadersRequest());
      const response = await NetWork.handleCacheRequest(RequestApi.getInspectionHeaders);
      dispatch(getInspectionHeadersSuccess(response.items));
    } catch (err) {
      dispatch(getInspectionHeadersFailure(err));
      SentryService.captureException(err);
    }
  };

  const getInspectionFooters = async () => {
    try {
      dispatch(getInspectionFootersRequest());
      const response = await NetWork.handleCacheRequest(RequestApi.getInspectionFooters);
      dispatch(getInspectionFootersSuccess(response.items));
    } catch (err) {
      dispatch(getInspectionFootersFailure(err));
      SentryService.captureException(err);
    }
  };

  const getLocations = async () => {
    try {
      dispatch(getLocationsRequest());
      getCurrentLocation((data) => {
        if (data) {
          dispatch(getLocationsSuccess(data));
        } else {
          dispatch(getLocationsFailure(null));
        }
      });
    } catch (err) {
      dispatch(getLocationsFailure(err));
      SentryService.captureException(err);
    }
    return null;
  };

  const resetInspectionLocations = async () => {
    dispatch(resetLocations());
  };

  const resetInspectionSignatureImage = () => {
    dispatch(resetSignatureImage());
  };

  const getSignatureByWorkflowId = async (id) => {
    try {
      dispatch(getSignatureByWorkflowIdRequest(id));
      const result = await SignatureImageMgr.getSignatureByWorkflowId(id);
      dispatch(getSignatureByWorkflowIdSuccess(result));
      return result;
    } catch (err) {
      dispatch(getSignatureByWorkflowIdFailure(err));
      SentryService.captureException(err);
    }
    return null;
  };

  const getQuestionTypes = async (payload) => {
    try {
      dispatch(getQuestionTypesRequest());
      const response = await NetWork.handleCacheRequest(RequestApi.getQuestionTypes, payload);
      const transformQuestionTypes = response.map((item) => getInspectionQuestionIconById(item));
      dispatch(getQuestionTypesSuccess(transformQuestionTypes));
    } catch (err) {
      dispatch(getQuestionTypesFailure(err));
      SentryService.captureException(err);
    }
  };

  const getQuestionTypeCategories = async () => {
    try {
      dispatch(getQuestionTypeCategoriesRequest());
      const response = await NetWork.handleCacheRequest(RequestApi.getQuestionTypeCategories);
      dispatch(getQuestionTypeCategoriesSuccess(response));
    } catch (err) {
      dispatch(getQuestionTypeCategoriesFailure(err));
      SentryService.captureException(err);
    }
  };

  const getChangeHistories = async (payload) => {
    try {
      dispatch(getChangeHistoriesRequest(payload));
      const response = await RequestApi.getFormChanges(payload);
      dispatch(getChangeHistoriesSuccess(response));
    } catch (err) {
      dispatch(getChangeHistoriesFailure(err));
    }
  };

  const getUsersHaveJobPicked = async (params) => {
    try {
      dispatch(getUsersHaveJobPickedRequest(params));
      const response = await RequestApi.getUserPickedByJob(params);
      dispatch(getUsersHaveJobPickedSuccess(response));
      return response;
    } catch (err) {
      dispatch(getUsersHaveJobPickedFailure(err));
    }
    return null;
  };

  const getProjectTypes = async () => {
    const results = await NetWork.handleCacheRequest(RequestApi.getQuestionProjectType);
    return results;
  };

  const getUserAnswerQuestionImage = async (id) => {
    const result = await FormUserAnswerQuestionImageMgr.find(id);
    return result;
  };

  const getMyReports = async (params) => {
    const results = await RequestApi.getMyReports(params);
    return results;
  };

  const viewMyReport = async (params) => {
    // Avoid special characters.
    const fileExtension = params.fileName.split('.').pop();
    const fileNameWithoutExtension = params.fileName.slice(0, -(fileExtension.length + 1));
    const sanitizedFileNameWithoutExtension = fileNameWithoutExtension.replace(/[^a-zA-Z0-9]/g, '_');
    const sanitizedFileName = `${sanitizedFileNameWithoutExtension}.${fileExtension}`;

    // Construct the full local file path
    const localFile = `${parentFolder}/${sanitizedFileName}`;
    await file.ensureFolder(parentFolder);
    const isExist = await RNFS.exists(localFile);
    if (!isExist) {
      await RequestApi.downloadMyReport(
        {
          guid: params.file.guid,
          fileName: params.fileName,
          moduleId: Modules.INSPECTION,
        },
        localFile
      );
    }
    await FileViewer.open(localFile);
    return localFile;
  };

  const switchCameraFlashStatus = () => {
    dispatch(changeCameraFlashStatus());
  };

  const getDefects = async (params) => {
    const response = await RequestApi.getListDefect(params.id);
    return response;
  };

  return {
    inspection,
    getWorkFlowDetail,
    createInspection,
    getInspections,
    getInspectionFormDetail,
    saveInspection,
    getStatusConfigs,
    saveInspectionSignatures,
    viewReport: withLoadingAndErrorHandling(VIEW_REPORT, viewReport),
    getHomeInspections,
    deleteInspection,
    getInspectionsOnline,
    updateOnlineInspections,
    getInspectionDetail,
    getInspectionFormDetailOnline,
    getInspectionAuditLogs,
    uploadInspectionSignature,
    getListStatus,
    updateInspectionOffline,
    createOnlineInspection,
    getInspectionsByLinkModule,
    linkInspection,
    createInspectionLinkage,
    executeInspection,
    unlinkInspection,
    getInspectionSetting,
    updateInspectionSetting,
    pickUpInspection,
    releaseInspection,
    uploadInspectionDocument,
    deleteOnlineInspection,
    getInspectionHeaders,
    getInspectionFooters,
    getLocations,
    resetInspectionLocations,
    getSignatureByWorkflowId,
    resetInspectionSignatureImage,
    deleteInspectionSignature,
    getQuestionTypes,
    getQuestionTypeCategories,
    getInspectionLinkageDetail,
    saveInspectionV2,
    completeInspection,
    getChangeHistories,
    getUsersHaveJobPicked,
    getProjectTypes: withErrorHandling(GET_QUESTION_PROJECT_TYPES, getProjectTypes),
    getUserAnswerQuestionImage: withErrorHandling(GET_USER_ANSWER_QUESTION_IMAGE, getUserAnswerQuestionImage),
    getMyReports: withErrorHandling(GET_MY_REPORTS, getMyReports),
    viewMyReport: withLoadingAndErrorHandling(VIEW_MY_REPORT, viewMyReport),
    switchCameraFlashStatus,
    getDefects: withErrorHandling(GET_DEFECTS, getDefects),
    getInspectionDetailInfo: withLoadingAndErrorHandling(GET_INSPECTION_DETAIL_INFO, getInspectionDetailInfo),
  };
};

export default useInspection;
