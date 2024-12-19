// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract IOUBank {

    // Creating a balance sheet for each account
    mapping(address => uint8) public accounts;

    // Deposit money into the bank
    function deposit() external payable {
        accounts[msg.sender] += uint8(msg.value);
    }

    // Take the money out of the bank
    function withdraw(uint8 _number) external {
        require(accounts[msg.sender] >= _number, "Need More Funds!!");

        // Update contract's inner balance sheet
        accounts[msg.sender] -= _number;

        // MAke the transfer
        (bool success, ) = msg.sender.call{value: _number, gas: 300000}(""); //High gas because I was having some transfer issues
        require(success, "Can't send the money");

    }

    // Total Money in the Bank
    function getTotalBalance() public view returns (uint256) {
        return address(this).balance;
    }

    //User's Balance
    function getUserBalance(address _called) public view returns (uint256) {
        return accounts[_called];
    }
}
