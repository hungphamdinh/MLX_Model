import React from 'react';
import _ from 'lodash';
import { Text } from '@Elements';
import { Image, View } from 'react-native';
import styled from 'styled-components/native';

import moment from 'moment';
import { HorizontalLine, ID, RowWrapper, VerticalLabelValue, Wrapper } from '../ItemCommon';
import { getIconByModuleId } from '../../../Config/Constants';
import { Colors } from '../../../Themes';
import LocaleConfig from '../../../Config/LocaleConfig';
import { icons } from '../../../Resources/icon';

const Symbol = styled.Image`
  width: 15px;
  height: 22px;
`;

const LeftValue = styled(Text)`
  margin-right: 20px;
  flex: 1;
  text-align: right;
`;

const ItemNotification = ({ item, onPress }) => {
  const state = item.state;
  const dateTime = moment(item.notification.creationTime).format(
    `${LocaleConfig.dateTimeFormat} ${LocaleConfig.timeFormat}`
  );
  const properties = item.notification.data.properties;
  const type = properties.Type;
  const itemId = properties.Id;
  return (
    <Wrapper onPress={onPress}>
      {state === 0 ? (
        <View
          style={{
            backgroundColor: '#FF361A',
            position: 'absolute',
            top: 22,
            right: 22,
            width: 8,
            height: 8,
            borderRadius: 33,
          }}
        />
      ) : null}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <Image
          resizeMode="contain"
          style={{
            width: 20,
            height: 20,
            marginRight: 10,
          }}
          source={getIconByModuleId(parseInt(type, 10))}
        />
        {itemId && _.size(itemId) < 10 && (
          <ID text={`#${itemId}`} preset="bold" style={{ color: state === 0 ? Colors.text : '#BABFC8' }} />
        )}
        <LeftValue text={`${dateTime}`} />
      </View>
      <HorizontalLine />
      <Text>{`${item.notification.data.message}`}</Text>
    </Wrapper>
  );
};

export default ItemNotification;
