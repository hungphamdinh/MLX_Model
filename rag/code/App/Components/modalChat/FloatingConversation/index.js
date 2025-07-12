import React, { useState } from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native';
import { Button, Icon } from '@Elements';
import { Metric, Colors } from '../../../Themes';
import ModalChat from '../index';
import { icons } from '../../../Resources/icon';
import { isGrantedAny } from '../../../Config/PermissionConfig';

const MessageButton = styled(Button)`
  position: absolute;
  bottom: 75px;
  right: 20px;
`;

const Wrapper = styled.View`
  background-color: ${Colors.primary};
  width: ${Metric.space50}px;
  height: ${Metric.space50}px;
  border-radius: ${Metric.space50 / 2}px;
  justify-content: center;
  align-items: center;
`;

export const MessageFloatingButton = ({ onPress, testID }) => (
  <MessageButton testID={testID} onPress={onPress}>
    <Wrapper>
      <Icon source={icons.chat} size={30} />
    </Wrapper>
  </MessageButton>
);

const FloatingConversation = ({ disableTenant, guid, disable, moduleId, ...props }) => {
  const allowChat = isGrantedAny('Memo.Read', 'Memo.Reply');
  if (!allowChat) {
    return null;
  }

  const [visible, setVisible] = useState(false);
  const goChatWO = () => {
    setVisible(true);
  };

  return (
    <>
      <MessageFloatingButton onPress={goChatWO} />
      <SafeAreaView>
        <ModalChat
          {...props}
          moduleId={moduleId}
          disable={disable}
          disableTenant={disableTenant}
          guid={guid}
          onClose={() => setVisible(false)}
          isVisible={visible}
        />
      </SafeAreaView>
    </>
  );
};

export default FloatingConversation;
