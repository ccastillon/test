namespace ForgetTheBookie.Api.Models.Event
{
    public class CreateEditEventModel
    {
        public required Guid Team1Id { get; set; }
        public required Guid Team2Id { get; set; }
        public DateTime StartDateTime { get; set; }
        public DateTime? EndDateTime { get; set; }

    }
}
