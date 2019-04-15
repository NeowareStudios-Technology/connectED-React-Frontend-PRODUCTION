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

class EventEditLocation extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <View>
          <Text style={{ textAlign: "center", fontSize: 24, marginBottom: 12 }}>
            Add Event Location
          </Text>
          <Input
            name="street"
            value={this.props.street}
            onChangeText={value => {
              this.props.onInputChange("street", value);
            }}
            containerStyle={{ marginBottom: 6 }}
            placeholder="Street"
            errorMessage={
              this.props.errors.street.length > 0
                ? this.props.errors.street[0]
                : ""
            }
          />
          <Input
            name="city"
            value={this.props.city}
            onChangeText={value => {
              this.props.onInputChange("city", value);
            }}
            containerStyle={{ marginBottom: 6 }}
            placeholder="City"
            errorMessage={
              this.props.errors.city.length > 0 ? this.props.errors.city[0] : ""
            }
          />

          <Input
            name="state"
            value={this.props.state}
            onChangeText={value => {
              this.props.onInputChange("state", value);
            }}
            containerStyle={{ marginBottom: 6 }}
            placeholder="State"
            errorMessage={
              this.props.errors.state.length > 0
                ? this.props.errors.state[0]
                : ""
            }
          />
          <Input
            name="zip_code"
            value={this.props.zip_code}
            onChangeText={value => {
              this.props.onInputChange("zip_code", value);
            }}
            containerStyle={{ marginBottom: 6 }}
            placeholder="Zip Code"
            errorMessage={
              this.props.errors.zip_code.length > 0
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
