using EFCore.BulkExtensions;
using ForgetTheBookie.Api.Models.APIFootball;
using ForgetTheBookie.Database;
using ForgetTheBookie.Database.Model;
using Hangfire;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics.Metrics;
using System.Globalization;


//using Newtonsoft.Json;
using System.Text.Json;

namespace ForgetTheBookie.Api.Services
{
    public class DataFetchingService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IServiceProvider _serviceProvider;
        private readonly IConfiguration _configuration;
        private readonly ILogger<DataFetchingService> _logger;
        private readonly HttpClient _httpClient;
        private readonly DatabaseContext _context;
        private readonly IBackgroundJobClient _backgroundJobClient;
        private const int MaxRetryAttempts = 2;

        public DataFetchingService(IHttpClientFactory httpClientFactory, IServiceProvider serviceProvider, IConfiguration configuration, ILogger<DataFetchingService> logger, DatabaseContext context, HttpClient httpClient, IBackgroundJobClient backgroundJobClient)
        {
            _httpClientFactory = httpClientFactory;
            _serviceProvider = serviceProvider;
            _configuration = configuration;
            _logger = logger;
            _context = context;
            _httpClient = httpClient;
            _backgroundJobClient = backgroundJobClient;
        }

        #region HTTP fetch to 3rd-party Football API
        // Get current Leagues
        public async Task<List<LeagueResponseModel>> GetCurrentLeaguesAsync()
        {
            var response = await _httpClient.GetAsync($"leagues?current=true");
            var jsonString = await response.Content.ReadAsStringAsync();
            var resLeagues = JsonSerializer.Deserialize<ApiResponseModel<LeagueResponseModel>>(jsonString);
            var leagues = new List<LeagueResponseModel>();

            if (resLeagues != null && resLeagues.Response != null)
            {
                leagues.AddRange(resLeagues.Response);
            }

            return leagues;
        }

        // Get the list of countries available for the teams endpoint.
        public async Task<List<CountryModel>> GetCountriesAsync()
        {
            var response = await _httpClient.GetAsync($"teams/countries");
            var jsonString = await response.Content.ReadAsStringAsync();
            var resCountries = JsonSerializer.Deserialize<ApiResponseModel<CountryModel>>(jsonString);
            var countries = new List<CountryModel>();

            if (resCountries != null && resCountries.Response != null)
            {
                countries = resCountries.Response;
            }

            return countries;
        }

        // Get Teams for Country
        public async Task<List<Team>> GetTeamsForCountryAsync(string country)
        {
            var currentYear = DateTime.Now.Year;
            var response = await _httpClient.GetAsync($"teams?country={country}");
            var jsonString = await response.Content.ReadAsStringAsync();
            var resTeams = JsonSerializer.Deserialize<ApiResponseModel<TeamResponseModel>>(jsonString);
            var teams = new List<Team>();

            if (resTeams != null && resTeams.Response != null)
            {
                teams = resTeams.Response.Select(res => new Team
                {
                    ExternalId = res.Team.Id,
                    Name = res.Team.Name
                }).ToList();
            }

            return teams;
        }

        public async Task<List<Team>> GetTeamsForLeagueAsync(int leagueId, int season)
        {
            //var currentDate = DateTime.Now;
            //var seasons = new List<int> { currentDate.AddYears(-1).Year, currentDate.Year };
            var teams = new List<Team>();

            var response = await _httpClient.GetAsync($"teams?league={leagueId}&season={season}");
            var jsonString = await response.Content.ReadAsStringAsync();
            var resTeams = JsonSerializer.Deserialize<ApiResponseModel<TeamResponseModel>>(jsonString);
            var seasonTeams = new List<Team>();

            if (resTeams != null && resTeams.Response != null)
            {
                seasonTeams = resTeams.Response.Select(res => new Team
                {
                    ExternalId = res.Team.Id,
                    Name = res.Team.Name
                }).ToList();

                teams.AddRange(seasonTeams);
            }

            return teams;
        }

        public async Task<List<FixtureResponseModel>> GetFixtures(bool isEmptyData, List<int> leagueIds, string syncFromDate)
        {
            var currentDate = DateTime.UtcNow;
            var seasons = new List<int> { currentDate.AddYears(-1).Year, currentDate.Year };
            var currentDateStr = currentDate.ToString("yyyy-MM-dd");
            var toDate = currentDate.AddDays(15).ToString("yyyy-MM-dd");
            var status = "NS";
            var next = 10;
            var fixtures = new List<FixtureResponseModel>();

            //var response = await _httpClient.GetAsync($"fixtures?season={currentYear}&status={status}&next={next}");

            // params:
            // season
            // leagueId
            // from = current UTC date
            // to = from + 15 days
            // status = NS
            foreach(var season in seasons)
            {
                foreach(var leagueId in leagueIds)
                {
                    if(leagueId == 169)
                    {
                        var test = "test";
                    }
                    var requestUrl = isEmptyData
                                        ? $"fixtures?season={season}&league={leagueId}&from={currentDateStr}&to={toDate}&status={status}"
                                        : $"fixtures?season={season}&league={leagueId}&from={syncFromDate}&to={toDate}";
                    var response = await _httpClient.GetAsync(requestUrl);

                    var jsonString = await response.Content.ReadAsStringAsync();
                    var resFixtures = JsonSerializer.Deserialize<ApiResponseModel<FixtureResponseModel>>(jsonString);

                    if (resFixtures != null && resFixtures.Response != null)
                    {
                        fixtures.AddRange(resFixtures.Response);
                    }
                }
            }

            return fixtures;
        }

        #endregion

        #region Hangfire recurring jobs
        [AutomaticRetry(Attempts = MaxRetryAttempts, OnAttemptsExceeded = AttemptsExceededAction.Fail)]
        public async Task SyncLeagues()
        {
            _logger.LogInformation("Syncing leagues and seasons data...");
            var existingLeagues = await _context.League.Include(x => x.Seasons).ToListAsync(); // Fetch existing leagues from the database
            var existingLeaguesDict = existingLeagues.ToDictionary(x => x.ExternalId, x => x); // Create dictionary for quick lookup
            var currentDate = DateTime.Now;
            var currentYear = currentDate.Year;

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var externalLeagues = await GetCurrentLeaguesAsync();
                var newLeagues = new List<League>();
                var updatedLeagues = new List<League>();

                //var currentExternalLeagues = externalLeagues.Where(x => x.Seasons.Last()).ToList();
                foreach (var externalLeague in externalLeagues)
                {
                    var externalLeagueLatestSeason = externalLeague.Seasons.OrderBy(x => x.Year).FirstOrDefault();
                    if (existingLeaguesDict.TryGetValue(externalLeague.League.Id, out var existingLeague))
                    {
                        // Update existing league
                        var existingLeagueLatestSeason = existingLeague.Seasons.OrderBy(x => x.SeasonYear).FirstOrDefault();
                        //var bothIsCurrent = externalLeagueLatestSeason.Current == existingLeagueLatestSeason.IsCurrent;

                        if (existingLeagueLatestSeason.SeasonYear != externalLeagueLatestSeason.Year)
                        {
                            foreach (var season in existingLeague.Seasons)
                            {
                                season.IsCurrent = false;
                            }
                            existingLeague.Seasons.Add(new Season
                            {
                                SeasonYear = externalLeagueLatestSeason.Year,
                                StartDate = DateTime.Parse(externalLeagueLatestSeason.Start),
                                EndDate = DateTime.Parse(externalLeagueLatestSeason.End),
                                IsCurrent = externalLeagueLatestSeason.Current,
                                LeagueId = existingLeague.Id
                            });

                            updatedLeagues.Add(existingLeague);
                        }
                    }
                    else
                    {
                        // Create new league
                        var newLeague = new League
                        {
                            ExternalId = externalLeague.League.Id,
                            Name = externalLeague.League.Name,
                            CountryName = externalLeague.Country.Name,
                        };

                        newLeague.Seasons.Add(new Season
                        {
                            SeasonYear = externalLeagueLatestSeason.Year,
                            StartDate = externalLeagueLatestSeason.Start != null ? 
                                            DateTime.Parse(externalLeagueLatestSeason.Start, null, DateTimeStyles.AssumeUniversal | DateTimeStyles.AdjustToUniversal) 
                                            : null,
                            EndDate = externalLeagueLatestSeason.End != null ? 
                                            DateTime.Parse(externalLeagueLatestSeason.End, null, DateTimeStyles.AssumeUniversal | DateTimeStyles.AdjustToUniversal) 
                                            : null,
                            IsCurrent = externalLeagueLatestSeason.Current,
                        });

                        newLeagues.Add(newLeague);
                    }
                }

                if (newLeagues.Any())
                {
                    await BulkInsertLeagues(newLeagues);
                }

                if (updatedLeagues.Any())
                {
                    await _context.BulkUpdateAsync(updatedLeagues);
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                _logger.LogInformation($"Leagues and their season links synced successfully.");


            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError($"Failed to sync leagues: {ex.Message}");
                throw;
            }
        }

        // Get ALL teams using countries to make fewer API calls https://www.api-football.com/news/post/how-to-get-all-teams-and-their-ids
        // Sync Teams - can be updated once or twice a month
        [AutomaticRetry(Attempts = MaxRetryAttempts, OnAttemptsExceeded = AttemptsExceededAction.Fail)]
        public async Task SyncTeamsByCountry()
        {
            _logger.LogInformation($"Syncing teams data...");
            var countries = await GetCountriesAsync();
            var existingTeams = await _context.Team.ToListAsync();
            var existingTeamsDict = existingTeams.ToDictionary(x => x.ExternalId, x => x);

            foreach (var country in countries)
            {
                using var transaction = await _context.Database.BeginTransactionAsync();
                try
                {
                    var newTeams = new List<Team>();
                    var updatedTeams = new List<Team>();
                    var externalTeams = await GetTeamsForCountryAsync(country.Name);

                    foreach (var extertnalTeam in externalTeams)
                    {
                        if (existingTeamsDict.TryGetValue(extertnalTeam.ExternalId, out var existingTeam))
                        {
                            existingTeam.Name = extertnalTeam.Name;
                            updatedTeams.Add(existingTeam);
                        }
                        else
                        {
                            extertnalTeam.Id = Guid.NewGuid();
                            newTeams.Add(extertnalTeam);
                        }
                    }

                    if (newTeams.Any())
                    {
                        await _context.BulkInsertAsync(newTeams);
                    }

                    if (updatedTeams.Any())
                    {
                        await _context.BulkUpdateAsync(updatedTeams);
                    }

                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();
                    _logger.LogInformation($"Teams sync successfully for country {country.Name}");
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    _logger.LogError($"Failed to sync teams for country {country.Name}: {ex.Message}");
                    throw;
                }
            }
        }

        [AutomaticRetry(Attempts = MaxRetryAttempts, OnAttemptsExceeded = AttemptsExceededAction.Fail)]
        public async Task SyncTeamsByLeague()
        {
            _logger.LogInformation($"Syncing teams data...");
            var existingTeams = await _context.Team.Where(x => x.ExternalId != 0).ToListAsync();
            var existingTeamsDict = existingTeams.ToDictionary(x => x.ExternalId, x => x);
            var currentDate = DateTime.Now;
            var seasons = new List<int> { currentDate.AddYears(-1).Year, currentDate.Year };

            var popularLeagueIds = Enum.GetValues(typeof(PopularLeagues)).Cast<int>().ToList(); // to save RapidAPI calls and database storage
            var existingLeagues = await _context.League.Where(x => popularLeagueIds.Contains(x.ExternalId))
                .Include(x => x.Seasons).ToListAsync();

            var newTeams = new List<Team>();
            var updatedTeams = new List<Team>();

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                foreach (var league in existingLeagues)
                {
                    var leagueLatestSeason = league.Seasons.OrderBy(x => x.SeasonYear).FirstOrDefault(x => x.IsCurrent);
                    if (leagueLatestSeason != null)
                    {
                        var externalTeams = await GetTeamsForLeagueAsync(league.ExternalId, leagueLatestSeason.SeasonYear);
                        foreach (var extertnalTeam in externalTeams)
                        {
                            if (existingTeamsDict.TryGetValue(extertnalTeam.ExternalId, out var existingTeam))
                            {
                                existingTeam.ExternalId = extertnalTeam.ExternalId; // Update ExternalId in case it has changed
                                existingTeam.LeagueId = league.Id; // Update LeagueId to the current league
                                existingTeam.Name = extertnalTeam.Name;
                                updatedTeams.Add(existingTeam);
                            }
                            else
                            {
                                extertnalTeam.LeagueId = league.Id;
                                newTeams.Add(extertnalTeam);
                                existingTeamsDict.Add(extertnalTeam.ExternalId, extertnalTeam);
                            }
                        }
                    }
                }

                if (newTeams.Any())
                {
                    //await _context.BulkInsertAsync(newTeams, new BulkConfig
                    //{
                    //    PropertiesToExclude = new List<string> { nameof(Team.Id) }
                    //});
                    await BulkInsertTeams(newTeams);
                }

                if (updatedTeams.Any())
                {
                    await _context.BulkUpdateAsync(updatedTeams);
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                _logger.LogInformation($"Teams sync successfully.");
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError($"Failed to sync teams data.");
                throw;
            }
        }

        // TO DO: What happens to bets where fixtures/matches are cancelled/abandoned/not played
        // TO DO: Add status to Event model
        [AutomaticRetry(Attempts = MaxRetryAttempts, OnAttemptsExceeded = AttemptsExceededAction.Fail)]
        public async Task SyncFixturesByCountry()
        {
            _logger.LogInformation("Syncing fixtures data...");

            // Fetch existing Events from the database
            var existingEvents = await _context.Event
                                        .Include(x => x.Result)
                                        .Include(x => x.Team1).Include(x => x.Team2)
                                        .ThenInclude(x => x.League)
                                        .OrderBy(c => c.StartDateTime).ToListAsync();
            var existingEventsDict = existingEvents.ToDictionary(x => x.FixtureId, x => x);
            var syncFromDateTime = (existingEvents.FirstOrDefault(x => x.EndDateTime == null)?.StartDateTime 
                                        ?? DateTime.UtcNow).ToString("yyyy-MM-dd");

            var existingleagues = await _context.League/*.Where(x => x.CountryName == "England" || x.CountryName == "World")*/.ToListAsync();
            var currentExistingLeagues = existingleagues.Where(x => x.IsCurrent);
            var existingLeaguesDict = existingleagues.GroupBy(x => x.ExternalId).ToDictionary(x => x.Key, x => x.First());

            var popularLeagueIds = Enum.GetValues(typeof(PopularLeagues)).Cast<int>().ToList();

            var existingTeams = await _context.Team.Where(x => x.ExternalId != 0).ToListAsync();
            var existingTeamsDict = existingTeams.ToDictionary(x => x.ExternalId, x => x);

            var fixtures = await GetFixtures(!existingEvents.Any(), popularLeagueIds, syncFromDateTime);

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var newEvents = new List<Event>();
                var updatedEvents = new List<Event>();

                var updatedTeams = new List<Team>();

                foreach (var fixtureRes in fixtures)
                {
                    var homeTeam = fixtureRes.Teams.Home;
                    var awayTeam = fixtureRes.Teams.Away;
                    var isLeagueExist = existingLeaguesDict.TryGetValue(fixtureRes.League.Id, out var league);

                    // insert new Events
                    if (fixtureRes.Fixture.Status.Long == "Not Started") 
                    {
                        var date = DateTimeOffset.Parse(fixtureRes.Fixture.Date, CultureInfo.InvariantCulture);
                        var utcDate = date.UtcDateTime;

                        // Events that have not yet been added to the database
                        if (!existingEventsDict.TryGetValue(fixtureRes.Fixture.Id, out var existingEvent))
                        {
                            // update home team with the correct league
                            if (existingTeamsDict.TryGetValue(homeTeam.Id, out var existingHomeTeam) && !updatedTeams.Any(x => x.ExternalId == homeTeam.Id))
                            {
                                existingHomeTeam.LeagueId = isLeagueExist ? league.Id : null;
                                updatedTeams.Add(existingHomeTeam);
                            }
                            // update away team with the correct league
                            if (existingTeamsDict.TryGetValue(awayTeam.Id, out var existingAwayTeam) && !updatedTeams.Any(x => x.ExternalId == awayTeam.Id))
                            {
                                existingAwayTeam.LeagueId = isLeagueExist ? league.Id : null;
                                updatedTeams.Add(existingAwayTeam);
                            }

                            if (existingHomeTeam != null && existingAwayTeam != null)
                            {
                                var newEvent = new Event
                                {
                                    FixtureId = fixtureRes.Fixture.Id,
                                    StartDateTime = utcDate,
                                    Team1Id = existingHomeTeam.Id,
                                    Team2Id = existingAwayTeam.Id
                                };
                                newEvents.Add(newEvent);
                            }
                            else
                            {
                                if (existingHomeTeam == null)
                                {
                                    _logger.LogWarning($"Home team not found for fixture {fixtureRes.Fixture.Id} and home team {fixtureRes.Teams.Home.Id}");
                                }
                                else if (existingAwayTeam == null)
                                {
                                    _logger.LogWarning($"Away team not found for fixture {fixtureRes.Fixture.Id} and away team {fixtureRes.Teams.Away.Id}");
                                }
                            }
                        }
                        // events that were postponed to another day
                        else if(existingEventsDict.TryGetValue(fixtureRes.Fixture.Id, out existingEvent) && existingEvent.StartDateTime != utcDate)
                        {
                            existingEvent.StartDateTime = utcDate;
                            updatedEvents.Add(existingEvent);
                        }
                    }
                    // Match Finished
                    else if (fixtureRes.Fixture.Status.Long == "Match Finished" && 
                        existingEventsDict.TryGetValue(fixtureRes.Fixture.Id, out var existingEvent) && existingEvent.Result == null) 
                    {
                        var homeGoals = fixtureRes.Goals.Home;
                        var awayGoals = fixtureRes.Goals.Away;
                        Guid? winningTeamId = null;
                        if (homeTeam.Winner == true) winningTeamId = existingEvent.Team1Id;
                        else if (awayTeam.Winner == true) winningTeamId = existingEvent.Team2Id;

                        // update EndDateTime
                        var elapsedTime = fixtureRes.Fixture.Status.Elapsed ?? 0;
                        var extra = fixtureRes.Fixture.Status.Extra ?? 0;

                        if (homeGoals != null && awayGoals != null)
                        {
                            var newResult = new Result
                            {
                                EventId = existingEvent.Id,
                                WinningTeamId = winningTeamId,
                                Team1Goals = homeGoals,
                                Team2Goals = awayGoals,
                                EventResult = homeTeam.Winner == true ? Database.Enum.EventResult.TEAM1WINS :
                                                awayTeam.Winner == true ? Database.Enum.EventResult.TEAM2WINS :
                                                Database.Enum.EventResult.DRAW
                            };

                            existingEvent.Result = newResult;
                            existingEvent.EndDateTime = existingEvent.StartDateTime.AddMinutes(elapsedTime + extra);
                            updatedEvents.Add(existingEvent);
                        }


                    }
                    else if ((fixtureRes.Fixture.Status.Long == "Match Cancelled" || fixtureRes.Fixture.Status.Long == "Match Abandoned") &&
                        existingEventsDict.TryGetValue(fixtureRes.Fixture.Id, out existingEvent) && existingEvent.Result == null)
                    {
                        var newResult = new Result
                        {
                            EventId = existingEvent.Id,
                            EventResult = Database.Enum.EventResult.CANCELLED
                        };
                        existingEvent.Result = newResult;
                        updatedEvents.Add(existingEvent);
                    }
                    // ENHANCEMENT: matches that are ongoing
                }

                if (updatedTeams.Any())
                {
                    var uniqueUpdatedTeams = updatedTeams.DistinctBy(x => x.Id);
                    await _context.BulkUpdateAsync(uniqueUpdatedTeams);
                }

                if (newEvents.Any())
                {
                    await _context.BulkInsertAsync(newEvents, new BulkConfig
                    {
                        PropertiesToExclude = new List<string> { nameof(Event.Id) }
                    });
                }

                if (updatedEvents.Any())
                {
                    await _context.BulkUpdateAsync(updatedEvents);
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                _logger.LogInformation($"Fixtures/Events synced successfully");

            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError($"Failed to sync fixtures/events: {ex.Message}");
                throw;
            }
        }

        #endregion

        private async Task BulkInsertTeams(List<Team> teams)
        {
            var bulkConfig = new BulkConfig { SetOutputIdentity = true, PreserveInsertOrder = true };
            await _context.BulkInsertAsync(teams, bulkConfig);
        }

        private async Task BulkInsertLeagues(List<League> leagues)
        {
            var bulkConfig = new BulkConfig { IncludeGraph = true, SetOutputIdentity = true, PreserveInsertOrder = true };
            await _context.BulkInsertAsync(leagues, bulkConfig);
        }
    }
}
