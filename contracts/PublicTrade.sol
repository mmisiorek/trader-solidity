pragma solidity ^0.4.11;

import "./DestroyableTrade.sol";

contract PublicTrade is DestroyableTrade {
    
    address[] public senders;
    mapping(address => uint) public amounts;
    
    function PublicTrade(uint aA, uint rA, string _id) payable Trade(aA, rA, _id) {
        senders = new address[](0);
    }
    
    modifier senderIsMyself {
        require(msg.sender == address(this));
        _;
    }
    
    modifier valueIsRemainingAdvance {
        require(getRemainingAdvance() <= msg.value);
        _;
    }
    
    modifier valueIsRemainingRealization {
        require(getRemainingRealization() <= msg.value);
        _;
    }
    
    function pay() public payable unlessFinished returns(uint256) {
        initSenderInAmountsIfNeeded(msg.sender);
        amounts[msg.sender] += msg.value;
        
        return registerPayment(msg.value, msg.sender); 
    }
    
    function pay(uint amount, address sender) public payable unlessFinished senderIsMyself returns(uint256) {
        initSenderInAmountsIfNeeded(sender);
        amounts[sender] += amount;
        
        return registerPayment(msg.value, msg.sender);
    }
    
    function payAdvance() public payable unlessFinished valueIsRemainingAdvance returns(uint256) {
        initSenderInAmountsIfNeeded(msg.sender);
        amounts[msg.sender] += msg.value;
        
        uint overflow = msg.value-getRemainingAdvance();
        if(overflow > 0) {
            msg.sender.transfer(overflow); 
        }
        
        return registerPayment(msg.value, msg.sender); 
    } 
    
    function payRealization() public payable ifAdvanceIsPaid valueIsRemainingRealization returns(uint256) {
        initSenderInAmountsIfNeeded(msg.sender);
        amounts[msg.sender] += msg.value;
        
        uint overflow = msg.value-getRemainingRealization();
        if(overflow > 0) {
            msg.sender.transfer(overflow);
        }
        
        return registerPayment(msg.value, msg.sender);
    }
    
    function() payable {
        this.pay(msg.value, msg.sender); 
    }
    
    function initSenderInAmountsIfNeeded(address sender) internal {
        bool exists = false;
        
        for(uint i = 0; i < senders.length; i++) {
            if(senders[i] == sender) {
                exists = true;
                break;
            }
        }
        
        if(!exists) {
            amounts[sender] = 0; 
        }
    }
}