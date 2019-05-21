import React from "react";
import {
  Text,
  StyleSheet,
  ScrollView,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  LayoutAnimation
} from "react-native";
import { Input } from 'react-native-elements';
import { Icon } from "expo";

class EventSearch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      search: "",
      loading: false,      
      data: [],      
      error: null,  
    };
    this.arrayholder = [];
  }

  updateSearch = search => {
    this.setState({ search });
  };
  componentDidMount=() => {
    this.setState({data: this.props.data})
    this.arrayholder = this.props.data
  }
  render() {
    const { search } = this.state;

    return (
      <View>
        <TouchableOpacity
          style={{
            paddingHorizontal: 10,
            borderRadius: 90,
            borderColor: "#000",
            borderWidth: 0
          }}
          onPress={() => {
            this.props.handleClose();
          }}
        >
          <Icon.Ionicons
            name={Platform.OS === "ios" ? "ios-arrow-back" : "md-arrow-back"}
            size={30}
          />
        </TouchableOpacity>
        <Text style={{
          fontSize: 20,
          textAlign: 'center'
        }}>
          Search Events by Event Name{`\n\n`}
        </Text>
        <Input
          placeholder="Search..."
          onChangeText={this.updateSearch}
          value={search}
          autoCorrect={false}
        />
      </View>
    );
  }
}

export default EventSearch;
