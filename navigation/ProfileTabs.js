import React from "react";
import { Platform } from "react-native";
import {
  createStackNavigator,
  createBottomTabNavigator
} from "react-navigation";
import TabBarIcon from "../components/TabBarIcon";

import ProfileHomeScreen from "../screens/ProfileHomeScreen";
import ProfileEditScreen from "../screens/ProfileEditScreen";

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

export default createBottomTabNavigator({
  ProfileHomeStack
});
