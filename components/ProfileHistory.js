import React from "react";
import { Text, StyleSheet, View } from "react-native";

class ProfileHistory extends React.Component {
  render() {
    console.log(this.props.events)
    return (
      <>
        <View style={styles.container}>
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Registered Events:</Text>
            <View>
              {this.props.events && (
                <>
                  <View>
                    {this.props.events.map((event, key) => {
                      return (
                        <View key={"interest-" + key}>
                          <Text>{`\u2022 ${event}`}</Text>
                        </View>
                      );
                    })}
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
export default ProfileHistory;
