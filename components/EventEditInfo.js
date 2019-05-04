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
import moment from "moment";

const validator = require("validator");

class EventEditInfo extends React.Component {
  constructor(props) {
    super(props);
    this.model = {
      fields: ["e_title", "e_desc", "date", "start", "end", "capacity"],
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
        },
        {
          validator: value => {
            return typeof value === "object" && value.length > 0;
          },
          fields: ["date"],
          message: "Please enter a valid date for this event."
        },
        {
          validator: value => {
            return typeof value === "object" && value.length > 0;
          },
          fields: ["start"],
          message: "select start"
        },
        {
          validator: value => {
            return typeof value === "object" && value.length > 0;
          },
          fields: ["end"],
          message: "select end"
        },
        {
          validator: value => {
            return !validator.isEmpty(value);
          },
          fields: ["capacity"],
          message: "Please enter how many volunteers you will need."
        },
        {
          validator: value => {
            return validator.isInt(value);
          },
          fields: ["capacity"],
          message: "Please enter an integer number."
        }
      ]
    };
  }

  onDateChange = value => {
    let dateObject = moment(value, "MMMM D, YYYY");
    let dayOfWeekNumber = dateObject.day();
    let daysOfWeek = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    let day = daysOfWeek[dayOfWeekNumber];
    let formattedDate = dateObject.format("YYYY-MM-DD");
    this.props.onInputChange("date", [formattedDate]);
    this.props.onInputChange("day", day);
  };

  onTimeChange = (attribute, value) => {
    let timeObject = moment(value, "h:mm a");
    let formattedTime = timeObject.format("HH:mm");
    this.props.onInputChange(attribute, [formattedTime]);
  };
  componentDidMount() {
    if (this.props.onLoadModel) {
      this.props.onLoadModel(this.model);
    }
  }
  render() {
    let date =
      typeof this.props.date === "object"
        ? moment(this.props.date[0], "YYYY-MM-DD")
        : "";
    let start =
      typeof this.props.start === "object"
        ? moment(this.props.start[0], "HH:mm")
        : "";
    let end =
      typeof this.props.end === "object"
        ? moment(this.props.end[0], "HH:mm")
        : "";
    let day = typeof this.props.day ? this.props.day : "";
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
              typeof this.props.errors.e_title !== "undefined"
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
              typeof this.props.errors.e_desc !== "undefined"
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
              date={date}
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
                }
              }}
              onDateChange={value => {
                this.onDateChange(value);
              }}
            />
            {typeof this.props.errors["date"] !== "undefined" && (
              <>
                <Text style={styles.errorMessage}>
                  {this.props.errors["date"][0]}
                </Text>
              </>
            )}
          </View>
          <View style={{ marginTop: 24, paddingHorizontal: 12 }}>
            <Text style={{ fontSize: 16 }}>Start and End Time</Text>
            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 5 }}>
                <DatePicker
                  style={{ width: "100%" }}
                  date={start}
                  mode="time"
                  format="h:mm a"
                  placeholder="select start"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  showIcon={false}
                  customStyles={{
                    dateInput: {
                      borderTopWidth: 0,
                      borderRightWidth: 0,
                      borderLeftWidth: 0,
                    }
                  }}
                  onDateChange={value => {
                    this.onTimeChange("start", value);
                  }}
                />
                {typeof this.props.errors["start"] !== "undefined" && (
                  <>
                    <Text style={styles.errorMessage}>
                      {this.props.errors["start"][0]}
                    </Text>
                  </>
                )}
              </View>
              <View style={{ flex: 1, justifyContent: "center" }}>
                <Text>to</Text>
              </View>
              <View style={{ flex: 5 }}>
                <DatePicker
                  style={{ width: "100%" }}
                  date={end}
                  mode="time"
                  format="h:mm a"
                  placeholder="select end"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  showIcon={false}
                  customStyles={{
                    dateInput: {
                      borderTopWidth: 0,
                      borderRightWidth: 0,
                      borderLeftWidth: 0,
                    }
                  }}
                  onDateChange={value => {
                    this.onTimeChange("end", value);
                  }}
                />
                {typeof this.props.errors["end"] !== "undefined" && (
                  <>
                    <Text style={styles.errorMessage}>
                      {this.props.errors["end"][0]}
                    </Text>
                  </>
                )}
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
                typeof this.props.errors.capacity !== "undefined" &&
                this.props.errors.capacity.length > 0
                  ? this.props.errors.capacity[0]
                  : ""
              }
              labelStyle={{
                fontSize: 16,
                fontWeight: "normal",
                color: "#000"
              }}
              inputStyle={{
                fontSize: 16,
                textAlign: "center"
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
