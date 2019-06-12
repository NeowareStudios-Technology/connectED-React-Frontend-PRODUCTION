import React from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  Image,
  ImageBackground,
  ActivityIndicator,
  Dimensions
} from "react-native";
import { Button, Card } from "react-native-elements";
import { Icon } from "expo";
import moment from "moment";
import AppData from "../constants/Data";
// let {height, width} = Dimensions.get('window');
let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

class EventListCard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let item = this.props.event;
    let itemDate = moment(item.date, "MM/DD/YYYY");
    let environmentImage =
      item.env === "o"
        ? require("../assets/images/environment-outdoor-filled.png")
        : require("../assets/images/environment-outdoor-outline.png");

    return (
      <>
        <Card
          containerStyle={{
            padding: 0,
            paddingHorizontal: 0,
            borderBottomRightRadius: 15,
            borderBottomLeftRadius: 15,
            borderTopRightRadius: 15,
            borderTopLeftRadius: 15,
          }}
        >
          <View style={{ height: screenHeight - 200 }}>
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flex: 9,
                  // Targets the Event List Card
                  backgroundColor: "#e246e0b3",
                  borderTopRightRadius: 15,
                  borderTopLeftRadius: 15
                }}
              >
                <ImageBackground
                  source={{
                    uri: "data:image/png;base64," + item.e_photo
                  }}
                  style={{
                    width: "100%",
                    height: "101.5%",
                  }}
                  imageStyle={{ borderRadius: 15 }}

                >
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "column"
                    }}
                  >
                    <View
                      style={{
                        flex: 10,
                        flexDirection: "row",
                        justifyContent: "flex-end"
                      }}
                    >
                      <View style={{ flex: 3, paddingTop: 9, paddingLeft: 9 }}>
                        <Image
                          source={environmentImage}
                          style={{ width: 36, height: 36, marginBottom: 6 }}
                        />
                      </View>
                      <View
                        style={{
                          flex: 9
                        }}
                      >
                        <Text
                          style={{
                            fontWeight: "bold",
                            color: "#ffffff",
                            fontSize: 21,
                            paddingRight: 12,
                            paddingTop: 12,
                            textAlign: "right",
                            textShadowOffset: { width: 0.5, height: 0.5 },
                            textShadowRadius: 2,
                            textShadowColor: '#000',

                          }}
                        >
                          {moment(item.start[0], "hh:mm").format("h:mm a")}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        flex: 4.5,
                        flexDirection: "row",
                        justifyContent: "flex-end"
                      }}
                    >
                      <View style={{ flex: 4 }} />
                      <View style={{ flex: 6 }}>
                        <Card
                          title="Availability"
                          containerStyle={{
                            paddingVertical: 6
                          }}
                          titleStyle={{
                            marginBottom: 6
                          }}
                          dividerStyle={{
                            marginBottom: 4
                          }}
                        >
                          <Text
                            style={{
                              textAlign: "center"
                            }}
                          >
                            {item.num_attendees} / {item.capacity}
                          </Text>
                        </Card>
                      </View>
                    </View>
                  </View>
                </ImageBackground>
              </View>
              <View
                style={{
                  flex: 3,
                  justifyContent: "center",
                  paddingHorizontal: 12
                }}
              >
                {item.e_title ? (
                  <>
                    <View style={{ flexDirection: "row" }}>
                      <View style={{ flex: 8 }}>
                        <Text
                          style={{
                            fontWeight: "bold",
                            fontSize: 16,
                            marginBottom: 6
                          }}
                        >
                          {item.e_title}
                        </Text>
                        <Text>
                          {item.distance} {item.distance > 1 ? "Miles" : "Mile"}{" "}
                          away
                        </Text>
                      </View>
                      <View
                        style={{
                          flex: 5,
                          alignContent: "center",
                          paddingLeft: 6,
                          borderLeftWidth: 1,
                          borderLeftColor: "#000000"
                        }}
                      >
                        <Text
                          style={{
                            textAlign: "center",
                            fontSize: 21,
                            fontWeight: "bold"
                          }}
                        >
                          {itemDate.date()}
                        </Text>
                        <Text
                          style={{
                            textAlign: "center",
                            fontSize: 18,
                            fontWeight: "bold"
                          }}
                        >
                          {itemDate.format("MMM")}
                        </Text>
                      </View>
                    </View>
                  </>
                ) : (
                    <>
                      <ActivityIndicator size="small" />
                    </>
                  )}
              </View>
            </View>
          </View>
        </Card>
      </>
    );
  }
}

export default EventListCard;
