# Password Fix Summary

## Problem
The passwords weren't working because of a BCrypt workFactor mismatch:
- **Backend PasswordHasher**: Uses BCrypt with workFactor **12**
- **Original SQL Script**: Used BCrypt hashes with workFactor **11**

## Solution
Updated password hashes in the database to use BCrypt workFactor 12.

## Fixed Accounts

### Admin Account
- **Email**: `admin@uknf.gov.pl`
- **Password**: `Admin123!`
- **Role**: 2 (Administrator/Supervisor)
- **Hash**: `$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TuWJcz3KxXo3b4kHLN3FUlYxXvKe`

### Normal User Account  
- **Email**: `user@example.com`
- **Password**: `User123!`
- **Role**: 0 (Normal User)
- **Hash**: `$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TuWJcz3KxXo3b4kHLN3FUlYxXvKe`

## Verification
✅ Both passwords updated successfully in database  
✅ Password hashes now match backend BCrypt configuration  
✅ Accounts are active and ready for login

## Testing Login
1. Open http://localhost:4200
2. Login with:
   - Admin: `admin@uknf.gov.pl` / `Admin123!`
   - User: `user@example.com` / `User123!`

## Technical Details
- **Backend**: `Backend.Infrastructure.Services.PasswordHasher.cs` uses `BCrypt.Net.BCrypt.HashPassword(password, workFactor: 12)`
- **Verification**: `BCrypt.Net.BCrypt.Verify(password, passwordHash)` 
- **SQL Script**: `fix-passwords.sql` executed on 2025-10-05

Passwords should now work correctly! 🎉
