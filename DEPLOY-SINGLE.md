# ⚠️ IMPORTANT: Jangan Double Deploy ke Vercel!

## 🚫 Masalah Double Deploy

Jika ada **double deployment** ke Vercel, kemungkinan:
1. **Auto-deploy di Vercel Dashboard ENABLED** + Manual deploy via CLI = **DOUBLE**
2. **GitHub Actions** deploy + Manual deploy = **DOUBLE**

## ✅ Solusi: Pilih SATU Metode Deploy

### Option 1: Manual Deploy ONLY (Recommended untuk sekarang)

**DISABLE Auto-Deploy di Vercel Dashboard:**
1. Go to https://vercel.com/dashboard
2. Pilih project Anda
3. Go to **Settings** → **Git**
4. **UNCHECK "Automatic deployments"**
5. Save

**Deploy Manual:**
```bash
cd mini-app
vercel --prod --yes
```

### Option 2: Auto-Deploy ONLY (Via GitHub)

**ENABLE Auto-Deploy di Vercel Dashboard:**
1. Go to https://vercel.com/dashboard
2. Pilih project Anda
3. Go to **Settings** → **Git**
4. **CHECK "Automatic deployments"**
5. Save

**JANGAN manual deploy via CLI!**
- Cukup push ke GitHub
- Vercel akan auto-deploy

## 🔍 Cek Status Auto-Deploy

1. Go to Vercel Dashboard
2. Settings → Git
3. Lihat "Automatic deployments" status

## ✅ Current Setup (Recommended)

**Status: Manual Deploy ONLY**
- ✅ Auto-deploy: **DISABLED**
- ✅ Deploy via: `vercel --prod --yes` (manual)
- ✅ No GitHub Actions deploy

## 🚀 Deploy Sekarang (Single)

```bash
cd mini-app
vercel --prod --yes
```

**HANYA jalankan sekali!**
