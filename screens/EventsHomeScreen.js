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
import { Button, Input } from "react-native-elements";
import { Icon } from "expo";
import User from "../components/User";
import styles from "../constants/Styles";
import Carousel from "react-native-snap-carousel";
import EventListCard from "../components/EventListCard";
import EventDetails from "../components/EventDetails";
import Sequencer from "../components/Sequencer";
import EventSearch from "../components/EventSearch";
import moment from "moment";

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

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
      events: [],
      eventNameArray: [],
      showSearchBar: false
    };
    this.arrayholder = [];

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
                  // keep state immutable by using slice to return new array
                  let events = this.state.events.slice();
                  let event = responseData;
                  event.key = "event-" + index;
                  event.distance = this.state.distances[index];
                  events.push(event);
                  this.arrayholder = events
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
            } catch (error) { }
          }
          else {
            callback();
          }
        });
      } catch (error) { }
    }
  };

  searchFilterFunction = text => {
    const newData = this.arrayholder.filter(item => {
      const itemData = `${item.e_title.toUpperCase()}`;
       const textData = text.toUpperCase();
       return itemData.indexOf(textData) > -1;
    });

    this.setState({ events: newData });
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
                  const newArray = []

                  for (var i=0; i<responseData.events.length; i++){
                    const item = responseData.events[i].split('/')
                    const clean = item[1].split('+').join(' ')
                    newArray.push(clean)
                  }
                  this.arrayholder = responseData.events

                  this.setState(
                    {
                      eventsNames: responseData.events,
                      eventNameArray: newArray,
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
            } catch (error) { }
          } else {
            this.setState({
              loading: false
            });
          }
        });
      } catch (error) { }
    }
  };

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
              .catch(error => { });
          } catch (error) { }
        }
      }
    }
  };

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
              .catch(error => { });
          } catch (error) { }
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

  closeEventSearch = () => {
    this.setState({ showSearchBar: false })
  }

  async componentDidMount() {
    {/* Disable below to not have to log in??? */}
    let user = await User.isLoggedIn();
    if (user) {
      this.fetchData();
    }
  }

  _renderItem = ({ item, index }) => (
    <View
      style={{
        marginHorizontal: -20,
        paddingHorizontal: 2,
      }}
    >
      <TouchableOpacity
        onPress={() => {
          this.openItem(item, index);
        }}
        activeOpacity={1}
      >
        <EventListCard event={item}/>
        
      </TouchableOpacity>
    </View>
  );

  render() {
    if (this.state.showSearchBar) {
      return (
        <View style={styles.container}>
          <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
          >
            <EventSearch
              handleClose={this.closeEventSearch}
              data={this.state.events}
            />
          </ScrollView></View>
      )
    }
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
                  <Text
                    style={{
                      // fontWeight: "bold",
                      color: "#ffffff",
                      fontSize: 21,
                      paddingRight: 12,
                      paddingTop: 12,
                      textAlign: "left",
                      position: "absolute", // for Mall mockup
                      // textShadowOffset: { width: 0.5, height: 0.5 },
                      // textShadowRadius: 2,
                      // textShadowColor: '#000',
                    }}
                    LAUNCH EVENT
                  >
                  </Text>
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
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 0,
                        marginHorizontal: 15
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        {/*
                          Mall user photo can go here in place of `circle +` icon.
                         The below component controls the 'circle +' icon in the upper left hand corner of the screen
                        */}
                        <TouchableOpacity
                          style={{
                            paddingHorizontal: 10,
                            borderRadius: 90,
                            borderColor: "transparent",
                            borderWidth: 2
                          }}
                          onPress={() => {
                            this.props.navigation.navigate("EventCreate");
                          }}
                        >
                        {/* Add Oviedo Mall User photo here */}
                          <View style={{ flex: 1 }}>
                            <Image source={{uri: "http://www.arnold.fun/12a/90/90"}}
                            style={{
                              width: "90%",
                              height: "70%",
                              borderRadius: 50,
                              backgroundColor: 'transparent',
                              paddingTop: 10,
                            }}
                            />
                            <Icon.Ionicons
                              name={Platform.OS === "ios" ? "ios-add-circle-outline" : "md-add-circle-outline"}
                              size={50}
                              color={"transparent"} // #fdf6fab3 couldn't get the user image to show w/out this <Icon> being in the code
                            />
                          </View>
                        </TouchableOpacity>
                        <View>
                          {/* Added the dispalayMallH1 class to change the text color to #fff for Mall mockup */}
                          <Text style={styles.displayMallH1}>EVENTS</Text>
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        {/* Commented out the search bar feature to match Ovied Mall mockup.
                        <TouchableOpacity
                          style={{
                            paddingHorizontal: 10,
                            borderRadius: 90,
                            borderColor: "#000",
                            borderWidth: 0
                          }}
                          onPress={() => {
                            this.setState({ showSearchBar: true })
                          }}
                        >
                          <Icon.Ionicons
                            name={Platform.OS === "ios" ? "ios-search" : "md-search"}
                            size={30}
                          />
                        </TouchableOpacity> */}
                        
                        {/* Below component is for the gear icon in upper right hand corner  */}
                        <TouchableOpacity
                          onPress={() => {
                            console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$TODO: filter')
                          }}
                        >
                          <View>
                            <Image 
                              source={require('../assets/images/gear_icon.png')}
                              style={{
                                backgroundColor: "#999",
                                paddingHorizontal: 10,
                                borderRadius: 90,
                                borderColor: "#fff",
                                borderWidth: 0,
                              }}/>
                          </View>
                          {/* <Icon.Ionicons
                            name={Platform.OS === "ios" ? "ios-options" : "md-options"}
                            size={30}
                          /> */}
                        </TouchableOpacity>

                      </View>
                    </View>
                    <View style={{ flex: 10 }}>
                    {/* Commented out the below Search Input feature for Mall mockup */}
                    {/* <View style={{
                      flexDirection: 'row',
                      marginHorizontal: 20,
                      paddingHorizontal: 10,
                      borderRadius: 10,
                      justifyContent: "space-between",
                      alignItems: "center",
                      backgroundColor: '#eee'
                    }}>
                      <Icon.Ionicons
                        name={Platform.OS === "ios" ? "ios-search" : "md-search"}
                        size={20}
                        style={{paddingTop: 0}}

                      />
                      <Input
                        placeholder="Search Events"
                        inputContainerStyle={{borderBottomWidth: 0}}
                        onChangeText={text=>this.searchFilterFunction(text)}
                        autoCorrect={false}
                      />
                    </View> */}


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
                                  itemWidth={screenWidth - 50 * 2}
                                  sliderWidth={screenWidth}
                                  windowSize={280}
                                />
                                {/* Adds the png but places it on top of the <ScrollView></ScrollView> component */}
                                    

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
