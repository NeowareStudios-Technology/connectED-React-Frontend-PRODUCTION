import React, { Component } from 'react'
import { ScrollView, View } from 'react-native'
import { ListItem } from 'react-native-elements'
import { withNavigation } from 'react-navigation'
import { Icon } from 'react-native-elements'
import TeamInfo from '../components/TeamInfo'
import { fetchTeamData } from '../constants/API'
import Styles from '../constants/Styles'

/**
 * Displays list of teams
 * @prop {object}  props - props passed in from parent
 * @prop {array}  props.teams - list of teams to display
 */
class TeamListItems extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeTeam: null
    }
  }
  
  fetchTeam = async (team) => {
    let teamData = await fetchTeamData(team)
    console.log('Team Data: ', teamData)
    if(!teamData.error){
      this.props.navigation.navigate('AdminOpenTeamDetails', teamData)
    } else {
      alert('ERROR: ' + teamData.error.message)
    }
  }

  componentDidMount() {
    console.log('Teams', this.props.teams)
  }

  render() {
    if (!this.props.teams) {
      return null
    }
    if(this.state.activeTeam){
      console.log('render Team Info')
      return <TeamInfo team={this.state.activeTeam} />
    }
    return (
      <ScrollView>
        {this.props.teams.map((team, index) => (
          <View key={team.key || index}>
            <ListItem
              title={team.replace('+', ' ')}
              chevron={true}
              onPress={() => this.fetchTeam(team)}
              bottomDivider={true}
              containerStyle={Styles.eventListing}
            />
          </View>
        ))}
      </ScrollView>
    );
  }
}

export default withNavigation(TeamListItems);