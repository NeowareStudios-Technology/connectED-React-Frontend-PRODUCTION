import React from "react";
import {
  Text,
  StyleSheet,
  ScrollView,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  Image
} from "react-native";
import { Input, Card, Button, Avatar } from "react-native-elements";
import { Icon } from "expo";
import styles from "../constants/Styles";

import DatePicker from "react-native-datepicker";

class EventEditFinishingTouches extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <View style={{ marginTop: -6 }}>
          <Text style={{ textAlign: "center", fontSize: 21, marginBottom: 12 }}>
            Finishing Touches
          </Text>
          <View style={{ marginBottom: 6 }}>
            <Text
              style={{
                fontSize: 16,
                color: "#adadad",
                paddingHorizontal: 12,
                marginBottom: 12
              }}
            >
              Volunteering Environment
            </Text>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <View
                style={{ flex: 10, flexDirection: "row", paddingVertical: 6 }}
              >
                <View style={{ flex: 4, flexDirection: "row" }}>
                  <TouchableOpacity
                    style={{
                      paddingHorizontal: 6,
                      justifyContent: "center",
                      flexDirection: "column"
                    }}
                  >
                    <Image
                      source={
                        this.props.env === "outdoor"
                          ? require("../assets/images/environment-outdoor-filled.png")
                          : require("../assets/images/environment-outdoor-outline.png")
                      }
                      style={{ width: 50, height: 50, marginBottom: 6 }}
                    />

                    <Text style={{ color: "#adadad", textAlign: "center" }}>
                      Outdoor
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={{ flex: 4, flexDirection: "row" }}>
                  <TouchableOpacity
                    style={{
                      paddingHorizontal: 6,
                      justifyContent: "center",
                      flexDirection: "column"
                    }}
                  >
                    <Image
                      source={
                        this.props.env === "outdoor"
                          ? require("../assets/images/environment-indoor-filled.png")
                          : require("../assets/images/environment-indoor-outline.png")
                      }
                      style={{ width: 50, height: 50, marginBottom: 6 }}
                    />

                    <Text style={{ color: "#adadad", textAlign: "center" }}>
                      Indoor
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={{ flex: 4, flexDirection: "row" }}>
                  <TouchableOpacity
                    style={{
                      paddingHorizontal: 6,
                      justifyContent: "center",
                      flexDirection: "column"
                    }}
                  >
                    <Image
                      source={
                        this.props.env === "outdoor"
                          ? require("../assets/images/environment-both-filled.png")
                          : require("../assets/images/environment-both-outline.png")
                      }
                      style={{ width: 50, height: 50, marginBottom: 6 }}
                    />

                    <Text style={{ color: "#adadad", textAlign: "center" }}>
                      Both
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View
                style={{
                  flex: 2,
                  flexDirection: "row",
                  alignItems: "center",
                  paddingRight: 12,
                  justifyContent: "flex-end"
                }}
              />
            </View>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                fontSize: 16,
                color: "#adadad",
                paddingHorizontal: 12
              }}
            >
              Create a Team for this event?
            </Text>
            <TouchableOpacity style={{ padding: 6 }}>
              <Icon.Ionicons
                name={
                  Platform.OS === "ios"
                    ? "ios-arrow-round-forward"
                    : "md-arrow-forward"
                }
                size={42}
              />
            </TouchableOpacity>
          </View>
          <View>
            <Text style={styles.displayH4}>Event Photo</Text>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "center"
              }}
            >
              {this.props.e_photo !== "" ? (
                <>
                  <Avatar
                    size={110}
                    source={{
                      uri: "data:image/png;base64," + this.props.e_photo
                    }}
                    onEditPress={this.setPhoto}
                    showEditButton
                  />
                </>
              ) : (
                <Avatar
                  size={110}
                  icon={{ name: "face" }}
                  showEditButton
                  onEditPress={this.setPhoto}
                />
              )}
            </View>
          </View>
        </View>
      </>
    );
  }
}

function SkillsInput(props) {
  let errorMessage =
    typeof props.errors[props.name] !== "undefined" &&
    props.errors[props.name].length > 0
      ? props.errors[props.name][0]
      : "";
  let value = typeof props[props.name] !== "undefined" ? props[props.name] : "";
  return (
    <>
      <Input
        name={props.name}
        value={value}
        onChangeText={value => {
          props.onInputChange(props.name, value);
        }}
        inputStyle={{ fontSize: 16 }}
        errorMessage={errorMessage}
        rightIcon={
          <Icon.Ionicons
            name={Platform.OS === "ios" ? "ios-git-commit" : "md-git-commit"}
            size={18}
          />
        }
      />
    </>
  );
}

export default EventEditFinishingTouches;
