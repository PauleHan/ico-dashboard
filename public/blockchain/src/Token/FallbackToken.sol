pragma solidity 0.4.18;


/**
 * @title FallbackToken token
 *
 * @dev add ERC223 standard ability
 **/
contract FallbackToken {

  function isContract(address _addr) internal view returns (bool) {
    uint length;
    assembly {length := extcodesize(_addr)}
    return (length > 0);
  }
}


contract Receiver {
  function tokenFallback(address from, uint value) public;
}

