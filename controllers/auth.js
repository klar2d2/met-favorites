const db = require('../models');
const passport = require('../config/passportConfig');
const router = require('express').Router();


router.get('/signup', (req, res) => {
    res.render('auth/signup');
})

router.post('/signup', (req, res, next) => {
  if (req.body.password !== req.body.password_verify) {
    req.flash('error', 'Passwords do not match!');
    console.log('BIRTHDAY', req.body.birthday)
    res.redirect('/auth/signup');
  }
  else {
    // Passwords matched, create user if they don't already exist
    db.user.findOrCreate({
      where: { email: req.body.email },
      defaults: req.body
    })
    .spread((user, wasCreated) => {
      if (wasCreated) {
        // This was legitimately a new user, so they got created
        passport.authenticate('local', {
          successRedirect: '/profile',
          successFlash: 'Successful sign up. Welcome!',
          failureRedirect: '/auth/login',
          failureFlash: 'This should never happen. Contact administrator.'
        })(req, res, next);
      }
      else {
        // The user was found; don't let them create a new account, make them log in
        req.flash('error', 'Account already exists. Please log in!');
        res.redirect('/auth/login');
      }
    })
    .catch(err => {
      // Print ALL the error info to the console
      console.log('Error in POST /auth/signup', err);

      // Generic error for the flash message
      req.flash('error', 'Something went awry! :(');

      // Get validation-speciic errors (okay to show to the user)
      if (err && err.errors) {
        err.errors.forEach(e => {
          if (e.type === 'Validation error') {
            req.flash('error', 'Validation issue - ' + e.message);
          }
        });
      }

      // Redirect user back to the sign up page so they can try again
      res.redirect('/auth/signup');
    })
  }
})

router.get('/login', (req, res) => {
    res.render('auth/login');
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/profile',
  successFlash: 'Log in successful',
  failureRedirect: '/auth/login',
  failureFlash: 'Invalid Credentials'
}));

router.get('/logout', (req, res) => {
    req.logout(); //This deletes the user from req.user
    req.flash('success', 'Successfully logged out.')
    res.redirect('/')
})

module.exports = router;
