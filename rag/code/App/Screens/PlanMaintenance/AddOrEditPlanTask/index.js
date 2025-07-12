import React, { useEffect } from 'react';
import * as Yup from 'yup';
import { DeviceEventEmitter } from 'react-native';
import I18n from '@I18n';
import NavigationService from '@NavigationService';
import { FormProvider, useForm } from 'react-hook-form';
import _ from 'lodash';
import { Spacer } from '@Elements';
import BaseLayout from '../../../Components/Layout/BaseLayout';
import { FormDate, FormDocumentPicker, FormDropdown, FormInput } from '../../../Components/Forms';
import AwareScrollView from '../../../Components/Layout/AwareScrollView';
import Box from '../../../Elements/Box';
import Row from '../../../Components/Grid/Row';
import useTeam from '../../../Context/Team/Hooks/UseTeam';
import { RequestApi } from '../../../Services';
import FormMoneyInput from '../../../Components/Forms/FormMoneyInput';
import usePlanMaintenance from '../../../Context/PlanMaintenance/Hooks/UsePlanMaintenance';
import { useYupValidationResolver } from '../../../Utils/hook';
import useFile from '../../../Context/File/Hooks/UseFile';

const AddOrEditTask = ({ navigation }) => {
  const {
    isLoading,
    detailTask,
    planMaintenance: { taskDetail, pmDetail, taskStatusIdDefault, taskStatus, teamPlans, taskPriorities },
    addTask,
    editTask,
    getTaskStatus,
    getCategoriesPlan,
    getTaskPriorities,
  } = usePlanMaintenance();
  const {
    team: { usersInTeam },
    getUserInTeam,
  } = useTeam();

  const {
    file: { referenceFiles },
    getFileByReferenceId,
  } = useFile();

  const isAddNew = _.get(navigation, 'state.routeName') === 'addPlanTask';
  const submitRequest = isAddNew ? addTask : editTask;
  const title = isAddNew ? I18n.t('WO_ADD_TASK') : I18n.t('WO_EDIT_TASK');

  const requiredMessage = I18n.t('FORM_THIS_FIELD_IS_REQUIRED');
  const validationSchema = Yup.object().shape({
    taskStatusId: Yup.number().required(requiredMessage),
    priorityId: Yup.number().required(requiredMessage),
    teamId: Yup.number().required(requiredMessage),
    teamUserId: Yup.number().required(requiredMessage),
    description: Yup.string().required(requiredMessage),
  });

  const formMethods = useForm({
    resolver: useYupValidationResolver(validationSchema),
    defaultValues: {
      id: undefined,
      planId: undefined,
      assignUserId: undefined,
      teamId: undefined,
      teamUserId: undefined,
      priorityId: undefined,
      startDate: undefined,
      endDate: undefined,
      scheduleStartDate: undefined,
      scheduleEndDate: undefined,
      actualPaymentDate: undefined,
      chargeCost: {
        text: '',
        rawValue: 0,
      },
      effortDay: undefined,
      effortHour: undefined,
      effortMinute: undefined,
      taskNote: undefined,
      description: undefined,
      taskStatusId: taskStatusIdDefault,
      cost: {
        text: '',
        rawValue: 0,
      },
      images: [],
    },
  });

  const updateDefaultValues = () => {
    if (_.size(taskPriorities)) {
      formMethods.setValue('priorityId', taskPriorities.find((item) => item.isDefault)?.id);
    }
    if (taskStatusIdDefault) {
      formMethods.setValue('taskStatusId', taskStatusIdDefault);
    }
  };

  useEffect(() => {
    const taskId = navigation.getParam('taskId');
    if (taskId) {
      detailTask(taskId);
    }
    getTaskStatus();
    getCategoriesPlan();
    getTaskPriorities();
  }, []);

  useEffect(() => {
    formMethods.setValue('images', referenceFiles);
  }, [_.size(referenceFiles)]);

  useEffect(() => {
    if (isAddNew) {
      updateDefaultValues();
    }
  }, [_.size(taskPriorities), taskStatusIdDefault]);

  useEffect(() => {
    if (taskDetail) {
      formMethods.reset(getInitialValuesForUpdate());
    }
  }, [taskDetail]);

  const onSelectTeam = (teamId) => {
    getUserInTeam(teamId);
  };

  const onSubmit = async ({ images, cost, chargeCost, ...values }) => {
    const params = {
      ...values,
      cost: cost.rawValue,
      chargeCost: chargeCost.rawValue,
      planId: taskDetail ? taskDetail.planId : _.get(pmDetail, 'id'),
    };
    //  planId: get(taskData, 'planId'),
    //   id: get(taskData, 'id'),
    //   TaskStatusId: get(status, 'id'),
    //   teamId: isEmpty(teamSelected) ? get(taskData, 'team.id') : get(teamSelected, 'id'),
    //   teamUserId: isEmpty(technicalInChargeSelected) ? get(taskData, 'teamUser.id') : get(technicalInChargeSelected, 'userId'),
    //   priorityId: isEmpty(prioritiesSelected) ? get(taskData, 'priority.id') : get(prioritiesSelected, 'id'),
    //   startDate: !isEmpty(fromDate) ? convertDate.stringToISOString(fromDate) : get(taskData, 'startDate'),
    //   endDate: !isEmpty(toDate) ? convertDate.stringToISOString(toDate) : get(taskData, 'endDate'),
    //   scheduleStartDate: get(taskData, 'scheduleStartDate'),
    //   scheduleEndDate: get(taskData, 'scheduleEndDate'),
    //   acrualPaymentDate: get(taskData, 'acrualPaymentDate'),
    //   effortDay: get(taskData, 'effortDay'),
    //   effortHour: get(taskData, 'effortHour'),
    //   effortMinute: get(taskData, 'effortMinute'),
    //   taskNote: get(taskData, 'taskNote'),
    //   description,
    //   files: imageList,
    const result = await submitRequest(params);
    if (result) {
      const guid = isAddNew ? result.documentId : taskDetail.documentId;
      const uploadImages = images.filter((item) => item.path);
      if (uploadImages.length > 0) {
        await RequestApi.requestUploadFilePlanTask(guid, uploadImages);
      }
      NavigationService.goBack();
      DeviceEventEmitter.emit('UpdateListTaskWorkOrder', { page: 1 });
    }
  };

  const getInitialValuesForUpdate = () => {
    if (isAddNew) {
      return {};
    }

    const { fileUrls, team, cost, chargeCost, startDate, scheduleEndDate, scheduleStartDate, endDate, ...restDetail } =
      taskDetail;

    getFileByReferenceId(taskDetail.documentId);
    return {
      ...restDetail,
      images: fileUrls,
      cost: {
        rawValue: cost,
        text: cost,
      },
      chargeCost: {
        rawValue: chargeCost,
        text: chargeCost,
      },
      startDate: new Date(startDate),
      scheduleStartDate: scheduleStartDate ? new Date(scheduleStartDate) : undefined,
      scheduleEndDate: scheduleEndDate ? new Date(scheduleEndDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      teamId: team.id,
    };
  };

  const baseLayoutProps = {
    title,
    showBell: false,
    containerStyle: { paddingHorizontal: 15 },
    loading: isLoading,
    bottomButtons: [
      {
        title: 'AD_COMMON_SAVE',
        permission: 'PlanMaintenance.Update',
        type: 'primary',
        onPress: () => {
          formMethods.handleSubmit(onSubmit)();
        },
      },
    ],
  };

  if (!taskDetail && !isAddNew) {
    return <BaseLayout {...baseLayoutProps} displayPlaceholder />;
  }

  return (
    <BaseLayout {...baseLayoutProps}>
      <FormProvider {...formMethods}>
        <AwareScrollView>
          <FormDropdown required options={taskStatus} label="AD_TASK_STATUS" placeholder="" name="taskStatusId" />
          <FormDropdown
            required
            options={taskPriorities}
            label="AD_TASK_PRIORITY"
            placeholder="AD_CRWO_PRIORITY"
            name="priorityId"
          />

          <FormInput required label="AD_TASK_DESCRIPTION" placeholder="" name="description" multiline />
          <FormDocumentPicker name="images" label="COMMON_IMAGES" />
          <Box title="AD_CRWO_TITLE_TEAM" required>
            <FormDropdown
              required
              options={teamPlans}
              label="AD_CRWO_TEAM"
              placeholder="AD_CRWO_TEAM"
              name="teamId"
              mode="small"
              onChange={onSelectTeam}
            />

            <FormDropdown
              required
              options={usersInTeam}
              label="AD_CRWO_USERINTEAM"
              placeholder="AD_CRWO_USERINTEAM"
              name="teamUserId"
              mode="small"
              fieldName="displayName"
              valKey="userId"
            />
          </Box>
          <FormMoneyInput label="AD_TASK_COST" name="cost" />
          <FormMoneyInput label="AD_TASK_CHARGE_COST" name="chargeCost" />
          <Box title="AD_CRWO_TITLE_EXPECTED_DATE">
            <Row>
              <FormDate label="AD_TASK_FROM_DATE" name="startDate" mode="datetime" />
              <Spacer width={20} />
              <FormDate label="AD_TASK_TO_DATE" name="endDate" mode="datetime" />
            </Row>
          </Box>
        </AwareScrollView>
      </FormProvider>
    </BaseLayout>
  );
};

export default AddOrEditTask;
