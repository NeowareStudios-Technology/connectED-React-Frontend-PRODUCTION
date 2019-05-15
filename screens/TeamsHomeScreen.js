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
  import User from "../components/User";




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
        TopTeamNames: [],
        SuggestedTeamNames: [],
      };
    }

    // loadEvents = () => {
    //   let sequence = new Sequencer();
    //   if (this.state.eventsNames.length > 0) {
    //     this.state.eventsNames.map((eventName, index) => {
    //       sequence.promise(() => {
    //         this.loadEvent(eventName, index, () => {
    //           sequence.next();
    //         });
    //       });
    //     });
    //   }
    //   sequence.next();
    // };
    fetchTopTeamData = async () => {
      let token = await User.firebase.getIdToken();
      if (token) {
        try {
          let url =
            "https://connected-dev-214119.appspot.com/_ah/api/connected/v1/teams/top";
            
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
                  // console.warn(responseData)
                  if (typeof responseData === "object") {
                    this.setState(
                      {
                        TopTeamNames: responseData.top_team_names,
                        // distances: responseData.distances
                      },
                      () => {
                        // this.loadEvents();
                        console.warn("need to load topteams")
                      }
                    );
                  } else {
                    this.setState({ loading: false });
                  }
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
    };

    fetchSuggestedTeamData = async () => {
      let token = await User.firebase.getIdToken();
      if (token) {
        try {
          let url =
            "https://connected-dev-214119.appspot.com/_ah/api/connected/v1/teams/suggested";
            
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
                  if (typeof responseData === "object") {
                    this.setState(
                      {
                        SuggestedTeamNames: responseData.team_names,
                        // distances: responseData.distances
                      },
                      () => {
                        // this.loadEvents();
                        console.warn("need to load suggested teams")
                      }
                    );
                  } else {
                    this.setState({ loading: false });
                  }
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
    };


    async componentDidMount() {
      let user = await User.isLoggedIn();
      if (user) {
        this.fetchTopTeamData();
        this.fetchSuggestedTeamData();
    }
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

                  {this.state.TopTeamNames.length > 0 ? 
                  <View>
                          <Text style={styles.displayH4}>Top Teams</Text>
                          <FlatList
                            data={this.state.TopTeamNames}
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
                                    <Text style={{fontWeight: 'bold', fontSize: 20}}>{item}</Text>
                                </View>
                            </View>
                            </TouchableOpacity>
                                }
                            />
                    </View>
                  :null}
                  {this.state.SuggestedTeamNames.length > 0 ? 
                    <View>
                          <Text style={styles.displayH4}>Suggested Teams</Text>
                          <FlatList
                            data={this.state.SuggestedTeamNames}
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
                                    <Text style={{fontWeight: 'bold', fontSize: 20}}>{item}</Text>
                                </View>
                            </View>
                            </TouchableOpacity>
                                }
                            />
                    </View>
                  :null}
                  </View>


                  </View>
              </ScrollView>
            </View>
          </>
    
        );
    }
}
