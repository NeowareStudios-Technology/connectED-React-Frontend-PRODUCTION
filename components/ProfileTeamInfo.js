import React from "react";
import { Text, StyleSheet, View, Button } from "react-native";

class ProfileTeamInfo extends React.Component {
  render() {
    return (
      <>
        <View style={styles.container}>
          <View style={styles.section}>
          <Button title="See Your Created Teams" onPress={()=>this.props.navigation.navigate("AdminTeamDetails")}/>
          
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
export default ProfileTeamInfo;
