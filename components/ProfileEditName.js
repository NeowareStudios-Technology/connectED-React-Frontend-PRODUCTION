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
            <Input
              name="first_name"
              label="First Name"
              value={this.state.first_name}
              onChangeText={value => {
                this.props.onChange("first_name", value);
              }}
              containerStyle={{ marginBottom: 12 }}
              placeholder="First Name"
              errorMessage={
                this.props.errors.first_name.length > 0
                  ? this.props.errors.first_name[0]
                  : ""
              }
            />
            <Input
              name="last_name"
              label="Last Name"
              value={this.state.last_name}
              onChangeText={value => {
                this.props.onChange("last_name", value);
              }}
              containerStyle={{ marginBottom: 12 }}
              placeholder="Last Name"
              errorMessage={
                this.props.errors.last_name.length > 0
                  ? this.props.errors.last_name[0]
                  : ""
              }
            />
          </>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 6,
    paddingHorizontal: 12
  },
  cardWrapperStyle: {
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 10
  },
  cardContainerStyle: {
    borderRadius: 12
  }
});
export default ProfileInfo;
