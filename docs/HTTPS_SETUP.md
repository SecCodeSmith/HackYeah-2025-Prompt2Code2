# HTTPS Development Certificate Setup

This guide explains how to set up HTTPS for local development.

## Generate Development Certificate

### For Windows/macOS/Linux:

1. Generate a development certificate:
```bash
cd Backend
mkdir -p https
dotnet dev-certs https -ep https/aspnetapp.pfx -p devcert
dotnet dev-certs https --trust
```

2. The certificate will be created at `Backend/https/aspnetapp.pfx` with password `devcert`

### For Docker:

The docker-compose.yml is already configured to:
- Expose HTTPS on port 5001
- Mount the `Backend/https` directory as a volume
- Use the certificate at `/https/aspnetapp.pfx` with password `devcert`

## Environment Variables

Add to your `.env` file (optional):
```
CERT_PASSWORD=devcert
```

## Testing HTTPS

1. Start the backend:
```bash
cd Backend
dotnet run
```

2. Access the API at:
- HTTP: http://localhost:5000
- HTTPS: https://localhost:5001

## Frontend Configuration

Update the Frontend API URL to use HTTPS:
```typescript
// In Frontend environment files
apiUrl: 'https://localhost:5001/api'
```

## Production Deployment

For production, replace the self-signed certificate with a proper SSL certificate from:
- Let's Encrypt (free)
- Your organization's certificate authority
- Commercial SSL provider

Store the certificate securely and update docker-compose.yml accordingly.

## Troubleshooting

### Certificate Not Trusted
- Windows: Run `dotnet dev-certs https --trust`
- macOS: Same command, but may require admin password
- Linux: Import certificate to system trust store

### Port Already in Use
- Change ports in docker-compose.yml and Program.cs
- Default ports: 5000 (HTTP), 5001 (HTTPS)

### CORS Errors with HTTPS
- Update CORS policy in Program.cs to include HTTPS origin:
```csharp
policy.WithOrigins("http://localhost:4200", "https://localhost:4200")
```
