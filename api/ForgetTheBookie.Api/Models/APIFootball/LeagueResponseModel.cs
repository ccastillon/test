using System.Text.Json.Serialization;

namespace ForgetTheBookie.Api.Models.APIFootball
{
    public class LeagueResponseModel
    {
        [JsonPropertyName("league")]
        public ExternalLeagueModel League { get; set; }

        [JsonPropertyName("country")]
        public CountryModel Country { get; set; }

        [JsonPropertyName("seasons")]
        public List<ExternalLeagueSeasonModel> Seasons { get; set; } = new List<ExternalLeagueSeasonModel>();
    }

    public class ExternalLeagueModel
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; }

        //[JsonPropertyName("type")]
        //public string Type { get; set; }

        //[JsonPropertyName("logo")]
        //public string Logo { get; set; }
    }

    public class ExternalLeagueSeasonModel
    {
        [JsonPropertyName("year")]
        public int Year { get; set; }

        [JsonPropertyName("current")]
        public bool Current { get; set; }

        [JsonPropertyName("start")]
        public string Start { get; set; }

        [JsonPropertyName("end")]
        public string End { get; set; }

        [JsonPropertyName("coverage")]
        public CoverageModel Coverage { get; set; }
    }

    public class CoverageModel
    {
        [JsonPropertyName("fixtures")]
        public CoverageFixtureModel Fixtures { get; set; }
    }

    public class CoverageFixtureModel
    {
        [JsonPropertyName("events")]
        public bool Events { get; set; }

        [JsonPropertyName("lineups")]
        public bool Lineups { get; set; }
    }
}
