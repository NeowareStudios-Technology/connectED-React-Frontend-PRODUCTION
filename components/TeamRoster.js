import React from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  Image,
  ImageBackground,
  ActivityIndicator
} from "react-native";


class TeamRoster extends React.Component {
  constructor(props) {
    super(props);
  }
  calculateRemainingSlots = (item) => {
    const remaining = parseInt(item.capacity)-(parseInt(item.num_pending_attendees)+parseInt(item.num_attendees))
    return remaining;
  }
    render() {
    let item = this.props.team;
    console.log(`ITEM`)
    console.log(item)
    let privacyLabel = item.privacy === "o" ? "Open" : "Private";
    return (
      <ScrollView>
        <Text style={this.styles.title}>{item.t_name}</Text>
        <Text style={{fontSize: 20, marginBottom: 5}}>Team Roster</Text>
       
  


      </ScrollView>
    );
  }
  styles={
    title: {
      fontSize: 26,
      marginBottom: 5,
      fontWeight: 'bold'
    },
    subtitle: {
      fontSize: 18,
      marginBottom: 5,
      fontWeight: 'bold'
    },
    text: {
      fontSize: 16,
      lineHeight: 24
    }
  }
}

export default TeamRoster;
