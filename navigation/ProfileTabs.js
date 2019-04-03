import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import TabBarIcon from '../components/TabBarIcon';

import ProfileHomeScreen from '../screens/ProfileHomeScreen';

const ProfileHomeStack = createStackNavigator({
  ProfileHome: ProfileHomeScreen
});

ProfileHomeStack.navigationOptions = { 
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-log-in' : 'md-log-in'}
    />
  ),
}; 

export default createBottomTabNavigator({
  ProfileHomeStack
});
