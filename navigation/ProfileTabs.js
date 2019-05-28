import React from "react";
import { Platform } from "react-native";
import {
  createStackNavigator,
  createBottomTabNavigator
} from "react-navigation";
import TabBarIcon from "../components/TabBarIcon";

import ProfileHomeScreen from "../screens/ProfileHomeScreen";
import ProfileEditScreen from "../screens/ProfileEditScreen";
import EventsHomeScreen from "../screens/EventsHomeScreen";
import EventScreen from "../screens/EventScreen";
import ResetPassword from "../screens/ForgotPasswordScreen";
import PrivacyPolicy from "../screens/PrivacyPolicyScreen";
import EventCreateScreen from "../screens/EventCreateScreen";
import CalendarHomeScreen from "../screens/CalendarHomeScreen";
import TeamsHomeScreen from "../screens/TeamsHomeScreen";

const ProfileHomeStack = createStackNavigator({
  ProfileHome: ProfileHomeScreen,
  ProfileEdit: ProfileEditScreen,
  ResetPassword: ResetPassword,
  PrivacyPolicy: PrivacyPolicy,
});

ProfileHomeStack.navigationOptions = {
  tabBarLabel: "Profile",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-person" : "md-person"}
    />
  )
};

const EventsHomeStack = createStackNavigator({
  EventsHome: EventsHomeScreen,
  EventScreen: EventScreen
});

EventsHomeStack.navigationOptions = {
  tabBarLabel: "Events",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-list" : "md-list"}
    />
  )
};

const CalendarStack = createStackNavigator({
  CalendarHome: CalendarHomeScreen,

});

CalendarStack.navigationOptions = {
  tabBarLabel: "Calendar",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-calendar" : "md-calendar"}
    />
  )
};

const TeamsStack = createStackNavigator({
  TeamsHome: TeamsHomeScreen,

});

TeamsStack.navigationOptions = {
  tabBarLabel: "Teams",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-people" : "md-people"}
    />
  )
};

export default createBottomTabNavigator({
  EventsHomeStack,
  CalendarStack,
  TeamsStack,
  ProfileHomeStack
});
