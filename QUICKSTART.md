# Quick Start Guide 🚀

Panduan cepat untuk memulai Base Builders December dalam 5 langkah!

## ⚡ Langkah Cepat

### 1️⃣ Install Dependencies

```bash
npm install
```

### 2️⃣ Setup Environment

Buat file `.env`:

```env
PRIVATE_KEY=your_private_key
BASE_MAINNET_RPC_URL=https://mainnet.base.org
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
BASESCAN_API_KEY=your_api_key
```

### 3️⃣ Deploy Contracts (Testnet dulu!)

```bash
# Compile
npm run compile

# Deploy ke Base Sepolia (testnet)
npm run deploy:base-sepolia
```

**Simpan contract addresses yang muncul!**

### 4️⃣ Update Mini App

Edit `mini-app/app.js`, update contract addresses:

```javascript
const FEE_GENERATOR_ADDRESS = "0x..."; // Address dari step 3
const NFT_CONTRACT_ADDRESS = "0x..."; // Address dari step 3
```

### 5️⃣ Deploy Mini App

**Vercel (Paling mudah):**

```bash
cd mini-app
npx vercel
```

Atau upload folder `mini-app` ke hosting apapun (Netlify, GitHub Pages, dll)

## 🎯 Generate Fees

### Via Mini App:
1. Buka Mini App yang sudah di-deploy
2. Connect wallet (MetaMask)
3. Deposit atau Mint NFT
4. Setiap transaksi generate fees!

### Via Script:
```bash
# Buat script interact.js (lihat contoh di scripts/)
node scripts/interact.js
```

## 📊 Track Progress

1. **Register di Talent.app:**
   - Go to https://talent.app/
   - Connect wallet
   - Register Basename
   - Link GitHub

2. **Push ke GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/your-username/repo-name.git
   git push -u origin main
   ```

3. **Monitor Leaderboard:**
   - Check daily di Talent.app
   - Fees akan otomatis tracked
   - Mini App status akan update

## ✅ Checklist

- [ ] Contracts deployed ke Base Sepolia (testnet)
- [ ] Contracts tested dan working
- [ ] Contracts deployed ke Base Mainnet
- [ ] Mini App deployed dan accessible
- [ ] Mini App registered di Base
- [ ] Repository public di GitHub
- [ ] Registered di Talent.app
- [ ] Basename connected
- [ ] GitHub account linked

## 🆘 Butuh Bantuan?

- Lihat `DEPLOYMENT.md` untuk panduan lengkap
- Check `README.md` untuk dokumentasi
- Base Docs: https://docs.base.org/
- Base Mini Apps: https://docs.base.org/mini-apps/

---

**Tips:** Mulai dengan testnet dulu, test semua fitur, baru deploy ke mainnet! 🎉
