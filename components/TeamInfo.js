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
                fontSize: 28,
                marginBottom: 5,
                marginTop: 10
              }}
            >
              {item.t_name}
            </Text>
            <Text style={{fontWeight: "bold", color: "#2f95dc", fontSize: 20, marginBottom: 5}}>
            {privacyLabel}
            </Text>
            <View style={{ flex: 1 }}>
            <View style={{ marginBottom: 12, marginTop: 10 }}>
              <Text style={this.styles.subtitle}>Location:</Text>
              <Text style={this.styles.text}>
              {`${item.t_city}, ${item.t_state}`}
              </Text>
            </View>
            <View style={{ marginBottom: 12, marginTop: 10 }}>
              <Text style={this.styles.subtitle}>Description:</Text>
              <Text style={this.styles.text}>
              {item.t_desc}
              </Text>
            </View>
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
      fontSize: 18,
      lineHeight: 27,
    }
  }
}

export default TeamInfo;
