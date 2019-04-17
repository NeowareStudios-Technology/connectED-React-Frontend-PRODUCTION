import React from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform
} from "react-native";
import { Button } from "react-native-elements";
import { Icon } from "expo";
import AppData from "../constants/Data";

class SkillSelector extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <View
          style={{
            borderColor: "#dedede",
            borderWidth: 1,
            height: "100%",
            borderRadius: 12,
            padding: 12,
            paddingBottom: 18
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 2 }}>
              <TouchableOpacity
                onPress={() => {
                  this.props.closeAction();
                }}
              >
                <Icon.Ionicons
                  name={
                    Platform.OS === "ios"
                      ? "ios-close-circle-outline"
                      : "md-close-circle-outline"
                  }
                  style={{ marginTop: -3 }}
                  size={24}
                />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 20 }}>
              <Text style={{ textAlign: "center", fontSize: 18 }}>
                Select a Skill
              </Text>
            </View>
            <View style={{ flex: 2 }} />
          </View>
          <View
            style={{ paddingBottom: 12, paddingTop: 12, paddingHorizontal: 12 }}
          >
            <ScrollView>
              {AppData.availableSkills.map((skill, index) => {
                return (
                  <View key={"interet-" + index}>
                    <Button
                      title={skill}
                      type={
                        this.props.selectedSkills.indexOf(skill) > -1
                          ? "solid"
                          : "outline"
                      }
                      style={{ marginBottom: 12 }}
                      titleStyle={{ fontSize: 14 }}
                      onPress={() => {
                        this.props.onSelect(skill);
                        this.props.closeAction();
                      }}
                    />
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </>
    );
  }
}

export default SkillSelector;
