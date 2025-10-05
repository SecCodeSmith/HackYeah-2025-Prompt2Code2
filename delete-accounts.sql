-- Delete existing test accounts
DELETE FROM Users WHERE Email IN ('admin@uknf.gov.pl', 'user@example.com');

-- Show result
SELECT 'Accounts deleted successfully' AS Result;
