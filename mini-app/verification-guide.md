# Base Mini App Verification Guide

Panduan lengkap untuk verify Mini App di Base dan mendapatkan Developer Rewards.

## 📋 Prerequisites

Sebelum submit untuk verification, pastikan:

- [ ] Mini App sudah deployed dan accessible via public URL
- [ ] Contract addresses sudah di-update di `app.js`
- [ ] Manifest.json sudah di-update dengan informasi lengkap
- [ ] Mini App sudah tested dan working
- [ ] Anda memiliki Base builder account

## 🔧 Step 1: Update Manifest

Edit `manifest.json` dengan informasi lengkap:

```json
{
  "name": "Base Builders December",
  "description": "Mini App untuk Base Builders December program",
  "version": "1.0.0",
  "icon": "https://your-domain.com/icon.png",
  "splash": "https://your-domain.com/splash.png",
  "url": "https://your-domain.com",
  "builder": "YOUR_BASE_BUILDER_ADDRESS",
  "category": "DeFi",
  "tags": ["base", "defi", "nft"],
  "contracts": {
    "feeGenerator": "0x...",
    "simpleNFT": "0x..."
  }
}
```

### Required Fields:

- **name**: Nama Mini App
- **description**: Deskripsi lengkap
- **url**: Public URL Mini App (HTTPS required)
- **builder**: Base builder address Anda
- **icon**: URL ke icon image (min 512x512px)
- **splash**: URL ke splash screen image

### Optional but Recommended:

- **category**: Category Mini App
- **tags**: Tags untuk discoverability
- **contracts**: Contract addresses yang digunakan
- **social**: Social media links

## 🖼️ Step 2: Prepare Images

### Icon Image

- Size: Minimum 512x512px
- Format: PNG atau JPG
- Content: Logo atau icon Mini App
- Upload ke hosting (IPFS, CDN, atau GitHub)

### Splash Screen

- Size: Recommended 1200x630px
- Format: PNG atau JPG
- Content: Screenshot atau banner Mini App
- Upload ke hosting

## 📝 Step 3: Get Base Builder Address

1. Go to [Base.dev](https://base.org/)
2. Connect wallet
3. Register atau login sebagai builder
4. Copy Base builder address (Basename address)

## 🚀 Step 4: Deploy Mini App

Deploy Mini App ke public hosting:

### Vercel (Recommended)

```bash
cd mini-app
vercel
```

### Netlify

```bash
cd mini-app
netlify deploy --prod
```

### GitHub Pages

1. Push ke GitHub
2. Enable GitHub Pages
3. URL akan: `https://username.github.io/repo-name/`

**Important:** URL harus HTTPS!

## ✅ Step 5: Submit untuk Verification

1. **Go to Base Mini Apps Portal**
   - Visit [Base.dev Mini Apps](https://docs.base.org/mini-apps/)
   - Login dengan Base builder account

2. **Fill Submission Form**
   - Mini App URL (HTTPS)
   - Name dan description
   - Category
   - Tags
   - Screenshots (min 2)
   - Manifest file atau builder address

3. **Add Builder Address**
   - Base akan meminta Anda untuk add builder address ke manifest
   - Update `manifest.json` dengan builder address
   - Re-deploy Mini App dengan updated manifest

4. **Wait for Verification**
   - Base team akan review submission
   - Verification biasanya 1-3 business days
   - You'll receive email notification

## 🔍 Step 6: Verification Checklist

Base akan check:

- [ ] Mini App accessible via URL
- [ ] Manifest.json valid dan complete
- [ ] Builder address matches Base account
- [ ] Mini App functional dan working
- [ ] Contracts deployed dan verified
- [ ] User experience baik
- [ ] No security issues

## 📊 Step 7: After Verification

Setelah verified:

1. **Mini App Listed**
   - Appears di Base Mini Apps directory
   - Searchable dan discoverable

2. **Eligible for Rewards**
   - Tracked untuk Developer Rewards
   - Metrics collected automatically
   - Rewards based on:
     - Active users
     - Onchain transactions
     - User engagement
     - Contract interactions

3. **Access to Programs**
   - Partner programs
   - Special campaigns
   - Growth opportunities

## 🎯 Tips untuk Success

### 1. User Experience

- Fast loading (< 3 seconds)
- Clear UI/UX
- Easy wallet connection
- Smooth transactions
- Mobile responsive

### 2. Onchain Activity

- Encourage regular transactions
- Create engaging features
- Track user activity
- Reward active users

### 3. Documentation

- Clear README
- User guides
- FAQ section
- Support channels

### 4. Marketing

- Social media presence
- Community engagement
- Regular updates
- User feedback

## 🐛 Common Issues

### Verification Rejected

**Reason:** Manifest incomplete
**Solution:** Ensure all required fields filled

**Reason:** Builder address mismatch
**Solution:** Verify builder address matches Base account

**Reason:** Mini App not accessible
**Solution:** Check URL is public dan HTTPS

**Reason:** Contracts not verified
**Solution:** Verify contracts di Basescan

### Mini App Not Tracking

- Ensure Mini App is verified
- Check contracts are on Base mainnet
- Verify transactions are successful
- Wait for metrics update (daily)

## 📞 Support

Jika ada masalah dengan verification:

- Check [Base Mini Apps Docs](https://docs.base.org/mini-apps/)
- Join Base Discord
- Contact Base support
- Check GitHub issues

## 📈 Next Steps

Setelah verified:

1. **Monitor Metrics**
   - Track user engagement
   - Monitor transactions
   - Check rewards status

2. **Improve Mini App**
   - Add new features
   - Optimize performance
   - Fix bugs

3. **Grow User Base**
   - Marketing campaigns
   - Social media
   - Community building

4. **Maximize Rewards**
   - Focus on user engagement
   - Increase onchain activity
   - Regular updates

---

**Good luck dengan verification! 🚀**
