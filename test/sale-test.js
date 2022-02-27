const { assert, expect } = require("chai");
const { ethers, waffle } = require("hardhat");

describe("NFTsale", async function () {
    let owner, user1, user2;
    let arr = new Array(100);

    for (let i = 0; i <= 100; i++) {
        arr[i] = "user" + "i";
    }

    beforeEach("Deploy contract", async function() {
        [owner, user1, user2, arr] = await ethers.getSigners();
        NFTsale = await ethers.getContractFactory("NFTsale");
        nft = await NFTsale.deploy("NFTsale", "NFT");
        await nft.deployed();
    });

    describe("The correct deployment", async function () {
        it("Name and symbol", async function () {
            await expect(await nft.name()).to.equal("NFTsale");
            await expect(await nft.symbol()).to.equal("NFT");
        });
    });

    describe("Presale, mint", async function () {
        it("The contract owner cannot participate in sales", async function () {
            await expect(nft.connect(owner).mint(1, {value: ethers.utils.parseEther("1.0")})).to.be.reverted;
        });

        it("Need to mint at least 1 NFT", async function () {
            await expect(nft.connect(user1).mint(0)).to.be.reverted;
        });

        it("Max mint amount per address exceeded", async function () {
            await expect(nft.connect(user1).mint(4, {value: ethers.utils.parseEther("1.0")})).to.be.reverted;
        });

        // it("Max NFT limit exceeded", async function () {
        //     // 100 адресов всего могут участвовать * 3 NFT получается 300, что меньше 1000
        // });

        it("Insufficient funds", async function () {
            await expect(nft.connect(user1).mint(2, {value: ethers.utils.parseEther("0.1")})).to.be.reverted;
        });

        it("More than 100 addresses", async function () {
            for(let i = 0; i < arr.length; i++) {
                await nft.connect(arr[i]).mint(3, {value: ethers.utils.parseEther("1.0")});
            }
            //await expect(await nft.totalSupply()).to.equal(300);
        });

        it("Mint", async function () {
            const provider = waffle.provider;
            const balance = await provider.getBalance(nft.address);
            await expect(balance).to.equal(0);
            await expect(await nft.alreadyMintedPresale(user1.address)).to.equal(false);
            await expect(await nft.presaleAddresses()).to.equal(0);
            await nft.connect(user1).mint(2, {value: ethers.utils.parseEther("1.0")});
            await expect(await nft.alreadyMintedPresale(user1.address)).to.equal(true);
            await expect(await nft.presaleAddresses()).to.equal(1);
            console.log(balance)
            //await expect(balance).to.equal(0.88);
            await expect(await nft.totalSupply()).to.equal(2);
            await expect(await nft.balanceOf(user1.address)).to.equal(2);

            await nft.connect(user1).mint(1, {value: ethers.utils.parseEther("1.0")});
            await expect(await nft.alreadyMintedPresale(user1.address)).to.equal(true);
            await expect(await nft.presaleAddresses()).to.equal(1);
            await expect(await nft.totalSupply()).to.equal(3);
            await expect(await nft.balanceOf(user1.address)).to.equal(3);
        });
    });

    describe("Presale, mint", async function () {
        beforeEach("2 days", async function () {
            await network.provider.send("evm_increaseTime", [172800]);
        });

        it("Need to mint at least 1 NFT", async function () {
            await expect(nft.connect(user1).mint(0)).to.be.reverted;
        });

        it("Max mint amount per session exceeded", async function () {
            await expect(nft.connect(user1).mint(11, {value: ethers.utils.parseEther("1.0")})).to.be.reverted;
        });

        // it("Max NFT limit exceeded", async function () {
            
        //     await expect(nft.connect(user1).mint(2, {value: ethers.utils.parseEther("1.0")})).to.be.reverted; 
        // });

        it("Insufficient funds", async function () {
            await expect(nft.connect(user1).mint(2, {value: ethers.utils.parseEther("0.1")})).to.be.reverted;
        });

        // it("More than 100 addresses", async function () {
            
        // });

        it("Mint", async function () {
            //const decimalPlaces = 18;
            const provider = waffle.provider;
            const balance = await provider.getBalance(nft.address);
            await expect(balance).to.equal(0);
            //await nft.connect(user1).mint(5, {value: ethers.utils.parseUnits('1.0', decimalPlaces)});
            await nft.connect(user1).mint(5, {value: ethers.utils.parseEther("1.0")});
            console.log(balance)
            //await expect(balance).to.equal({value: ethers.utils.parseUnits('0.88', decimalPlaces)});
            //await expect(balance).to.equal({value: ethers.utils.parseEther("0.88")});
            await expect(await nft.totalSupply()).to.equal(5);
            await expect(await nft.balanceOf(user1.address)).to.equal(5);  
        });
    });

    describe("Airdrop", async function () {
        it("Not owner", async function () {
            await expect(nft.connect(user1).airdrop([user1.address, user2.address])).to.be.reverted;
        });

        it("Only 100 users", async function () {
            await expect(nft.airdrop([user1.address, user2.address])).to.be.reverted;
        });

        it("Airdrop", async function () {

        });
    });

    describe("withdraw", async function () {
        it("No the owner withdraws", async function () {
            await expect(nft.connect(user1).withdraw(user2.address)).to.be.reverted;
        });

        it("to is 0x0", async function () {
            await expect(nft.withdraw(ethers.constants.AddressZero)).to.be.reverted;
        });

        it("The owner withdraws", async function () {
            await network.provider.send("evm_increaseTime", [172800]);
            await nft.connect(user1).mint(10, {value: ethers.utils.parseEther("1.0")});

            const provider = waffle.provider;
            const balanceBefore = await provider.getBalance(nft.address);
            //await expect(balanceBefore).to.equal({value: ethers.utils.parseEther("0.7")});

            //await nft.withdraw(user2.address, 700000);
            //const balanceAfter = await provider.getBalance(nft.address);
            //await expect(balanceAfter).to.equal(700000);
        });
    });
});