# 🔗 Reown/WalletConnect Setup

## 📋 Project ID Required

Untuk menggunakan Reown AppKit, Anda perlu **Project ID** dari Reown Cloud.

### Step 1: Dapatkan Project ID

1. Go to https://cloud.reown.com
2. Sign up / Login
3. Create new project
4. Copy **Project ID**

### Step 2: Update app.js

Edit `mini-app/app.js` dan ganti:

```javascript
projectId: 'YOUR_PROJECT_ID', // Ganti dengan Project ID Anda
```

### Step 3: Deploy

Setelah update Project ID, deploy ulang:

```bash
cd mini-app
vercel --prod --yes
```

## ✨ Features Included

Berdasarkan konfigurasi dari demo Reown:

- ✅ WalletConnect QR code
- ✅ Email login
- ✅ Social login (Google, X, Farcaster, Discord, Apple, GitHub, Facebook)
- ✅ All wallets support
- ✅ Recent wallets
- ✅ Injected wallets (MetaMask, etc)
- ✅ Featured wallets
- ✅ Receive & Send features
- ✅ Activity tracking
- ✅ Multi-wallet support
- ✅ Base Mainnet & Sepolia support

## 🔄 Fallback

Jika Reown tidak tersedia atau Project ID belum di-set, app akan fallback ke wallet connection biasa (MetaMask, dll).

## 📚 Documentation

- Reown Docs: https://docs.reown.com
- Demo: https://demo.reown.com
