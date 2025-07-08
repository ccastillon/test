namespace ForgetTheBookie.Database.Model
{
    public class Team
    {
        public Guid Id { get; set; }
        public int ExternalId { get; set; }
        public Guid? LeagueId { get; set; }
        public string Name { get; set; }

        public virtual League League { get; set; }

        public virtual ICollection<Event> EventsAsTeam1 { get; set; }
        public virtual ICollection<Event> EventsAsTeam2 { get; set; }
        public virtual ICollection<Result> Results { get; set; }
    }
}
