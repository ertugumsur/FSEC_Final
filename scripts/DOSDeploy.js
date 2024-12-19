const { ethers } = require("hardhat");

async function main() {
    // Get 2 accounts one for the bank, one for the cheater
    const [user1, user2, cheaterAdd] = await ethers.getSigners();

    // Deploy the Auction contract
    const Auction = await ethers.getContractFactory("Auction");
    const auction = await Auction.deploy();
    await auction.waitForDeployment();

    console.log("Auction address:", await auction.getAddress());

    // DEploy the cheater contract
    const Cheater = await ethers.getContractFactory("Cheater");
    const cheater = await Cheater.deploy(await auction.getAddress());
    await cheater.waitForDeployment();

    console.log("Cheater contract address:", await  cheater.getAddress());

    // User1 bids in the Auction
    await auction.connect(user1).bid({ value: ethers.parseEther("1") });
    console.log("User1 has deposited 1 ETH into the Auction");

    console.log("The highest bidder is:", await auction.highestbidder());

    // User2 bids in the Auction
    await auction.connect(user2).bid({ value: ethers.parseEther("3") });
    console.log("User2 has deposited 3 ETH into the Auction");

    // Cheater bids in the Auction
    await cheater.connect(cheaterAdd).cheat({ value: ethers.parseEther("4") });
    console.log("Cheater has deposited 4 ETH into the Auction");

    console.log("The highest bidder is:", await auction.highestbidder());

    // User1 tries to reraise
    console.log("User1 tries to raise to 8 ETH");
    try {
        await auction.connect(user1).bid({ value: ethers.parseEther("8") });
    } 
    catch (error) {
        console.log(error.message);
    }
    console.log("The highest bidder is:", await auction.highestbidder());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
