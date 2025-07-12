import React from 'react';
import { Text } from '@Elements';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors } from '@Themes';

const Wrapper = styled.TouchableOpacity`
  border-radius: 30px;
  background-color: ${(props) => (props.info ? Colors.info : Colors.primary)};
  padding-vertical: 5px;
  padding-horizontal: 17px;
  flex-direction: row;
  align-self: flex-end;
  top: -5px;
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

const SetUpMasterSectionButton = ({ onPress, info, containerStyle }) => (
  <Wrapper onPress={onPress} style={containerStyle} info={info}>
    <Title text="INSPECTION_MASTER_SECTION" preset="medium" info={info} />
    <PlusCircle>
      <Icon name="settings-outline" color="black" size={14} />
    </PlusCircle>
  </Wrapper>
);

export default SetUpMasterSectionButton;
