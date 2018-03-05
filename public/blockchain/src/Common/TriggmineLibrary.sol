pragma solidity ^0.4.0;

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
