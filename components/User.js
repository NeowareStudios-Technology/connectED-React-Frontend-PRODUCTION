/**
 * Singleton user object.
 */
const User = {
  apiKey: null,
  displayName: null,
  email: null,
  uid: null,
  isloggedIn: function() {
    return this.uid;
  },
  login: function(user) {
    Object.keys(user).map(key => {
      this[key] = user[key];
    });
    return this.uid;
  }
};

export default User;
