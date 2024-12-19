const { ethers } = require("hardhat");

async function main() {
    // Get 2 accounts one for the bank, one for the attacker
    const [owner, attackerAdd] = await ethers.getSigners();

    // Deploy the vulnerable contract
    const ReentrancyBank = await ethers.getContractFactory("ReentrancyBank");
    const reentrancyBank = await ReentrancyBank.deploy();
    await reentrancyBank.waitForDeployment();

    console.log("ReentrancyBank address:", await reentrancyBank.getAddress());

    // DEploy the attacker contract
    const Attacker = await ethers.getContractFactory("Attacker");
    const attacker = await Attacker.deploy(await reentrancyBank.getAddress());
    await attacker.waitForDeployment();

    console.log("Attacker contract address:", await  attacker.getAddress());

    // Owner deposits money to the bank
    await reentrancyBank.connect(owner).deposit({ value: ethers.parseEther("10") });
    console.log("Owner has deposited 10 ETH into ReentrancyBank");

    // Checking BAnk Balance
    const bankBalance1 = await ethers.provider.getBalance(reentrancyBank.getAddress());
    console.log("ReentrancyBank balance before the attack:", ethers.formatEther(bankBalance1));

    // Checking Attacker Balance
    const attackerBalance1 = await ethers.provider.getBalance(attacker.getAddress());
    console.log("Attacker balance before the attack:", ethers.formatEther(attackerBalance1));

    // Initiate the attack
    await attacker.connect(attackerAdd).attack({ value: ethers.parseEther("1") });
    console.log("Reentrancy attack executed by Attacker");

    // Checking BAnk Balance
    const bankBalance = await ethers.provider.getBalance(reentrancyBank.getAddress());
    console.log("ReentrancyBank balance after the attack:", ethers.formatEther(bankBalance));

    // Checking Attacker Balance
    const attackerBalance = await ethers.provider.getBalance(attacker.getAddress());
    console.log("Attacker balance after the attack:", ethers.formatEther(attackerBalance));
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });