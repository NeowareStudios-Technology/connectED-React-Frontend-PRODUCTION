import React from "react";
import { Text, StyleSheet, View, FlatList, TouchableOpacity, Image, LayoutAnimation } from "react-native";
import { ListItem } from 'react-native-elements';
import moment from 'moment';

class ProfileCreated extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        activeItem: null,
        loading: true
    };
    }


    _keyExtractor = (item, index) => index.toString();

    render() {
      if (!this.props.events) {
        return null
    }


    // sort events in ascending order
    let sortedEvents = this.props.events.slice().sort((a, b) => new Date(a.date[0]) - new Date(b.date[0]));
    return (
        <View style={styles.container}>
            <Text style={styles.sectionHeader}>Your Created Events:</Text>
              {sortedEvents ? (
                <FlatList
                data={sortedEvents}
                keyExtractor={this._keyExtractor}
                renderItem={({item, index}) => 
                <TouchableOpacity
                    onPress={() => {
                    // this.openItem(item, index);
                      this.props.navigation.navigate("AdminEventDetails", {item: item})
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
                  // <ListItem
                  //   key={event.key}
                  //   leftAvatar={{ source: { uri: "data:image/png;base64," + event.e_photo }, rounded: false }}
                  //   title={event.e_title}
                  //   subtitle={moment(event.date, "MM/DD/YYYY").format("MMM Do")}
                  //   contentContainerStyle={{ borderLeftColor: "grey", borderLeftWidth: 1, paddingLeft: 10 }}
                  //   containerStyle={{marginBottom: 10, borderRadius: 15}}
                  // />
              ):null
              }
            </View>
        
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 6,
    paddingHorizontal: 12,
    marginBottom: 70

  },
  section: {
    marginBottom: 12,
  },
  sectionHeader: {
    fontSize: 16,
    color: "#b0b0b0",
    marginBottom: 6
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
export default ProfileCreated;