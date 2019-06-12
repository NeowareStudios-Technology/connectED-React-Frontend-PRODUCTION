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
import { Button } from "react-native-elements";
import { Icon } from "expo";
import User from "../components/User";


class AdminEventDetails extends React.Component {

  acceptOrDenyEventAttendee = async (organizer, title, status, attendee) => {
    let token = await User.firebase.getIdToken();
    console.log(organizer, title, status, attendee)
    if (token) {
      let url =
        `https://connected-dev-214119.appspot.com/_ah/api/connected/v1/events/${organizer}/${title}/${status}`;
        let bodyData = JSON.stringify({
          pending_attendee: attendee
        });
      // status should either be "approve" or "deny"
      fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        },
        body: bodyData
      })
        .then(response => {
          console.log("accept/deny attendee", response)
          if (response.ok) {
            alert("Thank you for resolving pending requests!")
          }
        })
        .catch(error => { });
    }
  }

  render() {
    let item = this.props.event;
    return (
      <>
        <View style={{ flexDirection: "column", flex: 1 }}>
          <View style={{ flex: 3, backgroundColor: "#124b73" }} >
            <ImageBackground
              source={{
                uri: "data:image/png;base64," + item.e_photo
              }}
              style={{
                width: "100%",
                height: "100%"
              }}
            >
              <View style={{ flex: 1, paddingBottom: 12, flexDirection: "column" }} >
                <View style={{ flex: 5, padding: 6, paddingLeft: 9 }}>
                  <TouchableOpacity onPress={this.props.onClose}>
                    <Icon.Ionicons
                      style={{
                        color: "#fff",
                        textShadowOffset: { width: 0.5, height: 0.5 },
                        textShadowRadius: 2,
                        textShadowColor: '#000',
                      }}
                      name={
                        Platform.OS === "ios"
                          ? "ios-close-circle"
                          : "md-close-circle"
                      }
                      size={32}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </ImageBackground>
          </View>
          {item &&
            <View style={styles.container}>
              <Text style={styles.title}>{item.e_title}</Text>
              <Text style={styles.header}>General Info</Text>
              <Text>{item.date[0]} {item.start[0]}</Text>
              <Text>{item.street} {`\n`}{item.city}, {item.state} {item.zip_code}</Text>
              <Text style={styles.header}>Event Roster Info</Text>
              <Text style={styles.sub}>Event Capacity: {item.capacity}</Text>
              <Text style={styles.sub}>Registered: {item.num_attendees}</Text>
              <Text style={styles.sub}>Pending: {item.num_pending_attendees}</Text>
              {item.num_attendees > 0 &&
                <View>
                  <Text style={styles.header}>Attending Volunteers</Text>
                  {item.attendees.map((a, index) => (
                    <View key={index} style={{ flexDirection: "row" }}>
                      <Text>{a}</Text>
                    </View>

                  ))}

                </View>
              }
              {item.num_pending_attendees > 0 &&
                <View>
                  <Text style={styles.header}>Pending Volunteers</Text>
                  {item.pending_attendees.map((a, index) => (
                    <View key={index} style={{ flexDirection: "row" }}>
                      <Text>{a}</Text>
                      <Button
                        onPress={() => this.acceptOrDenyEventAttendee(item.e_organizer, item.e_orig_title, "approve", a)}
                        title="Accept"
                        color="green"
                        accessibilityLabel="Accept volunteer to this Event"
                      />
                      <Button
                        onPress={() => this.acceptOrDenyEventAttendee(item.e_organizer, item.e_orig_title, "deny", a)}
                        title="Deny"
                        color="red"
                        accessibilityLabel="Deny volunteer to this Event"
                      />
                    </View>
                  ))}
                </View>
              }
            </View>
          }
        </View>
      </>
    );
  }
}

styles = {
  container: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
    paddingBottom: 20,
    fontSize: 16
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    paddingBottom: 5
  },
  sub: {
    fontSize: 16,
    fontWeight: "bold",
    paddingBottom: 5,
    paddingTop: 5,
  },
  header: {
    backgroundColor: "#eee",
    paddingTop: 5,
    paddingBottom: 5,
    textAlign: "center"
  }

}

export default AdminEventDetails;
