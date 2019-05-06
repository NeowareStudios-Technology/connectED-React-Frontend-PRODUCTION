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

    componentDidMount() {
        this.getEventDates(DummyData)
        // this.getMarkedDates()
    }
    updateTab (selectedIndex) {
        this.setState({selectedIndex})
    }
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

    render() {
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
            <View style={styles.eventsContainer}>
                <Text style={styles.subtitle}>Volunteering</Text>
                <ScrollView >
                    <FlatList
                        data={DummyData}
                        
                        // extraData={this.state}
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
            </View>
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
        flex: 1, 
        flexDirection: 'row',
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
  