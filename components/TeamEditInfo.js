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

class TeamEditInfo extends React.Component {
  constructor(props) {
    super(props);
    this.model = {
      fields: ["t_name", "t_desc", "t_city", "t_state"],
      rules: [
        {
          validator: value => {
            return !validator.isEmpty(value);
          },
          fields: ["t_name"],
          message: "Please enter a name for this team."
        },
        {
          validator: value => {
            return !validator.isEmpty(value);
          },
          fields: ["t_desc"],
          message: "Please enter a short description for this team."
        },
        {
            validator: value => {
              return !validator.isEmpty(value);
            },
            fields: ["t_city"],
            message: "Please enter a team city."
          },
          {
            validator: value => {
              return !validator.isEmpty(value);
            },
            fields: ["t_state"],
            message: "Please enter the state."
          },
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
            label="Team Name"
            name="t_name"
            value={this.props.t_name}
            onChangeText={value => {
              this.props.onInputChange("t_name", value);
            }}
            containerStyle={{ marginBottom: 12 }}
            placeholder="Team Name"
            errorMessage={
              typeof this.props.errors.t_name !== "undefined"
                ? this.props.errors.t_name[0]
                : ""
            }
            inputStyle={{
              fontSize: 16
            }}
          />

          <Input
            label="Team Description"
            name="t_desc"
            value={this.props.t_desc}
            onChangeText={value => {
              this.props.onInputChange("t_desc", value);
            }}
            containerStyle={{ marginBottom: 12 }}
            placeholder="Team Description"
            multiline={true}
            inputStyle={{ height: 60 }}
            numberOfLines={4}
            errorMessage={
              typeof this.props.errors.t_desc !== "undefined"
                ? this.props.errors.t_desc[0]
                : ""
            }
            inputStyle={{
              fontSize: 16
            }}
          />

          <Input
            label="City"
            name="t_city"
            value={this.props.t_city}
            onChangeText={value => {
              this.props.onInputChange("t_city", value);
            }}
            containerStyle={{ marginBottom: 6 }}
            placeholder="City"
            errorMessage={
              typeof this.props.errors.t_city !== "undefined"
                ? this.props.errors.t_city[0]
                : ""
            }
          />

          <Input
            label="State"
            name="t_state"
            value={this.props.t_state}
            onChangeText={value => {
              this.props.onInputChange("t_state", value);
            }}
            containerStyle={{ marginBottom: 6 }}
            placeholder="State"
            errorMessage={
              typeof this.props.errors.t_state !== "undefined"
                ? this.props.errors.t_state[0]
                : ""
            }
          />
        </View>
      </>
    );
  }
}

export default TeamEditInfo;
