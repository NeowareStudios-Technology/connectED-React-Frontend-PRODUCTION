import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";

import MainTabNavigator from "./MainTabNavigator";
import SigninNavigator from "./SigninNavigator";
import HomeScreen from "../screens/HomeScreen";
import ProfileNavigator from "./ProfileNavigator";
import AuthLoadingScreen from "../screens/AuthLoadingScreen"

export default createAppContainer(
  createSwitchNavigator({
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    AuthLoading: AuthLoadingScreen,
    Main: HomeScreen,
    SignIn: SigninNavigator,
    ProfileNavigator: ProfileNavigator
  }, {
    initialRouteName: "AuthLoading"
  })
);
