/*
 * Fabric Client Sample Application
 */

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const http = require('http');
const config = require('config');
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const session = require('express-session');
const flash = require('connect-flash');

// if run local PC, set true
const ISLOCAL = false;

let app = express();
let server = http.createServer(app);
let routes = require('./server/routes');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'src/assets', 'logo.png')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({resave: 'true', saveUninitialized: 'true',
  secret: 'keyboard cat', cookie: { expire: 0}}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// path is protected by basic authentication
passport.use(new BasicStrategy(
  function(user, password, done) {
    if (user && password && config.get('users').hasOwnProperty(user) && config.get('password') == password) {
      return done(null, {
        'id':user,
        'enrollId':config.get('users')[user].enrollId,
        'name':config.get('users')[user].name
      });
    } else {
      return done(null, false);
    }
  }
));
app.use(passport.authenticate('basic', { session: true }));

function ensureAuthenticated(req, res, next) {
  return next();
}

app.use(ensureAuthenticated);
app.use(express.static(__dirname + '/public'));
app.use('/', routes);

let port = process.env.PORT || 3000;
let host = ISLOCAL ? 'localhost' : '0.0.0.0';

server.listen(port, host, ()=>{
  let addr = server.address();
  let bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'http://' + addr.address + ':' + addr.port;
  //eslint-disable-next-line no-console
  console.log('Server starting on ' + bind);
});
