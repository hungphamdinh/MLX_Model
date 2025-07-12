import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import I18n from '@I18n';
import { NavigationEvents } from '@react-navigation/compat';
import { FormProvider, useForm } from 'react-hook-form';
import _ from 'lodash';
import { Spacer } from '@Elements';
import NavigationService from '@NavigationService';
import { Alert, DeviceEventEmitter } from 'react-native';
import moment from 'moment';
import BaseLayout from '../../../Components/Layout/BaseLayout';
import { FormDate, FormDocumentPicker, FormDropdown, FormInput, FormLazyDropdown } from '../../../Components/Forms';
import AwareScrollView from '../../../Components/Layout/AwareScrollView';
import Box from '../../../Elements/Box';
import Row from '../../../Components/Grid/Row';
import useTeam from '../../../Context/Team/Hooks/UseTeam';
import usePlanMaintenance from '../../../Context/PlanMaintenance/Hooks/UsePlanMaintenance';
import { ModuleNames, Modules, PM_STATUS_ID, INSPECTION_LINKAGE_JOB_TYPE } from '../../../Config/Constants';

import AddTaskButton from '../../../Components/JobRequests/AddTaskButton';
import FloatingConversation from '../../../Components/modalChat/FloatingConversation';
import RecurrenceSetting from '../../../Components/PlanMaintainance/RecurrenceSelect';
import ListInspectionLinkage from '../../../Components/InnovatorInspection/ListInpsectionLinkage';
import useInspection from '../../../Context/Inspection/Hooks/UseInspection';
import { parseDate } from '../../../Utils/transformData';
import SyncMgr from '../../../Services/OfflineDB/Mgr/SyncMgr';
import useSync from '../../../Context/Sync/Hooks/UseSync';
import useUser from '../../../Context/User/Hooks/UseUser';
import { modal, convertDate } from '../../../Utils';
import { useYupValidationResolver } from '../../../Utils/hook';
import useFile from '../../../Context/File/Hooks/UseFile';

const AddOrEditPM = ({ navigation }) => {
  const [jobType, setJobType] = useState('');
  const [inspectionJob, setInspectionJob] = useState({});
  const {
    isLoading,
    planMaintenance: {
      planCategories: { priorities, status },
      listAssets,
      teamPlans,
      pmDetail,
      defaultStatusId,
      workflowLinkage,
    },
    editPM,
    createPM,
    getListAssets,
    getCategoriesPlan,
    getTeamPlans,
    detailPM,
    filterInspectionsSync,
  } = usePlanMaintenance();
  const {
    team: { usersInTeam, listObserver },
    getUserInTeam,
    getListObserver,
  } = useTeam();

  const {
    getFileReference,
    file: { fileUrls },
  } = useFile();
  const inspection = useInspection();

  const { unlinkInspection, viewReport, executeInspection, releaseInspection, getInspectionLinkageDetail } = inspection;

  const {
    user: { user },
  } = useUser();
  const {
    sync: { inSyncProgress, lock },
    syncDataToExecute,
    doSynchronize,
    getListUnSync,
  } = useSync();

  const inspectionLoading = inspection.inspection.isLoading;

  let statusId = 0;
  if (pmDetail) {
    statusId = pmDetail?.status?.id;
  }
  const isAddNew = _.get(navigation, 'state.routeName') === 'createPlan';
  const isSeries = navigation.getParam('isSeries');

  const id = navigation.getParam('id');
  const submitRequest = isAddNew ? createPM : editPM;
  const title = isAddNew ? I18n.t('AD_NEW_PM_TITLE_HEADER') : I18n.t('AD_EDIT_PM');

  const isClosed = statusId === PM_STATUS_ID.CLOSED && !isAddNew;
  const hadRecurrence = isSeries && !!pmDetail?.schedule;
  let defaultAssets = '';
  if (pmDetail && !isAddNew) {
    defaultAssets = pmDetail.assets.map((item) => item.assetName).join(', ');
  }
  const disableAssets = !isAddNew && (hadRecurrence || _.size(workflowLinkage) > 0);

  let newSchedule = null;
  if (!isAddNew && pmDetail) {
    newSchedule = {
      ...pmDetail.schedule,
      startTime: pmDetail.startDate,
      endTime: pmDetail.endDate,
    };
  }

  const requiredMessage = I18n.t('FORM_THIS_FIELD_IS_REQUIRED');
  const validationSchema = Yup.object().shape({
    statusId: Yup.number().required(requiredMessage),
    assetIds: Yup.array().required(requiredMessage),
    priorityId: Yup.number().required(requiredMessage),
    teamId: Yup.number().required(requiredMessage),
    userIds: Yup.array().required(requiredMessage),
    observerUserId: Yup.number().required(requiredMessage),
    // startDate: Yup.string().required(requiredMessage),
    startDate: Yup.string()
      .nullable()
      .test('StartDate err', requiredMessage, function (value) {
        const recurrence = this.parent.recurrence;
        return !(!recurrence && !value);
      }),
    name: Yup.string().required(requiredMessage),
    description: Yup.string().required(requiredMessage),
  });

  const formMethods = useForm({
    resolver: useYupValidationResolver(validationSchema),
    defaultValues: {
      id: undefined,
      name: undefined,
      statusId: defaultStatusId,
      paymentStatusId: undefined,
      startDate: undefined,
      endDate: undefined,
      actualStartDate: undefined,
      actualEndDate: undefined,
      nextStartDate: undefined,
      priorityId: undefined,
      description: undefined,
      teamId: undefined,
      userIds: [],
      assetIds: [],
      observerUserId: undefined,
      images: [],
      recurrence: null,
      isCurrentSchedule: false,
      isRemoveRecurrence: false,
    },
  });

  const { setValue, watch } = formMethods;

  useEffect(() => {
    if (!inSyncProgress) {
      if (jobType === INSPECTION_LINKAGE_JOB_TYPE.PICKED_UP) {
        executeJob(inspectionJob);
      }
      if (jobType === INSPECTION_LINKAGE_JOB_TYPE.RELEASED) {
        getInspectionLinkageDetail(inspectionJob, user);
      }
      setJobType('');
    }
  }, [jobType, inSyncProgress]);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('reloadPMDetail', () => detailPM({ id }));
    initData();
    if (!isAddNew) {
      detailPM({
        id,
      });
    }
    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (fileUrls.length > 0) {
      setValue('images', fileUrls);
    }
  }, [fileUrls.length]);

  useEffect(() => {
    if (pmDetail) {
      if (teamPlans.length > 0) {
        const { teamId } = pmDetail;
        if (teamId) {
          getUserInTeam(teamId);
        }
      }
    }
  }, [pmDetail]);

  useEffect(() => {
    if (pmDetail) {
      formMethods.reset(getInitialValuesForUpdate());
    }
  }, [pmDetail]);

  const initData = async () => {
    getCategoriesPlan();
    getAssets();
    getTeamPlans();
    getListObserver(ModuleNames.PLAN_MAINTENANCE);
    syncData();
  };

  const syncData = async () => {
    const isSyncCompleted = await SyncMgr.getSyncStatus();
    if (!isSyncCompleted) {
      doSynchronize();
    }
  };
  const getAssets = (page = 1, keyword = '') => {
    getListAssets({
      page,
      keyword,
      pageSize: 10,
    });
  };
  const onSelectTeam = (teamId) => {
    setValue('userIds', []);
    getUserInTeam(teamId);
  };

  const onSubmit = async ({ images, recurrence, isRemoveRecurrence, isCurrentSchedule, assetIds, ...values }) => {
    const params = {
      ...values,
      images: undefined,
      isSeries,
      startDate: convertDate.stringToISOString(values.startDate),
      nextStartDate: convertDate.stringToISOString(values.nextStartDate),
      closedData: convertDate.stringToISOString(values.closedData),
      actualStartDate: convertDate.stringToISOString(values.actualStartDate),
      actualEndDate: convertDate.stringToISOString(values.actualEndDate),
      assetIds: assetIds.map((item) => item.id),
    };

    if (recurrence) {
      const startDate = setTimeStart(recurrence.startDate);
      const endDate = setTimeEnd(recurrence.endDate);
      params.schedule = isCurrentSchedule
        ? pmDetail.schedule
        : {
            id: pmDetail && !isAddNew ? pmDetail.scheduleId : undefined,
            startDate,
            endDate,
            cronExpression: recurrence.cronExpression,
            minuteDuration: recurrence.minuteDuration,
            period: recurrence.every ? parseInt(recurrence.every, 10) : undefined,
            recurrenceType: recurrence.frequency.id,
          };
    }

    if (isRemoveRecurrence) {
      params.schedule = null;
    }

    const uploadImages = [];
    images.map((item) => {
      uploadImages.push({
        ...item,
        file: item.sourceURL || item.path,
        fileUrl: item.path,
      });
      return item;
    });

    if (hadRecurrence && !isAddNew) {
      askOverrideSchedule(() => submitRequest(params, uploadImages));
    } else {
      const result = await submitRequest(params, uploadImages);
      goBack(result);
    }
  };

  const goBack = (result) => {
    if (result) {
      NavigationService.goBack();
      DeviceEventEmitter.emit('update_pm');
    }
  };
  const removeRecurrence = () => {
    setValue('isRemoveRecurrence', true);
    setValue('recurrence', null);
  };

  const submitRecurrence = (recurrence, isInit) => {
    if (!isAddNew) {
      if ((!watch('recurrence') && isInit) || !isInit) {
        setValue('isCurrentSchedule', isInit);
      }
    }
    setValue('recurrence', recurrence);
  };
  const getInitialValuesForUpdate = () => {
    if (isAddNew) {
      return {};
    }
    const { assets, actualStartDate, actualEndDate, endDate, startDate, ...restDetail } = pmDetail;
    if (isSeries) {
      getFileReference(pmDetail?.schedule?.documentId);
    } else {
      getFileReference(pmDetail.documentId);
    }

    return {
      ...restDetail,
      assetIds: assets,
      images: [],
      startDate: parseDate(startDate),
      actualStartDate: parseDate(actualStartDate),
      actualEndDate: parseDate(actualEndDate),
      endDate: parseDate(endDate),
      recurrence: watch('recurrence'),
      isCurrentSchedule: watch('isCurrentSchedule'),
      userIds: _.map(pmDetail.users, (pic) => pic.id),
    };
  };

  const onAddTaskPress = () => {
    navigation.navigate('addPlanTask');
  };
  const baseLayoutProps = {
    title,
    showBell: false,
    customRightBtn: !isAddNew && <AddTaskButton onPress={onAddTaskPress} />,
    containerStyle: { paddingHorizontal: 15 },
    loading: !!(isLoading || inspectionLoading || jobType),
    bottomButtons: [
      ...(!isAddNew
        ? [
            {
              title: 'COMMON_TASK',
              type: 'primary',
              onPress: () => {
                NavigationService.navigate('planTask');
              },
            },
          ]
        : []),
      {
        title: 'AD_COMMON_SAVE',
        type: 'primary',
        permission: !isAddNew && 'PlanMaintenance.Update',
        onPress: () => {
          formMethods.handleSubmit(onSubmit)();
        },
      },
    ],
  };

  const onAddJob = () => {
    navigation.navigate('addJobFromPM', {
      linkId: pmDetail.id,
      moduleId: Modules.PLANMAINTENANCE,
      assets: pmDetail.assets,
      onAddSuccess: () => {
        DeviceEventEmitter.emit('reloadPMDetail', {});
        DeviceEventEmitter.emit('update_item_pm');
      },
    });
  };

  const onRemoveInspection = (item) => {
    showPopUpDelete(item);
  };

  const syncJob = (type) => {
    syncDataToExecute();
    setJobType(type);
  };

  const onSetInspectionJob = (data, callBack) => {
    setInspectionJob(data);
    callBack();
  };

  const viewOrExecuteJob = async (workflow) => {
    const isPickedByOther = workflow.pickedByUserId ? user.id !== workflow?.pickedByUserId : false;
    const isSyncCompleted = await SyncMgr.getSyncStatus();
    if (isPickedByOther) {
      executeInspection(workflow);
      return;
    }
    if (isSyncCompleted) {
      syncJob(INSPECTION_LINKAGE_JOB_TYPE.PICKED_UP);
      return;
    }
    executeJob(workflow);
  };

  const executeJob = async (workflow) => {
    const response = await executeInspection(workflow, user);
    if (!response?.pickedByUserId) {
      syncJob(INSPECTION_LINKAGE_JOB_TYPE.RELEASED);
    }
  };

  const onExecute = (item) => {
    if (!item.pickedByUserId) {
      onSetInspectionJob(item, () => executeJob(item));
      return;
    }
    onSetInspectionJob(item, () => viewOrExecuteJob(item));
  };

  const onRelease = async (item) => {
    const result = await releaseInspection(item.id, item.guid);
    if (result) {
      DeviceEventEmitter.emit('reloadPMDetail', {});
    }
  };

  const onViewInspection = async (workflow) => {
    const isSyncCompleted = await SyncMgr.getSyncStatus();
    if (!isSyncCompleted) {
      modal.showError(I18n.t('INSPECTION_MUST_SYNC_MESSAGE'));
    }
    const workflowData = {
      ...(workflow.workflow || {}),
      property: workflow.inspectionProperty,
    };

    viewReport({
      workflowData,
      isOnlineForm: true,
    });
  };
  const showPopUpDelete = (item) => {
    const alertButton = [
      {
        text: I18n.t('INSPECTION_DELETE_YES'),
        onPress: () => {
          unlinkInspection(
            {
              inspectionId: item.id,
              isDelete: true,
            },
            Modules.PLANMAINTENANCE
          );
        },
      },
      {
        text: I18n.t('INSPECTION_DELETE_LINK_ONLY'),
        onPress: () => {
          unlinkInspection(
            {
              inspectionId: item.id,
              isDelete: false,
            },
            Modules.PLANMAINTENANCE
          );
        },
      },
      {
        text: I18n.t('AD_COMMON_CANCEL'),
        onPress: () => null,
      },
    ];
    Alert.alert(I18n.t('INSPECTION_DELETE_ASK'), I18n.t('INSPECTION_DELETE_SUB_TITLE'), alertButton);
  };

  if (!pmDetail && !isAddNew) {
    return <BaseLayout {...baseLayoutProps} displayPlaceholder />;
  }

  const setTimeStart = (startDate) => moment(startDate).startOf('day').toDate();

  const setTimeEnd = (endDate) => moment(endDate).endOf('day').toDate();

  const askOverrideSchedule = (callBack) => {
    Alert.alert(I18n.t(''), I18n.t('AD_PM_OVERRIDE_SERIES'), [
      {
        text: I18n.t('AD_COMMON_CANCEL'),
        style: 'cancel',
      },
      {
        text: I18n.t('AD_COMMON_YES'),
        onPress: async () => {
          const result = await callBack();
          goBack(result);
        },
      },
    ]);
  };

  const getListSync = async () => {
    const { unSyncDataInspections } = await getListUnSync();
    filterInspectionsSync(unSyncDataInspections.items);
  };

  const onChangeStatus = (pmStatusId) => {
    if (!hadRecurrence) {
      const newDate = new Date();
      if (pmStatusId === PM_STATUS_ID.OPEN) {
        setValue('actualStartDate', newDate);
      } else if (pmStatusId === PM_STATUS_ID.CLOSED) {
        setValue('actualEndDate', newDate);
      }
    }
  };

  return (
    <BaseLayout {...baseLayoutProps}>
      <FormProvider {...formMethods}>
        <AwareScrollView>
          {hadRecurrence || isAddNew ? (
            <RecurrenceSetting
              schedule={newSchedule}
              onSubmitForm={(recurrence, isInit) => submitRecurrence(recurrence, isInit)}
              onRemove={isAddNew ? null : () => removeRecurrence()}
            />
          ) : null}

          <FormDropdown
            disabled={isAddNew}
            required
            options={status}
            label="AD_CRWO_TITLE_STATUS"
            placeholder=""
            name="statusId"
            onChange={onChangeStatus}
          />
          {watch('statusId') === PM_STATUS_ID.ON_HOLD && (
            <FormDate
              disabled={hadRecurrence}
              noBorder
              label="PM_NEXT_EXECUTION_DATE"
              name="nextStartDate"
              mode="datetime"
            />
          )}

          <FormDropdown
            required
            options={priorities}
            label="AD_CRWO_PRIORITY"
            placeholder="AD_CRWO_PRIORITY"
            name="priorityId"
          />
          <FormLazyDropdown
            required
            listExist={listAssets.data}
            isDropdownItem
            showSearchBar
            multiple
            defaultTitle={defaultAssets}
            getList={getAssets}
            options={listAssets}
            title="AD_NEW_PM_TITLE_SELECT_ASSETS"
            label="ASSETS_LOCATIONS"
            placeholder="ASSET_LOCATION_PLACEHOLDER"
            disabled={disableAssets}
            fieldName="assetLocationName"
            titleKey="assetLocationName"
            valKey="id"
            showValueByKey={false}
            name="assetIds"
          />
          <FormInput
            editable={!hadRecurrence}
            required
            label="AD_PM_NEW_TITLE_NAME"
            placeholder="AD_PM_NEW_NAME"
            name="name"
          />
          <FormInput required label="AD_CRWO_PLACEHOLDER_DESCRIPTION" placeholder="" name="description" multiline />
          <FormDocumentPicker name="images" label="COMMON_IMAGES" />
          <Box title="AD_CRWO_TITLE_TEAM" required>
            <FormDropdown
              required
              disabled={hadRecurrence}
              options={teamPlans}
              label="AD_CRWO_TEAM"
              placeholder="AD_CRWO_TEAM"
              name="teamId"
              mode="small"
              onChange={onSelectTeam}
            />

            <FormDropdown
              required
              disabled={hadRecurrence}
              options={usersInTeam}
              label="AD_CRWO_USERINTEAM"
              placeholder="AD_CRWO_USERINTEAM"
              name="userIds"
              mode="small"
              fieldName="displayName"
              valKey="userId"
              multiple
              initData={!isAddNew && pmDetail.users}
            />

            <FormDropdown
              required
              disabled={hadRecurrence}
              options={listObserver}
              label="AD_CRWO_OBSERVED"
              placeholder="AD_CRWO_OBSERVED"
              name="observerUserId"
              mode="small"
              fieldName="displayName"
              initData={!isAddNew && pmDetail.observerUser}
            />
          </Box>
          {!isSeries && !isAddNew ? (
            <>
              {workflowLinkage.length > 0 || !isClosed ? (
                <ListInspectionLinkage
                  isSyncing={lock}
                  isClosed={isClosed}
                  onViewReport={onViewInspection}
                  onExecute={onExecute}
                  onRelease={onRelease}
                  isShowCreate={!isClosed}
                  onAddJob={onAddJob}
                  data={workflowLinkage}
                  onRemove={onRemoveInspection}
                />
              ) : null}
            </>
          ) : null}
          {!watch('recurrence') && (
            <Box title="AD_CRWO_TITLE_EXPECTED_DATE">
              <Row>
                <FormDate
                  disabled={hadRecurrence}
                  small
                  label="PM_TARGET_EXECUTION_DATE"
                  name="startDate"
                  mode="datetime"
                  required
                />
                <Spacer width={12} />
                <FormDate
                  disabled={hadRecurrence}
                  small
                  label="PM_TARGET_COMPLETION_DATE"
                  name="endDate"
                  mode="datetime"
                />
              </Row>
              <Row>
                <FormDate
                  disabled={hadRecurrence}
                  small
                  label="PM_ACTUAL_EXECUTION_DATE"
                  name="actualStartDate"
                  mode="datetime"
                />
                <Spacer width={12} />
                <FormDate
                  disabled={hadRecurrence}
                  small
                  label="PM_ACTUAL_COMPLETION_DATE"
                  name="actualEndDate"
                  mode="datetime"
                />
              </Row>
            </Box>
          )}
          {/* <FormNumberInput required label="AD_WO_CREATE_COST" placeholder="" name="description" multiline /> */}
        </AwareScrollView>
      </FormProvider>

      {!isAddNew ? (
        <FloatingConversation
          title={pmDetail.id}
          moduleId={Modules.PLANMAINTENANCE}
          navigation={navigation}
          guid={pmDetail.guid}
          disable={!!(statusId === 15 || statusId === 19)}
          disableTenant
        />
      ) : null}
      <NavigationEvents
        onWillFocus={() => {
          getListSync();
          if (_.size(workflowLinkage) > 0) {
            doSynchronize();
          }
        }}
      />
    </BaseLayout>
  );
};

export default AddOrEditPM;
