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
  LayoutAnimation,
  Dimensions
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

// let {height, width} = Dimensions.get('window');
let screenWidth = Dimensions.get('window').width;

class EventsHomeScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);

    this.state = {
      carouselFirstItem: 0,
      activeItem: null,
      loading: true,
      eventsNames: [],
      distances: [],
      events: []
    };
  }

  loadEvent = async (eventName, index, callback) => {
    console.log("LOAD EVENT: " + eventName)
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
                  // keep state immutable by using slice to return new array
                  let events = this.state.events.slice();
                  let event = responseData;
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
    console.log("LOAD EVENTS")
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
    console.log("FETCH DATA")
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
              console.log(responseData)
              if (responseData) {
                if (typeof responseData.events === "object") {
                  this.setState(
                    {
                      eventsNames: responseData.events,
                      distances: responseData.distances
                    },
                    () => {
                      console.log('state eventsNames and distances set. load events...')
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

/* NEW */
  volunteer = async () => {
    if (this.state.activeItem) {
      let isRegistered = false;
      if (
        typeof this.state.activeItem.is_registered !== "undefined" &&
        this.state.activeItem.is_registered !== "0"
      ) {
        isRegistered = true;
      }
      if (!isRegistered) {
        let token = await User.firebase.getIdToken();

        if (token) {
          let organizerEmail = this.state.activeItem.e_organizer;
          let eventOrigName = this.state.activeItem.e_orig_title;
          let url = `https://connected-dev-214119.appspot.com/_ah/api/connected/v1/events/${organizerEmail}/${eventOrigName}/registration`;
          let putData = {
            user_action: "both"
          };
          try {
            let bodyData = JSON.stringify(putData);
            fetch(url, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
              },
              body: bodyData
            })
              .then(response => {
                if (response.ok) {
                  let events = this.state.events;
                  let eventIndex = null;
                  let event = events.find((anEvent, index) => {
                    if (anEvent === this.state.activeItem) {
                      eventIndex = index;
                      return true;
                    }
                    return false;
                  });
                  if (eventIndex) {
                    events[eventIndex].is_registered = "1";
                  }
                  this.setState({
                    events: events,
                    activeItem: events[eventIndex]
                  });
                }
              })
              .catch(error => {});
          } catch (error) {}
        }
      }
    }
  };
/* NEW */
  deregister = async () => {
    if (this.state.activeItem) {
      let isRegistered = false;
      if (
        typeof this.state.activeItem.is_registered !== "undefined" &&
        this.state.activeItem.is_registered !== "0"
      ) {
        isRegistered = true;
      }
      if (isRegistered) {
        let token = await User.firebase.getIdToken();

        if (token) {
          let organizerEmail = this.state.activeItem.e_organizer;
          let eventOrigName = this.state.activeItem.e_orig_title;
          let url = `https://connected-dev-214119.appspot.com/_ah/api/connected/v1/events/${organizerEmail}/${eventOrigName}/registration`;
          try {
            fetch(url, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
              }
            })
              .then(response => {
                if (response.ok) {
                  let events = this.state.events;
                  let eventIndex = null;
                  let event = events.find((anEvent, index) => {
                    if (anEvent === this.state.activeItem) {
                      eventIndex = index;
                      return true;
                    }
                    return false;
                  });
                  if (eventIndex) {
                    events[eventIndex].is_registered = "0";
                  }
                  this.setState({
                    events: events,
                    activeItem: events[eventIndex]
                  });
                }
              })
              .catch(error => {});
          } catch (error) {}
        }
      }
    }
  };

  openItem = (item, index) => {
    LayoutAnimation.easeInEaseOut();
    this.setState({ activeItem: item, carouselFirstItem: index });
  };

  closeItem = item => {
    LayoutAnimation.easeInEaseOut();
    this.setState({ activeItem: null });
  };

  async componentDidMount() {
    let user = await User.isLoggedIn();
    if (user) {
      this.fetchData();
    }
  }

  _renderItem = ({ item, index }) => (
    <View
      style={{
        marginHorizontal: -20,
        paddingHorizontal: 2
      }}
    >
      <TouchableOpacity
        onPress={() => {
          this.openItem(item, index);
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
                <View style={{ flex: 1 }}>
                  <EventDetails
                    event={this.state.activeItem}
                    onClose={this.closeItem}
                    onVolunteer={() => {
                      this.volunteer();
                    }}
                    onDeregister={() => {
                      this.deregister();
                    }}
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
                              firstItem={this.state.carouselFirstItem}
                              itemWidth={screenWidth - 50*2}
                              sliderWidth={screenWidth}
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
