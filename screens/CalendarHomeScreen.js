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
    SafeAreaView,
    FlatList,
    LayoutAnimation,
    TouchableHighlight
  } from "react-native";
import { Avatar, Button, Divider, ButtonGroup } from "react-native-elements";
import moment from "moment"
import { Icon } from "expo";
import EventListCard from '../components/EventListCard';
import User from "../components/User";
import Sequencer from "../components/Sequencer";
import uuidv4 from 'uuid/v4';

import Carousel, { Pagination } from 'react-native-snap-carousel';

let screenHeight = Dimensions.get('window').height;
let screenWidth = Dimensions.get('window').width;

import {Calendar, CalendarList, Agenda, LocaleConfig} from 'react-native-calendars';
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
        pastEvents: null, // past events the user has volunteered for
        activeTab: 0,
        loading: true,
        activeIndex:0,
        carouselItems: [
         [ { title: "Tech & Talk", date: "June 3rd", url: "http://www.arnold.fun/50/50" },
           { title: "Walkathon 2019", date: "June 14th", url: "http://www.placepuppy.net/50/50" } ],
        [ { title: "Linux Hacking", date: "June 16th", url: "https://placebear.com/50/50" },
        { title: "PWA Talk", date: "June 29th", url: "http://placekitten.com/50/50" } ],
        [ { title: "Wild Event", date: "July 2nd", url: "http://www.arnold.fun/50/50" },
        { title: "500K Fun Run", date: "August 15th", url: "http://www.placepuppy.net/50/50" } ],
        [{ title: "Tree Planting", date: "October 2nd", url: "https://placebear.com/50/50" },
          { title: "Cool Activity", date: "June 2nd", url: "http://placekitten.com/50/50" }],
        [{ title: "Block Chain Hackathon", date: "December 2nd", url: "https://placebear.com/50/50" },
          { title: "Linux Festival", date: "June 12th", url: "http://placekitten.com/50/50" }],
        [{ title: "React Workshop", date: "May 4th", url: "https://placebear.com/50/50" },
          { title: "Ingress Gathering", date: "June 23rd", url: "http://placekitten.com/50/50" }],
        ]
    };

    // Need the entire ojbect in order to replace the days of the week w/ the dayNamesShort array.
    LocaleConfig.locales['en'] = {
      monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      monthNamesShort: ['Jan.', 'Feb.', 'Mar', 'April', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'],
      dayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      dayNamesShort:
      ['S', 'M', 'T', 'W', 'T', 'F', 'S']
    };
    LocaleConfig.defaultLocale = 'en';


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
        this.setState({markedDates: DatesArray})
        this.sendDatesToCalendar();
    }
    sendDatesToCalendar = () => {
      var obj = this.state.markedDates.reduce((c, v) => Object.assign(c, {[v]: {selected: true}}), {});
      this.setState({ marked : obj});
  }


  /*********************************************************************
   *  START react-native-snap-carousel
   * 
   ***********************************************************************/
  _renderItem({item,index}){
    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <View style={styles.eventContainer}>
            <Image  
              style={styles.image}
              source={{ uri: item[0].url }}
            />
            <View style={styles.eventListCard}></View>
            <View style={{ flex: 1, flexDirection: 'column' }}>
              <Text style={styles.eventTitle} >{item[0].title}</Text>
              <Text style={styles.eventDate} >{item[0].date}</Text>
            </View>
        </View>
          
        <View style={styles.eventContainer}> 
          <Image  
            style={styles.image}
            source={{ uri: item[1].url }}
          />
          <View style={styles.eventListCard}></View>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <Text style={styles.eventTitle} >{item[1].title}</Text>
            <Text style={styles.eventDate} >{item[1].date}</Text>
          </View>
        </View>
      </View>
    )
  }

  get pagination() {
    const { carouselItems, activeSlide } = this.state;
    return (
      <Pagination
        dotsLength={carouselItems.length}
        //TODO: Fix, is marked required but its values is undefined
        activeDotIndex={activeSlide}
        containerStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.0)', paddingVertical: 15 }}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          marginHorizontal: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.92)'  // 'rgba(0, 0, 0, 0.25)'
        }}
        inactiveDotStyle={{
          // Define styles for inactive dots here
          // width: 10,
          // height: 10,
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderRadius: 5,
          borderColor: 'rgba(255, 255, 255, 0.92)'
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    );
  }
  /* END react-native - snap - carousel
   *********************************************************************** */

    render() {
        let sortedEvents;
        if (!this.state.userEvents) {
            sortedEvents = null
          } else {
          
            sortedEvents = this.state.userEvents.slice().sort((a, b) => new Date(a.date[0]) - new Date(b.date[0]));
            // const markedEventDates={}
            // for(var i=0; i<sortedEvents.length; i++){
            //     console.log(sortedEvents[i].date[0])
            //     const date = sortedEvents[i].date[0]
            //     markedEventDates[date] = {selected: true, selectedColor: '#275FBC'}
            // }
            // console.log(markedEventDates)
          }
        // console.log(sortedEvents)
        
        const buttons = [ "Volunteering", "My Opportunities"];
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
                    textSectionTitleColor: '#CDCEC5', //white
                    dayTextColor: '#CDCEC5', //white
                    todayTextColor: '#3788E0',   //'lime', //black
                    todayBackgroundColor: '#fff',
                    textMonthFontSize: 30,
                    textMonthFontWeight: "bold",
                    textDayFontSize: 18,
                    monthTextColor: 'white',
                    selectedDayBackgroundColor: 'darkblue',
                    arrowColor: 'white',
                }}
                markingType={'custom'}
                hideExtraDays={false} // show days of other months in month page
                // markedDates are to visually match the mock-up
                markedDates={{
                  '2019-06-05': { // change this date to be current date
                    selected: true,
                    customStyles: {
                      container: {
                        backgroundColor: 'white'
                      },
                      text: {
                        color: '#3788E0'
                      },
                    },
                  },
                  '2019-06-03' : {
                    customStyles: {
                      text: {
                        color: 'white',
                        fontWeight: 'bold'
                      },
                    },
                  },
                  '2019-06-14': {
                    customStyles: {
                      text: {
                        color: 'white',
                        fontWeight: 'bold'
                      },
                    },
                  },
                  '2019-06-16': {
                    customStyles: {
                      text: {
                        color: 'white',
                        fontWeight: 'bold'
                      },
                    },
                  },
                  '2019-06-29': {
                    customStyles: {
                      text: {
                        color: 'white',
                        fontWeight: 'bold'
                      },
                    },
                  }
                }}
            />
              }
            </View>
                  <View style={{ marginTop: 0, flex: 1, backgroundColor: '#3788E0' }}> 
            {/* Is the background of the bottom half of screen background */}
                <ButtonGroup
              //  style={styles.buttonGroups}
                //  divider={false}
                  onPress={this.updateTab}
                  selectedIndex={this.state.activeTab}
                  buttons={buttons}
                  containerStyle={{ 
                    paddingBottom: 0, 
                    marginBottom: 0, 
                    backgroundColor: '#3788E0',
                    borderColor: 'transparent',
                    width: 210,
                  }}
                />

 {/*********************************************
   START of Attempt to match calendar mockup from Slack channel.
  **********************************************/}
                <View style={styles.carouselContainer}>
                  <Carousel
                    style={styles.carousel}
                    ref={ref => this.carousel = ref}
                    data={this.state.carouselItems}
                    sliderWidth={350}
                    itemWidth={310}
                    renderItem={this._renderItem}
                    renderItem={this._renderItem}
                    onSnapToItem={(index) => this.setState({ activeSlide: index })}
                    contentContainerCustomStyle={{ flexGrow: 0, overflow: 'hidden', height: 50 * (this.state.carouselItems.length)}}
                    numColumns={2}
                    onSnapToItem={(index) => this.setState({ activeSlide: index })}
                  />
                  {this.pagination}
 {/*********************************************
   END of attempt to match calendar mockup from Slack channel.
  **********************************************/}

                  {this.state.activeTab === 0 && (
                      <View style={{flex:1}}>
                        {sortedEvents ? (               
                            
                        <FlatList
                            data={sortedEvents}
                            keyExtractor={this._keyExtractor}
                            renderItem={({item}) => 
                            <TouchableOpacity
                                onPress={() => {
                                this.openItem(item);
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
            </>
            )}
          </View>
    
        );
    }
}

let cardWidth = (screenWidth * .8);
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#3788E0"
    },
    eventsContainer: {
      flex: 1,
      backgroundColor: "#eee",
      paddingLeft: 10,
      paddingRight: 10,
      paddingTop: 10
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
    },
    carouselContainer: {
      flex: 1,
      backgroundColor: 'transparent',  //"#eee",
      paddingLeft: 10,
      paddingRight: 10,
      paddingTop: 10,
      width: screenWidth,
    },
    eventContainer: {
      flex: 1,
      flexWrap: 'wrap',
      flexDirection: 'row', 
      backgroundColor: "#fff", 
      marginBottom: 5, 
      borderRadius: 10, 
      justifyContent: 'space-evenly', 
      maxHeight: 70,
      maxWidth: screenWidth,
      alignSelf: 'stretch'
    },
    eventContainerChild: {
      flexBasis: '70%'
    },
    image: {
      width: 50, 
      height: 50, 
      borderRadius: 10, 
      marginTop: 10, 
      marginLeft: 15, 
      marginRight: 15
    },
    eventListCard: {
      // styles for the visual dividing line
      borderLeftWidth: 2, 
      borderLeftColor: '#777', 
      height: '70%', 
      marginTop: 12, 
      marginRight: 25
    },
    eventTitle: {
      flex: 1, 
      color: '#999', 
      height: 90, 
      marginTop: 12, 
      fontSize: 17,
      color: '#111' 
    },
    eventDate: {
      flex: 1, 
      color: '#999', 
      height: 90, 
      fontSize: 17, 
      fontWeight: 'bold', 
      color: '#111', 
      marginBottom: 10 
    },
    buttonGroups: {
      paddingBottom: 0,
      marginBottom: 0,
      backgroundColor: '#3788E0',
      borderColor: 'transparent'
    }
  });
  