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
var settingup = false;

App = {
  web3Provider: null,
  contracts: {},
  account: 0x0,
  userslist: []
};

App.contracts.Auth = contract(json);
App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
App.contracts.Auth.setProvider(App.web3Provider);

/* 1. GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Blockchain Login', success: req.session.success, errors: req.session.errors, user: req.session.user });
  req.session.errors = null;

  var authInstance;
// get users from contract
  App.contracts.Auth.deployed().then(function(instance){
    //return instance.getNumberOfUsers();
    authInstance = instance;
    return instance.getAllUsers();
  }).then(function(userIds){
    console.log("users: ");
    console.log(userIds);

    //$('#usersRow').empty();

    for(var i = 0; i < userIds.length; i++){
      var userId = userIds[i];
      console.log(userId);
      authInstance.getuser(userId.toNumber()).then(function(user){
        //console.log(user);
        console.log("User " + user[0] + " password: " + user[1]);
        /*
        var usersRow = $('#usersRow');
        var articleTemplate = $('$userTemplate');
        articleTemplate.find('.panel-title').text("User " + user[0]);
        articleTemplate.find('.user-name').text(user[2]);
        articleTemplate.find('.user-password').text(user[3]);

        usersRow.append(userTemplate.html());*/
      }).catch(function(err){
        console.log("failed user mapping");
      });
    }
  }).catch(function(err){
    console.log("failed contract call");
    console.log(err);
  });

});


// for AJAX resource
router.get('/users', function(req, res, next) {
  //var data = "lorem ipsum dolor";
  //res.send(data);
  var authInstance;
  App.contracts.Auth.deployed().then(function(instance){
    authInstance = instance;
    return instance.getAllUsers();
  }).then(function(userIds){
    App.userslist = [];
    for(var i = 0; i < userIds.length; i++){
      var userId = userIds[i];
      console.log(userId);
      authInstance.getuser(userId.toNumber()).then(function(user){
        console.log("User " + user[0] + " password: " + user[1]);
        App.userslist.push({id: userId.toNumber(), username: user[0], password: user[1]});

      }).catch(function(err){
        console.log("failed user mapping");
        console.log(err);
      });
    }
  }).catch(function(err){
    console.log("failed contract call");
    console.log(err);
  });
  /*
  if(App.userslist.length > 0){
    res.send(App.userslist);
  }*/
  res.send(App.userslist);

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
      req.session.user = loginusername;
      console.log("successfull validation");
      res.redirect('/');
    }else{
      req.session.success = false;
      req.session.user = "";
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
  App.contracts.Auth.deployed().then(function(instance){
    return instance.getNumberOfUsers();
  }).then(function(number){
    console.log(number);
    if(number == 0){
      console.log("not set up");
      settingup = true;
      res.render('register', { title: 'Register Account', errors: req.session.errors, settingup: settingup });
    }else{
      console.log("already set up");
      settingup = false;
      res.render('register', { title: 'Register Account', errors: req.session.errors, settingup: settingup });
    }
  }).catch(function(err){
    console.log(err);
  });

  //res.render('register', { title: 'Register Account', errors: req.session.errors, settingup: settingup});
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
  var loggedUser = req.session.user;
  var coinbase;

  if(typeof loggedUser === 'undefined'){
    loggedUser = "none";
  }

  web3.eth.getCoinbase(function(err, account){
    if (err != null){
      console.log(err);
    }
  }).then(function(account){
    coinbase = account;

    console.log(json);

    App.contracts.Auth.deployed().then(function(instance) {
      return instance.createUser(inputUsername, inputPassword, loggedUser, {from: coinbase});
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
