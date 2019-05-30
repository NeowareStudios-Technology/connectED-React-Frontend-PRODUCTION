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
  import { Input } from "react-native-elements"
  import styles from "../constants/Styles";
  import { Icon } from "expo";
  import User from "../components/User";
import TeamPage from '../components/TeamPage';

export default class TeamsScreen extends Component {
    static navigationOptions = {
        header: null
    };
    constructor(props) {
      super(props);
  
      this.state = {
        currentTeam: {},
        TopTeamNames: [],
        SuggestedTeamNames: [],
        showSearchBar: false,
        data: [],
        activeItem: null,
      };
      this.arrayholder = [];
    }

    joinTeam = async () => {
      if (this.state.activeItem){
        let isRegistered = false;
        if (
          typeof this.state.activeItem.is_registered !== "undefined" &&
          this.state.activeItem.is_registered !== "0"
          ){
            isRegistered = true;
          }

          if (!isRegistered) {
            let token = await User.firebase.getIdToken();
    
            if (token) {
              let teamOrigName = this.state.currentTeam.t_orig_name;
              let url = `https://connected-dev-214119.appspot.com/_ah/api/connected/v1/teams/${teamOrigName}/registration`;
              try {
                fetch(url, {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token
                  },
                })
                  .then(response => {
                    if (response.ok) {
                      let teams = this.state.SuggestedTeamNames;
                      let teamIndex = null;
                      let team = teams.find((aTeam, index) => {
                        if (aTeam === this.state.currentTeam) {
                          teamIndex = index;
                          return true;
                        }
                        return false;
                      });
                      if (teamIndex) {
                        teams[teamIndex].is_registered = "1";
                      }
                      this.setState({
                        SuggestedTeamNames: teams,
                        activeItem: teams[teamIndex]
                      });
                    }
                  })
                  .catch(error => { });
              } catch (error) { }
            }
          }

      } else{
        alert("sorry, something went wrong")
      }
    }

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
      console.log(token)
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
                      }
                    );
                    this.arrayholder = responseData.team_names
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

    fetchOneTeamData = async (teamName) => {
      let token = await User.firebase.getIdToken();
      if (token) {
        try {
          let url =
            `https://connected-dev-214119.appspot.com/_ah/api/connected/v1/teams/${teamName}`;
            
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
                        currentTeam: responseData,
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
  searchFilterFunction = text => {
    const newData = this.arrayholder.filter(item => {      
      const itemData = `${item.toUpperCase()}`;
       const textData = text.toUpperCase();
       return itemData.indexOf(textData) > -1;    
    });

    this.setState({ SuggestedTeamNames: newData });  
  };
  
    _keyExtractor = (item, index) => index.toString();

    openItem = (item, index) => {
        this.fetchOneTeamData(item);
        LayoutAnimation.easeInEaseOut();
        this.setState({ activeItem: item });
        this.fetchSuggestedTeamData();
    };
    closeItem = item => {
        LayoutAnimation.easeInEaseOut();
        this.setState({ activeItem: null });
        this.setState({currentTeam: {}})
    };
 

    render() {
      console.log(this.state.currentTeam)
        return (
            <>
            <View style={styles.container}>
              <ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
              >
            {this.state.activeItem ? (
              <>
                <View style={{ flex: 1 }}>
                  <TeamPage
                    event={this.state.activeItem}
                    team={this.state.currentTeam}
                    onClose={this.closeItem}
                    onJoin={() => {
                      this.joinTeam();
                    }}
                    onDeregister={() => {
                      this.deregister();
                    }}
                  />
                </View>
              </>
            ) : (
                <View style={{ flex: 1 }}>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
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
                            this.props.navigation.navigate("TeamCreate");
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
                    </View>
                    <View style={{
                      flexDirection: 'row',
                      marginHorizontal: 20,
                      paddingHorizontal: 10,
                      borderRadius: 10,
                      justifyContent: "space-between",
                      alignItems: "center",
                      backgroundColor: '#eee'
                    }}>
                      <Icon.Ionicons
                        name={Platform.OS === "ios" ? "ios-search" : "md-search"}
                        size={20}
                        style={{paddingTop: 0}}
                        
                      />
                      <Input
                        placeholder="Search Teams"
                        inputContainerStyle={{borderBottomWidth: 0}}
                        onChangeText={text=>this.searchFilterFunction(text)}
                        autoCorrect={false}
                      />
                    </View>
                    <View style={{flex: 10, paddingLeft: 30,paddingRight: 30}}>
                    
                  {this.state.SuggestedTeamNames.length > 0 ? 
                    <View>
                          <Text style={styles.displayH4}></Text>
                          <FlatList
                            data={this.state.SuggestedTeamNames}
                            // extraData={this.state}
                            keyExtractor={this._keyExtractor}
                            renderItem={({item, index}) => 
                            <TouchableOpacity
                              onPress={() => {
                                this.openItem(item, index);
                              }}
                              activeOpacity={1}
                            >
                            <View style={styles.teamListing}>
                              <Text style={{fontWeight: 'bold', fontSize: 20}}>{item}</Text>
                            </View>
                            </TouchableOpacity>
                                }
                            />
                    </View>
                  :null}
                  {/* {this.state.TopTeamNames.length > 0 ? 
                  <View>
                          <Text style={styles.displayH4}>Top Teams</Text>
                          <FlatList
                            data={this.state.TopTeamNames}
                            // extraData={this.state}
                            keyExtractor={this._keyExtractor}
                            renderItem={({item, index}) => 
                            <TouchableOpacity
                              onPress={() => {
                                this.openItem(item, index);
                              }}
                              activeOpacity={1}
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
                  :null} */}
                  </View>


                  </View>
            )}
              </ScrollView>
            </View>
          </>
    
        );
    }
}
