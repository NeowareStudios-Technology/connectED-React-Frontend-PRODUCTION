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
        <Text style={this.styles.title}>{`${item.t_name} Roster`}</Text>
        {/* <Text style={{fontSize: 18, marginBottom: 5, fontWeight: "bold"}}>Lead</Text>
        <Text style={this.styles.text} >{ `\u2022  `}{item.t_organizer}{`\n`}</Text> */}
        {item.t_leaders ? 
          <View>
            {item.t_leaders.length > 1 ? 
              <Text style={this.styles.subtitle}>Leaders</Text>
              :
              <Text style={this.styles.subtitle}>Lead</Text>
            }
            {item.t_leaders.map((leader, index)=>(
              <View key={index}>
                {leader !== "" ?
                <Text style={this.styles.text} key={index}>{ `\u2022  `}{leader}</Text>
                :null}
              </View>
            ))}
          </View>
        :
          <View>
            <Text style={this.styles.subtitle}>Organizer</Text>
            <Text style={this.styles.text} >{ `\u2022  `}{item.t_organizer}{`\n`}</Text>
          </View>
        }
        {item.t_members ? 
          <View>
            <Text style={this.styles.subtitle}>Members</Text>
            {item.t_members.map((member, index)=>(
              <Text style={this.styles.text} key={index}>{ `\u2022  `}{member}</Text>
            ))}
          </View>
        :null}
  


      </ScrollView>
    );
  }
  styles={
    title: {
      fontWeight: "bold",
      fontSize: 28,
      marginBottom: 5,
      marginTop: 10
    },
    subtitle: {
      fontSize: 20,
      marginBottom: 5,
      marginTop: 5,
      fontWeight: 'bold'
    },
    text: {
      fontSize: 18,
      lineHeight: 27,
    }
  }
}

export default TeamRoster;
