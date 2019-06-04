import React from "react";
import { Text, View } from "react-native";
import { ListItem } from 'react-native-elements';
import moment from 'moment';


class EventListItems extends React.PureComponent {
  _keyExtractor = (item, index) => index.toString();

  render() {
    if (!this.props.events) {
      return null
    }
    // sort events in descending order
    let sortedEvents = this.props.events.slice().sort((a, b) => new Date(b.date[0]) - new Date(a.date[0]));
    console.log(sortedEvents)
    return (
      <View>
        {sortedEvents.map((item, index) => (
          <ListItem
            key={item.key}
            leftAvatar={{ source: { uri: "data:image/png;base64," + item.e_photo }, rounded: false }}
            title={item.e_title}
            subtitle={moment(item.date, "MM/DD/YYYY").format("MMM Do")}
            contentContainerStyle={{ borderLeftColor: "grey", borderLeftWidth: 1, paddingLeft: 10 }}
          />
        ))
        }
      </View>
    );
  }
}

export default EventListItems;
