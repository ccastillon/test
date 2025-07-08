namespace ForgetTheBookie.Api.Models.UserBalanceAndTransactions
{
    public class UserBalanceModel
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public decimal Balance { get; set; }
        public decimal AllocatedToBets { get; set; }
    }
}
