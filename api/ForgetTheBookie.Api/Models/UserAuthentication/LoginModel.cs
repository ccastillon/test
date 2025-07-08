using System.ComponentModel.DataAnnotations;

namespace ForgetTheBookie.Api.Models.UserAuthentication
{
    public class LoginModel
    {
        [EmailAddress]
        public required string Email { get; set; }
        public required string Password { get; set; }
    }
}
