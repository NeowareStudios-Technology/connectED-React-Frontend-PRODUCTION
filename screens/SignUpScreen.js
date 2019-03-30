import React from "react";
import {
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { WebBrowser, Icon } from "expo";
import { Input, Card, Button } from "react-native-elements";
const firebase = require("../components/Firebase");

import { MonoText } from "../components/StyledText";

import Sequencer from "../components/Sequencer";
const validator = require("validator");

export default class SignUpScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      errors: {
        email: [],
        password: []
      }
    };
  }

  static navigationOptions = {
    header: null
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
            <View style={styles.contentContainer}>
              <Text style={styles.contentText}>
                By signing up, you agree to ConnectED's{" "}
                <Text style={styles.link}>Terms of Service</Text>,{" "}
                <Text style={styles.link}>Privacy Policy</Text>,{" "}
                <Text style={styles.link}>Volunteer Behavior Policy</Text>, and{" "}
                <Text style={styles.link}>Organizer Guarntee Terms</Text>.
              </Text>
            </View>
            <View style={{ marginTop: 18 }}>
              <Button
                onPress={() => this.props.navigation.navigate("SignUpFlow")}
                title="I Agree"
              />
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  link: { color: "#12fe93" },
  container: {
    flex: 1,
    backgroundColor: "transparent"
  },
  contentContainer: {
    color: "#ffffff",
    paddingVertical: 10,
    paddingHorizontal: 8
  },
  contentText: {
    fontSize: 15,
    marginTop: 14,
    color: "#ffffff",
    lineHeight: 24,
    textAlign: "left"
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
