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
import TeamEditInfo from "../components/TeamEditInfo";
import TeamEditLeaders from "../components/TeamEditLeaders";
import TeamEditFinishingTouches from "../components/TeamEditFinishingTouches";

class TeamCreateScreen extends React.Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);

    this.fields = [
      "funds_raised",
      "is_registered",
      "t_city",
      "t_desc",
      "t_hours",
      "t_leaders",
      "t_members",
      "t_member_num",
      "t_name",
      "t_organizer",
      "t_orig_name",
      "t_pending_member_num",
      "t_privacy",
      "t_state",
      "t_photo"
    ];

    this.steps = [
      { name: "Info And Location" },
      { name: "Leaders And Privacy" },
      { name: "Finishing Touches" }
    ];

    this.state = {
      procesing: false,
      processingErrors: [],
      activeStep: 0,
      activeStetpModel: null,
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
        this.saveTeamData(sequence.data, errors => {
          if (typeof errors !== "undefined") {
            sequence.errors = errors;
          }
          sequence.next();
        });
      } else {
        sequence.errors = [
          "We could not create your team with the data provided.  Please restart the App and try again."
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

  saveTeamData = async (data, callback) => {
    console.log("in save team")
    console.warn("in save team")
    try {
      let token = await User.firebase.getIdToken();
      if (token) {
        let bodyData = JSON.stringify(data);
        let url =
          "https://connected-dev-214119.appspot.com/_ah/api/connected/v1/teams";
        fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token
          },
          body: bodyData
        })
          .then(response => {
            console.log("Response from save team data", response);
            if (response.ok) {
              try {
                let responseData = JSON.parse(response._bodyText);
                if (responseData) {
                }
                this.props.navigation.navigate("TeamsHome");
              } catch (error) {
                callback([error.message]);
              }
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
      console.log("Team not created")
    } catch (error) {
      callback([error.message]);
    }
  };

  processStep = () => {
    if (this.state.activeStetpModel) {
      let step = this.state.activeStetpModel;
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
      this.props.navigation.navigate("TeamsHome");
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
                      Please wait. We are creating your team...
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
                              <TeamEditInfo
                                {...this.state}
                                onInputChange={this.onInputChange}
                                onLoadModel={model => {
                                  this.setState({ activeStetpModel: model });
                                }}
                              />
                            </View>
                          </>
                        )}
                        {this.state.activeStep === 1 && (
                          <>
                            <View style={{ marginTop: -6 }}>
                              <TeamEditLeaders
                                {...this.state}
                                onInputChange={this.onInputChange}
                                onLoadModel={model => {
                                  this.setState({ activeStetpModel: model });
                                }}
                                onModalOpen={this.onModalOpen}
                                onModalClose={this.onModalClose}
                              />
                            </View>
                          </>
                        )}
                        {this.state.activeStep === 2 && (
                          <>
                            <View style={{ marginTop: -6 }}>
                              <TeamEditFinishingTouches
                                {...this.state}
                                onInputChange={this.onInputChange}
                                onLoadModel={model => {
                                  this.setState({ activeStetpModel: model });
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

export default TeamCreateScreen;
