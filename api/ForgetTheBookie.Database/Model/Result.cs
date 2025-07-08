using ForgetTheBookie.Database.Enum;

namespace ForgetTheBookie.Database.Model
{
    public class Result
    {
        public Guid Id { get; set; }
        public Guid EventId { get; set; }
        public Guid? WinningTeamId { get; set; }
        public int? Team1Goals { get; set; }
        public int? Team2Goals { get; set; }
        public EventResult? EventResult { get; set; }

        public virtual Event Event { get; set; }
        public virtual Team Team { get; set; }
    }
}
