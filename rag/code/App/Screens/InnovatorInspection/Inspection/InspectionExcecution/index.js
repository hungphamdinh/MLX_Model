/* eslint-disable no-unused-expressions */
import React, { useState, useRef } from 'react';
import I18n from '@I18n';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import _ from 'lodash';
import * as Yup from 'yup';
import { Alert, DeviceEventEmitter, View } from 'react-native';
import FormEditorScreen from '../../Template/FormEditorScreen';
import { toast } from '../../../../Utils';
import AddSignatureModal from '../../../../Modal/AddSignatureModal';
import { Colors } from '../../../../Themes';
import useInspection from '../../../../Context/Inspection/Hooks/UseInspection';
import { FormEditorTypes, formItemTypes } from '../../../../Config/Constants';
import useUser from '../../../../Context/User/Hooks/UseUser';
import { useStateDelay } from '../../../../Utils/hook';
import { calculateTotalScore } from '../../../../Transforms/SurveyTransformer';
import Row from '../../../../Components/Grid/Row';
import { IconButton } from '../../../../Elements';
import { requestLocationPermission } from '../../../../Utils/permissions';
import { AlertNative } from '../../../../Components';
import { isGranted } from '../../../../Config/PermissionConfig';
import { getFormStructureJson } from '../../../../Utils/inspectionUtils';
import InspectionMgr from '../../../../Services/OfflineDB/Mgr/InspectionMgr';
import SyncDB from '../../../../Services/OfflineDB/SyncDB';

const RightButtons = ({ onEditPress, onSignaturePress, hideSignature }) => (
  <Row center>
    <IconButton
      icon={<MaterialIcon name="square-edit-outline" size={30} color={Colors.azure} />}
      containerStyle={{ marginRight: 5 }}
      onPress={onEditPress}
    />
    {!hideSignature && (
      <IconButton
        icon={<MaterialIcon name="signature-freehand" size={30} color={Colors.azure} />}
        onPress={onSignaturePress}
      />
    )}
  </Row>
);

const InspectionExcecution = ({ navigation }) => {
  const requiredQuestion = I18n.t('AD_FORM_REQUIRED_QUESTION');
  const updatedSignatureRef = React.useRef(false);

  const validationSchema = Yup.object().shape({
    formPages: Yup.array().of(
      Yup.object().shape({
        formQuestions: Yup.array().of(
          Yup.object().shape({
            isMandatory: Yup.boolean(),
            uaqOptions: Yup.array().when(['isMandatory', 'questionType'], {
              is: (isMandatory, questionType) => isMandatory && questionType.id === 1,
              then: Yup.array().min(1, requiredQuestion),
            }),
            uaqDropdownValue: Yup.object()
              .nullable()
              .when(['isMandatory', 'questionType'], {
                is: (isMandatory, questionType) => isMandatory && (questionType.id === 2 || questionType.id === 8),
                then: Yup.object().required(requiredQuestion),
              }),
            uaqAnswerContent: Yup.string().when(['isMandatory', 'questionType'], {
              is: (isMandatory, questionType) => isMandatory && (questionType.id === 3 || questionType.id === 4),
              then: Yup.string().required(requiredQuestion),
            }),
            uaqAnswerDate: Yup.string()
              .nullable()
              .when(['isMandatory', 'questionType'], {
                is: (isMandatory, questionType) => isMandatory && questionType.id === 5,
                then: Yup.string().required(requiredQuestion),
              }),
            uaqAnswerNumeric: Yup.string()
              .nullable()
              .when(['isMandatory', 'questionType'], {
                is: (isMandatory, questionType) => isMandatory && (questionType.id === 6 || questionType.id === 7),
                then: Yup.string().required(requiredQuestion),
              }),
            uaqAnswerMarching: Yup.string()
              .nullable()
              .when(['questionType'], {
                is: (questionType) => !this.value && questionType.id === formItemTypes.MARCHING_IN_OUT,
                then: Yup.string().required(requiredQuestion),
              }),
            uaqImages: Yup.array().when(['isRequiredImage', 'isImage'], {
              is: (isRequiredImage, isImage) => isRequiredImage && isImage,
              then: Yup.array().min(1, requiredQuestion),
            }),
            uaqDeclareQuantity: Yup.string().when(['isDeclareQuantityMandatory', 'isDeclareQuantity'], {
              is: (isDeclareQuantityMandatory, isDeclareQuantity) => isDeclareQuantityMandatory && isDeclareQuantity,
              then: Yup.string().required(requiredQuestion),
            }),
            uaqDefectDescription: Yup.string().when(['isDefect'], {
              is: (isDefect) => isDefect,
              then: Yup.string().required(requiredQuestion),
            }),
          })
        ),
      })
    ),
  });

  const [signatureVisible, setSignatureVisible] = React.useState(false);
  const [workflow, setWorkflow] = useState(navigation.getParam('workflow'));
  const formData = useState(navigation.getParam('formData'));

  const formRef = React.useRef();
  const {
    user: { user },
  } = useUser();

  const workflowId = _.get(workflow, 'id');
  const workflowSubject = _.get(workflow, 'subject');
  const isWorkFlowClosed = _.get(workflow, 'status.isIssueClosed');
  const locked = workflow.isOnline && !isWorkFlowClosed;

  const [isLoadingReport, setIsLoadingReport] = React.useState(false);
  const [skipValidation, setSkipValidation] = useStateDelay(true);
  const [isShowSignatureModal, setIsShowSignatureModal] = React.useState(false);
  const [isInSignProgress, setIsInSyncProgress] = useState(false);

  const isShowPreview = !isWorkFlowClosed;
  const isReadOnly = workflow.isOnline || !isGranted('Inspection.Update');

  const {
    inspection: { locations, hadSignature, isLoading, signatories, inspectionSetting },
    viewReport,
    getLocations,
    deleteInspectionSignature,
    saveInspectionV2,
    completeInspection,
  } = useInspection();

  const actionType =
    isWorkFlowClosed || isReadOnly || hadSignature
      ? FormEditorTypes.VIEW_INSPECTION
      : FormEditorTypes.CREATE_EDIT_INSPECTION;

  const actionTypeRef = useRef(actionType);

  const checkPrevSubmit = (onCallBack) => {
    const prevUserId = formData.lastModifierUserId;
    if (prevUserId) {
      if (prevUserId !== user.id) {
        Alert.alert(I18n.t(''), I18n.t('INSPECTION_CHECK_PREVIOUS_SUBMIT'), [
          {
            text: I18n.t('AD_COMMON_CANCEL'),
            style: 'cancel',
          },
          {
            text: I18n.t('AD_COMMON_YES'),
            onPress: () => onCallBack(),
          },
        ]);
      } else {
        onCallBack();
      }
    } else {
      onCallBack();
    }
  };

  // const submitInspection = () => {
  //   setSkipValidation(true, () => {
  //     if (!_.get(formRef, 'current')) {
  //       return;
  //     }
  //     formRef.current.handleSubmit(onSubmit)();
  //   });
  // };

  const updateSignatureSuccess = async () => {
    updatedSignatureRef.current = true;
    toast.showSuccess(I18n.t('INSPECTION_SIGN_SUCCESS_MESSAGE'));
    completeInspection(workflow);
  };

  React.useEffect(() => {
    const subscriber = DeviceEventEmitter.addListener('update_signatures', updateSignatureSuccess);
    return () => {
      subscriber.remove();
    };
  }, [locations]);

  React.useEffect(() => {
    if (locations && isShowSignatureModal) {
      setSignatureVisible(true);
      setIsShowSignatureModal(false);
    }
  }, [locations, isShowSignatureModal]);

  // Allow to edit Form after remove all signatures
  React.useEffect(() => {
    if (
      !hadSignature &&
      actionType === FormEditorTypes.CREATE_EDIT_INSPECTION &&
      actionTypeRef.current !== actionType
    ) {
      actionTypeRef.current = actionType;
    }
  }, [actionType]);

  const onLeftPress = () => {
    // const { isDirty } = formRef.current.formState;
    // if (isDirty) {
    //   saveAndCloseRef.current = true;
    //   submitInspection();
    //   return;
    // }
    navigation.goBack();
  };

  const openReport = async () => {
    try {
      setIsLoadingReport(true);
      const fileUrl = await viewReport({
        workflowData: workflow,
        isOnlineForm: workflow.isOnline,
        isCompleted: workflow.status.isIssueClosed,
      });
      if (!fileUrl) {
        setIsLoadingReport(false);
        return;
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoadingReport(false);
    }
  };

  const onAskCompleteInspection = () => {
    AlertNative(
      I18n.t('INSPECTION_COMPLETE_JOB_TITLE'),
      I18n.t('INSPECTION_COMPLETE_JOB_MESSAGE'),
      updateSignatureSuccess,
      I18n.t('AD_COMMON_YES'),
      I18n.t('AD_COMMON_CANCEL')
    );
  };

  const onSignPress = async () => {
    setIsInSyncProgress(true);
    const formMethods = formRef.current;
    const handleValidateSuccess = () => {
      if (!_.size(signatories)) {
        onAskCompleteInspection();
        return;
      }
      if (workflow.isOnline) {
        checkPrevSubmit(() => setSignatureVisible(true));
      }
      if (workflow?.inspection?.isRequiredLocation) {
        setIsShowSignatureModal(true);
        requestLocationPermission(getLocations);
        return;
      }
      const formValues = formRef.current.getValues();
      const hasUaqDescription = formValues.formPages.some((page) =>
        page.formQuestions.some(
          (question) => question.uaqDefectDescription && question.uaqDefectDescription.trim() !== ''
        )
      );

      // Check if inspectionSetting.isAllowDefect is true
      const isAllowDefect = inspectionSetting.isAllowDefect;

      if (hasUaqDescription && isAllowDefect) {
        const teamAssigneeList = workflow.inspection?.teamAssignee || workflow.inspection?.team || [];

        if (_.size(teamAssigneeList) === 0) {
          AlertNative(
            I18n.t('NOTIFICATION'),
            I18n.t('INSPECTION_TEAM_VALIDATION'),
            () => onEditPress(),
            I18n.t('OK'), // Button text
            I18n.t('AD_COMMON_CANCEL')
          );
          setIsInSyncProgress(false);
          return; // Prevent proceeding with signing
        }
      }

      setSignatureVisible(true);
    };

    const handleValidateError = () => {
      toast.showError(I18n.t('INSPECTION_PLEASE_FILL_MANDATORY_FIELDS_FIRST'));
      const formStructure = getFormStructureJson(formMethods.getValues());
      formMethods.setValue('lastFormErrorStructure', formStructure);
    };

    setSkipValidation(false, () => {
      if (!formMethods) {
        return;
      }
      validationSchema
        .validate(formMethods.getValues(), { abortEarly: false })
        .then(() => {
          handleValidateSuccess();
        })
        .catch(() => {
          formMethods.trigger();
          handleValidateError();
        });
      setIsInSyncProgress(false);
    });
  };

  const onEditPress = () => {
    navigation.navigate('editJob', { id: workflow.parentId, callBack: updateInspectionInfo });
  };

  const updateInspectionInfo = ({ subject, isRequiredLocation, isRequiredSignature, teamAssignee, team }) => {
    setWorkflow({
      ...workflow,
      subject,
      inspection: {
        ...workflow.inspection,
        isRequiredLocation,
        isRequiredSignature,
        teamAssignee,
        team,
      },
    });

    SyncDB.action(async () => {
      await InspectionMgr.update(workflow.parentGuid, (obj) => {
        const newTeamAssigneeId = teamAssignee[0];
        const newTeamId = team[0];
        if (newTeamAssigneeId !== obj.teamAssignee?.id) {
          obj.teamAssignee = { id: newTeamAssigneeId };
        }
        if (newTeamId !== obj.team?.id) {
          obj.team = { id: newTeamId };
        }
      });
    });
  };

  const closeModal = () => {
    setSignatureVisible(false);
  };

  const onAddSignature = (signature, index) => {
    closeModal();
    navigation.navigate('addSignature', {
      totalScores: calculateTotalScore(formRef.current.getValues().formPages),
      workflowParentId: workflow.parentGuid,
      workflowId,
      signature,
      index,
      showModal: () => setSignatureVisible(true),
    });
  };

  const onDetailSignature = (signature) => {
    closeModal();
    navigation.navigate('detailSignature', {
      totalScores: calculateTotalScore(formRef.current.getValues().formPages),
      signature,
      showModal: () => setSignatureVisible(true),
    });
  };

  const removeSignature = (signature) => {
    deleteInspectionSignature({
      signature,
      workflowParentId: workflow.parentGuid,
    });
  };

  const onPressSaveSignature = () => {
    setSignatureVisible(false);
    if (actionTypeRef.current === FormEditorTypes.CREATE_EDIT_INSPECTION && hadSignature) {
      onSubmit(formRef.current?.getValues());
      actionTypeRef.current = FormEditorTypes.VIEW_INSPECTION;
    }
  };

  const onRemoveSignature = (signature) => {
    AlertNative(
      I18n.t('INSPECTION_DELETE_SIGNATURE_TITLE'),
      I18n.t('INSPECTION_DELETE_SIGNATURE_MESSAGE'),
      () => removeSignature(signature),
      I18n.t('AD_COMMON_YES'),
      I18n.t('AD_COMMON_CANCEL')
    );
  };

  handleAutosave = async () => {
    if (actionTypeRef.current === FormEditorTypes.CREATE_EDIT_INSPECTION) {
      onSubmit(formRef.current?.getValues());
    }
  };
  // submit inspection
  const onSubmit = async (values) => {
    saveInspectionV2(_.cloneDeep(values));
  };

  const addOnButtonStyle = { minWidth: undefined };
  const addOnButton = isWorkFlowClosed
    ? [
        {
          title: I18n.t('INSPECTION_VIEW_REPORT'),
          type: 'primary',
          onPress: openReport,
          containerStyle: addOnButtonStyle,
        },
      ]
    : [];

  if (isShowPreview && isGranted('Inspection.Preview')) {
    addOnButton.push({
      title: I18n.t('FORM_PREVIEW_REPORT'),
      type: 'primary',
      onPress: openReport,
      containerStyle: {
        ...addOnButtonStyle,
        marginLeft: 7,
      },
    });
  }

  return (
    <View style={{ flex: 1 }}>
      <FormEditorScreen
        hadSignature={hadSignature}
        actionTypeRef={actionTypeRef.current}
        formRef={formRef}
        validationSchema={skipValidation ? undefined : validationSchema}
        title={workflowSubject}
        navigation={navigation}
        isLoading={isLoadingReport || isLoading || isInSignProgress}
        handleAutosave={handleAutosave}
        customRightBtn={
          isGranted('Inspection.Update') && (
            <RightButtons
              onEditPress={onEditPress}
              onSignaturePress={onSignPress}
              hideSignature={isWorkFlowClosed || locked}
            />
          )
        }
        actionType={actionType}
        addOnButton={addOnButton}
        initialValues={{
          subject: workflowSubject,
          categoryName: formData?.categoryName,
          workflowGuid: workflowId,
        }}
        onSubmit={onSubmit}
        customLeftPress={onLeftPress}
      />
      <AddSignatureModal
        setSignatureVisible={setSignatureVisible}
        visible={signatureVisible}
        isRequiredSignature={workflow.inspection?.isRequiredSignature}
        onComplete={updateSignatureSuccess}
        onClosePress={onPressSaveSignature}
        onAddSignature={onAddSignature}
        onDetailSignature={onDetailSignature}
        onRemoveSignature={onRemoveSignature}
        onPressSave={onPressSaveSignature}
      />
    </View>
  );
};

export default InspectionExcecution;
