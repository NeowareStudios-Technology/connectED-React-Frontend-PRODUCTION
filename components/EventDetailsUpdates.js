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
import User from "./User";
import AppData from "../constants/Data";

class EventDetailsUpdates extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      updates: [],
      loading: true
    };
  }

  fetchData = async () => {
    let token = await User.firebase.getIdToken();
    let event = this.props.event;
    if (token) {
      let organizerEmail = event.e_organizer;
      let eventOrigName = event.e_orig_title;
      let url = `https://connected-dev-214119.appspot.com/_ah/api/connected/v1/events/${organizerEmail}/${eventOrigName}/updates`;
      try {
        fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token
          }
        })
          .then(response => {
            if (response.ok) {
              try {
                let data = JSON.parse(response._bodyText);
                if (data) {
                  if (
                    typeof data.updates === "object" &&
                    data.updates.length > 0
                  ) {
                    let normalizedUpdates = [];
                    data.updates.map((update, index) => {
                      let updateObject = {
                        update: update,
                        time: data.u_datetime[index]
                      };
                      normalizedUpdates.push(updateObject);
                    });
                    this.setState({
                      updates: normalizedUpdates,
                      loading: false
                    });
                  }
                }
              } catch (error) {}
            }
          })
          .catch(error => {});
      } catch (error) {}
    }
  };

  componentDidMount() {
    this.fetchData();
  }

  render() {
    let item = this.props.event;
    let privacyLabel = item.privacy === "o" ? "Open" : "Private";
    return (
      <>
        {this.state.loading ? (
          <>
            <View style={{ flex: 1, justifyContent: "center" }}>
              <ActivityIndicator size="large" />
            </View>
          </>
        ) : (
          <>
            <View style={{ paddingBottom: 24 }}>
              {this.state.updates.length > 0 ? (
                <>
                  <Text style={{ marginBottom: 4, fontWeight: "bold" }}>
                    Latest Updates:
                  </Text>
                  <ScrollView contentContainerStyle={{ paddingVertical: 12 }}>
                    {this.state.updates.map((update, index) => {
                      return (
                        <View
                          key={"update-" + index}
                          style={{ marginBottom: 0 }}
                        >
                          <Card containerStyle={{ paddingVertical: 8 }}>
                            <Text>{update.update}</Text>
                            <Text>
                              {moment(update.time, "MM/DD/YYYY-HH:mm").format(
                                "D/M h:mm a"
                              )}
                            </Text>
                          </Card>
                        </View>
                      );
                    })}
                  </ScrollView>
                </>
              ) : (
                <>
                  <Text>There no updates at this time.</Text>
                </>
              )}
            </View>
          </>
        )}
      </>
    );
  }
}

export default EventDetailsUpdates;
