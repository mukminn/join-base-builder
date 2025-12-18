# ⚡ Quick Update - Vercel URL

Setelah Vercel terhubung dan deployment selesai, update manifest.json dengan Vercel URL Anda.

## 🚀 Cara Cepat

### 1. Dapatkan Vercel URL

Cek di Vercel Dashboard atau deployment logs. URL biasanya seperti:
- `https://join-base-builder-mini-app.vercel.app`
- atau `https://join-base-builder-xxxxx.vercel.app`

### 2. Update dengan Script (Paling Mudah)

```powershell
.\update-vercel-url.ps1 -VercelUrl "https://your-vercel-url.vercel.app"
```

Script akan otomatis update manifest.json!

### 3. Commit & Push

```bash
git add mini-app/manifest.json
git commit -m "Update manifest with Vercel URL"
git push
```

Vercel akan auto-deploy update! ✅

---

**Atau berikan Vercel URL Anda, saya akan update manifest.json untuk Anda!** 🚀
