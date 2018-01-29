var Trade = artifacts.require("Trade");

contract('Trade', function(accounts) {
	
	it('should calculate remaining advance correctly', function() {
		return Trade.deployed().then(function(trade) {
			return trade.getRemainingAdvance.call();
		}).then(function(retVal) {
			assert.equal(retVal.toNumber(), 500, "The remaining advance value is not correct");
		});
	});
	
	it('should calculate remaining realization correctly', function() {
		return Trade.deployed(1000, 2000, "b").then(function(trade) {
			
			return trade.getRemainingRealization.call(); 
			
		}).then(function(retVal) {
			assert.equal(retVal.toNumber(), 1000, "The remaining realization value is not correct.");
		});
	});
	
});