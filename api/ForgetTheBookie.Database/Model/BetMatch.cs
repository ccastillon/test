using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ForgetTheBookie.Database.Enum;

namespace ForgetTheBookie.Database.Model
{
    public class BetMatch
    {
        public Guid Id { get; set; }
        public Guid BetOfferId { get; set; }
        public Guid AcceptedByUserId { get; set; }
        public decimal MatchedAmount { get; set; } // For now, this is equal to BetOffer.Stake
        public BetMatchResult BetMatchResult { get; set; }
        public decimal? BackerPayout { get; set; }
        public decimal? LayerPayout { get; set; }
        public decimal? RakeCollected { get; set; }

        public virtual BetOffer BetOffer { get; set; }
        public virtual User AcceptedByUser { get; set; }
    }
}
