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
import { Button, Card } from "react-native-elements";
import { Icon } from "expo";
import moment from "moment";
import AppData from "../constants/Data";

class EventDetailsTeam extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let item = this.props.event;
    let privacyLabel = item.privacy === "o" ? "Open" : "Private";
    return (
      <>
        <Text>Event Team</Text>
        <Text>Pending:</Text>
        {item.pending_attendees.map((attendee, index)=>(
          <Text key={index}>{attendee}</Text>
        ))}
      </>
    );
  }
}

export default EventDetailsTeam;
