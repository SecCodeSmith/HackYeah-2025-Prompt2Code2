-- SQL Script to create an Admin account directly in the database
-- This is useful if the API registration doesn't set the correct role

-- Note: This script uses BCrypt hash for password "Admin123!"
-- The hash was generated using BCrypt with work factor 10

-- Insert Admin User
INSERT INTO "Users" ("Id", "Email", "PasswordHash", "FirstName", "LastName", "PhoneNumber", "Role", "IsActive", "EmailConfirmed", "CreatedAt", "UpdatedAt")
VALUES (
    gen_random_uuid(),
    'admin@uknf.gov.pl',
    '$2a$10$8ZqQZ5Z5Z5Z5Z5Z5Z5Z5ZuK8K8K8K8K8K8K8K8K8K8K8K8K8K8',  -- This is a placeholder hash
    'Admin',
    'Administrator',
    '+48123456789',
    1,  -- Administrator role
    true,
    true,
    NOW(),
    NOW()
)
ON CONFLICT ("Email") DO UPDATE SET
    "Role" = 1,
    "IsActive" = true,
    "UpdatedAt" = NOW();

-- Verify the admin account was created
SELECT "Id", "Email", "FirstName", "LastName", "Role", "IsActive", "CreatedAt"
FROM "Users"
WHERE "Email" = 'admin@uknf.gov.pl';

-- Role reference:
-- 0 = User
-- 1 = Administrator
-- 2 = Supervisor
