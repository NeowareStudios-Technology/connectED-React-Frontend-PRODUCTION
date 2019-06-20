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
  constructor(props) {
    super(props);
    this.state = {
      newEvent: null
    }
  }
  componentDidMount() {
    console.log(this.props.event)
    this.setState({ newEvent: this.props.event })
  }
  acceptOrDenyEventAttendee = async (organizer, title, status, attendee) => {
    let token = await User.firebase.getIdToken();
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
          if (response.ok) {
            alert("Thank you for resolving pending requests!")
            // remove attendee from pending. add attendee to attendees if approved
            let event = this.state.newEvent
            event.pending_attendees.splice(event.pending_attendees.indexOf(attendee), 1)
            if (status === "approve") {
              if (typeof event.attendees !== "undefined") {
                event.attendees.push(attendee)
              } else {
                event.attendees = [attendee]
              }
              event.num_attendees += 1
              event.num_pending_attendees -= 1
            }
            this.setState({ newEvent: event })
          }
        })
        .catch(error => { });
    }
  }

  handleClose = () => {
    this.props.onClose(this.state.event)
  }

  render() {
    let item = this.state.newEvent;
    if (!item) return null
    return (
      <>
        <View style={{ flexDirection: "column", flex: 1 }}>
          {/* <View style={{ flex: 3, backgroundColor: "#124b73" }} > */}
          <View style={{ flex: 1, flexDirection: "column" }} >
            <ImageBackground
              source={{
                uri: "data:image/png;base64," + item.e_photo
              }}
              style={{
                width: "100%",
                height: "100%"
              }}
            >
              <View style={{ padding: 12, backgroundColor: 'rgba(255,255,255, 0.3)' }}>
                <TouchableOpacity onPress={this.handleClose}>
                  <Icon.Ionicons
                    style={{
                      color: "#000",
                      textShadowOffset: { width: 0.5, height: 0.5 },
                      textShadowRadius: 2,
                      textShadowColor: '#fff',
                    }}
                    name="md-arrow-back"
                    size={32}
                  />
                </TouchableOpacity>
              </View>

            </ImageBackground>

          </View>
          {/* </ImageBackground> */}
          {/* </View> */}
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
