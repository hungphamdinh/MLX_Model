import React, { useEffect } from 'react';
import * as Yup from 'yup';
import { DeviceEventEmitter } from 'react-native';
import I18n from '@I18n';
import NavigationService from '@NavigationService';
import _ from 'lodash';
import { Spacer } from '@Elements';
import { FormProvider, useForm } from 'react-hook-form';
import { useRoute } from '@react-navigation/native';

import BaseLayout from '../../../Components/Layout/BaseLayout';
import { FormDate, FormDocumentPicker, FormDropdown, FormInput } from '../../../Components/Forms';
import AwareScrollView from '../../../Components/Layout/AwareScrollView';
import useJobRequest from '../../../Context/JobRequest/Hooks/UseJobRequest';
import Box from '../../../Elements/Box';
import Row from '../../../Components/Grid/Row';
import useTeam from '../../../Context/Team/Hooks/UseTeam';
import FormMoneyInput from '../../../Components/Forms/FormMoneyInput';
import { useYupValidationResolver } from '../../../Utils/hook';
import useFile from '../../../Context/File/Hooks/UseFile';

const AddOrEditTask = ({ navigation }) => {
  const {
    jobRequest: { taskCountStatus, priorities, taskDetail, taskStatusIdDefault, jrDetail },
    isLoading,
    addTask,
    editTask,
    detailTask,
  } = useJobRequest();
  const {
    team: { teams, usersInTeam },
    getUserInTeam,
  } = useTeam();

  const {
    getFileByReferenceId,
    file: { referenceFiles },
  } = useFile();

  const { params } = useRoute();
  const isAddNew = _.get(navigation, 'state.routeName') === 'addJobRequestTask';
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
      workOrderId: undefined,
      assignUserId: undefined,
      teamId: undefined,
      teamUserId: undefined,
      priorityId: undefined,
      startDate: undefined,
      endDate: undefined,
      scheduleStartDate: undefined,
      scheduleEndDate: undefined,
      actualPaymentDate: undefined,
      chargeCost: undefined,
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
      files: [],
    },
  });

  useEffect(() => {
    if(!isAddNew) {
      detailTask(params?.id);
    }
  }, []);

  useEffect(() => {
    if (taskDetail) {
      formMethods.reset(getInitialValuesForUpdate());
    }
  }, [taskDetail]);

  useEffect(() => {
    if(!isAddNew) {
      formMethods.setValue('files', referenceFiles);
    }
  }, [_.size(referenceFiles)]);

  const onSelectTeam = (teamId) => {
    getUserInTeam(teamId);
  };

  const onSubmit = async ({ files, cost, ...values }) => {
    const uploadFiles = files.filter((item) => item.path);

    const params = {
      ...values,
      cost: cost.rawValue,
      workOrderId: !isAddNew ? taskDetail.workOrderId : _.get(jrDetail, 'id'),
      files: uploadFiles,
    };

    const result = await submitRequest(params);
    if (result) {
      NavigationService.goBack();
      DeviceEventEmitter.emit('UpdateListTaskWorkOrder', { page: 1 });
    }
  };

  const getInitialValuesForUpdate = () => {
    if (isAddNew) {
      return {};
    }

    const { team, cost, ...restDetail } = taskDetail;
    getFileByReferenceId(taskDetail.documentId);
    return {
      ...restDetail,
      files: [],
      cost: {
        rawValue: cost,
        text: cost,
      },
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
        type: 'primary',
        permission: 'WorkOrders.WorkOrder.Update',
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
          <FormDropdown
            required
            options={taskCountStatus}
            label="AD_CRWO_TITLE_STATUS"
            placeholder=""
            name="taskStatusId"
            disabled={isAddNew}
          />
          <FormDropdown
            required
            options={priorities}
            label="AD_CRWO_PRIORITY"
            placeholder="AD_CRWO_PRIORITY"
            name="priorityId"
          />

          <FormInput required label="AD_CRWO_PLACEHOLDER_DESCRIPTION" placeholder="" name="description" multiline />
          <FormDocumentPicker name="files" label="COMMON_IMAGES" />
          <Box title="AD_CRWO_TITLE_TEAM" required>
            <FormDropdown
              required
              options={teams}
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
          <FormMoneyInput label="AD_WO_CREATE_COST" name="cost" />
          <Box title="AD_CRWO_TITLE_EXPECTED_DATE">
            <Row>
              <FormDate label="AD_CRWO_TITLE_FROM_DATE" name="startDate" mode="datetime" />
              <Spacer width={20} />
              <FormDate label="AD_CRWO_TITLE_TO_DATE" name="endDate" mode="datetime" />
            </Row>
          </Box>
        </AwareScrollView>
      </FormProvider>
    </BaseLayout>
  );
};

export default AddOrEditTask;
