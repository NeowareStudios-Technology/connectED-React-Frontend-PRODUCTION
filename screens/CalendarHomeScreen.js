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
        activeTab: 0
    };
    this.updateTab = this.updateTab.bind(this)
    }
    updateTab (selectedIndex) {
        this.setState({selectedIndex})
    }
    _keyExtractor = (item, index) => item.id;

    render() {
        const buttons = ["Volunteering", "My Opportunities"];
        return (


            <View style={styles.container}>
            <View style={{height:screenHeight - 300}}>
            <CalendarList
                current={()=>DateNow()}
                pastScrollRange={24}
                futureScrollRange={24}
                // pagingEnabled
                style={{
                    backgroundColor: "transparent",
                    paddingTop: 40,
                }}
                markedDates={{
                    '2019-05-16': {selected: true, selectedColor: '#275FBC'},
                }}
                theme={{
                    calendarBackground: 'transparent',
                    textSectionTitleColor: 'white',
                    dayTextColor: 'white',
                    todayTextColor: 'lightgray',
                    textMonthFontSize: 30,
                    textMonthFontWeight: "bold",
                    textDayFontSize: 18,
                    monthTextColor: 'white',
                    selectedDayBackgroundColor: 'darkblue',
                    arrowColor: 'white',
                }}
            />
            </View>
            <View style={styles.eventsContainer}>
                <Text style={styles.subtitle}>Volunteering</Text>
                <ScrollView >
                    <FlatList
                        data={DummyData}
                        
                        // extraData={this.state}
                        keyExtractor={this._keyExtractor}
                        renderItem={({item}) => 
                            <View style={styles.eventListing}>
                                <Text>{item.eventName}</Text>
                                <Text>{item.date}</Text>
                            </View>
                        }
                    />
        
                </ScrollView>
            </View>
          </View>
        //     <View style={styles.container}>
        //     <ScrollView
        //       style={styles.container}
        //       contentContainerStyle={styles.contentContainer}
        //     >
        //         <>
        //             <Calendar
        //             style={{
        //                 backgroundColor: "transparent",
        //                 paddingTop: 20
        //             }}
        //             markedDates={{
        //                 '2019-05-16': {selected: true, selectedColor: '#275FBC'},
        //               }}
        //             // Initially visible month. Default = Date()
        //             current={()=>DateNow()}
        //             // Handler which gets executed on day press. Default = undefined
        //             onDayPress={(day) => {console.log('selected day', day)}}
        //             // Handler which gets executed on day long press. Default = undefined
        //             onDayLongPress={(day) => {console.log('selected day', day)}}
        //             // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
        //             monthFormat={'MMMM yyyy'}
        //             // Handler which gets executed when visible month changes in calendar. Default = undefined
        //             onMonthChange={(month) => {console.log('month changed', month)}}
        //             // Hide month navigation arrows. Default = false
        //             hideArrows={false}
        //             // Replace default arrows with custom ones (direction can be 'left' or 'right')
        //             renderArrow={(direction) => (
        //                 <>
        //                 {direction==="left"?
                        
        //                     <Icon.Ionicons
        //                     name={Platform.OS === "ios" ? `ios-arrow-back` : "md-arrow-back"}
        //                     size={30}
        //                     color="white"
        //                     />
        //                     :
        //                     <Icon.Ionicons
        //                     name={Platform.OS === "ios" ? `ios-arrow-forward` : "md-arrow-forward"}
        //                     size={30}
        //                     color="white"
        //                     />
        //                 }
        //               </>
        //                 )}
        //             // Do not show days of other months in month page. Default = false
        //             hideExtraDays={false}
        //             // If hideArrows=false and hideExtraDays=false do not switch month when tapping on greyed out
        //             // day from another month that is visible in calendar page. Default = false
        //             disableMonthChange={true}
        //             // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
        //             firstDay={1}
        //             // Hide day names. Default = false
        //             hideDayNames={false}
        //             // Show week numbers to the left. Default = false
        //             // showWeekNumbers={true}
        //             // Handler which gets executed when press arrow icon left. It receive a callback can go back month
        //             onPressArrowLeft={substractMonth => substractMonth()}
        //             // Handler which gets executed when press arrow icon left. It receive a callback can go next month
        //             onPressArrowRight={addMonth => addMonth()}
        //             theme={{
        //                 calendarBackground: 'transparent',
        //                 textSectionTitleColor: 'white',
        //                 dayTextColor: 'white',
        //                 todayTextColor: 'lightgray',
        //                 textMonthFontSize: 30,
        //                 textDayFontSize: 18,
        //                 monthTextColor: 'white',
        //                 selectedDayBackgroundColor: 'darkblue',
        //                 arrowColor: 'white',
        //                 // textDisabledColor: 'red',
        //                 // 'stylesheet.calendar.header': {
        //                 //   week: {
        //                 //     marginTop: 5,
        //                 //     flexDirection: 'row',
        //                 //     justifyContent: 'space-between'
        //                 //   }
        //                 // }
        //               }}
        //             />
                 
        //         </>
              
        //     </ScrollView>
        //   </View>
    
        );
    }
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#3788E0"
    },
    eventsContainer: {
      paddingLeft: 30,
      paddingRight: 30,
      paddingTop: 15,
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
        color: 'black',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
        paddingBottom: 10,
        marginBottom: 10,
        borderColor: '#275FBC',
        borderWidth: 2,
        borderRadius: 15,
    }
  });
  