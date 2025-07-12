import styled from 'styled-components/native';
import React from 'react';
import { View } from 'react-native';
import { Image, Text } from '../../../Elements';
import { BasicStyles, Colors, ImageResource } from '../../../Themes';

const Content = styled(Text)`
  text-align: center;
  margin-top: 10px;
`;

const Icon = styled(Image)`
  width: 120px;
  height: 120px;
`;
const EmptyItem = () => (
  <View style={BasicStyles.flexCenter}>
    <Icon source={ImageResource.IMG_ChatEmty} />
    <Content text="AD_CHAT_WO_EMPTY" />
    <Content color={Colors.textHeather} text="AD_CHAT_WO_EMPTY_DESCRIPT" />
  </View>
);

export default EmptyItem;
