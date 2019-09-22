var express = require('express');
var router = express.Router();

var getJSON = require('get-json');
var json = require("../build/contracts/Auth.json");
var contract = require("truffle-contract");
const fetch = require("node-fetch");
const ganache = require("ganache-cli");
const Web3 = require("web3");
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
var tools = require("./fs-tools.js");
var contractAuth;

App = {
  web3Provider: null,
  contracts: {},
  account: 0x0
};

App.contracts.Auth = contract(json);
App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
App.contracts.Auth.setProvider(App.web3Provider);

/* 1. GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Blockchain Login', success: req.session.success, errors: req.session.errors });
  req.session.errors = null;

// get number of users from contract
  App.contracts.Auth.deployed().then(function(instance){
    return instance.getNumberOfUsers();
  }).then(function(users){
    console.log("users: ");
    console.log(users);
  }).catch(function(err){
    console.log("failed contract call");
    console.log(err);
  });

});

router.get('/users', function(req, res, next) {
  res.send('respond with a resource');
});

// goes here if we type localhost:8000/users/detail
router.get('/users/detail', function(req, res, next) {
  res.send('detail');
});

router.post('/login', function(req, res, next){

  var loginusername = req.body.loginusername;
  var loginpassword = req.body.loginpassword;

  App.contracts.Auth.deployed().then(function(instance){
    return instance.existsUser(loginusername, loginpassword);
  }).then(function(exists){
    console.log(exists);
    if(exists == true){
      req.session.success = true;
      console.log("successfull validation");
      res.redirect('/');
    }else{
      req.session.success = false;
      res.redirect('/');
      console.log("unsuccessfull validation");
    }
  }).catch(function(err){
    console.log("failed to deploy");
    console.log(err);
    res.redirect('/');
  });


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
  var inputUsername = req.body.username;
  var inputPassword = req.body.password;
  var coinbase;

  web3.eth.getCoinbase(function(err, account){
    if (err != null){
      console.log(err);
    }
  }).then(function(account){
    coinbase = account;

    console.log(json);

    App.contracts.Auth.deployed().then(function(instance) {
      return instance.createUser(inputUsername, inputPassword, {from: coinbase});
    }).then(function(user){

      // the user info returned from the contract function call
      console.log("user: ");
      console.log(user);

      res.redirect("/");
    }).catch(function(err) {
      console.error(err.message);
    });

  });

});

module.exports = router;
