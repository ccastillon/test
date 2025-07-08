namespace ForgetTheBookie.Database.Model
{
    public class Event
    {
        public Guid Id { get; set; }
        public int FixtureId { get; set; }
        public DateTime StartDateTime { get; set; }
        public DateTime? EndDateTime { get; set; }
        public Guid Team1Id { get; set; }
        public Guid Team2Id { get; set; }

        public virtual Team Team1 { get; set; }
        public virtual Team Team2 { get; set; }

        public virtual Result Result { get; set; }
        public virtual ICollection<BetOffer> BetOffers { get; set; }
    }
}
