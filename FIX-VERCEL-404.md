# 🔧 Fix Vercel 404 Error

Jika mendapat error 404 di Vercel, kemungkinan root directory belum di-set dengan benar.

## 🚨 Problem

Vercel mencoba serve dari root project, tapi Mini App ada di folder `mini-app/`.

## ✅ Solution: Update Vercel Settings

### Option 1: Via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - https://vercel.com/dashboard
   - Click project `join-base-builder`

2. **Go to Settings**
   - Click "Settings" tab
   - Scroll ke "Root Directory"

3. **Set Root Directory**
   - Click "Edit"
   - Select "Set Root Directory"
   - Enter: `mini-app`
   - Click "Save"

4. **Redeploy**
   - Go to "Deployments" tab
   - Click "..." pada deployment terbaru
   - Click "Redeploy"
   - Atau push commit baru ke GitHub (auto-redeploy)

### Option 2: Via vercel.json (Alternative)

File `vercel.json` sudah dibuat di root dengan konfigurasi untuk serve dari `mini-app/`.

Jika masih error, coba:

1. **Delete vercel.json dari root** (jika ada)
2. **Use Vercel Dashboard settings** (Option 1) - lebih reliable

## ✅ Verify Fix

Setelah update settings:

1. Wait untuk redeploy selesai
2. Check URL: https://join-base-builder.vercel.app
3. Should see Mini App, bukan 404

## 🔍 Alternative: Move Files to Root

Jika masih masalah, bisa move files dari `mini-app/` ke root:

```bash
# Backup dulu
# Lalu move files
# Tapi ini tidak recommended karena struktur project jadi berantakan
```

**Better: Use Vercel Dashboard settings (Option 1)**

## 📝 Checklist

- [ ] Go to Vercel Dashboard
- [ ] Settings → Root Directory
- [ ] Set ke `mini-app`
- [ ] Save
- [ ] Redeploy
- [ ] Test URL
- [ ] Should work! ✅

---

**Coba Option 1 dulu - itu yang paling reliable!** 🚀
