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
  View
} from "react-native";
import { WebBrowser, Icon, ImagePicker, Permissions, FileSystem } from "expo";
import { Input, Card, Button, Avatar } from "react-native-elements";

import Sequencer from "../components/Sequencer";
import firebase from "../components/Firebase";
import User from "../components/User";
import ProfileEditPhoto from "../components/ProfileEditPhoto";
import ProfileEditName from "../components/ProfileEditName";
import ProfileEditSchedule from "../components/ProfileEditSchedule";
import ProfileEditInterests from "../components/ProfileEditInterests";
import ProfileEditSkills from "../components/ProfileEditSkills";
import Colors from "../constants/Colors";

const validator = require("validator");

export default class ProfileEditScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      procesing: false,
      profileData: null,
      processingErrors: null,
      activeStep: 0
    };

    this.fields = {
      education: "",
      first_name: "",
      last_name: "",
      photo: "",
      interests: [],
      skills: [],
      lat: 10,
      lon: 10,
      mon: false,
      tue: false,
      wed: false,
      thu: false,
      fri: false,
      sat: false,
      sun: false,
      time_day: "morning"
    };
    let errors = {};
    Object.keys(this.fields).map(key => {
      this.state[key] = this.fields[key];
      errors[key] = [];
    });
    this.state.errors = errors;
  }
  static navigationOptions = {
    header: null
  };

  onInputChange = value => {
    let attribute = e.target.name;
    this.setState({
      [attribute]: value
    });
  };

  goBack = () => {
    this.props.navigation.navigate("ProfileHome");
  };

  saveUserProfile = async (profileData, callback) => {
    let token = await User.firebase.getIdToken();
    if (token) {
      try {
        let bodyData = JSON.stringify(profileData);
        let url =
          "https://connected-dev-214119.appspot.com/_ah/api/connected/v1/profiles";
        fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token
          },
          body: bodyData
        })
          .then(response => {
            console.log("Response from save profile", response);
            if (response.ok) {
              if (typeof callback === "function") {
                User.setProfile(profileData);
                callback();
              }
            }
          })
          .catch(error => {
            console.error("Error posting to Endpoint", error);
          });
      } catch (error) {
        console.log("error parsing profile data", error.message);
      }
    }
  };

  process = () => {
    let sequence = new Sequencer();
    sequence.data = null;
    sequence.errors = [];
    sequence.promise(() => {
      this.setState(
        {
          processing: true
        },
        () => {
          sequence.next();
        }
      );
    });

    sequence.promise(() => {
      var profileData = {};
      Object.keys(this.fields).map(field => {
        profileData[field] = this.state[field];
      });
      sequence.data = profileData;
      sequence.next();
    });

    sequence.promise(() => {
      if (sequence.data) {
        this.saveUserProfile(sequence.data, () => {
          sequence.next();
        });
      } else {
        sequence.errors = [
          "We could not create a user account with the data provided.  Please restart the App and try again."
        ];
        sequence.next();
      }
    });

    sequence.onStop = () => {
      if (sequence.errors.length > 0) {
        this.setState({
          processing: false,
          processingErrors: sequence.errors
        });
      } else {
        this.setState({ processing: false });
      }
    };

    sequence.next();
  };

  async componentDidMount() {
    let user = await User.isLoggedIn();
    if (user) {
      let newState = { user: user };
      //Hydrate state with user profile
      Object.keys(this.fields).map(field => {
        if (typeof user.profile[field] !== "undefined") {
          newState[field] = user.profile[field];
        }
      });
      this.setState(newState);
    }
    return true;
  }

  render() {
    return (
      <>
        <View style={{ width: "100%", height: "100%" }}>
          {this.state.user ? (
            <>
              {this.state.activeStep === 0 && (
                <>
                  <View style={styles.container}>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "column",
                        justifyContent: "flex-end"
                      }}
                    >
                      <View style={{ flex: 9 }}>
                        <ScrollView
                          style={styles.container}
                          contentContainerStyle={styles.contentContainer}
                        >
                          <View
                            style={{ flexDirection: "row", marginBottom: 8 }}
                          >
                            <View
                              style={{
                                flex: 3
                              }}
                            >
                              <>
                                <TouchableOpacity
                                  style={{
                                    height: 60,
                                    width: 60,
                                    paddingHorizontal: 15
                                  }}
                                  onPress={this.goBack}
                                >
                                  <Icon.Ionicons
                                    style={{ padding: 0, margin: 0 }}
                                    name={
                                      Platform.OS === "ios"
                                        ? "ios-arrow-round-back"
                                        : "md-arrow-back"
                                    }
                                    size={44}
                                    color="#195074"
                                  />
                                </TouchableOpacity>
                              </>
                            </View>
                            <View style={{ flex: 6 }}>
                              <>
                                <View>
                                  <ProfileEditPhoto
                                    user={this.state.user}
                                    onPhotoSelected={photo => {
                                      this.setState({ photo: photo });
                                    }}
                                  />
                                </View>
                              </>
                            </View>
                            <View style={{ flex: 3 }}>
                              <></>
                            </View>
                          </View>
                          <View>
                            <ProfileEditName
                              {...this.state}
                              errors={this.state.errors}
                              onChange={(attribute, value) => {
                                this.setState({ [attribute]: value });
                              }}
                            />
                          </View>
                          <View style={{ paddingHorizontal: 20 }}>
                            <Text
                              style={{
                                color: "#bababa",
                                fontSize: 16,
                                marginBottom: 12
                              }}
                            >
                              Change
                            </Text>
                            <View>
                              <View style={styles.menuItemWrapper}>
                                <TouchableOpacity
                                  style={styles.menuItemTouchable}
                                  onPress={() => {
                                    this.setState({ activeStep: 1 });
                                  }}
                                >
                                  <View style={styles.menuItemContainer}>
                                    <Text style={styles.menuItemLabel}>
                                      Schedule
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
                                    this.setState({ activeStep: 2 });
                                  }}
                                >
                                  <View style={styles.menuItemContainer}>
                                    <Text style={styles.menuItemLabel}>
                                      Interests
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
                                    this.setState({ activeStep: 3 });
                                  }}
                                >
                                  <View style={styles.menuItemContainer}>
                                    <Text style={styles.menuItemLabel}>
                                      Skills
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
                          </View>
                        </ScrollView>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          paddingHorizontal: 24,
                          flexDirection: "column"
                        }}
                      >
                        {this.state.processing ? (
                          <>
                            <ActivityIndicator size="small" />
                          </>
                        ) : (
                          <>
                            <Button title="Save" onPress={this.process} />
                          </>
                        )}
                      </View>
                    </View>
                  </View>
                </>
              )}
              {this.state.activeStep === 1 && (
                <>
                  <View style={styles.container}>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "column",
                        justifyContent: "flex-end"
                      }}
                    >
                      <View style={{ flex: 9 }}>
                        <ScrollView
                          style={styles.container}
                          contentContainerStyle={styles.contentContainer}
                        >
                          <View>
                            <TouchableOpacity
                              style={{
                                height: 60,
                                width: 60,
                                paddingHorizontal: 15
                              }}
                              onPress={() => {
                                this.setState({ activeStep: 0 });
                              }}
                            >
                              <Icon.Ionicons
                                style={{ padding: 0, margin: 0 }}
                                name={
                                  Platform.OS === "ios"
                                    ? "ios-arrow-round-back"
                                    : "md-arrow-back"
                                }
                                size={44}
                                color="#195074"
                              />
                            </TouchableOpacity>
                          </View>
                          <View>
                            <ProfileEditSchedule
                              {...this.state}
                              onChange={(attribute, value) => {
                                this.setState({ [attribute]: value });
                              }}
                            />
                          </View>
                        </ScrollView>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          paddingHorizontal: 24,
                          flexDirection: "column"
                        }}
                      >
                        <Button
                          title="Ok"
                          onPress={() => {
                            this.setState({ activeStep: 0 });
                          }}
                        />
                      </View>
                    </View>
                  </View>
                </>
              )}
              {this.state.activeStep === 2 && (
                <>
                  <View style={styles.container}>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "column",
                        justifyContent: "flex-end"
                      }}
                    >
                      <View style={{ flex: 9 }}>
                        <ScrollView
                          style={styles.container}
                          contentContainerStyle={styles.contentContainer}
                        >
                          <View>
                            <TouchableOpacity
                              style={{
                                height: 60,
                                width: 60,
                                paddingHorizontal: 15
                              }}
                              onPress={() => {
                                this.setState({ activeStep: 0 });
                              }}
                            >
                              <Icon.Ionicons
                                style={{ padding: 0, margin: 0 }}
                                name={
                                  Platform.OS === "ios"
                                    ? "ios-arrow-round-back"
                                    : "md-arrow-back"
                                }
                                size={44}
                                color="#195074"
                              />
                            </TouchableOpacity>
                          </View>
                          <View>
                            <ProfileEditInterests
                              {...this.state}
                              onChange={(attribute, value) => {
                                this.setState({ [attribute]: value });
                              }}
                            />
                          </View>
                        </ScrollView>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          paddingHorizontal: 24,
                          flexDirection: "column"
                        }}
                      >
                        <Button
                          title="Ok"
                          onPress={() => {
                            this.setState({ activeStep: 0 });
                          }}
                        />
                      </View>
                    </View>
                  </View>
                </>
              )}
              {this.state.activeStep === 3 && (
                <>
                  <View style={styles.container}>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "column",
                        justifyContent: "flex-end"
                      }}
                    >
                      <View style={{ flex: 9 }}>
                        <ScrollView
                          style={styles.container}
                          contentContainerStyle={styles.contentContainer}
                        >
                          <View>
                            <TouchableOpacity
                              style={{
                                height: 60,
                                width: 60,
                                paddingHorizontal: 15
                              }}
                              onPress={() => {
                                this.setState({ activeStep: 0 });
                              }}
                            >
                              <Icon.Ionicons
                                style={{ padding: 0, margin: 0 }}
                                name={
                                  Platform.OS === "ios"
                                    ? "ios-arrow-round-back"
                                    : "md-arrow-back"
                                }
                                size={44}
                                color="#195074"
                              />
                            </TouchableOpacity>
                          </View>
                          <View>
                            <ProfileEditSkills
                              {...this.state}
                              onChange={(attribute, value) => {
                                this.setState({ [attribute]: value });
                              }}
                            />
                          </View>
                        </ScrollView>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          paddingHorizontal: 24,
                          flexDirection: "column"
                        }}
                      >
                        <Button
                          title="Ok"
                          onPress={() => {
                            this.setState({ activeStep: 0 });
                          }}
                        />
                      </View>
                    </View>
                  </View>
                </>
              )}
            </>
          ) : (
            <></>
          )}
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent"
  },
  contentContainer: {
    paddingTop: 30
  },
  menuItemTouchable: {
    paddingVertical: 6
  },
  menuItemContainer: { flexDirection: "row" },
  menuItemLabel: { flex: 3, fontSize: 16 },
  menuItemIconContainer: { flex: 1 }
});
