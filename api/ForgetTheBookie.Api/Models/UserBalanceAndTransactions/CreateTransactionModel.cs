namespace ForgetTheBookie.Api.Models.UserBalanceAndTransactions
{
    public class CreateTransactionModel
    {
        public Guid UserId { get; set; }
        public required string Type { get; set; }
        public decimal Amount { get; set; }
        public Guid? BetId { get; set; }
    }
}
