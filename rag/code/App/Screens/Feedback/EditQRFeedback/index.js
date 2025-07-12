import React, { useEffect } from 'react';
import * as Yup from 'yup';
import { DeviceEventEmitter } from 'react-native';
import I18n from '@I18n';
import NavigationService from '@NavigationService';
import { FormProvider, useForm } from 'react-hook-form';
import styled from 'styled-components/native';

import BaseLayout from '../../../Components/Layout/BaseLayout';
import { FormDocumentPicker, FormDropdown, FormInput } from '../../../Components/Forms';
import AwareScrollView from '../../../Components/Layout/AwareScrollView';
import useFeedback from '../../../Context/Feedback/Hooks/useFeedback';
import Box from '../../../Elements/Box';
import FormSuggestionPicker, { SuggestionTypes } from '../../../Components/Forms/FormSuggestionPicker';
import { useYupValidationResolver } from '../../../Utils/hook';
import useFile from '../../../Context/File/Hooks/UseFile';
import { Button, Text } from '../../../Elements';

const TextJR = styled(Text)`
  color: blue;
`;

const ButtonLink = styled(Button)`
  margin-bottom: 12px;
`;

const EditQRFeedback = ({ navigation }) => {
  const {
    feedback: { statusList, qrFBDetail, divisionList, qrFeedbackSetting },
    isLoading,
    getFeedbackStatus,
    getFeedbackDivision,
    editQrFB,
    detailQRFeedback,
    getQrFeedbackSetting
  } = useFeedback();

  const {
    getFileReference,
    file: { fileUrls },
  } = useFile();

  const id = navigation.getParam('id');

  const submitRequest = editQrFB;
  const title = I18n.t('FEEDBACK_QR_EDIT');

  const requiredMessage = I18n.t('FORM_THIS_FIELD_IS_REQUIRED');

  const validationSchema = Yup.object().shape({
    statusId: Yup.number().required(requiredMessage),
  });

  useEffect(() => {
    detailQRFeedback(id);
    getFeedbackStatus();
    getFeedbackDivision();
    getQrFeedbackSetting();
  }, []);

  useEffect(() => {
    setValue('images', fileUrls);
  }, [fileUrls.length]);

  const onSubmit = async ({ statusId, divisionId }) => {
    const params = {
      id,
      statusId,
      divisionId
    };
    const result = await submitRequest(params);
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
    const { guid, commentBoxStatusId, commentBoxDivisionId, commentBoxLocation } = qrFBDetail;

    getFileReference(guid);

    return {
      statusId: commentBoxStatusId,
      divisionId: commentBoxDivisionId,
      commentBoxLocation,
      images: [],
    };
  };

  const formMethods = useForm({
    resolver: useYupValidationResolver(validationSchema),
    defaultValues: {
      statusId: undefined,
      divisionId: undefined,
      commentBoxLocation: {},
      images: [],
    },
  });

  const { setValue } = formMethods;

  useEffect(() => {
    if (qrFBDetail) {
      formMethods.reset(getInitialValuesForUpdate());
    }
  }, [qrFBDetail]);

  const baseLayoutProps = {
    title,
    showBell: false,
    containerStyle: { paddingHorizontal: 15 },
    loading: isLoading,
    bottomButtons: [
      {
        title: 'AD_COMMON_SAVE',
        type: 'primary',
        permission: 'Feedbacks.Update',
        onPress: () => {
          formMethods.handleSubmit(onSubmit)();
        },
      },
    ],
  };

  if (!qrFBDetail) {
    return <BaseLayout {...baseLayoutProps} displayPlaceholder />;
  }

  return (
    <BaseLayout {...baseLayoutProps}>
      <FormProvider {...formMethods}>
        <AwareScrollView>
          <Box title="CONTACT_INFORMATION">
            <FormInput
              label="FEEDBACK_DISPLAY_NAME"
              placeholder="FEEDBACK_DISPLAY_NAME"
              value={qrFBDetail.fullName}
              name="fullName"
              editable={false}
              mode="small"
            />
            <FormInput
              label="COMMON_EMAIL"
              placeholder="COMMON_EMAIL"
              editable={false}
              name="emailAddress"
              value={qrFBDetail.emailAddress}
              required={qrFBDetail?.isRequiredEmailAddress}
              mode="small"
            />
            <FormInput
              label="COMMON_PHONE_NUMBER"
              placeholder="COMMON_PHONE_NUMBER"
              editable={false}
              name="phoneNumber"
              value={qrFBDetail.phoneNumber}
              mode="small"
            />
          </Box>
          { 
            qrFeedbackSetting?.canViewDivision && 
            (
              <FormDropdown options={divisionList} label="DIVISION" placeholder="" name="divisionId" />
            )
          }
          <FormDropdown required options={statusList} label="COMMON_STATUS" placeholder="" name="statusId" />
          <FormDropdown
            required
            disabled
            defaultTitle={qrFBDetail.commentBoxType.name}
            label="COMMON_TYPE"
            placeholder="COMMON_TYPE"
            name="commentBoxTypeId"
          />
          <FormSuggestionPicker
            type={SuggestionTypes.LOCATION}
            disabled
            required
            label="COMMON_LOCATION"
            placeholder="COMMON_LOCATION"
            name="commentBoxLocation"
          />
          <FormInput
            editable={false}
            value={qrFBDetail.description}
            required
            label="COMMON_DESCRIPTION"
            placeholder=""
            name="description"
            multiline
          />
          <FormDocumentPicker disabled name="images" label="COMMON_IMAGES" />
          {qrFBDetail?.workOrderIds?.length > 0 && (
            <>
              {qrFBDetail.workOrderIds.map((item) => (
                <ButtonLink key={item.toString()} onPress={() => onPressJR(item)}>
                  <TextJR text={`${I18n.t('JR_LINK_FEEDBACK', undefined, item)}`} />
                </ButtonLink>
              ))}
            </>
          )}
        </AwareScrollView>
      </FormProvider>
    </BaseLayout>
  );
};

export default EditQRFeedback;
