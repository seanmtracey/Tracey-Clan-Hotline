const debug = require('debug')('app');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cookieSession = require('cookie-session');

const app = express();

const admin_auth = require(`${__dirname}/bin/lib/admin_auth`);
const checkSession = require(`${__dirname}/bin/lib/check-session`);

app.enable('trust proxy');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieSession({
	name: 'phone-home',
	secret : process.env.SESSION_SECRET,
	maxAge: (24 * 60 * 60 * 1000) * 90, // 90 Days
	secure : process.env.NODE_ENV === "production"
}));

app.use('/', require('./routes/index'));
app.use('/call', [checkSession], require('./routes/call'));
app.use('/user', require('./routes/user'));
app.use('/account', require('./routes/account'));
app.use('/admin', [admin_auth], require('./routes/admin'));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
