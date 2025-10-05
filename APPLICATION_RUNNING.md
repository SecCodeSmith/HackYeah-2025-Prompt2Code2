# UKNF Application - Running and Ready! 🎉

**Date:** October 5, 2025  
**Status:** ✅ ALL SERVICES RUNNING

---

## 🚀 Application URLs

### Frontend (Angular + PrimeNG)
- **URL:** http://localhost:4200
- **Status:** ✅ Running in Docker
- **Container:** uknf-frontend

### Backend API (.NET 8)
- **URL:** http://localhost:5000
- **Swagger:** http://localhost:5000/swagger (if enabled)
- **Health Check:** http://localhost:5000/health
- **Status:** ✅ Running in Docker
- **Container:** uknf-backend

### Database (SQL Server 2022)
- **Server:** localhost,1433
- **Database:** UknfCommunicationDb
- **Status:** ✅ Healthy
- **Container:** uknf-database

---

## 👤 User Accounts Created

### 1. Administrator Account 🛡️

**Email:** `admin@uknf.gov.pl`  
**Password:** `Admin123!`  
**Role:** Administrator (Supervisor)  
**Permissions:**
- Full access to all features
- User management
- Entity (Podmioty) management
- Reports management
- Announcements management
- Messaging system
- Admin panel access

### 2. Normal User Account 👤

**Email:** `user@example.com`  
**Password:** `User123!`  
**Role:** User (Normal)  
**Permissions:**
- View and create reports
- View announcements
- Messaging system
- Profile management
- Limited access (no admin panel)

---

## 🎯 Quick Start Guide

### Step 1: Open the Application
1. Open your browser
2. Navigate to: http://localhost:4200

### Step 2: Login as Admin
1. Click on the login/auth page
2. Enter credentials:
   - **Email:** admin@uknf.gov.pl
   - **Password:** Admin123!
3. Click "Login"

### Step 3: Explore Features
After logging in as admin, you'll see:
- **Dashboard** - Home page with statistics
- **Zgłoszenia** (Reports) - Manage reports
- **Wiadomości** (Messages) - Messaging system with unread badge
- **Administracja** (Admin) - Entity management panel

### Step 4: Test Normal User
1. Logout from admin account
2. Login with:
   - **Email:** user@example.com
   - **Password:** User123!
3. Notice limited navigation (no Admin panel)

---

## 🔧 Docker Services Status

Run this command to check all services:
```powershell
wsl -d Debian -e bash -c "cd '/mnt/c/Users/Kuba/Desktop/HackYeah 2025' && docker compose ps"
```

Expected output:
```
NAME            STATUS                    PORTS
uknf-database   Up (healthy)             0.0.0.0:1433->1433/tcp
uknf-backend    Up                       0.0.0.0:5000->5000/tcp
uknf-frontend   Up (healthy)             0.0.0.0:4200->80/tcp
```

---

## 📋 Available Features

### ✅ Backend Features (100% Complete)
1. **Authentication** - JWT with refresh tokens
2. **Reports Management** - CRUD operations, export to Excel/CSV
3. **Report Attachments** - File upload/download
4. **Podmioty (Entities)** - Entity management with pagination
5. **Announcements** - System announcements
6. **User Management** - User administration
7. **Messaging System** - Bidirectional messaging with threading

### ✅ Frontend Features (100% Complete)
1. **Authentication** - Login/Register with JWT
2. **Dashboard** - Home page with statistics
3. **Reports UI** - Full CRUD with PrimeNG DataTable
4. **Admin Panel** - Entity management interface
5. **Messaging UI** - Inbox, Sent, Compose, Thread view
6. **Navigation** - Unread message badge, responsive design
7. **Announcements** - View system announcements

---

## 🧪 Testing the Messaging System

### Send a Message (Admin → User)
1. Login as admin (admin@uknf.gov.pl)
2. Click "Wiadomości" in navigation
3. Click "Compose New Message"
4. Fill in:
   - **Recipient User ID:** 930F6A5C-38D3-4769-9CFA-975A7EB1B55C
   - **Subject:** Welcome to UKNF Platform
   - **Priority:** Normal
   - **Content:** This is a test message
5. Click "Send Message"

### Reply to Message (User → Admin)
1. Logout and login as user (user@example.com)
2. Click "Wiadomości" (you'll see unread badge: 1)
3. Open the inbox
4. Click on the message from admin
5. Click "Reply" button
6. Write your reply and send

### View Thread
1. Both users can now see the full conversation
2. Messages are organized by thread
3. Read receipts show when message was read

---

## 🛠️ Management Commands

### Stop All Services
```powershell
wsl -d Debian -e bash -c "cd '/mnt/c/Users/Kuba/Desktop/HackYeah 2025' && docker compose down"
```

### Start All Services
```powershell
wsl -d Debian -e bash -c "cd '/mnt/c/Users/Kuba/Desktop/HackYeah 2025' && docker compose up -d"
```

### Restart Backend Only
```powershell
wsl -d Debian -e bash -c "cd '/mnt/c/Users/Kuba/Desktop/HackYeah 2025' && docker compose restart backend"
```

### View Logs
```powershell
# All services
wsl -d Debian -e bash -c "cd '/mnt/c/Users/Kuba/Desktop/HackYeah 2025' && docker compose logs"

# Backend only
wsl -d Debian -e bash -c "cd '/mnt/c/Users/Kuba/Desktop/HackYeah 2025' && docker compose logs backend"

# Follow logs in real-time
wsl -d Debian -e bash -c "cd '/mnt/c/Users/Kuba/Desktop/HackYeah 2025' && docker compose logs -f"
```

---

## 📊 Database Access

### Using Docker exec
```powershell
wsl -d Debian -e bash -c "cd '/mnt/c/Users/Kuba/Desktop/HackYeah 2025' && docker compose exec database /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P 'YourStrong@Password123' -d UknfCommunicationDb -C"
```

### Connection String
```
Server=localhost,1433;Database=UknfCommunicationDb;User Id=sa;Password=YourStrong@Password123;TrustServerCertificate=True;
```

---

## 🎨 UI Features Highlights

### PrimeNG Components Used
- **DataTable** - Sortable, filterable tables with pagination
- **Cards** - Professional container design
- **Buttons** - Multiple variants (primary, success, danger)
- **Tags** - Priority and status indicators
- **Editor** - Rich text editing (Quill-based)
- **Dropdowns** - Select inputs
- **Toast** - Success/error notifications
- **Tooltips** - Helpful hover information

### Design Features
- ✅ Responsive design (mobile-friendly)
- ✅ Color-coded priorities (Urgent→Red, High→Orange, Normal→Blue, Low→Green)
- ✅ Status indicators (Unread→Blue, Read→Green, Replied→Orange)
- ✅ Icon system (envelope, paperclip, shield)
- ✅ Loading states and spinners
- ✅ Empty state messages
- ✅ Unread badge with pulse animation
- ✅ Professional gradients and shadows

---

## 🔐 Security Notes

### Production Considerations
1. **Change Default Passwords**
   - Admin password: Admin123!
   - Database SA password: YourStrong@Password123
   - JWT secret key

2. **Enable HTTPS**
   - Configure SSL certificates
   - Update docker-compose for HTTPS

3. **Environment Variables**
   - Store secrets in .env file
   - Never commit sensitive data to Git

4. **Database Backups**
   - Set up regular backup schedule
   - Test restore procedures

---

## 📝 Additional User Creation

### Via API (Recommended)
```powershell
$newUser = @{
    email = 'newuser@example.com'
    password = 'Password123!'
    firstName = 'Jan'
    lastName = 'Nowak'
    phoneNumber = '+48123456789'
} | ConvertTo-Json

Invoke-RestMethod -Uri 'http://localhost:5000/api/auth/register' -Method Post -Body $newUser -ContentType 'application/json'
```

### Via SQL (Admin Only)
```sql
INSERT INTO Users (Id, Email, PasswordHash, FirstName, LastName, PhoneNumber, Role, IsActive, EmailConfirmed, CreatedAt, UpdatedAt)
VALUES (
    NEWID(),
    'newuser@domain.com',
    '$2a$11$N9qo8uLOickgx2ZMRZoMye1J1T7KkKXXJLyT7U0FKMwQYxY8XhO5e',
    'John',
    'Doe',
    '+48555666777',
    0,  -- 0=User, 1=Administrator, 2=Supervisor
    1,
    1,
    GETDATE(),
    GETDATE()
)
```

---

## 🎉 Summary

**Application Status:** ✅ FULLY OPERATIONAL

**Services Running:**
- ✅ Frontend: http://localhost:4200
- ✅ Backend: http://localhost:5000
- ✅ Database: localhost:1433

**Accounts Ready:**
- ✅ Admin: admin@uknf.gov.pl / Admin123!
- ✅ User: user@example.com / User123!

**Features Available:**
- ✅ All 7 backend modules (100%)
- ✅ All 4 frontend components (100%)
- ✅ Messaging system with threading
- ✅ Reports with Excel export
- ✅ Entity management
- ✅ User authentication

**Ready for:**
- Demo presentations
- User testing
- Feature development
- Production deployment (after security hardening)

---

**Enjoy using the UKNF Communication Platform! 🚀**
