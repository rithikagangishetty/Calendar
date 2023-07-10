using Main.Models;
using Main.Supervisor;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using CalendarDb;
using Serilog;
using SharpCompress.Common;
using System.IO;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews();
builder.Services.AddSpaStaticFiles(configuration =>
{
    configuration.RootPath = "ClientApp/build";
});
string filePath = Path.Combine("C:\\Users\\GANGISHETTY RITHIKA\\Downloads", "log.txt");

var _logger = new LoggerConfiguration()
.MinimumLevel.Debug()
     .WriteTo.File(filePath, rollingInterval: RollingInterval.Day)
     .CreateLogger();
builder.Logging.AddSerilog(_logger);
builder.Services.AddScoped<IConnections, Connection>();
builder.Services.AddSingleton<Connection>();
builder.Services.AddScoped<ConnectionSupervisor>();
builder.Services.AddScoped<IUser, User>();
builder.Services.AddSingleton<User>();
builder.Services.AddScoped<UserSupervisor>();
builder.Services.AddScoped<ILogin, Login>();
builder.Services.AddSingleton<Login>();
builder.Services.AddScoped<LoginSupervisor>();
var app = builder.Build();
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseSpaStaticFiles();
app.UseRouting();

app.UseAuthorization();

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllerRoute(
        name: "default",
        pattern: "{controller}/{action=Index}/{id?}");
});
app.UseSpa(spa =>
{
    spa.Options.SourcePath = "ClientApp";

    if (app.Environment.IsDevelopment())
    {
        spa.UseReactDevelopmentServer(npmScript: "start");
    }
});
using (var scope = app.Services.CreateScope())
{
    var serviceProvider = scope.ServiceProvider;

    // Retrieve an instance of the User class
    var user = serviceProvider.GetRequiredService<IUser>();

    // Call the SetReminderTask method
    user.StartReminderTimer();
}
app.Run();

