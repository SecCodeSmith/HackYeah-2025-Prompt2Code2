#!/bin/bash

# Register Admin Account
echo "Registering admin account..."
ADMIN_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@uknf.gov.pl",
    "password": "Admin123!",
    "confirmPassword": "Admin123!",
    "firstName": "Admin",
    "lastName": "Administrator",
    "phoneNumber": "+48123456789"
  }')

echo "Admin Response: $ADMIN_RESPONSE"
echo ""

# Register Normal User Account
echo "Registering normal user account..."
USER_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "User123!",
    "confirmPassword": "User123!",
    "firstName": "Jan",
    "lastName": "Kowalski",
    "phoneNumber": "+48987654321"
  }')

echo "User Response: $USER_RESPONSE"
echo ""

echo "Account creation completed!"
