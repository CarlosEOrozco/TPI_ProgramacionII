using LoginAPI.Models;

namespace LoginAPI.Repository
{
    public interface IUserRepository
    {
        public bool Save(Models.User user);

        bool Validate(string username, string password);

        bool UserExists(string username); 
        User GetUserByUsername(string username); 
    }
}
