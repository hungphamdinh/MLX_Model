import React from 'react';
import { Modal } from 'react-native';
import styled from 'styled-components/native';
import AppNavigationBar from '../Layout/AppNavigationBar';
import { icons } from '../../Resources/icon';

const Wrapper = styled.View`
  background-color: rgba(0, 19, 53, 0.68);
  //background-color: red;
  flex: 1;
`;

const ContentWrapper = styled.View`
  background-color: #f3f3f3;
  padding-horizontal: 15px;
`;

const AppModal = ({ title, onClosePress, children, visible }) => (
  <Modal transparent visible={visible}>
    <Wrapper>
      <AppNavigationBar title={title} onLeftPress={() => onClosePress(false)} showBell={false} leftIcon={icons.back} />
      <ContentWrapper>{children}</ContentWrapper>
    </Wrapper>
  </Modal>
);

export default AppModal;
