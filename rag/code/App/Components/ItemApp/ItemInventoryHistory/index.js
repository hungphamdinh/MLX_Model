import React from 'react';
import styled from 'styled-components/native';
import { Text } from '@Elements';
import get from 'lodash/get';
import I18n from '@I18n';

import { Wrapper } from '../ItemCommon';
import { icons } from '../../../Resources/icon';
import moment from 'moment';
import LocaleConfig from '../../../Config/LocaleConfig';
import { Colors } from '../../../Themes';

const RowWrapper = styled.View`
  flex-direction: row;
  margin-bottom: ${(props) => (props.noMargin ? '0px' : '12px')};
  flex: 1;
`;

const Label = styled(Text)`
  font-size: 12px;
`;

const Value = styled(Text)`
  font-size: 12px;
  margin-left: 12px;
  flex: 1;
`;

const RowItem = ({ label, value }) => (
  <RowWrapper noMargin>
    <Label text={`${I18n.t(label)} :`} preset="medium" />
    <Value text={value} />
  </RowWrapper>
);

const HeaderWrapper = styled(RowWrapper)`
  justify-content: space-between;
`;

const DateWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  height: 24px;
  border-radius: 12px;
  border-color: ${Colors.border};
  border-width: 1px;
  padding-horizontal: 10px;
`;

const StatusWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  height: 24px;
  border-radius: 12px;
  border-color: ${Colors.border};
  padding-horizontal: 10px;
  background-color: white;
  align-items: center;
  box-shadow: 0px 3px 6px #00000029;
  elevation: 6;
`;

const VerticalLine = styled.View`
  height: 100%;
  width: 1px;
  background-color: ${Colors.border};
  margin-horizontal: 10px;
`;

const Date = styled(Text)`
  font-size: 10px;
  font-weight: normal;
`;

const Time = styled(Text)`
  font-size: 10px;
  font-weight: normal;
`;

const ColorBox = styled.View`
  background-color: ${(props) => props.color};
  width: 12px;
  height: 12px;
  border-radius: 5px;
  box-shadow: 0px 3px 6px #00000029;
  elevation: 6;
  margin-right: 5px;
`;

const Status = styled(Text)``;
const ItemInventoryHistory = ({ item }) => {
  const { description, quantity, type, unitPrice, cost, historyDate } = item;
  // const date =
  const date = moment(historyDate).format(LocaleConfig.dateTimeFormat);
  const time = moment(historyDate).format(LocaleConfig.timeFormat);

  return (
    <Wrapper>
      <HeaderWrapper>
        <DateWrapper>
          <Date preset="medium" text={date} />
          <VerticalLine />
          <Time preset="medium" text={time} />
        </DateWrapper>
        <StatusWrapper>
          <ColorBox color={type === 'IN' ? '#55E618' : 'red'} />
          <Status text={type === 'IN' ? 'ITEM_IV_HIS_INPUT_TEXT' : 'ITEM_IV_HIS_INPUT_OUTPUT_TEXT'} />
        </StatusWrapper>
      </HeaderWrapper>

      <RowWrapper>
        <RowItem label="ITEM_IV_HIS_UNIT_QUANTITY" value={LocaleConfig.formatNumber(quantity, 0)} />
        <RowItem label="ITEM_IV_HIS_UNIT_COST" value={LocaleConfig.formatMoney(cost)} />
      </RowWrapper>
      <RowWrapper noMargin>
        <RowItem label="ITEM_IV_HIS_UNIT_PRICE" value={LocaleConfig.formatMoney(unitPrice)} />
        <RowItem label="COMMON_DESCRIPTION" value={description} />
      </RowWrapper>
    </Wrapper>
  );
};

export default ItemInventoryHistory;
