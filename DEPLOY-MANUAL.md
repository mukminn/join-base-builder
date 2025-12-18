# 🚀 Deploy Manual ke Vercel

Panduan untuk deploy manual ke Vercel (tidak auto-deploy).

## ⚙️ Step 1: Disable Auto-Deploy di Vercel

1. **Go to Vercel Dashboard**
   - https://vercel.com/dashboard
   - Click project `join-base-builder`

2. **Settings → Git**
   - Scroll ke "Production Branch"
   - **Uncheck "Automatic deployments"**
   - Save

## 🚀 Step 2: Deploy Manual via Vercel CLI

### Install Vercel CLI

```bash
npm install -g vercel
```

### Login

```bash
vercel login
```

### Deploy dari Root Project

```bash
# Dari root project
cd "C:\Users\mukmin\Desktop\join builder base"

# Deploy
vercel --prod
```

### Atau Deploy dari mini-app Folder

```bash
# Masuk ke folder mini-app
cd mini-app

# Deploy
vercel --prod
```

## 📝 Step 3: Follow Prompts

Vercel akan menanyakan:

```
? Set up and deploy? [Y/n] y
? Which scope? (pilih account)
? Link to existing project? [y/N] y
? What's your project's name? join-base-builder
? In which directory is your code located? ./ (atau ../ jika dari mini-app)
? Want to override the settings? [y/N] n
```

## ✅ Step 4: Verify Deployment

Setelah deploy selesai, Vercel akan memberikan URL:
- Production: https://join-base-builder.vercel.app

## 🔄 Deploy Ulang (Setelah Update)

Setelah update code:

```bash
# Commit changes
git add .
git commit -m "Update: description"
git push

# Deploy manual
vercel --prod
```

## 📋 Checklist

- [ ] Auto-deploy disabled di Vercel Dashboard
- [ ] Vercel CLI installed
- [ ] Logged in ke Vercel
- [ ] Root Directory set ke `mini-app` (di Vercel Dashboard)
- [ ] Deploy manual via CLI
- [ ] Verify URL working

---

**Sekarang deploy hanya manual via CLI, tidak auto-deploy!** 🚀
