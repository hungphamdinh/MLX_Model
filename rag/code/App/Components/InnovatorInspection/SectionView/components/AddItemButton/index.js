import React from 'react';
// import {} from 'react-native'
import { Text } from '@Elements';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors } from '@Themes';

const Wrapper = styled.TouchableOpacity`
  height: 34px;
  border-radius: 17px;
  background-color: ${(props) => (props.info ? Colors.info : Colors.primary)};
  align-items: center;
  justify-content: center;
  padding-horizontal: 17px;
  flex-direction: row;
  align-self: center;
`;

const PlusCircle = styled.View`
  position: absolute;
  right: 0px;
  top: -10px;
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background-color: white;
  align-items: center;
  justify-content: center;
`;

const Title = styled(Text)`
  color: ${(props) => (props.info ? 'white' : Colors.text)};
`;

const PlusIcon = styled(Icon)``;

const AddItemButton = ({ onPress, title, info, containerStyle }) => (
  <Wrapper onPress={onPress} style={containerStyle} info={info}>
    <Title text={title} preset="medium" info={info} />
    <PlusCircle>
      <PlusIcon name="add" color="black" size={14} />
    </PlusCircle>
  </Wrapper>
);

export default AddItemButton;
