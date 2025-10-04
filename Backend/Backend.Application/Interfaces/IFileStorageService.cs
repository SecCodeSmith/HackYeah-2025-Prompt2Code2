// File: Backend/Backend.Application/Interfaces/IFileStorageService.cs
namespace Backend.Application.Interfaces;

public interface IFileStorageService
{
    /// <summary>
    /// Saves a file to storage and returns the file path
    /// </summary>
    Task<string> SaveFileAsync(Stream fileStream, string fileName, CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Retrieves a file from storage
    /// </summary>
    Task<(Stream FileStream, string ContentType)> GetFileAsync(string filePath, CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Deletes a file from storage
    /// </summary>
    Task DeleteFileAsync(string filePath, CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Checks if a file exists in storage
    /// </summary>
    Task<bool> FileExistsAsync(string filePath, CancellationToken cancellationToken = default);
}
