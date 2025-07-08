namespace ForgetTheBookie.Api.Models.UserAuthentication
{
    public class AuthenticationResponse
    {
        public Guid Id { get; set; }
        public string Username { get; set; }
        //public string Name { get; set; }
        //public string Email { get; set; }
        //public DateTime DateOfBirth { get; set; }

        public string AccessToken { get; set; }
        public DateTime AccessTokenExpiry { get; set; }
        public string RefreshToken { get; set; }
    }
}
