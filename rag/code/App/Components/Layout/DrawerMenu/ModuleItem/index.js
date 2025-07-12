import React from 'react';
import styled from 'styled-components/native';
import { Text } from '@Elements';
import ShadowView from '@Elements/ShadowView';
import { Colors } from '../../../../Themes';

const Wrapper = styled(ShadowView)`
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  padding-left: 5px;
  padding-right: 5px;
  margin-left: 15px;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  margin-bottom: 20px;
`;

const Icon = styled.Image`
  width: 33px;
  height: 33px;
`;

const Title = styled(Text)`
  font-size: 10px;
  text-transform: uppercase;
  margin-top: 16px;
  text-align: center;
`;

const ModuleItem = ({ title, icon, size, onPress }) => (
  <Wrapper size={size} onPress={onPress}>
    <Icon source={icon} resizeMode="contain" />
    <Title text={title} preset="bold" />
  </Wrapper>
);

export default ModuleItem;
