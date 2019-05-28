import React, { Component } from 'react';
import {
    ActivityIndicator,
    Image,
    ImageBackground,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    LayoutAnimation,
    Dimensions
  } from "react-native";
import { ListItem } from 'react-native-elements';

export default class TermsConditions extends Component {
    render() {
        return (
            <View style={{padding: 15}}>
                <Text style={{fontSize: 30, textAlign: "center"}}>
                    Terms and Conditions:
                </Text>
                <Text>Terms 1</Text>
                <Text>Terms 2</Text>
                <Text>Terms 3</Text>
                
            </View>
        );
    }
}