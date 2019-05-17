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
              <Text style={{fontSize: 18, marginBottom: 5, fontWeight: "bold"}}>Leaders</Text>
              :
              <Text style={{fontSize: 18, marginBottom: 5, fontWeight: "bold"}}>Lead</Text>
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
            <Text style={{fontSize: 18, marginBottom: 5, fontWeight: "bold"}}>Leadddddd</Text>
            <Text style={this.styles.text} >{ `\u2022  `}{item.t_organizer}{`\n`}</Text>
          </View>
        }
        {item.t_members ? 
          <View>
            <Text style={{fontSize: 18, marginBottom: 5, fontWeight: "bold"}}>Members</Text>
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
