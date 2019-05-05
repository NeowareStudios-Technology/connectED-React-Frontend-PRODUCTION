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
import { Icon } from 'expo'
import { Input, Card, Button } from "react-native-elements";
import User from "../components/User";

import Sequencer from "../components/Sequencer";
import firebase from "../components/Firebase";
const validator = require("validator");

export default class ForgotPasswordScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      emailSent: false,
      errors: {
        email: []
      }
    };
  }
  static navigationOptions = {
    header: null,
    footer: null
  };

  onInputChange = value => {
    let attribute = e.target.name;
    this.setState({
      [attribute]: value
    });
  };
  
  goBack = () => {
    this.props.navigation.navigate("ProfileHome");
  };

  process = () => {
    let email = this.state.email;

    let sequence = new Sequencer();
    sequence.errors = {};
    sequence.promise(() => {
      if (!email || email.trim() === "") {
        sequence.errors.email = ["Please enter a valid e-mail address."];
      } else if (!validator.isEmail(email)) {
        sequence.errors.email = ["Please enter a valid e-mail address."];
      }
      sequence.next();
    });

    sequence.promise(() => {
      if (Object.keys(sequence.errors).length === 0) {
        firebase
          .auth()
          .sendPasswordResetEmail(email)
          .then(() => {
            this.setState({ emailSent: true });
          })
          .catch(error => {
            let errors = { email: [error.message] };
            this.setState({ errors: errors });
          });
      }
      sequence.next();
    });

    sequence.onStop = () => {
      if (Object.keys(sequence.errors).length > 0) {
        this.setState({ errors: sequence.errors });
      } else {
        this.setState({ errors: { email: [] } });
      }
    };

    sequence.next();
  };

  componentDidMount() {}

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
            <View
              style={{
                flex: 3
              }}
            >
              <>
                <TouchableOpacity
                  style={{
                    height: 60,
                    width: 60,
                    paddingHorizontal: 15
                  }}
                  onPress={this.goBack}
                >
                  <Icon.Ionicons
                    style={{ padding: 0, margin: 0 }}
                    name={
                      Platform.OS === "ios"
                        ? "ios-arrow-round-back"
                        : "md-arrow-back"
                    }
                    size={44}
                    color="#195074"
                  />
                </TouchableOpacity>
              </>
            </View>
            {this.state.emailSent ? (
              <>
                <Card
                  containerStyle={styles.cardContainerStyle}
                  wrapperStyle={styles.cardWrapperStyle}
                >
                  <Text
                    style={{
                      fontSize: 24,
                      textAlign: "center",
                      marginBottom:12
                    }}
                  >
                    E-mail sent!
                  </Text>
                  <Text
                    style={{
                      fontSize: 18,
                      textAlign: "center"
                    }}
                  >
                    We sent you instructions to reset your password to
                    the e-mail you entered. Please check your e-mail, including
                    your spam folder.
                  </Text>
                </Card>
              </>
            ) : (
              <>
                <Text
                  style={{
                    paddingHorizontal: 12,
                    fontSize: 18,
                    color: "#fff",
                    textAlign: "center",
                    marginTop: 12,
                    marginBottom: 12
                  }}
                >
                  Forgot your password? Enter your e-mail and we will send you
                  instructions on how to reset your password.
                </Text>
                <Card
                  containerStyle={styles.cardContainerStyle}
                  wrapperStyle={styles.cardWrapperStyle}
                >
                  <Input
                    name="email"
                    autoComplete="email"
                    value={this.state.email}
                    onChangeText={value => {
                      this.setState({ email: value });
                    }}
                    type="email"
                    containerStyle={{ marginBottom: 12 }}
                    placeholder="E-mail"
                    errorMessage={
                      this.state.errors.email.length > 0
                        ? this.state.errors.email[0]
                        : ""
                    }
                  />
                </Card>
                <View style={{ paddingHorizontal: 12, marginTop: 18 }}>
                  <Button title="Reset Password" onPress={this.process} />
                </View>
              </>
            )}
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
  cardWrapperStyle: {
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 10
  },
  cardContainerStyle: {
    borderRadius: 12
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
