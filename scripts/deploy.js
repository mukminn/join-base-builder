const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());
  
  // Deploy FeeGenerator
  console.log("\nDeploying FeeGenerator contract...");
  const FeeGenerator = await hre.ethers.getContractFactory("FeeGenerator");
  const feeGenerator = await FeeGenerator.deploy();
  await feeGenerator.waitForDeployment();
  const feeGeneratorAddress = await feeGenerator.getAddress();
  console.log("FeeGenerator deployed to:", feeGeneratorAddress);
  
  // Deploy SimpleNFT
  console.log("\nDeploying SimpleNFT contract...");
  const SimpleNFT = await hre.ethers.getContractFactory("SimpleNFT");
  const simpleNFT = await SimpleNFT.deploy();
  await simpleNFT.waitForDeployment();
  const simpleNFTAddress = await simpleNFT.getAddress();
  console.log("SimpleNFT deployed to:", simpleNFTAddress);
  
  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    chainId: (await hre.ethers.provider.getNetwork()).chainId,
    deployer: deployer.address,
    contracts: {
      FeeGenerator: feeGeneratorAddress,
      SimpleNFT: simpleNFTAddress,
    },
    timestamp: new Date().toISOString(),
  };
  
  console.log("\n=== Deployment Summary ===");
  console.log(JSON.stringify(deploymentInfo, null, 2));
  
  // Verify contracts on Basescan (if API key is set)
  if (hre.network.name === "base" || hre.network.name === "baseSepolia") {
    console.log("\nWaiting for block confirmations...");
    await new Promise(resolve => setTimeout(resolve, 30000));
    
    try {
      console.log("Verifying FeeGenerator...");
      await hre.run("verify:verify", {
        address: feeGeneratorAddress,
        constructorArguments: [],
      });
    } catch (error) {
      console.log("Verification failed:", error.message);
    }
    
    try {
      console.log("Verifying SimpleNFT...");
      await hre.run("verify:verify", {
        address: simpleNFTAddress,
        constructorArguments: [],
      });
    } catch (error) {
      console.log("Verification failed:", error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
