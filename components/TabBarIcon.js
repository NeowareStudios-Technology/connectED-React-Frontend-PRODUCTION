import React from 'react';
import { Icon } from 'expo';

import Colors from '../constants/Colors';

export default class TabBarIcon extends React.Component {
  render() {
    return (
      <Icon.Ionicons
        name={this.props.name}
        size={26}
        // targets the icon background colors, changed to #000 for Mall mockup
        style={{ marginBottom: -3, backgroundColor: '#000' }} //<--change to '#86939e' #3788E0
        color={this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
      />
    );
  }
}