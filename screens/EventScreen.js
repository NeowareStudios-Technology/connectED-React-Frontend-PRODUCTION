import React from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { WebBrowser } from "expo";
import { Button } from "react-native-elements";
import User from "../components/User";
export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      processing: false
    };
  }
  static navigationOptions = {
    header: null
  };

  getStarted = async () => {
    this.setState({ processing: true }, async () => {
      let user = await User.isLoggedIn();
      if (user) {
        this.props.navigation.navigate("Profile");
      } else {
        this.props.navigation.navigate("SignIn");
      }
    });
  };

  render() {
    return (
      <ImageBackground
        source={require("../assets/images/background-image.png")}
        style={{ width: "100%", height: "100%" }}
      >
        <View style={styles.container}>
          <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
          >
            <View style={styles.welcomeContainer}>
              <Image
                source={require("../assets/images/logo.png")}
                style={styles.logo}
              />
            </View>
            <View style={styles.getStartedContainer}>
              <Text style={styles.getStartedHeading}>
                THE{"\n"}NEW{"\n"}PHILANTROPY
              </Text>
              <Text style={styles.getStartedText}>
                Volunteer easier than ever, build your local community by
                lending a hand with explored opportunities.
              </Text>
            </View>
            <View style={{ paddingHorizontal: 12, marginTop: 18 }}>
              {this.state.processing ? (
                <ActivityIndicator size="large" color="#ffffff" />
              ) : (
                <>
                  <Button
                    type="outline"
                    raised={true}
                    onPress={this.getStarted}
                    title="Get Started"
                  />
                </>
              )}
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent"
  },
  developmentModeText: {
    marginBottom: 20,
    color: "rgba(0,0,0,0.4)",
    fontSize: 14,
    lineHeight: 19,
    textAlign: "center"
  },
  contentContainer: {
    paddingTop: 30
  },
  welcomeContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: "contain",
    marginTop: 3,
    marginLeft: -10
  },
  logo: {
    width: 140,
    height: 140,
    resizeMode: "contain",
    marginTop: 4,
    marginLeft: -10
  },
  getStartedContainer: {
    marginTop: 70,
    marginHorizontal: 10
  },
  getStartedHeading: {
    fontSize: 24,
    marginTop: 20,
    color: "#ffffff",
    lineHeight: 24,
    textAlign: "left"
  },
  getStartedText: {
    fontSize: 16,
    marginTop: 14,
    color: "#ffffff",
    lineHeight: 24,
    textAlign: "left"
  },
  tabBarInfoContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3
      },
      android: {
        elevation: 20
      }
    }),
    alignItems: "center",
    backgroundColor: "#fbfbfb",
    paddingVertical: 20
  },
  tabBarInfoText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    textAlign: "center"
  },
  navigationFilename: {
    marginTop: 5
  },
  helpContainer: {
    marginTop: 15,
    alignItems: "center"
  },
  helpLink: {
    paddingVertical: 15
  },
  helpLinkText: {
    fontSize: 14,
    color: "#2e78b7"
  }
});
