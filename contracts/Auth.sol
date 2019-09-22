pragma solidity ^0.4.18;

contract Auth {

  struct User {
    uint id;
    address creator;
    string username;
    string password;
  }

  mapping(uint => User) public users;
  uint userCounter;

  function createUser(string _username, string _password) public {
    userCounter++;
    users[userCounter] = User(userCounter, msg.sender, _username, _password);
  }

  function existsUser(string _username, string _password) public view returns (bool result){
    for(uint i = 0; i <= userCounter; i++){
      if(keccak256(users[i].username) == keccak256(_username) && keccak256(users[i].password) == keccak256(_password)){
        return true;
      }
    }
    return false;
  }

  function getAllUsers() public view returns(uint[]){
    uint[] memory userids = new uint[](userCounter);

    for(uint i = 0; i <= userCounter; i++){
      userids[i] = users[i].id;
    }

    return userids;
  }

  function getNumberOfUsers() public view returns(uint number){
    return userCounter;
  }

}
