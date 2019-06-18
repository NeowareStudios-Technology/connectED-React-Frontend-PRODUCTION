import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Platform,
  Image,
  ImageBackground,
  BackHandler
} from "react-native";
import { Button, Card } from "react-native-elements";
import { Icon } from "expo";
import moment from "moment";
import EventDetailsInfo from "./EventDetailsInfo";
import EventDetailsTeam from "./EventDetailsTeam";
import EventDetailsUpdates from "./EventDetailsUpdates";
import User from "../components/User";
import { registerUser, checkUserInOrOut, deregisterUser } from "../constants/API";


class EventDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 0,
      isSignedIn: false,
      isRegistered: 0,
      newEvent: null,
      user: null
    };
  }

  async initializeState() {
    let user = await User.isLoggedIn();
    if (user) {
      this.setState({
        user: user,
        isRegistered: parseInt(this.props.event.is_registered)
      }, () => this.updateSignInStatus());
    }
    return true;
  }

  setActiveTab = index => {
    this.setState({
      activeTab: index
    });
  };

  // calls api to register user for event
  volunteer = async () => {
    // User is not registered
    if (this.state.isRegistered !== 0) {
      alert('You are already registered for this event')
      return
    }
    const { event } = this.props
    const { user } = this.state

    let response = await registerUser(event.e_organizer, event.e_orig_title)
    if (!response.error) {
      let newEvent = this.state.newEvent

      if (event.privacy === "o") {
        // Open event. Set registered status, add user to attendees and increment number of attendees
        newEvent.is_registered = "1"
        newEvent.num_attendees += 1
        newEvent.attendees.push(user.email)
        newEvent.teams.push("-") // TODO: use actual team if known and not the dummy/null team of "-"
        this.setState({ isRegistered: 1, newEvent })
      } else {
        // private event. set registered status, add user to pending list, increment number of pending
        newEvent.is_registered = "-1"
        newEvent.num_pending_attendees += 1
        newEvent.pending_attendees.push(user.email)
        this.setState({ isRegistered: -1, newEvent })
      }
    } else {
      alert(response.error.message)
    }
  };

  // calls api to de-register user from event
  deregister = async () => {
    // User is not registered
    if (this.state.isRegistered === 0) {
      alert('You are already de-registered from the event')
      return
    }
    const { event } = this.props
    const { user } = this.state
    let newEvent = this.state.newEvent

    let response = await deregisterUser(event.e_organizer, event.e_orig_title)
    if (!response.error) {
      newEvent.is_registered = "0"
      if (event.privacy === "o") {
        // open event - get index of user and remove from attendee list and teams. decrement number of attendees
        const i = event.attendees.indexOf(user.email)
        newEvent.attendees.splice(i, 1)
        newEvent.teams.splice(i, 1)
        newEvent.num_attendees -= 1
      } else {
        // private event - get index of user and remove from pending list. decrement pending
        const i = event.pending_attendees.indexOf(user.email)
        newEvent.num_pending_attendees -= 1
        newEvent.pending_attendees.splice(i, 1)
      }
      this.setState({ isRegistered: 0, newEvent })

    } else {
      alert(response.error.message)
    }
  }

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
      let { response, error } = await checkUserInOrOut(eventName, email)
      if (error) {
        alert("Server error: " + error.message)
        return
      }
      alert("Success! " + response)

      // update newEvent data
      let { newEvent, user } = this.state

      if (typeof newEvent.signed_in_attendees !== 'undefined') {
        let i = newEvent.signed_in_attendees.indexOf(user.email)
        // User was already signed in. sign out user - remove from signed_in_attendees. add to signed_out_attendees.
        if (i !== -1) {
          newEvent.signed_in_attendees.splice(i, 1)
          if (typeof newEvent.signed_out_attendees) {
            newEvent.signed_out_attendees.push(user.email)
          } else {
            newEvent.signed_out_attendees = [user.email]
          }
        } else {
          // user was not in signed in list. sign in user - add user to signed_in_attendees. remove user from signed_out_attendees if applicable.
          newEvent.signed_in_attendees.push(user.email)
          if (typeof newEvent.signed_out_attendees !== 'undefined') {
            let j = newEvent.signed_out_attendees.indexOf(user.email)
            if (j !== -1) {
              newEvent.signed_out_attendees.splice(j, 1)
            }
          }
        }
      } else {
        // no signed in attendees. create signed in add user to it. remove user from signed out list if applicable
        newEvent.signed_in_attendees = [user.email]
        if (typeof newEvent.signed_out_attendees !== 'undefined') {
          let i = newEvent.signed_out_attendees.indexOf(user.email)
          if (i !== -1) {
            newEvent.signed_out_attendees.splice(i, 1)
          }
        }
      }

      this.setState({ isSignedIn: !this.state.isSignedIn, newEvent })
    } catch (error) { }
  };

  handleBackPress = () => {
    this.onClose()
    return true
  }
  onClose = () => {
    const event = this.state.newEvent
    this.props.onClose(event)
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    console.log(this.props.event)
    this.setState({ newEvent: this.props.event })
    this.initializeState()
  }

  componentWillUnmount() {
    this.backHandler.remove()
  }

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
                  <TouchableOpacity onPress={this.onClose}>
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
                  <EventDetailsTeam event={this.state.newEvent} />
                </>
              )}
              {this.state.activeTab === 2 && (
                <>
                  <EventDetailsUpdates event={event} />
                </>
              )}
            </View>
            <>
              <View style={{ flex: 6, paddingBottom: 12 }}>
                {/* Info, Team, and Updates buttons */}
                <View style={{ flexDirection: "row", justifyContent: "center", marginVertical: 12 }}>
                  <View style={{ flex: 1, flexDirection: "row", justifyContent: "center" }} >
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
                  <View style={{ flex: 1, flexDirection: "row", justifyContent: "center" }} >
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
                  <View style={{ flex: 1, flexDirection: "row", justifyContent: "center" }} >
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
                  {this.state.isRegistered === -1 && (
                    <>
                      <Button title="Pending..." />
                    </>
                  )}
                  {this.state.isRegistered === 0 && (
                    <>
                      <Button
                        onPress={this.volunteer}
                        title="Volunteer"
                      // title={parseInt(event.num_attendees) < parseInt(event.capacity) ? "Volunteer" : "Event at Capacity"}
                      // disabled={!(parseInt(event.num_attendees) < parseInt(event.capacity))}
                      />
                    </>
                  )}
                  {this.state.isRegistered === 1 && (
                    <View style={{ flexDirection: "row" }}>
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
