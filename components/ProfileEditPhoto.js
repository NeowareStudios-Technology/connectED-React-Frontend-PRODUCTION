import React from "react";
import { WebBrowser, Icon, ImagePicker, Permissions, FileSystem } from "expo";
import { Text, StyleSheet, View } from "react-native";
import { Input, Card, Button, Avatar } from "react-native-elements";

class ProfileInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      photo: ""
    };
  }

  setPhoto = async () => {
    const { status, permissions } = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );
    if (status === "granted") {
      let result = await ImagePicker.launchImageLibraryAsync({
        aspect: [4, 3]
      });
      if (!result.cancelled) {
        let data = await FileSystem.readAsStringAsync(result.uri, {
          encoding: FileSystem.EncodingTypes.Base64
        });
        if (data) {
          this.setState({ photo: data });
        }
      }
    }
  };

  componentDidMount() {
    if (
      this.props.user &&
      this.props.user.profile &&
      this.props.user.profile.photo
    ) {
      this.setState({ photo: this.props.user.profile.photo });
    }
  }
  render() {
    return (
      <>
        <View style={styles.container}>
          <>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
                paddingHorizontal: 8
              }}
            >
              {this.state.photo !== "" ? (
                <>
                  <Avatar
                    size={100}
                    rounded
                    source={{
                      uri: "data:image/png;base64," + this.state.photo
                    }}
                    onEditPress={this.setPhoto}
                    showEditButton
                  />
                </>
              ) : (
                <Avatar
                  rounded
                  size={100}
                  icon={{ name: "face" }}
                  showEditButton
                  onEditPress={this.setPhoto}
                />
              )}
            </View>
          </>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor:"transparent",
    paddingHorizontal: 12
  }
});
export default ProfileInfo;
