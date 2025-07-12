import React from 'react';
import styled from 'styled-components/native';
import get from 'lodash/get';
import moment from 'moment';
import { VerticalLabelValue, Wrapper } from '../ItemCommon';
import LocaleConfig from '../../../Config/LocaleConfig';
import { numberWithGroupSeparator } from '../../../Utils/converNumber';

const RowWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`;

const ItemMeterReadingHistory = ({ item, onPress, settings }) => {
  const readingDate = get(item, 'readingDate')
    ? moment(get(item, 'readingDate')).format(LocaleConfig.dateTimeFormat)
    : '';

  return (
    <Wrapper onPress={onPress}>
      <RowWrapper>
        <VerticalLabelValue label="METER_READING_PERIOD" value={`${item.period}`} />
        <VerticalLabelValue
          label="METER_READING_METER_RECORD"
          value={`${numberWithGroupSeparator(item.value, settings?.decimalPlace)} ${
            item.meterDevice?.meterType?.calculationUnit
          }`}
        />
      </RowWrapper>
      <RowWrapper>
        <VerticalLabelValue label="METER_READING_READING_DATE" value={readingDate} />
        <VerticalLabelValue label="COMMON_CREATED_BY" value={item?.creatorUser?.displayName} />
      </RowWrapper>
    </Wrapper>
  );
};

export default ItemMeterReadingHistory;
