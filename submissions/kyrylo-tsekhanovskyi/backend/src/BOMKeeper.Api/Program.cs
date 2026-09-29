using System.Text.Json.Serialization;
using BOMKeeper.DAL;

var builder = WebApplication.CreateBuilder(args);

// Composition root (ADR 0004): the only place in the Api that touches the DAL, through its
// registration extensions only.
builder.AddServiceDefaults();
builder.AddBomKeeperDatabase();

builder.Services.AddProblemDetails();
builder.Services
    .AddControllers()
    .AddJsonOptions(options => options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));
builder.Services.AddOpenApi();

var app = builder.Build();

app.UseExceptionHandler();
app.UseStatusCodePages();

if (app.Environment.IsDevelopment())
{
    await app.Services.MigrateBomKeeperDatabaseAsync();
    app.MapOpenApi();
}

// The Api also serves the Angular build from wwwroot (ADR 0005).
app.UseStaticFiles();
app.MapDefaultEndpoints();
app.MapControllers();

// Unknown /api routes are 404 problem details, never the SPA page.
app.MapFallback("/api/{**path}", () => Results.Problem(statusCode: StatusCodes.Status404NotFound));
app.MapFallbackToFile("index.html");

await app.RunAsync();
