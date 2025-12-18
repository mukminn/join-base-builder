# Base Builders December - Mini App

Mini App untuk Base ecosystem yang terintegrasi dengan smart contracts untuk generate fees.

## 🎯 Features

- ✅ Wallet Connection (MetaMask, WalletConnect)
- ✅ Deposit/Withdraw dengan Fee Generator contract
- ✅ NFT Minting dengan fee tracking
- ✅ Real-time transaction history
- ✅ Fee statistics tracking
- ✅ Base network auto-detection

## 🚀 Quick Start

### Local Development

1. Serve files dengan local server:

```bash
# Menggunakan Python
python -m http.server 8000

# Menggunakan Node.js (http-server)
npx http-server -p 8000

# Menggunakan PHP
php -S localhost:8000
```

2. Buka browser ke `http://localhost:8000`

### Update Contract Addresses

Edit `app.js` dan update:

```javascript
const FEE_GENERATOR_ADDRESS = "0x..."; // Your deployed contract address
const NFT_CONTRACT_ADDRESS = "0x...";  // Your deployed contract address
```

## 📦 Deployment

### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd mini-app
vercel
```

### Option 2: Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
cd mini-app
netlify deploy --prod
```

### Option 3: GitHub Pages

1. Push code ke GitHub repository
2. Go to Settings > Pages
3. Select source branch
4. Your Mini App akan available di `https://username.github.io/repo-name/`

### Option 4: IPFS

```bash
# Install IPFS
# Upload folder mini-app ke IPFS via Pinata atau service lainnya
```

## ✅ Base Mini App Verification

Untuk mendapatkan Developer Rewards, Mini App harus di-verify di Base:

### Step 1: Update Manifest

Edit `manifest.json`:
- Update `url` dengan URL Mini App yang sudah di-deploy
- Update `builder` dengan Base builder address Anda
- Update `contracts` dengan deployed contract addresses
- Add icon dan splash images

### Step 2: Submit untuk Verification

1. Go to [Base.dev Mini Apps](https://docs.base.org/mini-apps/)
2. Login dengan Base builder account
3. Submit Mini App dengan:
   - URL Mini App
   - Manifest file
   - Description
   - Screenshots

### Step 3: Add Builder Address ke Manifest

Setelah submit, Base akan meminta Anda untuk menambahkan builder address ke manifest. Update `manifest.json`:

```json
{
  "builder": "YOUR_BASE_BUILDER_ADDRESS"
}
```

### Step 4: Verification

Base akan verify Mini App Anda. Setelah verified:
- ✅ Eligible untuk Developer Rewards
- ✅ Listed di Base Mini Apps directory
- ✅ Tracked untuk rewards program

## 📊 Tracking & Rewards

### User Engagement Metrics

Base tracks:
- Active users
- Onchain transactions
- Contract interactions
- User retention

### Tips untuk Maximize Rewards

1. **Focus on User Experience**
   - Fast loading times
   - Clear UI/UX
   - Easy wallet connection
   - Smooth transactions

2. **Onchain Activity**
   - Encourage regular transactions
   - Create engaging features
   - Reward active users

3. **Social Sharing**
   - Add share features
   - Social media integration
   - Referral programs

4. **Regular Updates**
   - Keep Mini App active
   - Add new features
   - Fix bugs quickly

## 🔧 Configuration

### Network Configuration

Mini App supports:
- Base Mainnet (Chain ID: 8453)
- Base Sepolia Testnet (Chain ID: 84532)

Auto-switch network jika user di network lain.

### Contract Integration

Mini App integrates dengan:
- `FeeGenerator.sol` - Deposit/Withdraw dengan fees
- `SimpleNFT.sol` - NFT minting dengan fees

## 📱 Mobile Support

Mini App fully responsive dan optimized untuk:
- Desktop browsers
- Mobile browsers
- Base mobile app (jika integrated)

## 🐛 Troubleshooting

### Wallet Not Connecting

- Ensure MetaMask atau wallet lain installed
- Check network is Base
- Try refresh page

### Transactions Failing

- Check contract addresses are correct
- Verify network is Base
- Ensure sufficient ETH for gas
- Check contract is deployed

### Data Not Loading

- Check RPC connection
- Verify contract addresses
- Check browser console for errors

## 📚 Resources

- [Base Mini Apps Documentation](https://docs.base.org/mini-apps/)
- [Base Mini App Rewards](https://docs.base.org/mini-apps/growth/rewards)
- [Base SDK](https://docs.base.org/mini-apps/sdk)
- [Ethers.js Documentation](https://docs.ethers.io/)

## 📄 License

MIT

---

**Built for Base Builders December Program** 🚀
