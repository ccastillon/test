using System.Text.Json.Serialization;

namespace ForgetTheBookie.Api.Models.APIFootball
{
    public class FixtureResponseModel
    {
        [JsonPropertyName("fixture")]
        public Fixture Fixture { get; set; }

        [JsonPropertyName("league")]
        public FixtureLeague League { get; set; }

        [JsonPropertyName("teams")]
        public FixtureTeam Teams { get; set; }

        [JsonPropertyName("goals")]
        public Goals Goals { get; set; }
    }

    public class Fixture
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("timezone")]
        public string TimeZone { get; set; }

        [JsonPropertyName("date")]
        public string Date { get; set; }

        [JsonPropertyName("timestamp")]
        public int TimeStamp { get; set; }

        [JsonPropertyName("periods")]
        public object Periods { get; set; }

        [JsonPropertyName("venue")]
        public object Venue { get; set; }

        [JsonPropertyName("status")]
        public Status Status { get; set; }
    }

    public class Status
    {
        [JsonPropertyName("long")]
        public string Long { get; set; }

        [JsonPropertyName("short")]
        public string Short { get; set; }
        [JsonPropertyName("elapsed")]
        public int? Elapsed { get; set; }
        [JsonPropertyName("extra")]
        public int? Extra { get; set; }
    }

    public class FixtureLeague
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; }

        [JsonPropertyName("country")]
        public string Country { get; set; }

        [JsonPropertyName("season")]
        public int Season { get; set; }

        [JsonPropertyName("round")]
        public string Round { get; set; }
    }

    public class FixtureTeam
    {
        [JsonPropertyName("home")]
        public TeamDetails Home { get; set; }

        [JsonPropertyName("away")]
        public TeamDetails Away { get; set; }
    }

    public class TeamDetails
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; }

        [JsonPropertyName("winner")]
        public bool? Winner { get; set; }
    }

    public class Goals
    {
        [JsonPropertyName("home")]
        public int? Home { get; set; }

        [JsonPropertyName("away")]
        public int? Away { get; set; }
    }
}
