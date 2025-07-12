import React from 'react';
import styled from 'styled-components/native';
import I18n from '@I18n';
import { Text } from '../../../Elements';

const Wrapper = styled.View`
  flex-direction: row;
  align-items: center;
  border-bottom-width: 1px;
  height: 40px;
  border-color: #ddd;
  background-color: white;
  z-index: 2;
`;

const TabBarItemWrapper = styled.TouchableOpacity`
  align-items: center;
  flex: 1;
  height: 40px;
`;

const Title = styled(Text)`
  color: black;
  font-weight: bold;
  text-align: center;
  flex: 1;
  margin-top: 10px;
`;

const SelectedLine = styled.View`
  background-color: black;
  height: 2px;
  width: 80%;
  border-radius: 1px;
  margin-bottom: -1px;
`;
const TabBarItem = ({ title, isSelected, onPress }) => (
  <TabBarItemWrapper onPress={onPress}>
    <Title>{I18n.t(title)}</Title>
    {isSelected && <SelectedLine />}
  </TabBarItemWrapper>
);

const TabBar = ({ values, onChange, selectedIndex = 0 }) => (
  <Wrapper>
    {values.map((item, index) => (
      <TabBarItem key={item} title={item} isSelected={selectedIndex === index} onPress={() => onChange(index)} />
    ))}
  </Wrapper>
);

export default TabBar;
