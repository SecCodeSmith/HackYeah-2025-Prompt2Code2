# 🚀 Quick Start Guide - HackYeah 2025

## Prerequisites Check

Before starting, make sure you have:
- [x] .NET 9.0 SDK installed → `dotnet --version`
- [x] Node.js installed → `node --version` (Required for Angular)
- [ ] npm installed → `npm --version` (Comes with Node.js)

## ⚡ 3-Step Setup

### Step 1: Install Node.js (if not installed)

**Node.js is required for the Angular frontend!**

1. Download from: https://nodejs.org/
2. Install the LTS (Long Term Support) version
3. Verify installation: `node --version` and `npm --version`

### Step 2: Setup Frontend

```powershell
# Navigate to Frontend directory
cd Frontend

# Install dependencies
npm install

# This will take a few minutes the first time
```

### Step 3: Run the Application

**Terminal 1 - Backend:**
```powershell
cd Backend
dotnet run
```

**Terminal 2 - Frontend:**
```powershell
cd Frontend
npm start
```

## 🎯 Access Points

Once both servers are running:

- **Frontend Application**: http://localhost:4200
- **Backend API**: http://localhost:5000
- **Test Endpoint**: http://localhost:5000/api/test

## ✅ Verify Setup

1. Open http://localhost:4200 in your browser
2. You should see "HackYeah 2025" homepage
3. The "Backend Connection Status" should show "Connected to .NET backend successfully!"

## 🐛 Troubleshooting

### Node.js Not Installed?

If you see "node: The term 'node' is not recognized":
1. Download Node.js from https://nodejs.org/
2. Install it
3. Restart your terminal
4. Try again

### Port Already in Use?

**Backend (Port 5000):**
```powershell
netstat -ano | findstr :5000
taskkill /PID <process_id> /F
```

**Frontend (Port 4200):**
```powershell
# Run on different port
npm start -- --port 4201
```

### Backend CORS Errors?

Make sure:
1. Backend is running on port 5000
2. Frontend is running on port 4200
3. Both are running simultaneously

## 📚 Next Steps

1. Read the main [README.md](README.md) for detailed documentation
2. Check [Backend/README.md](Backend/README.md) for API documentation
3. Check [Frontend/README.md](Frontend/README.md) for Angular guidelines
4. Start building your HackYeah project! 🎉

## 🆘 Need Help?

Common issues and solutions are documented in:
- Main README.md → Troubleshooting section
- Backend/README.md → Common Issues section
- Frontend/README.md → Common Issues section

---

**Happy Hacking! 💻✨**
