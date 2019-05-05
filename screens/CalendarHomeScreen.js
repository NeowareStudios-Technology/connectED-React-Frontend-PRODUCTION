import React, { Component } from 'react';
import {
    ActivityIndicator,
    Image,
    ImageBackground,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
  } from "react-native";
  import { Icon } from "expo";

  import {Calendar, CalendarList, Agenda} from 'react-native-calendars';

export default class MyCalendar extends Component {
    static navigationOptions = {
        header: null
      };
    render() {
        return (
            <View style={styles.container}>
            <ScrollView
              style={styles.container}
              contentContainerStyle={styles.contentContainer}
            >
              
                <>

                    
                 
                    <Calendar
                    // Initially visible month. Default = Date()
                    current={'2012-03-01'}
                    // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
                    minDate={'2012-05-10'}
                    // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
                    maxDate={'2012-05-30'}
                    // Handler which gets executed on day press. Default = undefined
                    onDayPress={(day) => {console.log('selected day', day)}}
                    // Handler which gets executed on day long press. Default = undefined
                    onDayLongPress={(day) => {console.log('selected day', day)}}
                    // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
                    monthFormat={'MMMM yyyy'}
                    // Handler which gets executed when visible month changes in calendar. Default = undefined
                    onMonthChange={(month) => {console.log('month changed', month)}}
                    // Hide month navigation arrows. Default = false
                    hideArrows={false}
                    // Replace default arrows with custom ones (direction can be 'left' or 'right')
                    renderArrow={(direction) => (
                        <>
                        {direction==="left"?
                        
                            <Icon.Ionicons
                            name={Platform.OS === "ios" ? `ios-arrow-back` : "md-arrow-back"}
                            size={30}
                            />
                            :
                            <Icon.Ionicons
                            name={Platform.OS === "ios" ? `ios-arrow-forward` : "md-arrow-forward"}
                            size={30}
                            />
                        }

                      </>
                        )}
                    // Do not show days of other months in month page. Default = false
                    hideExtraDays={false}
                    // If hideArrows=false and hideExtraDays=false do not switch month when tapping on greyed out
                    // day from another month that is visible in calendar page. Default = false
                    disableMonthChange={true}
                    // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
                    firstDay={1}
                    // Hide day names. Default = false
                    hideDayNames={true}
                    // Show week numbers to the left. Default = false
                    // showWeekNumbers={true}
                    // Handler which gets executed when press arrow icon left. It receive a callback can go back month
                    onPressArrowLeft={substractMonth => substractMonth()}
                    // Handler which gets executed when press arrow icon left. It receive a callback can go next month
                    onPressArrowRight={addMonth => addMonth()}
                    />
                 
                </>
              
            </ScrollView>
          </View>
    
        );
    }
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#3788E0"
    },
  
    contentContainer: {
      paddingTop: 12
    },
    largeNumber: {
      fontSize: 30,
      fontWeight: "bold"
    },
    largeNumberCaption: {
      fontSize: 14,
      marginTop: 3,
      color: "#b0b0b0"
    },
    drawerSectionWrapper: {
      marginBottom: 12
    },
    drawerSectionLabelContainer: {
      flexDirection: "row",
      alignItems: "flex-end",
      marginBottom: 6
    },
    drawerSectionLabel: { marginLeft: 6, fontSize: 16 },
    menuItemWrapper: {},
    menuItemTouchable: {
      paddingVertical: 6
    },
    menuItemContainer: { flexDirection: "row" },
    menuItemLabel: { flex: 3 },
    menuItemIconContainer: { flex: 1 }
  });
  