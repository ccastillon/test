using ForgetTheBookie.Database.Enum;

namespace ForgetTheBookie.Database.Model
{
    public class BetOffer
    {
        public Guid Id { get; set; }
        public Guid ProposedByUserId { get; set; }
        public Guid EventId { get; set; }
        public decimal Stake { get; set; }
        public required string Odds { get; set; }
        public BetSide BetSide { get; set; }
        public WinSelection WinSelection { get; set; }
        public BetStatus Status { get; set; }

        public Guid? AcceptedByUserId { get; set; } // depecrated

        public virtual BetMatch BetMatch { get; set; }
        public virtual User ProposedByUser { get; set; }
        public virtual User AcceptedByUser { get; set; }
        public virtual Event Event { get; set; }

        public virtual ICollection<Transaction> Transactions { get; set; }
    }
}
