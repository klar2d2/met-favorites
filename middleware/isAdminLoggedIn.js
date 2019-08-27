module.exports = (req, res, next) => {
  // If the user is logged in
  if (req.user && req.user.admin) {
    //cool, this is expected, they are logged in
    next();
  }
  else if (req.user) { //user is logged in but not aan admin 
    req.flash('error', 'You must be logged in as an admin to view this page.')
    res.redirect('/profile');

  }
  else {
  // else
    //Not cool, dont let them in make em log in
  req.flash('error', 'You must be logged in as an admin to view this page.')
  res.redirect('/auth/login')
  }
}
