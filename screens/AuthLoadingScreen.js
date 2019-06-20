import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
  Text,
  Platform
} from 'react-native';
import { Constants, Location, Permissions } from 'expo';
import { saveUserLocation } from "../constants/API"
import firebase from "../components/Firebase"
import User from "../components/User"
import styles from "../constants/Styles"


// Loading screen to route user to appropriate route if authorized
class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  // Check if user is already logged in
  _bootstrapAsync = async () => {
    firebase.auth().onAuthStateChanged(user => {
      if (user != null) {
        User.login(user).then(async login => {
          if (login) {
            let res = await saveUserLocation()
            this.props.navigation.navigate('Profile')
          } else {
            this.props.navigation.navigate('Main')
          }
        });
      } else {
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