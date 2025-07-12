/**
 * Created by thienmd on 9/23/20
 */
import React, { useMemo } from 'react';
import { LayoutAnimation, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { IconButton, Text } from '@Elements';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import I18n from '@I18n';
import { calculateTotalScore } from '@Transforms/SurveyTransformer';
import LocaleConfig from '@Config/LocaleConfig';
import styles from './styles';
import SelectItemModal from './components/SelectItemModal';
import { FormEditorTypes, formItemTypes } from '../../../Config/Constants';
import AddOrEditItemModal from './components/AddOrEditItemModal';
import SectionOptionModal from '../../../Modal/SectionOptionsModal';
import QuestionList from './components/QuestionList';
import AddItemButton from './components/AddItemButton';
import { compareMemoProps } from '../../../Utils/hook';
import { isGrantedAny } from '../../../Config/PermissionConfig';
import { FormDropdown } from '../../Forms';
import useInspection from '../../../Context/Inspection/Hooks/UseInspection';
import Row from '../../Grid/Row';
import { StatusTag } from './components/FormItems/FormItemHoc';

const SectionView = ({
  name,
  onInsertSection,
  navigation,
  onDeleteSection,
  onEditSection,
  onReorderSection,
  actionType,
  append,
  remove,
  setFieldValue,
  sectionName,
  fields,
  workflowGuid,
  getValues,
  isShowLess,
  hadSignature,
  moduleId,
  index,
  isNonEditable,
  formUserAnswerGuid,
  formPageGuid,
  formPageGroupName,
}) => {
  const {
    inspection: { questionTypeCategories },
  } = useInspection();

  const isVisualDefect = (data) => `${data}` === `${formItemTypes.VISUAL_DEFECTS}`;
  const formPages = getValues('formPages');
  const allowEditForm = isGrantedAny('Form.Create', 'Form.Update') && !isNonEditable;
  const isView = _.includes(
    [FormEditorTypes.VIEW_FORM, FormEditorTypes.VIEW_INSPECTION, FormEditorTypes.VIEW_HISTORY],
    actionType
  );
  const isSurveySubmit = actionType === FormEditorTypes.SUBMIT_FORM;

  const showCategory =
    fields.findIndex((item) => isVisualDefect(item.formQuestionTypeId || item.questionType?.id)) > -1;

  const formQuestionTypeCategoryName = `formPages.${index}.formQuestionTypeCategoryId`;
  const entityChangeType = getValues(`formPages.${index}.entityChangeType`);
  const isDeletedQuestion = entityChangeType === 2;

  const hideAddSectionItem =
    !allowEditForm ||
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

  const [moreOptionVisible, setMoreOptionVisible] = React.useState(false);
  const [isAddItem, setIsAddItem] = React.useState(false);
  const [isEditItem, setIsEditItem] = React.useState(false);
  const [selectedForm, setSelectedForm] = React.useState({
    idx: 0,
    item: undefined,
  });

  const groupName = formPageGroupName ? ` (${formPageGroupName})` : '';
  const formPageName = `${sectionName}${groupName}`;
  // const { setFieldValue } = useCommonFormController(`${name}.formQuestions.${selectedForm.idx}`, !selectedForm.item);

  React.useEffect(() => {
    if (!showCategory) {
      setFieldValue(formQuestionTypeCategoryName, 0);
    }
  }, [showCategory]);

  const onShowHideChange = (value) => {
    setFieldValue(`${name}.isShowLess`, value, { shouldDirty: false });
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  const onShowMore = () => {
    setMoreOptionVisible(true);
  };

  const expandShowMore = () => {
    setMoreOptionVisible(false);
  };

  const btReorderPress = () => {
    onReorderSection();
  };

  const chevronIcon = `chevron-${!isShowLess ? 'down' : 'up'}-outline`;

  const onAddItemPress = () => {
    setIsAddItem(true);
  };

  const onClosePress = () => {
    setIsAddItem(false);
  };

  const onCloseEditPress = () => {
    setIsEditItem(false);
  };

  const setQuestionGuidForAnswers = (answers, question) => {
    _.forEach(answers, (answer) => {
      answer.formQuestionGuid = question.guid;
      answer.formQuestionId = question.remoteId;
    });
  };

  const onCompleteEditItem = (item) => {
    // set formQuestionGuid for answers
    setQuestionGuidForAnswers(item.answers, item);
    setIsEditItem(false);
    setFieldValue(`${name}.formQuestions.${selectedForm.idx}`, { ...item, formUserAnswerGuid }, { shouldDirty: true });
  };

  const getMaxQuestionIndex = React.useCallback(
    () => _.maxBy(fields, (item) => item.questionIndex)?.questionIndex + 1,
    [fields]
  );

  const allFormItems = () => {
    let allItems = [];
    formPages.forEach((item) => {
      allItems = allItems.concat(item.formQuestions);
    });
    return allItems;
  };

  const sectionTotalScore = useMemo(() => calculateTotalScore([formPages[index]]), useWatch({ name: 'formPages' }));

  return (
    <View>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.headerTitleContainer}
          onPress={() => onShowHideChange(!isShowLess)}
        >
          <Row>
            <Row center style={{ flex: 1, flexWrap: 'wrap' }}>
              <Text style={styles.sectionName}>{formPageName}</Text>
              {!!sectionTotalScore && (
                <Text text={`${LocaleConfig.formatNumber(sectionTotalScore)} ${I18n.t('SCORE').toLowerCase()}`} />
              )}
              <StatusTag statusId={entityChangeType} />
            </Row>
            <IconButton
              containerStyle={styles.headerButton}
              name={chevronIcon}
              size={20}
              onPress={() => onShowHideChange(!isShowLess)}
            />
            {isDeletedQuestion && <View style={styles.blurView} />}
            {!isView && allowEditForm && !isSurveySubmit && (
              <IconButton name="ellipsis-horizontal-outline" size={20} onPress={onShowMore} />
            )}
          </Row>
        </TouchableOpacity>
        {showCategory && (
          <FormDropdown
            label=""
            mode="small"
            name={formQuestionTypeCategoryName}
            options={questionTypeCategories}
            placeholder="FORM_CATEGORY_PLACEHOLDER"
          />
        )}
      </View>

      <View style={{ display: !isShowLess ? 'flex' : 'none', minHeight: 5 }}>
        <QuestionList
          fields={fields}
          hadSignature={hadSignature}
          name={name}
          navigation={navigation}
          actionType={actionType}
          workflowGuid={workflowGuid}
          setSelectedForm={setSelectedForm}
          setIsEditItem={setIsEditItem}
          remove={remove}
          isNonEditable={isNonEditable}
          pageEntityChangeType={entityChangeType}
          moduleId={moduleId}
          isView={isView}
        />

        {isAddItem && (
          // only mount when the modal visible
          <SelectItemModal
            data={allFormItems()}
            visible={isAddItem}
            moduleId={moduleId}
            onClosePress={onClosePress}
            onComplete={(item) => {
              append({ ...item, formUserAnswerGuid, formPageGuid, questionIndex: getMaxQuestionIndex() });
            }}
            formUserAnswerGuid={formUserAnswerGuid}
          />
        )}

        {isEditItem && (
          <AddOrEditItemModal
            selectedItem={selectedForm.item}
            visible={isEditItem}
            moduleId={moduleId}
            onClosePress={onCloseEditPress}
            onComplete={onCompleteEditItem}
            formUserAnswerGuid={formUserAnswerGuid}
          />
        )}

        <View style={styles.actionContainer}>
          {!hideAddSectionItem && (
            <AddItemButton title="INSPECTION_QUESTION" onPress={onAddItemPress} containerStyle={styles.btAdd} info />
          )}
          {!hideAddSectionItem && (
            <AddItemButton title="INSPECTION_SECTION" onPress={onInsertSection} containerStyle={styles.btAdd} />
          )}
        </View>
      </View>

      {isEditItem && (
        <AddOrEditItemModal
          selectedItem={selectedForm.item}
          visible={isEditItem}
          moduleId={moduleId}
          onClosePress={onCloseEditPress}
          onComplete={onCompleteEditItem}
          formUserAnswerGuid={formUserAnswerGuid}
        />
      )}

      {moreOptionVisible && (
        <SectionOptionModal
          visible={moreOptionVisible}
          onClosePress={expandShowMore}
          onRemove={onDeleteSection}
          onEdit={onEditSection}
          onReorder={btReorderPress}
        />
      )}
    </View>
  );
};

const compareFields = ['name', 'sectionName', 'isShowLess', 'workflowGuid', 'hadSignature', 'formPageGroupName'];

const MemoSection = React.memo(SectionView, (prevProps, nextProps) => {
  const isSame = compareMemoProps(prevProps, nextProps, compareFields);
  if (isSame) {
    return _.size(prevProps.fields) === _.size(nextProps.fields);
  }
  return false;
});

const SectionViewContainer = ({ control, name, ...restProps }) => {
  const { setValue: setFieldValue, getValues } = useFormContext();
  const sectionName = useWatch({ name: `${name}.name` });
  const isShowLess = useWatch({ name: `${name}.isShowLess` });
  const workflowGuid = useWatch({ name: 'workflowGuid' });
  const formUserAnswerGuid = useWatch({ name: 'formUserAnswer.id' });
  const formPageGroupName = useWatch({ name: `${name}.formPageGroupName` });

  const fieldArrays = useFieldArray({
    control,
    name: `${name}.formQuestions`,
    keyName: 'uniqueId',
  });

  return (
    <MemoSection
      {...restProps}
      {...fieldArrays}
      workflowGuid={workflowGuid}
      isShowLess={isShowLess}
      setFieldValue={setFieldValue}
      getValues={getValues}
      name={name}
      sectionName={sectionName}
      formUserAnswerGuid={formUserAnswerGuid}
      formPageGroupName={restProps?.isMasterSection && formPageGroupName}
    />
  );
};

export default SectionViewContainer;

SectionView.propTypes = {
  sectionName: PropTypes.string,
};

SectionView.defaultProps = {
  sectionName: '',
};
