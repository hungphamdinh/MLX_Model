import React from 'react';
import styled from 'styled-components/native';
import { Image } from 'react-native';
import { icons } from '../../../Resources/icon';

const Wrapper = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-top: 60px;
  position: absolute;
  z-index: 2;
  right: 20px;
`;

const TopRightButton = ({ onPress }) => (
  <Wrapper onPress={onPress}>
    <Image source={icons.close} />
  </Wrapper>
);

export default TopRightButton;
