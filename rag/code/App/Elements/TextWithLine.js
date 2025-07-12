/* @flow */

import React from 'react';
import I18n from '@I18n';
import styled from 'styled-components/native';
import { View } from 'react-native';
import { Text } from '../Elements';

const Title = styled(Text)`
  margin-top: -3px;
  text-align: center;
  margin-horizontal: 5px;
`;

const Line = styled.View`
  flex: 1;
  height: 1;
  background-color: black;
`;

const Wrapper = styled(View)`
  flex-direction: row;
  align-items: center;
  padding-horizontal: 15px;
`;

const TextWithLine = ({ text, style }) => (
  <Wrapper style={style}>
    <Line />
    <View>
      <Title preset="bold">{I18n.t(text)}</Title>
    </View>
    <Line />
  </Wrapper>
);

export default TextWithLine;
