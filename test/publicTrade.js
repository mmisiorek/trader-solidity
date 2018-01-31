const PublicTrade = artifacts.require('./PublicTrade.sol');

function getRemainingsPromise(trade) {
	return Promise.all([trade.getRemainingAdvance(), trade.getRemainingRealization()]).then(function(result) {
		return {
			advance: result[0].toNumber(),
			realization: result[1].toNumber()
		}
	});
}

contract('PublicTrade pay', function(accounts) {
	
	let account = accounts[0];
	
	it('should work', function() {

		let advanceAmount;
		let realizationAmount;
		let trade;

		return PublicTrade.deployed().then(function(instance) {
			trade = instance;

			return getRemainingsPromise(trade);
		}).then(function(amounts) {
			advanceAmount = amounts.advance;
			realizationAmount = amounts.realization;

			return trade.pay.sendTransaction({from: account, value: 100}).then(() => { return trade.getRemainingAdvance(); });
		}).then(function(amount) {
			assert.equal(amount.toNumber(), advanceAmount-100, "The remaining number should be 100 less than initial one");

			return trade.pay.sendTransaction({from: account, value: advanceAmount}).then(() => { return getRemainingsPromise(trade); });
		}).then(function(amounts) {
			assert.equal(amounts.advance, 0, "The remaining advance should be 0");
			assert.equal(amounts.realization, realizationAmount-100, "The remaining realization should be 100 than initial value");

			return trade.pay.sendTransaction({from: account, value: 50}).then(() => { return getRemainingsPromise(trade); });
		}).then(function(amounts) {
            assert.equal(amounts.advance, 0, "The advance should be still 0");
            assert.equal(amounts.realization, realizationAmount-150, "Now the realization should be 150 less.");

            return trade.pay.sendTransaction({from: account, value: realizationAmount}).then(() => { return getRemainingsPromise(trade) });
        }).then(function(amounts) {
            assert.equal(amounts.advance, 0, "The advance on the end should be 0");
            assert.equal(amounts.realization, 0, "The realization on the end should be 0");
        });

	});

});

contract('(1) PublicTrade payAdvance', function(accounts) {

    let account = accounts[0];

    it('should throw exception when too small value sent', function() {

        let advanceAmount;
        let realizationAmount;
        let trade;

        return PublicTrade.deployed().then(function(instance) {
            trade = instance;

            return getRemainingsPromise(trade).then(function(amounts) {
                advanceAmount = amounts.advance;
                realizationAmount = amounts.realization;
            });
        }).then(function() {
            return trade.pay.sendTransaction({from: account, value: 100}).then(() => { return getRemainingsPromise(trade); });
        }).then(function(amounts) {

            assert.equal(amounts.advance, advanceAmount-100, "The advance amount should be 100 wei less");
            assert.equal(amounts.realization, realizationAmount, "The realization amount should be the same");

            return trade.payAdvance.sendTransaction({from: account, value: 1}).then(() => { return getRemainingsPromise(trade); });
        }).catch(function(err) {

            assert.notStrictEqual(err, undefined, "The error should be thrown");

        });

    });

});

contract('(2) PublicTrade payAdvance', function(accounts) {

    let account = accounts[0];

    it('should work', function() {

        let advanceAmount;
        let realizationAmount;
        let trade;

        return PublicTrade.deployed().then(function(instance) {
            trade = instance;

            return getRemainingsPromise(trade).then(function(amounts) {
                advanceAmount = amounts.advance;
                realizationAmount = amounts.realization;
            });
        }).then(function() {
            return trade.pay.sendTransaction({from: account, value: 100}).then((x) => { return getRemainingsPromise(trade); });
        }).then(function(amounts) {

            assert.equal(amounts.advance, advanceAmount-100, "The advance amount should be 100 wei less");
            assert.equal(amounts.realization, realizationAmount, "The realization amount should be the same");

            return trade.payAdvance.sendTransaction({from: account, value: advanceAmount}).then((x) => {  return getRemainingsPromise(trade); });
        }).then(function(values) {

            assert.equal(values.advance, 0, "The advance should be 0 now");
            assert.equal(values.realization, realizationAmount, "The remaining realization amount should not be touched");

        });

    });

});

contract('(1) PublicTrade payRealization', function(accounts) {

    let account = accounts[0];

    it('should throw exception when advance not paid', function() {

        let advanceAmount;
        let realizationAmount;
        let trade;

        return PublicTrade.deployed().then(function(instance) {
            trade = instance;

            return getRemainingsPromise(trade).then(function(amounts) {
                advanceAmount = amounts.advance;
                realizationAmount = amounts.realization;
            });
        }).then(function() {
            return trade.pay.sendTransaction({from: account, value: 100}).then(() => { return getRemainingsPromise(trade); });
        }).then(function(amounts) {

            assert.equal(amounts.advance, advanceAmount-100, "The advance amount should be 100 wei less");
            assert.equal(amounts.realization, realizationAmount, "The realization amount should be the same");

            return trade.payRealization.sendTransaction({from: account, value: advanceAmount+realizationAmount}).then(() => { return getRemainingsPromise(trade); });
        }).catch(function(err) {

            assert.notStrictEqual(err, undefined, "The error should be thrown");

        });

    });

});

contract('(2) PublicTrade payRealization', function(accounts) {

    let account = accounts[0];

    it('should work when realization paid', function() {

        let advanceAmount;
        let realizationAmount;
        let trade;

        return PublicTrade.deployed().then(function(instance) {
            trade = instance;

            return getRemainingsPromise(trade).then(function(amounts) {
                advanceAmount = amounts.advance;
                realizationAmount = amounts.realization;
            });
        }).then(function() {
            return trade.pay.sendTransaction({from: account, value: advanceAmount}).then(() => { return getRemainingsPromise(trade); });
        }).then(function(amounts) {

            assert.equal(amounts.advance, 0, "The advance amount should be 0");
            assert.equal(amounts.realization, realizationAmount, "The realization amount should be the same");

            return trade.payRealization.sendTransaction({from: account, value: realizationAmount+100}).then(() => { return getRemainingsPromise(trade); });
        }).then(function(amounts) {

            assert.equal(amounts.advance, 0, "The advance amount should be 0 again");
            assert.equal(amounts.realization, 0, "The realization amount should be 0");

        });

    });

});
