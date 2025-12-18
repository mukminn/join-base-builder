# 🚀 Next Steps - Setelah Vercel Terhubung

Vercel sudah terhubung dengan GitHub! Sekarang lanjutkan dengan langkah berikut:

## ✅ Step 1: Dapatkan Vercel URL

Setelah deployment pertama selesai, Vercel akan memberikan URL seperti:
- `https://join-base-builder-mini-app.vercel.app`
- atau `https://join-base-builder-xxxxx.vercel.app`

**Cara cek:**
1. Go to Vercel Dashboard: https://vercel.com/dashboard
2. Click project `join-base-builder` (atau nama project Anda)
3. Lihat URL di bagian "Domains" atau di deployment list

## ✅ Step 2: Update manifest.json dengan Vercel URL

### Option A: Menggunakan PowerShell Script (Recommended)

```powershell
# Jalankan script dengan Vercel URL Anda
.\update-vercel-url.ps1 -VercelUrl "https://your-app.vercel.app"
```

Script akan otomatis update:
- `url`: Vercel URL
- `icon`: URL ke icon
- `splash`: URL ke splash screen

### Option B: Manual Update

Edit `mini-app/manifest.json`:

```json
{
  "url": "https://your-vercel-url.vercel.app",
  "icon": "https://your-vercel-url.vercel.app/icon.png",
  "splash": "https://your-vercel-url.vercel.app/splash.png"
}
```

## ✅ Step 3: Commit & Push Update

```bash
git add mini-app/manifest.json
git commit -m "Update manifest with Vercel URL"
git push
```

**Vercel akan otomatis deploy update!** 🎉

## ✅ Step 4: Test Mini App

1. Buka Vercel URL di browser
2. Test semua fitur:
   - [ ] Page loads
   - [ ] Wallet connects
   - [ ] Network switches to Base
   - [ ] Contracts load (FeeGenerator: `0x33b5b0136bD1812E644eBC089af88706C9A3815d`)
   - [ ] Deposit works
   - [ ] Withdraw works
   - [ ] Mobile responsive

## ✅ Step 5: Prepare untuk Base Verification

### 5.1 Buat Icon & Splash Images

Buat 2 images:

1. **Icon** (min 512x512px)
   - Logo atau icon Mini App
   - Format: PNG atau JPG
   - Upload ke folder `mini-app/` atau hosting

2. **Splash Screen** (recommended 1200x630px)
   - Screenshot atau banner Mini App
   - Format: PNG atau JPG
   - Upload ke folder `mini-app/` atau hosting

### 5.2 Update manifest.json dengan Images

```json
{
  "icon": "https://your-vercel-url.vercel.app/icon.png",
  "splash": "https://your-vercel-url.vercel.app/splash.png"
}
```

### 5.3 Get Base Builder Address

1. Go to [Base.dev](https://base.org/)
2. Connect wallet
3. Register atau login sebagai builder
4. Copy Base builder address (Basename address)

### 5.4 Update manifest.json dengan Builder Address

```json
{
  "builder": "YOUR_BASE_BUILDER_ADDRESS"
}
```

## ✅ Step 6: Submit untuk Base Verification

Follow panduan lengkap di `mini-app/verification-guide.md`:

1. Go to Base Mini Apps portal
2. Submit Mini App dengan:
   - Vercel URL
   - Manifest file
   - Description
   - Screenshots
3. Wait for verification (1-3 business days)

## ✅ Step 7: Register di Talent.app

1. Go to https://talent.app/
2. Connect wallet
3. Register Basename
4. Link GitHub account: `mukminn/join-base-builder`
5. Monitor leaderboard

## 📊 Checklist

- [ ] Vercel URL didapat
- [ ] manifest.json updated dengan Vercel URL
- [ ] Code pushed ke GitHub
- [ ] Mini App tested di Vercel URL
- [ ] Icon & splash images dibuat
- [ ] manifest.json updated dengan images
- [ ] Base builder address didapat
- [ ] manifest.json updated dengan builder address
- [ ] Mini App submitted untuk verification
- [ ] Registered di Talent.app
- [ ] GitHub linked di Talent.app

## 🎯 Quick Commands

```bash
# Update manifest dengan Vercel URL (setelah dapat URL)
.\update-vercel-url.ps1 -VercelUrl "https://your-app.vercel.app"

# Commit & push
git add mini-app/manifest.json
git commit -m "Update manifest with Vercel URL"
git push

# Check deployment
# Go to Vercel dashboard atau GitHub Actions
```

## 🆘 Troubleshooting

### Vercel URL tidak muncul
- Check deployment status di Vercel dashboard
- Wait beberapa menit untuk deployment selesai
- Check deployment logs

### Auto-deploy tidak jalan
- Check Git connection di Vercel Settings
- Verify branch name (main)
- Check deployment logs

### Mini App tidak loading
- Check Vercel URL benar
- Verify file structure
- Check browser console untuk errors

---

**Setelah dapat Vercel URL, jalankan script update atau manual update manifest.json!** 🚀
