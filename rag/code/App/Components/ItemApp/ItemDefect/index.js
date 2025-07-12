import React from 'react';
import styled from 'styled-components/native';
import _ from 'lodash';
import { Text } from '@Elements';
import { HorizontalLine, Wrapper } from '../ItemCommon';
import { icons } from '../../../Resources/icon';
import Row from '../../Grid/Row';
import I18n from '../../../I18n';

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

const LeftValue = styled(Text)`
  margin-left: 12px;
  flex: 1;
`;

const UserName = styled(LeftValue)`
  margin-right: 5px;
`;

const ItemDefect = ({ item, onPress }) => {
  let userName = '';
  if (item) {
    userName = _.get(item?.teamUser || item?.creatorUser, 'displayName');
  }

  return (
    <Wrapper testID="item-wrapper" onPress={onPress}>
      <RowWrapper>
        <ID text={`${I18n.t('TASK')} #${item.id}/${item.workOrderId}`} preset="bold" />
      </RowWrapper>
      <HorizontalLine />
      <UserNameUnitWrapper>
        <RowWrapper>
          <Symbol resizeMode="contain" source={icons.user} />
          <UserName text={userName} preset="medium" />
        </RowWrapper>
      </UserNameUnitWrapper>

      <Row>
        <Symbol resizeMode="contain" source={icons.description} />
        <LeftValue text={`${_.trim(item.description)}`} preset="medium" />
      </Row>
    </Wrapper>
  );
};

export default ItemDefect;
