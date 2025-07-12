import React from 'react';
import {Modal} from 'react-native';
import i18n from '@I18n';
import styled from 'styled-components/native';
import Row from '../../Components/Grid/Row';
import { Button, Text } from '../../Elements';

const Backdrop = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.7);
  align-items: center;
  justify-content: center;
`;

const TitleWrapper = styled.View`
  align-items: center;
`;

const ActionWrapper = styled(Row)`
  justify-content: space-around;
  margin-top: 30;
`;

const ModalWrapper = styled.View`
  background-color: white;
  border-radius: 14px;
  padding-horizontal: 16px;
  padding-top: 20px;
  padding-bottom: 30px;
  width: 90%;
`;

const Content = styled(Text)`
  padding-horizontal: 10px;
  font-size: 14px;
`;

const ModalText = ({ modalVisible, onPressDone, content }) => (
  <Modal transparent animationType="fade" visible={modalVisible} style={{ margin: 0 }}>
    <Backdrop>
      <ModalWrapper>
        <TitleWrapper>
          <Content text={i18n.t(content)} />
        </TitleWrapper>

        <ActionWrapper center>
          <Button title="COMMON_CLOSE" primary rounded onPress={onPressDone} />
        </ActionWrapper>
      </ModalWrapper>
    </Backdrop>
  </Modal>
);

export default ModalText;
