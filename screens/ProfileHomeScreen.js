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
  Picker,
  RefreshControl
} from "react-native";
import { Avatar, Button, Divider, ButtonGroup } from "react-native-elements";
import Sequencer from "../components/Sequencer";
import User from "../components/User";
import ProfileInfo from "../components/ProfileInfo";
import ProfileCreated from "../components/ProfileCreated";
import EventListItems from "../components/EventListItems";
import { Icon } from "expo";
import Colors from "../constants/Colors";
import moment from 'moment';
import Accordion from 'react-native-collapsible/Accordion';
import EventDetails from "../components/EventDetails";
import AdminEventDetails from "../components/AdminEventDetails";
import Styles from "../constants/Styles";
import { isPast, isToday } from "../constants/Utils";
import { fetchUserTeams } from "../constants/API"
import TeamListItems from "../components/TeamListItems";

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
      loading: true,
      activeSections: [], // array for dropdown/accordion
      activeItem: null,
      adminEventDetailVisible: false,
      eventDetailVisible: false,
      refreshing: false,
      activeCreatedSection: []
    };
  }

  _onRefresh = () => {
    this.setState({
      refreshing: true,
      events: null,
      createdEvents: null,
      pastEvents: null,
      currentEvents: null,
      futureEvents: null,
      loading: true,
      activeItem: null
    })
    this.loadUserOpportunities().then(() => {
      this.setState({ refreshing: false })
    })
  }
  // loads any events the user created
  loadCreatedEvent = async (eventName, index, callback) => {
    // console.log("LOAD CREATED EVENT - " + eventName)
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
                if (this.state.createdEvents) {
                  createdEvents = this.state.createdEvents.slice();
                }
                let event = responseData;
                event.key = "created-" + index;
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
          } else {
            // Response from server not ok
            callback();
          }
        });
      } catch (error) { }
    }
  };

  // loads any events the user is registered to volunteer and sorts into past, current, future event
  loadAndSortEventByType = async (eventName, index, type, callback) => {
    // console.log("LOAD REG EVENT - " + eventName)
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
                let event = responseData;
                event.key = type + "-" + index;

                // Check if event is past, current, or future
                if (isPast(event.date)) {
                  let pastEvents = []
                  if (this.state.pastEvents) {
                    pastEvents = this.state.pastEvents.slice();
                  }
                  // Doesn't add duplicates if titles match
                  let alreadyIncluded = pastEvents.some(e => e.e_orig_title === event.e_orig_title)
                  if (!alreadyIncluded) {
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
                  }
                  else {
                    callback()
                  }
                }
                else if (isToday(event.date)) {
                  let currentEvents = []
                  if (this.state.currentEvents) {
                    currentEvents = this.state.currentEvents.slice();
                  }
                  // Doesn't add duplicates if titles match
                  let alreadyIncluded = currentEvents.some(e => e.e_orig_title === event.e_orig_title)
                  if (!alreadyIncluded) {
                    currentEvents.push(event);
                    this.setState(
                      {
                        currentEvents: currentEvents,
                        loading: false
                      },
                      () => {
                        callback();
                      }
                    );
                  }
                  else {
                    callback()
                  }
                }
                else {
                  let futureEvents = []
                  if (this.state.futureEvents) {
                    futureEvents = this.state.futureEvents.slice();
                  }
                  // Doesn't add duplicates if titles match
                  let alreadyIncluded = futureEvents.some(e => e.e_orig_title === event.e_orig_title)
                  if (!alreadyIncluded) {
                    futureEvents.push(event);
                    this.setState(
                      {
                        futureEvents: futureEvents,
                        loading: false
                      },
                      () => {
                        callback();
                      }
                    );
                  }
                  else {
                    callback()
                  }
                }
              }
            } catch (error) { }
          } else {
            // Response from server not ok
            callback();
          }
        });
      } catch (error) { }
    }
  };

  // Takes the array of user opportunities and loads and sorts each event
  loadEvents = () => {
    let sequence = new Sequencer();
    let registeredEvents = this.state.events.registered_events
    let createdEvents = this.state.events.created_events
    let completedEvents = this.state.events.completed_events;

    // Handle events the user is registered to volunteer
    if (registeredEvents && registeredEvents.length > 0) {
      registeredEvents.map((eventName, index) => {
        eventName = eventName.replace("_", "/")
        sequence.promise(() => {
          this.loadAndSortEventByType(eventName, index, "registered", () => {
            sequence.next();
          });
        });
      });
    }
    // Handle events created by the user
    if (createdEvents && createdEvents.length > 0) {
      createdEvents.map((eventName, index) => {
        eventName = eventName.replace("_", "/")
        sequence.promise(() => {
          this.loadCreatedEvent(eventName, index, () => {
            sequence.next();
          });
        });
      });
    }
    // Handle events the user has completed/attended (aka signed into)
    if (completedEvents && completedEvents.length > 0) {
      completedEvents.map((eventName, index) => {
        eventName = eventName.replace("_", "/")
        sequence.promise(() => {
          this.loadAndSortEventByType(eventName, index, "completed", () => {
            sequence.next();
          });
        });
      });
    }

    sequence.next();
  };

  loadUserOpportunities = async () => {
    let createdEvents = [];
    let token = await User.firebase.getIdToken();
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
              console.log("USER OPPORTUNITIES:", events)
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
  loadUserTeams = async () => {
    try {
      let userTeams = await fetchUserTeams()
      console.log("TEAMS:", userTeams)
      if (!userTeams.error) {
        this.setState({ createdTeams: userTeams.created_team_ids });
      } else {
        alert("ERROR: " + userTeams.error.message)
      }
    } catch (error) { }
  };

  async loadUser() {
    let user = await User.isLoggedIn();
    if (user) {
      this.setState({ user: user }, () => {
        this.loadUserOpportunities();
        this.loadUserTeams()
      });
    }

    return true;
  }

  componentDidMount() {
    this.loadUser()
  }

  navigateToPage = (page) => {
    this.props.navigation.navigate(page, { loadUser: this.loadUser });
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

  checkSignIn = () => {
    if (!this.state.user) {
      return false
    }
    let userEmail = this.state.user.email
    let signedInAttendees = this.state.activeItem.signed_in_attendees
    if (!signedInAttendees) {
      return false
    }
    return signedInAttendees.includes(userEmail)
  }

  // ********************
  // Accordion Functions
  // ********************
  _renderHeader = section => {
    return (
      <View style={Styles.dropdownSectionHeader}>
        <Text style={Styles.dropdownSectionHeaderText}>{section.title}</Text>
        <Icon.Ionicons
          name={
            Platform.OS === "ios"
              ? "ios-arrow-down"
              : "md-arrow-dropdown"
          }
          size={26}
        />
      </View>
    );
  };
  _renderCreatedContent = section => {
    if (section.title === 'Events') {
      return (
        <View style={Styles.eventListContainer}>
          <EventListItems
            events={this.state.createdEvents}
            sort={"desc"}
            overlay={this.showAdminEventDetails}
            title={this.state.signInOutTitle}
            type="a"
          />
        </View>
      )
    } else {
      return (
        <View style={Styles.eventListContainer}>
          <TeamListItems teams={this.state.createdTeams} />
        </View>

      )
    }
  }
  _renderContent = section => {
    let events, sort, title;
    if (section.title === 'Current Events') {
      events = this.state.currentEvents
      sort = "asc"
      // title = "current"
      type = "c" // current
    }
    else if (section.title === 'Upcoming Events') {
      events = this.state.futureEvents
      sort = "asc"
      type = "f" // future
    }
    else {
      events = this.state.pastEvents
      sort = "desc"
      type = "p" // past
    }
    return (
      <View style={Styles.eventListContainer}>
        <EventListItems
          events={events}
          sort={sort}
          title={title}
          overlay={this.showEventDetails}
          type={type}
        />
      </View>
    );
  };
  _updateSections = activeSections => {
    this.setState({ activeSections });
  };
  updateCreatedSection = activeCreatedSection => {
    this.setState({ activeCreatedSection });
  };
  renderAccordion = () => {
    let sections = [
      {
        title: 'Current Events',
      }, {
        title: 'Upcoming Events',
      }, {
        title: 'Past Events',
      }
    ]
    return (
      <Accordion
        containerStyle={{}}
        sectionContainerStyle={{}}
        sections={sections}
        activeSections={this.state.activeSections}
        renderHeader={this._renderHeader}
        renderContent={this._renderContent}
        onChange={this._updateSections}
        underlayColor={'transparent'}
      />
    )
  }

  showEventDetails = (event) => {
    // console.log("ACTIVE EVENT", event)
    LayoutAnimation.easeInEaseOut();
    this.setState({ eventDetailVisible: true, activeItem: event })
  }

  showAdminEventDetails = (event) => {
    LayoutAnimation.easeInEaseOut();
    this.setState({ adminEventDetailVisible: true, activeItem: event })
  }

  // return the updated events array
  updateEvents = (events, event) => {
    let index = events.findIndex((e) => e.e_orig_title === event.e_orig_title)
    if (index === -1) {
      return null
    }

    // if event attendee is no longer regiestered, remove from list of events
    if (event.is_registered === "0" && event.type !== "a") {
      // cut out event from list
      events.splice(index, 1)
    }
    else {
      events[index] = event
    }

    return events
  }

  // closes the event details and updates state
  closeItem = event => {
    LayoutAnimation.easeInEaseOut();

    if (event) {
      let createdEvents = this.updateEvents(this.state.createdEvents.slice(), event)

      let events
      switch (event.type) {
        case "a": // admin/created events
          events = this.updateEvents(createdEvents, event)
          this.setState({ createdEvents: events })
          break;
        case "f": // future events
          events = this.updateEvents(this.state.futureEvents.slice(), event)
          this.setState({ futureEvents: events })
          break;
        case "c": // current events
          events = this.updateEvents(this.state.currentEvents.slice(), event)
          this.setState({ currentEvents: events })
          break;
        case "p": // past events
          events = this.updateEvents(this.state.pastEvents.slice(), event)
          this.setState({ pastEvents: events })
          break;
        default:
          break;
      }

      if (event.type !== "a" && createdEvents) {
        this.setState({ createdEvents })
      }
    }

    this.setState({ activeItem: null, adminEventDetailVisible: false, eventDetailVisible: false });
  };

  renderEventDetails = () => {
    return (
      <View style={Styles.contentContainer}>
        <EventDetails
          event={this.state.activeItem}
          onClose={this.closeItem}
        />
      </View>

    )
  }
  renderAdminEventDetails = () => {
    return (
      <View style={Styles.contentContainer}>
        <AdminEventDetails event={this.state.activeItem} onClose={this.closeItem} />
      </View>
    )
  }

  render() {
    const buttons = ["My Info", "My Events", "Created"];
    if (this.state.eventDetailVisible) {
      return (this.renderEventDetails())
    }
    if (this.state.adminEventDetailVisible) {
      return (this.renderAdminEventDetails())
    }
    return (
      <View style={Styles.container}>
        <View style={Styles.contentContainer}>
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
                  <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 6 }}>
                    {this.state.user.profile.first_name + " " + this.state.user.profile.last_name}
                  </Text>
                  <Text style={{ fontSize: 16, color: "#77abe4", marginTop: 2 }}>
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
                    style={{ paddingTop: 10, height: 60, width: 50 }}
                    onPress={this.openDrawer}
                  >
                    <Icon.Ionicons
                      name={Platform.OS === "ios" ? "ios-menu" : "md-more"}
                      size={50}
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
                      {Number(this.state.user.profile.hours).toFixed(2)}
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
                        {/* <ActivityIndicator
                          style={{ marginBottom: 16 }}
                          size="small"
                          color="#0d0d0d"
                        /> */}
                        <Text style={styles.largeNumber}>
                          0
                        </Text>
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
                <ScrollView
                  refreshControl={
                    <RefreshControl
                      refreshing={this.state.refreshing}
                      onRefresh={this._onRefresh}
                    />
                  }
                >
                  {this.state.activeTab === 0 && (
                    <ProfileInfo user={this.state.user} navigation={this.props.navigation} />
                  )}
                  {this.state.activeTab === 1 && (
                    <>
                      {this.state.events ? (
                        this.renderAccordion()
                      ) : (
                          <ActivityIndicator
                            style={Styles.activityIndicator}
                          />
                        )}
                    </>
                  )}
                  {this.state.activeTab === 2 && (
                    <>
                      {this.state.createdEvents || this.state.createdTeams ? (
                        <Accordion
                          sections={[
                            {
                              title: 'Events'
                            }, {
                              title: 'Teams'
                            }
                          ]}
                          activeSections={this.state.activeCreatedSection}
                          onChange={this.updateCreatedSection}
                          renderHeader={this._renderHeader}
                          renderContent={this._renderCreatedContent}
                        />
                        // <View style={Styles.eventListContainer}>
                        //   <EventListItems
                        //     events={this.state.createdEvents}
                        //     sort={"desc"}
                        //     overlay={this.showAdminEventDetails}
                        //     title={this.state.signInOutTitle}
                        //     type="a"
                        //   />
                        // </View>
                      ) : (
                          <ActivityIndicator
                            style={Styles.activityIndicator}
                            size="large"

                          />
                        )}
                    </>
                  )}
                </ScrollView>
              </View>
              {/* Side Drawer - Account Settings */}
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
                <ActivityIndicator size="large" color="#0d0d0d" style={Styles.activityIndicator} />
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

});
