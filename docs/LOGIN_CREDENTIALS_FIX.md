# URGENT FIX: Login Credentials and Labels Issue

**Date**: October 4, 2025  
**Issue 1**: Login credentials not working  
**Issue 2**: Labels reportedly broken

---

## ❌ PROBLEM: NO DEFAULT USERS IN DATABASE

**Root Cause**: The backend does NOT have any seeded users in the database. You cannot log in because no users exist yet!

---

## ✅ SOLUTION 1: Register a New User First

### Step 1: Navigate to Registration Tab

1. Go to: http://localhost:4200/auth
2. Click the **"Rejestracja"** tab (second tab)

### Step 2: Fill Registration Form

Use these test credentials:

```
First Name: Test
Last Name: Admin
PESEL: 12345678901 (11 digits)
Phone: 123-456-789
Email: test@admin.com
Password: Test123!
Confirm Password: Test123!
```

### Step 3: Click "Zarejestruj się"

The system will:
1. Create your user account
2. Automatically log you in
3. Navigate to the dashboard

---

## ✅ SOLUTION 2: Add Database Seed (Recommended)

I'll create a database seed with a default admin user for you.

### Create Seed File

File: `Backend/Infrastructure/Persistence/ApplicationDbContextSeed.cs`

```csharp
using Backend.Domain.Entities;
using BCrypt.Net;

namespace Backend.Infrastructure.Persistence
{
    public static class ApplicationDbContextSeed
    {
        public static async Task SeedAsync(ApplicationDbContext context)
        {
            // Check if users already exist
            if (context.Users.Any())
            {
                return; // Database already seeded
            }

            // Create default admin user
            var adminUser = new User
            {
                Id = Guid.NewGuid(),
                Email = "admin@uknf.gov.pl",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!", 12),
                FirstName = "Admin",
                LastName = "UKNF",
                PhoneNumber = "123456789",
                Role = UserRole.Administrator,
                IsActive = true,
                EmailConfirmed = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            // Create default test user
            var testUser = new User
            {
                Id = Guid.NewGuid(),
                Email = "user@test.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("User123!", 12),
                FirstName = "Jan",
                LastName = "Kowalski",
                PhoneNumber = "987654321",
                Role = UserRole.User,
                IsActive = true,
                EmailConfirmed = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            context.Users.AddRange(adminUser, testUser);
            await context.SaveChangesAsync();
        }
    }
}
```

### Update Program.cs to Call Seed

Add this code after `app.Run()` section:

```csharp
// Seed database
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();
        await context.Database.MigrateAsync(); // Apply migrations
        await ApplicationDbContextSeed.SeedAsync(context); // Seed data
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while seeding the database.");
    }
}

app.Run();
```

---

## 🔍 ISSUE 2: Labels - What's Wrong?

Please provide:
1. **Screenshot** of the broken labels
2. **Which page?** Login or Registration?
3. **What's wrong specifically?**
   - Labels overlapping?
   - Labels not showing?
   - Labels in wrong position?

### Quick Check: Clear Browser Cache

Labels might be cached from before the fix:

```
1. Press Ctrl + Shift + Delete
2. Select "Cached images and files"
3. Click "Clear data"
4. Refresh page (Ctrl + F5)
```

---

## 🚀 QUICK FIX: Use Registration Instead of Login

**Since no users exist, you MUST register first!**

### Correct Flow:

```
1. Go to http://localhost:4200/auth
   ↓
2. Click "Rejestracja" tab
   ↓
3. Fill out form (use test data above)
   ↓
4. Click "Zarejestruj się"
   ↓
5. Account created + Auto login
   ↓
6. Navigated to dashboard
   ↓
✅ SUCCESS!
```

---

## 📝 Default Credentials (AFTER SEEDING)

If you implement the database seed above:

### Admin Account:
```
Email: admin@uknf.gov.pl
Password: Admin123!
Role: Administrator
```

### Test User Account:
```
Email: user@test.com
Password: User123!
Role: User
```

---

## 🔧 How to Implement Seed

### Option A: Quick Test (Just Register)
1. Use registration form
2. Create your own account
3. No code changes needed

### Option B: Production Setup (Add Seed)
1. Create `ApplicationDbContextSeed.cs` file
2. Update `Program.cs` to call seed method
3. Rebuild backend container
4. Database will have default users

**Commands to rebuild:**
```bash
cd "c:\Users\Kuba\Desktop\HackYeah 2025"
wsl docker-compose down
wsl docker-compose up --build -d
```

Wait 30 seconds, then try logging in with `admin@uknf.gov.pl` / `Admin123!`

---

## ⚠️ Important Notes

### Why Login Doesn't Work:
- **No users exist in database** (not seeded)
- **Must register first** or implement seed
- This is normal for fresh deployments

### About Labels:
- I did NOT change any label HTML in my last commits
- Labels should work exactly as before
- The only changes were:
  - Added console.log() statements
  - Added setTimeout() around navigation
  - NO CSS or HTML structure changes to forms

If labels are truly broken, it's likely:
1. Browser cache issue (solution: clear cache)
2. Docker build used old files (solution: rebuild)
3. Something else unrelated to my changes

---

## 📞 Next Steps

### 1. Try Registration NOW:

Go to: http://localhost:4200/auth  
Click: "Rejestracja" tab  
Fill form and register

### 2. Report Back:

Tell me:
- ✅ Did registration work?
- ✅ Were you logged in automatically?
- ✅ Did you see the dashboard?
- ✅ What exactly is wrong with the labels? (screenshot?)

### 3. If Registration Doesn't Work:

Check browser console for errors:
- Press F12
- Click Console tab
- Try registration
- Copy/paste any red errors

---

## 🎯 Summary

**Login Problem**: No users in database - **USE REGISTRATION**  
**Labels Problem**: Need more info - likely browser cache

**Action Required**: Try registration NOW and report results!

---

**Created**: October 4, 2025  
**Status**: Awaiting user test via registration  
**Next**: Report registration results + label screenshot

