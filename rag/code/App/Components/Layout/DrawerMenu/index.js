import React from 'react';
import { Modal, SafeAreaView } from 'react-native';
import _ from 'lodash';
import NavigationService from '@NavigationService';

import styled from 'styled-components/native';
import AvatarBar from './AvatarBar';
import ModuleItem from './ModuleItem';
import { Metric } from '../../../Themes';
import AppNavigationBar from '../AppNavigationBar';
import { icons } from '../../../Resources/icon';
import useHome from '../../../Context/Home/Hooks/UseHome';
import { getModuleIconTitleByScreen } from '../../../Config/Constants';

const Wrapper = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.8);
`;

const MenuScroll = styled.ScrollView`
  max-height: ${(props) => props.size * 3.5 + 80}px;
  overflow: hidden;
`;

const MenuWrapper = styled.View`
  flex-direction: row;
  background-color: #f5f5f5;
  flex-wrap: wrap;
  padding-top: 20px;
`;

const DrawerMenu = ({ visible, onDrawerChange, navProps }) => {
  // const unit = units.unitActive;
  const {
    home: { moduleHome },
  } = useHome();

  // if (!unit) return null;

  const size = (Metric.ScreenWidth - 60) / 3;

  const onItemPress = (module, index) => {
    onDrawerChange(false);
    NavigationService.navigate(module.screen);
  };

  const onAvatarPress = () => {
    onDrawerChange(false);
    NavigationService.navigate('Setting');
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <SafeAreaView />
      <Wrapper>
        <AppNavigationBar {...navProps} noShadow leftIcon={icons.closeBlack} />
        <AvatarBar onPress={onAvatarPress} />
        <MenuScroll size={size}>
          <MenuWrapper>
            {moduleHome.map((item, index) => {
              const module = getModuleIconTitleByScreen(item.screen);
              return (
                <ModuleItem
                  size={size}
                  title={module.title}
                  key={item.key}
                  icon={module.icon}
                  onPress={() => onItemPress(item, index)}
                />
              );
            })}
          </MenuWrapper>
        </MenuScroll>
      </Wrapper>
    </Modal>
  );
};

export default DrawerMenu;
