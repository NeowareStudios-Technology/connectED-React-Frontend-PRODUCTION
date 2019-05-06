import React, { Component } from 'react';
import {
    ActivityIndicator,
    Image,
    ImageBackground,
    Platform,
    ScrollView,
    StyleSheet,
    Dimensions,
    LayoutAnimation,
    Text,
    TouchableOpacity,
    View,
    FlatList
  } from "react-native";
  import styles from "../constants/Styles";
  import { Icon } from "expo";

  const DummyData = [
    {
        id: '1',
        teamName: 'Inventors',
        memberNames: ["Karina", "Lucy", "Joseph", "Einstein"]
    },
    {
        id: '2',
        teamName: 'WebDev Royalty',
        memberNames: ["Karina", "Kendra", "Dan", "Mimi", "Amanda"]
    },
    {
        id: '3',
        teamName: 'Environmentalists',
        memberNames: ["Kevin", "Jakob", "Sally"]
    },
    {
        id: '4',
        teamName: 'Retired',
        memberNames: ["Rosemary", "Daphne", "John", "Piper", "KellyAnn", "Jessica", "Suzy"]
    },
  ]
export default class TeamsScreen extends Component {
    static navigationOptions = {
        header: null
    };
    constructor(props) {
        super(props);
    
        this.state = {
          activeItem: null,
        };
      }

    _keyExtractor = (item, index) => item.id;

    openItem = (item, index) => {
        LayoutAnimation.easeInEaseOut();
        this.setState({ activeItem: item });
    };
    closeItem = item => {
        LayoutAnimation.easeInEaseOut();
        this.setState({ activeItem: null });
    };
 

    render() {
        return (
            <>
            <View style={styles.container}>
              <ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
              >
                <View style={{ flex: 1 }}>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 12,
                        marginHorizontal: 15
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <TouchableOpacity
                          style={{
                            paddingHorizontal: 10,
                            borderRadius: 90,
                            borderColor: "#000",
                            borderWidth: 0
                          }}
                          onPress={() => {
                            this.props.navigation.navigate("#");
                          }}
                        >
                          <Icon.Ionicons
                            name={Platform.OS === "ios" ? "ios-add-circle-outline" : "md-add-circle-outline"}
                            size={30}
                          />
                        </TouchableOpacity>
                        <View>
                          <Text style={styles.displayH1}>Teams</Text>
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
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
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{
                            paddingHorizontal: 10,
                            borderRadius: 90,
                            borderColor: "#000",
                            borderWidth: 0
                          }}
                          onPress={() => {
                            console.log('TODO: filter')
                          }}
                        >
                          <Icon.Ionicons
                            name={Platform.OS === "ios" ? "ios-options" : "md-options"}
                            size={30}
                          />
                        </TouchableOpacity>

                      </View>
                    </View>


                    <View style={[styles.eventsContainer,{flex: 10}]}>
                          <Text style={styles.displayH4}>All Teams</Text>
                          <FlatList
                            data={DummyData}
                            // extraData={this.state}
                            keyExtractor={this._keyExtractor}
                            renderItem={({item}) => 
                            <TouchableOpacity
                                
                            >
                            <View style={styles.teamListing}>
                                <View style={{width: 50, height: 50, backgroundColor: '#275FBC'}}/>
                                <View style={{
                                    marginLeft:10,
                                    paddingLeft:10,
                                    borderLeftColor: 'gray',
                                    borderLeftWidth: 2
                                }}>
                                    <Text style={{fontWeight: 'bold', fontSize: 20}}>{item.teamName}</Text>
                                    <Text>{item.memberNames.length } Members</Text>
                                </View>
                            </View>
                            </TouchableOpacity>
                                }
                            />
                    </View>


                  </View>
              </ScrollView>
            </View>
          </>
    
        );
    }
}
