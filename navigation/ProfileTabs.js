import React from "react";
import { Platform, Image, View } from "react-native";
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
import EventCreateScreen from "../screens/EventCreateScreen";
import CalendarHomeScreen from "../screens/CalendarHomeScreen";
import TeamsHomeScreen from "../screens/TeamsHomeScreen";

const ProfileHomeStack = createStackNavigator({
  ProfileHome: ProfileHomeScreen,
  ProfileEdit: ProfileEditScreen,
  ResetPassword: ResetPassword
});

ProfileHomeStack.navigationOptions = {
  tabBarLabel: " ",  // "Profile", changed for Oviedo Mall Mockup
  tabBarIcon: ({ focused }) => (
    
    <View>
      <Image
        source={require('../assets/OMIcons/menu_grey.png')}
        style={{ width: 25, height: 20, marginTop: 5 }}
      />
    </View>
   
    // <TabBarIcon
    //   focused={focused}
    //   name={Platform.OS === "ios" ? "ios-person" : "md-person"}
    // />
  )
};

const EventsHomeStack = createStackNavigator({
  EventsHome: EventsHomeScreen,
  EventScreen: EventScreen
});

EventsHomeStack.navigationOptions = {
  tabBarLabel: " ",  // "Events", changed for Oviedo Mall Mockup
  tabBarIcon: ({ focused }) => (

    <View>
      <Image
        source={require('../assets/OMIcons/smartphone_highlighted.png')}
        style={{ width: 25, height: 30 }}
      />
    </View>

    // <TabBarIcon
    //   focused={focused}
    //   name={Platform.OS === "ios" ? "ios-list" : "md-list"}
    // />
  )
};

const CalendarStack = createStackNavigator({
  CalendarHome: CalendarHomeScreen,

});

CalendarStack.navigationOptions = {
  tabBarLabel: " ", // "Calendar", changed for Oviedo Mall Mockup
  tabBarIcon: ({ focused }) => (
    
    <View>
      <Image
        source={require('../assets/OMIcons/calendar_grey.png')}
        style={{ width: 30, height: 30 }}
      />
    </View>
    
    // <TabBarIcon
    //   focused={focused}
    //   name={Platform.OS === "ios" ? "ios-calendar" : "md-calendar"}
    // />
  )
};

const TeamsStack = createStackNavigator({
  TeamsHome: TeamsHomeScreen,

});

TeamsStack.navigationOptions = {
  tabBarLabel: " ", // "Teams", changed for Oviedo Mall
  tabBarIcon: ({ focused }) => (

    <View>
      <Image
        source={require('../assets/OMIcons/map_grey.png')}
        style={{ width: 30, height: 30 }}
      />
    </View>

    // <TabBarIcon
    // focused={focused}
    // name={Platform.OS === "ios" ? "ios-people" : "md-people"}      
    // />
  )
};

export default createBottomTabNavigator({
  EventsHomeStack,
  CalendarStack,
  TeamsStack,
  ProfileHomeStack
});
