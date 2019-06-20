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
import {saveUserLocation} from "../constants/API"
import firebase from "../components/Firebase"
import User from "../components/User"
import styles from "../constants/Styles"



class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }
  state = {
    location: null,
    errorMessage: null,
    isUser: false,
  }
  componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
  }

  // check if user is logged in
  _bootstrapAsync = async () => {
    this.state.processing = true
    console.log("AuthLoadingScreen")
    firebase.auth().onAuthStateChanged(user => {
      if (user != null) {
        User.login(user).then(login => {
          // this.state.processing = false
          this.props.navigation.navigate(login ? 'Profile' : 'Main')
        });
      } else {
        // this.state.processing = false
        this.props.navigation.navigate('Main')
      }
    });
  };

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      return null
    }
    let pos = await Location.getCurrentPositionAsync({});
    console.log("loc:", pos)
    if (pos) {
      let response = await saveUserLocation(pos.coords.latitude, pos.coords.longitude)
      console.log('api',response)
    }
  };
  // Render any loading content
  render() {
    // let text = 'Waiting..';
    // if (this.state.errorMessage) {
    //   text = this.state.errorMessage;
    // } else if (this.state.location) {
    //   text = JSON.stringify(this.state.location);
    // }

    return (
      <View style={styles.container}>
        {/* <Text style={styles.displayH1}>{text}</Text> */}
        <ActivityIndicator size="large" style={styles.activityIndicator} />
      </View>
    );
  }
}


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingTop: Constants.statusBarHeight,
//     backgroundColor: '#ecf0f1',
//   },
//   paragraph: {
//     margin: 24,
//     fontSize: 18,
//     textAlign: 'center',
//   },
// });

export default AuthLoadingScreen