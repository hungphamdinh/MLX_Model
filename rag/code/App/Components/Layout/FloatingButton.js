import React from 'react';
import styled from 'styled-components/native';
import I18n from '@I18n';
import { Text } from '../../Elements';

const Wrapper = styled.TouchableOpacity`
  background-color: #ffe136;
  width: 66px;
  height: 66px;
  border-radius: 33px;
  align-items: center;
  justify-content: center;
  padding-horizontal: 5px;
`;

const Title = styled(Text)`
  color: black;
  font-weight: bold;
  text-align: center;
  margin-top: 5px;
  font-size: 10px;
  text-transform: capitalize;
`;

const PlusIcon = styled.View`
  width: 20px;
  height: 20px;
  border-radius: 9px;
  background-color: white;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 0px;
  top: 5px;
`;

const PlusText = styled.Text`
  color: black;
`;

const FloatingButton = ({ title = 'Create Form', onPress, style }) => (
  <Wrapper onPress={onPress} style={style}>
    <PlusIcon>
      <PlusText>+</PlusText>
    </PlusIcon>
    <Title bold>{I18n.t(title)}</Title>
  </Wrapper>
);

export default FloatingButton;
