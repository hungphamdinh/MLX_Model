import React from 'react';
import styled from 'styled-components/native';
import _ from 'lodash';
import { ImageView, Text } from '@Elements';
import get from 'lodash/get';
import moment from 'moment';
import { HorizontalLine, VerticalLabelValue, Wrapper } from '../ItemCommon';
import LocaleConfig from '../../../Config/LocaleConfig';
import { NextIcon } from '../../../Elements/statusView';
import { numberWithGroupSeparator } from '../../../Utils/converNumber';

const ID = styled(Text)`
  flex: 1;
`;

const RowWrapper = styled.View`
  flex-direction: row;
  margin-bottom: 10px;
`;

const Body = styled.View`
  flex-direction: row;
`;

const Content = styled.View`
  flex: 1;
  margin-right: 5px;
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

const ItemMeterReading = ({ item, onPress, settings }) => {
  const { meterDevice } = item;
  const { location, unit } = meterDevice;
  const tariffRate = settings?.tariffRate || 0;

  const locationUnitText = location ? _.get(location, 'name') : _.get(unit, 'fullUnitCode');

  const readingDate = get(item, 'readingDate')
    ? moment(get(item, 'readingDate')).format(LocaleConfig.dateTimeFormat)
    : '';
  const creationDate = get(item, 'creationTime')
    ? moment(get(item, 'creationTime')).format(LocaleConfig.dateTimeFormat)
    : '';

  return (
    <Wrapper onPress={onPress}>
      <RowWrapper>
        <ID text={`#${item.id}`} preset="bold" />
      </RowWrapper>

      <HorizontalLine />
      <Body>
        <AvatarWrapper>
          <Avatar source={_.first(item.fileUrls)} />
        </AvatarWrapper>
        <Content>
          <RowWrapper>
            <VerticalLabelValue label="METER_TYPE" value={item.meterTypeName} />
            <VerticalLabelValue label="METER_READING_DEVICE_SERIAL_NAME" value={meterDevice.serialNumber} />
          </RowWrapper>
          <RowWrapper>
            <VerticalLabelValue label="METER_READING_PERIOD" value={`${item.period}/${item.year}`} />
            <VerticalLabelValue
              label="METER_READING_METER_RECORD"
              value={`${numberWithGroupSeparator(item.value, settings?.decimalPlace)} ${
                item.meterDevice?.meterType?.calculationUnit
              }`}
            />
          </RowWrapper>
          <RowWrapper>
            <VerticalLabelValue
              label="METER_READING_CURRENT_MONTH_CONSUMPTION"
              value={`${numberWithGroupSeparator(item.currentMonthConsumption, settings?.decimalPlace)} ${
                item.meterDevice?.meterType?.calculationUnit
              }`}
            />
            <VerticalLabelValue label="UNIT_LOCATION" value={locationUnitText} />
          </RowWrapper>
          <RowWrapper>
            <VerticalLabelValue label="METER_READING_READING_DATE" value={readingDate} />
            <VerticalLabelValue label="COMMON_CREATED_DATE" value={creationDate} />
          </RowWrapper>
          {!!tariffRate && (
            <RowWrapper>
              <VerticalLabelValue label="METER_READING_TOTAL_COST" value={LocaleConfig.formatMoney(item.totalCost)} />
            </RowWrapper>
          )}
        </Content>
        <NextIcon />
      </Body>
    </Wrapper>
  );
};

export default ItemMeterReading;
