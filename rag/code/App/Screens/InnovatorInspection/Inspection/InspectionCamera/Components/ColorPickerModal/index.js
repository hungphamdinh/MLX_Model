import React from 'react';
import { Modal } from 'react-native';
import styled from 'styled-components/native';
import { HueSlider } from 'react-native-color';
import tinycolor from 'tinycolor2';
import { TriangleColorPicker } from 'react-native-color-picker';

const BackDrop = styled.TouchableWithoutFeedback``;

const MainContainer = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.4);
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.View`
  border-radius: 10px;
  height: 250px;
  width: 80%;
  padding: 20px;
  margin: 20px;
  background-color: white;
`;

const ColorPickerModal = ({ onDismiss, visible, onUpdateColor }) => (
  <Modal visible={visible} transparent>
    <BackDrop onPress={onDismiss}>
      <MainContainer>
        <Wrapper>
          <TriangleColorPicker
            hideControls
            onColorChange={onUpdateColor}
            onColorSelected={(color) => alert(`Color selected: ${color}`)}
            style={{ flex: 1, borderRadius: 10 }}
          />
        </Wrapper>
      </MainContainer>
    </BackDrop>
  </Modal>
);

export default ColorPickerModal;
