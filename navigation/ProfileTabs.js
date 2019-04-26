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
import EventCreateScreen from "../screens/EventCreateScreen";

const ProfileHomeStack = createStackNavigator({
  ProfileHome: ProfileHomeScreen,
  ProfileEdit: ProfileEditScreen
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

export default createBottomTabNavigator({
  EventsHomeStack,
  ProfileHomeStack
});
