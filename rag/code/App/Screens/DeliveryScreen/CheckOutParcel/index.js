/* @flow */
import _ from 'lodash';
import AwareScrollView from '@Components/Layout/AwareScrollView';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Alert } from 'react-native';
import { FormProvider, useForm } from 'react-hook-form';
import I18n from '../../../I18n';
import ParcelRemainModal from '../../../Components/Delivery/ParcelRemainModal';

import { Box, TextBox } from '../../../Elements';

import { ParcelStatus } from '../../../Config/Constants';
import useDelivery from '../../../Context/Delivery/Hooks/UseDelivery';
import BaseLayout from '../../../Components/Layout/BaseLayout';
import useUser from '../../../Context/User/Hooks/UseUser';
import FormSuggestionPicker, { SuggestionTypes } from '../../../Components/Forms/FormSuggestionPicker';
import { FormDate, FormInput } from '../../../Components/Forms';
import LocaleConfig from '../../../Config/LocaleConfig';
import { AppInput } from '../../../Components/Forms/FormInput';

const CheckOutDelivery = ({ navigation }) => {
  const {
    user: { user },
  } = useUser();

  const [signatureVisible, setSignatureVisible] = useState(false);
  const [screenMounted, setScreenMounted] = useState(false); // need this variables to ensure all states in hook form already init

  const {
    scanQRParcelReceipt,
    clearParcelReceipt,
    getParcelsInUnit,
    delivery: { parcelsInUnit, parcelReceipt },
  } = useDelivery();

  const detail = navigation.getParam('detailDelivery');
  const guid = navigation.getParam('guid');

  useEffect(() => {
    setScreenMounted(true);
    if (guid) {
      scanQRParcelReceipt(guid);
    }
    return () => {
      clearParcelReceipt();
    };
  }, []);

  useEffect(() => {
    if (detail && screenMounted) {
      initData(detail);
    }
  }, [screenMounted]);

  useEffect(() => {
    if (parcelReceipt) {
      initData(parcelReceipt);
    }
  }, [parcelReceipt]);

  const initData = (item) => {
    const unit = {
      id: item.unitId,
      fullUnitCode: item.fullUnitCode,
    };
    formMethods.reset({
      ...formMethods.getValues(),
      unit,
      parcel: item,
      member: item.residentUser,
      displayName: item.residentUser ? item.residentUser.displayName : '',
    });
  };

  const checkOutMultiParcel = (params) => {
    setSignatureVisible(false);
    navigateToSignature(params, parcel?.receiveSignedId);
  };

  const checkOut = async (values) => {
    const { parcel, member, note, toDate } = values;
    const {
      id,
      deliveryTypeId,
      fullUnitCode,
      unitId,
      deliveryText,
      deliveryUserId,
      trackingNumber,
      transportServiceId,
    } = parcel;

    const params = {
      id,
      deliveryTypeId,
      fullUnitCode,
      unitId,
      residentId: member?.emailAddress ? validateId(member.residentId || member.id) : null,
      statusId: ParcelStatus.RECEIVED,
      deliveryText,
      trackingNumber,
      transportServiceId: validateId(transportServiceId),
      deliveryUserId: validateId(deliveryUserId),
      deliveryReceivementInput: {
        deliveryId: id,
        residentUserId: member.userName ? validateId(member.residentId || member.id) : undefined,
        residentName: member.displayName,
        residentPhone: member?.phoneNumber,
        residentNote: note,
        receivedDate: moment(toDate).format(),
        residentEmail: member?.emailAddress,
      },
    };
    if (!params.deliveryReceivementInput.residentUserId) {
      params.deliveryReceivementInput.deliveryUserId = validateId(member.deliveryUserId || member.id);
    }
    formMethods.reset(values);
    const result = await getParcelsInUnit(unitId);

    if (result.length > 1) {
      Alert.alert(
        I18n.t(''),
        `${I18n.t('DELIVERY_BATCH_PICK_UP_MODAL_CONTENT1')} ${result.length - 1} ${I18n.t(
          'DELIVERY_BATCH_PICK_UP_MODAL_CONTENT2'
        )}`,
        [
          {
            text: I18n.t('AD_COMMON_CANCEL'),
          },
          {
            text: I18n.t('AD_COMMON_NO'),
            onPress: () => navigateToSignature(params, parcel.guid),
          },
          {
            text: I18n.t('AD_COMMON_YES'),
            onPress: () => setSignatureVisible(true),
          },
        ]
      );
    } else {
      navigateToSignature(params, parcel?.guid);
    }
  };

  const navigateToSignature = (params, id) => {
    navigation.navigate('signatureCheckOut', {
      params,
      guid: id,
      screenAmounts: detail ? 3 : 2,
    });
  };

  const validateId = (id) => (id === 0 ? undefined : id);

  const formMethods = useForm({
    defaultValues: {
      description: '',
      member: null,
      toDate: new Date(),
      loadingCreateDL: false,
      unit: null,
      parcel: null,
      displayName: '',
      note: '',
    },
  });

  const { formState, watch } = formMethods;
  const [parcel, member, unit] = watch(['parcel', 'member', 'unit']);

  const bottomButtons = [
    {
      title: 'AD_DL_RECIVED_UPDATE',
      type: 'primary',
      onPress: formMethods.handleSubmit(checkOut),
    },
  ];

  const mainLayoutProps = {
    title: I18n.t('DELIVERY_CHECK_OUT'),
    onLeftPress: () => navigation.goBack(),
    padding: true,
    bottomButtons,
  };

  if (!parcelReceipt && !detail) {
    return <BaseLayout {...mainLayoutProps} />;
  }

  return (
    <BaseLayout {...mainLayoutProps}>
      <FormProvider {...formMethods}>
        <AwareScrollView showsVerticalScrollIndicator={false} bounces={false}>
          <FormSuggestionPicker
            required
            label="AD_CRWO_TITLE_UNIT_LOCATION"
            placeholder="AD_CRWO_TITLE_UNIT_LOCATION"
            name="unit"
            disabled
          />
          <Box title="DELIVERY_PARCEL" required>
            <AppInput label="DELIVERY_DESCRIPTION" value={parcel?.deliveryText} mode="small" editable={false} />
            <AppInput label="DELIVERY_TYPE" value={_.get(parcel, 'deliveryType.name')} mode="small" editable={false} />
            <AppInput
              label="DELIVERY_DATE_CREATE"
              mode="small"
              editable={false}
              value={parcel?.creationTime ? moment(parcel?.creationTime).format(`${LocaleConfig.dateTimeFormat}`) : ''}
            />
          </Box>
          <Box title="DELIVERY_RECEIVER_INFORMATION">
            <FormSuggestionPicker
              required
              label="AD_CRWO_DISPLAYNAME"
              placeholder="AD_CRWO_DISPLAYNAME"
              mode="small"
              name="member"
              addOnParams={{ unitIds: unit?.id }}
              type={SuggestionTypes.DELIVERY_USERS}
            />
            <AppInput label="AD_CRWO_EMAIL" value={_.get(member, 'emailAddress')} mode="small" />
            <AppInput label="AD_CRWO_PHONE" value={_.get(member, 'phoneNumber')} mode="small" />
          </Box>
          <FormInput name="note" label="DELIVERY_RECEIVER_NOTE" multiline />
          <FormDate label="DELIVERY_DATE_TIME_RECEIVE" name="toDate" />
          <TextBox label="DELIVERY_CREATED_BY" text={user.displayName} />
          <ParcelRemainModal
            visible={signatureVisible}
            list={parcelsInUnit}
            values={formState}
            title="DELIVERY_BATCH_PICK_UP_MODAL_TITLE"
            onClosePress={() => setSignatureVisible(!signatureVisible)}
            onClose={() => setSignatureVisible(!signatureVisible)}
            onCheckOut={checkOutMultiParcel}
          />
        </AwareScrollView>
      </FormProvider>
    </BaseLayout>
  );
};

export default CheckOutDelivery;
