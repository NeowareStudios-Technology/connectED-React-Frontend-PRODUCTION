
import React, { Component } from 'react';
import { Text, StyleSheet, View, FlatList, TouchableOpacity, Image, LayoutAnimation, Button } from "react-native";
import User from "../components/User";

export default class AdminTeamDetails extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
          userCreated: [],
          userRegistered: [],
          userPending: [],
          activeItem: {}
        };
      }
    componentDidMount() {
        this.loadCreatedTeams()
    }
    _keyExtractor = (item, index) => index.toString();

    fetchOneTeamData = async (teamName) => {
        let token = await User.firebase.getIdToken();
        if (token) {
          try {
            let team = teamName.split(' ').join('+')
            console.warn(team)
            let url =
              `https://connected-dev-214119.appspot.com/_ah/api/connected/v1/teams/${team}`;
              
            fetch(url, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
              }
            }).then(response => {
              if (response.ok) {
                  console.warn(response)
                try {
                  let responseData = JSON.parse(response._bodyText);
                  if (responseData) {
                    if (typeof responseData === "object") {
                        this.props.navigation.navigate("AdminOpenTeamDetails", responseData)
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
    
  // loads any events the user created and sorts by date
  loadCreatedTeams = async (eventName, index, callback) => {
    let token = await User.firebase.getIdToken();
    
    if (token) {
      try {
        let url =
          "https://connected-dev-214119.appspot.com/_ah/api/connected/v1/profiles/" +
          User.email+"/teams";
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
                  console.log(responseData)
                let createdTeams = responseData.created_team_names //aray
                let pendingMemberTeams = responseData.pending_team_names //array
                let registeredMemberTeams = responseData.registered_team_names //array
                
                this.setState(
                  {
                    userCreated: createdTeams,
                    userPending: pendingMemberTeams,
                    userRegistered: registeredMemberTeams
                  }
                  );

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

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>My Teams</Text>
                
                <Text style={styles.subtitle}>Created</Text>
                <View>
                    {this.state.userCreated ?
                    
                    <FlatList
                    data={this.state.userCreated}
                    // extraData={this.state}
                    keyExtractor={this._keyExtractor}
                    renderItem={({item, index}) => 
                    <TouchableOpacity
                        onPress={() => {
                            this.fetchOneTeamData(item)
                        }}
                        activeOpacity={1}
                    >
                    <View style={styles.teamListing}>
                        <Text style={{fontWeight: 'bold', fontSize: 20}}>{item}</Text>
                    </View>
                    </TouchableOpacity>
                        }
                    />
                    
                    :null}
              </View>
         
                <View>
                    <Text style={styles.subtitle}>Registered</Text>
                    {this.state.userRegistered.map((item, index)=>
                        <Text key={index}>{`\u2022 ${item}`}</Text>
                    )}
                </View>
                <View >
                    <Text style={styles.subtitle}>Pending</Text>
                    {this.state.userPending.map((item, index)=>
                        <Text key={index}>{`\u2022 ${item}`}</Text>
                    )}
                </View>
                
                
            </View>
        );
    }
}
styles={
    container: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop:20,
        paddingBottom: 20,
        fontSize: 16
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        paddingBottom: 5
    },
    subtitle: {
        fontSize: 18,
        fontWeight: "bold",
        paddingBottom: 5,
        paddingTop: 5,
    },
    header: {
        backgroundColor: "#eee", 
        paddingTop:5, 
        paddingBottom: 5, 
        textAlign: "center"
    },
    teamListing: {
        backgroundColor: '#fafafa',
        flex: 1, 
        flexDirection: 'row',
        color: 'black',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 10,
        borderColor: 'lightgray',
        borderWidth: 1,
        borderRadius: 10,
    },

}