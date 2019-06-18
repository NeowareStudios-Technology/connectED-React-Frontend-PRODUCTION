import React from 'react';
import { Image, ImageBackground, View } from "react-native";

import { Icon } from 'expo';

import Colors from '../constants/Colors';

export default class TabBarIcon extends React.Component {
  render() {
    return (
      // <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
      //   <Image
      //     source={require('../assets/OM Icons/menu_highlighted.png')}
      //     style={{ width: 50, height: 50, borderColor: "#999", borderWidth: 22 }}
      //   />
      // </View>

      <Icon.Ionicons
        name={this.props.name}
        size={26}
        // targets the icon background colors, changed to #000 for Mall mockup
        style={{ marginBottom: -3 }} //<--change to '#86939e' #3788E0
        color={this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
      />
    );
  }
}