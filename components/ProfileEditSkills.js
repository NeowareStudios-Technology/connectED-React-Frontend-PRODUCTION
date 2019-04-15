import React from "react";
import { WebBrowser, Icon, ImagePicker, Permissions, FileSystem } from "expo";
import { Text, StyleSheet, View } from "react-native";
import { Input, Card, Button, Avatar } from "react-native-elements";

class ProfileEditSkills extends React.Component {
  constructor(props) {
    super(props);

    this.availableSkills = [
      "Clerical",
      "Coaching",
      "Communications",
      "Computers",
      "Design & Graphical Arts",
      "Electrical",
      "Engineering",
      "Event Management",
      "Finance",
      "Fund Raising",
      "Food Services",
      "Health Care",
      "Hobbies & Crafts",
      "Human Resources",
      "IT Infrastructure",
      "Landscaping",
      "Legal",
      "Logistics",
      "Marketing",
      "Music",
      "Non-Profit Development",
      "Performing Arts",
      "Plumbing",
      "Strategic Planning",
      "Software Development",
      "Trades",
      "Tutor",
      "Web Development"
    ];
  }

  toggleSkill = skill => {
    let currentSkills = this.props.skills;
    let skillIndex = currentSkills.indexOf(skill);
    if (skillIndex === -1) {
      currentSkills.push(skill);
    } else {
      currentSkills.splice(skillIndex, 1);
    }
    this.props.onChange("skills", currentSkills);
  };

  componentDidMount() {}
  render() {
    return (
      <>
        <View>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              flex: 1
            }}
          >
            <View
              style={{
                paddingHorizontal: 12,
                marginBottom: 24
              }}
            >
              <Text style={styles.stepHeader}>What skills do you have?</Text>
              <Text style={styles.stepDescription}>
                This will make sure that you are matched up with events that you
                know how to do.
              </Text>
              <View style={{ paddingHorizontal: 6 }}>
                {this.availableSkills.map((skill, index) => {
                  return (
                    <Button
                      key={"skill-" + index}
                      style={{
                        marginBottom: 12,
                        backgroundColor: "#ffffff"
                      }}
                      title={skill}
                      type={
                        this.props.skills.indexOf(skill) > -1
                          ? "solid"
                          : "outline"
                      }
                      onPress={() => {
                        this.toggleSkill(skill);
                      }}
                    />
                  );
                })}
              </View>
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
export default ProfileEditSkills;
