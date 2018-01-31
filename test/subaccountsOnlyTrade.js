const SubaccountsOnlyTrade = artifacts.require('./SubaccountsOnlyTrade.sol');
const TradeBuyerStorage = artifacts.require('./TradeBuyerStorage.sol');

contract('SubaccountOnlyTrade', function(accounts) {

    const account = accounts[0];

    it('can create subaccounts', function() {

        let trade;

        return SubaccountsOnlyTrade.deployed().then(function(instance) {
            trade = instance;

            return trade.addSubaccountsOnlyTradeSubaccount.call({from: account});
        });

    });

    it('can pay with subaccount', function() {

        let trade;
        let initialTradeBalance;
        let subaccount;

        return SubaccountsOnlyTrade.deployed().then(function(instance) {

            trade = instance;
            initialTradeBalance = web3.eth.getBalance(trade.address).toNumber();

            return trade.addSubaccountsOnlyTradeSubaccount.call({from: account});

        }).then(function(address) {

            subaccount = TradeBuyerStorage.at(address);

            return new Promise(function(resolve, reject) {

                web3.eth.sendTransaction({from: account, to: address, value: 10000}, function(err, v) {
                    if(err) {
                        reject(err);
                    } else {
                        resolve(v);
                    }

                });

            });

        }).then(function() {

            let balanceFromBlockchain = web3.eth.getBalance(subaccount.address);
            assert.equal(balanceFromBlockchain, 10000, "The balance should be 10000");

            return subaccount.pay.sendTransaction({from: account, value: 10000});
        }).then(function() {
            let currentTradeBalance = web3.eth.getBalance(trade.address).toNumber();

            assert.equal(currentTradeBalance, initialTradeBalance+10000, "The current trade balance should be 10000 higher");
        });

    });
});