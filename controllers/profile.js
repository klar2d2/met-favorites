const isAdminLoggedIn = require('../middleware/isAdminLoggedIn')
const isLoggedIn = require('../middleware/isLoggedIn')
const router = require('express').Router();

// GET /profile
router.get('/', isLoggedIn, (req, res) => {
  res.render('profile/index');
});

// GET /profile/admin
router.get('/admin', isAdminLoggedIn, (req, res) => {
  res.render('profile/admin');
});

module.exports = router;
