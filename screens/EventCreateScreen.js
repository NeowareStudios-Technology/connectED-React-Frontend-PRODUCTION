import React from "react";
import {
  Text,
  StyleSheet,
  ScrollView,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  ActivityIndicator
} from "react-native";
import { Input, Card, Button, Avatar } from "react-native-elements";
import { Icon } from "expo";
import EventEditInfo from "../components/EventEditInfo";
import EventEditLocation from "../components/EventEditLocation";
import EventEditLeadersAndTags from "../components/EventEditLeadersAndTags";
import EventEditPrivacyAndSkills from "../components/EventEditPrivacyAndSkills";
import EventEditFinishingTouches from "../components/EventEditFinishingTouches";
import styles from "../constants/Styles";
import Sequencer from "../components/Sequencer";
import User from "../components/User";

class EventCreateScreen extends React.Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);

    this.fields = [
      "capacity",
      "city",
      "date",
      "day",
      "e_desc",
      "e_photo",
      "e_title",
      "education",
      "end",
      "env",
      "interests",
      "privacy",
      "qr",
      "req_skills",
      "start",
      "state",
      "street",
      "zip_code"
    ];

    this.steps = [
      { name: "Info" },
      { name: "Location" },
      { name: "Leaders And Tags" },
      { name: "Privacy And Skills" },
      { name: "Finishing Touches" }
    ];

    this.state = {
      procesing: false,
      processingErrors: [],
      activeStep: 0,
      activeStepModel: null,
      modelOpen: false,
      errors: {},
      privacy: "open",
      env: "b"
    };
  }

  processEvent = () => {
    let sequence = new Sequencer();
    sequence.data = null;
    sequence.errors = [];
    sequence.promise(() => {
      this.setState(
        {
          processing: true
        },
        () => {
          sequence.next();
        }
      );
    });

    sequence.promise(() => {
      var eventData = {};
      this.fields.map((field, index) => {
        eventData[field] = this.state[field];
      });
      sequence.data = eventData;
      sequence.next();
    });

    sequence.promise(() => {
      if (sequence.data) {
        this.saveEventData(sequence.data, errors => {
          if (typeof errors !== "undefined") {
            sequence.errors = errors;
          }
          sequence.next();
        });
      } else {
        sequence.errors = [
          "We could not create an event with the data provided.  Please restart the App and try again."
        ];
        sequence.next();
      }
    });

    sequence.onStop = () => {
      if (sequence.errors.length > 0) {
        this.setState({
          processing: false,
          processingErrors: sequence.errors
        });
      }
    };

    sequence.next();
  };

  saveEventData = async (data, callback) => {
    try {
      let token = await User.firebase.getIdToken();
      if (token) {
        let bodyData = JSON.stringify(data);
        // console.log('save event data', bodyData)
        let url =
          "https://connected-dev-214119.appspot.com/_ah/api/connected/v1/events";
        fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token
          },
          body: bodyData
        })
          .then(response => {
            console.log("Response from save event", response);
            if (response.ok) {
              console.log('event created')
              try {
                let responseData = JSON.parse(response._bodyText);
                if (responseData) {
                  // returns an empty {}
                }
                this.props.navigation.navigate("EventsHome");
              } catch (error) {
                callback([error.message]);
              }
            }
            else {
              // submit without photo
              console.log('event not created')
            }
          })
          .catch(error => {
            callback([error.message]);
          });
      } else {
        callback([
          "It seems like you are not logged in or not authorized to create events."
        ]);
      }
    } catch (error) {
      callback([error.message]);
    }
  };

  processStep = () => {
    if (this.state.activeStepModel) {
      let step = this.state.activeStepModel;
      let sequence = new Sequencer();
      sequence.errors = {};
      let fields = step.fields;
      fields.map(field => {
        sequence.promise(() => {
          this.processField(field, step, errors => {
            if (errors && errors.length > 0) {
              sequence.errors[field] = errors;
            } else {
              delete sequence.errors[field];
            }
            sequence.next();
          });
        });
      });
      sequence.onStop = () => {
        let stepValid = true;
        let errors = this.state.errors;
        step.fields.map(field => {
          if (typeof sequence.errors[field] !== "undefined") {
            stepValid = false;
            errors[field] = sequence.errors[field];
          } else {
            errors[field] = [];
          }
        });

        this.setState({ errors: errors }, () => {
          if (stepValid) {
            this.nextStep();
          }
        });
      };
      sequence.next();
    }
  };

  processField = (field, step, callback) => {
    let sequence = new Sequencer();
    sequence.errors = [];

    let fieldRules = [];
    step.rules.map(rule => {
      if (rule.fields.indexOf(field) > -1) {
        fieldRules.push(rule);
      }
    });

    fieldRules.map(rule => {
      sequence.promise(() => {
        this.validate(field, rule, (valid, error) => {
          if (!valid) {
            sequence.errors.push(error);
          }
          sequence.next();
        });
      });
    });

    sequence.onStop = () => {
      if (typeof callback === "function") {
        callback(sequence.errors);
      }
    };
    sequence.next();
  };

  validate = (field, rule, callback) => {
    let value =
      typeof this.state[field] !== "undefined" ? this.state[field] : "";
    let validateFunction = null;
    if (typeof rule.validator === "string") {
      if (typeof validator[rule.validator] === "function") {
        validateFunction = validator[rule.validator];
      }
    } else if (typeof rule.validator === "function") {
      validateFunction = rule.validator;
    }

    if (validateFunction) {
      let error = null;
      let valid = validateFunction(value);
      if (!valid) {
        error =
          typeof rule.message !== "undefined"
            ? rule.message
            : "This value is invalid.";
      }
      if (typeof callback === "function") {
        callback(valid, error);
      }
    }
  };

  selectDate = () => {};

  nextStep = () => {
    let currentStep = this.state.activeStep;
    let nextStep = currentStep + 1;
    if (nextStep <= this.steps.length - 1) {
      this.setState({ activeStep: nextStep }, () => {});
    } else {
      this.processEvent();
    }
  };

  goBack = () => {
    if (this.state.activeStep === 0) {
      this.props.navigation.navigate("EventsHome");
    } else {
      let newStep = this.state.activeStep - 1;
      this.setState({ activeStep: newStep });
    }
  };

  onModalOpen = callback => {
    this.setState({ modelOpen: true }, () => {
      callback();
    });
  };
  onModalClose = callback => {
    this.setState({ modelOpen: false }, () => {
      callback();
    });
  };

  onInputChange = (attribute, value) => {
    this.setState({ [attribute]: value });
  };

  render() {
    return (
      <>
        <View style={styles.container}>
          <View
            style={{ paddingHorizontal: 12, flex: 1, flexDirection: "column" }}
          >
            {this.state.processing ? (
              <>
                <View style={{ flex: 1, justifyContent: "center" }}>
                  <View style={{ paddingHorizontal: 24, alignItems: "center" }}>
                    <ActivityIndicator size="large" />
                    <Text
                      style={{
                        fontSize: 16,
                        textAlign: "center",
                        marginTop: 12,
                        marginBottom: 8
                      }}
                    >
                      Please wait. We are creating your event...
                    </Text>
                  </View>
                </View>
              </>
            ) : (
              <>
                {this.state.processingErrors.length > 0 ? (
                  <>
                    <View style={{ flex: 1, justifyContent: "center" }}>
                      <View
                        style={{ paddingHorizontal: 24, alignItems: "center" }}
                      >
                        <Text
                          style={{
                            fontSize: 16,
                            textAlign: "center",
                            marginTop: 12,
                            color: "red",
                            marginBottom: 12
                          }}
                        >
                          {this.state.processingErrors[0]}
                        </Text>
                        <Button
                          type="outline"
                          title="Ok"
                          onPress={() => {
                            this.props.navigation.navigate("EventsHome");
                          }}
                        />
                      </View>
                    </View>
                  </>
                ) : (
                  <>
                    <View style={{ flex: 10 }}>
                      <ScrollView
                        style={styles.container}
                        contentContainerStyle={styles.contentContainer}
                      >
                        <View>
                          <TouchableOpacity
                            style={{ width: 44, height: 44, marginTop: -12 }}
                            onPress={this.goBack}
                          >
                            <Icon.Ionicons
                              name={
                                Platform.OS === "ios"
                                  ? "ios-arrow-round-back"
                                  : "md-arrow-back"
                              }
                              size={44}
                            />
                          </TouchableOpacity>
                        </View>
                        {this.state.activeStep === 0 && (
                          <>
                            <View style={{ marginTop: 0 }}>
                              <EventEditInfo
                                {...this.state}
                                onInputChange={this.onInputChange}
                                onLoadModel={model => {
                                  this.setState({ activeStepModel: model });
                                }}
                              />
                            </View>
                          </>
                        )}
                        {this.state.activeStep === 1 && (
                          <>
                            <View style={{ marginTop: -6 }}>
                              <EventEditLocation
                                {...this.state}
                                onInputChange={this.onInputChange}
                                onLoadModel={model => {
                                  this.setState({ activeStepModel: model });
                                }}
                              />
                            </View>
                          </>
                        )}
                        {this.state.activeStep === 2 && (
                          <>
                            <View style={{ marginTop: -6 }}>
                              <EventEditLeadersAndTags
                                {...this.state}
                                onInputChange={this.onInputChange}
                                onLoadModel={model => {
                                  this.setState({ activeStepModel: model });
                                }}
                                onModalOpen={this.onModalOpen}
                                onModalClose={this.onModalClose}
                              />
                            </View>
                          </>
                        )}
                        {this.state.activeStep === 3 && (
                          <>
                            <View style={{ marginTop: -6 }}>
                              <EventEditPrivacyAndSkills
                                {...this.state}
                                onInputChange={this.onInputChange}
                                onLoadModel={model => {
                                  this.setState({ activeStepModel: model });
                                }}
                                onModalOpen={this.onModalOpen}
                                onModalClose={this.onModalClose}
                              />
                            </View>
                          </>
                        )}
                        {this.state.activeStep === 4 && (
                          <>
                            <View style={{ marginTop: -6 }}>
                              <EventEditFinishingTouches
                                {...this.state}
                                onInputChange={this.onInputChange}
                                onLoadModel={model => {
                                  this.setState({ activeStepModel: model });
                                }}
                              />
                            </View>
                          </>
                        )}
                      </ScrollView>
                    </View>
                    {!this.state.modelOpen && (
                      <>
                        <View
                          style={{
                            flex: 1.5,
                            justifyContent: "center",
                            paddingVertical: 8
                          }}
                        >
                          <Button
                            title={
                              this.state.activeStep === this.steps.length - 1
                                ? "Submit"
                                : "Continue"
                            }
                            onPress={this.processStep}
                          />
                        </View>
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </View>
        </View>
      </>
    );
  }
}

export default EventCreateScreen;
