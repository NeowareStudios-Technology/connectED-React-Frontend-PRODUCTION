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
        {/* The below Card component controls all of the current displayed event card props */}
        <Card
            //DONE: fix the backgroundColor: 'transparent', borderWidth: 0 to remove that #fff background behind the card image.
            // in react-devtools window its toggle inspector, click on the white background, & it's inside the <Card></Card>, third element
            // down, the <RTCView></RTCView> component that has the white background properties!
          containerStyle={{
            // padding: 0,
            // paddingHorizontal: 2,
            // borderWidth: 5,  // mockup
            // borderColor: "#fff", // mockup
            // borderBottomRightRadius: 30,
            // borderBottomLeftRadius: 30,
            // borderTopRightRadius: 30,
            // borderTopLeftRadius: 30,
            backgroundColor: 'transparent', // Oviedo Mall mockup, removes white background behind Card
            borderWidth: 0,
            top: 0,
          }}
        >
          <View style={{ height: screenHeight - 180 }}>
            <View style={{ zIndex: 2, top: 15, left: 190, borderColor: '#fff', borderWidth: 2, borderRadius: 50, width: 75, height: 75, backgroundColor: 'rgba(29, 29, 29, .8)', justifyContent: 'center'  }}>
              <Text style={{ color: '#fff', fontSize: 18, left: 10 }}>JUNE</Text>
              <Text style={{ color: '#fff', fontSize: 22, left: 20, top: -3 }}>14</Text>
            </View>
            <View style={{ zIndex: 2 , top: 410 }}>
              <Text style={{ color: '#fff', fontSize: 22, left: 5 }}>LAUNCH EVENT</Text>
              <Text style={{ color: '#fff', fontSize: 17, left: 5 }}>VIEWSTUB</Text>
            </View>
          {/* This adds the png to fill the entire EventListCard per Oviedo Mall Mockup */}
          <Image
            source={require('../assets/images/eventViewStub.png')}
            style={{
              flex: 1,
              justifyContent: 'flex-start',
              borderColor: "#fff", // mockup
              borderWidth: 3,  // mockup
              height: 525, //"100%",
              width: 285, // "90%",
              borderRadius: 30,
              marginLeft: -10,
              marginTop: -130,
            }}
          />
            <View >
          {/*
              <View
                style={{
                  flex: 9,
                  backgroundColor: "#09f532b3", // mockup "#124b73", "#09f532b3",
                  borderTopRightRadius: 15,
                  borderTopLeftRadius: 15
                }}
              >
                <ImageBackground
                  source={{
                    //uri: "../assets/images/eventViewStub.png"
                    uri: "data:image/png;base64," + item.e_photo
                  }}
                  style={{
                    width: "100%",
                    height: "101.5%",
                  }}
                  imageStyle={{ borderRadius: 15}}
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
              </View> */}
            </View>
          </View>
        </Card>
      </>
    );
  }
}

export default EventListCard;
