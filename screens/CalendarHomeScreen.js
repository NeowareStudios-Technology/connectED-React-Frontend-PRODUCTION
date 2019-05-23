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
    FlatList
  } from "react-native";
  import { Avatar, Button, Divider, ButtonGroup } from "react-native-elements";
  import moment from "moment"
  import { Icon } from "expo";
  import User from "../components/User";
  import Sequencer from "../components/Sequencer";
  import uuidv4 from 'uuid/v4';
  import Colors from "../constants/Colors";


  let screenHeight = Dimensions.get('window').height;


  import {Calendar, CalendarList, Agenda} from 'react-native-calendars';

  const DummyData = [
      {
        id: '1',
        eventName: 'Beach Cleanup',
        date: '2019-5-12',
        time: '10:00am',
        imageURL: 'https://images.pexels.com/photos/994605/pexels-photo-994605.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
      },
      {
        id: '2',
        eventName: 'Starbucks Run',
        date: '2019-5-22',
        time: '7:00am',
        imageURL: 'https://images.pexels.com/photos/994605/pexels-photo-994605.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
      },
    ]

export default class MyCalendar extends Component {
    static navigationOptions = {
        header: null
      };
    constructor(props) {
    super(props);

    this.state = {
        markedDates: [],

        user: null,
        events: null,
        userEvents: null, // events created by user
        pastEvents: null, // past events the user has volunteered for
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
              if (responseData && now.isAfter(eventDate, 'day')) {
                let pastEvents = []
                // keep state immutable by using slice to return new array
                if (this.state.pastEvents) {
                  pastEvents = this.state.pastEvents.slice();
                }
                let event = responseData;
                event.key = "past-event-" + uuidv4();
                pastEvents.push(event);
                this.setState(
                  {
                    pastEvents: pastEvents,
                    loading: false
                  },
                  () => {
                    callback();
                  }
                );

              } else {
                // event not in the past
                if (!this.state.pastEvents) {
                  this.setState({ pastEvents: [] },
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
      this.setState({ pastEvents: [] })
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






    // componentDidMount() {
    //     this.getEventDates(DummyData)
    //     // this.getMarkedDates()
    // }



    getEventDates(array) {
        let DatesArray = []
        for(var i = 0; i < array.length; i++){
            DatesArray.push(array[i].date)
            this.setState({markedDates: DatesArray})
        }
    }

    // getMarkedDates(){
    //     let datesObject={}
    //     for(var i=0; i<this.state.markedDates.length; i++){
    //         this.state.markedDates[i] = {selected: true, selectedColor: '#275FBC'}
    //         console.warn(this.state.markedDates[i], 'state')
    //     }
    //     console.warn(datesObject, 'datesobject')
    //     // '2019-05-16': {selected: true, selectedColor: '#275FBC'},
    // }
    _keyExtractor = (item, index) => item.id;

    updateTab = (activeTab) => {
        this.setState({ activeTab })
      }

    render() {
        let sortedEvents;
        if (!this.state.userEvents) {
            sortedEvents = null
          } else {
            sortedEvents = this.state.userEvents.slice().sort((a, b) => new Date(a.date[0]) - new Date(b.date[0]));
          }
        console.log(sortedEvents)

        const buttons = ["Volunteering", "My Opportunities"];
        return (


            <View style={styles.container}>
            <View style={{height:screenHeight - 300}}>
            <CalendarList
                current={()=>DateNow()}
                pastScrollRange={24}
                futureScrollRange={24}
                style={{
                    backgroundColor: "transparent",
                    paddingTop: 40,
                }}
                markedDates={{
                    '2019-05-12': {selected: true, selectedColor: '#275FBC'},
                    '2019-05-22': {selected: true, selectedColor: '#275FBC'},
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
            </View>
            <View style={{ marginTop: 8, flex: 1 }}>
                <ButtonGroup
                  onPress={this.updateTab}
                  selectedIndex={this.state.activeTab}
                  buttons={buttons}
                  containerStyle={{ height: 42 }}
                />
                <View style={styles.eventsContainer}>
                  {this.state.activeTab === 0 && (
                      <View style={{flex:1}}>
                        {sortedEvents ? (               
                    
                        <FlatList
                            data={sortedEvents}
                            keyExtractor={this._keyExtractor}
                            renderItem={({item}) => 
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
                    {sortedEvents ? (
                        
                        <FlatList
                            data={this.state.userEvents}
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
                                        <Text style={{fontWeight: 'bold', fontSize: 20}}>{item.e_title}</Text>
                                        {/* <Text>{item.date}</Text>
                                        <Text>{item.time}</Text> */}
                                    </View>
                                </View>
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
          </View>
    
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
      backgroundColor: "#3788E0"
    },
    eventsContainer: {
        flex: 1,
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
  