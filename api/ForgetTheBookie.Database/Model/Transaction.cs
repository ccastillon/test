using ForgetTheBookie.Database.Enum;

namespace ForgetTheBookie.Database.Model
{
    public class Transaction
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public DateTime TransactionDateTime { get; set; }
        public TransactionType Type { get; set; }
        public decimal Amount { get; set; }
        public Guid? BetOfferId { get; set; }
        public decimal? RunningBalance { get; set; }
        public virtual User User { get; set; }
        public virtual BetOffer BetOffer { get; set; }
    }
}
