import React, { Fragment } from 'react';
import { Wrapper } from '../../../../../ItemApp/ItemCommon';
import { icons } from '../../../../../../Resources/icon';
import { SuggestionRowItem } from '../index';

const ItemUnit = ({ item, onPress, isShowEmailAndPhone }) => (
  <Wrapper onPress={onPress}>
    <SuggestionRowItem icon={icons.unit} value={item.fullUnitCode} />
    <SuggestionRowItem icon={icons.user} value={item.displayName} symbolStyle={{ tintColor: '#B1B7C0' }} />
    {isShowEmailAndPhone && (
      <Fragment>
        <SuggestionRowItem icon={icons.email} value={item.emailAddress} />
        <SuggestionRowItem icon={icons.phone} value={item.phoneNumber} />
      </Fragment>
    )}
  </Wrapper>
);

export default ItemUnit;
