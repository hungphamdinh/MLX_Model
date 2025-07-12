import React from 'react';
import styled from 'styled-components/native';
import { Text } from '@Elements';
import get from 'lodash/get';
import I18n from '@I18n';

import { Wrapper } from '../ItemCommon';
import { icons } from '../../../Resources/icon';
import LocaleConfig from '../../../Config/LocaleConfig';
import { NextIcon } from '../../../Elements/statusView';

const RowWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${(props) => (props.noMargin ? '0px' : '10px')};
`;

const Symbol = styled.Image`
  width: 20px;
  height: 20px;
`;

const Label = styled(Text)`
  margin-left: 12px;
  flex: 1;
`;

const Value = styled(Text)`
  margin-left: 12px;
  flex: 1;
`;

const NextIconWrapper = styled.View`
  flex: 0.3;
  align-items: flex-end;
`;

const RowItem = ({ icon, label, value, isLastItem }) => (
  <RowWrapper noMargin={isLastItem}>
    <Symbol source={icon} resizeMode="contain" />
    <Label text={`${I18n.t(label)} :`} preset="medium" />
    <Value text={value} />
    <NextIconWrapper>{isLastItem && <NextIcon />}</NextIconWrapper>
  </RowWrapper>
);

const ItemInventory = ({ item, onPress }) => {
  const { name, quantity } = item;
  const categoryName = get(item, 'category.parent.name') || get(item, 'category.name');

  return (
    <Wrapper onPress={onPress}>
      <RowItem label="ITEM_INVENTORY_NAME" value={name} icon={icons.inventoryItem} />
      <RowItem
        label="ITEM_INVENTORY_QUATITY"
        value={LocaleConfig.formatNumber(quantity, 0)}
        icon={icons.currentQuantity}
      />
      <RowItem label="ITEM_INVENTORY_CATEGORY_NAME" value={categoryName} icon={icons.category} isLastItem />
    </Wrapper>
  );
};

export default ItemInventory;
