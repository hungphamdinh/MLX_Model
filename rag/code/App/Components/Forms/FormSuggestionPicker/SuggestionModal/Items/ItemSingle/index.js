import React from 'react';
import { Wrapper } from '../../../../../ItemApp/ItemCommon';
import { SuggestionRowItem } from '../index';

const ItemSingle = ({ item, fieldName, onPress }) => (
  <Wrapper onPress={onPress}>
    <SuggestionRowItem value={item[fieldName]} />
  </Wrapper>
);

export default ItemSingle;
