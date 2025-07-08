using System.ComponentModel.DataAnnotations;

namespace ForgetTheBookie.Api.Models.UserAuthentication
{
    public class RegistrationModel
    {
        public Guid Id { get; set; }
        public required string Username { get; set; }
        public required string Name { get; set; }
        [EmailAddress]
        public required string Email { get; set; }
        public required DateTime DateOfBirth { get; set; }
        public required string Password { get; set; }
    }
}
