module.exports = (req, res, next) => {
  // If the user is logged in
  if (req.user) {
    //cool, this is expected, they are logged in
    next();
  }
  else {
  // else
    //Not cool, dont let them in make em log in
  req.flash('error', 'You must be logged in to view this page.')
  res.redirect('/auth/login')
  }
}
