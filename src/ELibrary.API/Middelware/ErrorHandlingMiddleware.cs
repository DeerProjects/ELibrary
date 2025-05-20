using System.Net;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace ELibrary.API.Middelware;

public class ErrorHandlingMiddelware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ErrorHandlingMiddelware> _logger;

    public ErrorHandlingMiddelware(RequestDelegate next, ILogger<ErrorHandlingMiddelware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task Invoke(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex,"Unhandled exception occured.");

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            
            var errorResponse = new
            {
                message = "An unexpected error ocuered.",
                detail = ex.Message
            };

            var json = JsonSerializer.Serialize(errorResponse);
            await context.Response.WriteAsync(json);
        }
    }
}