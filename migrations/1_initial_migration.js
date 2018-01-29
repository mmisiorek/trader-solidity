var Migrations = artifacts.require("./Migrations.sol");
var Trade = artifacts.require('./Trade.sol');

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(Trade);
};
   