// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title SimpleNFT
 * @notice NFT contract yang menghasilkan fees untuk Base Builders December
 * @dev Mint NFT dengan fee untuk generate transaction fees
 */
contract SimpleNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    uint256 public constant MINT_PRICE = 0.001 ether; // Fee untuk mint
    uint256 public totalFeesGenerated;
    
    event NFTMinted(address indexed to, uint256 indexed tokenId, uint256 fee);
    
    constructor() ERC721("BaseBuildersNFT", "BBNFT") Ownable(msg.sender) {}
    
    /**
     * @notice Mint NFT dengan fee
     * @dev Fee akan ditambahkan ke totalFeesGenerated
     */
    function mintNFT(string memory tokenURI) external payable {
        require(msg.value >= MINT_PRICE, "Insufficient payment");
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        totalFeesGenerated += msg.value;
        
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        emit NFTMinted(msg.sender, tokenId, msg.value);
    }
    
    /**
     * @notice Batch mint multiple NFTs
     */
    function batchMint(string[] memory tokenURIs) external payable {
        require(msg.value >= MINT_PRICE * tokenURIs.length, "Insufficient payment");
        
        totalFeesGenerated += msg.value;
        
        for (uint256 i = 0; i < tokenURIs.length; i++) {
            uint256 tokenId = _tokenIdCounter.current();
            _tokenIdCounter.increment();
            _safeMint(msg.sender, tokenId);
            _setTokenURI(tokenId, tokenURIs[i]);
            emit NFTMinted(msg.sender, tokenId, MINT_PRICE);
        }
    }
    
    /**
     * @notice Get total fees generated
     */
    function getTotalFees() external view returns (uint256) {
        return totalFeesGenerated;
    }
    
    /**
     * @notice Owner can withdraw fees
     */
    function withdrawFees() external onlyOwner {
        uint256 amount = address(this).balance;
        require(amount > 0, "No fees to withdraw");
        
        (bool success, ) = owner().call{value: amount}("");
        require(success, "Transfer failed");
    }
    
    // Override required functions
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
