import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';

const SignInStack = createStackNavigator({
  SignIn: SignInScreen
});

SignInStack.navigationOptions = { 
  tabBarLabel: 'Sign In',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-log-in' : 'md-log-in'}
    />
  ),
}; 

const SignUpStack = createStackNavigator({
  SignUp: SignUpScreen,
});

SignUpStack.navigationOptions = {
  tabBarLabel: 'Sign Up',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-person-add' : 'md-person-add'}
    />
  ),
};

export default createBottomTabNavigator({
  SignInStack,
  SignUpStack
});
