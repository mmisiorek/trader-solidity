pragma solidity ^0.4.11;

import "./TradeBuyerStorage.sol";
import "./DestroyableTrade.sol";

contract SubaccountsOnlyTrade is DestroyableTrade {
    
    address[] public buyerStorages;
    
    function SubaccountsOnlyTrade(uint aA, uint rA, string _id) public payable Trade(aA, rA, _id) {
        buyerStorages = new address[](0);
    }
    
    modifier onlyFromSubaccount {
        for(uint i = 0; i < buyerStorages.length; i++) {
            if(buyerStorages[i] == msg.sender) {
                _;
            }
        }
    }
    
    function pay(uint256 amount) public payable unlessFinished onlyFromSubaccount returns(uint256) {
        return registerPayment(amount, msg.sender); 
    }
    
    function payAdvance() public payable unlessFinished onlyFromSubaccount returns(uint256) {
        uint256 remaining = getRemainingAdvance();
        return registerPayment(remaining, msg.sender); 
    }
    
    function payRealization() public payable ifAdvanceIsPaid onlyFromSubaccount returns(uint256) {
        uint256 remaining = getRemainingRealization();
        return registerPayment(remaining, msg.sender); 
    }
    
    function() public payable {
        msg.sender.transfer(msg.value); 
    }
    
    function addSubaccountsOnlyTradeSubaccount() public payable returns(address) {
        address newContract = new TradeBuyerStorage();
        buyerStorages.push(newContract);
        return newContract;
    }
    
}