import React from 'react';
import styled from 'styled-components/native';

const Icon = styled.ImageBackground`
  width: 25px;
  height: 25px;
  margin-top: 5px;
`;

const Overlay = styled.View`
  flex: 1;
  background-color: #558cc9;
  border-radius: 5px;
  opacity: 0.4;
`;

const TabIcon = ({ source, focused }) => <Icon source={source}>{focused && <Overlay />}</Icon>;

export default TabIcon;
