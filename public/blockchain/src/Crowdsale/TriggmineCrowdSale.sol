pragma solidity 0.4.18;


import "zeppelin-solidity/contracts/math/SafeMath.sol";
import 'zeppelin-solidity/contracts/crowdsale/RefundVault.sol';
import "../Token/TriggmineToken.sol";
import "../Common/TriggmineLibrary.sol";
import "./MileStoneCrowdSale.sol";


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
