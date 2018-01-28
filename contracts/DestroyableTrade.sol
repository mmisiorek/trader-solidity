pragma solidity ^0.4.11;

import "./IDestroyableContract.sol";
import "./Trade.sol";

contract DestroyableTrade is Trade, IDestroyableContract {
    
    modifier isOwner {
        require(msg.sender == owner);
        _;
    }
    
    function destroy() public isOwner {
        selfdestruct(owner); 
    }
    
}