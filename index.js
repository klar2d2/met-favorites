// Require in modules
require('dotenv').config();
const express = require('express');
const flash = require('connect-flash');
const layouts = require('express-ejs-layouts');
const passport = require('./config/passportConfig');
const session = require('express-session');
const moment = require('moment')
const helmet = require('helmet')
const SequelizeStore = require('connect-session-sequelize')(session.Store)
const db = require('./models')
const axios = require('axios')
const methodOverride = require('method-override')
const isLoggedIn = require('./middleware/isLoggedIn')


// Instantiate the express app
const app = express();

// Set up any middleware or settings
app.set('view engine', 'ejs');
app.use(layouts);
app.use(express.static('static'));
app.use(express.urlencoded({ extended: false }));
app.use(helmet())
app.use(methodOverride('_method'))


// Custom middleware: write data to locals for EVERY page
// Make this before the session
const sessionStore = new SequelizeStore({
  db: db.sequelize,
})
// Make the session before flash or passport
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: sessionStore
}))
// Use this lince once to set up thee store table
sessionStore.sync();
// Must come after the session and before passport
app.use(flash()); // After session!

//Passport comes last in the session chain
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.alerts = req.flash();
  res.locals.user = req.user
  next();
});


// Controllers
app.use('/auth', require('./controllers/auth'));
app.use('/profile', isLoggedIn, require('./controllers/profile'))
app.use('/search', require('./controllers/search'))
app.use('/collection', isLoggedIn, require('./controllers/collection'))

// Routes
app.get('/', (req, res) => {
  //To do: get a slideshow of the "isHighlight" images from the met API
    res.render('home');
})

app.get('*', (req, res) => {
    res.render('404');
})

// LISTEN!
app.listen(process.env.PORT || 3000, () => {
    console.log("☕ Server is now running at port", process.env.PORT);
})
