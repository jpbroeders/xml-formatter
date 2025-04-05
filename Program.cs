var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

// Schakel standaard bestanden in (zodat index.html automatisch wordt geladen)
app.UseDefaultFiles();
// Schakel het serveren van statische bestanden in (voor onze wwwroot folder)
app.UseStaticFiles();

app.Run();
