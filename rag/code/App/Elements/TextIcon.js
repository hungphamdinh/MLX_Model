/* @flow */

import React from 'react';
import { Text, Icon } from '../Elements';
import { Colors, Metric } from '../Themes';
import styled from 'styled-components/native';

const ItemWrapper = styled.View`
  flex-direction: row;
  align-items: center;
`;
const TextIcon = ({ icons, text, iconProps }) => (
  <ItemWrapper>
    <Icon {...iconProps} source={icons} style={{ width: 15, height: 22 }} />
    <Text
      // numberOfLines={1}
      color={Colors.textHeather}
      style={{ marginLeft: Metric.space5, flex: 1 }}
    >
      {text}
    </Text>
  </ItemWrapper>
);

export default TextIcon;
