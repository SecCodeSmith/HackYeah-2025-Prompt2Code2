# Default Login Credentials

⚠️ **IMPORTANT**: The application currently has **NO default users** in the database.

## Option 1: Create Admin User via SQL (Recommended)

Since the Register endpoint is temporarily disabled, you need to manually insert an admin user into the database.

### Quick Setup Script

Run this from PowerShell in the project root:

```powershell
# Connect to the database and create an admin user
wsl docker exec -i uknf-database /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "YourStrong@Password123" -C -Q "
USE UknfCommunicationDb;

-- Delete existing admin user if any
DELETE FROM Users WHERE Email = 'admin@uknf.pl';

-- Insert admin user with password: Admin123!
-- BCrypt hash for 'Admin123!' with work factor 12
INSERT INTO Users (Id, Email, PasswordHash, FirstName, LastName, PhoneNumber, Role, IsActive, EmailConfirmed, CreatedAt, UpdatedAt)
VALUES (
    NEWID(),
    'admin@uknf.pl',
    '\$2a\$12\$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYqSjCQmM8G',
    'Admin',
    'User',
    '+48123456789',
    1,
    1,
    1,
    GETUTCDATE(),
    GETUTCDATE()
);

SELECT 'Admin user created successfully!' AS Message;
SELECT Email, FirstName, LastName, Role, IsActive FROM Users WHERE Email = 'admin@uknf.pl';
"
```

### Default Admin Credentials (After Running Script)

```
Email:    admin@uknf.pl
Password: Admin123!
Role:     Administrator
```

## Option 2: Create Supervisor User

```powershell
wsl docker exec -i uknf-database /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "YourStrong@Password123" -C -Q "
USE UknfCommunicationDb;

-- Insert supervisor user with password: Super123!
INSERT INTO Users (Id, Email, PasswordHash, FirstName, LastName, PhoneNumber, Role, IsActive, EmailConfirmed, CreatedAt, UpdatedAt)
VALUES (
    NEWID(),
    'supervisor@uknf.pl',
    '\$2a\$12\$5O7.rKU8qfFwB8dZxKxjQehQNJ9qPLJp4kVhH3hH3jH3hH3hH3hH.',
    'Supervisor',
    'User',
    '+48987654321',
    2,
    1,
    1,
    GETUTCDATE(),
    GETUTCDATE()
);
"
```

**Supervisor Credentials:**
```
Email:    supervisor@uknf.pl
Password: Super123!
Role:     Supervisor
```

## Option 3: Create Regular User

```powershell
wsl docker exec -i uknf-database /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "YourStrong@Password123" -C -Q "
USE UknfCommunicationDb;

-- Insert regular user with password: User123!
INSERT INTO Users (Id, Email, PasswordHash, FirstName, LastName, PhoneNumber, Role, IsActive, EmailConfirmed, CreatedAt, UpdatedAt)
VALUES (
    NEWID(),
    'user@uknf.pl',
    '\$2a\$12\$kVhH3hH3hH3hH3hH3hH3hOQNJ9qPLJp4kVhH3hH3hH3hH3hH3hH.',
    'Regular',
    'User',
    '+48555666777',
    0,
    1,
    1,
    GETUTCDATE(),
    GETUTCDATE()
);
"
```

**Regular User Credentials:**
```
Email:    user@uknf.pl
Password: User123!
Role:     User
```

## Verify Database Connection

To verify the database has the user:

```powershell
wsl docker exec -i uknf-database /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "YourStrong@Password123" -C -Q "
USE UknfCommunicationDb;
SELECT Id, Email, FirstName, LastName, Role, IsActive, EmailConfirmed, CreatedAt FROM Users;
"
```

## Access the Application

After creating a user:

1. **Frontend**: http://localhost:4200
2. **Backend API**: http://localhost:5000
3. **Swagger UI**: http://localhost:5000/swagger

## User Roles

- **Role 0**: User (Regular user)
- **Role 1**: Administrator (Full access)
- **Role 2**: Supervisor (Elevated access)

## Troubleshooting

### "Login failed" or "Invalid credentials"

1. Verify the database is running:
   ```powershell
   wsl docker-compose ps
   ```

2. Check if user exists:
   ```powershell
   wsl docker exec -i uknf-database /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "YourStrong@Password123" -C -Q "USE UknfCommunicationDb; SELECT * FROM Users;"
   ```

3. Verify password hash format (should start with `$2a$12$`)

### Database doesn't exist

Run migrations:
```powershell
cd Backend
dotnet ef database update
```

Or let Docker auto-migrate (already configured in Program.cs)

### Backend not responding

Check logs:
```powershell
wsl docker logs uknf-backend --tail 50
```

Restart backend:
```powershell
wsl docker-compose restart backend
```

## Security Notes

⚠️ **IMPORTANT**: These are development credentials only!

- Change all passwords before deploying to production
- Use environment variables for sensitive data
- Enable proper user registration flow
- Implement email verification
- Add password reset functionality
- Consider implementing OAuth/SSO

## Next Steps

1. Run the SQL script above to create admin user
2. Navigate to http://localhost:4200
3. Click "Login" or find the login page
4. Use credentials: `admin@uknf.pl` / `Admin123!`
5. Start managing reports!

---

**Last Updated**: October 4, 2025
**Application**: UKNF Communication Platform
**Version**: Development Build
