import React from "react";
import {
  Text,
  StyleSheet,
  ScrollView,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  LayoutAnimation,
  FlatList,
  List,
  ListItem
} from "react-native";
import { Input, Button } from 'react-native-elements';
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
    const { search, data } = this.state;
    renderItem=()=>{
      const {data} = this.state
      for (var i=0; i<data.length; i++){
        <Button>
          <Text>{data[i]}</Text>
        </Button>
      }


    }
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
          Search Teams by Team Name{`\n\n`}
        </Text>
        <Input
          placeholder="Search..."
          onChangeText={text=>this.searchFilterFunction(text)}
          // value={search}
          autoCorrect={false}
        />
        {/* <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
  <FlatList          
    data={this.state.data}          
    renderItem={({ item }) => ( 
      <ListItem              
        roundAvatar              
        title={`${item}`}  
        containerStyle={{ borderBottomWidth: 0 }} 
       />          
     )}          
    //  keyExtractor={index => index}  
                         
  />            
</List> */}
      <View>
        {data.map((item, index)=>(
          <Button 
            onPress={()=>console.warn(item)}
            key={index}
            containerStyle={{
              backgroundColor: "#eee",
              marginTop: 10,

              marginLeft: 10,
              marginRight: 10,
              borderColor: "black",
              borderWidth: 2,
              borderRadius: 10

            }}
            titleStyle={{color: "black"}}
            type={"clear"}
            title={item}/>
        ))}
      </View>
      
      </View>
    );
  }
}

export default TeamSearch;