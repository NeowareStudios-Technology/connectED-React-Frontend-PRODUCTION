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
import ProfileCreated from "../components/ProfileCreated";
import EventListItems from "../components/EventListItems";
import { Icon } from "expo";
import Colors from "../constants/Colors";
import moment from 'moment';
import Accordion from 'react-native-collapsible/Accordion';
import EventDetails from "../components/EventDetails";
import AdminEventDetails from "../components/AdminEventDetails";
import Styles from "../constants/Styles";

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
      signInOutTitle: "Sign in to Event",
      signInOutMessage: null
    };
  }
  updateUser = (user) => {
    this.setState({ user: user })
  }

  // loads any events the user created and sorts by date
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
                event.key = "event-" + index;
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
            try {
              let errorData = JSON.parse(response._bodyText);
              // console.log(eventName + " " + errorData.error.message)
            } catch (error) { }
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
          this.loadRegEvent(eventName, index, () => {
            sequence.next();
          });
        });
      });
    }
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
    sequence.next();
  };

  loadRegEvent = async (eventName, index, callback) => {
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
                event.key = "event-" + index;

                // Check if event is past, current or future
                let now = moment()
                let eventDate = moment(responseData.date, "MM/DD/YYYY")

                if (this.isPast(now, eventDate)) {
                  let pastEvents = []
                  if (this.state.pastEvents) {
                    pastEvents = this.state.pastEvents.slice();
                  }
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
                } else if (this.isFuture(now, eventDate)) {
                  let futureEvents = []
                  // keep state immutable by using slice to return new array
                  if (this.state.futureEvents) {
                    futureEvents = this.state.futureEvents.slice();
                  }
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
                } else {
                  let currentEvents = []
                  // keep state immutable by using slice to return new array
                  if (this.state.currentEvents) {
                    currentEvents = this.state.currentEvents.slice();
                  }
                  currentEvents.push(event);
                  this.setState(
                    {
                      currentEvents: currentEvents,
                      loading: false
                    },
                    () => {
                      callback();
                    });
                }
              }
            } catch (error) { }
          } else {
            // Response from server not ok
            try {
              let errorData = JSON.parse(response._bodyText);
              // console.log(eventName + " " + errorData.error.message)
            } catch (error) { }
            callback();
          }
        });
      } catch (error) { }
    }
  };

  isCurrent = (today, date) => date.isSame(today, 'day')

  isPast = (today, date) => date.isBefore(today, 'day')

  isFuture = (today, date) => date.isAfter(today, 'day')

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

  async loadUser() {
    let user = await User.isLoggedIn();
    if (user) {
      this.setState({ user: user }, () => {
        this.loadUserOpportunities();
      });
    }
    return true;
  }

  componentDidMount() {
    this.loadUser()
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
  volunteer = async () => {
    if (this.state.activeItem) {
      let isRegistered = false;
      if (
        typeof this.state.activeItem.is_registered !== "undefined" &&
        this.state.activeItem.is_registered !== "0"
      ) {
        isRegistered = true;
      }
      if (!isRegistered) {
        let token = await User.firebase.getIdToken();

        if (token) {
          let organizerEmail = this.state.activeItem.e_organizer;
          let eventOrigName = this.state.activeItem.e_orig_title;
          let url = `https://connected-dev-214119.appspot.com/_ah/api/connected/v1/events/${organizerEmail}/${eventOrigName}/registration`;
          let putData = {
            user_action: "both"
          };
          try {
            let bodyData = JSON.stringify(putData);
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
                  let events = this.state.events;
                  let eventIndex = null;
                  let event = events.find((anEvent, index) => {
                    if (anEvent === this.state.activeItem) {
                      eventIndex = index;
                      return true;
                    }
                    return false;
                  });
                  if (eventIndex) {
                    events[eventIndex].is_registered = "1";
                  }
                  this.setState({
                    events: events,
                    activeItem: events[eventIndex]
                  });
                }
              })
              .catch(error => { });
          } catch (error) { }
        }
      }
    }
  };

  deregister = async () => {
    if (this.state.activeItem) {
      let isRegistered = false;
      if (
        typeof this.state.activeItem.is_registered !== "undefined" &&
        this.state.activeItem.is_registered !== "0"
      ) {
        isRegistered = true;
      }
      if (isRegistered) {
        let token = await User.firebase.getIdToken();

        if (token) {
          let organizerEmail = this.state.activeItem.e_organizer;
          let eventOrigName = this.state.activeItem.e_orig_title;
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
  signInOrOut = async (name, email) => {
    let organizerEmail = "karina@dijatek.com"
    let eventName = "Jewel+hunt"
    let token = await User.firebase.getIdToken();
    if (token) {
      try {
        let url =
          `https://connected-dev-214119.appspot.com/_ah/api/connected/v1/events/${email}/${name}/qr`;
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
              let text = responseData.response
              let title = ""
              if (text.includes('in')) {
                let title = "Sign Out of Event"
                this.setState({
                  signInOutMessage: text,
                  signInOutTitle: title
                })
              } else {
                let title = "Sign Into Event"
                this.setState({
                  signInOutMessage: text,
                  signInOutTitle: title
                })
              }

            } catch (error) { }
          } else {
            alert("Not able to sign in or out of event")
          }
        });
      } catch (error) { }
    }
  }
  showEventDetails = (event) => {
    LayoutAnimation.easeInEaseOut();
    this.setState({ eventDetailVisible: true, activeItem: event })
  }
  showAdminEventDetails = (event) => {
    LayoutAnimation.easeInEaseOut();
    this.setState({ adminEventDetailVisible: true, activeItem: event })
  }
  hideDetails = () => {
    LayoutAnimation.easeInEaseOut();
    this.setState({ activeItem: null, adminEventDetailVisible: false, eventDetailVisible: false });
  };

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
  _renderContent = section => {
    let events, sort, title;
    if (section.title === 'Current Events') {
      events = this.state.currentEvents
      sort = "asc"
      title = "current"
    }
    else if (section.title === 'Upcoming Events') {
      events = this.state.futureEvents
      sort = "asc"
    }
    else {
      events = this.state.pastEvents
      sort = "desc"
    }
    return (
      <View style={Styles.eventListContainer}>
        <EventListItems
          events={events}
          sort={sort}
          title={title}
          overlay={this.showEventDetails}
          signInOrOut={(email, name) => {
            this.signInOrOut(email, name);
          }}
        />
      </View>


    );
  };
  _updateSections = activeSections => {
    this.setState({ activeSections });
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
        renderSectionTitle={this._renderSectionTitle}
        renderHeader={this._renderHeader}
        renderContent={this._renderContent}
        onChange={this._updateSections}
        underlayColor={'transparent'}
      />
    )
  }

  renderEventDetails = () => {
    return (
      <View style={Styles.contentContainer}>
        <EventDetails
          event={this.state.activeItem}
          onClose={this.hideDetails}
          onVolunteer={() => {
            this.volunteer();
          }}
          onDeregister={() => {
            this.deregister();
          }}
          signInOrOut={(email, name) => {
            this.signInOrOut(email, name);
          }}
          title={this.state.signInOutTitle}
        />
      </View>

    )
  }

  renderAdminEventDetails = () => {
    return (
      <View style={Styles.contentContainer}>
        <AdminEventDetails event={this.state.activeItem} onClose={this.hideDetails} />
      </View>
    )
  }

  render() {
    const buttons = ["Info", "History", "Created"];
    if (this.state.eventDetailVisible) {
      return (this.renderEventDetails())
    }
    if (this.state.adminEventDetailVisible) {
      return (this.renderAdminEventDetails())
    }
    return (
      <View style={Styles.container}>
        <View
          style={Styles.container}
          contentContainerStyle={Styles.contentContainer}
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
                <ScrollView>
                  {this.state.activeTab === 0 && (
                    <ProfileInfo user={this.state.user} navigation={this.props.navigation} />
                  )}
                  {this.state.activeTab === 1 && (
                    <>
                      {this.state.events ? (
                        this.renderAccordion()
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
                        <View style={Styles.eventListContainer}>
                          <EventListItems
                            events={this.state.createdEvents}
                            sort={"desc"}
                            overlay={this.showAdminEventDetails}
                            signInOrOut={(email, name) => {
                              this.signInOrOut(email, name);
                            }}
                            title={this.state.signInOutTitle}
                          />
                        </View>

                        // <ProfileCreated events={this.state.createdEvents} navigation={this.props.navigation} />
                      ) : (
                          <ActivityIndicator
                            style={{ marginBottom: 16 }}
                            size="large"
                            color="#0d0d0d"
                          />
                        )}
                    </>
                  )}
                </ScrollView>

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

});
