namespace ForgetTheBookie.Api.Models.UserAuthentication
{
    public class ChangePasswordModel
    {
        public Guid Id { get; set; }
        public required string CurrentPassword { get; set; }
        public required string NewPassword { get; set; }
    }
}
