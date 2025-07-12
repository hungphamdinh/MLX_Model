import React from 'react';
import styled from 'styled-components/native';
import { Text } from '@Elements';
import _ from 'lodash';
import { HorizontalLine, VerticalLabelValue, Wrapper } from '../ItemCommon';
import StatusView from '../../../Elements/statusView';
import Row from '../../Grid/Row';
import { formatDateTime } from '../../../Utils/common';
import { icons } from '../../../Resources/icon';

const Header = styled(Row)`
  flex: 1;
  font-size: 15px;
  margin-bottom: 10px;
`;

const RowWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
  margin-right: 10px;
  flex: 1;
`;

const Symbol = styled.Image`
  width: 15px;
  height: 22px;
  margin-right: 5px;
`;

const ItemTask = ({ item, onPress }) => {
  const { id, name, startDate, endDate } = item;
  const assignees = _.map(item.assignees, (assignee) => assignee.displayName).join(', ');

  return (
    <Wrapper onPress={onPress}>
      <Header>
        <Text text={`#${id} ${name}`} preset="bold" />
      </Header>
      <HorizontalLine />
      <RowWrapper>
        <Symbol resizeMode="contain" source={icons.user} />
        <Text text={assignees} preset="bold" />
      </RowWrapper>
      <RowWrapper>
        {startDate && <VerticalLabelValue label="START_DATE" value={formatDateTime(startDate)} />}
        {endDate && <VerticalLabelValue label="END_DATE" value={formatDateTime(endDate)} />}
      </RowWrapper>
      <StatusView status={item.status} subStatus={item.priority} />
    </Wrapper>
  );
};

export default ItemTask;
