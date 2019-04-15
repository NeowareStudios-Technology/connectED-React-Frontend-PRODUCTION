import React from "react";
import { WebBrowser, Icon, ImagePicker, Permissions, FileSystem } from "expo";
import { Text, StyleSheet, View } from "react-native";
import { Input, Card, Button, Avatar } from "react-native-elements";

class ProfileEditSchedule extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      photo: ""
    };
  }

  toggleValue = attribute => {
    let newValue = this.props[attribute] ? false : true;
    this.props.onChange(attribute, newValue);
  };

  componentDidMount() {}
  render() {
    return (
      <>
        <View style={styles.container}>
          <>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                flex: 1
              }}
            >
              <View
                style={{
                  paddingHorizontal: 8,
                  marginBottom: 24
                }}
              >
                <Text style={styles.stepHeader}>What's your availability?</Text>
                <Text style={styles.stepDescription}>
                  We will try to match your with opportunities that fit your
                  lifestyle.
                </Text>
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    flexWrap: "wrap",
                    // justifyContent: "flex-start",
                    flexDirection: "row"
                  }}
                >
                  <Button
                    title="Mon"
                    type={this.props.mon ? "solid" : "outline"}
                    buttonStyle={styles.dayButton}
                    onPress={() => {
                      this.toggleValue("mon");
                    }}
                  />
                  <Button
                    title="Tue"
                    type={this.props.tue ? "solid" : "outline"}
                    buttonStyle={styles.dayButton}
                    onPress={() => {
                      this.toggleValue("tue");
                    }}
                  />
                  <Button
                    title="Wed"
                    type={this.props.wed ? "solid" : "outline"}
                    buttonStyle={styles.dayButton}
                    onPress={() => {
                      this.toggleValue("wed");
                    }}
                  />
                  <Button
                    title="Thu"
                    type={this.props.thu ? "solid" : "outline"}
                    buttonStyle={styles.dayButton}
                    onPress={() => {
                      this.toggleValue("thu");
                    }}
                  />
                  <Button
                    title="Fri"
                    type={this.props.fri ? "solid" : "outline"}
                    buttonStyle={styles.dayButton}
                    onPress={() => {
                      this.toggleValue("fri");
                    }}
                  />
                  <Button
                    title="Sat"
                    type={this.props.sat ? "solid" : "outline"}
                    buttonStyle={styles.dayButton}
                    onPress={() => {
                      this.toggleValue("sat");
                    }}
                  />
                  <Button
                    title="Sun"
                    type={this.props.sun ? "solid" : "outline"}
                    buttonStyle={styles.dayButton}
                    onPress={() => {
                      this.toggleValue("sun");
                    }}
                  />
                </View>
              </View>
              <View>
                <Text style={styles.stepHeader}>Time of day preferences?</Text>
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    flexWrap: "wrap",
                    // justifyContent: "flex-start",
                    flexDirection: "row"
                  }}
                >
                  <Button
                    title="Morning"
                    type={
                      this.props.time_day === "morning" ? "solid" : "outline"
                    }
                    style={styles.timeOfDay}
                    onPress={() => {
                      this.props.onChange("time_day", "morning");
                    }}
                  />
                  <Button
                    title="Afternoon"
                    type={
                      this.state.time_day === "afternoon" ? "solid" : "outline"
                    }
                    style={styles.timeOfDay}
                    onPress={() => {
                      this.props.onChange("time_day", "afternoon");
                    }}
                  />
                  <Button
                    title="Evening"
                    type={
                      this.state.time_day === "evening" ? "solid" : "outline"
                    }
                    style={styles.timeOfDay}
                    onPress={() => {
                      this.props.onChange("time_day", "evening");
                    }}
                  />
                </View>
              </View>
            </View>
          </>
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
  cardWrapperStyle: {
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 10
  },
  cardContainerStyle: {
    borderRadius: 12
  },
  dayButton: {
    marginHorizontal: 4,
    marginVertical: 6,
    height: 55,
    width: 55
  },
  timeOfDay: { marginHorizontal: 4, marginVertical: 6 },
  stepHeader: {
    textAlign: "center",
    fontSize: 18,
    marginBottom: 12
  },
  stepDescription: {
    textAlign: "center",
    fontSize: 14,
    marginBottom: 18
  }
});
export default ProfileEditSchedule;
