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
import AppData from "../constants/Data";

class EventDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 0
    };
  }

  setActiveTab = index => {
    this.setState({
      activeTab: index
    });
  };

  render() {
    let item = this.props.event;
    let privacyLabel = item.privacy === "o" ? "Open" : "Private";
    let itemDate = moment(item.date, "MM/DD/YYYY");
    let environmentImage =
      item.env === "o"
        ? require("../assets/images/environment-outdoor-filled.png")
        : require("../assets/images/environment-outdoor-outline.png");

    return (
      <>
        <View
          style={{
            flexDirection: "column",
            flex: 1
          }}
        >
          <View
            style={{
              flex: 3,
              backgroundColor: "#124b73"
            }}
          >
            <ImageBackground
              source={{
                uri: "data:image/png;base64," + item.e_photo
              }}
              style={{
                width: "100%",
                height: "100%"
              }}
            >
              <View
                style={{
                  flex: 1,
                  paddingBottom: 12,
                  flexDirection: "column"
                }}
              >
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
                      flex: 2,
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
                      {itemDate.format("MMM") + " " + itemDate.date()}
                    </Text>
                  </View>
                </View>
              </View>
            </ImageBackground>
          </View>
          <View
            style={{
              flex: 10,
              flexDirection: "column",
              justifyContent: "flex-end",
              paddingVertical: 12,
              paddingHorizontal: 12
            }}
          >
            <View style={{ flex: 20 }}>
              {this.state.activeTab === 0 && (
                <>
                  <EventDetailsInfo event={item} />
                </>
              )}
              {this.state.activeTab === 1 && (
                <>
                  <EventDetailsTeam event={item} />
                </>
              )}
              {this.state.activeTab === 2 && (
                <>
                  <EventDetailsUpdates event={item} />
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
                  {item.is_registered === "-1" && (
                    <>
                      <Button title="Pending..." />
                    </>
                  )}
                  {item.is_registered === "0" && (
                    <>
                      <Button
                        onPress={this.props.onVolunteer}
                        title="Volunteer"
                      />
                    </>
                  )}
                  {item.is_registered === "1" && (
                    <>
                      <Button
                        onPress={this.props.onDeregister}
                        title="Deregister"
                      />
                    </>
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
