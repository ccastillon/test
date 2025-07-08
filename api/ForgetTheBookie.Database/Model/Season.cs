using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ForgetTheBookie.Database.Model
{
    public class Season
    {
        public Guid Id { get; set; }
        public int SeasonYear { get; set; } // Corresponds to the 4-digit key
        public Guid LeagueId { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool IsCurrent { get; set; }

        public virtual League League { get; set; }
    }
}
