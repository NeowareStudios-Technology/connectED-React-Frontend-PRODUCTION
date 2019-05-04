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

  render() {
    let item = this.props.event;
    let privacyLabel = item.privacy === "o" ? "Open" : "Private";
    return (
      <ScrollView>
        <Text style={this.styles.title}>Volunteer Team</Text>
        <Text style={this.styles.subtitle}>Team Capacity:{' '}{item.capacity}</Text>
        <Text style={this.styles.subtitle}>Remaining Open Slots:{' '}{parseInt(item.capacity)-(parseInt(item.num_pending_attendees)+parseInt(item.num_attendees) )}</Text>
        
        {item.pending_attendees ? 
        <View>
          <Text style={this.styles.subtitle}>Pending:{' '}{item.num_pending_attendees}</Text>

          {item.pending_attendees.map((attendee, index)=>(
            <Text style={this.styles.text} key={index}>{ `\u2022  `}{attendee}</Text>
          ))}

        </View>
        :null}

        <Text>{`\n`}</Text>
        {/* There is no item.attendees -- this is in place for when there is a dataset for attendees that are not pending */}
        {item.attendees ? 
        <View>
          <Text style={this.styles.subtitle}>Confirmed:{' '}{item.attendees}</Text>
          
          {item.attendees.map((attendee, index)=>(
            <Text style={this.styles.text} key={index}>{ `\u2022  `}{attendee}</Text>
          ))}
        </View>
        :null}

      </ScrollView>
    );
  }
  styles={
    title: {
      fontSize: 30,
      marginBottom: 15
    },
    subtitle: {
      fontSize: 20,
      marginBottom: 5
    },
    text: {
      fontSize: 16,
      lineHeight: 24
    }
  }
}

export default EventDetailsTeam;
