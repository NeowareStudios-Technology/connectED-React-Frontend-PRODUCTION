import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import ProfileTabs from "./ProfileTabs";
import EventCreateScreen from "../screens/EventCreateScreen";
import TeamCreateScreen from "../screens/TeamCreateScreen";

const transitionConfig = () => {
  return {
    transitionSpec: {
      duration: 750,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true,
    },
    screenInterpolator: sceneProps => {      
      const { layout, position, scene } = sceneProps

      const thisSceneIndex = scene.index
      const width = layout.initWidth

      const translateX = position.interpolate({
        inputRange: [thisSceneIndex - 1, thisSceneIndex],
        outputRange: [width, 0],
      })

      return { transform: [ { translateX } ] }
    },
  }
}

export default createAppContainer(
  createSwitchNavigator({
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    Profile: ProfileTabs,
    EventCreate: EventCreateScreen,
    TeamCreate: TeamCreateScreen,
  },{
    transitionConfig
  })
);
