# 🚀 Cara Start Server

Jika server tidak running, ikuti langkah ini:

## Method 1: Menggunakan npm (Recommended)

```bash
# Dari root project
npm run dev
```

## Method 2: Manual Start

```bash
# Masuk ke folder mini-app
cd mini-app

# Jalankan server
node server.js
```

## Method 3: Dengan Port Custom

```bash
# Port 9001
cd mini-app
PORT=9001 node server.js

# Port 9002
PORT=9002 node server.js
```

## ✅ Verify Server Running

Setelah start, Anda harus melihat:

```
Serving from: C:\Users\mukmin\Desktop\join builder base\mini-app

🚀 Server running at http://localhost:9000/
📱 Open in browser: http://localhost:9000/

Press Ctrl+C to stop the server
```

## 🐛 Troubleshooting

### Server tidak start

1. **Check Node.js installed:**
   ```bash
   node --version
   ```

2. **Check file exists:**
   ```bash
   ls mini-app/server.js
   ```

3. **Check port available:**
   ```bash
   netstat -ano | findstr :9000
   ```

### Port sudah digunakan

Gunakan port lain:
```bash
PORT=9001 cd mini-app && node server.js
```

### File tidak ditemukan

Pastikan Anda di root project:
```bash
cd "C:\Users\mukmin\Desktop\join builder base"
npm run dev
```

---

**Pastikan server running sebelum akses http://localhost:9000!** 🚀
