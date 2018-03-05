pragma solidity 0.4.18;

// File: src\Common\TriggmineLibrary.sol

library TriggmineLibrary {
    enum SaleStates {
        Invalid,
        EarlyInvestor,
        PreSaleFirstTwoDays,
        PreSaleThirdDay,
        PreSaleFourthDay,
        PreSaleFifthDay,
        PreSaleSixthDay,
        PreSaleLastDays,
        PreSaleFinished,
        MainTokenSaleFirstThreeDays,
        MainTokenSaleFourthSeventhDays,
        MainTokenSaleLastDays,
        MainSaleFinished
    }

    enum Currencies {
        NONE, ETH, BTC, USD
    }
}

// File: src\Token\FallbackToken.sol

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

// File: zeppelin-solidity/contracts/ownership/Ownable.sol

/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Ownable {
  address public owner;


  event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);


  /**
   * @dev The Ownable constructor sets the original `owner` of the contract to the sender
   * account.
   */
  function Ownable() public {
    owner = msg.sender;
  }


  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }


  /**
   * @dev Allows the current owner to transfer control of the contract to a newOwner.
   * @param newOwner The address to transfer ownership to.
   */
  function transferOwnership(address newOwner) public onlyOwner {
    require(newOwner != address(0));
    OwnershipTransferred(owner, newOwner);
    owner = newOwner;
  }

}

// File: zeppelin-solidity/contracts/math/SafeMath.sol

/**
 * @title SafeMath
 * @dev Math operations with safety checks that throw on error
 */
library SafeMath {
  function mul(uint256 a, uint256 b) internal pure returns (uint256) {
    if (a == 0) {
      return 0;
    }
    uint256 c = a * b;
    assert(c / a == b);
    return c;
  }

  function div(uint256 a, uint256 b) internal pure returns (uint256) {
    // assert(b > 0); // Solidity automatically throws when dividing by 0
    uint256 c = a / b;
    // assert(a == b * c + a % b); // There is no case in which this doesn't hold
    return c;
  }

  function sub(uint256 a, uint256 b) internal pure returns (uint256) {
    assert(b <= a);
    return a - b;
  }

  function add(uint256 a, uint256 b) internal pure returns (uint256) {
    uint256 c = a + b;
    assert(c >= a);
    return c;
  }
}

// File: zeppelin-solidity/contracts/token/ERC20Basic.sol

/**
 * @title ERC20Basic
 * @dev Simpler version of ERC20 interface
 * @dev see https://github.com/ethereum/EIPs/issues/179
 */
contract ERC20Basic {
  uint256 public totalSupply;
  function balanceOf(address who) public view returns (uint256);
  function transfer(address to, uint256 value) public returns (bool);
  event Transfer(address indexed from, address indexed to, uint256 value);
}

// File: zeppelin-solidity/contracts/token/BasicToken.sol

/**
 * @title Basic token
 * @dev Basic version of StandardToken, with no allowances.
 */
contract BasicToken is ERC20Basic {
  using SafeMath for uint256;

  mapping(address => uint256) balances;

  /**
  * @dev transfer token for a specified address
  * @param _to The address to transfer to.
  * @param _value The amount to be transferred.
  */
  function transfer(address _to, uint256 _value) public returns (bool) {
    require(_to != address(0));
    require(_value <= balances[msg.sender]);

    // SafeMath.sub will throw if there is not enough balance.
    balances[msg.sender] = balances[msg.sender].sub(_value);
    balances[_to] = balances[_to].add(_value);
    Transfer(msg.sender, _to, _value);
    return true;
  }

  /**
  * @dev Gets the balance of the specified address.
  * @param _owner The address to query the the balance of.
  * @return An uint256 representing the amount owned by the passed address.
  */
  function balanceOf(address _owner) public view returns (uint256 balance) {
    return balances[_owner];
  }

}

// File: zeppelin-solidity/contracts/token/ERC20.sol

/**
 * @title ERC20 interface
 * @dev see https://github.com/ethereum/EIPs/issues/20
 */
contract ERC20 is ERC20Basic {
  function allowance(address owner, address spender) public view returns (uint256);
  function transferFrom(address from, address to, uint256 value) public returns (bool);
  function approve(address spender, uint256 value) public returns (bool);
  event Approval(address indexed owner, address indexed spender, uint256 value);
}

// File: zeppelin-solidity/contracts/token/StandardToken.sol

/**
 * @title Standard ERC20 token
 *
 * @dev Implementation of the basic standard token.
 * @dev https://github.com/ethereum/EIPs/issues/20
 * @dev Based on code by FirstBlood: https://github.com/Firstbloodio/token/blob/master/smart_contract/FirstBloodToken.sol
 */
contract StandardToken is ERC20, BasicToken {

  mapping (address => mapping (address => uint256)) internal allowed;


  /**
   * @dev Transfer tokens from one address to another
   * @param _from address The address which you want to send tokens from
   * @param _to address The address which you want to transfer to
   * @param _value uint256 the amount of tokens to be transferred
   */
  function transferFrom(address _from, address _to, uint256 _value) public returns (bool) {
    require(_to != address(0));
    require(_value <= balances[_from]);
    require(_value <= allowed[_from][msg.sender]);

    balances[_from] = balances[_from].sub(_value);
    balances[_to] = balances[_to].add(_value);
    allowed[_from][msg.sender] = allowed[_from][msg.sender].sub(_value);
    Transfer(_from, _to, _value);
    return true;
  }

  /**
   * @dev Approve the passed address to spend the specified amount of tokens on behalf of msg.sender.
   *
   * Beware that changing an allowance with this method brings the risk that someone may use both the old
   * and the new allowance by unfortunate transaction ordering. One possible solution to mitigate this
   * race condition is to first reduce the spender's allowance to 0 and set the desired value afterwards:
   * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
   * @param _spender The address which will spend the funds.
   * @param _value The amount of tokens to be spent.
   */
  function approve(address _spender, uint256 _value) public returns (bool) {
    allowed[msg.sender][_spender] = _value;
    Approval(msg.sender, _spender, _value);
    return true;
  }

  /**
   * @dev Function to check the amount of tokens that an owner allowed to a spender.
   * @param _owner address The address which owns the funds.
   * @param _spender address The address which will spend the funds.
   * @return A uint256 specifying the amount of tokens still available for the spender.
   */
  function allowance(address _owner, address _spender) public view returns (uint256) {
    return allowed[_owner][_spender];
  }

  /**
   * approve should be called when allowed[_spender] == 0. To increment
   * allowed value is better to use this function to avoid 2 calls (and wait until
   * the first transaction is mined)
   * From MonolithDAO Token.sol
   */
  function increaseApproval(address _spender, uint _addedValue) public returns (bool) {
    allowed[msg.sender][_spender] = allowed[msg.sender][_spender].add(_addedValue);
    Approval(msg.sender, _spender, allowed[msg.sender][_spender]);
    return true;
  }

  function decreaseApproval(address _spender, uint _subtractedValue) public returns (bool) {
    uint oldValue = allowed[msg.sender][_spender];
    if (_subtractedValue > oldValue) {
      allowed[msg.sender][_spender] = 0;
    } else {
      allowed[msg.sender][_spender] = oldValue.sub(_subtractedValue);
    }
    Approval(msg.sender, _spender, allowed[msg.sender][_spender]);
    return true;
  }

}

// File: zeppelin-solidity/contracts/token/MintableToken.sol

/**
 * @title Mintable token
 * @dev Simple ERC20 Token example, with mintable token creation
 * @dev Issue: * https://github.com/OpenZeppelin/zeppelin-solidity/issues/120
 * Based on code by TokenMarketNet: https://github.com/TokenMarketNet/ico/blob/master/contracts/MintableToken.sol
 */

contract MintableToken is StandardToken, Ownable {
  event Mint(address indexed to, uint256 amount);
  event MintFinished();

  bool public mintingFinished = false;


  modifier canMint() {
    require(!mintingFinished);
    _;
  }

  /**
   * @dev Function to mint tokens
   * @param _to The address that will receive the minted tokens.
   * @param _amount The amount of tokens to mint.
   * @return A boolean that indicates if the operation was successful.
   */
  function mint(address _to, uint256 _amount) onlyOwner canMint public returns (bool) {
    totalSupply = totalSupply.add(_amount);
    balances[_to] = balances[_to].add(_amount);
    Mint(_to, _amount);
    Transfer(address(0), _to, _amount);
    return true;
  }

  /**
   * @dev Function to stop minting new tokens.
   * @return True if the operation was successful.
   */
  function finishMinting() onlyOwner canMint public returns (bool) {
    mintingFinished = true;
    MintFinished();
    return true;
  }
}

// File: src\Token\TriggmineToken.sol

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

// File: src\Crowdsale\MileStoneCrowdSale.sol

contract MileStoneCrowdSale is Ownable {

    using SafeMath for uint256;
    
    /*PreSale Start Date*/
    uint256 public preSaleStartDate;

    /*PreSale End Date*/
    uint256 public preSaleEndDate;
    
    /*MainSale Start Date*/
    uint256 public mainSaleStartDate;

    /*MainSale End Date*/
    uint256 public mainSaleEndDate;

    struct Milestone {
        uint start;
        uint end;
        TriggmineLibrary.SaleStates state;
    }

    Milestone[] public mileStones;

    bool mileStonesSetIsFinished = false;

    modifier validDate(uint256 _startDate, uint256 _endDate){
        require(0 < _startDate);
        require(0 < _endDate);
        require(_startDate < _endDate);
        _;
    }

    modifier canSetMileStones(){
        require(false == mileStonesSetIsFinished);
        _;
    }

    function setPreSaleFirstTwoDaysMileStone(uint256  _startDate, uint256 _endDate) public onlyOwner canSetMileStones validDate(_startDate, _endDate){
        preSaleStartDate = _startDate;
        mileStones.push(Milestone(now, _startDate, TriggmineLibrary.SaleStates.EarlyInvestor));
        mileStones.push(Milestone(_startDate, _endDate, TriggmineLibrary.SaleStates.PreSaleFirstTwoDays));
    }

    function setPreSaleThirdDayMileStone(uint256 _startDate, uint256 _endDate) public onlyOwner canSetMileStones validDate(_startDate, _endDate){
        mileStones.push(Milestone(_startDate, _endDate, TriggmineLibrary.SaleStates.PreSaleThirdDay));
    }

    function setPreSaleFourthDayMileStone(uint256 _startDate, uint256 _endDate) public onlyOwner canSetMileStones validDate(_startDate, _endDate){
        mileStones.push(Milestone(_startDate, _endDate, TriggmineLibrary.SaleStates.PreSaleFourthDay));
    }

    function setPreSaleFifthDayMileStone(uint256 _startDate, uint256 _endDate) public onlyOwner canSetMileStones validDate(_startDate, _endDate){
        mileStones.push(Milestone(_startDate, _endDate, TriggmineLibrary.SaleStates.PreSaleFifthDay));
    }

    function setPreSaleSixthDayMileStone(uint256 _startDate, uint256 _endDate) public onlyOwner canSetMileStones validDate(_startDate, _endDate){
        mileStones.push(Milestone(_startDate, _endDate, TriggmineLibrary.SaleStates.PreSaleSixthDay));
    }

    function setPreSaleLastDaysMileStone(uint256 _startDate, uint256 _endDate) public onlyOwner canSetMileStones validDate(_startDate, _endDate){
        preSaleEndDate = _endDate;
        mileStones.push(Milestone(_startDate, _endDate, TriggmineLibrary.SaleStates.PreSaleLastDays));
    }

    function setMainSaleFirstThreeDaysMileStone(uint256 _startDate, uint256 _endDate) public onlyOwner canSetMileStones validDate(_startDate, _endDate){
        mainSaleStartDate = _startDate;
        mileStones.push(Milestone(preSaleEndDate, _startDate, TriggmineLibrary.SaleStates.PreSaleFinished));
        mileStones.push(Milestone(_startDate, _endDate, TriggmineLibrary.SaleStates.MainTokenSaleFirstThreeDays));
    }

    function setMainSaleFourthSeventhDaysMileStone(uint256 _startDate, uint256 _endDate) public onlyOwner canSetMileStones validDate(_startDate, _endDate){
        mileStones.push(Milestone(_startDate, _endDate, TriggmineLibrary.SaleStates.MainTokenSaleFourthSeventhDays));
    }

    function setMainSaleLastDaysMileStone(uint256 _startDate, uint256 _endDate) public onlyOwner canSetMileStones validDate(_startDate, _endDate){
        mainSaleEndDate = _endDate;
        mileStones.push(Milestone(_startDate, _endDate, TriggmineLibrary.SaleStates.MainTokenSaleLastDays));
    }

    function finishMileStonesSet() public onlyOwner{
        mileStonesSetIsFinished = true;
    }

    function getCurrentMileStone() public view returns (TriggmineLibrary.SaleStates) {
        TriggmineLibrary.SaleStates phase = TriggmineLibrary.SaleStates.Invalid;

        if (isEarlyInvestors()) {
            phase = TriggmineLibrary.SaleStates.EarlyInvestor;
        }
        else if (isPreSale()) {
            phase = getSaleMileStone();
        }
        else if (preSalePassed()) {
            phase = TriggmineLibrary.SaleStates.PreSaleFinished;
        }
        else if (isMainSale()) {
            phase = getSaleMileStone();
        }
        else if (mainSalePassed()) {
            phase = TriggmineLibrary.SaleStates.MainSaleFinished;
        }

        return phase;
    }

    function getSaleMileStone() private view returns (TriggmineLibrary.SaleStates) {
        require(isPreSale() || isMainSale());
        TriggmineLibrary.SaleStates mileStone = TriggmineLibrary.SaleStates.Invalid;
        uint256 length = mileStones.length;
        
        for (uint i = 0; i < length; i++) {
            if (mileStones[i].start <= now && now < mileStones[i].end) {
                mileStone = mileStones[i].state;
                break;
            }
        }

        return mileStone;
    }

    function isPreSale() public view returns (bool){
        return preSaleStartDate <= now && now < preSaleEndDate;
    }

    function isMainSale() public view returns (bool){
        return mainSaleStartDate <= now && now < mainSaleEndDate;
    }

    function preSalePassed() public view returns (bool){
        return preSaleEndDate <= now && now < mainSaleStartDate;
    }

    function mainSalePassed() public view returns (bool){
        return mainSaleEndDate < now;
    }

    function isEarlyInvestors() public view returns (bool){
        return now < preSaleStartDate;
    }
}

// File: zeppelin-solidity/contracts/crowdsale/RefundVault.sol

/**
 * @title RefundVault
 * @dev This contract is used for storing funds while a crowdsale
 * is in progress. Supports refunding the money if crowdsale fails,
 * and forwarding it if crowdsale is successful.
 */
contract RefundVault is Ownable {
  using SafeMath for uint256;

  enum State { Active, Refunding, Closed }

  mapping (address => uint256) public deposited;
  address public wallet;
  State public state;

  event Closed();
  event RefundsEnabled();
  event Refunded(address indexed beneficiary, uint256 weiAmount);

  function RefundVault(address _wallet) public {
    require(_wallet != address(0));
    wallet = _wallet;
    state = State.Active;
  }

  function deposit(address investor) onlyOwner public payable {
    require(state == State.Active);
    deposited[investor] = deposited[investor].add(msg.value);
  }

  function close() onlyOwner public {
    require(state == State.Active);
    state = State.Closed;
    Closed();
    wallet.transfer(this.balance);
  }

  function enableRefunds() onlyOwner public {
    require(state == State.Active);
    state = State.Refunding;
    RefundsEnabled();
  }

  function refund(address investor) public {
    require(state == State.Refunding);
    uint256 depositedValue = deposited[investor];
    deposited[investor] = 0;
    investor.transfer(depositedValue);
    Refunded(investor, depositedValue);
  }
}

// File: src\Crowdsale\TriggmineCrowdSale.sol

contract TriggmineCrowdSale is MileStoneCrowdSale {

    using SafeMath for uint256;

    /* Minimum contribution 0.1 ETH in Wei*/
    uint256 public constant MINIMUM_CONTRIBUTION = 1e17;

    /* Early investor bonus min limit 25 ETH*/
    uint256 public constant EARLY_INVESTOR_MINIMUM_LIMIT = 25e18;

    /* Early investor min bonus percent*/
    uint256 public constant EARLY_INVESTOR_MINIMUM_PERCENT = 25;

    /* Early investor bonus middle limit 50 ETH*/
    uint256 public constant EARLY_INVESTOR_MIDDLE_LIMIT = 50e18;

    /* Early investor middle bonus  percent*/
    uint256 public constant EARLY_INVESTOR_MIDDLE_PERCENT = 30;

    /* Early investor bonus max limit 100 ETH*/
    uint256 public constant EARLY_INVESTOR_MAX_LIMIT = 100e18;

    /* Early investor max bonus percent*/
    uint256 public constant EARLY_INVESTOR_MAX_PERCENT = 35;

    /* Price 10000 tokens for 1 ETH in Wei*/
    uint256 public constant PRICE = 10000;

    /* Number of available tokens 100 mlns * 10^18 */
    uint256 public constant AVAILABLE_TOKENS = 1e26;

    /* Advisory Team */
    address public constant addressAdvisoryTeam = 0x2af6CA36195B0362f1d8DEa008359E730300bfcA;
    uint256 public constant advisoryTeamPercent = 4;

    address public constant fixedAdviserAddress_1 = 0x02a6896761Ea44f8bB1cb34C1974943Fd6fF4dE3;
    address public constant fixedAdviserAddress_2 = 0xb38C4E537b5df930D65a74d043831d6b485bbDe4;
    uint256 public constant fixedAdviserPercent = 5; /*0.5%*/

    /* Owner Team */
    address public constant addressOwner = 0x7E83f1F82Ab7dDE49F620D2546BfFB0539058414;
    uint256 public constant ownerPercent = 20;

    /* Contributor Team */
    address public constant addressContributorTeam = 0xbcEDA850f52985CB2A5523aDF59498C7D16e9e8d;
    uint256 public constant contributorTeamPercent = 5;

    /* Reserve token */
    address public constant addressReserve = 0x4A4A0186AA50CF6Ff284b8527D6C933837444651;
    uint256 public constant reservePercent = 10;

    /* Transfer ETH Wallet */
    address public constant wallet = 0x2e9F22E2D559d9a5ce234AB722bc6e818FA5D079;

    /* Oracle Wallet. It is set after deploy */
    address public oracle;

    /* Soft Cap 500 ETH in Wei*/
    uint256 public constant softCap = 500e18;

    /* PreSale Hard Cap 1800 ETH in Wei*/
    uint256 public constant preSaleHardCap = 1800e18;

    /* MainSale Hard Cap 6000 ETH in Wei*/
    uint256 public constant mainSaleHardCap = 6000e18;

    address[] public investors;

    mapping(uint => uint) public bonusList;

    TriggmineToken public token;

    uint256 public weiRaised;

    uint256 public tokenRaised;

    mapping(address => uint) public usdInvestors;

    uint256 public cashToUsdRaised;

    uint256 public cashToWeiRaised;

    uint256 public cashToTokenRaised;

    mapping(address => uint) public btcInvestors;

    uint256 public btcToWeiRaised;

    uint256 public btcToTokenRaised;

    RefundVault public vault;

    bool public isFinalized = false;

    event Finalized();

    /**
     * event for token purchase logging
     * @param investor who got the tokens
     * @param tokensAmount weis paid for purchase
     * @param currencyAmount amount of tokens purchased
     * @param currency amount of currency
     */
    event TokenPurchase(address indexed investor, uint256 tokensAmount, uint256 currencyAmount, TriggmineLibrary.Currencies currency);

    modifier hasMinimumContribution(uint256 value) {
        require(value >= MINIMUM_CONTRIBUTION);
        _;
    }

    modifier realAddress(address addr) {
        require(addr != address(0));
        _;
    }

    modifier onlyOracle() {
        require(oracle == msg.sender);
        _;
    }

    modifier isPayablePhase(){
        TriggmineLibrary.SaleStates mileStone = getCurrentMileStone();

        require(TriggmineLibrary.SaleStates.Invalid != mileStone);
        require(TriggmineLibrary.SaleStates.PreSaleFinished != mileStone);
        require(TriggmineLibrary.SaleStates.MainSaleFinished != mileStone);
        if (isPreSale()) {
            require(!isPreSaleHardCapReached());
        }
        if (isMainSale()) {
            require(!isMainSaleHardCapReached());
        }
        _;
    }

    modifier tokensIsEnough(){
        require(tokenRaised <= AVAILABLE_TOKENS);
        _;
    }

    modifier nonZeroAmount(uint256 _amount){
        require(0 < _amount);
        _;
    }

    /*
        Contract owner address is `owner`. It is set after deploy
    */

    function TriggmineCrowdSale(address _token) public realAddress(_token) {
        initBonusList();
        vault = new RefundVault(wallet);
        token = TriggmineToken(_token);

     }

    function initBonusList() private {

        /*bonus in percents*/
        bonusList[uint(TriggmineLibrary.SaleStates.PreSaleFirstTwoDays)] = 20;
        bonusList[uint(TriggmineLibrary.SaleStates.PreSaleThirdDay)] = 19;
        bonusList[uint(TriggmineLibrary.SaleStates.PreSaleFourthDay)] = 18;
        bonusList[uint(TriggmineLibrary.SaleStates.PreSaleFifthDay)] = 17;
        bonusList[uint(TriggmineLibrary.SaleStates.PreSaleSixthDay)] = 16;
        bonusList[uint(TriggmineLibrary.SaleStates.PreSaleLastDays)] = 15;

        bonusList[uint(TriggmineLibrary.SaleStates.MainTokenSaleFirstThreeDays)] = 10;
        bonusList[uint(TriggmineLibrary.SaleStates.MainTokenSaleFourthSeventhDays)] = 5;
    }

    function investorsCount() public view returns (uint) {
        return investors.length;
    }

    // fallback function can be used to buy tokens
    function() external payable {
        buyTokens(msg.sender);
    }

    function buyTokens(address investor) public hasMinimumContribution(msg.value) realAddress(investor) isPayablePhase tokensIsEnough payable {
        uint256 weiAmount = msg.value;
        uint256 tokensAmount = calculateTokens(weiAmount);
        require(tokensAmount > 0);

        token.mint(investor, tokensAmount);
        increaseRaised(weiAmount, tokensAmount);

        if (vault.deposited(investor) == 0) {
            investors.push(investor);
        }
        // send ether to the fund collection wallet
        vault.deposit.value(weiAmount)(investor);
        TokenPurchase(investor, tokensAmount, weiAmount, TriggmineLibrary.Currencies.ETH);
    }

    function buyTokensForBtc(address investor, uint256 ethAmount, uint256 btcAmount)
    onlyOracle
    hasMinimumContribution(ethAmount)
    realAddress(investor)
    nonZeroAmount(ethAmount)
    nonZeroAmount(btcAmount)
    isPayablePhase
    tokensIsEnough
    public {
        require(!isFinalized);
        require(!isEnded());

        uint256 tokensAmount = calculateTokens(ethAmount);
        require(tokensAmount > 0);
        btcToTokenRaised = btcToTokenRaised.add(tokensAmount);
        btcToWeiRaised = btcToWeiRaised.add(ethAmount);

        token.mint(investor, tokensAmount);
        TokenPurchase(investor, tokensAmount, btcAmount, TriggmineLibrary.Currencies.BTC);
    }

    function buyTokensForCash(address investor, uint256 tokensAmount, uint256 ethAmount, uint256 usdAmount)
    onlyOwner
    realAddress(investor)
    nonZeroAmount(usdAmount)
    nonZeroAmount(ethAmount)
    nonZeroAmount(tokensAmount)
    tokensIsEnough
    public {
        require(!isFinalized);
        require(!isEnded());
        require(tokensAmount > 0);

        cashToTokenRaised = cashToTokenRaised.add(tokensAmount);
        cashToUsdRaised = cashToUsdRaised.add(usdAmount);
        cashToWeiRaised = cashToWeiRaised.add(ethAmount);

        token.mint(investor, tokensAmount);
        TokenPurchase(investor, tokensAmount, usdAmount, TriggmineLibrary.Currencies.USD);
    }

    function getBonus(uint256 weiAmount) public view returns (uint){
        TriggmineLibrary.SaleStates mileStone = getCurrentMileStone();

        require(mileStone != TriggmineLibrary.SaleStates.Invalid);
        require(mileStone != TriggmineLibrary.SaleStates.MainSaleFinished);
        require(mileStone != TriggmineLibrary.SaleStates.PreSaleFinished);

        if(mileStone == TriggmineLibrary.SaleStates.EarlyInvestor){
            return getEarlyInvestorBonus(weiAmount);
        }

        return bonusList[uint(mileStone)];
    }

    function calculateTokens(uint256 weiAmount) internal view returns (uint256) {
        uint bonus = getBonus(weiAmount);

        uint256 tokensAmount = weiAmount.mul(PRICE);
        if(bonus > 0){
            tokensAmount = tokensAmount.add(tokensAmount.mul(bonus).div(100));
        }
        return tokensAmount;
    }

    function setOracle(address _oracle) public realAddress(_oracle) onlyOwner {
        oracle = _oracle;
    }

    function increaseRaised(uint256 weiAmount, uint256 tokensAmount) internal {
        weiRaised = weiRaised.add(weiAmount);
        tokenRaised = tokenRaised.add(tokensAmount);
    }

    function finalize() onlyOwner public {
        require(!isFinalized);
        require(isEnded());

        if (isSoftCapReached()) {
            setSpecialRoleBonus(addressOwner, ownerPercent, 100);
            setSpecialRoleBonus(addressAdvisoryTeam, advisoryTeamPercent, 100);
            setSpecialRoleBonus(fixedAdviserAddress_1, fixedAdviserPercent, 1000); /*0.5% divisor is 1000 !!!!*/
            setSpecialRoleBonus(fixedAdviserAddress_2, fixedAdviserPercent, 1000); /*0.5% divisor is 1000 !!!!*/
            setSpecialRoleBonus(addressContributorTeam, contributorTeamPercent, 100);
            setSpecialRoleBonus(addressReserve, reservePercent, 100);
            vault.close();
        }
        else {
            vault.enableRefunds();
        }

        token.finishMinting();
        token.transferOwnership(owner);

        isFinalized = true;
        Finalized();
    }

    function isEnded() public view returns (bool){
        TriggmineLibrary.SaleStates mileStone = getCurrentMileStone();
        return isMainSaleHardCapReached() || mileStone == TriggmineLibrary.SaleStates.MainSaleFinished;
    }

    // if crowdsale is unsuccessful, investors can claim refunds here
    function claimRefund() public {
        require(isFinalized);
        require(!isSoftCapReached());

        vault.refund(msg.sender);
    }

    function refund() onlyOwner public {
        require(isFinalized);
        require(!isSoftCapReached());

        for (uint i = 0; i < investors.length; i++) {
            address investor = investors[i];
            if (vault.deposited(investor) != 0) {
                vault.refund(investor);
            }
        }
    }

    function destroy() onlyOwner public {
        require(isFinalized);
        require(vault.balance == 0);
        selfdestruct(wallet);
    }

    function isPreSaleHardCapReached() public view returns (bool){
        return getWeiRaised() >= preSaleHardCap;
    }

    function isMainSaleHardCapReached() public view returns (bool){
        uint256 total = preSaleHardCap.add(mainSaleHardCap);
        return getWeiRaised() >= total;
    }

    function isSoftCapReached() public view returns (bool){
        return getWeiRaised() >= softCap;
    }

    function getWeiRaised() public view returns (uint256) {
        return weiRaised.add(cashToWeiRaised.add(btcToWeiRaised));
    }

    function getTokenRaised() public view returns (uint256) {
        return tokenRaised.add(cashToTokenRaised.add(btcToTokenRaised));
    }

    function getTokenAmountByWallet(address addr) public view returns (uint256) {
        return token.balanceOf(addr);
    }

    function getTokenOwner() public view returns (address) {
        return address(token.owner);
    }

    function setSpecialRoleBonus(address roleAddress, uint256 bonus, uint256 divisor) realAddress(roleAddress) internal{
        require(!isFinalized);
        require(isEnded());
        require(bonus > 0);
        require(divisor > 0);

        uint256 totalSupply = getTokenRaised().mul(100).div(60);
        uint256 tokensAmount = totalSupply.mul(bonus).div(divisor);
        token.mint(roleAddress, tokensAmount);
        TokenPurchase(roleAddress, tokensAmount, bonus, TriggmineLibrary.Currencies.NONE);
    }

    function getEarlyInvestorBonus(uint256 weiAmount) public pure returns (uint256){
        uint256 bonus = 0;

        if(EARLY_INVESTOR_MINIMUM_LIMIT <= weiAmount && weiAmount < EARLY_INVESTOR_MIDDLE_LIMIT){
            bonus = EARLY_INVESTOR_MINIMUM_PERCENT;
        }else if(EARLY_INVESTOR_MIDDLE_LIMIT <= weiAmount && weiAmount < EARLY_INVESTOR_MAX_LIMIT){
            bonus = EARLY_INVESTOR_MIDDLE_PERCENT;
        }else if(weiAmount >= EARLY_INVESTOR_MAX_LIMIT){
            bonus = EARLY_INVESTOR_MAX_PERCENT;
        }

        return bonus;
    }

}
