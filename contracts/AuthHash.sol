pragma solidity ^0.4.18;

contract AuthHash{
  struct UserHash{
    uint id;
    bytes32 hashInfo;
  }

  mapping(uint => UserHash) public userHashes;
  uint userCounter;

  function createUserHash(string _hashSubject) public returns (bool result){
    // hashing occurs
    userHashes[userCounter] = UserHash(userCounter, keccak256(_hashSubject));
    userCounter++;
    return true;
  }
  function compareHash(string test, uint index) public view returns (bool result){
    if(keccak256(test) == userHashes[index].hashInfo){
      return true;
    }
    return false;
  }

  function getNumberOfUsers() public view returns(uint number){
    return userCounter;
  }

  function getUserHash(uint index)  public  constant  returns(bytes32 _userHash) {
      return (userHashes[index].hashInfo);
  }
}
