// BookingDetail.js
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Alert, DeviceEventEmitter } from 'react-native';
import { FormProvider } from 'react-hook-form';
import * as Yup from 'yup';
import moment from 'moment';
import BaseLayout from '@Components/Layout/BaseLayout';
import AwareScrollView from '@Components/Layout/AwareScrollView';
import {
  FormInput,
  FormDropdown,
  FormRadioGroup,
  FormDocumentPicker,
  FormLazyDropdown,
  FormDisabledProvider,
} from '@Forms';
import I18n from '@I18n';
import useBooking from '@Context/Booking/Hooks/useBooking';
import { useRoute } from '@react-navigation/native';
import { Text, Box, Card } from '@Elements';
import { useCompatibleForm, useYupValidationResolver } from '@Utils/hook';
import { formatDate } from '@Utils/transformData';
import LocaleConfig from '@Config/LocaleConfig';
import Row from '@Components/Grid/Row';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { Colors } from '@Themes';
import FormSuggestionPicker, { SuggestionTypes } from '@Components/Forms/FormSuggestionPicker';
import useApp from '@Context/App/Hooks/UseApp';
import BookingRecurring from '@Components/Booking/BookingRecurring';
import BookingConfirmation from '@Components/Booking/BookingRecurring/BookingConfirmation';
import FloatingConversation from '@Components/modalChat/FloatingConversation';
import { bookingPaymentStatusCode, bookingStatusCode, Modules, bookingTargets } from '@Config/Constants';
import useUser from '@Context/User/Hooks/UseUser';
import FormMoneyInput from '@Components/Forms/FormMoneyInput';
import FormCalendarPicker from '@Components/Forms/FormCalendarPicker/CalendarPicker';
import useFile from '@Context/File/Hooks/UseFile';
import _ from 'lodash';
import styled from 'styled-components/native';
import SelectAmenityModal from '@Components/Booking/SelectAmenityModal';
import FormSlotView from '@Components/Booking/SlotView';
import AmenityButton from '@Components/Booking/AmenityButton';
import LoaderContainer from '@Components/Layout/LoaderContainer';
import BookingLoading from '@Components/Lists/Loaders/BookingLoading';
import BookingPolicyRules from './BookingPolicyRules';
import useBookingRecurrence from '../../../Components/Booking/BookingRecurring/useBookingRecurrence';

const Container = styled(Card)`
  margin-horizontal: 20px;
`;

const TimeWrapper = styled.View`
  margin-bottom: 10px;
`;

const InfoRow = ({ icon, text }) => (
  <Row center>
    <Ionicon style={{ marginRight: 5 }} color={Colors.azure} name={icon} size={20} />
    <Text color={Colors.azure} text={text} />
  </Row>
);
// Initial form values for a new booking. (Additional fields that come from Angular code are added as needed)
const initialValues = {
  amenityId: null,
  startEndDate: new Date(),
  endDate: undefined,
  status: {
    statusCode: bookingStatusCode.REQUESTED,
  },
  paymentStatus: {
    paymentStatusCode: bookingPaymentStatusCode.NOT_YET_DEPOSIT,
  },
  purposeId: null,
  numberOfPerson: '',
  remark: '',
  bookingType: [bookingTargets.occupier],
  company: null,
  files: [],
  email: '',
  depositPrice: {
    raw: 0,
    text: '',
  },
  slots: [],
};

const weekday = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

const AddOrEditBooking = ({ navigation }) => {
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [bookingRequestData, setBookingRequestData] = useState(null);
  const {
    booking: {
      bookingDetail,
      statusList,
      paymentStatusList,
      bookingPurposes,
      amenityDetail,
      bookingSlots,
      amenityList,
    },
    getBookingDetail,
    addBooking,
    updateBooking,
    getAmenityDetail, // returns promise with amenity detail
    validateRecurringBooking,
    // resetBookingDetail,
    getBookingStatus,
    getPaymentStatus,
    getBookingPurpose,
    getAmenities,
    getAllTimeSlots,
  } = useBooking();

  const {
    getSimpleCompanies,
    app: { simpleCompanies, languageId },
  } = useApp();

  const {
    user: { securitySetting },
  } = useUser();

  const {
    getFileByReferenceId,
    getByReferenceIdAndModuleNames,
    file: { referenceFiles, bookingRuleFiles },
  } = useFile();

  const { generateTimeSlots } = useBookingRecurrence();

  const { name, params } = useRoute();
  const isAddNew = name === 'addBooking';
  const isEdit = name === 'editBooking';
  const id = params?.id;
  const requiredMessage = I18n.t('FORM_THIS_FIELD_IS_REQUIRED');

  const validationSchema = useMemo(() => {
    const baseSchema = {
      bookingType: Yup.array()
        .of(Yup.number().oneOf([bookingTargets.occupier, bookingTargets.company, bookingTargets.outsider]))
        .required(requiredMessage),
      unit: Yup.object()
        .nullable()
        .when('bookingType', {
          is: (val) => val[0] === bookingTargets.occupier,
          then: Yup.object().required(requiredMessage),
          otherwise: Yup.object().nullable(),
        }),
      company: Yup.object()
        .nullable()
        .when('bookingType', {
          is: (val) => val[0] === bookingTargets.company,
          then: Yup.object().required(requiredMessage),
          otherwise: Yup.object().nullable(),
        }),
      email: Yup.string()
        .nullable()
        .when('bookingType', {
          is: (val) => val[0] === bookingTargets.outsider,
          then: Yup.string().required(requiredMessage).email(I18n.t('EMAIL_IS_INVALID')),
          otherwise: Yup.string().nullable(),
        }),
    };

    // If isAddNew is true, add slots validation
    if (isAddNew) {
      baseSchema.slots = Yup.array()
        .required(requiredMessage)
        .test(
          'at-least-one-selected',
          requiredMessage,
          (value) => value && value.some((slot) => slot.isCheck === true)
        );
    }

    return Yup.object().shape(baseSchema);
  }, [isAddNew]);

  const formMethods = useCompatibleForm({
    defaultValues: initialValues,
    resolver: useYupValidationResolver(validationSchema),
  });

  const { setValue, watch, handleSubmit, reset } = formMethods;
  const startEndDate = watch('startEndDate');

  // Watch fields
  const bookingType = watch('bookingType')[0];
  const depositPrice = watch('depositPrice');
  const slots = watch('slots') || [];
  const status = watch('status');
  const unit = watch('unit');
  const recurrence = watch('recurrence');

  const startDate = isAddNew ? startEndDate : bookingDetail?.startDate;
  const endDate = isAddNew ? startEndDate : bookingDetail?.endDate;

  const [isDisabledForm, setIsDisabledForm] = useState(false);
  const [visibleSelectAmenity, setVisibleSelectAmenity] = useState(false);

  useEffect(() => {
    if (!isAddNew && id) {
      getBookingDetail(id);
    }
  }, [id]);

  useEffect(() => {
    if (!isAddNew) {
      setValue('files', referenceFiles);
    }
  }, [_.size(referenceFiles)]);

  useEffect(() => {
    setValue('bookingRuleFiles', bookingRuleFiles);
  }, [bookingRuleFiles, amenityDetail]);

  useEffect(() => {
    getBookingStatus();
    getPaymentStatus();
    getSimpleCompanies({
      page: 1,
    });
    getBookingPurpose();
    if (_.size(amenityList) === 0) {
      getAmenities();
    }
  }, []);

  useEffect(() => {
    if (isAddNew && bookingSlots) {
      formMethods.setValue('slots', bookingSlots);
    }
  }, [bookingSlots]);

  const getInitialValuesForUpdate = () => {
    if (isAddNew || !bookingDetail) {
      return {};
    }

    let values = {
      ...bookingDetail,
      amenityId: bookingDetail.amenityId,
      startDate: bookingDetail.startDate,
      endDate: bookingDetail.endDate,
      status: bookingDetail.status,
      paymentStatus: bookingDetail.paymentStatus,
      purposeId: bookingDetail.purposeId,
      numberOfPerson: bookingDetail.numberOfPerson,
      remark: bookingDetail.remark,
      bookingType: [bookingDetail.bookingType],
      files: bookingDetail.files || [],
      depositPrice: {
        rawValue: bookingDetail.totalDeposit,
        text: LocaleConfig.formatMoney(bookingDetail.totalDeposit),
      },
    };

    // company-specific
    if (bookingDetail.bookingType === bookingTargets.company) {
      values = {
        ...values,
        company: {
          companyName: bookingDetail.name,
          id: bookingDetail.companyId,
        },
      };
    }

    // occupier-specific
    if (bookingDetail.bookingType === bookingTargets.occupier) {
      values = {
        ...values,
        unit: {
          fullUnitCode: bookingDetail.fullUnitId,
        },
        contactName: bookingDetail.userName,
        contactEmail: bookingDetail.email,
        contactPhone: bookingDetail.phone,
      };
    }

    // outsider-specific
    if (bookingDetail.bookingType === bookingTargets.outsider) {
      values = {
        ...values,
        email: bookingDetail.email,
      };
    }

    return values;
  };

  useEffect(() => {
    if (!isAddNew && bookingDetail) {
      getAmenityDetail(bookingDetail.amenity?.amenityId);
      getFileByReferenceId(bookingDetail.guid);
      reset(getInitialValuesForUpdate());
      const statusCode = bookingDetail?.status?.statusCode;
      if (statusCode === bookingStatusCode.CANCELED || statusCode === bookingStatusCode.DECLINED) {
        setIsDisabledForm(true);
      }
    }
  }, [bookingDetail, isAddNew]);

  useEffect(() => {
    if (isAddNew && amenityDetail) {
      getByReferenceIdAndModuleNames(amenityDetail?.guid, '', 'bookingRuleFiles');
      if (amenityDetail.isUseDeposited) {
        setValue('paymentStatus', {
          paymentStatusCode: 'NotYetDeposit',
        });
      }
    }
  }, [amenityDetail]);

  useEffect(() => {
    getBookingTimeSlots();
  }, [startDate, endDate, amenityDetail]);

  const getBookingTimeSlots = () => {
    // const currentDate = moment().format('YYYY/MM/DD');
    if (!amenityDetail) {
      return;
    }
    const fromToDate = moment(startDate).format('YYYY/MM/DD');

    getAllTimeSlots({
      amenityId: amenityDetail.amenityId,
      fromDate: fromToDate,
      toDate: fromToDate,
    });
  };

  // Calculate deposit price based on amenity time rules.
  const calculateDepositPrice = useCallback(() => {
    if (!amenityDetail) return;

    // Gather checked slots
    const checkedSlots = slots.filter((item) => item.isCheck);
    if (checkedSlots.length === 0) return;

    // Determine start and end times
    const startDateSlot = checkedSlots[0].startTime;
    const endDateSlot = checkedSlots[checkedSlots.length - 1].endTime;

    // Format day and times
    const dayName = weekday[moment(startDateSlot).day()];
    const startTimeSLot = moment(startDateSlot).format('HH:mm:ss');
    const endTimeSlot = moment(endDateSlot).format('HH:mm:ss');

    // Find the amenity’s time-rule that matches the selected slot’s day and time
    const matchingRule = amenityDetail.amenityTimeRules?.find(
      ({ numNextValidDate, startTime, endTime }) =>
        numNextValidDate === dayName && startTime === startTimeSLot && endTime === endTimeSlot
    );

    // If a rule is found, update depositPrice once
    if (matchingRule) {
      const { price } = matchingRule;
      setValue('depositPrice', {
        rawValue: price,
        text: LocaleConfig.formatMoney(price),
      });
    }
  }, [slots]);

  useEffect(() => {
    calculateDepositPrice();
  }, [calculateDepositPrice]);

  // Handle recurring booking flow.
  const recurringBooking = async (values, bookingParams) => {
    const rec = values.recurrence;
    const bookingObj = {
      ...bookingParams,
      amenityId: amenityDetail.amenityId,
    };
    delete bookingObj.startDate;
    delete bookingObj.endDate;
    const bookingTimes = rec.bookingTimes;
    if (!bookingTimes.length) {
      Alert.alert(I18n.t('NO_RECURRING_SLOT_AVAILABLE'));
      return;
    }
    bookingObj.bookingTimes = bookingTimes.map((slot) => ({
      startDate: slot.startDate,
      endDate: slot.endDate,
    }));
    try {
      const res = await validateRecurringBooking(bookingObj);
      const matchedStatus = statusList.find((item) => item.statusCode === res.status);

      setBookingRequestData({
        ...res,
        amenityName: amenityDetail.amenityName,
        requestedBy: bookingParams.name || bookingParams.email,
        createdDate: new Date(),
        status: matchedStatus.name,
        validSlots: bookingObj.bookingTimes,
        invalidSlots: res.invalidSlots || [],
      });
      setConfirmationVisible(true);
    } catch (error) {
      Alert.alert(I18n.t('ERROR'), error.message);
    }
  };

  const handleConfirm = () => {
    // after user confirms, actually call addBooking/updateBooking
    onSave(formMethods.getValues());
    setConfirmationVisible(false);
  };

  const onSave = async (formValues) => {
    const uploadFiles = formValues?.files.filter((item) => item.path);
    let slotStartTime;
    let slotEndTime;
    if (isAddNew) {
      const selectedSlots = formValues.slots.filter((e) => e.isCheck === true);
      if (selectedSlots.length > 0) {
        slotStartTime = selectedSlots[0].startTime;
        slotEndTime = selectedSlots[selectedSlots.length - 1].endTime;
      }
    }

    const payload = {
      ...formValues,
      amenityId: amenityDetail.amenityId,
      startDate: isAddNew ? slotStartTime : bookingDetail.startDate,
      endDate: isAddNew ? slotEndTime : bookingDetail.endDate,
      status: formValues.status?.statusCode,
      bookingType,
      paymentStatus: null,
      files: uploadFiles,
    };

    if (amenityDetail.isUseDeposited) {
      payload.paymentStatus = formValues.paymentStatus?.paymentStatusCode;
    }

    // 3) Occupier fields
    if (bookingType === bookingTargets.occupier && formValues.unit) {
      payload.buildingId = formValues.unit.buildingId;
      payload.unitId = formValues.unit.unitId;
      payload.fullUnitId = formValues.unit.fullUnitCode;
      payload.userId = formValues.contactId;
      payload.name = formValues.contactName;
      payload.userName = formValues.contactName;
      payload.phone = formValues.contactPhone;
      payload.email = formValues.contactEmail;
      payload.emailAddress = formValues.contactEmail;
    }

    // 4) Company fields
    if (bookingType === bookingTargets.company && formValues.company) {
      payload.companyId = formValues.company?.id;
      payload.name = formValues.company.companyName;
      payload.email = formValues.company.primaryEmail;
    }

    // 5) Outsider
    if (bookingType === bookingTargets.outsider) {
      payload.email = formValues.email;
    }

    // Recurrence handling
    if (formValues.recurrence) {
      await recurringBooking(formValues, payload);
      return;
    }

    const res = !isAddNew ? await updateBooking(payload) : await addBooking(payload);
    if (res) {
      DeviceEventEmitter.emit('UpdateListBooking');
      navigation.goBack();
    }
  };

  const getTitle = () => {
    if (isAddNew) return I18n.t('ADD_BOOKING');
    return I18n.t('EDIT_BOOKING');
  };

  const onAmenitySelect = (selectedAmenity) => {
    setValue('amenityId', selectedAmenity.amenityId);
    getAmenityDetail(selectedAmenity.amenityId);
    onCloseSelectAmenity();
  };

  const onShowSelectAmenity = () => {
    setVisibleSelectAmenity(true);
  };

  const onCloseSelectAmenity = () => {
    setVisibleSelectAmenity(false);
  };

  const amenityRemark =
    (_.size(amenityDetail?.remarks) &&
      amenityDetail.remarks?.find((item) => item.languageName === languageId)?.value) ||
    '';

  const displayStatus = useMemo(() => {
    if (!statusList) return [];
    return statusList.filter((item) =>
      !isAddNew ? true : item?.statusCode !== 'CANCELED' && item?.statusCode !== 'DECLINED'
    );
  }, [statusList, isAddNew]);

  return (
    <BaseLayout
      title={getTitle()}
      bottomButtons={[
        {
          title: I18n.t('COMMON_SAVE'),
          type: 'primary',
          onPress: handleSubmit(onSave),
          disabled: isDisabledForm,
        },
      ]}
      containerStyle={{
        backgroundColor: 'white',
      }}
    >
      <LoaderContainer isLoading={!amenityDetail} loadingComponent={<BookingLoading />}>
        <AwareScrollView>
          <FormDisabledProvider disabled={isDisabledForm}>
            <FormProvider {...formMethods}>
              {isAddNew && <FormCalendarPicker name="startEndDate" />}
              <Container>
                <AmenityButton amenity={amenityDetail} onPress={onShowSelectAmenity} disabled={!isAddNew} />
                {isAddNew && (
                  <FormSlotView
                    label="BK_NEW_TIME"
                    name="slots"
                    required
                    numberSlot={_.get(amenityDetail, 'numOfExtendTimeSlot', 0) + 1}
                    onChange={(values) => {
                      if (recurrence) {
                        const bookingTimes = {
                          startTime: values.filter((s) => s.isCheck)[0]?.startTime,
                          endTime: values.filter((s) => s.isCheck).slice(-1)[0]?.endTime,
                        };

                        const timeSlots = generateTimeSlots(recurrence, bookingTimes);
                        setValue('recurrence', {
                          ...recurrence,
                          bookingTimes: timeSlots,
                        });
                      }
                    }}
                  />
                )}

                {!isAddNew && (
                  <TimeWrapper>
                    <InfoRow
                      icon="time"
                      text={`${formatDate(startDate, LocaleConfig.timeFormat)} - ${formatDate(
                        endDate,
                        LocaleConfig.timeFormat
                      )}`}
                    />
                    <InfoRow icon="calendar" text={formatDate(startDate, LocaleConfig.dateFormat)} />
                  </TimeWrapper>
                )}

                <FormDropdown
                  required
                  options={displayStatus}
                  label="COMMON_STATUS"
                  name="status"
                  mode="small"
                  valKey="statusCode"
                  showValue={false}
                />
                {amenityDetail?.isUseDeposited &&
                  // “add new” & status has moved off REQUESTED
                  ((isAddNew && status?.statusCode !== bookingStatusCode.REQUESTED) ||
                    // “edit” & there is already a paymentStatus on the bookingDetail
                    (!isAddNew && !!bookingDetail?.paymentStatus)) && (
                    <FormDropdown
                      label="PAYMENT_STATUS"
                      options={paymentStatusList}
                      name="paymentStatus"
                      mode="small"
                      valKey="paymentStatusCode"
                      showValue={false}
                      required
                    />
                  )}

                <FormRadioGroup
                  testID="bookingType"
                  label="BOOKING_TYPE"
                  name="bookingType"
                  options={[
                    { label: 'OCCUPIER', value: bookingTargets.occupier },
                    { label: 'COMPANY', value: bookingTargets.company },
                    { label: 'OUTSIDER', value: bookingTargets.outsider },
                  ]}
                  disabled={!isAddNew}
                  mode="small"
                />

                {bookingType === bookingTargets.occupier && (
                  <>
                    <FormSuggestionPicker
                      type={SuggestionTypes.UNIT}
                      name="unit"
                      keyword={unit?.fullUnitCode}
                      onChange={(selectedUnit) => {
                        setValue('contactId', selectedUnit.userId);
                        setValue('contactName', selectedUnit.displayName);
                        setValue('contactPhone', selectedUnit.phoneNumber);
                        setValue('contactEmail', selectedUnit.emailAddress);
                      }}
                      disabled={!isAddNew}
                      mode="small"
                      label="OCCUPIER"
                      required
                    />

                    <Box title="AD_CRWO_TITLE_INFO" small border>
                      <FormInput
                        label="AD_CRWO_DISPLAYNAME"
                        placeholder="AD_CRWO_DISPLAYNAME"
                        name="contactName"
                        mode="small"
                        editable={false}
                      />

                      {securitySetting?.isShowEmailAndPhone && (
                        <>
                          <FormInput
                            editable={false}
                            label="AD_CRWO_EMAIL"
                            placeholder="AD_CRWO_EMAIL"
                            name="contactEmail"
                            mode="small"
                          />
                          <FormInput
                            editable={false}
                            label="AD_CRWO_PHONE"
                            placeholder="AD_CRWO_PHONE"
                            name="contactPhone"
                            mode="small"
                          />
                        </>
                      )}
                    </Box>
                  </>
                )}
                {bookingType === bookingTargets.company && (
                  <FormLazyDropdown
                    listExist={simpleCompanies.data}
                    mode="small"
                    showSearchBar
                    getList={(page, keyword) =>
                      getSimpleCompanies({
                        page,
                        keyword,
                      })
                    }
                    options={simpleCompanies}
                    fieldName="companyName"
                    titleKey="companyName"
                    name="company"
                    label="COMPANY"
                    disabled={!isAddNew}
                    required
                  />
                )}
                {bookingType === bookingTargets.outsider && (
                  <FormInput
                    testID="outsiderEmail"
                    name="email"
                    keyboardType="email-address"
                    placeholder="COMMON_EMAIL"
                    editable={isAddNew}
                    mode="small"
                    label="COMMON_EMAIL"
                    required
                  />
                )}

                <FormDropdown
                  testID="bookingPurpose"
                  label="BK_PURPOSE"
                  name="purposeId"
                  options={bookingPurposes}
                  mode="small"
                />

                {amenityDetail?.isAllowRecurring && !isEdit && (
                  <BookingRecurring
                    onSubmitForm={(rec) => {
                      setValue('recurrence', rec);
                    }}
                    onRemove={() => {
                      setValue('recurrence', null);
                    }}
                    reservation={{
                      startTime: slots.filter((s) => s.isCheck)[0]?.startTime,
                      endTime: slots.filter((s) => s.isCheck).slice(-1)[0]?.endTime,
                    }}
                  />
                )}

                <FormInput
                  testID="numberOfPerson"
                  label="BK_NEW_LIMIT_USER"
                  name="numberOfPerson"
                  keyboardType="number-pad"
                  mode="small"
                />

                {depositPrice?.rawValue > 0 && (
                  <FormMoneyInput
                    disabled
                    mode="small"
                    label="DEPOSIT_PRICE"
                    placeholder="DEPOSIT_PRICE"
                    name="depositPrice"
                  />
                )}
                {amenityRemark && (
                  <FormInput
                    label="REMARK"
                    value={amenityRemark}
                    editable={false}
                    mode="small"
                    name="amenityRemarks"
                    multiline
                  />
                )}

                <FormInput testID="remark" label="COMMON_DESCRIPTION" name="remark" multiline mode="small" />
              </Container>
              <Container>
                <FormDocumentPicker mode="small" testID="files" label="COMMON_DOCUMENT" name="files" />
              </Container>

              {amenityDetail && (
                <Container>
                  <BookingPolicyRules amenityDetail={amenityDetail} bookingRuleFiles={bookingRuleFiles} />
                </Container>
              )}
            </FormProvider>
          </FormDisabledProvider>
        </AwareScrollView>
      </LoaderContainer>
      <SelectAmenityModal
        visible={visibleSelectAmenity}
        onClose={onCloseSelectAmenity}
        onSelect={onAmenitySelect}
        data={amenityList}
      />
      {!isAddNew && amenityDetail && (
        <FloatingConversation title={bookingDetail?.id} moduleId={Modules.BOOKING} guid={bookingDetail?.guid} />
      )}
      <BookingConfirmation
        bookingRequestData={bookingRequestData}
        onConfirm={handleConfirm}
        visible={confirmationVisible}
        onClosePress={() => setConfirmationVisible(false)}
      />
    </BaseLayout>
  );
};

export default AddOrEditBooking;
