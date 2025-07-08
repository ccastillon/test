using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ForgetTheBookie.Database.Enum
{
    public enum BetMatchResult
    {
        PENDING, // The bet match is still pending and has not been resolved yet.
        BACKERWIN, // The backer of the bet match has won.
        LAYERWIN, // The layer of the bet match has won.
        CANCELLED, // The bet match has been cancelled and is no longer valid.
    }
}
