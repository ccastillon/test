using ForgetTheBookie.Database.Enum;
using ForgetTheBookie.Database.Model;

namespace ForgetTheBookie.Api.Models.UserBalanceAndTransactions
{
    public class UserTransactionModel
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public DateTime TransactionDateTime { get; set; }
        public required string Type { get; set; }
        public decimal Amount { get; set; }
        public Guid? BetId { get; set; }
        public decimal? RunningBalance { get; set; }
    }
}
