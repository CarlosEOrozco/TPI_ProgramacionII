using LoginAPI.Models;
using LoginAPI.Repository;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Agregar para la conexi�n, agregar mi DB context
builder.Services.AddControllers();
builder.Services.AddDbContext<UsuarioDBContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Agregar los services y los repository
builder.Services.AddScoped<IUserRepository, UserRepository>();

// Configuración de autenticación JWT
var key = Encoding.ASCII.GetBytes("Tu_Clave_Secreta_MuySeguraYConMasDe32Caracteres123"); // Asegúrate de usar una clave segura

// Configurar los servicios de autenticación
builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme; // Esquema de autenticación predeterminado
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme; // Esquema de desafío predeterminado
})
.AddJwtBearer(x =>
{
    x.RequireHttpsMetadata = false; // Cambiar a true en producción para requerir HTTPS
    x.SaveToken = true; // Guardar el token en el contexto de la solicitud
    x.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true, // Validar la clave de firma del emisor
        IssuerSigningKey = new SymmetricSecurityKey(key), // Clave de firma simétrica
        ValidateIssuer = false, // Cambiar a true si necesitas validar el emisor
        ValidateAudience = false // Cambiar a true si necesitas validar el público
    };
});

// Configuración de CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        builder => builder.WithOrigins("http://127.0.0.1:5500")
                          .AllowAnyHeader()
                          .AllowAnyMethod());
});


// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Usar CORS
app.UseCors("AllowSpecificOrigin");

// Usar autenticaci�n
app.UseAuthentication(); // Debe ir antes de UseAuthorization
app.UseAuthorization();

app.MapControllers();

app.Run();
