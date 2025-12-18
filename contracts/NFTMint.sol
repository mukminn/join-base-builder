// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title NFTMint
 * @notice ERC-721 NFT contract with public minting on Base
 * @dev Max supply, mint price, and owner withdraw functionality
 */
contract NFTMint is ERC721URIStorage, Ownable, Pausable, ReentrancyGuard {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    
    uint256 public constant MAX_SUPPLY = 10000;
    uint256 public constant MINT_PRICE = 0.001 ether;
    
    uint256 public totalMinted;
    mapping(address => uint256) public mintedByAddress;

    event NFTMinted(address indexed to, uint256 indexed tokenId, uint256 timestamp);
    event WithdrawETH(address indexed owner, uint256 amount, uint256 timestamp);

    constructor(address _owner) ERC721("Base Mini App NFT", "BMANFT") Ownable(_owner) {}

    /**
     * @notice Mint NFT to caller
     * @param tokenURI Metadata URI for the NFT
     */
    function mint(string memory tokenURI) external payable whenNotPaused nonReentrant {
        require(msg.value >= MINT_PRICE, "NFTMint: Insufficient payment");
        require(totalMinted < MAX_SUPPLY, "NFTMint: Max supply reached");
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        totalMinted++;
        mintedByAddress[msg.sender]++;

        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);

        // Refund excess payment
        if (msg.value > MINT_PRICE) {
            (bool refundSuccess, ) = payable(msg.sender).call{value: msg.value - MINT_PRICE}("");
            require(refundSuccess, "NFTMint: Refund failed");
        }

        emit NFTMinted(msg.sender, tokenId, block.timestamp);
    }

    /**
     * @notice Owner withdraw ETH from contract
     */
    function withdrawETH() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "NFTMint: No balance to withdraw");

        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "NFTMint: Withdraw failed");

        emit WithdrawETH(owner(), balance, block.timestamp);
    }

    /**
     * @notice Pause minting
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Unpause minting
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @notice Get total supply
     */
    function totalSupply() external view returns (uint256) {
        return totalMinted;
    }

    /**
     * @notice Get remaining supply
     */
    function remainingSupply() external view returns (uint256) {
        return MAX_SUPPLY - totalMinted;
    }

    /**
     * @notice Get user's minted count
     */
    function getUserMintCount(address user) external view returns (uint256) {
        return mintedByAddress[user];
    }
}
