pragma solidity 0.4.18;


import "zeppelin-solidity/contracts/token/MintableToken.sol";
import "./FallbackToken.sol";


/**
 * @title SimpleToken
 * @dev Very simple ERC20 Token example, where all tokens are pre-assigned to the creator.
 * Note they can later distribute these tokens as they wish using `transfer` and other
 * `StandardToken` functions.
 */
contract TriggmineToken is MintableToken, FallbackToken {

  string public constant name = "Triggmine Coin";

  string public constant symbol = "TRG";

  uint256 public constant decimals = 18;

  bool public released = false;

  event Release();

  modifier isReleased () {
    require(mintingFinished);
    require(released);
    _;
  }

  function release() onlyOwner public returns (bool) {
    require(mintingFinished);
    require(!released);
    released = true;
    Release();

    return true;
  }

  function transfer(address _to, uint256 _value) public isReleased returns (bool) {
    require(super.transfer(_to, _value));

    if (isContract(_to)) {
      Receiver(_to).tokenFallback(msg.sender, _value);
    }

    return true;
  }

  function transferFrom(address _from, address _to, uint256 _value) public isReleased returns (bool) {
    return super.transferFrom(_from, _to, _value);
  }

  function approve(address _spender, uint256 _value) public isReleased returns (bool) {
    return super.approve(_spender, _value);
  }

  function increaseApproval(address _spender, uint _addedValue) public isReleased returns (bool success) {
    return super.increaseApproval(_spender, _addedValue);
  }

  function decreaseApproval(address _spender, uint _subtractedValue) public isReleased returns (bool success) {
    return super.decreaseApproval(_spender, _subtractedValue);
  }

}