const hre = require("hardhat");
const { ethers } = require("hardhat");

/**
 * Script untuk interact dengan deployed contracts
 * Update CONTRACT_ADDRESSES dengan addresses dari deployment
 */

const CONTRACT_ADDRESSES = {
  feeGenerator: "0x...", // Update dengan deployed address
  simpleNFT: "0x...",   // Update dengan deployed address
};

async function main() {
  const [signer] = await hre.ethers.getSigners();
  console.log("Interacting with contracts using account:", signer.address);
  console.log("Account balance:", ethers.formatEther(await hre.ethers.provider.getBalance(signer.address)), "ETH");

  // Get contracts
  const FeeGenerator = await hre.ethers.getContractAt(
    "FeeGenerator",
    CONTRACT_ADDRESSES.feeGenerator,
    signer
  );

  const SimpleNFT = await hre.ethers.getContractAt(
    "SimpleNFT",
    CONTRACT_ADDRESSES.simpleNFT,
    signer
  );

  console.log("\n=== Contract Stats ===");
  
  // Fee Generator Stats
  const feeStats = await FeeGenerator.getStats();
  console.log("Fee Generator:");
  console.log("  Total Fees Generated:", ethers.formatEther(feeStats[0]), "ETH");
  console.log("  Total Deposits:", ethers.formatEther(feeStats[1]), "ETH");
  console.log("  Total Withdrawals:", ethers.formatEther(feeStats[2]), "ETH");
  console.log("  Contract Balance:", ethers.formatEther(feeStats[3]), "ETH");

  // User Balance
  const userBalance = await FeeGenerator.getBalance();
  console.log("  Your Balance:", ethers.formatEther(userBalance), "ETH");

  // NFT Stats
  const nftFees = await SimpleNFT.getTotalFees();
  console.log("\nSimpleNFT:");
  console.log("  Total Fees Generated:", ethers.formatEther(nftFees), "ETH");

  // Example: Deposit
  console.log("\n=== Example: Deposit 0.01 ETH ===");
  try {
    const depositAmount = ethers.parseEther("0.01");
    console.log("Depositing...");
    const tx = await FeeGenerator.deposit({ value: depositAmount });
    console.log("Transaction hash:", tx.hash);
    await tx.wait();
    console.log("✅ Deposit successful!");
    
    // Check new balance
    const newBalance = await FeeGenerator.getBalance();
    console.log("New balance:", ethers.formatEther(newBalance), "ETH");
  } catch (error) {
    console.log("❌ Deposit failed:", error.message);
  }

  // Example: Mint NFT
  console.log("\n=== Example: Mint NFT ===");
  try {
    const mintPrice = ethers.parseEther("0.001");
    const tokenURI = "https://example.com/metadata.json";
    console.log("Minting NFT...");
    const tx = await SimpleNFT.mintNFT(tokenURI, { value: mintPrice });
    console.log("Transaction hash:", tx.hash);
    await tx.wait();
    console.log("✅ NFT minted successfully!");
  } catch (error) {
    console.log("❌ Mint failed:", error.message);
  }

  // Final stats
  console.log("\n=== Final Stats ===");
  const finalStats = await FeeGenerator.getStats();
  console.log("Total Fees Generated:", ethers.formatEther(finalStats[0]), "ETH");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
