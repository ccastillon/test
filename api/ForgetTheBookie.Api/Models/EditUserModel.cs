using System.ComponentModel.DataAnnotations;

namespace ForgetTheBookie.Api.Models
{
    public class EditUserModel
    {
        public Guid Id { get; set; }
        public required string Username { get; set; }
        public required string Name { get; set; }
        public required string Email { get; set; }
        public DateTime DateOfBirth { get; set; }
 

    }
}
