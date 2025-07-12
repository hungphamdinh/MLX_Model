import React, { useEffect, useMemo, Fragment } from 'react';
import * as Yup from 'yup';
import styled from 'styled-components/native';
import { DeviceEventEmitter } from 'react-native';
import I18n from '@I18n';
import NavigationService from '@NavigationService';
import _ from 'lodash';
import { FormProvider, useForm } from 'react-hook-form';
import BaseLayout from '@Components/Layout/BaseLayout';
import {
  FormDate,
  FormDocumentPicker,
  FormDropdown,
  FormInput,
  FormLazyDropdown,
  FormRadioGroup,
} from '@Components/Forms';
import AwareScrollView from '@Components/Layout/AwareScrollView';
import useJobRequest from '@Context/JobRequest/Hooks/UseJobRequest';
import Box from '@Elements/Box';
import Row from '@Components/Grid/Row';
import useTeam from '@Context/Team/Hooks/UseTeam';
import AddTaskButton from '@Components/JobRequests/AddTaskButton';
import FormMoneyInput from '@Components/Forms/FormMoneyInput';
import FloatingConversation from '@Components/modalChat/FloatingConversation';
import { JobRequestFromModules, JR_EXTRA_SERVICE_CODE, JR_STATUS_ID, ModuleNames, Modules } from '@Config/Constants';
import { formatDate, getDefaultTitle, parseDate } from '@Utils/transformData';
import FormSuggestionPicker, { SuggestionTypes } from '@Components/Forms/FormSuggestionPicker';
import { isGrantedAny, isGranted } from '@Config/PermissionConfig';
import { useYupValidationResolver } from '@Utils/hook';
import { modal } from '@Utils';
import useFeedback from '@Context/Feedback/Hooks/useFeedback';
import useFile from '@Context/File/Hooks/UseFile';
import useUser from '@Context/User/Hooks/UseUser';
import useInventoryRequest from '@Context/InventoryRequest/Hooks/UserInventoryRequest';
import useApp from '@Context/App/Hooks/UseApp';
import useInspection from '@Context/Inspection/Hooks/UseInspection';
import { Linkages } from '../../../Elements';
import { sorMode, JRLocationType } from '@Config/Constants';
import useAsset from '@Context/Asset/Hooks/UseAsset';
import ESignModal from '../ESignModal';

const RowWrapper = styled(Row)`
  flex-wrap: wrap;
  justify-content: space-between;
`;

const DateWrapper = styled.View`
  width: 49%;
`;

const AddOrEditJobRequest = ({ navigation }) => {
  const {
    jobRequest: {
      sources,
      statusList,
      priorities,
      areas,
      subCategories,
      categories,
      jrDetail,
      sourceIdDefault,
      priorityIdDefault,
      statusIdDefault,
      slaSettings,
      jrSetting,
      vendors,
    },
    isLoading,
    getCategories,
    getSubCategories,
    addJR,
    editJR,
    detailJR,
    getSLASettings,
    getTargetDateTime,
    setVisiblePreviewModal,
    setVisibleSigningModal,
    getVendors,
    clearJrDetail,
    getJRSetting,
  } = useJobRequest();

  const {
    searchAssets,
    asset: { assets },
  } = useAsset();

  const {
    inventoryRequest: { irList, irSetting },
    getAllIR,
    getIRSetting,
  } = useInventoryRequest();
  const {
    feedback: { divisionList, qrFeedbackSetting },
    getQrFeedbackSetting,
    getFeedbackDivision,
  } = useFeedback();
  const {
    team: { teams, usersInTeam, listObserver },
    getTeams,
    getListObserver,
    getUserInTeam,
  } = useTeam();
  const {
    app: { allSettings },
  } = useApp();
  const {
    user: { securitySetting },
  } = useUser();

  const { getInspectionFormDetailOnline } = useInspection();

  const {
    getFileReference,
    file: { fileUrls },
  } = useFile();
  const id = navigation.getParam('id');
  const isAddNew = _.get(navigation, 'state.routeName') === 'addJobRequest';
  const feedback = navigation.getParam('feedback');
  const isQuickJR = !isAddNew && _.get(jrDetail, 'isQuickCreate');
  let isShowSigning = false;
  const isSorMode = _.get(allSettings, 'general.inventoryRequestMode') === sorMode.sor;
  let isDisableExtraServiceFields = false;
  const contactInfoTypes = [
    {
      label: I18n.t('AD_CRWO_TITLE_UNIT_LOCATION'),
      value: JRLocationType.Unit,
    },
    {
      label: I18n.t('COMMON_LOCATION'),
      value: JRLocationType.Location,
    },
  ];

  if (jrDetail && !isAddNew) {
    isShowSigning = jrDetail.statusId === JR_STATUS_ID.COMPLETED || jrDetail.statusId === JR_STATUS_ID.RESOLVED;
    isDisableExtraServiceFields = jrDetail.isExtraService && jrDetail.isResident;
  }

  const [allowGetTarget, setAllowGetTarget] = React.useState(false);

  const submitRequest = isAddNew ? addJR : editJR;
  const title = isAddNew ? I18n.t('WO_NEW_NEW') : I18n.t('WO_EDIT');

  const requiredMessage = I18n.t('FORM_THIS_FIELD_IS_REQUIRED');

  const addOnValidation = useMemo(() => {
    const validateObj = {};
    if (isQuickJR) {
      validateObj.location = Yup.object().required(requiredMessage);
    }

    if (jrSetting?.allowExtraService) {
      validateObj.vendorId = Yup.number().when(['isExtraService'], {
        is: true,
        then: Yup.number().required(requiredMessage),
      });
    }

    return validateObj;
  }, [isQuickJR, jrSetting]);

  const validationSchema = Yup.object().shape({
    statusId: Yup.number().required(requiredMessage),
    priorityId: Yup.number().required(requiredMessage),
    sourceId: Yup.number().required(requiredMessage),
    teamId: Yup.number().required(requiredMessage),
    userIds: Yup.array().required(requiredMessage),
    categoryId: Yup.number().required(requiredMessage),
    subCategoryId: Yup.number().required(requiredMessage),
    startDate: Yup.date().required(requiredMessage),
    description: Yup.string().required(requiredMessage),
    unit: Yup.object()
      .nullable()
      .when(['contactInfoType'], {
        is: (contactInfoType) => _.first(contactInfoType) === JRLocationType.Unit,
        then: Yup.object().required(requiredMessage),
      }),
    location: Yup.object()
      .nullable()
      .when(['contactInfoType'], {
        is: (contactInfoType) => _.first(contactInfoType) === JRLocationType.Location,
        then: Yup.object().required(requiredMessage),
      }),

    ...addOnValidation,
  });

  useEffect(() => {
    if (isAddNew) {
      getAllIR({
        page: 1,
      });
    }
    getQrFeedbackSetting();
    getFeedbackDivision();
    getIRSetting();
    getTeams({
      isMyTeam: false,
      target: ModuleNames.WORK_ORDER,
    });
    getListObserver(ModuleNames.WORK_ORDER);
    getSLASettings();
    searchAssets();
    if (!isAddNew) {
      detailJR(id);
    }
    if(!jrSetting) {
      getJRSetting();
    }

    const subscription = DeviceEventEmitter.addListener('UpdateDetailWorkOrder', () => detailJR(id));
    return () => {
      clearJrDetail();
      subscription.remove('UpdateDetailWorkOrder');
    };
  }, []);

  useEffect(() => {
    if (jrDetail) {
      getAllIR({
        page: 1,
        faultReportingId: jrDetail.id,
      });
      const { teamId, categoryId, subCategoryId, vendorId } = jrDetail;
      if (teamId) {
        getUserInTeam(teamId);
      }
      if (categoryId) {
        getCategories(categoryId);
      }

      if (categoryId && subCategoryId) {
        getSubCategories({
          areaId: categoryId,
          categoryId: subCategoryId,
        });
      }

      if (vendorId) {
        getVendors({ subCategoryId, isActive: true });
      }
    }
  }, [jrDetail]);

  const onAddTaskPress = () => {
    NavigationService.navigate('addJobRequestTask');
  };

  const onSelectTeam = (teamId) => {
    setValue('userIds', []);
    getUserInTeam(teamId);
  };

  const onSelectArea = (categoryId) => {
    getCategories(categoryId);

    const area = areas.find((item) => item.id === categoryId);
    const isExtraService = area?.code === JR_EXTRA_SERVICE_CODE;
    setValue('isExtraService', isExtraService);
  };

  const onSelectCategory = (categoryId) => {
    setValue('vendorId', undefined);
    const values = formMethods.getValues();
    getSubCategories({ areaId: values.categoryId, categoryId });
    setAllowGetTarget(true);

    if (isExtraService) {
      getVendors({ subCategoryId: categoryId, isActive: true });
    }
  };

  const validateStartDate = (date, dateType) => {
    const startDateValidation = new Date(startDate) - new Date(date) > 0;
    if (startDateValidation) {
      const errorMessage = I18n.t('JR_START_DATE_VALIDATION', undefined, I18n.t(dateType));
      modal.showError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const onSubmit = async ({
    unit,
    files,
    reportedUser,
    areaId,
    totalCost,
    actualResponseDate,
    actualResolutionDate,
    actualCompletionDate,
    assetIds,
    inventoryRequests,
    location,
    ...values
  }) => {
    const uploadFiles = files.filter((item) => item.path);

    let params = {
      ...values,
      fullUnitCode: unit?.fullUnitCode,
      reportedBy: reportedUser ? reportedUser?.displayName : null,
      totalCost: totalCost.rawValue,
      actualResponseDate,
      actualResolutionDate,
      actualCompletionDate,
      files: uploadFiles,
      assetIds,
      inventoryRequestIds: _.map(inventoryRequests, (item) => item.id),
      locationCode: location?.code,
      contactInfoType: _.first(contactInfoType),
    };
    const actualDates = [
      { value: actualResponseDate, name: 'AD_CRWO_ACTUAL_RESPONSE_TIME' },
      { value: actualResolutionDate, name: 'AD_CRWO_ACTUAL_RESOLUTION_TIME' },
      { value: actualCompletionDate, name: 'AD_CRWO_ACTUAL_COMPLETION_TIME' },
    ];
    actualDates.forEach((item) => {
      if (item.value) {
        validateStartDate(item.value, item.name);
      }
    });

    if (feedback) {
      params = {
        ...params,
        parentId: initFeedbackVal('parentId'),
        moduleId: initFeedbackVal('moduleId'),
      };
    }

    const result = await submitRequest(params);

    if (result) {
      NavigationService.goBack();
      DeviceEventEmitter.emit('UpdateListWorkOrder', 1);
      DeviceEventEmitter.emit('UpdateListFeedback', 1);
    }
  };

  const getInitialValuesForUpdate = () => {
    if (isAddNew) {
      return {};
    }

    const {
      fullUnitCode,
      reportedBy,
      startDate,
      endDate,
      targetCompletionDate,
      targetResponseDate,
      actualCompletionDate,
      actualResolutionDate,
      actualResponseDate,
      totalCost,
      ...restDetail
    } = jrDetail;
    getFileReference(jrDetail.documentId);
    return {
      ...restDetail,
      startDate: parseDate(startDate),
      targetResponseDate: parseDate(targetResponseDate),
      targetCompletionDate: parseDate(targetCompletionDate),
      actualResponseDate: parseDate(actualResponseDate),
      actualResolutionDate: parseDate(actualResolutionDate),
      actualCompletionDate: parseDate(actualCompletionDate),
      unit: {
        fullUnitCode,
      },
      reportedUser: {
        displayName: reportedBy,
      },
      totalCost: {
        rawValue: totalCost,
        text: totalCost,
      },
      files: fileUrls,
      assetIds: jrDetail.assets.map((item) => item.id),
      originalDivisionId: jrDetail.commentBoxDivisionId,
      inventoryRequests: jrDetail.inventoryRequests,
      contactInfoType: [jrDetail.contactInfoType],
      userIds: _.map(jrDetail.users, (user) => user.id),
    };
  };

  const initFeedbackVal = (key) => (feedback ? feedback[key] : undefined);

  const formMethods = useForm({
    resolver: useYupValidationResolver(validationSchema),
    defaultValues: {
      id: undefined,
      relativeId: undefined,
      fullUnitCode: undefined,
      unit: initFeedbackVal('unit'),
      stateId: undefined,
      workOrderTypeId: undefined,
      moduleId: undefined,
      parentId: undefined,
      areaId: undefined,
      categoryId: undefined,
      subCategoryId: undefined,
      furtherSubcategoryId: undefined,
      locationCode: undefined,
      sourceId: sourceIdDefault,
      priorityId: priorityIdDefault,
      paymentStatusId: undefined,
      isCharge: true,
      isQuickCreate: false,
      startDate: new Date(),
      // endDate: undefined,
      // actualStartDate: undefined,
      // actualEndDate: undefined,
      targetCompletionDate: undefined,
      targetResponseDate: undefined,
      actualCompletionDate: undefined,
      actualResolutionDate: undefined,
      actualResponseDate: undefined,
      actualPaymentDate: undefined,
      nextStartDate: undefined,
      teamId: undefined,
      userIds: [],
      observerUserId: undefined,
      contactName: initFeedbackVal('contactName'),
      contactPhone: initFeedbackVal('contactPhone'),
      contactEmail: initFeedbackVal('contactEmail'),
      description: undefined,
      contactId: undefined,
      otherDescription: undefined,
      reportedBy: undefined,
      referenceNo: undefined,
      purchaseOrder: undefined,
      invoiceNo: undefined,
      sorNumber: undefined,
      sorItemToBeReplaced: undefined,
      sorQuantity: undefined,
      files: [],
      statusId: statusIdDefault,
      totalCost: {
        text: '',
        rawValue: 0,
      },
      remarks: '',
      isExtraService: false,
      vendorId: undefined,
      commentBoxDivisionId: initFeedbackVal('commentBoxDivisionId'),
      originalDivisionId: initFeedbackVal('commentBoxDivisionId'),
      inventoryRequests: [],
      contactInfoType: [JRLocationType.Unit],
    },
  });

  const { setValue, watch } = formMethods;
  const [
    actualCompletionDate,
    actualResolutionDate,
    actualResponseDate,
    priorityId,
    subCategoryId,
    startDate,
    workOrderTypeId,
    unit,
    location,
    statusId,
    isExtraService,
    originalDivisionId,
    contactInfoType,
  ] = watch([
    'actualCompletionDate',
    'actualResolutionDate',
    'actualResponseDate',
    'priorityId',
    'subCategoryId',
    'startDate',
    'workOrderTypeId',
    'unit',
    'location',
    'statusId',
    'isExtraService',
    'originalDivisionId',
    'contactInfoType',
  ]);

  useEffect(() => {
    if (jrDetail) {
      formMethods.reset(getInitialValuesForUpdate());
    }
  }, [jrDetail]);

  useEffect(() => {
    if (!isAddNew) {
      setValue('files', fileUrls);
    }
  }, [_.size(fileUrls)]);

  const changeTargetDate = async (params) => {
    const targetTime = await getTargetDateTime(params);
    if (targetTime) {
      const { targetResponseDate, targetCompletionDate } = targetTime;
      setValue('targetResponseDate', parseDate(targetResponseDate));
      setValue('targetCompletionDate', parseDate(targetCompletionDate));
    }
  };

  const onChangeStatus = (statusId) => {
    const newDate = new Date();

    const ensureActualResponseDate = () => {
      if (!actualResponseDate) {
        setValue('actualResponseDate', new Date(newDate.getTime() - 1000));
      }
    };

    if (statusId === JR_STATUS_ID.NEW) {
      resetValues(['actualCompletionDate', 'actualResolutionDate', 'actualResponseDate']);
      return;
    }
    if (statusId === JR_STATUS_ID.IN_PROGRESS) {
      setValue('actualResponseDate', newDate);
      resetValues(['actualCompletionDate', 'actualResolutionDate']);
      return;
    }
    if (statusId === JR_STATUS_ID.RESOLVED) {
      setValue('actualResolutionDate', newDate);
      resetValues(['actualCompletionDate']);
      ensureActualResponseDate();
      return;
    }
    if (statusId === JR_STATUS_ID.COMPLETED) {
      setValue('actualCompletionDate', newDate);
      ensureActualResponseDate();
      return;
    }

    if (statusId === JR_STATUS_ID.ON_HOLD) {
      setValue('nexStartDate', newDate);
    }
  };

  const onContactTypeChanged = (values) => {
    if (_.first(values) === JRLocationType.Unit) {
      setValue('location', null);
      return;
    }
    setValue('unit', null);
    setValue('contactName', null);
    setValue('contactPhone', null);
    setValue('contactEmail', null);
  };

  const resetValues = (keys) => {
    keys.forEach((key) => {
      setValue(key, null);
    });
  };

  const baseLayoutProps = {
    title,
    showBell: false,
    containerStyle: { paddingHorizontal: 15 },
    loading: isLoading,
    customRightBtn: !isAddNew && isGrantedAny('WorkOrders.WorkOrder.Create', 'WorkOrders.WorkOrder.Update') && (
      <AddTaskButton testID="buttonAddTask" onPress={onAddTaskPress} />
    ),
    bottomButtons: [
      ...(!isAddNew
        ? [
            {
              title: 'COMMON_TASK',
              type: 'primary',
              onPress: () => {
                NavigationService.navigate('jobRequestTask');
              },
            },
          ]
        : []),
      {
        title: 'AD_COMMON_SAVE',
        type: 'primary',
        permission: !isAddNew && 'WorkOrders.WorkOrder.Update',
        onPress: () => {
          formMethods.handleSubmit(onSubmit)();
        },
      },
      ...(isShowSigning
        ? [
            {
              title: 'JR_PREVIEW_REPORT',
              type: 'primary',
              onPress: () => {
                setVisiblePreviewModal(true);
              },
            },
            {
              title: 'COMMON_SIGN',
              type: 'info',
              disabled: jrDetail.haveOfficeSigning && jrDetail.haveMaintenanceSigning,
              onPress: () => {
                setVisibleSigningModal(true);
              },
            },
          ]
        : []),
    ],
  };

  useEffect(() => {
    if (allowGetTarget) {
      if (priorityId && subCategoryId && startDate) {
        const params = {
          categoryId: subCategoryId,
          priorityId,
          date: formatDate(startDate, null),
        };
        changeTargetDate(params);
      }
    }
  }, [priorityId, subCategoryId, startDate]);

  if (!jrDetail && !isAddNew) {
    return <BaseLayout {...baseLayoutProps} displayPlaceholder />;
  }
  let readOnlyTenant;
  if (jrDetail) {
    readOnlyTenant = _.includes(
      [JR_STATUS_ID.COMPLETED, JR_STATUS_ID.RESOLVED, JR_STATUS_ID.CANCELLED],
      jrDetail.statusId
    );
  }

  const getDefaultValue = (fieldName) =>
    getDefaultTitle({
      fieldName,
      preConditions: !isAddNew,
      moduleDetail: jrDetail,
    });

  const onPressFBLinkage = ({ moduleId, parentId }) => {
    NavigationService.navigate(moduleId === Modules.FEEDBACK ? 'editFeedback' : 'editQRFeedback', {
      id: parentId,
    });
  };

  const onPressInspectionLinkage = (linkage) => {
    getInspectionFormDetailOnline({
      parentId: linkage.id,
    });
  };

  return (
    <BaseLayout {...baseLayoutProps}>
      <FormProvider {...formMethods}>
        <AwareScrollView>
          <FormDropdown
            required
            options={statusList}
            label="AD_CRWO_TITLE_STATUS"
            placeholder=""
            name="statusId"
            disabled={isAddNew}
            onChange={(val) => onChangeStatus(val)}
          />
          {statusId === JR_STATUS_ID.ON_HOLD && (
            <FormDate label="JR_NEXT_START_DATE" name="nextStartDate" mode="datetime" />
          )}

          <Box title="AD_CRWO_TITLE_SOURCE_PRIORITY" required>
            <FormDropdown
              required
              options={priorities}
              label="AD_CRWO_PRIORITY"
              onChange={() => setAllowGetTarget(true)}
              placeholder="AD_CRWO_PRIORITY"
              name="priorityId"
              mode="small"
            />
            <FormDropdown
              required
              options={sources}
              label="AD_CRWO_SOURCE"
              placeholder="AD_CRWO_SOURCE"
              name="sourceId"
              mode="small"
            />
            <FormSuggestionPicker
              type={SuggestionTypes.REPORTED_BY}
              // required
              label="AD_CRWO_REPORT_BY"
              placeholder="AD_CRWO_REPORT_BY"
              name="reportedUser"
              mode="small"
            />
            <FormInput
              options={priorities}
              label="AD_CRWO_REF_NO"
              placeholder="AD_CRWO_REF_NO"
              name="referenceNo"
              mode="small"
            />
            {qrFeedbackSetting?.canViewDivision && originalDivisionId && (
              <FormDropdown
                options={divisionList}
                label="DIVISION"
                placeholder="DEVISION"
                name="commentBoxDivisionId"
                mode="small"
              />
            )}
            {workOrderTypeId === JobRequestFromModules.feedback && (
              <>
                <FormInput label="WO_LOCATION_CODE" placeholder="WO_LOCATION_CODE" name="locationCode" mode="small" />
                {_.size(_.get(location, 'name')) > 0 && (
                  <FormSuggestionPicker
                    type={SuggestionTypes.LOCATION}
                    label="AD_CRWO_TITLE_LOCATION"
                    placeholder="AD_CRWO_TITLE_LOCATION"
                    name="location"
                    mode="small"
                    disabled
                  />
                )}
              </>
            )}
            {isQuickJR && (
              <FormSuggestionPicker
                required
                type={SuggestionTypes.LOCATION}
                label="AD_CRWO_TITLE_LOCATION"
                placeholder="AD_CRWO_TITLE_LOCATION"
                name="location"
                mode="small"
              />
            )}
          </Box>
          <FormRadioGroup
            mode="small"
            options={contactInfoTypes}
            name="contactInfoType"
            horizontal
            onChange={onContactTypeChanged}
          />
          <>
            {_.first(contactInfoType) === JRLocationType.Unit && (
              <FormSuggestionPicker
                required
                label="AD_CRWO_TITLE_UNIT_LOCATION"
                placeholder="AD_CRWO_TITLE_UNIT_LOCATION"
                name="unit"
                keyword={unit?.fullUnitCode}
                isShowEmailAndPhone={securitySetting?.isShowEmailAndPhone}
                onChange={(selectedUnit) => {
                  setValue('contactName', selectedUnit.displayName);
                  setValue('contactPhone', selectedUnit.phoneNumber);
                  setValue('contactEmail', selectedUnit.emailAddress);
                  setValue('contactId', selectedUnit.userId);
                }}
              />
            )}
            {_.first(contactInfoType) === JRLocationType.Location && (
              <FormSuggestionPicker required type={SuggestionTypes.LOCATION} name="location" label="COMMON_LOCATION" />
            )}
          </>

          {jrSetting?.canViewAssets && (
            <FormDropdown
              options={assets}
              label="AD_CRWO_ASSETS_ID"
              placeholder="AD_CRWO_ASSETS"
              name="assetIds"
              fieldName="assetName"
              multiple
              showSearchBar
            />
          )}

          <Box title="AD_CRWO_TITLE_INFO">
            <FormInput label="AD_CRWO_DISPLAYNAME" placeholder="AD_CRWO_DISPLAYNAME" name="contactName" mode="small" />
            {securitySetting?.isShowEmailAndPhone && (
              <Fragment>
                <FormInput label="AD_CRWO_EMAIL" placeholder="AD_CRWO_EMAIL" name="contactEmail" mode="small" />
                <FormInput label="AD_CRWO_PHONE" placeholder="AD_CRWO_PHONE" name="contactPhone" mode="small" />
              </Fragment>
            )}
          </Box>
          <FormInput required label="AD_CRWO_PLACEHOLDER_DESCRIPTION" placeholder="" name="description" multiline />
          <FormInput label="AD_CRWO_PLACEHOLDER_OTHER_DESCRIPTION" placeholder="" name="otherDescription" multiline />
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
              defaultTitle={jrDetail?.team?.name}
              showSearchBar
            />

            <FormDropdown
              required
              options={usersInTeam}
              label="AD_CRWO_USERINTEAM"
              placeholder="AD_CRWO_USERINTEAM"
              name="userIds"
              mode="small"
              fieldName="displayName"
              valKey="userId"
              multiple
            />

            <FormDropdown
              options={listObserver}
              label="AD_CRWO_OBSERVED"
              placeholder="AD_CRWO_OBSERVED"
              name="observerUserId"
              mode="small"
              fieldName="displayName"
            />
          </Box>
          <Box title="AD_CRWO_TITLE_AREA" required>
            <FormDropdown
              required
              options={areas}
              label="AD_CRWO_AREA"
              placeholder="AD_CRWO_AREA"
              name="categoryId"
              mode="small"
              disabled={isDisableExtraServiceFields}
              onChange={(id) => {
                onSelectArea(id);
                setValue('subCategoryId', undefined);
                setValue('vendorId', undefined);
              }}
            />
            <FormDropdown
              required
              options={categories}
              disabled={isDisableExtraServiceFields}
              label="AD_CRWO_CATEGORY"
              placeholder="AD_CRWO_CATEGORY"
              name="subCategoryId"
              mode="small"
              onChange={(subId) => onSelectCategory(subId)}
              defaultTitle={getDefaultValue('subCategory')}
            />
            <FormDropdown
              options={subCategories}
              label="AD_CRWO_SUBCATEGORY"
              placeholder="AD_CRWO_SUBCATEGORY"
              name="furtherSubcategoryId"
              mode="small"
              defaultTitle={getDefaultValue('furtherSubcategory')}
            />
            {isExtraService && jrSetting?.allowExtraService && (
              <FormDropdown
                required
                disabled={isDisableExtraServiceFields}
                options={vendors}
                label="AD_CRWO_VENDOR"
                placeholder="AD_CRWO_VENDOR"
                name="vendorId"
                mode="small"
                defaultTitle={getDefaultValue('vendor')}
              />
            )}
          </Box>
          <Box title="AD_CRWO_TITLE_EXPECTED_DATE">
            <RowWrapper>
              <DateWrapper>
                <FormDate
                  onChangeDate={() => setAllowGetTarget(true)}
                  small
                  label="COMMON_CREATION_TIME"
                  name="startDate"
                  mode="datetime"
                  required
                />
              </DateWrapper>
              <DateWrapper>
                <FormDate small label="AD_CRWO_TARGET_RESPONSE_TIME" name="targetResponseDate" mode="datetime" />
              </DateWrapper>
              <DateWrapper>
                <FormDate
                  disabled={!slaSettings.allowToEditTargetCompletionTime}
                  small
                  label="AD_CRWO_TARGET_COMPLETION_TIME"
                  name="targetCompletionDate"
                  mode="datetime"
                />
              </DateWrapper>

              {actualResponseDate && (
                <DateWrapper>
                  <FormDate small label="AD_CRWO_ACTUAL_RESPONSE_TIME" name="actualResponseDate" mode="datetime" />
                </DateWrapper>
              )}
              {actualResolutionDate && (
                <DateWrapper>
                  <FormDate
                    disabled={!slaSettings.allowToEditTargetResolutionTime}
                    small
                    label="AD_CRWO_ACTUAL_RESOLUTION_TIME"
                    name="actualResolutionDate"
                    mode="datetime"
                  />
                </DateWrapper>
              )}

              {actualCompletionDate && (
                <DateWrapper>
                  <FormDate
                    minimumDate={startDate}
                    small
                    label="AD_CRWO_ACTUAL_COMPLETION_TIME"
                    name="actualCompletionDate"
                    mode="datetime"
                    maximumDate={new Date()}
                  />
                </DateWrapper>
              )}
            </RowWrapper>
          </Box>

          {irSetting?.isWorkOrderLinked && isGranted('InventoryRequest.Read') && (
            <FormLazyDropdown
              listExist={irList.data}
              isDropdownItem
              showSearchBar
              multiple
              getList={(page, keyword) =>
                getAllIR({
                  page,
                  keyword,
                  faultReportingId: jrDetail?.id,
                })
              }
              options={irList}
              title={isSorMode ? 'SOR_REQUEST' : 'INVENTORY_REQUEST'}
              label={isSorMode ? 'SOR_LINKAGE' : 'INVENTORY_REQUEST_LINKAGE'}
              name="inventoryRequests"
            />
          )}

          <FormMoneyInput label="AD_WO_CREATE_COST" name="totalCost" />
          <FormInput label="AD_CRWO_TITLE_REMARK" placeholder="" name="remarks" multiline />
          {/* <FormNumberInput required label="AD_WO_CREATE_COST" placeholder="" name="description" multiline /> */}
          {/* <Button title="FB_CREATE_BTNSEND" primary rounded onPress={handleSubmit} /> */}
          {!isAddNew && (
            <Fragment>
              {jrDetail.parentId && (
                <Linkages
                  text="FB_LINKAGE"
                  linkages={[{ id: jrDetail.parentId }]}
                  onPress={() => onPressFBLinkage(jrDetail)}
                />
              )}
              {jrDetail.inspectionId && (
                <Linkages
                  text="INSPECTION_LINKAGE"
                  linkages={[{ id: jrDetail.inspectionId }]}
                  onPress={onPressInspectionLinkage}
                />
              )}
            </Fragment>
          )}
        </AwareScrollView>
      </FormProvider>
      {!isAddNew && (
        <FloatingConversation
          title={jrDetail.id}
          moduleId={Modules.WORKORDER}
          guid={jrDetail.guid}
          disable={false}
          disableTenant={false}
          readOnlyTenant={readOnlyTenant}
        />
      )}
      <ESignModal jrData={jrDetail} reloadData={() => DeviceEventEmitter.emit('UpdateDetailWorkOrder', {})} />
    </BaseLayout>
  );
};

export default AddOrEditJobRequest;
