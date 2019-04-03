import firebase from "../components/Firebase";

/**
 * Singleton user object.
 */
const User = {
  displayName: null,
  email: null,
  uid: null,
  firebaseUser: null,
  profile: null,
  isLoggedIn: async function() {
    if (firebase.auth().currentUser) {
      this.firebaseUser = firebase.auth().currentUser;
    }

    if (this.firebaseUser) {
      this.displayName = this.firebaseUser.displayName;
      this.email = this.firebaseUser.email;
      this.uid = this.firebaseUser.uid;
      let token = await this.firebaseUser.getIdToken();
      if (token) {
        try {
          let url =
            "https://connected-dev-214119.appspot.com/_ah/api/connected/v1/profiles/" +
            this.firebaseUser.email;
          let profileResponse = await fetch(url, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token
            }
          });

          if (profileResponse.ok) {
            try {
              let profile = JSON.parse(profileResponse._bodyText);
              if (profile) {
                this.profile = profile;
              }
            } catch (error) {}
          }
        } catch (error) {}
      }
    }

    if (this.uid && this.firebaseUser) {
      return this;
    } else {
      return false;
    }
  },
  login: async function(firebaseUser, profile) {
    if (typeof profile === "undefined") {
      let token = await firebaseUser.getIdToken();
      if (token) {
        try {
          let url =
            "https://connected-dev-214119.appspot.com/_ah/api/connected/v1/profiles/" +
            this.firebaseUser.email;
          let profileResponse = await fetch(url, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token
            }
          });

          if (profileResponse.ok) {
            try {
              let userProfile = JSON.parse(profileResponse._bodyText);
              if (userProfile) {
                profile = userProfile;
              }
            } catch (error) {}
          }
        } catch (error) {}
      }
    }
    this.displayName = firebaseUser.displayName;
    this.email = firebaseUser.email;
    this.uid = firebaseUser.uid;
    this.profile = profile;
    this.firebase = firebaseUser;
    return this;
  },
  logout: async function(callback) {
    await firebase.auth().signOut();
    this.displayName = null;
    this.email = null;
    this.uid = null;
    this.profile = null;
    this.firebaseUser = null;
    if (typeof callback === "function") {
      callback();
    }
  }
};

export default User;
