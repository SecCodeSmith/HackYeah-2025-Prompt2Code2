using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TestController : ControllerBase
{
    private readonly ILogger<TestController> _logger;

    public TestController(ILogger<TestController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    public IActionResult Get()
    {
        _logger.LogInformation("Test endpoint called");
        return Ok(new { message = "Connected to .NET backend successfully!" });
    }

    [HttpGet("info")]
    public IActionResult GetInfo()
    {
        return Ok(new
        {
            application = "HackYeah 2025 Backend",
            version = "1.0.0",
            framework = ".NET 9.0",
            timestamp = DateTime.UtcNow
        });
    }
}
