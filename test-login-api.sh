#!/bin/bash

echo "====================================="
echo "Testing Login with Created Accounts"
echo "====================================="
echo ""

# Test Admin Login
echo "1. Testing admin login (admin@uknf.gov.pl)..."
ADMIN_LOGIN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@uknf.gov.pl",
    "password": "Admin123!"
  }')

echo "Admin Login Response:"
echo "$ADMIN_LOGIN" | jq '.' 2>/dev/null || echo "$ADMIN_LOGIN"
echo ""

# Test Normal User Login  
echo "2. Testing normal user login (user@example.com)..."
USER_LOGIN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "User123!"
  }')

echo "User Login Response:"
echo "$USER_LOGIN" | jq '.' 2>/dev/null || echo "$USER_LOGIN"
echo ""

echo "====================================="
echo "Testing Complete!"
echo "====================================="
