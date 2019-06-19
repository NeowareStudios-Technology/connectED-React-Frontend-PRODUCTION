
import React, { Component } from 'react';
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet
} from "react-native";
import { ButtonGroup } from "react-native-elements"
import TeamListItems from "../components/TeamListItems"
import User from "../components/User"
import Styles from "../constants/Styles"
import { fetchTeamData, fetchUserTeams } from "../constants/API"

export default class AdminTeamDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      createdTeams: [],
      registeredTeams: [],
      pendingTeams: [],
      activeTab: 0,
      activeItem: null
    };
  }
  componentDidMount() {
    this.loadUserTeams()
  }

  updateTab = (activeTab) => {
    this.setState({ activeTab })
  }

  loadUserTeams = async () => {
    try {
      let userTeams = await fetchUserTeams()
      if (!userTeams.error) {
        this.setState(
          {
            createdTeams: userTeams.created_team_ids,
            pendingTeams: userTeams.pending_team_ids,
            registeredTeams: userTeams.registered_team_ids,
            loading: false
          }
        );

      } else {
        alert("ERROR: " + userTeams.error.message)
      }
    } catch (error) { }
  };

  render() {
    const tabTitles = ["Created", "Registered", "Pending"]
    let teams
    switch (this.state.activeTab) {
      case 0:
        teams = this.state.createdTeams
        break;
      case 1:
        teams = this.state.registeredTeams
        break;
      case 2:
        teams = this.state.pendingTeams
        break;
      default:
        teams = null
        break;
    }
    return (
      <View style={Styles.container}>
        <View style={Styles.contentContainer}>
          <Text style={Styles.displayH1}>My Teams</Text>
          <ButtonGroup
            onPress={this.updateTab}
            selectedIndex={this.state.activeTab}
            buttons={tabTitles}
          />
          {this.state.loading ? (
            <ActivityIndicator
              size="large"
              style={Styles.activityIndicator} />
          ) : (
              <View>
                <TeamListItems teams={teams} />
              </View>
            )
          }
        </View>
      </View>
    );
  }
}


// styles = {
//   container: {
//     paddingLeft: 20,
//     paddingRight: 20,
//     paddingTop: 20,
//     paddingBottom: 20,
//     fontSize: 16
//   },
//   title: {
//     fontSize: 26,
//     fontWeight: 'bold',
//     paddingBottom: 5
//   },
//   subtitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     paddingBottom: 5,
//     paddingTop: 5,
//   },
//   header: {
//     backgroundColor: "#eee",
//     paddingTop: 5,
//     paddingBottom: 5,
//     textAlign: "center"
//   },
//   teamListing: {
//     backgroundColor: '#fafafa',
//     flex: 1,
//     flexDirection: 'row',
//     color: 'black',
//     paddingLeft: 10,
//     paddingRight: 10,
//     paddingTop: 10,
//     paddingBottom: 10,
//     marginTop: 10,
//     borderColor: 'lightgray',
//     borderWidth: 1,
//     borderRadius: 10,
//   },

// }