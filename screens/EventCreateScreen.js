import React from "react";
import {
  Text,
  StyleSheet,
  ScrollView,
  View,
  TextInput,
  TouchableOpacity,
  Platform
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

class EventCreateScreen extends React.Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);

    this.steps = [
      { name: "Info" },
      { name: "Location" },
      { name: "Leaders And Tags" },
      { name: "Privacy And Skills" },
      { name: "Finishing Touches" }
    ];

    this.state = {
      activeStep: 0,
      activeStetpModel: null,
      errors: {
        e_title: [],
        e_desc: [],
        date: [],
        street: [],
        city: [],
        state: [],
        zip_code: [],
        leader_1: [],
        leader_2: [],
        leader_3: [],
        tag_1: [],
        tag_2: [],
        tag_3: []
      }
    };
  }

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
    this.setState({ activeStep: nextStep }, () => {
      console.log("Active Step Component:", this.activeStepComponent);
    });
  };

  goBack = () => {
    if (this.state.activeStep === 0) {
      this.props.navigation.navigate("EventsHome");
    } else {
      let newStep = this.state.activeStep - 1;
      this.setState({ activeStep: newStep });
    }
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
                          this.setState({ activeStetpModel: model });
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
                        process={this.state.process}
                        onProcess={this.nextStep}
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
                        process={this.state.process}
                        onProcess={this.nextStep}
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
                        process={this.state.process}
                        onProcess={this.nextStep}
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
                        process={this.state.process}
                        onProcess={this.nextStep}
                      />
                    </View>
                  </>
                )}
              </ScrollView>
            </View>
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
          </View>
        </View>
      </>
    );
  }
}

export default EventCreateScreen;
