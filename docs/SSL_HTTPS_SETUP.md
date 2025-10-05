# 🔒 SSL/HTTPS Configuration Guide

## Overview

This document provides instructions for enabling HTTPS/SSL in the UKNF Communication Platform for production deployment.

---

## Current Status

**Development Environment:** HTTP only (ports 4200, 5000)
**Production Ready:** HTTPS configuration prepared but commented out

---

## 🚀 Quick Start (Development with Self-Signed Certificate)

### Step 1: Generate Self-Signed Certificate

```powershell
# Create certificates directory
New-Item -ItemType Directory -Force -Path ".\certs"

# Generate self-signed certificate (Windows with OpenSSL)
wsl openssl req -x509 -newkey rsa:4096 -keyout certs/key.pem -out certs/cert.pem -days 365 -nodes -subj "/CN=localhost"

# Generate PFX certificate for .NET (optional)
wsl openssl pkcs12 -export -out certs/aspnetapp.pfx -inkey certs/key.pem -in certs/cert.pem -password pass:devcert
```

### Step 2: Enable HTTPS in docker-compose.yml

Uncomment the following lines in `docker-compose.yml`:

```yaml
# Backend service
environment:
  - ASPNETCORE_URLS=http://+:5000;https://+:5001  # Enable both HTTP and HTTPS
  - ASPNETCORE_Kestrel__Certificates__Default__Password=devcert
  - ASPNETCORE_Kestrel__Certificates__Default__Path=/https/aspnetapp.pfx
ports:
  - "5001:5001"  # Expose HTTPS port
volumes:
  - ./certs:/https:ro  # Mount certificate directory
```

### Step 3: Enable HTTPS in Backend Program.cs

Uncomment in `Backend/Backend.API/Program.cs`:

```csharp
app.UseHttpsRedirection();
```

### Step 4: Enable HTTPS in Frontend nginx.conf

In `Frontend/nginx.conf`:

1. **Uncomment the HTTPS server block** (lines 35-77)
2. **Uncomment the HTTP redirect** (line 8):
   ```nginx
   return 301 https://$server_name$request_uri;
   ```

### Step 5: Update Frontend Docker Compose

```yaml
# Frontend service
ports:
  - "4200:80"
  - "4201:443"  # Add HTTPS port
volumes:
  - ./certs:/etc/nginx/ssl:ro  # Mount SSL certificates
```

### Step 6: Rebuild and Test

```powershell
# Rebuild all services
docker-compose down
docker-compose up -d --build

# Test HTTPS
Start-Process "https://localhost:4201"  # Frontend
Invoke-WebRequest -Uri https://localhost:5001/health -SkipCertificateCheck  # Backend
```

---

## 🏢 Production Deployment with Real SSL Certificate

### Option 1: Let's Encrypt (Recommended for Public Domains)

```bash
# Install Certbot
apt-get install certbot python3-certbot-nginx

# Generate certificate
certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Certificates will be in:
# /etc/letsencrypt/live/yourdomain.com/fullchain.pem
# /etc/letsencrypt/live/yourdomain.com/privkey.pem
```

Update `nginx.conf`:
```nginx
ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
```

### Option 2: Commercial SSL Certificate

1. Purchase SSL certificate from a Certificate Authority (CA)
2. Obtain `.crt` and `.key` files
3. Place in `./certs/` directory
4. Update paths in `docker-compose.yml` and `nginx.conf`

### Option 3: Corporate PKI Certificate

Contact your organization's PKI team for:
- Server certificate (`.pfx` or `.crt`)
- Private key (`.key`)
- Root CA certificate (if required)

---

## 🔒 Security Best Practices

### 1. Strong SSL Configuration

Current nginx SSL settings (in commented section):
```nginx
ssl_protocols TLSv1.2 TLSv1.3;  # Only secure protocols
ssl_ciphers HIGH:!aNULL:!MD5;  # Strong ciphers only
ssl_prefer_server_ciphers on;
```

### 2. Security Headers

Already configured in nginx (when HTTPS enabled):
```nginx
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
```

### 3. HSTS (HTTP Strict Transport Security)

Backend `Program.cs` already includes:
```csharp
if (!app.Environment.IsDevelopment())
{
    app.UseHsts();  // Force HTTPS for 1 year
}
```

### 4. Certificate Renewal

**Let's Encrypt (Auto-Renewal):**
```bash
# Test renewal
certbot renew --dry-run

# Auto-renewal cron job
0 0 1 * * certbot renew --nginx --post-hook "docker-compose restart frontend"
```

**Manual Certificates:**
- Set calendar reminder 30 days before expiration
- Follow vendor's renewal process
- Update certificate files and restart containers

---

## 🧪 Testing SSL Configuration

### 1. Check Certificate Validity

```powershell
# Check backend certificate
wsl openssl s_client -connect localhost:5001 -showcerts

# Check frontend certificate
wsl openssl s_client -connect localhost:4201 -showcerts
```

### 2. Test SSL Grade

Use online tools:
- https://www.ssllabs.com/ssltest/
- https://securityheaders.com/

Target: **A+ rating**

### 3. Verify HTTPS Redirect

```powershell
# Should redirect to HTTPS
Invoke-WebRequest -Uri http://localhost:4200 -MaximumRedirection 0
```

---

## 🐛 Troubleshooting

### Certificate Not Found

```
Error: Cannot find certificate at /https/aspnetapp.pfx
```

**Solution:**
- Verify certificate file exists in `./certs/` directory
- Check volume mount in docker-compose.yml
- Rebuild container: `docker-compose up -d --build backend`

### Certificate Permission Denied

```
Error: Permission denied reading certificate
```

**Solution:**
```powershell
# Fix permissions (WSL)
wsl chmod 644 certs/cert.pem
wsl chmod 600 certs/key.pem
```

### Mixed Content Warnings

**Problem:** Frontend loads over HTTPS but makes HTTP API calls

**Solution:** Ensure API calls use relative URLs or HTTPS absolute URLs
```typescript
// ✅ Correct (relative URL)
this.http.get('/api/reports')

// ❌ Wrong (hardcoded HTTP)
this.http.get('http://localhost:5000/api/reports')
```

### Self-Signed Certificate Errors

**Browser:** "Your connection is not private"

**Solution:** 
- Development: Click "Advanced" → "Proceed to localhost (unsafe)"
- Production: Use valid CA-signed certificate

---

## 📋 Checklist for Production HTTPS

- [ ] Obtain valid SSL certificate from CA
- [ ] Update `docker-compose.yml` with HTTPS configuration
- [ ] Uncomment HTTPS settings in `nginx.conf`
- [ ] Uncomment `app.UseHttpsRedirection()` in `Program.cs`
- [ ] Mount certificate volumes in Docker
- [ ] Test HTTPS on all endpoints
- [ ] Verify HTTP to HTTPS redirect
- [ ] Check SSL Labs rating (target: A+)
- [ ] Configure certificate auto-renewal
- [ ] Update firewall rules (allow 443, 5001)
- [ ] Update environment variables (use HTTPS URLs)
- [ ] Test with real client applications

---

## 📚 Additional Resources

- [ASP.NET Core HTTPS Configuration](https://learn.microsoft.com/en-us/aspnet/core/security/enforcing-ssl)
- [Nginx SSL/TLS Configuration](https://nginx.org/en/docs/http/configuring_https_servers.html)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [Mozilla SSL Configuration Generator](https://ssl-config.mozilla.org/)

---

**Last Updated:** October 5, 2025  
**Status:** Development (HTTP) | Production-Ready (HTTPS configured but disabled)
