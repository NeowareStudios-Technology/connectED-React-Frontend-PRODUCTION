import React from "react";
import { Text, View } from "react-native";
import { ListItem } from 'react-native-elements';
import moment from 'moment';

/**
 * Description: Displays list of events
 * Props:
 *  events - Array of events to display
 *  sort - String of sorting order
 *    - "asc": Sort by event date in ascending order (oldest to newest)
 *    - "desc": Sort by event date in descending order (newest to oldest)
 *  
 * */ 

class EventListItems extends React.Component {

  sortDesc = (events) => events.slice().sort((a, b) => new Date(b.date[0]) - new Date(a.date[0]));
  sortAsc = (events) => events.slice().sort((a, b) => new Date(a.date[0]) - new Date(b.date[0]));

  render() {
    const { events, sort } = this.props
    if (!events) {
      return null
    }

    let sortedEvents
    switch (sort) {
      case "asc":
        sortedEvents = this.sortAsc(events)
        break;
      case "desc":
        sortedEvents = this.sortDesc(events)
        break;
      default:
        sortedEvents = events
        break;
    }
    return (
      <View>
        {sortedEvents.map((item, index) => (
          <ListItem
            key={item.key || index}
            leftAvatar={{ source: { uri: "data:image/png;base64," + item.e_photo }, rounded: false }}
            title={item.e_title}
            subtitle={moment(item.date, "MM/DD/YYYY").format("MMM Do")}
            contentContainerStyle={{ borderLeftColor: "grey", borderLeftWidth: 1, paddingLeft: 10 }}
            onPress={() => console.log("clicked " + item.e_title)}
          />
        ))
        }
      </View>
    );
  }
}

export default EventListItems;
