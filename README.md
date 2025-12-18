# Base Mini App - Full-Stack DeFi

Base Mini App dengan fitur Deposit ETH, Withdraw ETH, dan Mint NFT yang berjalan di dalam Base App environment.

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Mini App SDK**: Base Mini App SDK / @base-org/account
- **Wallet**: Embedded Base Wallet (no redirect)
- **Styling**: Tailwind CSS + Framer Motion
- **Web3**: wagmi + viem
- **Smart Contracts**: Solidity + Foundry
- **Network**: Base Mainnet / Base Sepolia

## 📋 Fitur

- ✅ Auto connect embedded Base wallet
- ✅ Deposit ETH ke smart contract
- ✅ Withdraw ETH dari smart contract
- ✅ Mint ERC-721 NFT
- ✅ Real-time balance & status
- ✅ Modern 3D UI dengan neon glow effects
- ✅ Mobile-first design
- ✅ Production ready

## 🛠️ Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Foundry (untuk smart contracts)

```bash
# Install Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Install OpenZeppelin
forge install OpenZeppelin/openzeppelin-contracts --no-commit
```

### 3. Environment Variables

Buat file `.env.local`:

```env
NEXT_PUBLIC_ETHVAULT_ADDRESS=0x...
NEXT_PUBLIC_NFTMINT_ADDRESS=0x...
PRIVATE_KEY=your_private_key_here
BASESCAN_API_KEY=your_basescan_api_key
```

### 4. Deploy Smart Contracts

```bash
# Deploy ke Base Sepolia (testnet)
npm run deploy:base-sepolia

# Deploy ke Base Mainnet
npm run deploy:base
```

Setelah deploy, update `.env.local` dengan contract addresses.

### 5. Run Development Server

```bash
npm run dev
```

Buka http://localhost:3000

## 🚀 Deploy Mini App

### Deploy All-in-One

```bash
npm run deploy:miniapp
```

Script ini akan:
1. Deploy smart contracts ke Base
2. Update contract addresses di .env
3. Build Next.js app
4. Deploy ke Vercel

### Manual Deploy

```bash
# 1. Deploy contracts
npm run deploy:base

# 2. Update .env.local dengan addresses

# 3. Build
npm run build

# 4. Deploy ke Vercel
vercel --prod
```

## 📁 Struktur Project

```
base-mini-app/
├── app/                    # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx
│   ├── providers.tsx
│   └── globals.css
├── components/             # React components
│   ├── WalletButton.tsx
│   ├── DepositCard.tsx
│   ├── WithdrawCard.tsx
│   ├── MintNFTCard.tsx
│   └── AnimatedCard.tsx
├── contracts/             # Smart contracts
│   ├── ETHVault.sol
│   └── NFTMint.sol
├── lib/                   # Utilities
│   ├── wagmi.ts
│   └── utils.ts
├── scripts/               # Deployment scripts
│   ├── Deploy.s.sol
│   └── deploy-miniapp.js
└── package.json
```

## 🎨 UI Features

- **3D Card Effects**: Hover animations dengan 3D transform
- **Neon Glow**: CSS-only glow effects (blue, purple, cyan)
- **Glassmorphism**: Frosted glass effect
- **Smooth Animations**: Framer Motion untuk transitions
- **Mobile Optimized**: One-hand usage, vertical layout

## 🔒 Security

- ✅ ReentrancyGuard pada semua external functions
- ✅ Ownable untuk owner-only functions
- ✅ Input validation
- ✅ Safe math operations
- ✅ Pausable untuk emergency stops

## 📝 Smart Contracts

### ETHVault.sol

- `deposit()`: Deposit ETH ke vault
- `withdraw(uint256)`: User withdraw deposited ETH
- `ownerWithdraw()`: Owner withdraw all ETH
- `getBalance(address)`: Get user balance

### NFTMint.sol

- `mint(string)`: Mint NFT dengan token URI
- `withdrawETH()`: Owner withdraw mint fees
- `pause()/unpause()`: Emergency controls
- Max supply: 10,000
- Mint price: 0.001 ETH

## 🌐 Networks

- **Base Mainnet**: Chain ID 8453
- **Base Sepolia**: Chain ID 84532

## 📚 Documentation

- [Base Docs](https://docs.base.org)
- [wagmi Docs](https://wagmi.sh)
- [Next.js Docs](https://nextjs.org/docs)

## 🐛 Troubleshooting

### Wallet tidak connect
- Pastikan Base wallet terinstall
- Check network (harus Base Mainnet/Sepolia)
- Refresh page

### Contract tidak ditemukan
- Pastikan contract sudah di-deploy
- Check `.env.local` addresses
- Verify contract di Basescan

### Build error
- Pastikan semua dependencies terinstall
- Check TypeScript errors
- Clear `.next` folder dan rebuild

## 📄 License

MIT
