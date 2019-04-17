import React from "react";
import {
  Text,
  StyleSheet,
  ScrollView,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  LayoutAnimation
} from "react-native";
import { Input, Card, Button, Avatar } from "react-native-elements";
import { Icon } from "expo";
import InterestSelector from "../components/InterestSelector";

const validator = require("validator");

class EventEditLeadersAndTags extends React.Component {
  constructor(props) {
    super(props);

    this.model = {
      fields: ["interests"],
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

  onRemoveInterest = index => {
    if (typeof this.props.interests[index] !== "undefined") {
      this.props.interests.splice(index, 1);
      this.props.onInputChange("interests", this.props.interests);
    }
  };

  openInterestSelector = index => {
    this.props.onModalOpen(() => {
      LayoutAnimation.linear();
      this.setState({ interestSelectorOpen: true });
    });
  };

  closeInterestSelector = index => {
    this.props.onModalClose(() => {
      LayoutAnimation.linear();
      this.setState({ interestSelectorOpen: false });
    });
  };

  render() {
    let selectedInterests = this.props.interests || [];
    let interestOne =
      this.props.interests && this.props.interests[0]
        ? this.props.interests[0]
        : "";
    let interestTwo =
      this.props.interests && this.props.interests[1]
        ? this.props.interests[1]
        : "";
    let interestThree =
      this.props.interests && this.props.interests[2]
        ? this.props.interests[2]
        : "";
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
                paddingHorizontal: 12,
                marginBottom:6
              }}
            >
              Add up to 3 Tags Related to this Event
            </Text>
            <TagInput
              name="interests"
              index={0}
              value={interestOne}
              {...this.props}
              onRemoveInterest={this.onRemoveInterest}
              onSelectOpen={this.openInterestSelector}
            />
            <TagInput
              name="interests"
              index={1}
              value={interestTwo}
              {...this.props}
              onRemoveInterest={this.onRemoveInterest}
              onSelectOpen={this.openInterestSelector}
            />
            <TagInput
              name="interests"
              index={2}
              value={interestThree}
              {...this.props}
              onRemoveInterest={this.onRemoveInterest}
              onSelectOpen={this.openInterestSelector}
            />
          </View>
          <View
            style={{
              backgroundColor: "#fff",
              width: "100%",
              height: "110%",
              position: "absolute",
              paddingTop: 12,
              paddingHorizontal: 0,
              top: this.state.interestSelectorOpen ? 0 : "200%",
              left: 0
            }}
          >
            <InterestSelector
              closeAction={this.closeInterestSelector}
              selectedInterests={selectedInterests}
              onSelect={interest => {
                let currentInterests = selectedInterests;
                if (
                  currentInterests.indexOf(interest) === -1 &&
                  currentInterests.length < 3
                ) {
                  currentInterests.push(interest);
                  this.props.onInputChange("interests", currentInterests);
                }
              }}
            />
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
  return (
    <>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          paddingLeft: 0,
          paddingRight: 12,
          paddingVertical: 6,
          marginBottom: 6
        }}
      >
        <View style={{ flex: 2, alignItems: "center" }}>
          {props.value.trim() === "" ? (
            <>
              <TouchableOpacity
                style={{ padding: 1, marginRight: 6 }}
                onPress={() => {
                  props.onSelectOpen(props.index);
                }}
              >
                <Icon.Ionicons
                  name={
                    Platform.OS === "ios" ? "ios-add-circle" : "md-add-circle"
                  }
                  size={24}
                />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={{ padding: 1, marginRight: 6 }}
                onPress={() => {
                  props.onRemoveInterest(props.index);
                }}
              >
                <Icon.Ionicons
                  name={
                    Platform.OS === "ios"
                      ? "ios-close-circle"
                      : "md-close-circle"
                  }
                  size={24}
                />
              </TouchableOpacity>
            </>
          )}
        </View>
        <View
          style={{
            flex: 8,
            borderBottomColor: "#adadad",
            borderBottomWidth: 1
          }}
        >
          <Text style={{ fontSize: 16 }}>{props.value}</Text>
        </View>
        <View
          style={{
            flex: 2,
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            borderBottomColor: "#adadad",
            borderBottomWidth: 1
          }}
        >
          <Icon.Ionicons
            name={Platform.OS === "ios" ? "ios-pricetag" : "md-pricetag"}
            size={18}
          />
        </View>
      </View>
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
