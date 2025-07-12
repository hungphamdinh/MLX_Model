import React, { useEffect } from 'react';
import { LayoutAnimation, View, Platform } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { AvoidSoftInputView } from 'react-native-avoid-softinput';

import I18n from '@I18n';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import _ from 'lodash';
import BaseLayout from '@Components/Layout/BaseLayout';
import SectionView from '@Components/InnovatorInspection/SectionView';
import SelectSectionModal from '@Components/InnovatorInspection/SectionView/components/SelectSectionModal';
import AddOrEditSectionModal from '@Components/InnovatorInspection/SectionView/components/AddOrEditSectionModal';
import FormTotalScore from '@Components/InnovatorInspection/FormTotalScore';
import AutoSaveWatcher from '@Components/InnovatorInspection/AutoSaveWatcher';
import { FormEditorTypes } from '@Config/Constants';
import { Metric } from '@Themes';
import { useYupValidationResolver } from '@Utils/hook';
import AddItemButton from '@Components/InnovatorInspection/SectionView/components/AddItemButton';
import { calculateEstimatedSizeForForm } from '@Utils/inspectionUtils';
import FormLoadingLoading from '@Components/Lists/Loaders/FormLoadingLoading';
import { Text, Button } from '@Elements';
import { NetWork } from '@Utils';
import useInspection from '@Context/Inspection/Hooks/UseInspection';
import useInspectionForm from '@Context/Form/Hooks/UseForm';

import SetUpMasterSectionButton from '@Components/InnovatorInspection/SectionView/components/SetUpMasterSectionButton';
import logService from '../../../../Services/LogService';
import styles from './styles';
import { INSPECTION_FORM_TYPE, INSPECTION_STATUS } from '../../../../Config/Constants';

const log = logService.extend('FormEditorScreen');

const FormEditorScreen = ({
  navigation,
  rightBtn,
  title,
  isLoading,
  addOnButton,
  addOnInputFields,
  initialValues,
  actionType,
  formRef,
  customLeftPress,
  validationSchema,
  customRightBtn,
  hadSignature,
  handleAutosave,
  isViewHistory,
}) => {
  const { getInspectionFormDetailOnline } = useInspection();
  const { form, setInspectionFormType } = useInspectionForm();
  const formData = navigation.getParam('formData');
  const moduleId = navigation.getParam('moduleId');
  const workflow = navigation.getParam('workflow');

  const listRef = React.useRef(null);
  const isAndroid12 = Metric.isANDROID && Platform.Version > 11;
  const formSettings = form?.formSettings;

  const allowEdit = _.includes([FormEditorTypes.CREATE_EDIT_INSPECTION, FormEditorTypes.CREATE_EDIT_FORM], actionType);

  const [isInsertSection, setIsInsertSection] = React.useState(false);
  const [toIndex, setToIndex] = React.useState(false);
  const [isEditSection, setIsEditSection] = React.useState(false);
  const [isShowLess, setIsShowLess] = React.useState(false);
  const [isLoadingCollapse, setIsLoadingCollapse] = React.useState(true);
  const [selectedSection, setSelectedSection] = React.useState({
    idx: 0,
    item: undefined,
  });

  const defaultValues = {
    estimateSectionSize: 70,
    estimateQuestionSize: 70,
    ..._.cloneDeep(formData),
    ...initialValues,
    ...calculateEstimatedSizeForForm(formData),
    moduleId,
  };

  let showChangeHistory = false;
  let showDefectDetail = false;

  if (workflow) {
    showChangeHistory = NetWork.isConnected && !isViewHistory && defaultValues?.isReadOnly;
    showDefectDetail =
      actionType === FormEditorTypes.VIEW_INSPECTION &&
      workflow.status?.code === INSPECTION_STATUS.COMPLETED &&
      workflow?.workOrderId;
  }

  const formMethods = useForm({
    resolver: useYupValidationResolver(validationSchema),
    defaultValues,
  });

  const setFieldValue = formMethods.setValue;

  const { control, formState } = formMethods;
  const {
    fields: formPages,
    remove,
    insert,
  } = useFieldArray({
    control,
    name: 'formPages',
    keyName: 'uniqueId',
  });

  useEffect(() => {
    if (formRef) {
      formRef.current = formMethods;
    }
  }, [formMethods]);

  useEffect(() => {
    if (isLoadingCollapse) {
      const questionsCount = formMethods
        .getValues('formPages')
        .reduce((accumulator, currentValue) => accumulator + _.size(currentValue.formQuestions), 0);
      const timeout = questionsCount > 100 ? 2000 : 1000;

      setTimeout(() => {
        setIsLoadingCollapse(false);
      }, timeout);
    }
    log.info('isLoadingCollapse', isLoadingCollapse);
  }, [isLoadingCollapse]);

  useEffect(() => {
    setInspectionFormType(formData?.type);
  }, [formData]);

  // insert sections
  const onInsertSectionPress = (index) => {
    setIsInsertSection(true);
    setToIndex(index);
    log.info('onInsertSectionPress', index);
  };

  const onInsertSectionClose = () => {
    setIsInsertSection(false);
    log.info('onInsertSectionClose');
  };

  const onSetUpMasterSection = () => {
    navigation.navigate(
      actionType === FormEditorTypes.CREATE_EDIT_INSPECTION ? 'setUpMasterSectionInspection' : 'setUpMasterSectionForm',
      {
        formPages: formMethods.getValues('formPages'),
        formPageGroups: formMethods.getValues('formPageGroups'),
        formData,
        onComplete: ({ formPages: pages, formPageGroups }) => {
          setFieldValue('formPages', pages);
          setFieldValue('formPageGroups', formPageGroups);
        },
      }
    );
  };

  // edit section

  const onEditSectionPress = (index) => {
    const section = formMethods.getValues(`formPages.${index}`);
    setIsEditSection(true);
    setSelectedSection({
      item: section,
      idx: index,
    });
    log.info('onEditSectionPress', index);
  };

  const onAddSectionPress = () => {
    setIsEditSection(true);
    setSelectedSection({
      item: null,
      idx: 0,
    });
    log.info('onAddSectionPress');
  };

  const onCloseEditSectionPress = () => {
    setIsEditSection(false);
    log.info('onCloseEditSectionPress');
  };

  // const getLatestFormPages = () => {
  //   const values = formMethods.getValues();
  // };

  // reorder
  const onReorderSectionPress = () => {
    navigation.navigate('reorderSection', {
      onComplete: (items) => {
        setFieldValue('formPages', items, { shouldDirty: true });
      },
      data: formMethods.getValues('formPages'),
    });
    log.info('onReorderSectionPress');
  };

  const onChangeHistoryVisible = async () => {
    let inspectionForm = formData;
    let inspection = workflow;
    if (actionType !== FormEditorTypes.VIEW_HISTORY) {
      const response = await getInspectionFormDetailOnline({
        ...workflow,
        isNotNavigate: true,
      });
      inspectionForm = response.formData;
      inspection = response.detailInfo;
    }
    navigation.navigate('changeHistory', {
      inspectionId: formData?.id,
      formData: inspectionForm,
      inspection,
    });
  };

  const bottomButtons = [
    {
      title: isShowLess ? I18n.t('AD_COMMON_EXPAND') : I18n.t('AD_COMMON_COLLAPSE'),
      icon: isShowLess ? 'chevron-down-outline' : 'chevron-up-outline',
      type: 'info',
      onPress: () => {
        formMethods.setValue(
          'formPages',
          formMethods.getValues('formPages').map((formPage) => ({
            ...formPage,
            isShowLess: !isShowLess,
          }))
        );
        setIsLoadingCollapse(true);

        setIsShowLess(!isShowLess);
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        listRef.current?.scrollToIndex({ index: 0 });
        log.info('onShowLessOrMorePress', isShowLess);
      },
    },
  ];

  if (addOnButton) {
    if (Array.isArray(addOnButton)) {
      if (addOnButton.length > 0) {
        addOnButton.map((item) => bottomButtons.push(item));
      }
    } else {
      bottomButtons.push(addOnButton);
    }
  }

  const renderItem = ({ item, index }) => (
    <SectionView
      key={`${item.id}`}
      onInsertSection={() => onInsertSectionPress(index)}
      onDeleteSection={() => {
        remove(index);
        log.info('onDeleteSection', index);
      }}
      onEditSection={() => onEditSectionPress(index)}
      onReorderSection={onReorderSectionPress}
      section={item}
      name={`formPages.${index}`}
      navigation={navigation}
      actionType={actionType}
      control={control}
      index={index}
      hadSignature={hadSignature}
      formPageGuid={item.id}
      isNonEditable={defaultValues?.isReadOnly || formData?.type === INSPECTION_FORM_TYPE.INVENTORY_CHECK_LIST}
      isMasterSection={formSettings?.isMasterSection}
      moduleId={moduleId}
    />
  );

  const onLeftPress = () => {
    if (customLeftPress) {
      customLeftPress();
      return;
    }
    navigation.goBack();
  };

  const onPressDefectDetail = () => {
    navigation.navigate('defectDetail', {
      id: workflow?.parentId,
    });
  };

  const mainLayoutProps = {
    loading: isLoading,
    title,
    onLeftPress,
    rightBtn,
    customRightBtn,
    bottomButtons,
  };

  const Wrapper = isViewHistory ? View : BaseLayout;
  const sectionStyles = { marginTop: addOnInputFields ? 0 : 15, marginHorizontal: 5 };

  return (
    <Wrapper style={styles.wrapper} {...mainLayoutProps}>
      {formSettings?.isMasterSection && allowEdit && (
        <SetUpMasterSectionButton title="INSPECTION_SET_UP_MASTER_SECTION" onPress={onSetUpMasterSection} />
      )}
      {showChangeHistory && (
        <Button onPress={onChangeHistoryVisible}>
          <Text style={styles.buttonChangeHistory} text="INSPECTION_CHANGE_HISTORY" />
        </Button>
      )}
      {showDefectDetail && (
        <Button onPress={onPressDefectDetail}>
          <Text style={styles.buttonChangeHistory} text="INSPECTION_DEFECT_DETAIL" />
        </Button>
      )}

      <AvoidSoftInputView
        avoidOffset={10}
        easing="easeIn"
        hideAnimationDelay={100}
        hideAnimationDuration={300}
        showAnimationDelay={100}
        showAnimationDuration={800}
        style={{ flex: 1 }}
      >
        <FormProvider {...formMethods}>
          <FlashList
            data={formPages}
            estimatedItemSize={formState.estimateSectionSize}
            ref={listRef}
            keyExtractor={(item) => `${item.id || item.uniqueId}`}
            initialNumToRender={2} // Reduce initial render amount
            maxToRenderPerBatch={1} // Reduce number in each render batch
            updateCellsBatchingPeriod={100} // Increase time between renders
            extraScrollHeight={60}
            removeClippedSubviews={!isAndroid12}
            showsVerticalScrollIndicator
            keyboardShouldPersistTaps="handled"
            enableResetScrollToCoords={false}
            contentContainerStyle={styles.contentContainer}
            ListEmptyComponent={formData && formData.formPages.length > 0 ? <FormLoadingLoading /> : null}
            ListHeaderComponent={addOnInputFields && <View style={styles.addOnContainer}>{addOnInputFields}</View>}
            ListFooterComponent={
              _.size(formPages) === 0 && actionType !== FormEditorTypes.VIEW_FORM ? (
                <AddItemButton containerStyle={sectionStyles} title="INSPECTION_SECTION" onPress={onAddSectionPress} />
              ) : (
                <FormTotalScore />
              )
            }
            extraData={actionType}
            renderItem={renderItem}
          />
          {isEditSection && (
            <AddOrEditSectionModal
              selectedItem={selectedSection.item}
              visible={isEditSection}
              formGuid={formData?.guid}
              onClosePress={onCloseEditSectionPress}
              onComplete={(item) => {
                if (selectedSection.item) {
                  setFieldValue(`formPages.${selectedSection.idx}`, item, { shouldDirty: true });
                } else {
                  insert(0, item);
                }
                onCloseEditSectionPress();
                log.info('onComplete', item);
              }}
            />
          )}

          {isInsertSection && (
            <SelectSectionModal
              data={formMethods.getValues('formPages')}
              visible={isInsertSection}
              formGuid={formData?.guid}
              onClosePress={onInsertSectionClose}
              onComplete={(item) => {
                insert(toIndex + 1, item);
                log.info('onCompleteSection', item);
              }}
              moduleId={moduleId}
            />
          )}
          <AutoSaveWatcher handleAutosave={handleAutosave} />
        </FormProvider>
      </AvoidSoftInputView>
      {isLoadingCollapse && <FormLoadingLoading />}
    </Wrapper>
  );
};

export default FormEditorScreen;
