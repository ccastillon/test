using Microsoft.AspNetCore.Identity;

namespace ForgetTheBookie.Database.Model
{
    public class User : IdentityUser<Guid>
    {
        /*
         * The following properties are already defined by IdentityUser:
         *  - Id
         *  - Username
         *  - Email
         *  - PasswordHash
         */

        public string Name { get; set; }
        public DateTime DateOfBirth { get; set; }
        public DateTime CreatedDate { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime RefreshTokenExpiry { get; set; }

        public virtual UserBalance UserBalance { get; set; }
        public virtual ICollection<Transaction> Transactions { get; set; }
        public virtual ICollection<BetOffer> BetOffers { get; set; }
        public virtual ICollection<BetMatch> BetMatches { get; set; }
        public virtual ICollection<BetOffer> AcceptedBets { get; set; } // deprecated
    }
}
