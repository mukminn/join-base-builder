# 🧪 Test Server - Troubleshooting

Jika web tidak merespon, ikuti langkah ini:

## 1. Cek Server Running

```bash
# Cek port 9000
netstat -ano | findstr :9000

# Cek Python process
Get-Process python -ErrorAction SilentlyContinue
```

## 2. Stop Server yang Lama

```bash
# Kill Python process di port 9000
# Cari PID dari netstat, lalu:
taskkill /PID <PID> /F
```

## 3. Start Server Baru

### Option A: Python (Recommended)
```bash
cd mini-app
python -m http.server 9000
```

### Option B: Node.js
```bash
cd mini-app
node server.js
```

## 4. Verify Files

Pastikan file ada:
```bash
# Cek index.html
Test-Path mini-app\index.html

# List files
ls mini-app\
```

## 5. Test di Browser

1. Buka: http://localhost:9000
2. Buka browser console (F12)
3. Check untuk errors
4. Check Network tab

## 6. Alternative: Gunakan Port Lain

```bash
# Port 9001
cd mini-app
python -m http.server 9001
# Akses: http://localhost:9001
```

## 7. Check Firewall

Jika masih tidak bisa:
- Check Windows Firewall
- Allow Python/Node.js through firewall
- Try disable firewall temporarily untuk test

---

**Pastikan server running dan file ada sebelum test!** 🚀
