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
  Dimensions
} from "react-native";
import { Avatar, Button, Divider, ButtonGroup } from "react-native-elements";
import User from "../components/User";
import ProfileInfo from "../components/ProfileInfo";
import ProfileHistory from "../components/ProfileHistory";
import ProfileCreated from "../components/ProfileCreated";
import { Icon } from "expo";
import Colors from "../constants/Colors";
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
      userEvents: null,
      events: null,
      activeTab: 0
    };
  }
  loadUserOpportunities = async () => {
    console.log("LOAD USER OPPORTUNITIES")
    let userEvents = [];
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
              if (events) {
                console.log("EVENTS", events)
                if (typeof events.completed_events !== "undefined") {
                  userEvents = events.completed_events;
                }
                this.setState(events)
              }
            } catch (error) {
              console.log(error);
            }
          }
        });
      } catch (error) {
        console.log("events error fetching", error.message);
      }
    };
    this.setState({ userEvents: userEvents });
  }

  async componentDidMount() {
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
    this.props.navigation.navigate(page);
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
    console.log("active tab: " + this.state.activeTab)
    const buttons = ["Info", "History", "Created"];
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={[styles.contentContainer, {height: screenHeight}]}
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
                  {this.state.userEvents ? (
                    <>
                      <Text style={styles.largeNumber}>
                        {this.state.userEvents.length}
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
              <View style={{ marginTop: 8 }}>
                <ButtonGroup
                  onPress={this.updateTab}
                  selectedIndex={this.state.activeTab}
                  buttons={buttons}
                  containerStyle={{ height: 42 }}
                />
                <View>
                  {this.state.activeTab === 0 && (
                    <>
                      <ProfileInfo user={this.state.user} />
                    </>
                  )}
                  {this.state.activeTab === 1 && this.state.events && (
                    <>
                      <ProfileHistory events={this.state.events.registered_events} />
                    </>
                  )}
                  {this.state.activeTab === 2 && this.state.events && (
                    <>
                      <ProfileCreated events={this.state.events.created_events} />
                    </>
                  )}

                </View>
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
                      </View>
                      <View style={styles.drawerSectionWrapper}>
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
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent"
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
  menuItemIconContainer: { flex: 1 }
});
