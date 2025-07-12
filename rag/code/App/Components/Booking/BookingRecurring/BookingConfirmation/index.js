import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import I18n from '@I18n';
import { Text, Button } from '@Elements';
import Row from '@Components/Grid/Row';
import { Alert, DeviceEventEmitter } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useBooking from '@Context/Booking/Hooks/useBooking';
import NavigationService from '@NavigationService';
import { cloneDeep, map, filter, size } from 'lodash';
import moment from 'moment';
import { formatDate } from '@Utils/transformData';
import LocaleConfig from '@Config/LocaleConfig';
import { withModal } from '../../../../HOC';

// Reusable label-value display
const LabelValue = ({ labelKey, value }) => (
  <Text>
    <Text preset="bold" text={`${I18n.t(labelKey)}: `} />
    <Text text={value} />
  </Text>
);

const getTimeZone = (dateTime) => {
  if (!dateTime) {
    return '+07:00';
  } else if (typeof dateTime === 'string') {
    return dateTime.slice(19, 25);
  }
  return '+07:00';
};

const Container = styled.View`
  padding: 10px;
`;

const SlotList = styled.FlatList`
  max-height: 200px;
  margin-vertical: 12px;
  border-width: 1px;
  border-color: #ccc;
  border-radius: 8px;
  padding: 8px;
`;

const SlotRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-vertical: 4px;
`;

const RemoveBtn = styled.TouchableOpacity`
  padding: 4px;
`;

const ButtonsRow = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 16px;
`;

const BookingRecurringConfirmation = ({ onClosePress, bookingRequestData = {} }) => {
  const [localData, setLocalData] = useState({
    validSlots: [],
    invalidSlots: [],
    requestedBy: '',
    amenityName: '',
    createdDate: '',
    status: '',
  });

  const { recurringBooking } = useBooking();
  const getTimeRange = (slot) => {
    const tz = getTimeZone(slot.startDate);
    const date = formatDate(slot.startDate, LocaleConfig.dateTimeFormat);
    const startTime = moment(slot.startDate).utcOffset(tz).format('HH:mm');
    const endTime = moment(slot.endDate).utcOffset(tz).format('HH:mm');
    return `${date} ${startTime} - ${endTime}`;
  };

  const buildConfirmationObj = (bookingData) => {
    const data = cloneDeep(bookingData);
    const allSlots = map(data.bookingTimes || [], (slot) => ({
      ...slot,
      isAvailable: slot.isAvailable !== false,
      timeRange: getTimeRange(slot),
    }));
    const res = {};
    res.validSlots = filter(allSlots, (item) => item.isAvailable);
    res.invalidSlots = filter(allSlots, (item) => !item.isAvailable);
    res.requestedBy = data.requestedBy;
    res.amenityName = data.amenityName;
    res.createdDate = data.createdDate;
    res.status = data.status;
    return res;
  };

  useEffect(() => {
    setLocalData(buildConfirmationObj(bookingRequestData));
  }, [bookingRequestData]);

  const handleRemoveSlot = (index) => {
    Alert.alert(I18n.t('REMOVE_BOOKING_CONFIRMATION'), '', [
      { text: I18n.t('AD_COMMON_CANCEL'), style: 'cancel' },
      {
        text: I18n.t('AD_COMMON_REMOVE'),
        onPress: () => {
          const newValidSlots = filter(localData.validSlots, (_, i) => i !== index);
          setLocalData({
            ...localData,
            validSlots: newValidSlots,
          });
        },
      },
    ]);
  };

  const handleConfirmBooking = async () => {
    const bookingData = cloneDeep(bookingRequestData);
    bookingData.bookingTimes = localData.validSlots.map((slot) => ({
      startDate: slot.startDate,
      endDate: slot.endDate,
    }));
    delete bookingData.validSlots;
    delete bookingData.invalidSlots;
    const res = await recurringBooking(bookingData);
    onClosePress();
    if (res) {
      NavigationService.goBack();
      DeviceEventEmitter.emit('UpdateListBooking');
    }
  };

  const renderSlot = ({ item, index }) => (
    <SlotRow>
      <Row style={{ flex: 0.9 }}>
        <Text marginRight={8} text={`#${index + 1}`} />
        <Text text={item.timeRange} />
      </Row>

      <RemoveBtn style={{ flex: 0.1 }} onPress={() => handleRemoveSlot(index)}>
        <Ionicons name="trash-outline" size={16} color="red" />
      </RemoveBtn>
    </SlotRow>
  );

  return (
    <Container>
      {size(localData.invalidSlots) > 0 && (
        <Text style={{ color: 'red' }} marginBottom={8}>
          {I18n.t('CANNOT_BOOKING_ON')}: {localData.invalidSlots.map((item) => item.timeRange).join(', ')}
        </Text>
      )}
      <LabelValue labelKey="REQUESTED_BY" value={localData.requestedBy} />
      <LabelValue labelKey="AMENITY" value={localData.amenityName} />
      <LabelValue labelKey="COMMON_CREATED_DATE" value={new Date(localData.createdDate).toLocaleString()} />
      <LabelValue labelKey="STATUS" value={localData.status} />

      {localData.validSlots.length > 0 && (
        <SlotList data={localData.validSlots} keyExtractor={(_, i) => String(i)} renderItem={renderSlot} />
      )}

      <ButtonsRow>
        <Button onPress={onClosePress} title={I18n.t('CANCEL')} />
        {localData.validSlots.length > 0 && (
          <Button primary rounded onPress={handleConfirmBooking} title={I18n.t('CONFIRM')} />
        )}
      </ButtonsRow>
    </Container>
  );
};

export default withModal(BookingRecurringConfirmation, 'BOOKING_RECURRING');
