using LoginAPI.Models;

namespace LoginAPI.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly UsuarioDBContext _context;

        // Constructor que recibe el contexto de la base de datos
        public UserRepository(UsuarioDBContext context)
        {
            _context = context;
        }

        // Método para guardar un usuario en la base de datos
        public bool Save(User user)
        {
            _context.Users.Add(user); // Agregar el usuario al contexto
            return _context.SaveChanges() > 0; // Guardar cambios en la base de datos y devolver true si se guardaron correctamente
        }

        // Método para validar las credenciales de un usuario
        public bool Validate(string username, string password)
        {
            var user = GetUserByUsername(username); // Obtener el usuario por nombre de usuario

            password = password.Trim(); // Eliminar espacios en blanco al inicio y al final de la contraseña

            // Verificar la contraseña usando el hash almacenado
            return BCrypt.Net.BCrypt.Verify(password, user.Password);
        }

        // Método para verificar si un usuario existe por nombre de usuario
        public bool UserExists(string username)
        {
            return _context.Users.Any(u => u.Username == username); // Devolver true si existe un usuario con el nombre de usuario dado
        }

        // Método para obtener un usuario por nombre de usuario
        public User GetUserByUsername(string username)
        {
            return _context.Users.SingleOrDefault(u => u.Username == username); // Devolver el usuario que coincide con el nombre de usuario dado
        }
    }
}
