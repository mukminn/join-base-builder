// Configuration file untuk Mini App
// Update contract addresses setelah deployment

const CONFIG = {
    // Contract addresses - Update setelah deploy
    contracts: {
        feeGenerator: "0x33b5b0136bD1812E644eBC089af88706C9A3815d", // FeeGenerator deployed address
        simpleNFT: "0x..."     // Update dengan deployed SimpleNFT address (jika sudah deploy)
    },
    
    // Network configuration
    networks: {
        base: {
            chainId: 8453,
            name: "Base",
            rpcUrl: "https://mainnet.base.org",
            explorer: "https://basescan.org"
        },
        baseSepolia: {
            chainId: 84532,
            name: "Base Sepolia",
            rpcUrl: "https://sepolia.base.org",
            explorer: "https://sepolia.basescan.org"
        }
    },
    
    // App configuration
    app: {
        name: "Base Builders December",
        version: "1.0.0",
        refreshInterval: 30000 // 30 seconds
    },
    
    // Fee configuration
    fees: {
        minDeposit: "0.001", // Minimum deposit in ETH
        nftMintPrice: "0.001", // NFT mint price in ETH
        feePercentage: 2 // 2% fee
    }
};

// Export untuk use di app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
