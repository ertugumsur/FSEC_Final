// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract ReentrancyBank {

    // Creating a balance sheet for each account
    mapping(address => uint256) public accounts;

    // Deposit money into the bank
    function deposit() external payable {
        accounts[msg.sender] += msg.value;
    }

    // Take the money out of the bank
    function withdraw(uint256 _number) external {
        require(accounts[msg.sender] >= _number, "Need More Funds!!");

        // MAke the transfer
        (bool success, ) = msg.sender.call{value: _number, gas: 300000}(""); //High gas because I was having some transfer issues
        require(success, "Can't send the money");

        // Update contract's inner balance sheet
        //I'm using unchecked because any version above 0.8.0 has bound checks that prevents this reentrancy attack
        unchecked {accounts[msg.sender] -= _number;}
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
