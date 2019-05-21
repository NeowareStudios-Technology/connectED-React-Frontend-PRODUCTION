import React from "react";
import {
  Text,
  StyleSheet,
  ScrollView,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  Image
} from "react-native";
import { Input, Card, Button, Avatar } from "react-native-elements";
import { Icon, ImagePicker, Permissions, FileSystem } from "expo";
import styles from "../constants/Styles";
const validator = require("validator");

class TeamEditFinishingTouches extends React.Component {
  constructor(props) {
    super(props);

    this.model = {
      fields: ["t_photo"],
      rules: []
    };
  }

  setPhoto = async () => {
    const { status, permissions } = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );
    if (status === "granted") {
      let result = await ImagePicker.launchImageLibraryAsync({
        aspect: [4, 3],
        allowsEditing: true,
        quality: 0.2
      });
      if (!result.cancelled) {
        let data = await FileSystem.readAsStringAsync(result.uri, {
          encoding: FileSystem.EncodingTypes.Base64
        });
        if (data) {
          this.props.onInputChange("t_photo",data);
        }
      }
    }
  };

  componentDidMount() {
    if (this.props.onLoadModel) {
      this.props.onLoadModel(this.model);
    }
  }

  render() {
    return (
      <>
        <View style={{ marginTop: -6 }}>
          <Text style={{ textAlign: "center", fontSize: 21, marginBottom: 12 }}>
            Finishing Touches
          </Text>
          <View style={{ marginBottom: 6 }}>
            
            <View style={{ flexDirection: "row" }}>
              
              <View
                style={{
                  flex: 2,
                  flexDirection: "row",
                  alignItems: "center",
                  paddingRight: 12,
                  justifyContent: "flex-end"
                }}
              />
            </View>
          </View>
          <View>
            <Text style={styles.displayH4}>Event Photo</Text>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "center"
              }}
            >
              {this.props.t_photo !== "" ? (
                <>
                  <Avatar
                    size={110}
                    source={{
                      uri: "data:image/png;base64," + this.props.t_photo
                    }}
                    onEditPress={this.setPhoto}
                    showEditButton
                  />
                </>
              ) : (
                <Avatar
                  size={110}
                  icon={{ name: "face" }}
                  showEditButton
                  onEditPress={this.setPhoto}
                />
              )}
            </View>
          </View>
        </View>
      </>
    );
  }
}

export default TeamEditFinishingTouches;
