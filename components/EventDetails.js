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
import AppData from "../constants/Data";

class EventDetails extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let item = this.props.event;
    console.log("Item", item);
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
              flex: 4,
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
                      style={{ color: "#fff" }}
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
                    paddingTop: 24,
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
              paddingVertical: 12,
              paddingHorizontal: 12
            }}
          >
            {item.e_title ? (
              <>
                <View
                  style={{
                    flexDirection: "column",
                    flex: 1
                  }}
                >
                  <View style={{ flex: 2}}>
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 18,
                        marginBottom: 6
                      }}
                    >
                      {item.e_title}
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        marginBottom: 6
                      }}
                    >
                      {item.e_desc}
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 6,
                      paddingBottom: 12
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text>Location:</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text>Opportunity Status:</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text>Tags:</Text>
                    </View>
                    <View style={{ flex: 1, justifyContent: "flex-end" }}>
                      <Button title="Volunteer" />
                    </View>
                  </View>
                </View>
              </>
            ) : (
              <>
                <ActivityIndicator size="small" />
              </>
            )}
          </View>
        </View>
      </>
    );
  }
}

export default EventDetails;
