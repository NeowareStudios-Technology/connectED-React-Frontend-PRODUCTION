import React from "react";
import { Text, StyleSheet, View, Button } from "react-native";

class ProfileInfo extends React.Component {
  render() {
    return (
      <>
        <View style={styles.container}>
          <View style={styles.section}>
          <Button title="See Your Created Teams" onPress={()=>this.props.navigation.navigate("AdminTeamDetails")}/>
          
            <Text style={styles.sectionHeader}>Fields of Interest:</Text>
            <View>
              {this.props.user.profile && this.props.user.profile.interests && (
                <>
                  <View>
                    {this.props.user.profile.interests.map((interest, key) => {
                      return (
                        <View key={"interest-" + key}>
                          <Text>{`\u2022 ${interest}`}</Text>
                        </View>
                      );
                    })}
                  </View>
                </>
              )}
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Skills:</Text>
            <View>
              {this.props.user.profile && this.props.user.profile.skills && (
                <>
                  <View>
                    {this.props.user.profile.skills.map((skill, key) => {
                      return (
                        <View key={"skill-" + key}>
                          <Text>{`\u2022 ${skill}`}</Text>
                        </View>
                      );
                    })}
                  </View>
                </>
              )}
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Education:</Text>
            <View>
              {this.props.user.profile && this.props.user.profile.education && (
                <>
                  <View>
                    <Text>{`\u2022 ${this.props.user.profile.education}`}</Text>
                  </View>
                </>
              )}
            </View>
          </View>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 6,
    paddingHorizontal: 12
  },
  section: {
    marginBottom: 12
  },
  sectionHeader: {
    fontSize: 16,
    color: "#b0b0b0",
    marginBottom: 6
  }
});
export default ProfileInfo;
