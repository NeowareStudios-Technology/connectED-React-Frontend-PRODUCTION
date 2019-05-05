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


class EventDetailsTeam extends React.Component {
  constructor(props) {
    super(props);
  }
  calculateRemainingSlots = (item) => {
    const remaining = parseInt(item.capacity)-(parseInt(item.num_pending_attendees)+parseInt(item.num_attendees))
    return remaining;
  }
  render() {
    let item = this.props.event;
    let privacyLabel = item.privacy === "o" ? "Open" : "Private";
    return (
      <ScrollView>
        <Text style={this.styles.title}>{item.e_title}</Text>
        <Text style={{fontSize: 20, marginBottom: 5}}>Volunteer Team</Text>
        {this.calculateRemainingSlots(item) > 0 ?
        <Text style={{color: 'red', marginBottom: 15}}>{this.calculateRemainingSlots(item)} of {item.capacity} slots remaining</Text>        
        : <Text style={{color: 'green', marginBottom: 15}}>All {item.capacity} slots filled!</Text>        
        }
        {item.pending_attendees ? 
        <View>
          <Text style={this.styles.subtitle}>Pending:</Text>
          {item.pending_attendees.map((attendee, index)=>(
            <Text style={this.styles.text} key={index}>{ `\u2022  `}{attendee}</Text>
          ))}
        </View>
        :null}
        <Text>{`\n`}</Text>
        {/* There is no item.attendees -- this is in place for when there is a dataset for attendees that are not pending */}
        {item.attendees ? 
        <View>
          <Text style={this.styles.subtitle}>Confirmed:</Text>
          
          {item.attendees.map((attendee, index)=>(
            <Text style={this.styles.text} key={index}>{ `\u2022  `}{attendee}</Text>
          ))}
        </View>
        :null}
        <Text>{`\n`}</Text> 
        {!item.attendees ? 
        <Text>No attendees have been confirmed by the organizer yet.</Text>  
        :null}
        {!item.pending_attendees ? 
        <Text>No attendees pending.</Text>  
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

export default EventDetailsTeam;
