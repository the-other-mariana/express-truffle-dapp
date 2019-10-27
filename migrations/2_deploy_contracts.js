var ChainList = artifacts.require("./ChainList.sol");
var Auth = artifacts.require("./Auth.sol");
var AuthHash = artifacts.require("./AuthHash.sol");

module.exports = function(deployer) {
  deployer.deploy(ChainList);
  deployer.deploy(Auth);
  deployer.deploy(AuthHash);
}
