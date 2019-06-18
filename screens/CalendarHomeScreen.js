import React, { Component } from 'react';
import {
  Dimensions,
  Text,
  View,
  LayoutAnimation
} from "react-native";
import { ButtonGroup } from "react-native-elements";
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import moment from "moment"

import User from "../components/User";
import Sequencer from "../components/Sequencer";
import EventDetails from '../components/EventDetails';
import EventListItems from '../components/EventListItems';
import AdminEventDetails from '../components/AdminEventDetails';
import Styles from "../constants/Styles";

let screenHeight = Dimensions.get('window').height;

export default class MyCalendar extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);

    this.state = {
      markedDates: [],
      marked: null,
      activeItem: null,
      user: null,
      events: null,
      userEvents: null, // events created by user
      upcomingEvents: null, // past events the user has volunteered for
      activeTab: 0,
      loading: true,
      adminEventDetailVisible: false,
      eventDetailVisible: false,
      signInOutTitle: "Sign in to Event",
      signInOutMessage: null
    };
    this.updateTab = this.updateTab.bind(this)
  }

  updateUser = (user) => {
    this.setState({ user: user })
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
                event.key = "created-" + index;
                userEvents.push(event);
                this.setState({
                  userEvents: userEvents,
                  loading: false
                }, () => {
                  callback();
                });
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

  // Loads registered events
  loadRegisteredEvent = async (eventName, index, callback) => {
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
                event.key = "registered-" + index;
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
    // console.log("Calendar Events", this.state.events)
    let sequence = new Sequencer();
    let registeredEvents = this.state.events.registered_events
    let userEvents = this.state.events.created_events
    if (registeredEvents && registeredEvents.length > 0) {
      registeredEvents.map((eventName, index) => {
        eventName = eventName.replace("_", "/")
        sequence.promise(() => {
          this.loadRegisteredEvent(eventName, index, () => {
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

  async loadUser() {
    let user = await User.isLoggedIn();
    if (user) {
      this.setState({ user: user }, () => {
        this.loadUserOpportunities();
      });
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
  signInOrOut = async (name, email) => {
    let token = await User.firebase.getIdToken();
    if (token) {
      try {
        let url =
          `https://connected-dev-214119.appspot.com/_ah/api/connected/v1/events/${email}/${name}/qr`;
        console.warn(url)
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
              let text = responseData.response
              let title = ""
              if (text.includes('in')) {
                let title = "Sign Out of Event"
                alert(text)
                this.setState({
                  signInOutMessage: text,
                  signInOutTitle: title
                })
              } else {
                let title = "Sign Into Event"
                alert(text)
                this.setState({
                  signInOutMessage: text,
                  signInOutTitle: title
                })
              }

            } catch (error) { }
          } else {
            alert("Not able to sign in or out of event")
          }
        });
      } catch (error) { }
    }
  }
  _keyExtractor = (item, index) => index.toString();

  updateTab = (activeTab) => {
    this.setState({ activeTab })
  }

  openItem = (item, index) => {
    LayoutAnimation.easeInEaseOut();
    this.setState({ activeItem: item });
  };

  getEventDates() {
    let DatesArray = []
    let myEvents = this.state.userEvents.slice().sort((a, b) => new Date(a.date[0]) - new Date(b.date[0]));

    for (var i = 0; i < myEvents.length; i++) {
      let date = myEvents[i].date[0]

      let newDate = moment(date, "MM-DD-YYYY").format("YYYY-MM-DD");
      DatesArray.push(newDate)
    }
    let myUpcomingEvents = this.state.upcomingEvents.slice().sort((a, b) => new Date(a.date[0]) - new Date(b.date[0]));

    for (var i = 0; i < myUpcomingEvents.length; i++) {
      let date = myUpcomingEvents[i].date[0]

      let newDate = moment(date, "MM-DD-YYYY").format("YYYY-MM-DD");
      DatesArray.push(newDate)
    }
    this.setState({ markedDates: DatesArray }, () => this.sendDatesToCalendar())
  }

  sendDatesToCalendar = () => {
    var obj = this.state.markedDates.reduce((c, v) => Object.assign(c, { [v]: { selected: true } }), {});
    this.setState({ marked: obj });
  }

  showEventDetails = (event) => {
    LayoutAnimation.easeInEaseOut();
    this.setState({ eventDetailVisible: true, activeItem: event })
  }
  showAdminEventDetails = (event) => {
    LayoutAnimation.easeInEaseOut();
    this.setState({ adminEventDetailVisible: true, activeItem: event })
  }

  // return the updated events array
  updateEvents = (events, event) => {
    let index = events.findIndex((e) => e.e_orig_title === event.e_orig_title)
    if (index === -1) {
      return null
    }

    // if event attendee is no longer regiestered, remove from list of events
    if (event.is_registered === "0" && event.key.startsWith('registered')) {
      // cut out event from list
      events.splice(index, 1)
    }
    else {
      events[index] = event
    }

    return events
  }

  closeItem = (event) => {
    LayoutAnimation.easeInEaseOut();

    if (event) {
      let events
      if (event.key.startsWith('created')) {
        events = this.updateEvents(this.state.userEvents.slice(), event)
        this.setState({ userEvents: events }, () => this.getEventDates())
      } else {
        events = this.updateEvents(this.state.upcomingEvents.slice(), event)
        this.setState({ upcomingEvents: events }, () => this.getEventDates())
      }
    }

    this.setState({ activeItem: null, adminEventDetailVisible: false, eventDetailVisible: false });
  };

  renderEventDetails = () => {
    return (
      <View style={Styles.contentContainer}>
        <EventDetails
          event={this.state.activeItem}
          onClose={this.closeItem}
        />
      </View>

    )
  }
  renderAdminEventDetails = () => {
    return (
      <View style={Styles.contentContainer}>
        <AdminEventDetails event={this.state.activeItem} onClose={this.closeItem} />
      </View>
    )
  }

  render() {
    if (this.state.eventDetailVisible) {
      return (this.renderEventDetails())
    }
    if (this.state.adminEventDetailVisible) {
      return (this.renderAdminEventDetails())
    }

    const buttons = ["Created Events", "Volunteering"];
    return (

      <View style={Styles.container}>
        <>
          <View style={{ height: screenHeight - 300, backgroundColor: "#3788E0" }}>
            <CalendarList
              current={() => DateNow()}
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
          </View>
          <View style={{ marginTop: 0, flex: 1, backgroundColor: "#eee" }}>
            <ButtonGroup
              onPress={this.updateTab}
              selectedIndex={this.state.activeTab}
              buttons={buttons}
              containerStyle={{ paddingBottom: 0, marginBottom: 0 }}
            />
            <View style={Styles.eventListContainer}>
              {this.state.activeTab === 0 && (
                <EventListItems
                  events={this.state.userEvents}
                  sort="asc"
                  overlay={this.showAdminEventDetails}
                />
              )}
              {this.state.activeTab === 1 && (
                <EventListItems
                  events={this.state.upcomingEvents}
                  sort="asc"
                  overlay={this.showEventDetails}
                />
              )}

            </View>
          </View>
        </>

      </View>

    );
  }
}
