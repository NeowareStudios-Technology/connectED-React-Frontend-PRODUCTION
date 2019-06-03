import React from 'react';
import { 
  StyleSheet,
  Text, 
  Image,
  SafeAreaView,
  TouchableHighlight,
  View
} from 'react-native';

import Carousel, { Pagination } from 'react-native-snap-carousel';

export default class App extends React.Component {
 
  constructor(props){
    super(props);
    this.state = {
      activeIndex:0,
      carouselItems: [
        {
            title: "Item 1",
            date: "Arpil 2nd"
        },
        {
            title: "Item 2",
            date: "Arpil 2nd"
        },
        {
            title: "Item 3",
            date: "Arpil 2nd"
        },
        {
            title: "Item 4",
            date: "Arpil 2nd"
        },
        {
            title: "Item 5",
            date: "Arpil 2nd"
        }]
    }
  }

  /*********************************************************************
   *  START react-native-snap-carousel
   * 
   ***********************************************************************/
  _renderItem({item,index}){
    return (
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}> 
        <Image
          source={{ uri: 'http://www.arnold.fun/290/290' }} 
          style={{ width: 290, height: 290 }}
          />
        <Text style={{color:'#fff'}} >{item.title}</Text>
        <Text style={{ color: '#fff' }} >{item.date}</Text>
      </View>
    )
  }

  get pagination() {
    const { carouselItems, activeSlide } = this.state;
    return (
      <Pagination
        dotsLength={carouselItems.length}
        activeDotIndex={activeSlide}
        containerStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.25)' }}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          marginHorizontal: 8,
          backgroundColor: 'rgba(255, 255, 255, 0.92)'
        }}
        inactiveDotStyle={{
          // Define styles for inactive dots here
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    );
  }
  /* END react-native - snap - carousel ******************************** */
              
  render() {
    /******************************************
      * For loop to create two event list cards for the carousel
      * Then they are added in the return() method in  `{eventCards}`
      */
      let eventCards = [];
      for (let i=0;i<2;i++){
        eventCards.push(
          <View key={i} style={styles.eventContainer}>
              <Image
                style={styles.image}
                source={{ uri: 'http://www.placepuppy.net/50/50' }}
              // source={{ uri: 'https://via.placeholder.com/50' }}
              />
              <View style={styles.eventListCard}></View>
              <View style={{ flex: 1, flexDirection: 'column' }}>
                <Text style={styles.eventTitle}>Tech & Talk</Text>
                <Text style={styles.eventDate}>April 2nd</Text>
              </View>
            </View>
        )
      }
      
    return (         
  // {/*********************************************
  //     Attempt to match calendar mockup from Slack channel.
  //   **********************************************/}
      <View>
        <View style={styles.eventContainer}>
          {eventCards}
          {/* <SafeAreaView style={styles.container}>
            <View>
              <Carousel
                ref={ref => this.carousel = ref}
                data={this.state.carouselItems}
                sliderWidth={250}
                itemWidth={250}
                renderItem={this._renderItem}
                onSnapToItem = { index => this.setState({activeIndex:index}) }
              />
            </View>
          </SafeAreaView> */}

        </View>
        {/* <View>
          {this.pagination}
        </View> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection:'row',
    backgroundColor:'#131420',
    alignItems: 'center',
    justifyContent: 'center',
  },
   eventsContainer: {
        flex: 1,
        backgroundColor: "#eee",
      paddingLeft: 10,
      paddingRight: 10,
      paddingTop: 10,
    },
   eventContainer: {
      flex: 1, 
      flexDirection: 'row', 
      backgroundColor: "#fff", 
      marginBottom: 5, 
      borderRadius: 10, 
      justifyContent: 'space-evenly', 
      maxHeight: 70
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
      marginTop: 5, 
      fontSize: 20, 
      color: '#111' 
    },
    eventDate: {
      flex: 1, 
      color: '#999', 
      height: 90, 
      fontSize: 20, 
      fontWeight: 'bold', 
      color: '#111', 
      marginBottom: 10 
    }
});