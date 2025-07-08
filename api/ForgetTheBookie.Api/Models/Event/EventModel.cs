namespace ForgetTheBookie.Api.Models.Event
{
    public class EventModel
    {
        public Guid Id { get; set; }
        public DateTime StartDateTime { get; set; }
        public DateTime? EndDateTime { get; set; }
        public required string LeagueName { get; set; }
        public required string Team1Name { get; set; }
        public required string Team2Name { get; set; }

    }
}
