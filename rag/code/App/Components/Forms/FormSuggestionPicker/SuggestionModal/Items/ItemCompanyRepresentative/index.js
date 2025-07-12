import React from 'react';
import { Wrapper } from '../../../../../ItemApp/ItemCommon';
import { SuggestionRowItem } from '../index';
import { getCompanyRepresentativeName } from '../../../../../../Utils/common';

const ItemCompanyRepresentative = ({ item, onPress }) => {
  item.companyRepresentative = getCompanyRepresentativeName(item);

  return (
    <Wrapper onPress={onPress}>
      <SuggestionRowItem value={item.companyRepresentative} />
    </Wrapper>
  );
};

export default ItemCompanyRepresentative;
