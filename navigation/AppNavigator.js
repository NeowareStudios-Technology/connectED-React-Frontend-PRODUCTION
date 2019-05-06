import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";

import MainTabNavigator from "./MainTabNavigator";
import SigninNavigator from "./SigninNavigator";
import HomeScreen from "../screens/HomeScreen";
import ProfileNavigator from "./ProfileNavigator";

export default createAppContainer(
  createSwitchNavigator({
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    Main: HomeScreen,
    SignIn: SigninNavigator,
    ProfileNavigator: ProfileNavigator
  })
);
