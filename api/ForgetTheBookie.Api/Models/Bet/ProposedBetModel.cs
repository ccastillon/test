using ForgetTheBookie.Database.Model;

namespace ForgetTheBookie.Api.Models.Bet
{
    public class ProposedBetModel
    {
        public Guid Id { get; set; }
        public string LeagueName { get; set; }
        public DateTime EventStartDateTime { get; set; }
        public DateTime EventEndDateTime { get; set; }
        public string Team1Name { get; set; }
        public string Team2Name { get; set; }
        public decimal Stake { get; set; }
        public string Odds { get; set; }
        public string Status { get; set; }
        public string ProposedBy { get; set; }
        public string WinSelection { get; set; }
        public string BackerTeamPick { get; set; }
        public decimal LayerLiability { get; set; }
        public Guid EventId { get; set; }
        public Guid ProposedByUserId { get; set; }
        public Guid AcceptedByUserId { get; set; }
        public bool IsBalSufficient { get; set; }
    }
}
