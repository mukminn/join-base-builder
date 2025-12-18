# Mini App Deployment Guide

Panduan cepat untuk deploy Mini App ke berbagai platform.

## 🚀 Quick Deploy Options

### Option 1: Vercel (Recommended - Paling Mudah)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd mini-app
vercel

# Follow prompts:
# - Set up and deploy? Y
# - Which scope? (pilih account)
# - Link to existing project? N
# - Project name? base-builders-december
# - Directory? ./
# - Override settings? N
```

Setelah deploy, Vercel akan memberikan URL seperti:
`https://base-builders-december.vercel.app`

### Option 2: Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Deploy
cd mini-app
netlify deploy --prod
```

### Option 3: GitHub Pages

1. **Push ke GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/repo-name.git
git push -u origin main
```

2. **Enable GitHub Pages:**
   - Go to repository Settings
   - Scroll ke "Pages"
   - Source: Deploy from branch
   - Branch: main, folder: /mini-app
   - Save

3. **URL akan:**
   `https://your-username.github.io/repo-name/mini-app/`

**Note:** Untuk GitHub Pages, perlu update paths di HTML jika ada relative paths.

### Option 4: IPFS (Decentralized)

1. **Install IPFS Desktop atau CLI**

2. **Upload via Pinata:**
   - Go to [Pinata.cloud](https://pinata.cloud)
   - Upload folder `mini-app`
   - Get IPFS hash
   - Access via: `https://gateway.pinata.cloud/ipfs/YOUR_HASH`

3. **Atau via IPFS CLI:**
```bash
# Install IPFS
# Add files
ipfs add -r mini-app/

# Pin files
ipfs pin add YOUR_HASH
```

## 📝 Pre-Deployment Checklist

Sebelum deploy, pastikan:

- [ ] Update `config.js` dengan contract addresses
- [ ] Update `manifest.json` dengan:
  - [ ] URL Mini App (setelah deploy)
  - [ ] Builder address
  - [ ] Icon dan splash URLs
  - [ ] Contract addresses
- [ ] Test Mini App di localhost
- [ ] Test wallet connection
- [ ] Test contract interactions
- [ ] Check semua images accessible

## 🔧 Post-Deployment Steps

### 1. Update Manifest

Setelah deploy, update `manifest.json`:

```json
{
  "url": "https://your-deployed-url.com",
  "icon": "https://your-deployed-url.com/icon.png",
  "splash": "https://your-deployed-url.com/splash.png"
}
```

Re-deploy dengan updated manifest.

### 2. Verify HTTPS

Base requires HTTPS untuk Mini Apps. Pastikan:
- URL menggunakan HTTPS
- SSL certificate valid
- No mixed content warnings

### 3. Test Functionality

Test setelah deploy:
- [ ] Page loads correctly
- [ ] Wallet connects
- [ ] Network switches to Base
- [ ] Contracts load
- [ ] Transactions work
- [ ] Mobile responsive

### 4. Submit untuk Verification

Follow `verification-guide.md` untuk submit ke Base.

## 🐛 Troubleshooting

### CORS Errors

Jika ada CORS errors:
- Check hosting CORS settings
- Ensure all resources from same domain
- Check browser console

### Contract Not Loading

- Verify contract addresses di `config.js`
- Check network is Base
- Verify contracts deployed
- Check RPC connection

### Images Not Loading

- Use absolute URLs
- Check image paths
- Verify images accessible
- Use CDN jika perlu

## 📊 Monitoring

Setelah deploy:

1. **Check Analytics:**
   - Vercel/Netlify analytics
   - Google Analytics (optional)
   - User interactions

2. **Monitor Errors:**
   - Browser console
   - Error tracking (Sentry, etc)
   - User feedback

3. **Track Performance:**
   - Page load time
   - Transaction success rate
   - User engagement

## 🔄 Updates

Untuk update Mini App:

1. Make changes
2. Test locally
3. Deploy:
   ```bash
   vercel --prod  # Vercel
   netlify deploy --prod  # Netlify
   ```
4. Verify changes live
5. Monitor for issues

## 📱 Mobile Optimization

Ensure Mini App works on mobile:

- [ ] Responsive design
- [ ] Touch-friendly buttons
- [ ] Fast loading
- [ ] Works in mobile browsers
- [ ] Test on iOS dan Android

## 🔒 Security

- Use HTTPS only
- Validate all inputs
- Sanitize user data
- Check contract addresses
- Verify transactions
- No sensitive data in code

---

**Ready to deploy! 🚀**
