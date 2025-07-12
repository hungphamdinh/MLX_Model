import React, { useEffect } from 'react';
import * as Yup from 'yup';
import { DeviceEventEmitter } from 'react-native';
import I18n from '@I18n';
import NavigationService from '@NavigationService';
import _ from 'lodash';
import { FormProvider, useForm } from 'react-hook-form';
import styled from 'styled-components/native';

import BaseLayout from '../../../Components/Layout/BaseLayout';
import { FormDocumentPicker, FormDropdown, FormInput } from '../../../Components/Forms';
import AwareScrollView from '../../../Components/Layout/AwareScrollView';
import useFeedback from '../../../Context/Feedback/Hooks/useFeedback';
import Box from '../../../Elements/Box';
import FloatingConversation from '../../../Components/modalChat/FloatingConversation';
import { Modules } from '../../../Config/Constants';
import FormSuggestionPicker, { SuggestionTypes } from '../../../Components/Forms/FormSuggestionPicker';
import { useYupValidationResolver } from '../../../Utils/hook';
import useFile from '../../../Context/File/Hooks/UseFile';
import { Text, Button } from '../../../Elements';

const TextJR = styled(Text)`
  color: blue;
`;

const ButtonLink = styled(Button)`
  margin-bottom: 12px;
`;

const AddOrEditFeedback = ({ navigation }) => {
  const {
    feedback: { sources, statusList, fbDetail, categories, types },
    isLoading,
    getCategories,
    getSources,
    addFB,
    editFB,
    detailFB,
    getTypes,
    getFeedbackStatus,
  } = useFeedback();

  const {
    getFileReference,
    file: { fileUrls },
  } = useFile();

  const id = navigation.getParam('id');
  const isAddNew = _.get(navigation, 'state.routeName') === 'addFeedback';

  const submitRequest = isAddNew ? addFB : editFB;
  const title = isAddNew ? I18n.t('FEEDBACK_ADD') : I18n.t('FEEDBACK_EDIT');

  const requiredMessage = I18n.t('FORM_THIS_FIELD_IS_REQUIRED');

  const validationSchema = Yup.object().shape({
    unit: Yup.object().test('unit', requiredMessage, function (value) {
      return _.size(value);
    }),
    description: Yup.string().required(requiredMessage),
    commentBoxStatus: Yup.object().nullable().required(requiredMessage),
    commentBoxCategoryId: Yup.number().required(requiredMessage),
    commentBoxTypeId: Yup.number().required(requiredMessage),
  });

  useEffect(() => {
    if (!isAddNew) {
      detailFB(id);
    }
    getFeedbackStatus();
    getTypes();
    getCategories();
    getSources();
  }, []);

  useEffect(() => {
    setValue('images', fileUrls);
  }, [fileUrls.length]);

  const onSubmit = async ({
    unit,
    images,
    commentBoxStatus: { statusCode },
    commentBoxId,
    commentBoxType,
    commentBoxNature,
    commentBoxTypeId,
    commentBoxCategoryId,
    commentBoxSourceId,
    location,
    description,
    ...values
  }) => {
    const fullUnitCode = unit.fullUnitCode || fbDetail.fullUnitCode;
    const buildingId = unit.buildingId || fbDetail.buildingId;
    const unitId = unit.unitId || fbDetail.unitId;
    const commonParams = {
      fullUnitCode,
      buildingId,
      unitId,
      commentBoxTypeId,
      commentBoxStatusCode: `FEEDBACK_${statusCode}`,
      commentBoxType,
      commentBoxStatus: statusCode,
      commentBoxCategoryId,
      locationId: location?.id,
      fileUrls: null,
      commentBoxSourceId,
      description,
    };
    let params = {
      ...commonParams,
      ...values,
    };
    if (!isAddNew) {
      params = {
        ...commonParams,
        commentBoxId,
        guid: fbDetail.guid,
        commentBoxNature: commentBoxNature.code,
        userName: '',
        reasonReOpen: '',
      };
    }
    const uploadImages = images.filter((item) => item.path);

    const result = await submitRequest({
      params,
      files: uploadImages,
    });
    if (result) {
      NavigationService.goBack();
      DeviceEventEmitter.emit('UpdateListFeedback', 1);
    }
  };

  const onPressJR = (jrId) => {
    NavigationService.navigate('editJobRequest', {
      id: jrId,
    });
  };

  const getInitialValuesForUpdate = () => {
    if (isAddNew) {
      return {};
    }
    const { fullUnitCode, commentBoxCategory, commentBoxSource, guid, ...restDetail } = fbDetail;

    getFileReference(guid);

    return {
      ...restDetail,
      unit: {
        fullUnitCode,
      },
      commentBoxSourceId: commentBoxSource ? commentBoxSource.id : undefined,
      commentBoxCategoryId: commentBoxCategory.id,
      images: [],
    };
  };

  const formMethods = useForm({
    resolver: useYupValidationResolver(validationSchema),
    defaultValues: {
      id: undefined,
      commentBoxTypeId: undefined,
      unit: {},
      commentBoxCategoryId: undefined,
      location: {},
      commentBoxSourceId: undefined,
      commentBoxStatus: '',
      images: [],
      description: '',
    },
  });

  const { setValue, watch } = formMethods;
  const unit = watch('unit');
  useEffect(() => {
    if (fbDetail) {
      formMethods.reset(getInitialValuesForUpdate());
    }
  }, [fbDetail]);

  const baseLayoutProps = {
    title,
    showBell: false,
    containerStyle: { paddingHorizontal: 15 },
    loading: isLoading,
    bottomButtons: [
      {
        title: 'AD_COMMON_SAVE',
        type: 'primary',
        permission: !isAddNew && 'Feedbacks.Update',
        onPress: () => {
          formMethods.handleSubmit(onSubmit)();
        },
      },
    ],
  };

  if (!fbDetail && !isAddNew) {
    return <BaseLayout {...baseLayoutProps} displayPlaceholder />;
  }

  return (
    <BaseLayout {...baseLayoutProps}>
      <FormProvider {...formMethods}>
        <AwareScrollView>
          <FormDropdown
            required
            options={statusList}
            label="COMMON_STATUS"
            valKey="name"
            placeholder=""
            showValue={false}
            name="commentBoxStatus"
          />
          <FormDropdown
            required
            options={types}
            label="COMMON_TYPE"
            placeholder="COMMON_TYPE"
            name="commentBoxTypeId"
          />
          <FormDropdown
            required
            options={categories}
            label="COMMON_CATEGORY"
            placeholder="COMMON_CATEGORY"
            name="commentBoxCategoryId"
          />
          <FormSuggestionPicker
            type={SuggestionTypes.LOCATION}
            label="COMMON_LOCATION"
            placeholder="COMMON_LOCATION"
            name="location"
          />
          <FormDropdown
            options={sources}
            label="FEEDBACK_SOURCE"
            placeholder="FEEDBACK_SOURCE"
            name="commentBoxSourceId"
          />
          <FormSuggestionPicker
            required
            label="AD_CRWO_TITLE_UNIT_LOCATION"
            placeholder="AD_CRWO_TITLE_UNIT_LOCATION"
            name="unit"
            disabled={!isAddNew}
            keyword={unit?.fullUnitCode}
            onChange={(selectedUnit) => {
              setValue('userName', selectedUnit.displayName);
              setValue('phoneNumber', selectedUnit.phoneNumber);
              setValue('emailAddress', selectedUnit.emailAddress);
            }}
          />
          <Box title="CONTACT_INFORMATION">
            <FormInput
              label="FEEDBACK_DISPLAY_NAME"
              placeholder="FEEDBACK_DISPLAY_NAME"
              name="userName"
              editable={false}
              mode="small"
            />
            <FormInput
              label="COMMON_EMAIL"
              placeholder="COMMON_EMAIL"
              editable={false}
              name="emailAddress"
              mode="small"
            />
            <FormInput
              label="COMMON_PHONE_NUMBER"
              placeholder="COMMON_PHONE_NUMBER"
              editable={false}
              name="phoneNumber"
              mode="small"
            />
          </Box>
          <FormInput
            maxLength={1000}
            showCharacterCount
            required
            label="COMMON_DESCRIPTION"
            placeholder=""
            name="description"
            multiline
          />
          <FormDocumentPicker name="images" label="COMMON_IMAGES" />
          {!isAddNew && fbDetail?.workOrderIds?.length > 0 && (
            <>
              {fbDetail.workOrderIds.map((item) => (
                <ButtonLink key={item.toString()} onPress={() => onPressJR(item)}>
                  <TextJR text={`${I18n.t('JR_LINK_FEEDBACK', undefined, item)}`} />
                </ButtonLink>
              ))}
            </>
          )}
        </AwareScrollView>
      </FormProvider>

      {!isAddNew && (
        <FloatingConversation
          title={fbDetail.id}
          moduleId={Modules.FEEDBACK}
          guid={fbDetail.guid}
          disable={false}
          disableTenant={false}
        />
      )}
    </BaseLayout>
  );
};

export default AddOrEditFeedback;
