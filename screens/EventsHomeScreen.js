import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  View,
  Platform
} from "react-native";
import { Button } from "react-native-elements";
import { Icon } from "expo";
import User from "../components/User";
import styles from "../constants/Styles";

class EventsHomeScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      events: []
    };
  }

  fetchData = async () => {
    let token = await User.firebase.getIdToken();

    if (token) {
      try {
        let url =
          "https://connected-dev-214119.appspot.com/_ah/api/connected/v1/events/prefill";
        fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token
          }
        }).then(response => {
          if (response.ok) {
            try {
              let responseData = JSON.parse(response._bodyText);
              if (responseData) {
                console.log("Prefill response", responseData);
              }
            } catch (error) {
            }
          } else {
            this.setState({
              loading: false
            });
          }
        });
      } catch (error) {}
    }
  };

  async componentDidMount() {
    let user = await User.isLoggedIn();
    if (user) {
      this.fetchData();
    }
  }

  render() {
    return (
      <>
        <View style={styles.container}>
          <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 12
              }}
            >
              <View>
                <TouchableOpacity
                  style={{
                    paddingHorizontal: 10,
                    borderRadius: 90,
                    borderColor: "#000",
                    borderWidth: 0
                  }}
                  onPress={() => {
                    this.props.navigation.navigate("EventCreate");
                  }}
                >
                  <Icon.Ionicons
                    name={Platform.OS === "ios" ? "ios-add" : "md-add"}
                    size={38}
                  />
                </TouchableOpacity>
              </View>
              <View>
                <Text style={styles.displayH1}>Events</Text>
              </View>
            </View>
            {this.state.loading ? (
              <>
                <View
                  style={{ justifyContent: "center", alignContent: "center" }}
                >
                  <ActivityIndicator size="large" style={{ marginTop: 120 }} />
                </View>
              </>
            ) : (
              <>
                {this.state.events.length > 0 ? (
                  <>
                    <Text>Events...</Text>
                  </>
                ) : (
                  <>
                    <View
                      style={{
                        marginTop: 12,
                        paddingHorizontal: 24,
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                    >
                      <Text style={{ fontSize: 18, textAlign: "center" }}>
                        There are no active events at this moment.
                      </Text>
                      <Button
                        style={{ marginTop: 12 }}
                        title="Create An Event"
                        onPress={() => {
                          this.props.navigation.navigate("EventCreate");
                        }}
                      />
                    </View>
                  </>
                )}
              </>
            )}
          </ScrollView>
        </View>
      </>
    );
  }
}

export default EventsHomeScreen;
