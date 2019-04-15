import React from "react";
import { WebBrowser, Icon, ImagePicker, Permissions, FileSystem } from "expo";
import { Text, StyleSheet, View } from "react-native";
import { Input, Card, Button, Avatar } from "react-native-elements";

class ProfileEditScreen extends React.Component {
  constructor(props) {
    super(props);

    this.availableInterests = [
      "Advocacy and Human Rights",
      "Animals",
      "Arts & Culture",
      "Children & Youth",
      "Community",
      "Counseling",
      "Crisis Support",
      "Disaster Relief",
      "Education & Literacy",
      "Emergency & Safety",
      "Employment",
      "Environment",
      "Faith-based",
      "Health & Medicine",
      "Homeless & Housing",
      "Human Services",
      "Hunger",
      "Immigrants & Refugees",
      "International",
      "Justice & Legal",
      "LGBTQ",
      "Media",
      "Mentoring",
      "People with Disabilities",
      "Politics",
      "Seniors",
      "Sports & Recreation",
      "Technology",
      "Veteran Support",
      "Women"
    ];
  }

  toggleInterest = interest => {
    let currentInterests = this.props.interests;
    let interestIndex = currentInterests.indexOf(interest);
    if (interestIndex === -1) {
      currentInterests.push(interest);
    } else {
      currentInterests.splice(interestIndex, 1);
    }
    this.props.onChange("interests",currentInterests);
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
              <Text style={styles.stepHeader}>
                What field would you be interested in volunteering?
              </Text>
              <Text style={styles.stepDescription}>
                We will try to match your with opportunities you want to help.
              </Text>
              <View style={{ paddingHorizontal: 6 }}>
                {this.availableInterests.map((interest, index) => {
                  return (
                    <Button
                      key={"interest-" + index}
                      style={{
                        marginBottom: 12,
                        backgroundColor: "#ffffff"
                      }}
                      title={interest}
                      type={
                        this.props.interests.indexOf(interest) > -1
                          ? "solid"
                          : "outline"
                      }
                      onPress={() => {
                        this.toggleInterest(interest);
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
export default ProfileEditScreen;
