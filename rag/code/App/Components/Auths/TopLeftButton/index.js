import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { Image } from 'react-native';
import { icons } from '../../../Resources/icon';

const Wrapper = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-top: 30px;
  margin-left: 20px;
  margin-right: 20px;
  position: absolute;
  z-index: 1;
  top: 0px;
  left: 0px;
`;

const TopLeftButton = ({ onLeftPress }) => (
  <Wrapper onPress={onLeftPress}>
    <Image source={icons.back} />
  </Wrapper>
);

export default TopLeftButton;

TopLeftButton.propTypes = {
  onLeftPress: PropTypes.func,
};

TopLeftButton.defaultProps = {
  onLeftPress: () => {},
};
