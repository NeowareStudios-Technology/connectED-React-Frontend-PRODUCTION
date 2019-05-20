import React from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  Image,
  ImageBackground,
  ActivityIndicator
} from "react-native";
import { Button, Card } from "react-native-elements";
import { Icon } from "expo";
import moment from "moment";
import AppData from "../constants/Data";

class TeamInfo extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let item = this.props.team;
    let privacyLabel = item.t_privacy === "o" ? "Public" : "Private";
    return (
      <>
        <View style={{ flex: 1 }}>
        <ScrollView>
          <View>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 26,
                marginBottom: 5
              }}
            >
              {item.t_name}
            </Text>
            <Text style={{fontWeight: "bold", color: "#2f95dc"}}>
            {privacyLabel}
            </Text>
            <Text
              style={{
                fontSize: 16,
                marginBottom: 10
              }}
            >
              {item.t_desc}
            </Text>
          </View>
          <View style={{ flex: 10 }}>
            <View style={{ marginBottom: 12 }}>
              <Text style={this.styles.subtitle}>Location:</Text>
              <Text style={{ fontSize: 16 }}>
              {`${item.t_city}, ${item.t_state}`}
              </Text>
            </View>
          </View>
          </ScrollView>
        </View>
      </>
    );
  }
  styles={
    title: {
      fontSize: 26,
      marginBottom: 5
    },
    subtitle: {
      fontSize: 20,
      marginBottom: 5,
      fontWeight: 'bold'
    },
    text: {
      fontSize: 16,
      lineHeight: 24
    }
  }
}

export default TeamInfo;
