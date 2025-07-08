namespace ForgetTheBookie.Api.Models.Bet
{
    public class CreateEditBetModel
    {
        public Guid Id { get; set; }
        public Guid ProposedByUserId { get; set; }
        public Guid EventId { get; set; }
        public decimal Stake { get; set; }
        public string Odds { get; set; }
        public string? BetSide { get; set; }
        public string WinSelection { get; set; }
        public string? Status { get; set; }


        public Guid? AcceptedByUserId { get; set; } // deprecated
        
    }
}
