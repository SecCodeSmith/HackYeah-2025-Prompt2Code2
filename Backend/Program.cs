using Backend.Application.Common.Behaviors;
using Backend.Infrastructure.Persistence;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// Add MediatR
builder.Services.AddMediatR(cfg => {
    cfg.RegisterServicesFromAssembly(Assembly.Load("Backend.Application"));
    cfg.AddOpenBehavior(typeof(ValidationBehavior<,>));
});

// Add FluentValidation
builder.Services.AddValidatorsFromAssembly(Assembly.Load("Backend.Application"));

// Add DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add UnitOfWork and Repository pattern
builder.Services.AddScoped<Backend.Domain.Interfaces.IUserRepository, Backend.Infrastructure.Repositories.UserRepository>();
builder.Services.AddScoped<Backend.Domain.Interfaces.IReportRepository, Backend.Infrastructure.Repositories.ReportRepository>();
builder.Services.AddScoped<Backend.Domain.Interfaces.IAttachmentRepository, Backend.Infrastructure.Repositories.AttachmentRepository>();
builder.Services.AddScoped<Backend.Domain.Interfaces.IAnnouncementRepository, Backend.Infrastructure.Repositories.AnnouncementRepository>();
builder.Services.AddScoped<Backend.Domain.Interfaces.IUnitOfWork, Backend.Infrastructure.Repositories.UnitOfWork>();

// Add Services
builder.Services.AddScoped<Backend.Application.Interfaces.IJwtService, Backend.Infrastructure.Services.JwtService>();
builder.Services.AddScoped<Backend.Application.Interfaces.IPasswordHasher, Backend.Infrastructure.Services.PasswordHasher>();
builder.Services.AddScoped<Backend.Application.Interfaces.IFileStorageService, Backend.Infrastructure.Services.LocalFileStorageService>();

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:4200", "https://localhost:4200")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// Enable CORS
app.UseCors("AllowAngularApp");

app.UseHttpsRedirection();

app.MapControllers();

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast =  Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
