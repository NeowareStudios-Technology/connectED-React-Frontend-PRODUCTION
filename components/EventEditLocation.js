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

const validator = require("validator");

class EventEditLocation extends React.Component {
  constructor(props) {
    super(props);

    this.model = {
      fields: ["street", "city", "state", "zip_code"],
      rules: [
        {
          validator: value => {
            return !validator.isEmpty(value);
          },
          fields: ["street"],
          message: "Please enter the street address for this event."
        },
        {
          validator: value => {
            return !validator.isEmpty(value);
          },
          fields: ["city"],
          message: "Please enter the city where the event will take place."
        },
        {
          validator: value => {
            return !validator.isEmpty(value);
          },
          fields: ["state"],
          message: "Please enter the state where the event will take place."
        },
        {
          validator: value => {
            return !validator.isEmpty(value);
          },
          fields: ["zip_code"],
          message: "Please enter the zip code for this event."
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
          <Text style={{ textAlign: "center", fontSize: 24, marginBottom: 12 }}>
            Add Event Location
          </Text>
          <Input
            label="Street"
            name="street"
            value={this.props.street}
            onChangeText={value => {
              this.props.onInputChange("street", value);
            }}
            containerStyle={{ marginBottom: 6 }}
            placeholder="Street"
            errorMessage={
              typeof this.props.errors.street !== "undefined"
                ? this.props.errors.street[0]
                : ""
            }
          />
          <Input
            label="City"
            name="city"
            value={this.props.city}
            onChangeText={value => {
              this.props.onInputChange("city", value);
            }}
            containerStyle={{ marginBottom: 6 }}
            placeholder="City"
            errorMessage={
              typeof this.props.errors.city !== "undefined"
                ? this.props.errors.city[0]
                : ""
            }
          />

          <Input
            label="State"
            name="state"
            value={this.props.state}
            onChangeText={value => {
              this.props.onInputChange("state", value);
            }}
            containerStyle={{ marginBottom: 6 }}
            placeholder="State"
            errorMessage={
              typeof this.props.errors.state !== "undefined"
                ? this.props.errors.state[0]
                : ""
            }
          />
          <Input
            label="Zip Code"
            name="zip_code"
            value={this.props.zip_code}
            onChangeText={value => {
              this.props.onInputChange("zip_code", value);
            }}
            containerStyle={{ marginBottom: 6 }}
            placeholder="Zip Code"
            keyboardType="numeric"
            errorMessage={
              typeof this.props.errors.zip_code !== "undefined"
                ? this.props.errors.zip_code[0]
                : ""
            }
          />
        </View>
      </>
    );
  }
}

export default EventEditLocation;
