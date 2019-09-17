var express = require('express');
var router = express.Router();


var tools = require("./fs-tools.js");

/* 1. GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Blockchain Login', success: req.session.success, errors: req.session.errors });
  req.session.errors = null;
});

router.get('/users', function(req, res, next) {
  res.send('respond with a resource');
});

// goes here if we type localhost:8000/users/detail
router.get('/users/detail', function(req, res, next) {
  res.send('detail');
});

router.post('/login', function(req, res, next){

  //check validity with validator pckg function
  //req.check('address', 'invalid email address').isEmail(); // email has to match name
  //var valid = tools.check({ file: "accounts.txt", account: req.body.address });

  // here is to check whether the input account is valid or not
  var valid = tools.check({ file: "ganache-accounts.txt", account: req.body.address });
  req.check('password', 'Password is invalid').isLength({min: 4}).equals(req.body.confirmPassword);

  var errors = req.validationErrors();
  if(errors){
    req.session.errors = errors;
    req.session.success = false;
  }else{
    if(valid == true){
      req.session.success = true;
    }
    console.log("input account is: " + req.body.address);
  }
  // following action: this will call 1.
  res.redirect('/');

});

router.post('/register', function(req, res, next){
  res.render('register', { title: 'Register Account', errors: req.session.errors });
  req.session.errors = null;
});

router.post('/market', function(req, res, next){
  res.render('blockchain-market', { title: 'Market', errors: req.session.errors });
  req.session.errors = null;
});

// if user wants to reload page:
router.get('/market', function(req, res, next){
  res.render('blockchain-market', { title: 'Market', errors: req.session.errors });
  req.session.errors = null;
});

router.post('/register/submit-account', function(req, res, next){
  var inputAddress = req.body.newAddress;
  var accounts = "";

  if (inputAddress != ""){
    tools.register({ file: "accounts.txt", data: inputAddress });
    res.redirect('/');
  }else{
    res.redirect("/register");
  }

});

module.exports = router;
