// Require passport and any passport strategies we want to use
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// We will need access to the database
const db = require('../models');

// Provide serialization/deserialization functions for passport to use.
// This allows passport to store user by the id alone (serialize) and look
// up a user's full information from the id (deserialize function)
passport.serializeUser((user, cb) => {
  // callcback: first arg is an error, second arg is the data that is passes on
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  db.user.findByPk(id)
  .then(user => {
    cb(null, user);
  })
  .catch(cb)
});

// Implement strategies
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, (typedInEmail, typedInPassword, cb) => {
  // Try looking up our user by the email
  db.user.findOne({
    where: { email: typedInEmail }
  })
  .then(foundUser => {
    // If I did not find a user with that email -OR-
    // If I did find the user, but they have the wrong password
    if (!foundUser || !foundUser.validPassword(typedInPassword)) {
      // BAD USER: Return null
      cb(null, null);
    }
    else {
      // GOOD USER: Return the user's data
      cb(null, foundUser);
    }
  })
  .catch(cb); // End of user findOne call
}));

// Make sure we can export the file to be imported on another page
module.exports = passport;
