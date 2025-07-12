/* @flow */

import React from 'react';
import { View } from 'react-native';
import {
  Text, ItemWrapper, Icon,
} from '../../../Elements';
import {
  Fonts, ImageResource, Metric,
} from '../../../Themes';


const ItemMember = ({
  onPressItem, item, index,
}) => {
  const onPress = () => {
    onPressItem(item);
  };

  const {displayName, emailAddress, phoneNumber} = item;
  return (
      <ItemWrapper key={index.toString()} onPress={onPress}>
          <View>
              <Text fontFamily={Fonts.SemiBold}>
                  {displayName}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                  <Icon source={ImageResource.IC_Mail} size={Metric.iconSize10} />
                  <Text style={{ marginLeft: Metric.space10 }}>
                      {`${emailAddress || '...'}`}
                  </Text>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon source={ImageResource.IC_Phone} size={Metric.iconSize10} />
                  <Text style={{ marginLeft: Metric.space10 }}>
                      {`${phoneNumber || '...'}`}
                  </Text>
              </View>
          </View>
      </ItemWrapper>
  );
};

export default ItemMember;
