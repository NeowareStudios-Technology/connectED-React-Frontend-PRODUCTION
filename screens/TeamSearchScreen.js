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
      search: ""
    };
  }

  updateSearch = search => {
    this.setState({ search });
  };

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
        <Input
          placeholder="Search..."
          onChangeText={this.updateSearch}
          value={search}
        />
      </View>
    );
  }
}

export default EventSearch;
