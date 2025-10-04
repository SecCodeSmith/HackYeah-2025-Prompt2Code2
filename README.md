# HackYeah 2025 - Full Stack Application

This is a full-stack application template for HackYeah 2025, featuring a .NET 9 Web API backend and an Angular 18 frontend.

## 🏗️ Project Structure

```
HackYeah 2025/
├── Backend/          # .NET 9 Web API
│   ├── Controllers/  # API Controllers
│   ├── Properties/   # Launch settings
│   └── ...
├── Frontend/         # Angular 18 Application
│   ├── src/
│   │   ├── app/     # Application components
│   │   └── ...
│   └── ...
└── README.md        # This file
```

## 🚀 Prerequisites

Before you begin, ensure you have the following installed:

- **.NET 9.0 SDK** - [Download here](https://dotnet.microsoft.com/download/dotnet/9.0)
- **Node.js** (v18 or later) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- A code editor like **Visual Studio Code** - [Download here](https://code.visualstudio.com/)

## 📦 Installation

### Backend Setup

1. Navigate to the Backend directory:
   ```powershell
   cd Backend
   ```

2. Restore NuGet packages (should already be done):
   ```powershell
   dotnet restore
   ```

3. Build the project:
   ```powershell
   dotnet build
   ```

### Frontend Setup

1. Navigate to the Frontend directory:
   ```powershell
   cd Frontend
   ```

2. Install npm packages:
   ```powershell
   npm install
   ```

## 🏃 Running the Application

### Start the Backend

1. Navigate to the Backend directory:
   ```powershell
   cd Backend
   ```

2. Run the API:
   ```powershell
   dotnet run
   ```

   The API will start on `http://localhost:5000`

### Start the Frontend

1. Open a new terminal and navigate to the Frontend directory:
   ```powershell
   cd Frontend
   ```

2. Run the Angular development server:
   ```powershell
   npm start
   ```

   The application will be available at `http://localhost:4200`

## 🔧 Technology Stack

### Backend
- **.NET 9.0** - Modern web framework
- **ASP.NET Core Web API** - RESTful API
- **Entity Framework Core 9** - ORM (ready to use)
- **CORS** - Configured for Angular frontend

### Frontend
- **Angular 18** - Modern frontend framework
- **TypeScript** - Type-safe JavaScript
- **Standalone Components** - Modern Angular architecture
- **RxJS** - Reactive programming
- **Angular Router** - Client-side routing
- **HttpClient** - HTTP communication

## 📚 API Endpoints

### Test Endpoints

- **GET** `/api/test` - Test connection to backend
  - Returns: `{ "message": "Connected to .NET backend successfully!" }`

- **GET** `/api/test/info` - Get application info
  - Returns: Application metadata and version info

### Weather Forecast (Example)

- **GET** `/weatherforecast` - Get weather forecast data
  - Returns: Array of weather forecast objects

## 🔑 Key Features

### Backend Features
- ✅ CORS configured for Angular frontend
- ✅ Swagger/OpenAPI documentation (in development mode)
- ✅ Entity Framework Core ready for database integration
- ✅ Structured controller-based architecture
- ✅ Logging configured

### Frontend Features
- ✅ Standalone component architecture
- ✅ Lazy loading routes
- ✅ HTTP client configured
- ✅ Proxy configuration for API calls
- ✅ Responsive design
- ✅ Modern Angular best practices

## 🛠️ Development Tips

### Backend Development

- **Watch mode**: Use `dotnet watch run` for automatic rebuilds on file changes
- **Database**: Add connection string to `appsettings.json` when ready to use a database
- **Migrations**: Use `dotnet ef migrations add InitialCreate` to create database migrations

### Frontend Development

- **Components**: Create new components with `ng generate component <name>`
- **Services**: Create new services with `ng generate service <name>`
- **Build**: Production build with `npm run build`
- **Proxy**: API calls are automatically proxied to `http://localhost:5000` during development

## 📝 Configuration

### Backend Configuration

The backend is configured to run on:
- HTTP: `http://localhost:5000`
- HTTPS: `https://localhost:5001`

CORS is configured to allow requests from `http://localhost:4200`

### Frontend Configuration

The frontend runs on:
- Development: `http://localhost:4200`

API proxy configuration in `proxy.conf.json` forwards `/api/*` requests to the backend.

## 🐛 Troubleshooting

### Backend Issues

**Port already in use:**
```powershell
# Find and kill process using port 5000
netstat -ano | findstr :5000
taskkill /PID <process_id> /F
```

**CORS errors:**
- Ensure the backend is running on port 5000
- Check that CORS policy in `Program.cs` matches the frontend URL

### Frontend Issues

**Module not found errors:**
```powershell
# Clean install
rm -r node_modules
rm package-lock.json
npm install
```

**Port 4200 in use:**
```powershell
# Run on different port
ng serve --port 4201
```

## 📖 Next Steps

1. **Add Database**: Configure Entity Framework with your database
2. **Add Authentication**: Implement JWT authentication
3. **Add More Endpoints**: Create additional API controllers
4. **Add More Pages**: Create additional Angular components and routes
5. **Add Styling**: Customize CSS or add a UI framework like Angular Material

## 🤝 Contributing

This is a HackYeah 2025 project template. Feel free to modify and extend as needed for your hackathon project!

## 📄 License

This project is open source and available for educational purposes.

---

**Happy Hacking! 🎉**
