import React from "react";
import { Text, StyleSheet, View } from "react-native";
import { ListItem } from 'react-native-elements';
import moment from 'moment';


class ProfileHistory extends React.Component {
  render() {
    if (!this.props.events) {
      return null
    }
    // sort events in descending order
    let sortedEvents = this.props.events.slice().sort((a, b) => new Date(b.date[0]) - new Date(a.date[0]));
    return (
      <>
        <View style={styles.container}>
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Your past participation:</Text>
            <View>
              {sortedEvents.map((event) => (
                <>
                  <ListItem
                    key={event.key}
                    leftAvatar={{ source: { uri: "data:image/png;base64," + event.e_photo }, rounded: false }}
                    title={event.e_title}
                    subtitle={moment(event.date, "MM/DD/YYYY").format("MMM Do")}
                    contentContainerStyle={{ borderLeftColor: "grey", borderLeftWidth: 1, paddingLeft: 10 }}
                  />
                </>
              ))
              }
            </View>
          </View>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 6,
    paddingHorizontal: 12
  },
  section: {
    marginBottom: 12
  },
  sectionHeader: {
    fontSize: 16,
    color: "#b0b0b0",
    marginBottom: 6
  }
});
export default ProfileHistory;
