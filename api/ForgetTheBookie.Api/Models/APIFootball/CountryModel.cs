using System.Text.Json.Serialization;

namespace ForgetTheBookie.Api.Models.APIFootball
{
    public class CountryModel
    {
        [JsonPropertyName("name")]
        public string Name { get; set; }

        [JsonPropertyName("code")]
        public string Code { get; set; }
    }
}
