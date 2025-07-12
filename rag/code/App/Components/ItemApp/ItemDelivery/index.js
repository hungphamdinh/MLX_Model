import React from 'react';
import styled from 'styled-components/native';
import { View } from 'react-native';
import _ from 'lodash';
import { StatusView, Text, ImageView } from '@Elements';
import moment from 'moment';
import { HorizontalLine, Wrapper } from '../ItemCommon';
import { icons } from '../../../Resources/icon';
import LocaleConfig from '../../../Config/LocaleConfig';
import { CheckBox } from '../../../Elements';
import { ParcelStatus } from '../../../Config/Constants';
import { isGranted } from '../../../Config/PermissionConfig';

const ID = styled(Text)`
  flex: 1;
`;

const RowWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`;

const Symbol = styled.Image`
  width: 15px;
  height: 22px;
`;

const LeftValue = styled(Text)`
  margin-left: 12px;
  flex: 1;
`;

const Body = styled.View`
  flex-direction: row;
`;

const Content = styled.View`
  flex: 1;
`;

const AvatarWrapper = styled.View`
  width: 60px;
  height: 60px;
  margin-right: 10px;
`;

const Avatar = styled(ImageView)`
  width: 60px;
  height: 60px;
  border-radius: 10px;
`;

const ItemDelivery = ({ item, onPress, onCheck, checked }) => {
  const { startDate, endDate, creationTime } = item;
  const dates = [];
  if (startDate) dates.push(startDate);
  if (!startDate) dates.push(creationTime);
  if (endDate) dates.push(endDate);
  const unitID = _.get(item, 'fullUnitCode') || '';
  const allowSelect = isGranted('Deliveries.Update') && item.statusId === ParcelStatus.WAITING_TO_RECEIVED;
  return (
    <Wrapper onPress={onPress}>
      <RowWrapper>
        <ID text={`#${item.id}`} preset="bold" />
        {allowSelect && <CheckBox checked={checked} onPressCheck={onCheck} />}
      </RowWrapper>

      <HorizontalLine />
      <Body>
        <AvatarWrapper>
          <Avatar source={_.first(item.fileUrls)} />
        </AvatarWrapper>
        <Content>
          <RowWrapper>
            <Symbol resizeMode="contain" source={icons.user} />
            <LeftValue text={unitID} preset="medium" />
          </RowWrapper>
          <RowWrapper>
            <Symbol source={icons.dateTime} resizeMode="contain" />
            <LeftValue
              text={dates.map((date) => moment(date).format(LocaleConfig.dateTimeFormat)).join(' - ')}
              preset="medium"
            />
          </RowWrapper>
          {_.size(item.deliveryText) > 0 && (
            <RowWrapper>
              <Symbol resizeMode="contain" source={icons.description} />
              <LeftValue numberOfLines={2} text={item.deliveryText} preset="medium" />
            </RowWrapper>
          )}
          <StatusView status={item.status || item.taskStatus} subStatus={item.priority} />
        </Content>
      </Body>
    </Wrapper>
  );
};

export default ItemDelivery;
