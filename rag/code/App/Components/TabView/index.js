import React from 'react';
import { ScrollableTabView } from '@summerkiflain/react-native-scrollable-tabview';
import RoundedTabBar from './RoundedTabBar';

const TabView = ({ children }) => (
  <ScrollableTabView renderTabBar={() => <RoundedTabBar />}>{children}</ScrollableTabView>
);

export default TabView;
