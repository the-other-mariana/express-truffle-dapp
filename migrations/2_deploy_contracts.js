var ChainList = artifacts.require("./ChainList.sol");
var Auth = artifacts.require("./Auth.sol");

module.exports = function(deployer) {
  deployer.deploy(ChainList);
  deployer.deploy(Auth);
}
