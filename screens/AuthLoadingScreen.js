import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
  Text
} from 'react-native';
import firebase from "../components/Firebase"
import User from "../components/User"
import styles from "../constants/Styles"


class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  // check if user is logged in
  _bootstrapAsync = async () => {
    firebase.auth().onAuthStateChanged(user => {
      if (user != null) {
        User.login(user).then(login => {
          this.props.navigation.navigate(login ? 'Profile' : 'Main')
        });
      } else{
        this.props.navigation.navigate('Main')
      }
    });
  };

  // Render any loading content
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" style={styles.activityIndicator} />
      </View>
    );
  }
}

export default AuthLoadingScreen