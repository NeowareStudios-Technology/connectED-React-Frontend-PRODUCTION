import React from "react";
import {
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { WebBrowser, Icon, ImagePicker, Permissions, FileSystem } from "expo";
import { Input, Card, Button, Avatar } from "react-native-elements";

import Sequencer from "../components/Sequencer";
import firebase from "../components/Firebase";
import User from "../components/User";
import ProfileEditPhoto from "../components/ProfileEditPhoto";
import ProfileEditName from "../components/ProfileEditName";
import Colors from "../constants/Colors";

const validator = require("validator");

export default class SignUpFlowScreen extends React.Component {
  constructor(props) {
    super(props);

    this.steps = [
      {
        fields: ["email"],
        rules: [
          {
            validator: "isEmail",
            fields: ["email"],
            message: "Please enter a valid e-mail."
          }
        ]
      },
      {
        fields: ["password", "password_confirmation"],
        rules: [
          {
            validator: value => {
              return !validator.isEmpty(value);
            },
            fields: ["password"],
            message: "Please enter a password."
          },
          {
            validator: value => {
              return validator.isLength(value, {
                min: 8,
                max: 16
              });
            },
            fields: ["password"],
            message: "Please enter a password between 8 and 16 characters long."
          },
          {
            validator: value => {
              return value === this.state.password;
            },
            fields: ["password_confirmation"],
            message: "Please re-enter your password to confirm."
          }
        ]
      },
      {
        fields: ["first_name", "last_name"],
        rules: [
          {
            validator: value => {
              return !validator.isEmpty(value);
            },
            fields: ["first_name"],
            message: "Please enter your first name."
          },
          {
            validator: value => {
              return !validator.isEmpty(value);
            },
            fields: ["last_name"],
            message: "Please enter your last name."
          }
        ]
      },
      {
        fields: ["photo"],
        rules: [
          {
            validator: value => {
              return !validator.isEmpty(value);
            },
            fields: ["photo"],
            message: "Please upload a photo."
          }
        ]
      },
      {
        fields: ["mon", "tue", "wed", "thu", "fri", "sat", "sun", "time_day"],
        rules: []
      },
      {
        fields: ["interests"],
        rules: []
      },
      {
        fields: ["skills"],
        rules: []
      },
      {
        fields: ["education"],
        rules: []
      }
    ];

    this.availableInterests = [
      "Advocacy and Human Rights",
      "Animals",
      "Arts & Culture",
      "Children & Youth",
      "Community",
      "Counseling",
      "Crisis Support",
      "Disaster Relief",
      "Education & Literacy",
      "Emergency & Safety",
      "Employment",
      "Environment",
      "Faith-based",
      "Health & Medicine",
      "Homeless & Housing",
      "Human Services",
      "Hunger",
      "Immigrants & Refugees",
      "International",
      "Justice & Legal",
      "LGBTQ",
      "Media",
      "Mentoring",
      "People with Disabilities",
      "Politics",
      "Seniors",
      "Sports & Recreation",
      "Technology",
      "Veteran Support",
      "Women"
    ];

    this.availableSkills = [
      "Clerical",
      "Coaching",
      "Communications",
      "Computers",
      "Design & Graphical Arts",
      "Electrical",
      "Engineering",
      "Event Management",
      "Finance",
      "Fund Raising",
      "Food Services",
      "Health Care",
      "Hobbies & Crafts",
      "Human Resources",
      "IT Infrastructure",
      "Landscaping",
      "Legal",
      "Logistics",
      "Marketing",
      "Music",
      "Non-Profit Development",
      "Performing Arts",
      "Plumbing",
      "Strategic Planning",
      "Software Development",
      "Trades",
      "Tutor",
      "Web Development"
    ];

    this.availableEducation = [
      "Completed 8th Grade",
      "Some High School",
      "High School Diploma",
      "Some College",
      "Associate's Degree",
      "Bachelor's Degree",
      "Master's Degree",
      "Doctoral Degree"
    ];

    this.state = {
      user: null,
      currentStepIndex: 0,
      profileData: null,
      profileStatus: "creating",
      processingErrors: null
    };

    this.fields = {
      email: "",
      password: "",
      password_confirmation: "",
      education: "",
      first_name: "",
      last_name: "",
      photo: "",
      interests: [],
      skills: [],
      lat: 10,
      lon: 10,
      mon: false,
      tue: false,
      wed: false,
      thu: false,
      fri: false,
      sat: false,
      sun: false,
      time_day: "morning"
    };
    let errors = {};
    Object.keys(this.fields).map(key => {
      this.state[key] = this.fields[key];
      errors[key] = [];
    });
    this.state.errors = errors;
  }

  onInputChange = value => {
    let attribute = e.target.name;
    this.setState({
      [attribute]: value
    });
  };

  goBack = () => {
    if (this.state.currentStepIndex === 0) {
      this.props.navigation.navigate("ProfileHome");
    } else {
      let newStep = this.state.currentStepIndex - 1;
      this.setState({ currentStepIndex: newStep, processingErrors: false });
    }
  };

  goForward = () => {
    if (typeof this.steps[this.state.currentStepIndex] !== "undefined") {
      let step = this.steps[this.state.currentStepIndex];
      this.processStep(step, stepValid => {
        if (stepValid) {
          let nextStep = this.state.currentStepIndex + 1;
          if (nextStep >= this.steps.length) {
            this.processProfile();
          } else {
            this.setState({ currentStepIndex: nextStep });
          }
        }
      });
    }
  };

  saveUserProfile = (firebaseUser, token) => {
    if (this.state.profileData) {
      try {
        let bodyData = JSON.stringify(this.state.profileData);
        let url =
          "https://connected-dev-214119.appspot.com/_ah/api/connected/v1/profiles";
        fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token
          },
          body: bodyData
        })
          .then(response => {
            console.log("Response from save profile", response);
            if (response.ok) {
              /**
               * Profile created but the response doesnt have the profile
               * Use the firebaseUser plus the state.profileData to login with User
               *  */
              this.setState({ profileStatus: "created" }, () => {
                User.login(firebaseUser, this.state.profileData).then(login => {
                  if (login) {
                    this.props.navigation.navigate("ProfileHome");
                  }
                });
              });
            }
          })
          .catch(error => {
            console.error("Error posting to Endpoint", error);
          });
      } catch (error) {
        console.log("error parsing profile data", error.message);
      }
    }
  };

  processProfile = () => {
    let sequence = new Sequencer();
    sequence.data = null;
    sequence.errors = [];
    sequence.promise(() => {
      this.setState(
        {
          profileStatus: "processing"
        },
        () => {
          sequence.next();
        }
      );
    });

    sequence.promise(() => {
      var profileData = {};
      Object.keys(this.fields).map(field => {
        profileData[field] = this.state[field];
      });
      sequence.data = profileData;
      sequence.next();
    });

    sequence.promise(() => {
      if (sequence.data) {
        this.setState({ profileData: sequence.data }, () => {
          firebase
            .auth()
            .createUserWithEmailAndPassword(
              sequence.data.email,
              sequence.data.password
            )
            .catch(function(error) {
              sequence.errors = [error.message];
              sequence.next();
            });
        });
      } else {
        sequence.errors = [
          "We could not create a user account with the data provided.  Please restart the App and try again."
        ];
        sequence.next();
      }
    });

    sequence.onStop = () => {
      if (sequence.errors.length > 0) {
        this.setState({
          profileStatus: "creatings",
          processingErrors: sequence.errors
        });
      }
    };

    sequence.next();
  };

  processStep = (step, callback) => {
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
        if (typeof callback === "function") {
          callback(stepValid);
        }
      });
    };
    sequence.next();
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
      typeof this.state[field] !== "undefined" ? this.state[field] : null;
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

  toggleValue = attribute => {
    let newValue = this.state[attribute] ? false : true;
    this.setState({ [attribute]: newValue });
  };

  toggleInterest = interest => {
    let currentInterests = this.state.interests;
    let interestIndex = currentInterests.indexOf(interest);
    if (interestIndex === -1) {
      currentInterests.push(interest);
    } else {
      currentInterests.splice(interestIndex, 1);
    }
    this.setState({ interests: currentInterests });
  };

  toggleSkill = skill => {
    let currentSkills = this.state.skills;
    let skillIndex = currentSkills.indexOf(skill);
    if (skillIndex === -1) {
      currentSkills.push(skill);
    } else {
      currentSkills.splice(skillIndex, 1);
    }
    this.setState({ skills: currentSkills });
  };

  static navigationOptions = {
    header: null
  };

  async componentDidMount() {
    let user = await User.isLoggedIn();
    if (user) {
      this.setState({
        user: user
      });
    }
    return true;
  }

  render() {
    return (
      <View style={{ width: "100%", height: "100%" }}>
        {this.state.user ? (
          <>
            <View style={styles.container}>
              <View
                style={{
                  flex: 1,
                  flexDirection: "column",
                  justifyContent: "flex-end"
                }}
              >
                <View style={{ flex: 9 }}>
                  <ScrollView
                    style={styles.container}
                    contentContainerStyle={styles.contentContainer}
                  >
                    {this.state.profileStatus === "processing" && (
                      <>
                        <View style={{ paddingHorizontal: 10, paddingTop: 24 }}>
                          <Text
                            style={{
                              fontSize: 18,
                              textAlign: "center",
                              marginBottom: 8
                            }}
                          >
                            We are creating your use account...
                          </Text>
                        </View>
                      </>
                    )}
                    {this.state.profileStatus === "creating" && (
                      <>
                        <View
                          style={{
                            paddingHorizontal: 12
                          }}
                        >
                          <TouchableOpacity
                            style={{ height: 40, width: 40 }}
                            onPress={this.goBack}
                          >
                            <Icon.Ionicons
                              style={{ padding: 0, margin: 0 }}
                              name={
                                Platform.OS === "ios"
                                  ? "ios-arrow-round-back"
                                  : "md-arrow-back"
                              }
                              size={44}
                              color="#195074"
                            />
                          </TouchableOpacity>
                        </View>
                        {this.state.processingErrors ? (
                          <>
                            <View
                              style={{ paddingHorizontal: 10, paddingTop: 24 }}
                            >
                              <Text
                                style={{
                                  fontSize: 18,
                                  textAlign: "center",
                                  color: "red",
                                  marginBottom: 8
                                }}
                              >
                                We could not create your user account due to the
                                following error(s):
                              </Text>

                              {this.state.processingErrors.map(
                                (error, index) => {
                                  return (
                                    <Text
                                      key={"processing-error-" + index}
                                      style={{
                                        fontSize: 14,
                                        textAlign: "center",
                                        color: "red"
                                      }}
                                    >
                                      {error}
                                    </Text>
                                  );
                                }
                              )}
                            </View>
                          </>
                        ) : (
                          <>
                            <View
                              style={{
                                backgroundColor: "transparent",
                                marginTop:-100,
                                paddingTop: 12
                              }}
                            >
                              <View style={{ marginBottom: 6 }}>
                                <ProfileEditPhoto
                                  user={this.state.user}
                                  onPhotoSelected={photo => {
                                    this.setState({ photo: photo });
                                  }}
                                />
                              </View>
                              <View>
                                <ProfileEditName
                                  user={this.state.user}
                                  errors={this.state.errors}
                                  onChange={(attribute, value) => {
                                    this.setState({ [attribute]: value });
                                  }}
                                />
                              </View>
                              <View style={{ paddingHorizontal: 20 }}>
                                <Text
                                  style={{
                                    color: "#bababa",
                                    fontSize: 16,
                                    marginBottom: 12
                                  }}
                                >
                                  Change
                                </Text>
                                <View>
                                  <View style={styles.menuItemWrapper}>
                                    <TouchableOpacity
                                      style={styles.menuItemTouchable}
                                      onPress={() => {
                                        alert("Open the Schedule");
                                      }}
                                    >
                                      <View style={styles.menuItemContainer}>
                                        <Text style={styles.menuItemLabel}>
                                          Schedule
                                        </Text>
                                        <Text
                                          style={styles.menuItemIconContainer}
                                        >
                                          <Icon.Ionicons
                                            name={
                                              Platform.OS === "ios"
                                                ? "ios-arrow-forward"
                                                : "md-arrow-forward"
                                            }
                                            size={20}
                                            color={Colors.tabIconDefault}
                                          />
                                        </Text>
                                      </View>
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.menuItemWrapper}>
                                    <TouchableOpacity
                                      style={styles.menuItemTouchable}
                                      onPress={() => {
                                        alert("Open the Schedule");
                                      }}
                                    >
                                      <View style={styles.menuItemContainer}>
                                        <Text style={styles.menuItemLabel}>
                                          Interests
                                        </Text>
                                        <Text
                                          style={styles.menuItemIconContainer}
                                        >
                                          <Icon.Ionicons
                                            name={
                                              Platform.OS === "ios"
                                                ? "ios-arrow-forward"
                                                : "md-arrow-forward"
                                            }
                                            size={20}
                                            color={Colors.tabIconDefault}
                                          />
                                        </Text>
                                      </View>
                                    </TouchableOpacity>
                                  </View>
                                  <View style={styles.menuItemWrapper}>
                                    <TouchableOpacity
                                      style={styles.menuItemTouchable}
                                      onPress={() => {
                                        alert("Open the Schedule");
                                      }}
                                    >
                                      <View style={styles.menuItemContainer}>
                                        <Text style={styles.menuItemLabel}>
                                          Skills
                                        </Text>
                                        <Text
                                          style={styles.menuItemIconContainer}
                                        >
                                          <Icon.Ionicons
                                            name={
                                              Platform.OS === "ios"
                                                ? "ios-arrow-forward"
                                                : "md-arrow-forward"
                                            }
                                            size={20}
                                            color={Colors.tabIconDefault}
                                          />
                                        </Text>
                                      </View>
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              </View>
                            </View>

                            {this.state.currentStepIndex === 1 && (
                              <>
                                <Card
                                  containerStyle={styles.cardContainerStyle}
                                  wrapperStyle={styles.cardWrapperStyle}
                                >
                                  <Input
                                    name="password"
                                    label="Password"
                                    value={this.state.password}
                                    onChangeText={value => {
                                      this.setState({ password: value });
                                    }}
                                    secureTextEntry={true}
                                    containerStyle={{ marginBottom: 12 }}
                                    placeholder="Password"
                                    errorMessage={
                                      this.state.errors.password.length > 0
                                        ? this.state.errors.password[0]
                                        : ""
                                    }
                                  />
                                  <Input
                                    name="password_confirmation"
                                    label="Password Confirmation"
                                    value={this.state.password_confirmation}
                                    onChangeText={value => {
                                      this.setState({
                                        password_confirmation: value
                                      });
                                    }}
                                    secureTextEntry={true}
                                    containerStyle={{ marginBottom: 12 }}
                                    placeholder="Confirm Password"
                                    errorMessage={
                                      this.state.errors.password_confirmation
                                        .length > 0
                                        ? this.state.errors
                                            .password_confirmation[0]
                                        : ""
                                    }
                                  />
                                </Card>
                              </>
                            )}
                            {this.state.currentStepIndex === 4 && (
                              <>
                                <View
                                  style={{
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flex: 1
                                  }}
                                >
                                  <View
                                    style={{
                                      paddingHorizontal: 8,
                                      marginBottom: 24
                                    }}
                                  >
                                    <Text style={styles.stepHeader}>
                                      What's your availability?
                                    </Text>
                                    <Text style={styles.stepDescription}>
                                      We will try to match your with
                                      opportunities that fit your lifestyle.
                                    </Text>
                                    <View
                                      style={{
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexWrap: "wrap",
                                        // justifyContent: "flex-start",
                                        flexDirection: "row"
                                      }}
                                    >
                                      <Button
                                        title="Mon"
                                        type={
                                          this.state.mon ? "solid" : "outline"
                                        }
                                        buttonStyle={styles.dayButton}
                                        onPress={() => {
                                          this.toggleValue("mon");
                                        }}
                                      />
                                      <Button
                                        title="Tue"
                                        type={
                                          this.state.tue ? "solid" : "outline"
                                        }
                                        buttonStyle={styles.dayButton}
                                        onPress={() => {
                                          this.toggleValue("tue");
                                        }}
                                      />
                                      <Button
                                        title="Wed"
                                        type={
                                          this.state.wed ? "solid" : "outline"
                                        }
                                        buttonStyle={styles.dayButton}
                                        onPress={() => {
                                          this.toggleValue("wed");
                                        }}
                                      />
                                      <Button
                                        title="Thu"
                                        type={
                                          this.state.thu ? "solid" : "outline"
                                        }
                                        buttonStyle={styles.dayButton}
                                        onPress={() => {
                                          this.toggleValue("thu");
                                        }}
                                      />
                                      <Button
                                        title="Fri"
                                        type={
                                          this.state.fri ? "solid" : "outline"
                                        }
                                        buttonStyle={styles.dayButton}
                                        onPress={() => {
                                          this.toggleValue("fri");
                                        }}
                                      />
                                      <Button
                                        title="Sat"
                                        type={
                                          this.state.sat ? "solid" : "outline"
                                        }
                                        buttonStyle={styles.dayButton}
                                        onPress={() => {
                                          this.toggleValue("sat");
                                        }}
                                      />
                                      <Button
                                        title="Sun"
                                        type={
                                          this.state.sun ? "solid" : "outline"
                                        }
                                        buttonStyle={styles.dayButton}
                                        onPress={() => {
                                          this.toggleValue("sun");
                                        }}
                                      />
                                    </View>
                                  </View>
                                  <View>
                                    <Text style={styles.stepHeader}>
                                      Time of day preferences?
                                    </Text>
                                    <View
                                      style={{
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexWrap: "wrap",
                                        // justifyContent: "flex-start",
                                        flexDirection: "row"
                                      }}
                                    >
                                      <Button
                                        title="Morning"
                                        type={
                                          this.state.time_day === "morning"
                                            ? "solid"
                                            : "outline"
                                        }
                                        style={styles.timeOfDay}
                                        onPress={() => {
                                          this.setState({
                                            time_day: "morning"
                                          });
                                        }}
                                      />
                                      <Button
                                        title="Afternoon"
                                        type={
                                          this.state.time_day === "afternoon"
                                            ? "solid"
                                            : "outline"
                                        }
                                        style={styles.timeOfDay}
                                        onPress={() => {
                                          this.setState({
                                            time_day: "afternoon"
                                          });
                                        }}
                                      />
                                      <Button
                                        title="Evening"
                                        type={
                                          this.state.time_day === "evening"
                                            ? "solid"
                                            : "outline"
                                        }
                                        style={styles.timeOfDay}
                                        onPress={() => {
                                          this.setState({
                                            time_day: "evening"
                                          });
                                        }}
                                      />
                                    </View>
                                  </View>
                                </View>
                              </>
                            )}
                            {this.state.currentStepIndex === 5 && (
                              <>
                                <View>
                                  <View
                                    style={{
                                      alignItems: "center",
                                      justifyContent: "center",
                                      flex: 1
                                    }}
                                  >
                                    <View
                                      style={{
                                        paddingHorizontal: 12,
                                        marginBottom: 24
                                      }}
                                    >
                                      <Text style={styles.stepHeader}>
                                        What field would you be interested in
                                        volunteering?
                                      </Text>
                                      <Text style={styles.stepDescription}>
                                        We will try to match your with
                                        opportunities you want to help.
                                      </Text>
                                      <View style={{ paddingHorizontal: 6 }}>
                                        {this.availableInterests.map(
                                          (interest, index) => {
                                            return (
                                              <Button
                                                key={"interest-" + index}
                                                style={{
                                                  marginBottom: 12,
                                                  backgroundColor: "#ffffff"
                                                }}
                                                title={interest}
                                                type={
                                                  this.state.interests.indexOf(
                                                    interest
                                                  ) > -1
                                                    ? "solid"
                                                    : "outline"
                                                }
                                                onPress={() => {
                                                  this.toggleInterest(interest);
                                                }}
                                              />
                                            );
                                          }
                                        )}
                                      </View>
                                    </View>
                                  </View>
                                </View>
                              </>
                            )}
                            {this.state.currentStepIndex === 6 && (
                              <>
                                <View>
                                  <View
                                    style={{
                                      alignItems: "center",
                                      justifyContent: "center",
                                      flex: 1
                                    }}
                                  >
                                    <View
                                      style={{
                                        paddingHorizontal: 12,
                                        marginBottom: 24
                                      }}
                                    >
                                      <Text style={styles.stepHeader}>
                                        What skills do you have?
                                      </Text>
                                      <Text style={styles.stepDescription}>
                                        This will make sure that you are matched
                                        up with events that you know how to do.
                                      </Text>
                                      <View style={{ paddingHorizontal: 6 }}>
                                        {this.availableSkills.map(
                                          (skill, index) => {
                                            return (
                                              <Button
                                                key={"skill-" + index}
                                                style={{
                                                  marginBottom: 12,
                                                  backgroundColor: "#ffffff"
                                                }}
                                                title={skill}
                                                type={
                                                  this.state.skills.indexOf(
                                                    skill
                                                  ) > -1
                                                    ? "solid"
                                                    : "outline"
                                                }
                                                onPress={() => {
                                                  this.toggleSkill(skill);
                                                }}
                                              />
                                            );
                                          }
                                        )}
                                      </View>
                                    </View>
                                  </View>
                                </View>
                              </>
                            )}
                            {this.state.currentStepIndex === 7 && (
                              <>
                                <View>
                                  <View
                                    style={{
                                      alignItems: "center",
                                      justifyContent: "center",
                                      flex: 1
                                    }}
                                  >
                                    <View
                                      style={{
                                        paddingHorizontal: 12,
                                        marginBottom: 24
                                      }}
                                    >
                                      <Text style={styles.stepHeader}>
                                        What is your current education level?
                                      </Text>
                                      <Text style={styles.stepDescription}>
                                        We will try to match you with
                                        opportunities you want to help.
                                      </Text>
                                      <View style={{ paddingHorizontal: 6 }}>
                                        {this.availableEducation.map(
                                          (education, index) => {
                                            return (
                                              <Button
                                                key={"education-" + index}
                                                style={{
                                                  marginBottom: 12,
                                                  backgroundColor: "#ffffff"
                                                }}
                                                title={education}
                                                type={
                                                  this.state.education ===
                                                  education
                                                    ? "solid"
                                                    : "outline"
                                                }
                                                onPress={() => {
                                                  this.setState({
                                                    education: education
                                                  });
                                                }}
                                              />
                                            );
                                          }
                                        )}
                                      </View>
                                    </View>
                                  </View>
                                </View>
                              </>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </ScrollView>
                </View>
                <View
                  style={{
                    flex: 1,
                    paddingHorizontal: 24,
                    flexDirection: "column"
                  }}
                >
                  <Button title="Save" />
                </View>
              </View>
            </View>
          </>
        ) : (
          <></>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent"
  },
  contentContainer: {
    paddingTop: 30
  },
  cardWrapperStyle: {
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 10
  },
  cardContainerStyle: {
    borderRadius: 12
  },
  dayButton: {
    marginHorizontal: 4,
    marginVertical: 6,
    height: 55,
    width: 55
  },
  timeOfDay: { marginHorizontal: 4, marginVertical: 6 },
  stepHeader: {
    textAlign: "center",
    fontSize: 18,
    marginBottom: 12
  },
  stepDescription: {
    textAlign: "center",
    fontSize: 14,
    marginBottom: 18
  },
  menuItemTouchable: {
    paddingVertical: 6
  },
  menuItemContainer: { flexDirection: "row" },
  menuItemLabel: { flex: 3, fontSize: 16 },
  menuItemIconContainer: { flex: 1 }
});
