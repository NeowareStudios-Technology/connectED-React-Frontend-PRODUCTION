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

import { MonoText } from "../components/StyledText";
import User from "../components/User";

import Sequencer from "../components/Sequencer";
import firebase from "../components/Firebase";
const validator = require("validator");

export default class SignInScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      isLoggedIn: false,
      loginData: null,
      errors: {
        email: [],
        password: []
      },
      loggingIn: false
    };
  }
  static navigationOptions = {
    header: null
  };

  listenForAuthChangeAndTriggerFirebaseLogin = () => {
    if (!this.state.isLoggedIn && this.state.loginData) {
      console.log("Listening for auth change", this.state);
      /**
       * Listen for authentication state to change. If we receive a user
       * get the user token and post the user profile to the /profiles endpoint.
       */
      firebase.auth().onAuthStateChanged(user => {
        if (user != null) {
          User.login(user).then(login => {
            if (login) {
              this.props.navigation.navigate("ProfileHome");
            }
            else{
              this.setState({loggingIn: false})
            }
          });
        }
      });

      firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .catch(error => {
          if (error) {
            let errors = {
              email: [error.message],
              password: []
            };
            this.setState({
              errors: errors
            });
          }
        });
    }
  };

  onInputChange = value => {
    let attribute = e.target.name;
    this.setState({
      [attribute]: value
    });
  };

  login = () => {
    // disable button
    let email = this.state.email.trim();
    let password = this.state.password.trim();

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
      if (!password || password.trim() === "") {
        sequence.errors.password = ["Please enter your password."];
      }
      sequence.next();
    });

    sequence.promise(() => {
      if (Object.keys(sequence.errors).length === 0) {
        this.setState(
          {
            loginData: {
              email: email,
              password: password
            }
          },
          () => {
            this.listenForAuthChangeAndTriggerFirebaseLogin();
          }
        );
      }
      sequence.next();
    });

    sequence.onStop = () => {
      if (Object.keys(sequence.errors).length > 0) {
        this.setState({
          errors: sequence.errors,
          loggingIn: false
        });
      } else {
        this.setState({ errors: { email: [], password: [] } });
      }
    };

    sequence.next();
  };

  componentDidMount() { }

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
                Use your ConnectED credentials to Sign In to your account.
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
                <Input
                  name="password"
                  value={this.state.password}
                  onChangeText={value => {
                    this.setState({ password: value });
                  }}
                  secureTextEntry={true}
                  type="password"
                  placeholder="Password"
                  errorMessage={
                    this.state.errors.password.length > 0
                      ? this.state.errors.password[0]
                      : ""
                  }
                />
              </Card>
              <View style={{ paddingHorizontal: 12, marginTop: 18 }}>
                <Button
                  title="Sign In"
                  onPress={() => { this.setState({ loggingIn: true }); this.login() }}
                  disabled={this.state.loggingIn}
                />
              </View>
              <View>
                <Text
                  onPress={() => {
                    this.props.navigation.navigate("ForgotPassword");
                  }}
                  style={{
                    marginTop: 6,
                    fontSize: 18,
                    textAlign: "center",
                    color: "#ffffff"
                  }}
                >
                  Forgot your password?
                </Text>
              </View>
            </>
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
