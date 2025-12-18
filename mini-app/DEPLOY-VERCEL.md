# Deploy Mini App ke Vercel

Panduan step-by-step untuk deploy Mini App ke Vercel.

## 📋 Prerequisites

Sebelum deploy, pastikan:

- [ ] Contract addresses sudah di-update di `config.js`
- [ ] Mini App sudah tested di localhost
- [ ] Semua file ada di folder `mini-app/`

## 🚀 Step 1: Install Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel
```

Atau gunakan npx (tidak perlu install):
```bash
npx vercel
```

## 🚀 Step 2: Login ke Vercel

```bash
vercel login
```

Akan membuka browser untuk login dengan:
- GitHub account, atau
- Email, atau
- Other providers

## 🚀 Step 3: Deploy ke Vercel

### Option A: Deploy dari folder mini-app

```bash
cd mini-app
vercel
```

### Option B: Deploy dari root project

```bash
# Dari root project
vercel --cwd mini-app
```

## 📝 Step 4: Follow Prompts

Vercel akan menanyakan beberapa hal:

```
? Set up and deploy "~/join builder base/mini-app"? [Y/n] y
? Which scope do you want to deploy to? (pilih account Anda)
? Link to existing project? [y/N] n
? What's your project's name? base-builders-december-mini-app
? In which directory is your code located? ./
? Want to override the settings? [y/N] n
```

## ✅ Step 5: Deployment Complete

Setelah deploy, Vercel akan memberikan:

- **Preview URL**: `https://base-builders-december-mini-app-xxx.vercel.app`
- **Production URL**: (setelah setup domain)

## 🔧 Step 6: Update Configuration

Setelah deploy, dapatkan URL dari Vercel, lalu:

### Update manifest.json

Edit `mini-app/manifest.json`:

```json
{
  "url": "https://your-vercel-url.vercel.app",
  "icon": "https://your-vercel-url.vercel.app/icon.png",
  "splash": "https://your-vercel-url.vercel.app/splash.png"
}
```

### Re-deploy dengan updated manifest

```bash
cd mini-app
vercel --prod
```

## 🌐 Step 7: Setup Custom Domain (Optional)

Jika punya custom domain:

1. Go to Vercel Dashboard
2. Select project
3. Go to Settings > Domains
4. Add your domain
5. Follow DNS setup instructions

## 📊 Step 8: Verify Deployment

Test Mini App di URL Vercel:

- [ ] Page loads correctly
- [ ] Wallet connects
- [ ] Network switches to Base
- [ ] Contracts load
- [ ] Transactions work
- [ ] Mobile responsive

## 🔄 Update Mini App

Untuk update setelah perubahan:

```bash
cd mini-app
vercel --prod
```

Atau push ke GitHub (jika connected):
```bash
git add .
git commit -m "Update mini app"
git push
# Vercel akan auto-deploy
```

## 📁 File Structure untuk Vercel

Vercel akan serve semua file di folder `mini-app/`:

```
mini-app/
├── index.html          ✅
├── app.js              ✅
├── styles.css          ✅
├── config.js           ✅
├── manifest.json       ✅
└── vercel.json         ✅ (optional config)
```

## ⚙️ Vercel Configuration

File `vercel.json` sudah dibuat dengan:
- Static file serving
- CORS headers
- Routing configuration

## 🐛 Troubleshooting

### Build Fails

- Check semua file ada
- Verify file paths
- Check for syntax errors

### 404 Errors

- Verify file names
- Check routing in vercel.json
- Ensure index.html exists

### CORS Issues

- Check vercel.json headers
- Verify Access-Control headers
- Test from different origins

### Contract Not Loading

- Verify config.js addresses
- Check network connection
- Verify contracts deployed

## 📱 Mobile Testing

Test di mobile device:

1. Open URL di mobile browser
2. Test wallet connection
3. Test transactions
4. Check responsive design

## 🔒 Security Notes

- Vercel provides HTTPS by default ✅
- No need for SSL setup
- Secure headers included

## 📈 Analytics (Optional)

Vercel provides analytics:

1. Go to Vercel Dashboard
2. Select project
3. View Analytics tab
4. See page views, visitors, etc.

## ✅ Checklist

Sebelum submit untuk Base verification:

- [ ] Deployed ke Vercel
- [ ] URL accessible via HTTPS
- [ ] All features working
- [ ] manifest.json updated dengan URL
- [ ] Tested di desktop
- [ ] Tested di mobile
- [ ] Ready untuk verification

---

**Deployment selesai! Sekarang update manifest.json dan submit untuk verification.** 🚀
