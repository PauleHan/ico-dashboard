pragma solidity 0.4.18;


import "zeppelin-solidity/contracts/math/SafeMath.sol";
import "../Common/TriggmineLibrary.sol";


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
