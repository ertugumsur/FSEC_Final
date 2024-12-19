// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;


contract Auction {

    address public highestbidder;
    uint256 public highestprice;

    function bid() external payable {
        require(msg.value > highestprice, "Need to pay more than the highest bidder!!");

        (bool sent,) = highestbidder.call{value: highestprice}("");
        require(sent, "Failed to send the money back");

        highestprice = msg.value;
        highestbidder = msg.sender;
    }
}