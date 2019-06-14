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
import EventDetailsInfo from "./EventDetailsInfo";
import EventDetailsTeam from "./EventDetailsTeam";
import EventDetailsUpdates from "./EventDetailsUpdates";
import User from "../components/User";
import API from "../constants/API";


class EventDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 0,
      isSignedIn: false,
      isRegistered: 0
    };
  }
  componentWillUnmount() {
    // TODO: pass isRegistered state and isSignedIn state to parent to update event
  }

  async initializeState() {
    let user = await User.isLoggedIn();
    if (user) {
      this.setState({
        user: user,
        isRegistered: this.props.event.is_registered
      }, () => this.updateSignInStatus());
    }
    return true;
  }

  componentDidMount() {
    console.log(this.props.event)
    this.initializeState()
  }

  setActiveTab = index => {
    this.setState({
      activeTab: index
    });
  };

  volunteer = async () => {
    const { event } = this.props
    if (
      event &&
      !(typeof event.is_registered !== "undefined" &&
        event.is_registered !== "0")
    ) {
      let response = await API.register(event.e_organizer, event.e_orig_title, "both")
      console.log(response)
      if (!response.error) {
        if (event.privacy === "o") {
          this.setState({ isRegistered: 1 })
        } else {
          this.setState({ isRegistered: -1 })
        }
      } else {
        alert(response.error.message)
      }
    }
  };

  deregister = async () => {
    const { event } = this.props

    if (this.props.event) {
      let isRegistered = false;
      if (
        typeof this.props.event.is_registered !== "undefined" &&
        this.props.event.is_registered !== "0"
      ) {
        isRegistered = true;
      }
      if (isRegistered) {
        let token = await User.firebase.getIdToken();

        if (token) {
          let organizerEmail = this.props.event.e_organizer;
          let eventOrigName = this.props.event.e_orig_title;
          let url = `https://connected-dev-214119.appspot.com/_ah/api/connected/v1/events/${organizerEmail}/${eventOrigName}/registration`;
          try {
            fetch(url, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
              }
            })
              .then(response => {
                if (response.ok) {
                  // TODO: remove event from event list so history re-renders
                  this.hideDetails()
                }
              })
              .catch(error => { });
          } catch (error) { }
        }
      }
    }
  };

  updateSignInStatus = () => {
    let status = this.checkSignIn()
    if (this.state.isSignedIn !== status) {
      this.setState({ isSignedIn: status })
    }
  }

  // Checks if user email is included in the event signed_in_attendees array
  // returns Boolean - true if signed in. Otherwise, false
  checkSignIn = () => {
    if (!this.state.user) {
      return false
    }
    let userEmail = this.state.user.email
    let signedInAttendees = this.props.event.signed_in_attendees
    if (!signedInAttendees) {
      return false
    }
    return signedInAttendees.includes(userEmail)
  };

  checkInOrOut = async (eventName, email) => {
    try {
      let { response, error } = await API.checkInOrOut(eventName, email)
      if (error) {
        alert("Server error: " + error.message)
        return
      }
      alert("Success! " + response)
      this.setState({ isSignedIn: !this.state.isSignedIn })
    } catch (error) {
    }
  };

  render() {
    const { event } = this.props;
    let privacyLabel = event.privacy === "o" ? "Open" : "Private";
    let eventDate = moment(event.date, "MM/DD/YYYY");
    let environmentImage =
      event.env === "o"
        ? require("../assets/images/environment-outdoor-filled.png")
        : require("../assets/images/environment-outdoor-outline.png");

    return (
      <>
        <View style={{ flexDirection: "column", flex: 1 }}>
          <View style={{ flex: 3, backgroundColor: "#124b73" }}>
            <ImageBackground source={{ uri: "data:image/png;base64," + event.e_photo }} style={{ width: "100%", height: "100%" }}>
              <View style={{ flex: 1, paddingBottom: 12, flexDirection: "column" }}>
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
                <View
                  style={{
                    flexDirection: "row",
                    flex: 3,
                    paddingTop: 0,
                    paddingHorizontal: 12
                  }}
                >
                  <View style={{ flex: 2 }} />
                  <View
                    style={{
                      flex: 1,
                      alignContent: "center",
                      backgroundColor: "#ffffff"
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "bold",
                        color: "#000000",
                        fontSize: 18,
                        paddingVertical: 6,
                        textAlign: "center"
                      }}
                    >
                      {eventDate.format("MMM") + " " + eventDate.date()}
                    </Text>
                  </View>
                </View>
              </View>
            </ImageBackground>
          </View>
          <View style={{ flex: 10, flexDirection: "column", justifyContent: "flex-end", paddingVertical: 12, paddingHorizontal: 12 }} >
            <View style={{ flex: 20 }}>
              {this.state.activeTab === 0 && (
                <>
                  <EventDetailsInfo event={event} />
                </>
              )}
              {this.state.activeTab === 1 && (
                <>
                  <EventDetailsTeam event={event} />
                </>
              )}
              {this.state.activeTab === 2 && (
                <>
                  <EventDetailsUpdates event={event} />
                </>
              )}
            </View>
            <>
              <View
                style={{
                  flex: 6,
                  paddingBottom: 12
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    marginBottom: 12
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "center"
                    }}
                  >
                    <Button
                      type={this.state.activeTab === 0 ? "solid" : "outline"}
                      onPress={() => {
                        this.setActiveTab(0);
                      }}
                      containerStyle={{
                        alignContent: "center",
                        justifyContent: "center"
                      }}
                      buttonStyle={{
                        padding: 5,
                        borderRadius: 400,
                        height: 40,
                        width: 40
                      }}
                      icon={
                        <Icon.Ionicons
                          style={{
                            color: this.state.activeTab === 0 ? "#fff" : "#ccc"
                          }}
                          name={
                            Platform.OS === "ios"
                              ? "ios-information"
                              : "md-information"
                          }
                          size={32}
                        />
                      }
                    />
                  </View>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "center"
                    }}
                  >
                    <Button
                      onPress={() => {
                        this.setActiveTab(1);
                      }}
                      type={this.state.activeTab === 1 ? "solid" : "outline"}
                      containerStyle={{
                        alignContent: "center",
                        justifyContent: "center"
                      }}
                      buttonStyle={{
                        padding: 5,
                        borderRadius: 400,
                        height: 40,
                        width: 40
                      }}
                      icon={
                        <Icon.Ionicons
                          style={{
                            color: this.state.activeTab === 1 ? "#fff" : "#ccc"
                          }}
                          name={
                            Platform.OS === "ios" ? "ios-people" : "md-people"
                          }
                          size={32}
                        />
                      }
                    />
                  </View>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "center"
                    }}
                  >
                    <Button
                      type={this.state.activeTab === 2 ? "solid" : "outline"}
                      onPress={() => {
                        this.setActiveTab(2);
                      }}
                      containerStyle={{
                        alignContent: "center",
                        justifyContent: "center"
                      }}
                      buttonStyle={{
                        padding: 5,
                        borderRadius: 400,
                        height: 40,
                        width: 40
                      }}
                      icon={
                        <Icon.Ionicons
                          style={{
                            color: this.state.activeTab === 2 ? "#fff" : "#ccc"
                          }}
                          name={Platform.OS === "ios" ? "ios-more" : "md-more"}
                          size={32}
                        />
                      }
                    />
                  </View>
                </View>
                <View style={{ justifyContent: "flex-end" }}>
                  {this.state.isRegistered === "-1" && (
                    <>
                      <Button title="Pending..." />
                    </>
                  )}
                  {this.state.isRegistered === "0" && (
                    <>
                      <Button
                        onPress={this.volunteer}
                        title="Volunteer"
                      />
                    </>
                  )}
                  {this.state.isRegistered === "1" && (
                    <View style={{ flexDirection: "row", }}>
                      <Button
                        containerStyle={{ width: '50%' }}
                        onPress={this.deregister}
                        title="Deregister"
                      />
                      <Button
                        containerStyle={{ width: '50%' }}
                        buttonStyle={{ backgroundColor: 'green' }}
                        onPress={() => { this.checkInOrOut(event.e_orig_title, event.e_organizer) }}
                        title={this.state.isSignedIn ? "Check out" : "Check in"}

                      />
                    </View>
                  )}
                </View>
              </View>
            </>
          </View>
        </View>
      </>
    );
  }
}

export default EventDetails;
