const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Reentrancy Attack", function () {
    let VulnerableBank, vulnerableBank, Attacker, attacker, owner, user;

    beforeEach(async function () {
        [owner, user, attackerSigner] = await ethers.getSigners();

        // Deploy the VulnerableBank contract
        VulnerableBank = await ethers.getContractFactory("VulnerableBank");
        vulnerableBank = await VulnerableBank.deploy();
        await vulnerableBank.waitForDeployment();

        // Deploy the Attacker contract
        Attacker = await ethers.getContractFactory("Attacker");
        attacker = await Attacker.deploy(await vulnerableBank.getAddress()); // Use `address` instead of `getAddress`
        await attacker.waitForDeployment();
    });

    it("Should drain funds from VulnerableBank using reentrancy", async function () {
        // Owner deposits 10 ETH into the bank
        await vulnerableBank.connect(owner).deposit({ value: ethers.parseEther("100") });

        // Check initial bank balance
        expect(await ethers.provider.getBalance(await vulnerableBank.getAddress())).to.equal(ethers.parseEther("10"));

        // Attacker deposits 1 ETH into the bank and triggers the attack
        await attacker.connect(attackerSigner).attack({ value: ethers.parseEther("1") });

        // Check the bank balance after attack
        expect(await ethers.provider.getBalance(await vulnerableBank.getAddress())).to.equal(0);

        // Check the attacker's balance after the attack
        const attackerBalance = await ethers.provider.getBalance(await attacker.getAddress());
        expect(attackerBalance).to.be.gte(ethers.parseEther("10"));
    });
});
