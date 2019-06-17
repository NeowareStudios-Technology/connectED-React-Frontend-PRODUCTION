import React from "react";
import { Text, View, ScrollView } from "react-native";
import { ListItem, Overlay, Button } from 'react-native-elements';
import Styles from "../constants/Styles";
import { sortEventsDesc, sortEventsAsc } from '../constants/Utils'
import moment from 'moment';

/**
 * Description: Displays list of events
 * Props:
 *  events - Array of events to display
 *  sort - String of sorting order
 *    - "asc": Sort by event date in ascending order (oldest to newest)
 *    - "desc": Sort by event date in descending order (newest to oldest)
 *  overlay - method to call in the parent class in order to retrieve the selected event
 * */

class EventListItems extends React.PureComponent {

  // Method to handle if parent passes the overlay prop
  triggerOverlay = (item) => {
    if (this.props.overlay && item) {
      return this.props.overlay(item)
    }
    return null
  }

  render() {
    const { events, sort } = this.props
    if (!events) {
      return null
    }
    let sortedEvents
    switch (sort) {
      case "asc":
        sortedEvents = sortEventsAsc(events)
        break;
      case "desc":
        sortedEvents = sortEventsDesc(events)
        break;
      default:
        sortedEvents = events
        break;
    }

    return (
      <ScrollView>
        {sortedEvents.map((item, index) => (
          <View key={item.key || index}>
            <ListItem
              leftAvatar={{ source: { uri: "data:image/png;base64," + item.e_photo }, rounded: false }}
              title={item.e_title}
              subtitle={moment(item.date, "MM/DD/YYYY").format("MMM Do")}
              containerStyle={Styles.eventListing}
              contentContainerStyle={{ borderLeftColor: "grey", borderLeftWidth: 1, paddingLeft: 10 }}
              onPress={() => this.triggerOverlay(item)}
            />

          </View>
        ))}
      </ScrollView>

    );
  }
}

export default EventListItems;
