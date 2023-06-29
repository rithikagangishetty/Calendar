using Calenderwebapp.Models;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Calenderwebapp.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews();
builder.Services.AddSpaStaticFiles(configuration =>
{
    configuration.RootPath = "ClientApp/build";
});


builder.Services.Configure<UserSettings>(
   builder.Configuration.GetSection("UserDatabase"));
builder.Services.AddSingleton<UserServices>();

builder.Services.Configure<ConnectionSettings>(
   builder.Configuration.GetSection("ConnectionDb"));
builder.Services.AddSingleton<ConnectionServices>();

builder.Services.Configure<ConnectionSettings>(
   builder.Configuration.GetSection("ConnectionDb"));
builder.Services.AddSingleton<LoginServices>();


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
app.Run();


