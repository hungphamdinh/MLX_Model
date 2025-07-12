import styled from 'styled-components/native';
import React from 'react';

const TagWrapper = styled.View`
  border-radius: 5px;
  background-color: ${(props) => props.backgroundColor};
  justify-content: center;
  align-items: center;
  padding-horizontal: 20px;
  height: 18px;
`;

const TagTitle = styled.Text`
  font-weight: bold;
  color: white;
  text-align: center;
  align-self: center;
`;

const Tag = ({ color, name }) => (
  <TagWrapper backgroundColor={color}>
    <TagTitle>{name}</TagTitle>
  </TagWrapper>
);

export default Tag;
