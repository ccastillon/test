using ForgetTheBookie.Database.Enum;

namespace ForgetTheBookie.Api.Models.Bet
{
    public class BetModel
    {
        public Guid Id { get; set; }
        public required string LeagueName { get; set; } // BetOffer > Event > Team (Team1 or Team2) > League Name
        public DateTime EventStartDateTime { get; set; } // BetOffer > Event StartDateTime
        public DateTime? EventEndDateTime { get; set; } // BetOffer > Event EndDateTime
        public required string Team1Name { get; set; } // BetOffer > Event Team1 > Team Name
        public required string Team2Name { get; set; } // BetOffer > Event Team1 > Team Name
        public decimal Stake { get; set; }
        public required string Odds { get; set; }
        public required string Status { get; set; }
        public decimal Winnings { get; set; }
        public decimal Rake { get; set; }
        public decimal Amount { get; set; }
        public Guid Team1Id { get; set; }
        public Guid Team2Id { get; set; }
        public Guid EventId { get; set; }
        public string? EventResult { get; set; } // BetOffer > Event > Result
        public string? ProposedByUser { get; set; }
        public string? AcceptedByUser { get; set; }
        public decimal? UserBalance { get; set; }
    }
}
