import React from "react";
import {
  Image,
  ImageBackground,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Text,
  View,
  Platform,
  LayoutAnimation
} from "react-native";
import { Button, Card } from "react-native-elements";
import { Icon } from "expo";
import User from "../components/User";
import styles from "../constants/Styles";
import Carousel from "react-native-snap-carousel";
import EventListCard from "../components/EventListCard";
import EventDetails from "../components/EventDetails";
import Sequencer from "../components/Sequencer";
import moment from "moment";
class EventsHomeScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);

    this.state = {
      activeItem: null,
      loading: true,
      eventsNames: [],
      distances: [],
      events: []
    };
  }

  loadEvent = async (eventName, index, callback) => {
    let token = await User.firebase.getIdToken();

    if (token) {
      try {
        let url =
          "https://connected-dev-214119.appspot.com/_ah/api/connected/v1/events/" +
          eventName;
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
                if (typeof responseData.e_title === "string") {
                  let events = this.state.events;
                  let event = responseData;
                  console.log("Event availabiility", event);
                  event.key = "event-" + index;
                  event.distance = this.state.distances[index];
                  events.push(event);
                  this.setState(
                    {
                      events: events,
                      loading: false
                    },
                    () => {
                      callback();
                    }
                  );
                }
              }
            } catch (error) {}
          }
        });
      } catch (error) {}
    }
  };

  loadEvents = () => {
    let sequence = new Sequencer();

    if (this.state.eventsNames.length > 0) {
      this.state.eventsNames.map((eventName, index) => {
        sequence.promise(() => {
          this.loadEvent(eventName, index, () => {
            sequence.next();
          });
        });
      });
    }

    sequence.next();
  };

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
                if (typeof responseData.events === "object") {
                  this.setState(
                    {
                      eventsNames: responseData.events,
                      distances: responseData.distances
                    },
                    () => {
                      this.loadEvents();
                    }
                  );
                } else {
                  this.setState({ loading: false });
                }
              }
            } catch (error) {}
          } else {
            this.setState({
              loading: false
            });
          }
        });
      } catch (error) {}
    }
  };

  openItem = item => {
    LayoutAnimation.linear();
    this.setState({ activeItem: item });
  };

  closeItem = item => {
    LayoutAnimation.linear();
    this.setState({ activeItem: null });
  };

  async componentDidMount() {
    let user = await User.isLoggedIn();
    if (user) {
      this.fetchData();
    }
  }

  _renderItem = ({ item }) => (
    <View
      style={{
        marginHorizontal: -20,
        paddingHorizontal: 2
      }}
    >
      <TouchableOpacity
        onPress={() => {
          this.openItem(item);
        }}
      >
        <EventListCard event={item} />
      </TouchableOpacity>
    </View>
  );

  render() {
    return (
      <>
        <View style={styles.container}>
          <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
          >
            {this.state.activeItem ? (
              <>
                <View style={{flex: 1 }}>
                  <EventDetails
                    event={this.state.activeItem}
                    onClose={this.closeItem}
                  />
                </View>
              </>
            ) : (
              <>
                <View style={{ flex: 1 }}>
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
                  <View style={{ flex: 10 }}>
                    {this.state.loading ? (
                      <>
                        <View
                          style={{
                            justifyContent: "center",
                            alignContent: "center"
                          }}
                        >
                          <ActivityIndicator
                            size="large"
                            style={{ marginTop: 120 }}
                          />
                        </View>
                      </>
                    ) : (
                      <>
                        {this.state.events.length > 0 ? (
                          <>
                            <Carousel
                              layout="default"
                              ref={c => {
                                this._carousel = c;
                              }}
                              data={this.state.events}
                              extraData={this.state}
                              renderItem={this._renderItem}
                              itemWidth={230}
                              sliderWidth={300}
                              windowSize={280}
                            />
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
                              <Text
                                style={{ fontSize: 18, textAlign: "center" }}
                              >
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
                  </View>
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </>
    );
  }
}

export default EventsHomeScreen;
