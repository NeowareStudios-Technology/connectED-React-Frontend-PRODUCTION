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
    let privacyLabel = item.privacy === "o" ? "Open" : "Private";
    return (
      <>
        <View style={{ flex: 1 }}>
          <View style={{ flex: 4 }}>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 18,
                marginBottom: 6
              }}
            >
              {item.e_title}
            </Text>
            <Text
              style={{
                fontSize: 16,
                marginBottom: 6
              }}
            >
              {item.e_desc}
            </Text>
          </View>
          <View style={{ flex: 10 }}>
            <View style={{ marginBottom: 12 }}>
              <Text>Location:</Text>
              <Text style={{ fontWeight: "bold" }}>
                {item.street} {item.city}, {item.state} {item.zip_code}
              </Text>
            </View>
            <View style={{ marginBottom: 12 }}>
              <Text>Opportunity Status:</Text>
              <Text style={{ fontWeight: "bold" }}>
                {privacyLabel}{" "}
                {item.req_skills && item.req_skills.length > 0 && (
                  <>
                    <Text>/ Required Skills: {item.req_skills.join(" ")}</Text>
                  </>
                )}
              </Text>
            </View>
            <View style={{ marginBottom: 12 }}>
              <Text>Tags:</Text>
              {item.interests && item.interests.length > 0 && (
                <>
                  <View>
                    {item.interests.map((interest, index) => {
                      return (
                        <View key={"interest-" + index}>
                          <Text style={{ fontWeight: "bold" }}>
                            - {interest}
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
}

export default EventDetailsInfo;
