// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTsale is ERC721Enumerable, Ownable {
  uint256 public costPresale = 0.06 ether;
  uint256 public costPublic = 0.07 ether;
  uint256 public maxSupplyPresale = 1000;
  uint256 public maxSupply = 5000;
  uint256 public maxMintAmountPresale = 3; 
  uint256 public maxMintAmountPublic = 10; 
  uint256 public beginning;
  uint256 public presaleAddresses = 0;

  mapping(address => bool) public alreadyMintedPresale;
  mapping(address => uint256) public addressMintedBalance;

  event Withdraw(address to, uint256 amount);

  constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {
    beginning = block.timestamp;
  }

  function mint(uint256 _mintAmount) public payable {
    require(msg.sender != owner(),"The contract owner cannot participate in sales");
    if(block.timestamp < 2 days + beginning) {
      uint256 supply = totalSupply();
      require(_mintAmount > 0, "Need to mint at least 1 NFT");
      require(addressMintedBalance[msg.sender] + _mintAmount <= maxMintAmountPresale, "Max mint amount per address exceeded"); 
      require(supply + _mintAmount <= maxSupplyPresale, "Max NFT limit exceeded");
      require(msg.value >= costPresale * _mintAmount, "Insufficient funds");
      require(presaleAddresses < 100, "More than 100 addresses");
      
      for (uint256 i = 1; i <= _mintAmount; i++) {
        addressMintedBalance[msg.sender]++;
        _safeMint(msg.sender, supply + i);
      }
      if(msg.value > costPublic * _mintAmount)
        payable(msg.sender).transfer(msg.value - (costPresale * _mintAmount)); 

      if(!alreadyMintedPresale[msg.sender] == true) 
        presaleAddresses += 1;
        alreadyMintedPresale[msg.sender] = true;
    } else {
      uint256 supply = totalSupply();
      require(_mintAmount > 0, "Need to mint at least 1 NFT");
      require(_mintAmount <= maxMintAmountPublic, "Max mint amount per session exceeded"); 
      require(supply + _mintAmount <= maxSupply, "Max NFT limit exceeded");
      require(msg.value >= costPublic * _mintAmount, "Insufficient funds");

      for (uint256 i = 1; i <= _mintAmount; i++) {
        addressMintedBalance[msg.sender]++;
        _safeMint(msg.sender, supply + i);
      }
      if(msg.value > costPublic * _mintAmount)
        payable(msg.sender).transfer(msg.value - (costPublic * _mintAmount)); 
    }
  }

  function airdrop(address[] memory _users) public onlyOwner {
    require(_users.length == 100, "Only 100 users");
    uint256 supply = totalSupply();
      for (uint256 i = 0; i < _users.length; i++) {
        addressMintedBalance[_users[i]]++;
        _safeMint(_users[i], supply + i);
      }
  }
 
  function withdraw(address to, uint256 amount) public onlyOwner {
        require(to != address(0), "Wrong address");
        payable(to).transfer(amount);

        emit Withdraw(to, amount);
    }
}