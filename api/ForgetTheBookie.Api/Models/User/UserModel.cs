namespace ForgetTheBookie.Api.Models.User
{
    public class UserModel
    {
        public Guid Id { get; set; }
        public required string Username { get; set; }
        public required string Name { get; set; }
        public required string Email { get; set; }
        public required DateTime DateOfBirth { get; set; }
        //public required string Password { get; set; }
    }
}
