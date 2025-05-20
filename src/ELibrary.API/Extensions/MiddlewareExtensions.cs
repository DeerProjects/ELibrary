using ELibrary.API.Middelware;

namespace ELibrary.API.Extensions;

public static class MiddelwareExtensions
{
    public static IApplicationBuilder UseGlobalExceptionHandler(this IApplicationBuilder app)
    {
        return app.UseMiddleware<ErrorHandlingMiddelware>();
    }
}