pragma solidity ^0.4.11;

contract Trade {
    
    address internal owner;
    string internal id;
    
    uint public advanceAmount;
    uint public realizationAmount;
    
    uint public advancePaid;
    uint public realizationPaid;
    
    bool isAdvancedPaid;
    bool isRealizationPaid;
    
    event AdvanceHasBeenPaid(string _id);
    event RealizationHasBeenPaid(string _id); 
    
    modifier ifAdvanceIsPaid {
        require(isAdvancedPaid);
        _;
    }
    
    modifier ifRealizationIsPaid {
        require(isRealizationPaid);
        _;
    }
    
    modifier unlessFinished {
        require(!isAdvancedPaid || !isRealizationPaid);
        _;
    }
    
    function Trade(uint aA, uint rA, string _id) public payable {
        owner = msg.sender;
        id = _id; 
        advanceAmount = aA;
        realizationAmount = rA;
        
        advancePaid = 0;
        realizationPaid = 0;
        
        isAdvancedPaid = false;
        isRealizationPaid = false;
    }
    
    function registerPayment(uint256 val, address initialSender) internal returns(uint256) {
        uint remainingValue = val;
        uint valueToOwner = 0; 
        
        initialSender = 0;
        
        if(remainingValue > 0 && !isAdvancedPaid) {
            uint remainingAdvance = getRemainingAdvance();
            uint smallerAValue = remainingValue > remainingAdvance ? remainingAdvance : remainingValue;
            
            remainingValue = remainingValue-smallerAValue;
            advancePaid = advancePaid+smallerAValue;
            
            if(advancePaid >= advanceAmount) {
                isAdvancedPaid = true;
                
                valueToOwner = valueToOwner+advanceAmount;
                AdvanceHasBeenPaid(id);
            }
        }
        
        if(remainingValue > 0 && !isRealizationPaid) {
            uint remainingRealization = getRemainingRealization();
            uint smallerRValue = remainingValue > remainingRealization ? remainingRealization : remainingValue;
            
            remainingValue = remainingValue-smallerRValue;
            realizationPaid = realizationPaid+smallerRValue;
            
            if(realizationPaid >= realizationAmount) {
                isRealizationPaid = true;
                
                valueToOwner = valueToOwner+realizationAmount;
                RealizationHasBeenPaid(id);
            }
        }
        
        // return your money when you paid too much
        if(remainingValue > 0) {
            msg.sender.transfer(remainingValue); 
        }
        
        // transfer money to owner's account when 
        if(valueToOwner > 0) {
            owner.transfer(valueToOwner);
        }
        
        return val-remainingValue;
    }
    
    function getRemainingAdvance() public view returns(uint256) {
        if(isAdvancedPaid) {
            return 0;
        }
        
        return advanceAmount-advancePaid;
    }
    
    function getRemainingRealization() public view returns(uint256) {
        if(isRealizationPaid) {
            return 0;
        }
        
        return realizationAmount-realizationPaid; 
    }
    
}