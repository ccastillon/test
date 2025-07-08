namespace ForgetTheBookie.Database.Model
{
    public class League
    {
        public Guid Id { get; set; }
        public int ExternalId { get; set; }
        public string Name { get; set; }
        public string CountryName { get; set; }

        public bool IsCurrent { get; set; } // deprecated

        public virtual ICollection<Team> Teams { get; set; }
        public virtual ICollection<Season> Seasons { get; set; } = new List<Season>();
    }
}
