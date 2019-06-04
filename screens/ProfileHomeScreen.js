import React from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  LayoutAnimation,
  Dimensions,
  Picker
} from "react-native";
import { Avatar, Button, Divider, ButtonGroup } from "react-native-elements";
import Sequencer from "../components/Sequencer";
import User from "../components/User";
import ProfileInfo from "../components/ProfileInfo";
import ProfileHistory from "../components/ProfileHistory";
import ProfileCreated from "../components/ProfileCreated";
import EventListItems from "../components/EventListItems";
import { Icon } from "expo";
import Colors from "../constants/Colors";
import moment from 'moment';

let screenHeight = Dimensions.get("window").height - 50; // accounts for bottom navigation
let screenWidth = Dimensions.get("window").width;

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);

    this.state = {
      user: null,
      events: null,
      createdEvents: null, // events created by user
      pastEvents: null, // past events the user has volunteered for
      currentEvents: null,
      futureEvents: null,
      activeTab: 0,
      loading: true
    };
  }
  updateUser = (user) => {
    this.setState({ user: user })
  }

  // loads any events the user created and sorts by date
  loadUserEvent = async (eventName, index, callback) => {
    let token = await User.firebase.getIdToken();
    if (token) {
      try {
        let url =
          "https://connected-dev-214119.appspot.com/_ah/api/connected/v1/events/" +
          eventName;
        fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token
          }
        }).then(response => {
          if (response.ok) {
            try {
              let responseData = JSON.parse(response._bodyText);
              if (responseData) {
                let createdEvents = []
                // keep state immutable by using slice to return new array
                if (this.state.createdEvents) {
                  createdEvents = this.state.createdEvents.slice();
                }
                let event = responseData;
                createdEvents.push(event);
                this.setState(
                  {
                    createdEvents: createdEvents,
                    loading: false
                  },
                  () => {
                    callback();
                  }
                );

              }
            } catch (error) { }
          }
          else {
            callback();
          }
        });
      } catch (error) { }
    }
  };

  // Loads and filters registered events to only include past events sorted by date 
  loadPastEvent = async (eventName, index, callback) => {
    let token = await User.firebase.getIdToken();
    if (token) {
      try {
        let url =
          "https://connected-dev-214119.appspot.com/_ah/api/connected/v1/events/" +
          eventName;
        fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token
          }
        }).then(response => {
          if (response.ok) {
            try {
              let responseData = JSON.parse(response._bodyText);
              // check if date is in past
              let now = moment()
              let eventDate = moment(responseData.date, "MM/DD/YYYY")
              if (responseData && now.isAfter(eventDate, 'day')) {
                let pastEvents = []
                // keep state immutable by using slice to return new array
                if (this.state.pastEvents) {
                  pastEvents = this.state.pastEvents.slice();
                }
                let event = responseData;
                pastEvents.push(event);
                this.setState(
                  {
                    pastEvents: pastEvents,
                    loading: false
                  },
                  () => {
                    callback();
                  }
                );

              } else {
                // event not in the past
                if (!this.state.pastEvents) {
                  this.setState({ pastEvents: [] },
                    () => {
                      callback();
                    })
                } else {
                  callback()
                }
              }
            } catch (error) { }
          }
          else {
            callback();
          }
        });
      } catch (error) { }
    }
  };

  updateUser() {
    this.loadUser()
  }

  // Takes the array of user opportunities and loads and sorts each event
  loadEvents = () => {
    // TODO: Don't include duplicate events. only fetch the event once
    let sequence = new Sequencer();
    let registeredEvents = this.state.events.registered_events
    let createdEvents = this.state.events.created_events
    if (registeredEvents && registeredEvents.length > 0) {
      registeredEvents.map((eventName, index) => {
        eventName = eventName.replace("_", "/")
        sequence.promise(() => {
          this.loadPastEvent(eventName, index, () => {
            sequence.next();
          });
        });
      });
    } else {
      this.setState({ pastEvents: [] })
    }
    if (createdEvents && createdEvents.length > 0) {
      createdEvents.map((eventName, index) => {
        eventName = eventName.replace("_", "/")
        sequence.promise(() => {
          this.loadUserEvent(eventName, index, () => {
            sequence.next();
          });
        });
      });
    } else {
      this.setState({ createdEvents: [] })
    }
    sequence.next();
  };

  sortEvents = () => {
    let {events} = this.state;
    let createdEvents, currentEvents, pastEvents, futureEvents, regEvents = []
    if(events.created_events){
      createdEvents = events.created_events
    }
    if(events.registeredEvents){
      regEvents = events.registeredEvents
    }

  }

  loadUserOpportunities = async () => {
    let createdEvents = [];
    let token = await User.firebase.getIdToken();
    console.log("Profile token", token)
    if (token) {
      try {
        let url =
          "https://connected-dev-214119.appspot.com/_ah/api/connected/v1/profiles/" +
          this.state.user.email +
          "/events";
        fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token
          }
        }).then(response => {
          if (response.ok) {
            try {
              let events = JSON.parse(response._bodyText);
              if (typeof events === "object") {
                this.setState({ events: events },
                  () => this.loadEvents()
                )
              } else {
                this.setState({ loading: false });
              }
            } catch (error) { }
          } else {
            this.setState({
              loading: false
            });
          }
        });
      } catch (error) { }
    }
  }

  componentDidMount() {
    this.loadUser()
  }

  async loadUser() {
    let user = await User.isLoggedIn();
    if (user) {
      this.setState(
        {
          user: user
        },
        () => {
          this.loadUserOpportunities();
        }
      );
    }
    return true;
  }

  navigateToPage = (page) => {
    this.props.navigation.navigate(page, { loadUser: this.loadUser });
    // this.props.navigation.navigate("ProfileHome", {user: this.state.profileData});
    this.setState({ open: false })
  }

  openDrawer = () => {
    LayoutAnimation.linear();
    this.setState({ open: true });
  };

  closeDrawer = () => {
    LayoutAnimation.linear();
    this.setState({ open: false });
  };

  updateTab = (activeTab) => {
    this.setState({ activeTab })
  }

  render() {
    const buttons = ["Info", "History", "Created"];
    return (
      <View style={styles.container}>
        <View
          style={styles.container}
          contentContainerStyle={[styles.contentContainer, { height: screenHeight }]}
        >
          {this.state.user ? (
            <>
              <View
                style={{
                  paddingHorizontal: 24,
                  paddingTop: 18,
                  flexDirection: "row"
                }}
              >
                <View style={{ flex: 2 }}>
                  {this.state.user.profile &&
                    this.state.user.profile.photo !== "" ? (
                      <>
                        <Avatar
                          size={80}
                          rounded
                          source={{
                            uri:
                              "data:image/png;base64," +
                              this.state.user.profile.photo
                          }}
                        />
                      </>
                    ) : (
                      <Avatar rounded size={80} icon={{ name: "face" }} />
                    )}
                  <Text
                    style={{ fontSize: 18, fontWeight: "bold", marginTop: 6 }}
                  >
                    {this.state.user.profile.first_name +
                      " " +
                      this.state.user.profile.last_name}
                  </Text>
                  <Text
                    style={{ fontSize: 16, color: "#77abe4", marginTop: 2 }}
                  >
                    Volunteer
                  </Text>
                </View>
                <View
                  style={{
                    flex: 2,
                    justifyContent: "flex-end",
                    flexDirection: "row"
                  }}
                >
                  <TouchableOpacity
                    style={{ padding: 10, height: 40, width: 40 }}
                    onPress={this.openDrawer}
                  >
                    <Icon.Ionicons
                      name={Platform.OS === "ios" ? "ios-menu" : "md-more"}
                      size={26}
                      color={Colors.tabIconDefault}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View
                style={{
                  paddingHorizontal: 30,
                  paddingVertical: 12
                }}
              >
                <Divider style={{ height: 2, backgroundColor: "#dddddd" }} />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  paddingHorizontal: 24
                }}
              >
                <View style={{ flex: 1 }}>
                  {this.state.user.profile.hours ?
                    <Text style={styles.largeNumber}>
                      {this.state.user.profile.hours}
                    </Text>
                    :
                    <Text style={styles.largeNumber}>0</Text>
                  }
                  <Text style={styles.largeNumberCaption}>Total Hours</Text>
                </View>
                <View style={{ flex: 1 }}>
                  {this.state.pastEvents ? (
                    <>
                      <Text style={styles.largeNumber}>
                        {this.state.pastEvents.length}
                      </Text>
                    </>
                  ) : (
                      <>
                        <ActivityIndicator
                          style={{ marginBottom: 16 }}
                          size="small"
                          color="#0d0d0d"
                        />
                      </>
                    )}
                  <Text style={styles.largeNumberCaption}>
                    Total Opportunities
                  </Text>
                </View>
              </View>
              <View style={{ marginTop: 8, flex: 1 }}>
                <ButtonGroup
                  onPress={this.updateTab}
                  selectedIndex={this.state.activeTab}
                  buttons={buttons}
                  containerStyle={{ height: 42 }}
                />
                {this.state.activeTab === 0 && (
                  <>
                    <ProfileInfo user={this.state.user} />
                  </>
                )}
                {this.state.activeTab === 1 && (
                  <>
                    {this.state.events ? (
                      <>
                        <View style={styles.dropdownContainer}>
                          <View style={styles.dropdownSection}>
                            <View style={styles.dropdownSectionHeader}>
                              <Text style={styles.dropdownSectionHeaderText}>Current Events</Text>
                              <Icon.Ionicons
                                name={
                                  Platform.OS === "ios"
                                    ? "ios-arrow-down"
                                    : "md-arrow-dropdown"
                                }
                                size={26}
                              />
                            </View>
                          </View>

                          <View style={styles.dropdownSection}>
                            <View style={styles.dropdownSectionHeader}>
                              <Text style={styles.dropdownSectionHeaderText}>Upcoming Events</Text>
                              <Icon.Ionicons
                                name={
                                  Platform.OS === "ios"
                                    ? "ios-arrow-down"
                                    : "md-arrow-dropdown"
                                }
                                size={26}
                              />
                            </View>
                          </View>

                          <View style={styles.dropdownSection}>
                            <View style={styles.dropdownSectionHeader}>
                              <Text style={styles.dropdownSectionHeaderText}>Past Participation</Text>
                              <Icon.Ionicons
                                name={
                                  Platform.OS === "ios"
                                    ? "ios-arrow-down"
                                    : "md-arrow-dropdown"
                                }
                                size={26}
                              />
                            </View>
                          </View>

                        </View>
                        {/* <ProfileHistory events={this.state.pastEvents} /> */}
                      </>
                    ) : (
                        <ActivityIndicator
                          style={{ marginBottom: 16 }}
                          size="small"
                          color="#0d0d0d"
                        />
                      )}

                  </>
                )}
                {this.state.activeTab === 2 && (
                  <>
                    {this.state.createdEvents ? (
                      <ProfileCreated events={this.state.createdEvents} navigation={this.props.navigation} />
                    ) : (
                        <ActivityIndicator
                          style={{ marginBottom: 16 }}
                          size="small"
                          color="#0d0d0d"
                        />
                      )}

                  </>
                )}
              </View>
              {this.state.open && (
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "#fafafa",
                    borderLeftColor: "#dedede",
                    borderLeftWidth: 1,
                    width: screenWidth * 0.75,
                    height: screenHeight,
                    position: "absolute",
                    left: screenWidth * 0.25
                  }}
                >
                  <View style={{ paddingHorizontal: 8, paddingVertical: 18 }}>
                    <TouchableOpacity
                      style={{
                        padding: 10,
                        height: 40,
                        width: 40,
                        marginBottom: 12
                      }}
                      onPress={this.closeDrawer}
                    >
                      <Icon.Ionicons
                        name={
                          Platform.OS === "ios"
                            ? "ios-arrow-forward"
                            : "md-arrow-forward"
                        }
                        size={26}
                        color={Colors.tabIconDefault}
                      />
                    </TouchableOpacity>
                    <View style={{ paddingHorizontal: 10 }}>
                      <Text
                        style={{
                          fontWeight: "bold",
                          fontSize: 18,
                          marginBottom: 18
                        }}
                      >
                        SETTINGS
                                  </Text>
                      <View style={styles.drawerSectionWrapper}>
                        <View style={styles.drawerSectionLabelContainer}>
                          <Icon.Ionicons
                            name={
                              Platform.OS === "ios" ? "ios-person" : "md-person"
                            }
                            size={20}
                            color={Colors.tabIconDefault}
                          />
                          <Text style={styles.drawerSectionLabel}>Account</Text>
                        </View>
                        <Divider
                          style={{
                            height: 1,
                            marginBottom: 8,
                            backgroundColor: "#dddddd"
                          }}
                        />
                        <View style={styles.menuItemWrapper}>
                          <TouchableOpacity
                            style={styles.menuItemTouchable}
                            onPress={() => {
                              this.navigateToPage("ProfileEdit")
                            }}
                          >
                            <View style={styles.menuItemContainer}>
                              <Text style={styles.menuItemLabel}>
                                Edit Profile
                                          </Text>
                              <Text style={styles.menuItemIconContainer}>
                                <Icon.Ionicons
                                  name={
                                    Platform.OS === "ios"
                                      ? "ios-arrow-forward"
                                      : "md-arrow-forward"
                                  }
                                  size={20}
                                  color={Colors.tabIconDefault}
                                />
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                        <View style={styles.menuItemWrapper}>
                          <TouchableOpacity
                            style={styles.menuItemTouchable}
                            onPress={() => {
                              this.navigateToPage("ResetPassword")
                            }}
                          >
                            <View style={styles.menuItemContainer}>
                              <Text style={styles.menuItemLabel}>
                                Change Password
                                          </Text>
                              <Text style={styles.menuItemIconContainer}>
                                <Icon.Ionicons
                                  name={
                                    Platform.OS === "ios"
                                      ? "ios-arrow-forward"
                                      : "md-arrow-forward"
                                  }
                                  size={20}
                                  color={Colors.tabIconDefault}
                                />
                              </Text>
                            </View>
                          </TouchableOpacity>

                        </View>
                        <View style={styles.menuItemWrapper}>
                          <TouchableOpacity
                            style={styles.menuItemTouchable}
                            onPress={() => {
                              this.navigateToPage("PrivacyPolicy")
                            }}
                          >
                            <View style={styles.menuItemContainer}>
                              <Text style={styles.menuItemLabel}>
                                Privacy Policy
                              </Text>
                              <Text style={styles.menuItemIconContainer}>
                                <Icon.Ionicons
                                  name={
                                    Platform.OS === "ios"
                                      ? "ios-arrow-forward"
                                      : "md-arrow-forward"
                                  }
                                  size={20}
                                  color={Colors.tabIconDefault}
                                />
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                      {/* <View style={styles.drawerSectionWrapper}>
                        <View style={styles.drawerSectionLabelContainer}>
                          <Icon.Ionicons
                            name={
                              Platform.OS === "ios"
                                ? "ios-notifications"
                                : "md-notifications"
                            }
                            size={20}
                            color={Colors.tabIconDefault}
                          />
                          <Text style={styles.drawerSectionLabel}>
                            Notifications
                                      </Text>
                        </View>
                        <Divider
                          style={{
                            height: 1,
                            marginBottom: 8,
                            backgroundColor: "#dddddd"
                          }}
                        />
                        <View style={styles.menuItemWrapper}>
                          <TouchableOpacity
                            style={styles.menuItemTouchable}
                            onPress={() => { }}
                          >
                            <View style={styles.menuItemContainer}>
                              <Text style={styles.menuItemLabel}>
                                Notifications
                                          </Text>
                              <Text style={styles.menuItemIconContainer}>
                                <Icon.Ionicons
                                  name={
                                    Platform.OS === "ios"
                                      ? "ios-arrow-forward"
                                      : "md-arrow-forward"
                                  }
                                  size={20}
                                  color={Colors.tabIconDefault}
                                />
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                        <View style={styles.menuItemWrapper}>
                          <TouchableOpacity
                            style={styles.menuItemTouchable}
                            onPress={() => { }}
                          >
                            <View style={styles.menuItemContainer}>
                              <Text style={styles.menuItemLabel}>
                                App Notifications
                                          </Text>
                              <Text style={styles.menuItemIconContainer}>
                                <Icon.Ionicons
                                  name={
                                    Platform.OS === "ios"
                                      ? "ios-arrow-forward"
                                      : "md-arrow-forward"
                                  }
                                  size={20}
                                  color={Colors.tabIconDefault}
                                />
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View style={styles.drawerSectionWrapper}>
                        <View style={styles.drawerSectionLabelContainer}>
                          <Icon.Ionicons
                            name={Platform.OS === "ios" ? "ios-more" : "md-more"}
                            size={20}
                            color={Colors.tabIconDefault}
                          />
                          <Text style={styles.drawerSectionLabel}>More</Text>
                        </View>
                        <Divider
                          style={{
                            height: 1,
                            marginBottom: 8,
                            backgroundColor: "#dddddd"
                          }}
                        />
                        <View style={styles.menuItemWrapper}>
                          <TouchableOpacity
                            style={styles.menuItemTouchable}
                            onPress={() => { }}
                          >
                            <View style={styles.menuItemContainer}>
                              <Text style={styles.menuItemLabel}>Agreements</Text>
                              <Text style={styles.menuItemIconContainer}>
                                <Icon.Ionicons
                                  name={
                                    Platform.OS === "ios"
                                      ? "ios-arrow-forward"
                                      : "md-arrow-forward"
                                  }
                                  size={20}
                                  color={Colors.tabIconDefault}
                                />
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                        <View style={styles.menuItemWrapper}>
                          <TouchableOpacity
                            style={styles.menuItemTouchable}
                            onPress={() => { }}
                          >
                            <View style={styles.menuItemContainer}>
                              <Text style={styles.menuItemLabel}>
                                Location Services
                                          </Text>
                              <Text style={styles.menuItemIconContainer}>
                                <Icon.Ionicons
                                  name={
                                    Platform.OS === "ios"
                                      ? "ios-arrow-forward"
                                      : "md-arrow-forward"
                                  }
                                  size={20}
                                  color={Colors.tabIconDefault}
                                />
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View> */}
                      <View
                        style={{ flexDirection: "row", justifyContent: "center" }}
                      >
                        <Button
                          title="Logout"
                          onPress={() => {
                            User.logout(() => {
                              this.props.navigation.navigate("Main");
                            });
                          }}
                        />
                      </View>
                    </View>
                  </View>
                </View>

              )}
            </>
          ) : (
              <>
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 18,
                    marginTop: 24,
                    marginBottom: 24
                  }}
                >
                  Loading profile...
              </Text>
                <ActivityIndicator size="large" color="#0d0d0d" />
              </>
            )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eee",
  },

  contentContainer: {
    paddingTop: 12
  },
  largeNumber: {
    fontSize: 30,
    fontWeight: "bold"
  },
  largeNumberCaption: {
    fontSize: 14,
    marginTop: 3,
    color: "#b0b0b0"
  },
  drawerSectionWrapper: {
    marginBottom: 12
  },
  drawerSectionLabelContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 6
  },
  drawerSectionLabel: { marginLeft: 6, fontSize: 16 },
  menuItemWrapper: {},
  menuItemTouchable: {
    paddingVertical: 6
  },
  menuItemContainer: { flexDirection: "row" },
  menuItemLabel: { flex: 3 },
  menuItemIconContainer: { flex: 1 },
  dropdownContainer: {
    marginTop: 6,
    paddingHorizontal: 12
  },
  dropdownSection: {
    marginBottom: 12
  },
  dropdownSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dropdownSectionHeaderText: {
    fontSize: 16,
    color: "#b0b0b0",
    marginBottom: 6
  }
});
