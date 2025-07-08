using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ForgetTheBookie.Database.Enum
{
    public enum BetStatus
    {
        [Description("PROPOSED")]
        PROPOSED,
        [Description("ACCEPTED")]
        ACCEPTED,
        [Description("WITHDRAWN")]
        WITHDRAWN,
        [Description("COMPLETE")]
        COMPLETE,
        [Description("SETTLED")]
        SETTLED,
        [Description("CANCELLED")]
        CANCELLED
    }
}
