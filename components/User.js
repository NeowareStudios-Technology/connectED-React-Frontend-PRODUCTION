import firebase from "../components/Firebase";

/**
 * Singleton user object.
 */
const User = {
  displayName: null,
  email: null,
  uid: null,
  firebase: null,
  profile: null,
  isLoggedIn: async function() {
    if (firebase.auth().currentUser) {
      this.firebase = firebase.auth().currentUser;
    }

    if (this.firebase) {
      this.displayName = this.firebase.displayName;
      this.email = this.firebase.email;
      this.uid = this.firebase.uid;
      if (!this.profile) {
        let token = await this.firebase.getIdToken();
        if (token) {
          try {
            let url =
              "https://connected-dev-214119.appspot.com/_ah/api/connected/v1/profiles/" +
              this.firebase.email;
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
      /**
       * If we still dont have a profile, let's create an empty one
       * with the default info to prevent "undefined" errors
       */
      if (!this.profile) {
        this.profile = {
          first_name: "",
          last_name: ""
        };
      }
    }

    if (this.uid && this.firebase) {
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
            firebaseUser.email;
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
    this.firebase = null;
    if (typeof callback === "function") {
      callback();
    }
  }
};

export default User;
