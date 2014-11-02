var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');

var passport = require('passport');

var app = express();

mongoose.connect(process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost:27017/yhug');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//set up passport
require('./auth/passport-facebook')(passport);
app.use(session({ secret: 'yhug-at-yhack?', resave: true, saveUninitialized: true })); // session secret
app.use(passport.initialize());
app.use(passport.session());

app.use('/', require('./routes/index'));
app.use('/hug', require('./routes/hug'));
app.use('/auth', require('./routes/auth'));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

app.env = app.get('env');

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var debug = require('debug')('yhug');

app.set('port', process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 8080);
app.set('ipaddress', process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1');

var server = app.listen(app.get('port'), app.get('ipaddress'), function() {
  debug('Express server listening on port ' + server.address().port);
});


module.exports = app;
