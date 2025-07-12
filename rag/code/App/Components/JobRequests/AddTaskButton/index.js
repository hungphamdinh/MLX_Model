import React from 'react';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';

import { Text } from '../../../Elements';

const Wrapper = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  border-radius: 4px;
  background-color: #648fca;
  max-width: 80px;
  padding: 5px;
`;

const Title = styled(Text)`
  font-size: 11px;
  margin-left: 2px;
  max-width: 80px;
  color: white;
`;

const AddTaskButton = ({ onPress, title = 'COMMON_TASK' }) => (
  <Wrapper onPress={onPress}>
    <Icon name="add" color="white" />
    <Title text={title} />
  </Wrapper>
);

export default AddTaskButton;
