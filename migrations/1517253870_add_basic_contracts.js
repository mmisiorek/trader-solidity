var Trade = artifacts.require('./Trade.sol');
var PublicTrade = artifacts.require('./PublicTrade.sol');
var SubaccountsOnlyTrade = artifacts.require('./SubaccountsOnlyTrade.sol');
var TradeBuyerStorage = artifacts.require('./TradeBuyerStorage.sol');

module.exports = function(deployer) {
	
	deployer.deploy(Trade, 500, 1000, "general"); 
	
	deployer.deploy(PublicTrade, 10000, 20000, "public");
	
	deployer.deploy(SubaccountsOnlyTrade, 20000, 30000, "subaccount", function(instance) {
		
		for(let i = 0; i < 5; i++) {
			instance.addSubaccountsOnlyTradeSubaccount();
		}
		
	});
	
};
