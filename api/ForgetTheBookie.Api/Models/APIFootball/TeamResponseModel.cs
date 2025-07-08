using System.Text.Json.Serialization;

namespace ForgetTheBookie.Api.Models.APIFootball
{
    public class TeamResponseModel
    {
        [JsonPropertyName("team")]
        public ExternalTeamModel Team { get; set; }
    }

    public class ExternalTeamModel
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; }
    }
}
