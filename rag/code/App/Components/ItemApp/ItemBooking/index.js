import React from 'react';
import styled from 'styled-components/native';
import _ from 'lodash';
import { StatusView, Text } from '@Elements';
import moment from 'moment';
import { HorizontalLine, VerticalLabelValue, Wrapper } from '../ItemCommon';
import { icons } from '../../../Resources/icon';
import LocaleConfig from '../../../Config/LocaleConfig';
import { bookingTargets } from '../../../Config/Constants';

const ID = styled(Text)`
  font-size: 15px;
  flex: 1;
`;

const UserNameUnitWrapper = styled.View`
  flex-direction: row;
  align-items: center;
`;

const RowWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
  flex: 1;
`;

const Symbol = styled.Image`
  width: 15px;
  height: 22px;
`;

const GraySymbol = styled(Symbol)`
  tint-color: #22314d;
`;

const LeftValue = styled(Text)`
  margin-left: 12px;
  flex: 1;
`;

const UserName = styled(LeftValue)`
  margin-right: 5px;
`;

const Space = styled.View`
  margin-bottom: 10;
`;

const getRequestedBy = (item) => {
  switch (item.bookingType) {
    case bookingTargets.occupier:
      return `${item.fullUnitId} - ${item.name}`;
    case bookingTargets.company: {
      // filter out empty, null, undefined values
      const items = [item.name, item.email].filter(Boolean);
      // join the filtered values with a hyphen
      return items.join(' - ');
    }

    case bookingTargets.outsider:
      return item.email;
    default:
      return '';
  }
};

const ItemBooking = ({ item, onPress, testID }) => {
  const status = {
    id: item.statusId,
    name: item.statusName,
    colorCode: item.statusColorCode,
  };

  const paymentStatus = item.paymentStatusId
    ? {
        id: item.paymentStatusId,
        name: item.paymentStatusName,
        colorCode: item.paymentStatusColorCode,
      }
    : null;
  const bookingDate = moment(item.startDate).format(LocaleConfig.dateTimeFormat);
  const fromTime = moment(item.startDate).format(LocaleConfig.timeFormat);
  const toTime = moment(item.endDate).format(LocaleConfig.timeFormat);
  const bookinTime = `${fromTime} - ${toTime}`;
  const requestedBy = getRequestedBy(item);

  return (
    <Wrapper testID={testID || 'item-wrapper'} onPress={onPress}>
      <RowWrapper>
        <ID text={`#${item.reservationId}`} preset="bold" />
      </RowWrapper>
      <HorizontalLine />
      <UserNameUnitWrapper>
        <RowWrapper>
          <Symbol resizeMode="contain" source={icons.user} />
          <UserName text={item.creatorUser} preset="medium" />
        </RowWrapper>
      </UserNameUnitWrapper>
      {_.size(requestedBy) > 0 && (
        <RowWrapper>
          <GraySymbol resizeMode="contain" source={icons.unit} />
          <UserName text={requestedBy} preset="medium" />
        </RowWrapper>
      )}
      <RowWrapper>
        <Symbol resizeMode="contain" source={icons.amenity} />
        <UserName text={item.amenityName} preset="medium" />
      </RowWrapper>
      <RowWrapper>
        <GraySymbol resizeMode="contain" source={icons.calendar} />
        <UserName text={moment(item.createdAt).format(LocaleConfig.fullDateTimeFormat)} preset="medium" />
      </RowWrapper>
      <RowWrapper>
        <VerticalLabelValue label="BOOKING_BOOKED_DATE" value={bookingDate} />
        <VerticalLabelValue label="BOOKING_BOOKED_TIME" value={bookinTime} />
      </RowWrapper>
      <Space />
      <StatusView testID="statusView" status={status} subStatus={paymentStatus} />
    </Wrapper>
  );
};

export default ItemBooking;
