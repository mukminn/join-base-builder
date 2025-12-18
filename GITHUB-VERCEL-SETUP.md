# Setup GitHub + Vercel Auto-Deploy

Panduan untuk connect GitHub repository dengan Vercel untuk auto-deploy Mini App.

## 📋 Prerequisites

- ✅ GitHub repository: https://github.com/mukminn/join-base-builder
- ✅ Contract address: `0x33b5b0136bD1812E644eBC089af88706C9A3815d` (FeeGenerator)
- ✅ Vercel account (bisa daftar di vercel.com)

## 🚀 Step 1: Push Code ke GitHub

Jika belum push code:

```bash
# Initialize git (jika belum)
git init

# Add remote
git remote add origin https://github.com/mukminn/join-base-builder.git

# Add semua files
git add .

# Commit
git commit -m "Initial commit: Base Builders December project"

# Push ke GitHub
git push -u origin main
```

## 🔗 Step 2: Connect GitHub dengan Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com
   - Login atau Sign up

2. **Import Project**
   - Click "Add New..." → "Project"
   - Click "Import Git Repository"
   - Authorize GitHub jika diminta
   - Select repository: `mukminn/join-base-builder`

3. **Configure Project**
   - **Framework Preset**: Other
   - **Root Directory**: `mini-app`
   - **Build Command**: (kosongkan, karena static files)
   - **Output Directory**: `.` (current directory)
   - **Install Command**: (kosongkan)

4. **Environment Variables** (jika perlu)
   - Tidak perlu untuk static files

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Link project
cd mini-app
vercel link

# Follow prompts:
# - Set up and deploy? Y
# - Which scope? (pilih account)
# - Link to existing project? N
# - What's your project's name? join-base-builder-mini-app
# - In which directory is your code located? ./

# Deploy
vercel --prod
```

## ⚙️ Step 3: Setup Auto-Deploy

Setelah project linked:

1. **Go to Vercel Dashboard**
   - Select project
   - Go to Settings → Git

2. **Connect Repository**
   - Click "Connect Git Repository"
   - Select `mukminn/join-base-builder`
   - Select branch: `main`

3. **Auto-Deploy Settings**
   - ✅ Production Branch: `main`
   - ✅ Automatic deployments: ON
   - ✅ Preview deployments: ON (optional)

## 🔑 Step 4: Get Vercel Tokens (untuk GitHub Actions)

Jika ingin menggunakan GitHub Actions (optional):

1. **Get Vercel Token**
   - Go to Vercel Dashboard
   - Settings → Tokens
   - Create new token
   - Copy token

2. **Get Project IDs**
   - Go to Project Settings → General
   - Copy `Project ID` dan `Organization ID`

3. **Add GitHub Secrets**
   - Go to GitHub repository
   - Settings → Secrets and variables → Actions
   - Add secrets:
     - `VERCEL_TOKEN`: (token dari step 1)
     - `VERCEL_ORG_ID`: (organization ID)
     - `VERCEL_PROJECT_ID`: (project ID)

## ✅ Step 5: Test Auto-Deploy

1. **Make a change**
   ```bash
   # Edit file apapun di mini-app/
   git add .
   git commit -m "Test auto-deploy"
   git push
   ```

2. **Check Vercel**
   - Go to Vercel Dashboard
   - Lihat deployment baru muncul otomatis
   - Status: Building → Ready

## 📝 Step 6: Update Manifest dengan Vercel URL

Setelah deploy, dapatkan URL dari Vercel:

1. **Get URL**
   - Vercel akan provide URL seperti: `https://join-base-builder-mini-app.vercel.app`
   - Atau custom domain jika setup

2. **Update manifest.json**
   Edit `mini-app/manifest.json`:
   ```json
   {
     "url": "https://your-vercel-url.vercel.app",
     "icon": "https://your-vercel-url.vercel.app/icon.png",
     "splash": "https://your-vercel-url.vercel.app/splash.png"
   }
   ```

3. **Commit & Push**
   ```bash
   git add mini-app/manifest.json
   git commit -m "Update manifest with Vercel URL"
   git push
   # Vercel akan auto-deploy update
   ```

## 🔄 Workflow

Setelah setup, workflow akan seperti ini:

```
1. Edit code di local
2. git add .
3. git commit -m "Update"
4. git push
5. Vercel auto-deploy (otomatis!)
6. Mini App updated di production URL
```

## 📊 Monitor Deployments

- **Vercel Dashboard**: Lihat semua deployments
- **GitHub Actions**: Lihat workflow runs (jika setup)
- **Deployment Logs**: Check untuk errors

## 🐛 Troubleshooting

### Auto-deploy tidak jalan

- Check Git connection di Vercel Settings
- Verify branch name (main/master)
- Check deployment logs

### Build fails

- Check file structure
- Verify root directory setting
- Check for syntax errors

### URL tidak update

- Wait beberapa detik
- Check deployment status
- Clear browser cache

## ✅ Checklist

- [ ] Code pushed ke GitHub
- [ ] Vercel account created
- [ ] Project imported dari GitHub
- [ ] Root directory set ke `mini-app`
- [ ] Auto-deploy enabled
- [ ] Test push trigger deployment
- [ ] Manifest.json updated dengan URL
- [ ] Mini App accessible via URL

## 🎯 Next Steps

Setelah auto-deploy setup:

1. **Update manifest.json** dengan Vercel URL
2. **Test Mini App** di production URL
3. **Submit untuk Base verification** (lihat verification-guide.md)
4. **Monitor deployments** di Vercel dashboard

---

**Auto-deploy setup selesai! Sekarang setiap push ke GitHub akan auto-deploy ke Vercel.** 🚀
