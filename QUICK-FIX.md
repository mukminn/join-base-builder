# ⚡ Quick Fix - Server Tidak Merespon

## 🔧 Solusi Cepat

### Step 1: Stop Semua Server yang Lama

```powershell
# Kill semua Python process
Get-Process python -ErrorAction SilentlyContinue | Stop-Process -Force

# Atau kill process di port 9000
netstat -ano | findstr :9000
# Copy PID, lalu:
taskkill /PID <PID> /F
```

### Step 2: Start Server Baru (Pilih salah satu)

#### Option A: Python (Paling Mudah)
```powershell
cd "C:\Users\mukmin\Desktop\join builder base\mini-app"
python -m http.server 9000
```

**Jangan tutup terminal ini!** Biarkan running.

#### Option B: Node.js
```powershell
cd "C:\Users\mukmin\Desktop\join builder base\mini-app"
node server.js
```

### Step 3: Verify Server Running

Di terminal, Anda harus melihat:
```
Serving HTTP on :: port 9000 (http://[::]:9000/) ...
```

### Step 4: Test di Browser

1. **Buka browser baru** (atau incognito untuk avoid cache)
2. **Akses**: http://localhost:9000
3. **Buka Console** (F12) untuk cek errors

### Step 5: Jika Masih Tidak Bisa

#### Cek Firewall
- Windows Firewall mungkin block
- Allow Python/Node.js through firewall

#### Coba Port Lain
```powershell
cd mini-app
python -m http.server 9001
# Akses: http://localhost:9001
```

#### Clear Browser Cache
- Ctrl+Shift+Delete
- Clear cache
- Refresh page

## ✅ Checklist

- [ ] Server running (lihat output di terminal)
- [ ] Port 9000 tidak digunakan aplikasi lain
- [ ] File index.html ada di mini-app/
- [ ] Browser tidak di-cache (try incognito)
- [ ] Firewall tidak block
- [ ] URL benar: http://localhost:9000 (bukan https)

---

**Pastikan terminal tetap open dan server running!** 🚀
