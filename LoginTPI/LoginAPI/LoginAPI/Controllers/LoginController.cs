using LoginAPI.Models;
using LoginAPI.Repository;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace LoginAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly ILogger<LoginController> _logger;

        public LoginController(IUserRepository userRepository, ILogger<LoginController> logger)
        {
            _userRepository = userRepository;
            _logger = logger;
        }

        // Método para registrar un nuevo usuario
        [HttpPost("register")]
        public IActionResult Register([FromBody] User user)
        {
            // Verificar si el nombre de usuario ya existe
            if (_userRepository.UserExists(user.Username))
            {
                return BadRequest(new { success = false, Message = "El nombre de usuario ya existe." });
            }

            // Hashear la contraseña antes de guardar
            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);

            // Guardar el usuario en la base de datos
            var result = _userRepository.Save(user);

            if (result)
            {
                return Ok(new { success = true, Message = "Usuario registrado exitosamente." });
            }
            else
            {
                return StatusCode(500, new { success = false, Message = "Hubo un error al registrar el usuario." });
            }
        }

        // Método para el login
        [HttpPost("login")]
        public IActionResult Login([FromBody] User loginRequest)
        {
            // Verificar si el modelo es válido
            if (!ModelState.IsValid)
            {
                return BadRequest(new { success = false, Message = "Datos inválidos." });
            }

            // Obtener el usuario por nombre de usuario
            var user = _userRepository.GetUserByUsername(loginRequest.Username);

            // Verificar si el usuario existe
            if (user == null)
            {
                return Unauthorized(new { success = false, Message = "Usuario no encontrado." });
            }

            // Verificar la contraseña usando el método Validate
            if (!_userRepository.Validate(loginRequest.Username, loginRequest.Password))
            {
                return Unauthorized(new { success = false, Message = "Contraseña incorrecta." });
            }

            // Generar el token JWT
            string token = GenerateJwtToken(user);
            return Ok(new { success = true, token = token });
        }

        /// Genera un token JWT (JSON Web Token) para un usuario autenticado.
        /// Este token se utiliza para autenticar y autorizar al usuario en futuras solicitudes a la API.
        /// <param name="user">El usuario autenticado para el cual se generará el token.</param>
        /// <returns>Una cadena que representa el token JWT.</returns>
        private string GenerateJwtToken(User user)
        {
            // Crear una instancia de JwtSecurityTokenHandler, que es responsable de crear y escribir tokens JWT.
            var tokenHandler = new JwtSecurityTokenHandler();
            
            // Definir una clave secreta que se utilizará para firmar el token.
            // Esta clave debe ser segura y suficientemente larga para garantizar la seguridad del token.
            var key = Encoding.ASCII.GetBytes("Tu_Clave_Secreta_MuySeguraYConMasDe32Caracteres123"); // Clave secreta para firmar el token
            
            // Crear una instancia de SecurityTokenDescriptor que describe las propiedades del token.
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                // Establecer la identidad del token utilizando una colección de claims.
                // En este caso, se agregan dos claims: el nombre de usuario (ClaimTypes.Name) y el ID del usuario (UserId).
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.Username), // Agregar el nombre de usuario como un claim
                    new Claim("UserId", user.Id.ToString()) // Agregar el ID del usuario como un claim
                }),
                
                // Establecer la fecha y hora de expiración del token. En este caso, el token expira una hora después de su creación.
                Expires = DateTime.UtcNow.AddHours(1), // Establecer la expiración del token a 1 hora
                
                // Especificar las credenciales de firma del token, utilizando la clave secreta y el algoritmo HMAC SHA-256.
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature) // Firmar el token con la clave secreta
            };
            
            // Crear el token utilizando el tokenHandler y el tokenDescriptor.
            var token = tokenHandler.CreateToken(tokenDescriptor); // Crear el token
            
            // Escribir el token como una cadena y devolverlo. Esta cadena representa el token JWT que se enviará al cliente para su uso en futuras solicitudes autenticadas.
            return tokenHandler.WriteToken(token); // Escribir el token como una cadena
        }
    }
}
