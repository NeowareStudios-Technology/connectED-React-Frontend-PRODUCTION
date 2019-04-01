/**
 * Singleton user object.
 */
const User = {
  apiKey: null,
  displayName: null,
  email: null,
  uid: null,
  data: [],
  firebase: null,
  isloggedIn: function() {
    return this.uid;
  },
  login: function(firebaseUser, data) {
    this.displayName = firebaseUser.displayName;
    this.email = firebaseUser.email;
    this.uid = firebaseUser.uid;
    this.data = data;
    this.firebase = firebaseUser;
    return this;
  }
};

export default User;
