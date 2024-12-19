const { ethers } = require("hardhat");

    
async function main() {
    const [user1] = await ethers.getSigners();

    const IOUBank = await ethers.getContractFactory("IOUBank");
    const iouBank = await IOUBank.deploy();
    await iouBank.waitForDeployment();
    console.log("IOUBank deployed to:",await iouBank.getAddress());

    // Deposit more than 255 wei into the account (will overflow)
    await iouBank.connect(user1).deposit({ value: ethers.parseEther("1") }); // This will cause an overflow in uint8
    console.log("User1 has deposited 1 ETH");

    const balance = await iouBank.getUserBalance(await user1.getAddress());
    console.log("User1's balance (in uint8):", balance.toString()); // Should overflow, and print a very low number
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });