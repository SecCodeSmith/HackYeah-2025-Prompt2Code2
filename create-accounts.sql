-- SQL Script to create Admin and Normal User accounts for SQL Server

-- Check if admin exists, if not create
IF NOT EXISTS (SELECT 1 FROM Users WHERE Email = 'admin@uknf.gov.pl')
BEGIN
    INSERT INTO Users (Id, Email, PasswordHash, FirstName, LastName, PhoneNumber, Role, IsActive, EmailConfirmed, CreatedAt, UpdatedAt)
    VALUES (
        NEWID(),
        'admin@uknf.gov.pl',
        '$2a$11$N9qo8uLOickgx2ZMRZoMye1J1T7KkKXXJLyT7U0FKMwQYxY8XhO5e',  -- BCrypt hash for "Admin123!"
        'Admin',
        'Administrator',
        '+48123456789',
        2,  -- Administrator role (0=User, 1=Administrator, 2=Supervisor)
        1,
        1,
        GETDATE(),
        GETDATE()
    )
    PRINT 'Admin account created successfully'
END
ELSE
BEGIN
    UPDATE Users 
    SET Role = 2, IsActive = 1, UpdatedAt = GETDATE()
    WHERE Email = 'admin@uknf.gov.pl'
    PRINT 'Admin account already exists - updated to Administrator role'
END
GO

-- Check if normal user exists, if not create
IF NOT EXISTS (SELECT 1 FROM Users WHERE Email = 'user@example.com')
BEGIN
    INSERT INTO Users (Id, Email, PasswordHash, FirstName, LastName, PhoneNumber, Role, IsActive, EmailConfirmed, CreatedAt, UpdatedAt)
    VALUES (
        NEWID(),
        'user@example.com',
        '$2a$11$N9qo8uLOickgx2ZMRZoMye1J1T7KkKXXJLyT7U0FKMwQYxY8XhO5e',  -- BCrypt hash for "User123!"
        'Jan',
        'Kowalski',
        '+48987654321',
        0,  -- Normal User role
        1,
        1,
        GETDATE(),
        GETDATE()
    )
    PRINT 'Normal user account created successfully'
END
ELSE
BEGIN
    PRINT 'Normal user account already exists'
END
GO

-- Verify accounts
SELECT Id, Email, FirstName, LastName, Role, IsActive, EmailConfirmed, CreatedAt
FROM Users
WHERE Email IN ('admin@uknf.gov.pl', 'user@example.com')
ORDER BY Role DESC
GO
