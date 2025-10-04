# Multi-stage build for .NET 9 Backend
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 5000 5001

# Install curl for health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy project files
COPY ["Backend.csproj", "./"]
COPY ["Backend.Application/Backend.Application.csproj", "Backend.Application/"]
COPY ["Backend.Domain/Backend.Domain.csproj", "Backend.Domain/"]
COPY ["Backend.Infrastructure/Backend.Infrastructure.csproj", "Backend.Infrastructure/"]

# Restore dependencies
RUN dotnet restore "Backend.csproj"

# Copy all source files
COPY . .

# Build the application
RUN dotnet build "Backend.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Backend.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app

# Create https directory for certificates
RUN mkdir -p /https

COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Backend.dll"]
