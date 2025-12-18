# 🧪 Local Testing Guide

Panduan untuk test Mini App di local sebelum deploy ke Vercel.

## 🚀 Quick Start

### Option 1: Menggunakan npm script (Recommended)

```bash
# Dari root project
npm run dev

# Atau
npm run serve

# Atau
npm start
```

Server akan running di: **http://localhost:3000**

### Option 2: Menggunakan Node.js langsung

```bash
# Dari folder mini-app
cd mini-app
node server.js
```

### Option 3: Menggunakan Python (Alternatif)

```bash
# Python 3
cd mini-app
python -m http.server 8000

# Atau Python 2
python -m SimpleHTTPServer 8000
```

Server akan running di: **http://localhost:8000**

### Option 4: Menggunakan PHP (Alternatif)

```bash
cd mini-app
php -S localhost:8000
```

## ✅ Testing Checklist

Setelah server running, test semua fitur:

- [ ] Page loads correctly
- [ ] Connect Wallet button works
- [ ] MetaMask connects
- [ ] Network switches to Base
- [ ] Contract addresses loaded correctly
- [ ] Deposit function works
- [ ] Withdraw function works
- [ ] NFT mint works (jika contract deployed)
- [ ] Transaction history shows
- [ ] Mobile responsive (test di browser dev tools)

## 🔍 Debugging

### Browser Console

Buka browser console (F12) dan check:

1. **JavaScript Errors**
   - Check untuk red errors
   - Fix sebelum deploy

2. **Console Logs**
   - Check initialization logs
   - Verify contract addresses
   - Check wallet connection

3. **Network Tab**
   - Verify files loading
   - Check for 404 errors
   - Verify CORS (jika ada)

### Common Issues

#### 1. Contract Not Loading
- Check `config.js` - contract addresses correct?
- Check network is Base
- Verify contracts deployed

#### 2. Wallet Not Connecting
- MetaMask installed?
- Network is Base?
- Check browser console for errors

#### 3. Files Not Loading
- Check file paths
- Verify server running
- Check MIME types

## 🛠️ Development Workflow

1. **Make Changes**
   ```bash
   # Edit files di mini-app/
   ```

2. **Test Locally**
   ```bash
   npm run dev
   # Test di http://localhost:3000
   ```

3. **Fix Issues**
   - Check console
   - Fix errors
   - Test again

4. **Commit & Push**
   ```bash
   git add .
   git commit -m "Fix: description"
   git push
   ```

5. **Vercel Auto-Deploy**
   - Wait for deployment
   - Test production URL

## 📝 Tips

1. **Always test locally first**
   - Save Vercel build minutes
   - Faster iteration
   - Better debugging

2. **Use browser dev tools**
   - Mobile view testing
   - Network inspection
   - Console debugging

3. **Test different scenarios**
   - With MetaMask
   - Without MetaMask
   - Different networks
   - Mobile devices

## 🚫 Don't Deploy Until

- [ ] All features tested locally
- [ ] No console errors
- [ ] All buttons work
- [ ] Contracts connect
- [ ] Mobile responsive
- [ ] No 404 errors

## 📊 Server Info

- **Port**: 3000 (default)
- **URL**: http://localhost:3000
- **Files**: Serves from `mini-app/` folder
- **Hot Reload**: No (restart server after changes)

## 🔄 Restart Server

Setelah perubahan file:
1. Stop server: `Ctrl+C`
2. Start again: `npm run dev`

---

**Always test locally before deploying to Vercel!** 🚀
