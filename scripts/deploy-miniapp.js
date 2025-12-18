#!/usr/bin/env node

/**
 * Deploy Mini App Script
 * 1. Deploy smart contracts to Base
 * 2. Update contract addresses in .env
 * 3. Build Next.js app
 * 4. Deploy to Vercel
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Mini App deployment...\n');

// Step 1: Deploy contracts
console.log('📝 Step 1: Deploying smart contracts to Base...');
try {
  execSync('forge script script/Deploy.s.sol:DeployScript --rpc-url https://mainnet.base.org --broadcast --verify', {
    stdio: 'inherit',
    env: { ...process.env, PRIVATE_KEY: process.env.PRIVATE_KEY }
  });
  console.log('✅ Contracts deployed!\n');
} catch (error) {
  console.error('❌ Contract deployment failed:', error.message);
  process.exit(1);
}

// Step 2: Extract contract addresses from broadcast
console.log('📝 Step 2: Extracting contract addresses...');
try {
  const broadcastPath = path.join(__dirname, '../broadcast/Deploy.s.sol/8453/run-latest.json');
  const broadcast = JSON.parse(fs.readFileSync(broadcastPath, 'utf8'));
  
  const ethVaultAddress = broadcast.transactions.find(t => 
    t.contractName === 'ETHVault'
  )?.contractAddress;
  
  const nftMintAddress = broadcast.transactions.find(t => 
    t.contractName === 'NFTMint'
  )?.contractAddress;

  if (!ethVaultAddress || !nftMintAddress) {
    throw new Error('Could not find contract addresses in broadcast');
  }

  // Step 3: Update .env.local
  console.log('📝 Step 3: Updating .env.local...');
  const envPath = path.join(__dirname, '../.env.local');
  let envContent = '';
  
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }

  // Update or add contract addresses
  envContent = envContent.replace(
    /NEXT_PUBLIC_ETHVAULT_ADDRESS=.*/g,
    `NEXT_PUBLIC_ETHVAULT_ADDRESS=${ethVaultAddress}`
  );
  envContent = envContent.replace(
    /NEXT_PUBLIC_NFTMINT_ADDRESS=.*/g,
    `NEXT_PUBLIC_NFTMINT_ADDRESS=${nftMintAddress}`
  );

  if (!envContent.includes('NEXT_PUBLIC_ETHVAULT_ADDRESS')) {
    envContent += `\nNEXT_PUBLIC_ETHVAULT_ADDRESS=${ethVaultAddress}`;
  }
  if (!envContent.includes('NEXT_PUBLIC_NFTMINT_ADDRESS')) {
    envContent += `\nNEXT_PUBLIC_NFTMINT_ADDRESS=${nftMintAddress}`;
  }

  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env.local updated!\n');

  // Step 4: Build Next.js
  console.log('📝 Step 4: Building Next.js app...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build complete!\n');

  // Step 5: Deploy to Vercel
  console.log('📝 Step 5: Deploying to Vercel...');
  execSync('vercel --prod --yes', { stdio: 'inherit' });
  console.log('✅ Deployment complete!\n');

  console.log('🎉 Mini App deployed successfully!');
  console.log(`\n📋 Contract Addresses:`);
  console.log(`   ETHVault: ${ethVaultAddress}`);
  console.log(`   NFTMint: ${nftMintAddress}`);

} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}
