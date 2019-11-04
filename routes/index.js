var express = require('express');
var router = express.Router();

var getJSON = require('get-json');
var json = require("../build/contracts/Auth.json");
var jsonAuthHash = require("../build/contracts/AuthHash.json");
var contract = require("truffle-contract");
const fetch = require("node-fetch");
const ganache = require("ganache-cli");
const Web3 = require("web3");
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
var tools = require("./fs-tools.js");
var contractAuth;
var settingup = false;

const mongo = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/test';
var assert = require('assert');

App = {
  web3Provider: null,
  contracts: {},
  account: 0x0,
  userslist: []
};

App.contracts.Auth = contract(json);
App.contracts.AuthHash = contract(jsonAuthHash);

App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');

App.contracts.Auth.setProvider(App.web3Provider);
App.contracts.AuthHash.setProvider(App.web3Provider);

/* 1. GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Blockchain Dapp', success: req.session.success, errors: req.session.errors, user: req.session.user });
  req.session.errors = null;

  // get users from db
  mongo.connect(url, function(err, db){
    if(err != null){
      console.log("error at db connect");
    }
    var cursor = db.collection('user-data').find();
    cursor.forEach(function(doc, err){
      assert.equal(null, err);
      console.log(doc);
    }, function(){
      db.close();
    });
  });

  // get number of user hashes in bc
  var authHashInstance;
  App.contracts.AuthHash.deployed().then(function(instance){
    authHashInstance = instance;
    return instance.getNumberOfUsers();
  }).then(function(number){
    console.log("contract hashes: " + number);
  });

});

router.post('/restart-db', function(req, res, next){

  mongo.connect(url, function(err, db){
    assert.equal(null, err);
    db.collection('user-data').drop(function(err, result){
      if(err != null){
        console.log("error dropping");
      }
      if (result){
        console.log("user-data collection dropped");
        res.redirect('/');
      }
    });
  });

});

// for AJAX resource
router.get('/users', function(req, res, next) {

  // mongo db get data
  App.userslist = [];
  mongo.connect(url, function(err, db){
    if(err != null){
      console.log("error at db connect");
    }
    var cursor = db.collection('user-data').find();
    cursor.forEach(function(doc, err){
      assert.equal(null, err);
      App.userslist.push({id: doc._id.toString(), username: doc.username, password: doc.password});
    }, function(){
      db.close();
      res.send(App.userslist);
      console.log(App.userslist);
    });
  });

});

// goes here if we type localhost:8000/users/detail
router.get('/users/detail', function(req, res, next) {
  res.send('detail');
});

router.post('/login', function(req, res, next){

  var loginusername = req.body.loginusername;
  var loginpassword = req.body.loginpassword;
  var exists = false;
  var userID = "";

  mongo.connect(url, function(err, db){
    if(err != null){
      console.log("error at db connect");
    }
    var cursor = db.collection('user-data').find();
    cursor.forEach(function(doc, err){
      assert.equal(null, err);
      if (doc.username == loginusername && doc.password == loginpassword){
        exists = true;
        userID = (doc._id).toString();
      }
    }, function(){
      db.close();

      // hash of input username and password occurs here
      var hashInfo = loginusername + loginpassword;
      App.contracts.AuthHash.deployed().then(function(instance){
        return instance.compareHash(userID, hashInfo);
      }).then(function(same){
        if(exists == true && same == true){
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
      });
    });
  });

});

router.post('/register', function(req, res, next){

  mongo.connect(url, function(err, db){
    db.collection('user-data').count().then(function(count){
      if(count == 0){
        console.log("not set up");
        settingup = true;
        res.render('register', { title: 'Register Account', errors: req.session.errors, settingup: settingup });
      }else{
        console.log("already set up");
        settingup = false;
        res.render('register', { title: 'Register Account', errors: req.session.errors, settingup: settingup });
      }
    });
  });
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
  var userID = "";

  if(typeof loggedUser === 'undefined'){
    loggedUser = "none";
  }

  // mongodb user insertion
  var item = {
    username: inputUsername,
    password: inputPassword,
    isSuperUser: false
  };
  mongo.connect(url, function(err, db){
    var superuser = null;
    assert.equal(null, err);
    db.collection('user-data').count().then((count) => {
      console.log("number of users from db: " + count);

      // if creating super user
      if(count == 0){
        item.isSuperUser = true;
        // add it to db
        db.collection('user-data').insertOne(item, function(err, result){
          userID = (result.insertedId).toString();
          assert.equal(null, err);
          console.log('Item inserted, id:' + (result.insertedId).toString());
          db.close();

          // add it to bc
          web3.eth.getCoinbase(function(err, account){
            if (err != null){
              console.log(err);
            }
          }).then(function(account){
            coinbase = account;
            App.contracts.AuthHash.deployed().then(function(instance) {
              var hashSubject = inputUsername + inputPassword;
              return instance.createUserHash(userID, hashSubject, {from: coinbase});
            }).then(function(user){
              console.log("user: ");
              console.log(user);
              res.redirect("/");
            }).catch(function(err) {
              console.error(err.message);
            });
          });

        });
      }
      // if super user already set up
      else{
        var cursor = db.collection('user-data').find();
        cursor.forEach(function(doc, err){
          assert.equal(null, err);
          if (doc.isSuperUser == true){
            superuser = doc.username;
          }
        }, function(){
          if(loggedUser == superuser){
            // add it to db
            db.collection('user-data').insertOne(item, function(err, result){
              userID = (result.insertedId).toString();
              assert.equal(null, err);
              console.log('Item inserted from super user');
              db.close();

              // add it to bc
              web3.eth.getCoinbase(function(err, account){
                if (err != null) console.log(err);
              }).then(function(account){
                coinbase = account;
                App.contracts.AuthHash.deployed().then(function(instance) {
                  var hashSubject = inputUsername + inputPassword;
                  return instance.createUserHash(userID, hashSubject, {from: coinbase});
                }).then(function(user){
                  console.log("user: ");
                  console.log(user);
                  res.redirect("/");
                }).catch(function(err) {
                  console.error(err.message);
                });
              });

            });
          }else{
            console.log("User not allowed to insert item");
            db.close();
            res.redirect("/");
          }
        });
      }
    });
  });
});

module.exports = router;
