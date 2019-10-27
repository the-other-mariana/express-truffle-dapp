pragma solidity ^0.4.18;

contract AuthHash{
  struct UserHash{
    uint id;
    string hashInfo;
  }

  mapping(uint => UserHash) public userHashes;
  uint userCounter;

  function createUserHash(string _username, string _password) public returns (bool result){
    // hashing occurs
    string memory hashResult = _password;
    userHashes[userCounter] = UserHash(userCounter, hashResult);
    userCounter++;
    return true;
  }

  function getNumberOfUsers() public view returns(uint number){
    return userCounter;
  }

  function getUserHash(uint index)  public  constant  returns(string _userHash) {
      return (userHashes[index].hashInfo);
  }
}
