/**
 * Created by thienmd on 10/7/20
 */
import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import TabBarIcon from '../../../Components/Layout/TabBarIcon';

import PropertyScreen from '../Property/PropertyScreen';
import FormScreen from '../Template/FormScreen';
import SyncScreen from '../Sync';
import InspectionHomeScreen from '../Inspection/InspectionHome';
import MyReport from '../MyReport';
import { isGranted } from '../../../Config/PermissionConfig';

const Tab = createBottomTabNavigator();

const InspectionTabNavigation = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarLabel: () => undefined,
      tabBarIcon: ({ focused }) => <TabBarIcon screen={route.name} focused={focused} />,
    })}
  >
    {isGranted('Pages.Inspection') && <Tab.Screen name="inspectionHome" component={InspectionHomeScreen} />}
    {isGranted('Pages.InspectionProperty') && <Tab.Screen name="properties" component={PropertyScreen} />}
    {isGranted('Pages.Form') && <Tab.Screen name="form" component={FormScreen} />}
    <Tab.Screen name="sync" component={SyncScreen} />
    <Tab.Screen name="myReport" component={MyReport} />
  </Tab.Navigator>
);

export default InspectionTabNavigation;
