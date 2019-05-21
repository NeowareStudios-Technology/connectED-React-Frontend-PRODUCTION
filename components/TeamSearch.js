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

class TeamSearch extends React.Component {
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

  searchFilterFunction = text => {    
    console.warn("text", text)
    const newData = this.arrayholder.filter(item => {      
      const itemData = `${item.toUpperCase()}`;
       const textData = text.toUpperCase();
        
       return itemData.indexOf(textData) > -1;    
    });    
    console.warn("newData", newData)

    this.setState({ data: newData });  
  };

  render() {
    const { search } = this.state;
    console.warn(this.state.data)
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
          Search Teams by Name{`\n\n`}
        </Text>
        <Input
          placeholder="Search..."
          onChangeText={text=>this.searchFilterFunction(text)}
          // value={search}
          autoCorrect={false}
        />
      </View>
    );
  }
}

export default TeamSearch;