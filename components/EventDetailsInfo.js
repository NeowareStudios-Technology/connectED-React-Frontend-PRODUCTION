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

class EventDetailsInfo extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let item = this.props.event;
    let privacyLabel = item.privacy === "o" ? "Public" : "Private";
    return (
      <>
        <View style={{ flex: 1 }}>
          <View style={{ flex: 4 }}>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 26,
                marginBottom: 5
              }}
            >
              {item.e_title}
            </Text>
            <Text style={{fontWeight: "bold", color: "#2f95dc"}}>
            {privacyLabel}
            </Text>
            <Text
              style={{
                fontSize: 16
              }}
            >
              {item.e_desc}
            </Text>
          </View>
          <View style={{ flex: 10 }}>
            <View style={{ marginBottom: 12 }}>
              <Text style={this.styles.subtitle}>Location:</Text>
              <Text style={{ fontSize: 16 }}>
                {item.street} {item.city}, {item.state} {item.zip_code}
              </Text>
            </View>
            <View style={{ marginBottom: 12 }}>
              <Text style={this.styles.subtitle}>Required Skills:</Text>
              <Text style={{ fontSize: 16 }}>
                
                {item.req_skills && item.req_skills.length > 0 && (
                  <>
                    <Text>{item.req_skills.join(" ")}</Text>
                  </>
                )}
              </Text>
            </View>
            <View style={{ marginBottom: 12 }}>
              <Text style={this.styles.subtitle}>Tags:</Text>
              {item.interests && item.interests.length > 0 && (
                <>
                  <View>
                    {item.interests.map((interest, index) => {
                      return (
                        <View key={"interest-" + index}>
                          <Text style={{ fontSize: 16 }}>
                          { `\u2022  `}{interest}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </>
              )}
            </View>
          </View>
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

export default EventDetailsInfo;
