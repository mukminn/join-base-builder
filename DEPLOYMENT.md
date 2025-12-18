# Deployment Guide

Panduan lengkap untuk deploy contracts dan Mini App untuk Base Builders December.

## Prerequisites

1. **Wallet Setup**
   - Install MetaMask atau wallet lainnya
   - Dapatkan ETH di Base network (untuk gas fees)
   - Simpan private key dengan aman

2. **Environment Setup**
   - Node.js v18+
   - npm atau yarn
   - Git

3. **API Keys**
   - Basescan API key (untuk verify contracts)
   - Dapatkan di [Basescan](https://basescan.org/apis)

## Step 1: Setup Project

```bash
# Clone atau download project
cd base-builders-december

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
```

## Step 2: Configure Environment

Edit file `.env`:

```env
PRIVATE_KEY=your_private_key_here
BASE_MAINNET_RPC_URL=https://mainnet.base.org
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
BASESCAN_API_KEY=your_basescan_api_key
```

**⚠️ PENTING:** Jangan commit file `.env` ke GitHub!

## Step 3: Deploy ke Testnet (Base Sepolia)

### 3.1 Get Testnet ETH

1. Go to [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet)
2. Request testnet ETH

### 3.2 Deploy Contracts

```bash
# Compile contracts
npm run compile

# Deploy ke Base Sepolia
npm run deploy:base-sepolia
```

Setelah deploy, Anda akan mendapatkan contract addresses. Simpan addresses ini!

### 3.3 Test Contracts

```bash
# Run tests
npm test
```

## Step 4: Deploy ke Mainnet (Base)

### 4.1 Get Mainnet ETH

1. Bridge ETH ke Base menggunakan [Base Bridge](https://bridge.base.org/)
2. Atau beli langsung di exchange yang support Base

### 4.2 Deploy Contracts

```bash
# Deploy ke Base Mainnet
npm run deploy:base
```

### 4.3 Verify Contracts

Contracts akan otomatis di-verify jika:
- `BASESCAN_API_KEY` sudah di-set
- Network adalah Base atau Base Sepolia

Atau verify manual di [Basescan](https://basescan.org/verifyContract)

## Step 5: Update Mini App

### 5.1 Update Contract Addresses

Edit `mini-app/app.js`:

```javascript
const FEE_GENERATOR_ADDRESS = "0x..."; // Your deployed address
const NFT_CONTRACT_ADDRESS = "0x..."; // Your deployed address
```

### 5.2 Deploy Mini App

**Option 1: Vercel**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd mini-app
vercel
```

**Option 2: Netlify**

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
cd mini-app
netlify deploy --prod
```

**Option 3: IPFS**

```bash
# Install IPFS
# Upload folder mini-app ke IPFS
# Gunakan Pinata atau service lainnya
```

### 5.3 Register Mini App di Base

1. Go to [Base Mini Apps](https://docs.base.org/mini-apps/)
2. Register Mini App Anda
3. Submit untuk verification
4. Setelah verified, Mini App akan eligible untuk rewards

## Step 6: Generate Fees

### 6.1 Interact dengan Contracts

**Via Mini App:**
- Buka Mini App yang sudah di-deploy
- Connect wallet
- Lakukan deposit/withdraw atau mint NFT

**Via Script:**
```javascript
// Create scripts/interact.js
const hre = require("hardhat");

async function main() {
  const FeeGenerator = await hre.ethers.getContractAt(
    "FeeGenerator",
    "YOUR_CONTRACT_ADDRESS"
  );
  
  // Deposit
  await FeeGenerator.deposit({ value: ethers.parseEther("0.01") });
}

main();
```

### 6.2 Monitor Fees

- Check `totalFeesGenerated` di contract
- Monitor di Basescan
- Track di dashboard Base Builders

## Step 7: GitHub Contributions

### 7.1 Push ke GitHub

```bash
# Initialize git (jika belum)
git init

# Add remote
git remote add origin https://github.com/your-username/base-builders-december.git

# Commit dan push
git add .
git commit -m "Initial commit: Base Builders December project"
git push -u origin main
```

### 7.2 Make Repository Public

1. Go to repository settings
2. Scroll ke "Danger Zone"
3. Change visibility to Public

### 7.3 Regular Contributions

- Make regular commits
- Create meaningful PRs
- Contribute ke Base ecosystem repos
- Write documentation

## Step 8: Track Progress

### 8.1 Register di Talent.app

1. Go to [Talent.app](https://talent.app/)
2. Connect wallet
3. Register Basename
4. Link GitHub account

### 8.2 Monitor Leaderboard

- Check daily leaderboard updates
- Monitor your score
- Track fees generated
- Check Mini App status

## Troubleshooting

### Contract Deployment Fails

- Check network connection
- Verify you have enough ETH for gas
- Check private key is correct
- Ensure RPC URL is valid

### Mini App Not Working

- Check contract addresses are correct
- Verify network is Base
- Check browser console for errors
- Ensure contracts are deployed

### Fees Not Tracking

- Verify contracts are on Base mainnet
- Check transactions are successful
- Ensure contracts are verified
- Wait for leaderboard update (daily)

## Resources

- [Base Documentation](https://docs.base.org/)
- [Base Mini Apps Docs](https://docs.base.org/mini-apps/)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Basescan](https://basescan.org/)
- [Talent.app](https://talent.app/)

---

**Good luck dengan Base Builders December! 🚀**
