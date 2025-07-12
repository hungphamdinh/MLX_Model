import React, { useEffect, useRef } from 'react';
import * as Yup from 'yup';
import { DeviceEventEmitter, TouchableOpacity } from 'react-native';
import I18n from '@I18n';
import NavigationService from '@NavigationService';
import { Box, IconButton } from '@Elements';
import { FormProvider } from 'react-hook-form';
import styled from 'styled-components/native';
import _ from 'lodash';
import BaseLayout from '../../../Components/Layout/BaseLayout';
import { FormDate, FormDocumentPicker, FormDropdown, FormInput } from '../../../Components/Forms';
import AwareScrollView from '../../../Components/Layout/AwareScrollView';
import useDelivery from '../../../Context/Delivery/Hooks/UseDelivery';
import { RequestApi } from '../../../Services';
import Signature from '../../../Elements/Signature';
import FormSuggestionPicker, { SuggestionTypes } from '../../../Components/Forms/FormSuggestionPicker';
import { modal } from '../../../Utils';
import { parseDate } from '../../../Utils/transformData';
import { isGranted } from '../../../Config/PermissionConfig';
import { useCompatibleForm, useYupValidationResolver } from '../../../Utils/hook';
import { ParcelStatus } from '../../../Config/Constants';
import useFile from '../../../Context/File/Hooks/UseFile';

const ContactInput = styled(FormInput).attrs(() => ({
  editable: false,
  mode: 'small',
}))``;

const AddOrEditDelivery = ({ navigation }) => {
  const isCheckOutRef = useRef(false);

  const {
    delivery: { deliveryDetail, types, listStatus },
    isLoading,
    addDelivery,
    updateDelivery,
  } = useDelivery();

  const {
    getFileByReferenceId,
    file: { referenceFiles },
  } = useFile();

  const isAddNew = _.get(navigation, 'state.routeName') === 'addDelivery';
  let isReceived = false;
  if (!isAddNew && deliveryDetail) {
    isReceived = deliveryDetail.status.id === ParcelStatus.RECEIVED;
  }

  const submitRequest = isAddNew ? addDelivery : updateDelivery;
  const title = isAddNew ? I18n.t('DL_ADD') : I18n.t('DL_EDIT');

  const requiredMessage = I18n.t('FORM_THIS_FIELD_IS_REQUIRED');
  const validationSchema = Yup.object().shape({
    deliveryTypeId: Yup.number().required(requiredMessage),
    statusId: Yup.number().required(requiredMessage),
    deliveryText: Yup.string().required(requiredMessage),
    contactName: Yup.string().required(requiredMessage),
    unit: Yup.object().nullable().required(requiredMessage),
  });

  const onReceiveCode = (result) => {
    if (result) {
      setFieldValue('trackingNumber', result);
      return;
    }
    modal.showError(I18n.t('QRCODE_INCORRECT_CONTENT'));
  };

  const onScanQRPress = () => {
    NavigationService.navigate('scanQRCode', { callback: onReceiveCode });
  };

  const onSubmit = async ({ unit, residentUser, images, transportService, ...values }) => {
    const params = {
      ...values,
      fullUnitCode: unit.fullUnitCode,
      unitId: unit.unitId,
      residentId: residentUser.residentId,
      transportServiceId: _.get(transportService, 'id'),
      deliveryUserName: residentUser.displayName,
      residentUser,
    };
    if (isCheckOutRef.current) {
      NavigationService.navigate('checkOutDelivery', {
        detailDelivery: deliveryDetail,
        params,
      });
      return;
    }
    const result = await submitRequest(params);
    if (result) {
      const guid = isAddNew ? result.guid : deliveryDetail.guid;
      const uploadImages = images.filter((item) => item.path);
      if (uploadImages.length > 0) {
        await RequestApi.requestUploadFileDelivery(guid, uploadImages);
      }
      NavigationService.goBack();
      DeviceEventEmitter.emit('UpdateListDelivery', 1);
    }
  };

  const getInitialValuesForUpdate = () => {
    if (isAddNew || !deliveryDetail) {
      return {};
    }

    const {
      fullUnitCode,
      fileUrls,
      deliveryReceivement,
      residentUser = {},
      unitId,
      residentId,
      creationTime,
      ...restDetail
    } = deliveryDetail;

    getFileByReferenceId(deliveryDetail.guid);
    return {
      ...restDetail,
      residentUser: {
        ...residentUser,
        userId: residentId,
      },
      unit: {
        fullUnitCode,
        unitId,
      },
      contactName: residentUser.displayName,
      contactPhone: residentUser.phoneNumber,
      contactEmail: residentUser.emailAddress,
      receiver: _.first(deliveryReceivement),
      creationTime: parseDate(creationTime),
      images: [],
    };
  };

  const bottomButtons = [
    {
      title: 'AD_COMMON_SAVE',
      type: 'primary',
      permission: !isAddNew && 'Deliveries.Update',
      onPress: () => {
        isCheckOutRef.current = false;
        formMethods.handleSubmit(onSubmit)();
      },
    },
  ];

  if (isGranted('Deliveries.Update') && !isAddNew && _.get(deliveryDetail, 'status.id') !== 3) {
    bottomButtons.push({
      title: 'AD_WOD_TITLE_BTN_SAVE_RECEIVED',
      type: 'info',
      onPress: () => {
        isCheckOutRef.current = true;
        formMethods.handleSubmit(onSubmit)();
      },
    });
  }

  const formMethods = useCompatibleForm({
    resolver: useYupValidationResolver(validationSchema),
    defaultValues: {
      id: undefined,
      deliveryTypeId: undefined,
      fullUnitCode: undefined,
      unitId: undefined,
      residentId: undefined,
      deliveryText: undefined,
      statusId: undefined,
      trackingNumber: undefined,
      transportService: undefined,
      unit: null,
      images: [],
    },
  });

  const { values, setFieldValue } = formMethods;

  useEffect(() => {
    if (deliveryDetail) {
      formMethods.reset(getInitialValuesForUpdate());
    }
  }, [deliveryDetail]);

  useEffect(() => {
    setFieldValue('images', referenceFiles);
  }, [_.size(referenceFiles)]);

  const baseLayoutProps = {
    title,
    showBell: false,
    containerStyle: { paddingHorizontal: 15 },
    loading: isLoading,
    bottomButtons,
  };

  if (!deliveryDetail && !isAddNew) {
    return <BaseLayout {...baseLayoutProps} displayPlaceholder />;
  }

  const signature = !isAddNew && _.get(deliveryDetail, 'signature');

  let status = [];
  const statusWithOutReceived = listStatus.filter((item) => item.id !== ParcelStatus.RECEIVED);

  if (isAddNew) {
    status = statusWithOutReceived;
  } else if (!isReceived) {
    status = statusWithOutReceived;
  } else {
    status = listStatus;
  }

  const unit = formMethods.watch('unit');

  return (
    <BaseLayout {...baseLayoutProps}>
      <FormProvider {...formMethods}>
        <AwareScrollView>
          <FormDropdown
            disabled={isReceived}
            required
            options={types}
            label="AD_DL_TITLE_TYPE"
            placeholder=""
            name="deliveryTypeId"
          />
          <FormDropdown
            disabled={isReceived}
            required
            options={status}
            label="COMMON_STATUS"
            placeholder=""
            name="statusId"
          />
          <FormInput
            required
            label="AD_DL_TITLE_DESCRIPTION"
            placeholder="AD_DL_PLACEHOLDER_DESCRIPTION"
            name="deliveryText"
            multiline
            editable={!isReceived}
          />
          <Box title="AD_CRWO_TITLE_INFO" required>
            <FormSuggestionPicker
              required
              disabled={isReceived || !isAddNew}
              label="AD_CRWO_TITLE_UNIT_LOCATION"
              placeholder="AD_CRWO_TITLE_UNIT_LOCATION"
              name="unit"
              mode="small"
              type={SuggestionTypes.LIST_UNIT_V2}
            />
            <FormSuggestionPicker
              required
              disabled={isReceived || !unit || !isAddNew}
              label="DELIVERY_USERS"
              placeholder="DELIVERY_USERS"
              name="residentUser"
              mode="small"
              addOnParams={{ unitIds: unit?.unitId }}
              onChange={(user) => {
                setFieldValue('contactName', user.displayName);
                setFieldValue('contactPhone', user.phoneNumber);
                setFieldValue('contactEmail', user.emailAddress);
              }}
              type={SuggestionTypes.DELIVERY_USERS}
              showAddButton
            />
            <ContactInput label="AD_CRWO_EMAIL" placeholder="AD_CRWO_EMAIL" name="contactEmail" />
            <ContactInput label="AD_CRWO_PHONE" placeholder="AD_CRWO_PHONE" name="contactPhone" />
          </Box>
          <FormSuggestionPicker
            disabled={isReceived}
            type={SuggestionTypes.TRANSPORT_SERVICE}
            label="DELIVERY_TRANSPORT_SERVICE"
            title="DELIVERY_TRANSPORT_SERVICE"
            placeholder="DELIVERY_TRANSPORT_SERVICE"
            name="transportService"
          />

          <FormInput
            label="DELIVERY_TRACKING_NUMBER"
            placeholder="DELIVERY_TRACKING_NUMBER"
            editable={!isReceived}
            name="trackingNumber"
            rightIcon={<IconButton name="barcode-outline" onPress={onScanQRPress} />}
          />

          <FormDocumentPicker disabled={isReceived} name="images" label="COMMON_IMAGES" />

          {values.receiver && (
            <Box title="AD_CRWO_TITLE_INFO" required>
              <ContactInput
                label="AD_CRWO_DISPLAYNAME"
                editable={!isReceived}
                placeholder="AD_CRWO_DISPLAYNAME"
                value={values.receiver?.residentName}
              />
              <ContactInput
                editable={!isReceived}
                label="AD_CRWO_EMAIL"
                placeholder="AD_CRWO_EMAIL"
                value={values.receiver?.residentEmail}
              />
              <ContactInput
                editable={!isReceived}
                label="AD_CRWO_PHONE"
                placeholder="AD_CRWO_PHONE"
                value={values.receiver?.residentPhone}
              />
              <ContactInput
                editable={!isReceived}
                label="DELIVERY_RECEIVER_NOTE"
                placeholder="DELIVERY_RECEIVER_NOTE"
                multiline
                containerStyle={{ height: undefined }}
                value={values.receiver?.receiveNote}
              />
            </Box>
          )}

          {signature && (
            <Box title="AD_DELIVERY_SIGNATURE_TITLE">
              <TouchableOpacity disabled>
                <Signature values={signature} />
              </TouchableOpacity>
            </Box>
          )}
          {!isAddNew && (
            <FormDate label="AD_DL_DETAIL_CREATE_DAY" name="creationTime" mode="datetime" required disabled />
          )}
        </AwareScrollView>
      </FormProvider>
    </BaseLayout>
  );
};

export default AddOrEditDelivery;
