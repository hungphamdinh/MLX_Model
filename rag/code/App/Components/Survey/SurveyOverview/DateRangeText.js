import React from 'react';
import styled from 'styled-components/native';
import { Text } from '@Elements';

import moment from 'moment';
import { Colors } from '../../../Themes';
import LocaleConfig from '../../../Config/LocaleConfig';
import { Spacer } from '../../../Elements';

const Wrapper = styled.View`
  margin-top: 12px;
`;

const ValueWrapper = styled.View`
  height: 42px;
  border-radius: 21px;
  background-color: white;
  padding-horizontal: 12px;
  margin-top: 12px;
  flex-direction: row;
  align-items: center;
  flex: 1;
`;

const Label = styled(Text)`
  font-size: 15px;
  margin-left: 12px;
  color: #001335;
`;

const Value = styled(Text)`
  color: #000000;
  flex: 1;
`;

const Time = styled(Text)`
  text-align: right;
  color: #000000;
`;

const VerticalLine = styled.View`
  background-color: ${Colors.border};
  height: 100%;
  width: 1px;
  margin-right: 8px;
`;

const Row = styled.View`
  flex-direction: row;
`;

const DateRangeText = ({ startDate, endDate }) => {
  const startDateStr = moment(startDate).format(LocaleConfig.dateTimeFormat);
  const startTimeStr = moment(startDate).format(LocaleConfig.timeFormat);
  const endDateStr = moment(endDate).format(LocaleConfig.dateTimeFormat);
  const endTimeStr = moment(endDate).format(LocaleConfig.timeFormat);
  return (
    <Wrapper>
      <Label text="COMMON_DATE" preset="medium" />
      <Row>
        <ValueWrapper>
          <Value typo="P2" text={startDateStr} />
          <VerticalLine />
          <Time typo="P2" text={startTimeStr} />
        </ValueWrapper>
        <Spacer width={20} />
        <ValueWrapper>
          <Value typo="P2" text={endDateStr} />
          <VerticalLine />
          <Time typo="P2" text={endTimeStr} />
        </ValueWrapper>
      </Row>
    </Wrapper>
  );
};

export default DateRangeText;
