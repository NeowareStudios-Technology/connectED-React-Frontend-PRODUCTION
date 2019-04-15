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
import Sequencer from "../components/Sequencer";
import styles from "../constants/Styles";

const validator = require("validator");

class EventEditInfo extends React.Component {
  constructor(props) {
    super(props);
    this.model = {
      fields: ["e_title", "e_desc"],
      rules: [
        {
          validator: value => {
            return !validator.isEmpty(value);
          },
          fields: ["e_title"],
          message: "Please enter a title for this event."
        },
        {
          validator: value => {
            return !validator.isEmpty(value);
          },
          fields: ["e_desc"],
          message: "Please enter a short description for this event."
        }
      ]
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
        <View>
          <Input
            name="e_title"
            value={this.props.e_title}
            onChangeText={value => {
              this.props.onInputChange("e_title", value);
            }}
            containerStyle={{ marginBottom: 12 }}
            placeholder="Opportunity Title"
            errorMessage={
              this.props.errors.e_title.length > 0
                ? this.props.errors.e_title[0]
                : ""
            }
            inputStyle={{
              fontSize: 24
            }}
          />

          <Input
            name="e_desc"
            value={this.props.e_desc}
            onChangeText={value => {
              this.props.onInputChange("e_desc", value);
            }}
            containerStyle={{ marginBottom: 12 }}
            placeholder="What will happen?"
            multiline={true}
            inputStyle={{ height: 60 }}
            numberOfLines={4}
            errorMessage={
              this.props.errors.e_desc.length > 0
                ? this.props.errors.e_desc[0]
                : ""
            }
            inputStyle={{
              fontSize: 16
            }}
          />
          <View style={{ marginTop: 12, paddingHorizontal: 12 }}>
            <Text style={{ fontSize: 16 }}>Date</Text>
            <DatePicker
              style={{ width: "100%" }}
              date={this.props.date}
              mode="date"
              placeholder="select date"
              format="MMMM D, YYYY"
              minDate="2019-01-01"
              maxDate="2025-06-01"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              iconComponent={
                <Icon.Ionicons
                  name={Platform.OS === "ios" ? "ios-calendar" : "md-calendar"}
                  size={26}
                />
              }
              customStyles={{
                dateInput: {
                  borderTopWidth: 0,
                  borderRightWidth: 0,
                  borderLeftWidth: 0,
                  alignItems: "left"
                }
              }}
              onDateChange={value => {
                this.props.onInputChange("date", value);
              }}
            />
          </View>
          <View style={{ marginTop: 24, paddingHorizontal: 12 }}>
            <Text style={{ fontSize: 16 }}>Start and End Time</Text>
            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 5 }}>
                <DatePicker
                  style={{ width: "100%" }}
                  date={this.props.start}
                  mode="time"
                  format="h:m a"
                  placeholder="select start"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  showIcon={false}
                  customStyles={{
                    dateInput: {
                      borderTopWidth: 0,
                      borderRightWidth: 0,
                      borderLeftWidth: 0,
                      alignItems: "center"
                    }
                  }}
                  onDateChange={value => {
                    this.props.onInputChange("start", value);
                  }}
                />
              </View>
              <View style={{ flex: 1, justifyContent: "center" }}>
                <Text>to</Text>
              </View>
              <View style={{ flex: 5 }}>
                <DatePicker
                  style={{ width: "100%" }}
                  date={this.props.end}
                  mode="time"
                  format="h:m a"
                  placeholder="select end"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  showIcon={false}
                  customStyles={{
                    dateInput: {
                      borderTopWidth: 0,
                      borderRightWidth: 0,
                      borderLeftWidth: 0,
                      alignItems: "center"
                    }
                  }}
                  onDateChange={value => {
                    this.props.onInputChange("end", value);
                  }}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Icon.Ionicons
                  name={Platform.OS === "ios" ? "ios-time" : "md-time"}
                  size={26}
                />
              </View>
            </View>
          </View>
          <View style={{ marginTop: 24 }}>
            <Input
              name="capacity"
              value={this.props.capacity}
              onChangeText={value => {
                this.props.onInputChange("capacity", value);
              }}
              label="Number of Volunteers Needed"
              placeholder="Number of Volunteers Needed"
              errorMessage={
                this.props.errors.e_desc.length > 0
                  ? this.props.errors.e_desc[0]
                  : ""
              }
              labelStyle={{
                fontSize: 16,
                fontWeight: "normal",
                color: "#000"
              }}
              inputStyle={{
                fontSize: 16
              }}
              rightIcon={
                <Icon.Ionicons
                  name={Platform.OS === "ios" ? "ios-people" : "md-people"}
                  size={26}
                />
              }
            />
          </View>
        </View>
      </>
    );
  }
}

export default EventEditInfo;
