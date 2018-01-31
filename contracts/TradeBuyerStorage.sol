pragma solidity ^0.4.11;

import "./SubaccountsOnlyTrade.sol";

/* 
 Sub-account for the buyer. It needs to be finished.
 */
contract TradeBuyerStorage {
    
    address owner;
    bool hasOwner;
    address tradeContractCreator;
    
    modifier onlyOwnerIfExists {
        require(!hasOwner || msg.sender == owner);
        _;
    }
    
    modifier onlyOwner {
        require(hasOwner && msg.sender == owner);
        _; 
    }
    
    modifier onlyTradeContract {
        require(msg.sender == tradeContractCreator);
        _;
    }
    
    modifier returnValueToOwner {
        if(hasOwner) {
            owner.transfer(msg.value); 
        }
        _;
    }
    
    function TradeBuyerStorage() public payable {
        tradeContractCreator = msg.sender;
        hasOwner = false;
    }
    
    function() public payable onlyOwnerIfExists {
        owner = msg.sender;
        hasOwner = true;
    }
    
    function currentBalance() public view returns (uint256) {
        return this.balance;
    }
    
    function pay() public payable onlyOwnerIfExists returnValueToOwner returns(uint256) {
        SubaccountsOnlyTrade trade = SubaccountsOnlyTrade(tradeContractCreator);

        tradeContractCreator.transfer(msg.value);

        return trade.pay(msg.value);
    }
    
    function payAdvance() public payable onlyOwnerIfExists returnValueToOwner returns(uint256) {
        SubaccountsOnlyTrade trade = SubaccountsOnlyTrade(tradeContractCreator); 
        return trade.payAdvance();
    }
    
    function payRealization() public payable onlyOwnerIfExists returnValueToOwner returns(uint256) {
        SubaccountsOnlyTrade trade = SubaccountsOnlyTrade(tradeContractCreator);
        return trade.payRealization(); 
    }
    
    function returnMoneyAndDestroy() public payable onlyOwnerIfExists returnValueToOwner returns(uint256) {
        uint256 weisToReturn = msg.value+this.balance;
        owner.transfer(weisToReturn);
        selfdestruct(owner); 
        
        return weisToReturn; 
    }
    
}