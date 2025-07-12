/**
 * Created by thienmd on 10/9/20
 */
import React, { useState, Fragment } from 'react';
import styled from 'styled-components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Button from './Button';
import { Colors } from '../Themes';
import ModalText from '../Modal/ModalText';

const Hint = styled(Button)`
  margin-left: 2px;
  margin-top: -10px;
`;

const ButtonHint = ({ size = 20, content, style }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const changeModalVisible = () => {
    setModalVisible(!modalVisible);
  };
  return (
    <Fragment>
      <Hint style={style} onPress={changeModalVisible}>
        <Ionicons name="help-circle" color={Colors.text} size={size} />
      </Hint>
      <ModalText
        modalVisible={modalVisible}
        onClose={changeModalVisible}
        onPressDone={changeModalVisible}
        content={content}
      />
    </Fragment>
  );
};

export default ButtonHint;
