import React from 'react';
import styled from 'styled-components/native';
import { Text } from '@Elements';

const Wrapper = styled.TouchableOpacity`
  height: 80px;
  background-color: ${(props) => props.color};
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  flex: 1;
  justify-content: flex-end;
  padding-bottom: 5px;
`;

const Number = styled(Text)`
  color: white;
  font-size: 20px;
  text-align: center;
`;

const Title = styled(Text)`
  color: white;
  margin-top: 5px;
  text-align: center;
  text-transform: capitalize;
  margin-horizontal: 10px;
`;

const StatisticItem = ({ color, number, title, onPress }) => (
  <Wrapper color={color} onPress={onPress}>
    <Number preset="medium" text={`${number}`} />
    <Title preset="medium" text={title} numberOfLines={2} />
  </Wrapper>
);

export default StatisticItem;
