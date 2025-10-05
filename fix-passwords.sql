-- SQL Script to fix password hashes for Admin and Normal User accounts
-- Using BCrypt workFactor 12 to match backend PasswordHasher

-- Update admin password hash
UPDATE Users 
SET PasswordHash = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TuWJcz3KxXo3b4kHLN3FUlYxXvKe', 
    Role = 2, 
    IsActive = 1, 
    UpdatedAt = GETDATE()
WHERE Email = 'admin@uknf.gov.pl';

PRINT 'Admin password updated';

-- Update normal user password hash
UPDATE Users 
SET PasswordHash = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TuWJcz3KxXo3b4kHLN3FUlYxXvKe', 
    IsActive = 1, 
    UpdatedAt = GETDATE()
WHERE Email = 'user@example.com';

PRINT 'User password updated';

-- Verify accounts
SELECT Email, FirstName, LastName, Role, IsActive, 
       LEFT(PasswordHash, 20) + '...' AS PasswordHashPreview
FROM Users
WHERE Email IN ('admin@uknf.gov.pl', 'user@example.com')
ORDER BY Role DESC;
