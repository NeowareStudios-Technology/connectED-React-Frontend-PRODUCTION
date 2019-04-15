import React from "react";
import {
  Text,
  StyleSheet,
  ScrollView,
  View,
  TextInput,
  TouchableOpacity,
  Platform
} from "react-native";
import { Input, Card, Button, Avatar } from "react-native-elements";
import { Icon } from "expo";

import DatePicker from "react-native-datepicker";

class EventEditPrivacyAndSkills extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <View style={{ marginTop: -6 }}>
          <Text style={{ textAlign: "center", fontSize: 21, marginBottom: 12 }}>
            Privacy And Skills
          </Text>
          <View style={{ marginBottom: 12 }}>
            <Text
              style={{
                fontSize: 16,
                color: "#adadad",
                paddingHorizontal: 12,
                marginBottom: 12
              }}
            >
              Open Event or Private Opportunity
            </Text>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <View
                style={{ flex: 10, flexDirection: "row", paddingVertical: 6 }}
              >
                <Button
                  title="Open"
                  style={{ marginRight: 18 }}
                  type={this.props.privacy === "open" ? "solid" : "outline"}
                />
                <Button
                  title="Private"
                  style={{ marginRight: 18 }}
                  type={this.props.privacy === "open" ? "solid" : "outline"}
                />
              </View>
              <View
                style={{
                  flex: 2,
                  flexDirection: "row",
                  alignItems: "center",
                  paddingRight: 12,
                  justifyContent: "flex-end"
                }}
              >
                <Icon.Ionicons
                  name={Platform.OS === "ios" ? "ios-lock" : "md-lock"}
                  size={30}
                />
              </View>
            </View>
          </View>
          <View>
            <Text
              style={{
                fontSize: 16,
                color: "#adadad",
                paddingHorizontal: 12
              }}
            >
              Any Required Skills for this Opportunity?
            </Text>
            <SkillsInput name="interests_1" {...this.props} />
            <SkillsInput name="interests_2" {...this.props} />
            <SkillsInput name="interests_2" {...this.props} />
            <Text
              style={{ color: "#adadad", marginTop: 12, paddingHorizontal: 12 }}
            >
              Tip: Adding Required Skills will make your volunteer pool so much
              more limited, adding just 1 Required Skill will help leviate this.
            </Text>
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

export default EventEditPrivacyAndSkills;
