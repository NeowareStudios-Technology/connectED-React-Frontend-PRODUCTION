import React from "react";
import {
  Text,
  View,
  ScrollView,
  ActivityIndicator
} from "react-native";
import { Card } from "react-native-elements";
import moment from "moment";
import User from "./User";

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
                  else {
                    this.setState({
                      loading: false,
                      updates: []
                    })
                  }
                }
              } catch (error) { }
            }
          })
          .catch(error => { });
      } catch (error) { }
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
            <View style={{ flex: 1}}>
              {this.state.updates.length > 0 ? (
                <>
                  <Text style={this.styles.title}>{this.props.event.e_title}</Text>
                  <Text style={{
                    marginBottom: 4,
                    fontSize: 20,
                    marginBottom: 5,
                    color: 'green',
                    fontWeight: 'bold'
                  }}>
                    Latest Updates:
                  </Text>
                  <ScrollView>
                    <View>
                      {this.state.updates.slice(0).reverse().map((update, index) => {
                        return (
                          // <View
                          //   key={"update-" + index}
                          //   style={{ marginBottom: 0 }}
                          // >
                            <Card key={"update-" + index} containerStyle={{ paddingVertical: 8 }}>
                              <Text>{update.update}</Text>
                              <Text>
                                {moment.utc(update.time, "MM/DD/YYYY-HH:mmZ").local().format("M/D h:mm a")}
                              </Text>
                            </Card>
                          // </View>
                        );
                      })}
                    </View>
                  </ScrollView>
                </>
              ) : (
                  <>
                    <View>
                      <Text style={this.styles.title}>{this.props.event.e_title}</Text>
                      <Text style={this.styles.subtitle}>There are no updates at this time.</Text>
                      <Text style={this.styles.text}>If you have any questions, or need to contact the organizer, please send an email to {this.props.event.e_organizer}</Text>
                    </View>
                  </>
                )}
            </View>
          )}
      </>
    );
  }
  styles = {
    title: {
      fontSize: 26,
      marginBottom: 10,
      fontWeight: 'bold'
    },
    subtitle: {
      fontSize: 18,
      marginBottom: 5,
      color: 'red',
      fontWeight: 'bold'
    },
    text: {
      fontSize: 16,
      lineHeight: 24
    }
  }
}

export default EventDetailsUpdates;
