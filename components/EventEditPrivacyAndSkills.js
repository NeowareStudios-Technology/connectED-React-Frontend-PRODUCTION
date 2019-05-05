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
import SkillSelector from "../components/SkillSelector";

import DatePicker from "react-native-datepicker";
let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;


class EventEditPrivacyAndSkills extends React.Component {
  constructor(props) {
    super(props);
    this.model = {
      fields: ["privacy", "req_skills"],
      rules: []
    };

    this.state = {
      skillSelectorOpen: false
    };
  }

  onRemoveSkill = index => {
    if (typeof this.props.req_skills[index] !== "undefined") {
      this.props.req_skills.splice(index, 1);
      this.props.onInputChange("req_skills", this.props.req_skills);
    }
  };

  openSkillSelector = index => {
    this.props.onModalOpen(() => {
      LayoutAnimation.linear();
      this.setState({ skillSelectorOpen: true });
    });
  };

  closeSkillSelector = index => {
    this.props.onModalClose(() => {
      LayoutAnimation.linear();
      this.setState({ skillSelectorOpen: false });
    });
  };

  componentDidMount() {
    if (this.props.onLoadModel) {
      this.props.onLoadModel(this.model);
    }
  }

  render() {
    let selectedSkills = this.props.req_skills || [];
    let skillOne =
      this.props.req_skills && this.props.req_skills[0]
        ? this.props.req_skills[0]
        : "";
    let skillTwo =
      this.props.req_skills && this.props.req_skills[1]
        ? this.props.req_skills[1]
        : "";
    let skillThree =
      this.props.req_skills && this.props.req_skills[2]
        ? this.props.req_skills[2]
        : "";

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
            <View style={{ flexDirection: "row" }}>
              <View
                style={{ flex: 10, flexDirection: "row", paddingVertical: 6 }}
              >
                <Button
                  title="Open"
                  style={{ marginRight: 18 }}
                  titleStyle={{ fontSize: 14 }}
                  onPress={() => {
                    this.props.onInputChange("privacy", "o");
                  }}
                  type={this.props.privacy === "o" ? "solid" : "outline"}
                />
                <Button
                  title="Private"
                  style={{ marginRight: 18 }}
                  titleStyle={{ fontSize: 14 }}
                  onPress={() => {
                    this.props.onInputChange("privacy", "p");
                  }}
                  type={this.props.privacy === "p" ? "solid" : "outline"}
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
            <SkillsInput
              name="skills"
              index={0}
              value={skillOne}
              {...this.props}
              onRemoveSkill={this.onRemoveSkill}
              onSelectOpen={this.openSkillSelector}
            />
            <SkillsInput
              name="skills"
              index={1}
              value={skillTwo}
              {...this.props}
              onRemoveSkill={this.onRemoveSkill}
              onSelectOpen={this.openSkillSelector}
            />
            <SkillsInput
              name="skills"
              index={1}
              value={skillThree}
              {...this.props}
              onRemoveSkill={this.onRemoveSkill}
              onSelectOpen={this.openSkillSelector}
            />
            <Text
              style={{ color: "#adadad", marginTop: 12, paddingHorizontal: 12 }}
            >
              Tip: Adding Required Skills will make your volunteer pool so much
              more limited, adding just 1 Required Skill will help leviate this.
            </Text>
          </View>
          {this.state.skillSelectorOpen && (
            <View
              style={{
                backgroundColor: "#fff",
                width: "100%",
                height: screenHeight * 2/3,
                position: "absolute",
                top: 30,
              }}
            >
              <SkillSelector
                closeAction={this.closeSkillSelector}
                selectedSkills={selectedSkills}
                onSelect={skill => {
                  let currentSkills = selectedSkills;
                  if (
                    currentSkills.indexOf(skill) === -1 &&
                    currentSkills.length < 3
                  ) {
                    currentSkills.push(skill);
                    this.props.onInputChange("req_skills", currentSkills);
                  }
                }}
              />
            </View>
          )}
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
  return (
    <>
      <View
        style={{
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
                  props.onRemoveSkill(props.index);
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
            name={Platform.OS === "ios" ? "ios-git-commit" : "md-git-commit"}
            size={18}
          />
        </View>
      </View>
    </>
  );
}

export default EventEditPrivacyAndSkills;
