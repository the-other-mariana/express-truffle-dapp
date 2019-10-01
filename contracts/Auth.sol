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
  string superuser;

  function createUser(string _username, string _password, string _loggedUser) public returns (bool result) {
    if(userCounter == 0){
      userCounter++;
      users[userCounter] = User(userCounter, msg.sender, _username, _password);
    }else{
      if(keccak256(_loggedUser) == keccak256(superuser)){
        userCounter++;
        users[userCounter] = User(userCounter, msg.sender, _username, _password);
      }
    }

    if (userCounter == 1){
      superuser = _username;
    }
    return true;
  }

  function existsUser(string _username, string _password) public view returns (bool result){
    for(uint i = 0; i <= userCounter; i++){
      if(keccak256(users[i].username) == keccak256(_username) && keccak256(users[i].password) == keccak256(_password)){
        return true;
      }
    }
    return false;
  }

// still in progress
  function getAllUsers() public view returns(uint[] memory){
    uint[] memory userids = new uint[](userCounter);

    for(uint i = 0; i < userCounter; i++){
      userids[i] = users[i].id;
    }

    return userids;
  }

  function getNumberOfUsers() public view returns(uint number){
    return userCounter;
  }

}
