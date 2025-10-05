// File: Backend/Backend.Infrastructure/Services/LocalFileStorageService.cs
using Backend.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Backend.Infrastructure.Services;

public class LocalFileStorageService : IFileStorageService
{
    private readonly string _storageDirectory;
    private readonly ILogger<LocalFileStorageService> _logger;

    public LocalFileStorageService(IConfiguration configuration, ILogger<LocalFileStorageService> logger)
    {
        _logger = logger;
        _storageDirectory = configuration["FileStorage:Directory"] ?? Path.Combine(Directory.GetCurrentDirectory(), "uploads");
        
        // Ensure the storage directory exists
        if (!Directory.Exists(_storageDirectory))
        {
            Directory.CreateDirectory(_storageDirectory);
            _logger.LogInformation("Created file storage directory: {Directory}", _storageDirectory);
        }
    }

    public async Task<string> SaveFileAsync(Stream fileStream, string relativePath, CancellationToken cancellationToken = default)
    {
        try
        {
            // Build full path (relativePath may include subdirectories like "reports/guid/filename.pdf")
            var fullPath = Path.Combine(_storageDirectory, relativePath);
            
            // Ensure directory exists
            var directory = Path.GetDirectoryName(fullPath);
            if (!string.IsNullOrEmpty(directory) && !Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory);
                _logger.LogInformation("Created subdirectory: {Directory}", directory);
            }

            // Save the file to disk
            using (var fileStreamOutput = new FileStream(fullPath, FileMode.Create, FileAccess.Write, FileShare.None, 4096, useAsync: true))
            {
                await fileStream.CopyToAsync(fileStreamOutput, cancellationToken);
            }

            _logger.LogInformation("Saved file to {FilePath}", fullPath);
            return relativePath; // Return relative path for database storage
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error saving file to: {RelativePath}", relativePath);
            throw;
        }
    }

    public async Task<Stream?> GetFileAsync(string relativePath, CancellationToken cancellationToken = default)
    {
        try
        {
            var fullPath = Path.Combine(_storageDirectory, relativePath);

            if (!File.Exists(fullPath))
            {
                _logger.LogWarning("File not found: {FilePath}", fullPath);
                return null;
            }

            // Open file stream for reading
            var fileStream = new FileStream(fullPath, FileMode.Open, FileAccess.Read, FileShare.Read, 4096, useAsync: true);

            _logger.LogInformation("Retrieved file: {FilePath}", relativePath);
            return fileStream;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving file: {RelativePath}", relativePath);
            throw;
        }
    }

    public async Task DeleteFileAsync(string filePath, CancellationToken cancellationToken = default)
    {
        try
        {
            var fullPath = Path.Combine(_storageDirectory, filePath);

            if (File.Exists(fullPath))
            {
                File.Delete(fullPath);
                _logger.LogInformation("Deleted file: {FilePath}", filePath);
            }
            else
            {
                _logger.LogWarning("File not found for deletion: {FilePath}", fullPath);
            }

            await Task.CompletedTask;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting file: {FilePath}", filePath);
            throw;
        }
    }

    public async Task<bool> FileExistsAsync(string filePath, CancellationToken cancellationToken = default)
    {
        var fullPath = Path.Combine(_storageDirectory, filePath);
        return await Task.FromResult(File.Exists(fullPath));
    }

    private string GetContentType(string fileName)
    {
        var extension = Path.GetExtension(fileName).ToLowerInvariant();
        return extension switch
        {
            ".pdf" => "application/pdf",
            ".doc" => "application/msword",
            ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ".xls" => "application/vnd.ms-excel",
            ".xlsx" => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            ".txt" => "text/plain",
            ".jpg" or ".jpeg" => "image/jpeg",
            ".png" => "image/png",
            ".gif" => "image/gif",
            ".zip" => "application/zip",
            ".rar" => "application/x-rar-compressed",
            _ => "application/octet-stream"
        };
    }
}
