var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('express-handlebars');
//after npm installing:
var expressValidator = require('express-validator');
var expressSession = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const ganache = require("ganache-cli");
const Web3 = require("web3");
//var web3 = new Web3(ganache.provider());
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
var tools = require("./routes/fs-tools.js");


//web3.eth.getAccounts().then(e => console.log(e));
var accs = [];
web3.eth.getAccounts(function(err, accountList) {
        if(!err){
          for(var i = 0; i < accountList.length; i++){
            console.log(accountList[i]);
            tools.register({ file: "ganache-accounts.txt", data: accountList[i] });
          }
        }
});



var app = express();

// view engine setup
// defaultLayout: layout means every html extends layout, so no need to put it back on each html file
app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts/'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// after body parsing:
app.use(expressValidator()); // sets it to work
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession({secret: 'max', saveUninitialized: false, resave: false}));

// all routing starting with / goes to index
app.use('/', indexRouter);

// all routing starting with /users goes to users
//app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
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
