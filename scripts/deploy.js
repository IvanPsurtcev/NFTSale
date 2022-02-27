const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log(`Deploying contract with the account: ${deployer.address}`);

    const NFT = await ethers.getContractFactory('NFTsale');
    const nft = await NFT.deploy("NFTsale", "NFT");
    console.log(`NFTsale address: ${nft.address}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });