using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ForgetTheBookie.Database.Enum
{
    public enum TransactionType
    {
        [Description("DEPOSIT")]
        DEPOSIT,
        [Description("WITHDRAWAL")]
        WITHDRAWAL,
        [Description("ALLOCATED")]
        ALLOCATED,
        [Description("WINNINGS")]
        WINNINGS,
        [Description("RAKE")]
        RAKE
    }
}
