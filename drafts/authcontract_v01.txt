pragma solidity ^0.4.18;

contract Auth {
  // state variables
  address creator;
  string username;
  string password;

  // create a new user
  // call this:
  // Auth.deployed().then(function(instance){app = instance;})
  // app.createUser("mariana", "mar123", {from: web3.eth.accounts[1]}) <- last param is metadata allowed when
  // there is a transaction (function modifies state vars), and specifies the msg.sender as account[1] (account that calls the function)
  function createUser(string _username, string _password) public {
    creator = msg.sender;
    username = _username;
    password = _password;
  }

  // function that returns if the input account is a valid user
  function existsUser(string _username, string _password) public view returns (bool result){
    if (keccak256(_username) == keccak256(username) && keccak256(_password) == keccak256(password)){
      return true;
    }else{
      return false;
    }
  }

}
