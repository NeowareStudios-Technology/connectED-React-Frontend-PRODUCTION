import React, { Component } from 'react';
import {
    ActivityIndicator,
    Image,
    ImageBackground,
    Platform,
    ScrollView,
    StyleSheet,
    Dimensions,
    Text,
    TouchableOpacity,
    View,
    FlatList,
    LayoutAnimation
  } from "react-native";
  import { Avatar, Button, Divider, ButtonGroup } from "react-native-elements";
  import moment from "moment"
  import { Icon } from "expo";
  import User from "../components/User";
  import Sequencer from "../components/Sequencer";
  import uuidv4 from 'uuid/v4';
  
  let screenHeight = Dimensions.get('window').height;
  import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import EventDetails from '../components/EventDetails';

export default class MyCalendar extends Component {
    static navigationOptions = {
        header: null
      };
    constructor(props) {
    super(props);

    this.state = {
        markedDates: [],
        marked:null,
        activeItem: null,
        user: null,
        events: null,
        userEvents: null, // events created by user
        upcomingEvents: null, // past events the user has volunteered for
        activeTab: 0,
        loading: true
    };
    this.updateTab = this.updateTab.bind(this)
    }

    updateUser = (user) => {
        this.setState({user: user})
      }

  // loads any events the user created and sorts by date
  loadUserEvent = async (eventName, index, callback) => {
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
                let userEvents = []
                // keep state immutable by using slice to return new array
                if (this.state.userEvents) {
                  userEvents = this.state.userEvents.slice();
                }
                let event = responseData;
                event.key = "user-event-" + uuidv4();
                userEvents.push(event);
                this.setState(
                  {
                    userEvents: userEvents,
                    loading: false
                  },
                  () => {
                    callback();
                  }
                );
                this.getEventDates()

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


  // Loads and filters registered events to only include past events sorted by date 
  loadPastEvent = async (eventName, index, callback) => {
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
              // check if date is in past
              let now = moment()
              let eventDate = moment(responseData.date, "MM/DD/YYYY")
              if (responseData && now.isBefore(eventDate, 'day')) {
                let upcomingEvents = []
                // keep state immutable by using slice to return new array
                if (this.state.upcomingEvents) {
                  upcomingEvents = this.state.upcomingEvents.slice();
                }
                let event = responseData;
                event.key = "past-event-" + uuidv4();
                upcomingEvents.push(event);
                this.setState(
                  {
                    upcomingEvents: upcomingEvents,
                    loading: false
                  },
                  () => {
                    callback();
                  }
                );

              } else {
                // event not in the past
                if (!this.state.upcomingEvents) {
                  this.setState({ upcomingEvents: [] },
                    () => {
                      callback();
                    })
                } else {
                  callback()
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
  updateUser() {
    this.loadUser()
  }
  loadEvents = () => {
    // TODO: Don't include duplicate events. only fetch the event once
    let sequence = new Sequencer();
    let registeredEvents = this.state.events.registered_events
    let userEvents = this.state.events.created_events
    if (registeredEvents && registeredEvents.length > 0) {
      registeredEvents.map((eventName, index) => {
        eventName = eventName.replace("_", "/")
        sequence.promise(() => {
          this.loadPastEvent(eventName, index, () => {
            sequence.next();
          });
        });
      });
    } else {
      this.setState({ upcomingEvents: [] })
    }
    if (userEvents && userEvents.length > 0) {
      userEvents.map((eventName, index) => {
        eventName = eventName.replace("_", "/")
        sequence.promise(() => {
          this.loadUserEvent(eventName, index, () => {
            sequence.next();
          });
        });
      });
    } else {
      this.setState({ userEvents: [] })
    }
    sequence.next();
  };

  loadUserOpportunities = async () => {
    let userEvents = [];
    let token = await User.firebase.getIdToken();
    console.log("token", token)
    if (token) {
      try {
        let url =
          "https://connected-dev-214119.appspot.com/_ah/api/connected/v1/profiles/" +
          this.state.user.email +
          "/events";
        fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token
          }
        }).then(response => {
          if (response.ok) {
            try {
              let events = JSON.parse(response._bodyText);
              if (typeof events === "object") {
                this.setState({ events: events }, () => this.loadEvents())
              } else {
                this.setState({ loading: false });
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
  }

  componentDidMount() {
    this.loadUser()
  }
  // componentDidUpdate(prevState){
  //   if(prevState.user !== this.props.navigation.getParam('user')) {
  //     this.loadUser()
  //   }
  // }
  async loadUser() {
    let user = await User.isLoggedIn();
    if (user) {
      this.setState(
        {
          user: user
        },
        () => {
          this.loadUserOpportunities();
        }
      );
    }
    return true;
  }

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

  _keyExtractor = (item, index) => index.toString();

    updateTab = (activeTab) => {
        this.setState({ activeTab })
      }

      openItem = (item, index) => {
        LayoutAnimation.easeInEaseOut();
        this.setState({ activeItem: item });
      };
    
      closeItem = item => {
        LayoutAnimation.easeInEaseOut();
        this.setState({ activeItem: null });
      };
      
      getEventDates() {
        let DatesArray = []
        let myEvents = this.state.userEvents.slice().sort((a, b) => new Date(a.date[0]) - new Date(b.date[0]));

        for(var i = 0; i < myEvents.length; i++){
            let date = myEvents[i].date[0]
            
            let newDate = moment(date, "MM-DD-YYYY").format("YYYY-MM-DD"); 
            DatesArray.push(newDate)
        }
        let myUpcomingEvents = this.state.upcomingEvents.slice().sort((a, b) => new Date(a.date[0]) - new Date(b.date[0]));

        for(var i = 0; i < myUpcomingEvents.length; i++){
            let date = myUpcomingEvents[i].date[0]
            
            let newDate = moment(date, "MM-DD-YYYY").format("YYYY-MM-DD"); 
            DatesArray.push(newDate)
        }
        this.setState({markedDates: DatesArray})
        this.sendDatesToCalendar();
    }
    sendDatesToCalendar = () => {
      var obj = this.state.markedDates.reduce((c, v) => Object.assign(c, {[v]: {selected: true}}), {});
      this.setState({ marked : obj});
  }

    render() {
        let sortedEvents;
        if (!this.state.userEvents) {
            sortedEvents = null
          } else {
            sortedEvents = this.state.userEvents.slice().sort((a, b) => new Date(a.date[0]) - new Date(b.date[0]));
          }
          let sortedUpcomingEvents;
        if (!this.state.upcomingEvents) {
            sortedUpcomingEvents = null
          } else {
            sortedUpcomingEvents = this.state.upcomingEvents.slice().sort((a, b) => new Date(a.date[0]) - new Date(b.date[0]));
          }
        
        const buttons = [ "My Opportunities", "Volunteering"];
        return (

            <View style={styles.container}>
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
            <View style={{height:screenHeight - 300, backgroundColor: "#3788E0"}}>
            {this.state.marked ? 
            <CalendarList
                current={()=>DateNow()}
                pastScrollRange={24}
                futureScrollRange={24}
                style={{
                    backgroundColor: "transparent",
                    paddingTop: 40,
                }}
                markedDates={this.state.marked}
                theme={{
                    calendarBackground: 'transparent',
                    textSectionTitleColor: 'white',
                    dayTextColor: 'white',
                    todayTextColor: 'black',
                    textMonthFontSize: 30,
                    textMonthFontWeight: "bold",
                    textDayFontSize: 18,
                    monthTextColor: 'white',
                    selectedDayBackgroundColor: 'darkblue',
                    arrowColor: 'white',
                }}
            />
            :
            <CalendarList
                current={()=>DateNow()}
                pastScrollRange={24}
                futureScrollRange={24}
                style={{
                    backgroundColor: "transparent",
                    paddingTop: 40,
                }}
                theme={{
                    calendarBackground: 'transparent',
                    textSectionTitleColor: 'white',
                    dayTextColor: 'white',
                    todayTextColor: 'black',
                    textMonthFontSize: 30,
                    textMonthFontWeight: "bold",
                    textDayFontSize: 18,
                    monthTextColor: 'white',
                    selectedDayBackgroundColor: 'darkblue',
                    arrowColor: 'white',
                }}
            />
              }
            </View>
            <View style={{ marginTop: 0, flex: 1, backgroundColor: "#eee" }}>
                <ButtonGroup
                  onPress={this.updateTab}
                  selectedIndex={this.state.activeTab}
                  buttons={buttons}
                  containerStyle={{ paddingBottom: 0, marginBottom: 0}}
                />
                <View style={styles.eventsContainer}>
                  {this.state.activeTab === 0 && (
                      <View style={{flex:1}}>
                        {sortedEvents ? (               
                            
                        <FlatList
                            data={sortedEvents}
                            keyExtractor={this._keyExtractor}
                            renderItem={({item, index}) => 
                            <TouchableOpacity
                                onPress={() => {
                                this.openItem(item, index);
                                }}
                                activeOpacity={1}
                            >
                                <View style={styles.eventListing}>
                                    <View style={{width: 50, height: 50, backgroundColor: '#275FBC'}}>
                                    <Image style={{flex: 1}} resizeMode='cover' source={{ uri:  "data:image/png;base64," + item.e_photo}}></Image>
                                    </View>
                                    <View style={{
                                        marginLeft:10,
                                        paddingLeft:10,
                                        borderLeftColor: 'gray',
                                        borderLeftWidth: 2
                                    }}>
                                        <Text style={{fontWeight: 'bold', fontSize: 20}}>{item.e_title}</Text>
                                        <Text>{moment(item.date, "MM/DD/YYYY").format("MMM Do")}</Text>
                                        <Text>{item.start[0]}</Text>
                                    </View>
                                </View>
                                </TouchableOpacity>
                            }
                        />
                        
                    
                        ) : (
                            <ActivityIndicator
                            style={{ marginBottom: 16 }}
                            size="small"
                            color="#0d0d0d"
                            />
                        )}
                    </View>
                  )}
                  {this.state.activeTab === 1 && (
                    <>
                    {sortedUpcomingEvents ? (
                        
                        <FlatList
                            data={sortedUpcomingEvents}
                            keyExtractor={this._keyExtractor}
                            renderItem={({item, index}) => 
                            <TouchableOpacity
                                onPress={() => {
                                this.openItem(item, index);
                                }}
                                activeOpacity={1}
                            >
                                <View style={styles.eventListing}>
                                    <View style={{width: 50, height: 50, backgroundColor: '#275FBC'}}>
                                    <Image style={{flex: 1}} resizeMode='cover' source={{ uri:  "data:image/png;base64," + item.e_photo}}></Image>
                                    </View>
                                    <View style={{
                                        marginLeft:10,
                                        paddingLeft:10,
                                        borderLeftColor: 'gray',
                                        borderLeftWidth: 2
                                    }}>
                                        <Text style={{fontWeight: 'bold', fontSize: 20}}>{item.e_title}</Text>
                                        <Text>{moment(item.date, "MM/DD/YYYY").format("MMM Do")}</Text>
                                        <Text>{item.start[0]}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>

                            }
                        />
                    
                      ) : (
                          <ActivityIndicator
                            style={{ marginBottom: 16 }}
                            size="small"
                            color="#0d0d0d"
                          />
                        )}


                    </>
                  )}

                </View>
              </View>
            
            {/* <View style={styles.eventsContainer}>
                <Text style={styles.subtitle}>Volunteering</Text>
                <ScrollView >
                    <FlatList
                        data={DummyData}
                        keyExtractor={this._keyExtractor}
                        renderItem={({item}) => 
                            <View style={styles.eventListing}>
                                <View style={{width: 50, height: 50, backgroundColor: '#275FBC'}}/>
                                <View style={{
                                    marginLeft:10,
                                    paddingLeft:10,
                                    borderLeftColor: 'gray',
                                    borderLeftWidth: 2
                                }}>
                                    <Text style={{fontWeight: 'bold', fontSize: 20}}>{item.eventName}</Text>
                                    <Text>{item.date}</Text>
                                    <Text>{item.time}</Text>
                                </View>
                            </View>
                        }
                    />
        
                </ScrollView>
            </View> */}
            </>
            )}
          </View>
    
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    //   backgroundColor: "#3788E0"
    },
    eventsContainer: {
        flex: 1,
        backgroundColor: "#eee",
      paddingLeft: 10,
      paddingRight: 10,
      paddingTop: 10,
    },
    contentContainer: {
      paddingTop: 12
    },
    largeNumber: {
      fontSize: 30,
      fontWeight: "bold"
    },
    subtitle: {
        fontSize: 22,
        color: 'white',
        width: 180,
        marginBottom: 5,
    },
    largeNumberCaption: {
      fontSize: 14,
      marginTop: 3,
      color: "#b0b0b0"
    },
    eventListing: {
        backgroundColor: 'white',
        flex: 1, 
        flexDirection: 'row',
        color: 'black',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
        paddingBottom: 10,
        marginBottom: 10,
        borderColor: 'white',
        borderWidth: 2,
        borderRadius: 5,
    }
  });
  