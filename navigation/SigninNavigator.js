import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import SigninTabs from "./SigninTabs";
import SignUpFlowScreen from "../screens/SignUpFlowScreen";

export default createAppContainer(
  createSwitchNavigator({
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    SignIn: SigninTabs,
    SignUpFlow:{
      screen:SignUpFlowScreen
    }
  })
);
