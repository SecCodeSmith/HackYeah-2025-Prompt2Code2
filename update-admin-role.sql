-- Update admin account to have Administrator role (Role 2)
UPDATE Users 
SET Role = 2, 
    UpdatedAt = GETDATE()
WHERE Email = 'admin@uknf.gov.pl';

PRINT 'Admin role updated to Administrator (Role 2)';

-- Verify both accounts
SELECT Email, FirstName, LastName, Role, IsActive, EmailConfirmed,
       CASE Role 
           WHEN 0 THEN 'User'
           WHEN 1 THEN 'Administrator'
           WHEN 2 THEN 'Supervisor'
           ELSE 'Unknown'
       END AS RoleName
FROM Users
WHERE Email IN ('admin@uknf.gov.pl', 'user@example.com')
ORDER BY Role DESC;
