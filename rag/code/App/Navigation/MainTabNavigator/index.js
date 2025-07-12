/**
 * Created by thienmd on 10/7/20
 */
import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabBarIcon from '../../Components/Layout/TabBarIcon';
import HomeScreen from '../../Screens/HomeScreen';
import useHome from '../../Context/Home/Hooks/UseHome';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  const {
    home: { bottomModules },
  } = useHome();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarLabel: () => undefined,
        tabBarIcon: ({ focused }) => <TabBarIcon screen={route.name} focused={focused} />,
      })}
    >
      <Tab.Screen name="home" component={HomeScreen} />
      {bottomModules.map((module) => (
        <Tab.Screen key={module.screen} name={module.screen} component={module.component} />
      ))}
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
