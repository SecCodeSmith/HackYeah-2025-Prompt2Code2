# Admin Account Created Successfully!

## Account Details

- **Email:** admin@uknf.gov.pl
- **Password:** Admin123!
- **Role:** Administrator (Role = 1)
- **Status:** Active and Email Confirmed

## Access the Application

- **Application URL:** http://localhost:4200
- **API URL:** http://localhost:5000

## Docker Containers Status

The following containers are running:

- **uknf-frontend** - Angular application (Port 4200)
- **uknf-backend** - .NET API (Port 5000)
- **uknf-database** - MS SQL Server (Port 1433)

## Next Steps

1. Open your browser and navigate to: http://localhost:4200
2. Click on "Login" or "Sign In"
3. Enter the credentials:
   - Email: `admin@uknf.gov.pl`
   - Password: `Admin123!`
4. You should now have full administrator access to the application

## Troubleshooting

If you encounter any issues:

1. **Containers not running:**
   ```bash
   wsl docker-compose up -d
   ```

2. **Reset admin password:**
   Run the `create-admin-account.ps1` script again

3. **Check container logs:**
   ```bash
   wsl docker logs uknf-backend
   wsl docker logs uknf-frontend
   wsl docker logs uknf-database
   ```

## Database Access (if needed)

You can access the MS SQL database directly using:

```bash
wsl docker exec -it uknf-database /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "YourStrong@Password123" -d UknfCommunicationDb -C
```

## User Roles

The system supports the following roles:
- **0** - User (Regular user)
- **1** - Administrator (Full access)
- **2** - Supervisor (Management access)

Your admin account is configured with **Role = 1 (Administrator)**.
