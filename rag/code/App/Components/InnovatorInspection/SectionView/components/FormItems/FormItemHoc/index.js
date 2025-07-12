/**
 * Created by thienmd on 10/2/20
 */
import React from 'react';
import { TouchableOpacity, View, Image } from 'react-native';
import { Card, Text, RequiredText } from '@Elements';
import I18n from '@I18n';
import _ from 'lodash';
import Icon from 'react-native-vector-icons/Ionicons';
import Swipeable from 'react-native-swipeable';
import { FormEditorTypes, formItemTypes } from '@Config/Constants';
import { Colors } from '@Themes';
import Badge from '@Elements/Badge';
import { useCommonFormController } from '@Forms/FormControl';
import { isGrantedAny } from '@Config/PermissionConfig';
import { useFormContext } from 'react-hook-form';
import NavigationService from '@NavigationService';
import { isHKQuestionType } from '@Utils/inspectionUtils';
import useInspection from '@Context/Inspection/Hooks/UseInspection';
import styles, { iconButtonStyle } from './styles';
import Row from '../../../../../Grid/Row';
import RightButtons from '../../../../../Lists/RightButtons';
import { icons } from '../../../../../../Resources/icon';
import Tag from '../../../../../Tag';
import SubQuestion from '../SubQuestion';
import FormItemHeader from '../FormItemHeader';
import DefectView from './DefectView';
import styled from 'styled-components/native';
import { Modules } from '../../../../../../Config/Constants';

const iconColor = '#4A89E8';

const IconButtonWrapper = styled.View`
  align-items: center;
`;

const IconButton = ({ icon, onPress, name, badge, disabled, required, style, imageStyle, source, isError, testID }) => {
  const color = disabled ? Colors.light : isError ? 'red' : iconColor;
  return (
    <TouchableOpacity testID={testID} disabled={disabled} style={[iconButtonStyle.container, style]} onPress={onPress}>
      <View>
        {!source ? (
          <Icon name={icon} size={30} color={color} />
        ) : (
          <Image
            resizeMode="contain"
            source={source}
            style={[imageStyle, styles.image, isError && { tintColor: 'red' }]}
          />
        )}
        <Badge badge={badge} />
      </View>
      <Text>
        <Text style={[iconButtonStyle.name, { color }]}>{I18n.t(name)}</Text>
        {required && <RequiredText />}
      </Text>
    </TouchableOpacity>
  );
};

const withErrorHandling = (WrappedComponent) => (props) => {
  const { error } = useCommonFormController(`${props.formName}.${props.errorField}`);
  return <WrappedComponent {...props} isError={!!error} />;
};

export const IconButtonRequired = withErrorHandling((props) => <IconButton {...props} />);

const withFormItem =
  (WrappedComponent) =>
  ({
    images,
    isImage,
    isAllowComment,
    onEditPress,
    onRemovePress,
    isMandatory,
    isRequiredImage,
    isRequiredLocation,
    comment,
    label,
    actionType,
    isNonEditable,
    entityChangeType,
    isView,
    workflowGuid,
    isDeclareQuantityMandatory,
    declareQuantity,
    isDeclareQuantity,
    isQAndAQuestion,
    subQuestion,
    projectTypeId,
    budgetCodes,
    isDefect,
    uaqDefectDescription,
    comments,
    moduleId,
    ...props
  }) => {
    const { setValue, getValues } = useFormContext();
    const {
      inspection: { projectTypes, inspectionSetting },
    } = useInspection();

    const formName = props.formName;
    const uaqId = props.uaqId;
    let isMarchingQuestion = false;
    if (props.dropdownProps) {
      isMarchingQuestion = _.includes(props.dropdownProps.name, 'uaqAnswerMarching');
    }
    const [swipeRef, setSwipeRef] = React.useState(null);
    const isDeletedQuestion = entityChangeType === 2;
    const questionTypeId = Number(getValues(formName).formQuestionTypeId);
    const isHKType = isHKQuestionType(questionTypeId);
    const projectType = projectTypes.find((item) => item.id === projectTypeId)?.name;

    const btEditPress = () => {
      if (swipeRef) {
        swipeRef.recenter();
      }
      onEditPress();
    };

    const btRemovePress = () => {
      if (swipeRef) {
        swipeRef.recenter();
      }
      onRemovePress();
    };

    const btQuantityPress = React.useCallback(() => {
      NavigationService.navigate('formQuantity', {
        notes: declareQuantity,
        isView,
        formName,
        callBack: onUpdateQuantity,
      });
    }, [declareQuantity, formName, isView]);

    const btNotePress = React.useCallback(() => {
      const baseParams = {
        isView,
        formName,
        notes: comment,
        callBack: onUpdateComment,
      };
    
      const dynamicNotesParams = {
        dynamicNotes: comments,
        callBack: onUpdateComments,
      };
    
      const isSurveyModule = moduleId === Modules.SURVEY;
      const isSurveyWithNotes = isSurveyModule && _.size(comments) > 0;
      const routeName = isSurveyWithNotes ? 'formNotes' : 'formNote';
    
      NavigationService.navigate(routeName, {
        ...baseParams,
        ...(isSurveyWithNotes ? dynamicNotesParams : {}),
        isSurveyModule,
      });
    }, [comments, comment, formName, isView]);

    const btDefectPress = React.useCallback(() => {
      NavigationService.navigate('formDefect', {
        notes: uaqDefectDescription,
        isView,
        formName,
        callBack: onUpdateDefect,
      });
    }, [uaqDefectDescription, formName, isView]);

    const btAdditionalPress = React.useCallback(() => {
      NavigationService.navigate('formAdditionalAnswer', {
        notes: subQuestion.uaqAnswerContent,
        placeholder: subQuestion.isDescriptionDefined ? subQuestion.description : '',
        isView,
        formName,
        callBack: onUpdateAdditionalAnswer,
      });
    }, [subQuestion?.uaqAnswerContent, subQuestion?.description, formName, isView]);

    const btImagesPress = React.useCallback(() => {
      NavigationService.navigate('attachImages', {
        images,
        workflowGuid,
        isView,
        isRequiredLocation,
        uaqId,
        submitOnline:
          actionType === FormEditorTypes.SUBMIT_FORM || actionType === FormEditorTypes.ONLINE_CREATE_EDIT_INSPECTION,
        callBack: onUpdateImages,
        moduleId,
      });
    }, [images, formName, isView, isRequiredLocation]);

    const onUpdateDefect = (note) => {
      setValue(`${formName}.uaqDefectDescription`, note);
    };

    const onUpdateComments = (note) => {
      setValue(`${formName}.uaqComment`, note.notes);
      setValue(`${formName}.uaqComments`, note.comments);
    };

    const onUpdateComment = (note) => {
      setValue(`${formName}.uaqComment`, note);
    };

    const onUpdateAdditionalAnswer = (answer) => {
      setValue(`${formName}.subQuestion.uaqAnswerContent`, answer);
    };

    const onUpdateQuantity = (note) => {
      setValue(`${formName}.uaqDeclareQuantity`, note);
    };

    const onUpdateImages = (newImages) => {
      const uaqImages = newImages.map((item) => {
        const { location } = item;
        if (location) {
          return {
            ...item,
            longitude: location.longitude,
            latitude: location.latitude,
          };
        }
        return item;
      });
      setValue(`${formName}.uaqImages`, uaqImages, { shouldDirty: true });
    };

    const isShowSubQuestion = (condition) =>
      _.size(subQuestion) > 0 && !isHKType && questionTypeId !== formItemTypes.Q_AND_A_TEXT_AREA && condition;

    const buttons = [
      {
        title: I18n.t('AD_COMMON_REMOVE'),
        color: 'red',
        icon: 'trash-outline',
        onPress: btRemovePress,
      },
    ];
    if (!isMarchingQuestion) {
      buttons.push({
        title: I18n.t('AD_COMMON_EDIT'),
        icon: 'create-outline',
        color: '#2d61d3',
        onPress: btEditPress,
      });
    }

    const rightButtons = [<RightButtons buttons={buttons} />];
    const allowEditForm = isGrantedAny('Form.Create', 'Form.Update');
    const hideSwiper =
      !allowEditForm ||
      isNonEditable ||
      _.includes(
        [
          FormEditorTypes.VIEW_FORM,
          FormEditorTypes.VIEW_INSPECTION,
          FormEditorTypes.SUBMIT_FORM,
          FormEditorTypes.ONLINE_CREATE_EDIT_INSPECTION,
          FormEditorTypes.VIEW_HISTORY,
        ],
        actionType
      );

    const Wrapper = hideSwiper ? View : Swipeable;

    const isNotJobExecution = _.includes(
      [
        FormEditorTypes.VIEW_FORM,
        FormEditorTypes.CREATE_EDIT_FORM,
        FormEditorTypes.VIEW_INSPECTION,
        FormEditorTypes.VIEW_HISTORY,
      ],
      actionType
    );
    const isJob = _.includes([FormEditorTypes.CREATE_EDIT_INSPECTION, FormEditorTypes.VIEW_INSPECTION], actionType);

    const pointerEvents = _.includes([FormEditorTypes.VIEW_FORM, FormEditorTypes.CREATE_EDIT_FORM], actionType)
      ? 'none'
      : 'auto';
    const pointerEventItem = isNotJobExecution ? 'none' : 'auto';
    const validCommentsCount = _.size(
      _.filter(comments, (comment) => _.trim(comment.answerComment || '').length > 0)
    );
    const commentCounts = validCommentsCount + (_.isEmpty(comment) ? 0 : 1)

    const viewOnly = _.includes([FormEditorTypes.VIEW_INSPECTION, FormEditorTypes.VIEW_HISTORY], actionType);
    const disabledIconButton = (field) => viewOnly && !_.size(field);

    return (
      <Wrapper rightButtons={rightButtons} onRef={(c) => setSwipeRef(c)} rightButtonWidth={140}>
        <Card style={styles.container}>
          <FormItemHeader projectType={projectType} budgetCodes={budgetCodes} />
          <View pointerEvents={pointerEvents}>
            <Row>
              <View style={styles.wrapped} pointerEvents={pointerEventItem}>
                {label && (
                  <Row>
                    <Text style={styles.titleContainer}>
                      <Text preset="medium" style={styles.title}>
                        {label}
                      </Text>
                      {isMandatory && <Text style={styles.required}> *</Text>}
                    </Text>
                    {actionType === FormEditorTypes.VIEW_HISTORY && <StatusTag statusId={entityChangeType} />}
                  </Row>
                )}

                <WrappedComponent small {...props} />
              </View>
              <IconButtonWrapper>
                {isImage && (
                  <IconButtonRequired
                    required={isRequiredImage}
                    disabled={disabledIconButton(images)}
                    source={isRequiredLocation ? icons.photoLocation : undefined}
                    imageStyle={isRequiredLocation ? styles.photoLocation : undefined}
                    name="AD_COMMON_PHOTOS"
                    icon={!isRequiredLocation && 'image-outline'}
                    onPress={btImagesPress}
                    badge={_.size(images)}
                    formName={formName}
                    errorField="uaqImages"
                  />
                )}
                {isAllowComment &&
                  <IconButton
                    disabled={disabledIconButton(_.size(comments) > 0 ? comments : comment)}
                    name={!isQAndAQuestion ? 'AD_COMMON_NOTES' : 'INSPECTION_INVESTOR_FEEDBACK'}
                    icon="create-outline"
                    onPress={btNotePress}
                    badge={commentCounts}
                  />
                }
                {isShowSubQuestion(subQuestion?.formQuestionTypeId === formItemTypes.TEXT_AREA) && (
                  <IconButton
                    disabled={viewOnly}
                    name="FORM_ADDITIONAL_ANSWER"
                    icon="create-outline"
                    onPress={btAdditionalPress}
                    badge={_.size(subQuestion.uaqAnswerContent) > 0 ? 1 : 0}
                  />
                )}
                {isDeclareQuantity && (
                  <IconButtonRequired
                    required={isDeclareQuantityMandatory}
                    disabled={viewOnly}
                    name="AD_COMMON_QUANTITY"
                    icon="create-outline"
                    onPress={btQuantityPress}
                    badge={_.size(declareQuantity) > 0 ? 1 : 0}
                    formName={formName}
                    errorField="uaqDeclareQuantity"
                  />
                )}
                {inspectionSetting?.isAllowDefect && isJob && (
                  <DefectView
                    uaqDefectDescription={uaqDefectDescription}
                    isDefect={isDefect}
                    setValue={setValue}
                    formName={formName}
                    onDefectPress={btDefectPress}
                    disabled={viewOnly}
                  />
                )}
              </IconButtonWrapper>
              {isDeletedQuestion && <View style={styles.blurView} />}
            </Row>
            {isShowSubQuestion(subQuestion?.formQuestionTypeId === formItemTypes.MULTIPLE_CHOICE) && (
              <SubQuestion setFieldValue={setValue} formName={formName} subQuestion={subQuestion} />
            )}
          </View>
        </Card>
      </Wrapper>
    );
  };

export default withFormItem;

export const StatusTag = ({ statusId }) => {
  let title = 'FORM_QUESTION_NEW';
  let color = Colors.success;
  const textColor = 'white';

  if (statusId === 1) {
    title = 'FORM_QUESTION_EDITED';
    color = Colors.statusHight;
  }
  if (statusId === 2) {
    title = 'FORM_QUESTION_DELETED';
    color = Colors.info;
  }

  if (!statusId && statusId !== 0) return null;
  return (
    <Tag
      title={title}
      textStyle={{ color: textColor }}
      containerStyle={[styles.statusTag, { backgroundColor: color }]}
    />
  );
};
