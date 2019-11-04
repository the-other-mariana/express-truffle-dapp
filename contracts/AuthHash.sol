pragma solidity ^0.4.18;

contract AuthHash{
  struct UserHash{
    string id;
    bytes32 hashInfo;
  }

// a string can be a map key, but the map must not be public
  mapping(string => UserHash) userHashes;
  uint userCounter;

  function createUserHash(string _dbID, string _hashSubject) public returns (bool result){
    // hashing occurs
    userHashes[_dbID] = UserHash(_dbID, keccak256(_hashSubject));
    userCounter++;
    return true;
  }
  function compareHash(string _dbID, string _test) public view returns (bool result){
    if(keccak256(_test) == userHashes[_dbID].hashInfo){
      return true;
    }
    return false;
  }

  function getNumberOfUsers() public view returns(uint number){
    return userCounter;
  }

  function getUserHash(string _dbID) public  constant  returns(bytes32 _userHash) {
      return (userHashes[_dbID].hashInfo);
  }
}
