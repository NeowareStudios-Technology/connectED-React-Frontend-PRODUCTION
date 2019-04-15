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

class EventEditLeadersAndTags extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <View style={{ marginTop: -6 }}>
          <Text style={{ textAlign: "center", fontSize: 21, marginBottom: 12 }}>
            Leaders And Tags
          </Text>
          <View style={{ marginBottom: 30 }}>
            <Text
              style={{
                fontSize: 16,
                color: "#adadad",
                paddingHorizontal: 12
              }}
            >
              Any leaders for this event?
            </Text>
            <LeaderInput name="leader_1" {...this.props} />
            <LeaderInput name="leader_2" {...this.props} />
            <LeaderInput name="leader_2" {...this.props} />
          </View>
          <View>
            <Text
              style={{
                fontSize: 16,
                color: "#adadad",
                paddingHorizontal: 12
              }}
            >
              Add up to 3 Tags Related to this Event
            </Text>
            <TagInput name="interests_1" {...this.props} />
            <TagInput name="interests_2" {...this.props} />
            <TagInput name="interests_2" {...this.props} />
          </View>
        </View>
      </>
    );
  }
}

function TagInput(props) {
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
            name={Platform.OS === "ios" ? "ios-pricetag" : "md-pricetag"}
            size={18}
          />
        }
      />
    </>
  );
}

function LeaderInput(props) {
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
        placeholder="Enter Leader Name"
        errorMessage={errorMessage}
        rightIcon={
          <Icon.Ionicons
            name={Platform.OS === "ios" ? "ios-star" : "md-star"}
            size={18}
          />
        }
      />
    </>
  );
}

export default EventEditLeadersAndTags;
