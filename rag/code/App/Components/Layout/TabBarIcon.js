import React from 'react';
import styled from 'styled-components/native';
import { Text } from '@Elements';
import { Colors } from '../../Themes';
import useHome from '../../Context/Home/Hooks/UseHome';
import { getModuleIconTitleByScreen } from '../../Config/Constants';

const Wrapper = styled.View`
  flex: 1;
  width: 100%;
  align-items: center;
  background-color: ${(props) => (props.focused ? '#648FCA' : 'white')};
  border-color: #d3d7d8;
  border-right-width: 0.5px;
`;

const Title = styled(Text)`
  margin-top: 3px;
  font-size: 9px;
  text-transform: uppercase;
  text-align: center;
  margin-horizontal: 5px;
  color: ${(props) => (props.focused ? 'white' : '#001335')};
`;

const Icon = styled.Image`
  margin-top: 5px;
  width: 17px;
  height: 17px;
  tint-color: ${(props) => (props.focused ? 'white' : Colors.azure)};
`;

const InspectionIcon = styled.Image`
  margin-top: 5px;
  width: 17px;
  height: 17px;
`;

const TabBarIcon = ({ screen, focused }) => {
  const module = getModuleIconTitleByScreen(screen);
  if (!module) return null;
  return (
    <Wrapper focused={focused}>
      {module.activeIcon ? (
        <InspectionIcon source={module.icon} resizeMode="contain" />
      ) : (
        <Icon source={module.icon} resizeMode="contain" focused={focused} />
      )}

      <Title preset="medium" focused={focused} numberOfLines={2} text={module.title} />
    </Wrapper>
  );
};

export default TabBarIcon;
