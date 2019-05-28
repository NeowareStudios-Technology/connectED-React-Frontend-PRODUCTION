import React from "react";
import {
  Text,
  StyleSheet,
  ScrollView,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  LayoutAnimation,
  Dimensions
} from "react-native";
import { Input, Card, Button, Avatar } from "react-native-elements";
import { Icon } from "expo";
import InterestSelector from "../components/InterestSelector";
let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;


const validator = require("validator");

class TeamEditLeaders extends React.Component {
  constructor(props) {
    super(props);

    this.model = {
      fields: ["t_privacy"],
      rules: []
    };

    this.state = {
      interestSelectorOpen: false
    };
  }

  componentDidMount() {
    if (this.props.onLoadModel) {
      this.props.onLoadModel(this.model);
    }
  }

  render() {
    return (
      <>
        <View style={{ marginTop: -6 }}>
          <Text style={{ textAlign: "center", fontSize: 21, marginBottom: 12 }}>
            Leaders and Privacy
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
            <LeaderInput name="leader_3" {...this.props} />
          </View>
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
            <View style={{ flexDirection: "row" }}>
              <View
                style={{ flex: 10, flexDirection: "row", paddingVertical: 6 }}
              >
                <Button
                  title="Open"
                  style={{ marginRight: 18 }}
                  titleStyle={{ fontSize: 14 }}
                  onPress={() => {
                    this.props.onInputChange("t_privacy", "o");
                  }}
                  type={this.props.t_privacy === "o" ? "solid" : "outline"}
                />
                <Button
                  title="Private"
                  style={{ marginRight: 18 }}
                  titleStyle={{ fontSize: 14 }}
                  onPress={() => {
                    this.props.onInputChange("t_privacy", "p");
                  }}
                  type={this.props.t_privacy === "p" ? "solid" : "outline"}
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
        </View>
      </>
    );
  }
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

export default TeamEditLeaders;
