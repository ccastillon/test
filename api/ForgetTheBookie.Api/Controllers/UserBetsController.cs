using ForgetTheBookie.Database.Model;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ForgetTheBookie.Api.Models.Bet;
using ForgetTheBookie.Database.Repository;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using ForgetTheBookie.Api.ActionFilters;
using ForgetTheBookie.Database.Enum;

namespace ForgetTheBookie.Api.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserBetsController : ControllerBase
    {
        private readonly IUnitOfWork _uow;
        private readonly UserManager<User> _userManager;
        private readonly ILogger<UserBetsController> _logger;
        private readonly IMapper _mapper;

        public UserBetsController(IUnitOfWork uow, UserManager<User> userManager, ILogger<UserBetsController> logger, IMapper mapper)
        {
            _uow = uow;
            _userManager = userManager;
            _logger = logger;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<IQueryable<BetModel>>> Get()
        {
            _logger.LogInformation("Fetching all user's bets from the database.");

            var username = HttpContext.User.Identity?.Name;

            if (username is null)
                return Unauthorized();

            var user = await _userManager.FindByNameAsync(username);

            if (user is null)
                return Unauthorized();

            var userBetOffers = _uow.Repo<BetOffer>().Get(x => x.ProposedByUserId == user.Id || x.AcceptedByUserId == user.Id)
                .Include(x => x.Event.Team1.League).Include(x => x.Event.Team2)
                .ProjectTo<BetModel>(_mapper.ConfigurationProvider);

            _logger.LogInformation($"Returning {userBetOffers.Count()} user's bets");

            return Ok(userBetOffers);
        }

        [HttpPut("AcceptBet")]
        [ServiceFilter(typeof(ValidationFilterAttribute))]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status406NotAcceptable)]
        public async Task<ActionResult<BetModel>> AcceptBet([FromBody] ProposedBetModel model)
        {
            _logger.LogInformation("Updating new bet.");

            var username = HttpContext.User.Identity?.Name;

            if (username is null)
                return Unauthorized();

            var acceptedByUser = await _userManager.FindByNameAsync(username);

            if (acceptedByUser is null)
            {
                return Unauthorized();
            }
            else {
                var userBal = _uow.Repo<UserBalance>().Get(x => x.UserId == acceptedByUser.Id).FirstOrDefault().Balance;

                if (model.Stake > userBal)
                {
                    return StatusCode(406);
                }
                else
                {
                    // Update BetOffer
                    var updateBetOffer = _mapper.Map<BetOffer>(model);

                    updateBetOffer.AcceptedByUserId = acceptedByUser.Id;
                    updateBetOffer.Status = BetStatus.ACCEPTED;

                    // Create BetMatch
                    var newBetMatch = new BetMatch
                    {
                        BetOfferId = model.Id,
                        AcceptedByUserId = acceptedByUser.Id,
                        MatchedAmount = model.Stake,
                        BetMatchResult = BetMatchResult.PENDING
                    };

                    // Update balance
                    var updateUserBal = _uow.Repo<UserBalance>().Get(x => x.UserId == acceptedByUser.Id).FirstOrDefault();
                    if (updateUserBal is null) { return NotFound(); }
                    updateUserBal.Balance = userBal - model.LayerLiability;

                    // Insert the new transaction
                    var newTransaction = new Transaction
                    {
                        TransactionDateTime = DateTime.UtcNow,
                        Type = TransactionType.ALLOCATED,
                        Amount = model.LayerLiability,
                        BetOfferId = model.Id,
                        User = acceptedByUser,
                        BetOffer = updateBetOffer,
                        RunningBalance = updateUserBal.Balance,
                    };

                    _uow.Repo<BetOffer>().Update(updateBetOffer);
                    _uow.Repo<BetMatch>().Insert(newBetMatch);
                    _uow.Repo<UserBalance>().Update(updateUserBal);
                    _uow.Repo<Transaction>().Insert(newTransaction);
                    _uow.Save();

                    var betModel = _mapper.Map<BetModel>(updateBetOffer);

                    _logger.LogInformation("Bet updated successfully.");

                    return Ok("success");
                }
            }
        }

        [HttpGet("Proposed")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<List<ProposedBetModel>>> GetProposedBets()
        {
            _logger.LogInformation("Fetching proposed bets from the database.");

            var username = HttpContext.User.Identity?.Name;

            if (username is null)
                return Unauthorized();

            var user = await _userManager.FindByNameAsync(username);

            if (user is null)
                return Unauthorized();

            var betOffers = await _uow.Repo<BetOffer>().Get(x => x.Status == BetStatus.PROPOSED && x.ProposedByUserId != user.Id)
                .Where(p => p.Event.StartDateTime > DateTime.UtcNow)
                .OrderBy(o => o.Event.StartDateTime)
                .Include(x => x.Event.Team1).Include(x => x.Event.Team2).Include(x => x.ProposedByUser)
                .Take(10)
                .ProjectTo<ProposedBetModel>(_mapper.ConfigurationProvider).ToListAsync();

            var userBal = _uow.Repo<UserBalance>().Get(x => x.UserId == user.Id).FirstOrDefault()?.Balance ?? 0;

            foreach (var bet in betOffers)
            {
                if (bet.Stake > userBal)
                {
                    bet.IsBalSufficient = false;
                }
                else
                {
                    bet.IsBalSufficient = true;
                }

                bet.BackerTeamPick = bet.WinSelection == WinSelection.TEAM1WINS.ToString() ? bet.Team1Name : bet.Team2Name;

                var odds = bet.Odds;
                var isnumerator = decimal.TryParse(odds.Split(':')[0], out decimal numerator);
                var isdenominator = decimal.TryParse(odds.Split(':')[1], out decimal denominator);
                var decimalOdds = isnumerator && isdenominator ? (numerator / denominator) : 0;

                var backerPotentialProfit = bet.Stake * decimalOdds; // layer's liability

                bet.LayerLiability = backerPotentialProfit;
            }

            _logger.LogInformation($"Returning {betOffers.Count()} proposed bets");

            return Ok(betOffers);
        }

        [HttpGet("{id:guid}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Get(Guid id)
        {
            _logger.LogInformation("Fetching user's bet from the database.");

            var existingBetOffers = await _uow.Repo<BetOffer>().Get()
                .Include(x => x.Event.Team1.League).Include(x => x.Event.Team2)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (existingBetOffers == null)
                return NotFound();

            var betModel = _mapper.Map<BetModel>(existingBetOffers);

            _logger.LogInformation("Returning  user's bet data.");

            return Ok(betModel);
        }

        [HttpGet("active")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<IQueryable<BetModel>>> GetActive()
        {
            _logger.LogInformation("Fetching all user's active bets from the database.");

            var username = HttpContext.User.Identity?.Name;

            if (username is null)
                return Unauthorized();

            var user = await _userManager.FindByNameAsync(username);

            if (user is null)
                return Unauthorized();

            var userBetOffers = _uow.Repo<BetOffer>().Get(x => x.ProposedByUserId == user.Id || x.AcceptedByUserId == user.Id)
                .Include(x => x.Event.Team1.League).Include(x => x.Event.Team2).Where(x => x.Event.EndDateTime == null)
                .ProjectTo<BetModel>(_mapper.ConfigurationProvider);

            _logger.LogInformation($"Returning {userBetOffers.Count()} user's active bets");

            return Ok(userBetOffers);
        }

        [HttpGet("all-results/{status?}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<List<BetModel>>> GetCompleteWithdrawn(string? status = null, bool isWon = false)
        {
            _logger.LogInformation("Fetching all user's completed/withdrawn bets from the database.");

            var username = HttpContext.User.Identity?.Name;

            if (username is null)
                return Unauthorized();

            var user = await _userManager.FindByNameAsync(username);

            if (user is null)
                return Unauthorized();

            var userBetOffers = new List<BetModel>();

            if(status == null)
            {
                userBetOffers = await _uow.Repo<BetOffer>().Get(x => x.ProposedByUserId == user.Id || x.AcceptedByUserId == user.Id)
                .Include(x => x.Event.Team1.League).Include(x => x.Event.Team2)
                .Where(x => x.Status == BetStatus.COMPLETE || x.Status == BetStatus.WITHDRAWN)
                .ProjectTo<BetModel>(_mapper.ConfigurationProvider).ToListAsync();
            }
                
            else if(status.ToLower() == BetStatus.COMPLETE.ToString().ToLower())
            {
                userBetOffers = await _uow.Repo<BetOffer>().Get(x => x.ProposedByUserId == user.Id || x.AcceptedByUserId == user.Id)
                .Include(x => x.Event.Team1.League).Include(x => x.Event.Team2)
                .Where(x => x.Status == BetStatus.COMPLETE)
                .ProjectTo<BetModel>(_mapper.ConfigurationProvider).ToListAsync();
            }
            else if(status.ToLower() == BetStatus.WITHDRAWN.ToString().ToLower())
            {
                userBetOffers = await _uow.Repo<BetOffer>().Get(x => x.ProposedByUserId == user.Id || x.AcceptedByUserId == user.Id)
                .Include(x => x.Event.Team1.League).Include(x => x.Event.Team2)
                .Where(x => x.Status == BetStatus.WITHDRAWN)
                .ProjectTo<BetModel>(_mapper.ConfigurationProvider).ToListAsync();
            }

            // TODO: clarify the computation on the Amount and the Result

            userBetOffers.ForEach((bet) =>
            {
                if(bet.Status == BetStatus.COMPLETE.ToString())
                {
                    var result = _uow.Repo<Result>().Get()
                                    .Include(x => x.Event)
                                        .ThenInclude(x => x.Team1)
                                    .Include(x => x.Event)
                                        .ThenInclude(x => x.Team2)
                                    .FirstOrDefault(x => x.EventId == bet.EventId);
                    var profit = ComputeProfit(bet.Odds, bet.Stake);
                    var favoriteTeam = GetFavoriteTeam(bet.Odds, result.Event);

                    if(result != null && result.WinningTeamId == favoriteTeam.Id)
                    {
                        bet.Status = "Won";
                        bet.Winnings = profit + bet.Stake; // win + stake
                        bet.Rake = profit * (decimal)0.10;
                        bet.Amount = bet.Stake + (profit - bet.Rake);
                    }
                    else if(result != null && result.WinningTeamId != favoriteTeam.Id)
                    {
                        bet.Status = "Lost";
                        bet.Amount = bet.Stake * -1;
                    }

                    //if (result != null && result.WinningTeamId != bet.Team1Id)
                    //{
                    //    bet.Status = "Lost";
                    //    bet.Amount = bet.Stake * -1;
                    //}
                    //else if (result != null && result.WinningTeamId == bet.Team1Id) 
                    //{ 
                    //    bet.Status = "Won";
                    //    bet.Winnings = profit;
                    //    bet.Rake = profit * (decimal)0.10;
                    //    bet.Amount = bet.Stake + profit - bet.Rake;
                    //}
                }
                else if(bet.Status == BetStatus.WITHDRAWN.ToString())
                {
                    bet.Amount = bet.Stake;
                }
            });

            if(status != null && status.ToLower() == BetStatus.COMPLETE.ToString().ToLower())
            {
                if (isWon)
                {
                    userBetOffers = userBetOffers.Where(x => x.Amount > 0).ToList();
                }
                else
                {
                    userBetOffers = userBetOffers.Where(x => x.Amount < 0).ToList();
                }
            }

            _logger.LogInformation($"Returning {userBetOffers.Count} user's completed/withdrawn bets");

            return Ok(userBetOffers.OrderBy(x => x.EventStartDateTime));
        }

        private Team? GetFavoriteTeam(string odds, Event existingEvent)
        {
            var isnumerator = decimal.TryParse(odds.Split(':')[0], out decimal numerator);
            var isdenominator = decimal.TryParse(odds.Split(':')[1], out decimal denominator);

            var team1 = existingEvent.Team1;
            var team2 = existingEvent.Team2;

            if(numerator == denominator)
            {
                return null;
            }
            else if(numerator > denominator)
            {
                return team1;
            }
            else if(denominator > numerator)
            {
                return team2;
            }

            return null;
        }

        private decimal ComputeProfit(string odds, decimal stake)
        {
            var isnumerator = decimal.TryParse(odds.Split(':')[0], out decimal numerator);
            var isdenominator = decimal.TryParse(odds.Split(':')[1], out decimal denominator);
            
            //var potentialProfit = isnumerator && isdenominator ? (stake * numerator) / denominator : 0;
            //var totalPayout = potentialProfit;

            var decimalOdds = isnumerator && isdenominator ? (numerator / denominator) + 1 : 0;
            var potentialReturn = stake * decimalOdds;
            var profit = potentialReturn - stake;

            return profit;
        }

        [HttpPost("create-bet")]
        [ServiceFilter(typeof(ValidationFilterAttribute))]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<BetModel>> Post([FromBody] CreateEditBetModel model)
        {
            _logger.LogInformation("Adding a new bet to the database.");

            //var existingUser = await _userManager.FindByIdAsync(model.ProposedByUserId.ToString());
            var existingEvent = await _uow.Repo<Event>().GetByIdAsync(model.EventId);

            var username = HttpContext.User.Identity?.Name;

            if (username is null)
                return Unauthorized();

            var proposedByUser = await _userManager.FindByNameAsync(username);

            if (proposedByUser is null)
                return Unauthorized();

            if (existingEvent == null)
                return NotFound();

            var newBetOffer = _mapper.Map<BetOffer>(model);

            newBetOffer.ProposedByUserId = proposedByUser.Id;
            newBetOffer.BetSide = BetSide.BACK;
            newBetOffer.Status = BetStatus.PROPOSED;

            //New balance
            var userBal = _uow.Repo<UserBalance>().Get(x => x.UserId == proposedByUser.Id).FirstOrDefault();
            if (userBal is null) { return NotFound(); }
            userBal.Balance = userBal.Balance - model.Stake;

            //Insert the new transaction
            var newTransaction = new Transaction
            {
                TransactionDateTime = DateTime.UtcNow,
                Type = TransactionType.ALLOCATED,
                Amount = model.Stake,
                BetOfferId = model.Id,
                User = proposedByUser,
                BetOffer = newBetOffer,
                RunningBalance = userBal.Balance,
            };

            _uow.Repo<BetOffer>().Insert(newBetOffer);
            _uow.Repo<UserBalance>().Update(userBal);
            _uow.Repo<Transaction>().Insert(newTransaction);
            _uow.Save();

            var betModel = _mapper.Map<BetModel>(newBetOffer);
            betModel.UserBalance = userBal.Balance;

            _logger.LogInformation("Added new bet successful.");

            // TODO: create new transaction

            return Ok(betModel);
        }

        [HttpPut("{id:guid}")]
        [ServiceFilter(typeof(ValidationFilterAttribute))]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<BetModel>> Put(Guid id, [FromBody] CreateEditBetModel model)
        {
            _logger.LogInformation("Put action called");

            if (!model.AcceptedByUserId.HasValue)
                return NotFound();

            var existingBetOffer = await _uow.Repo<BetOffer>().Get(x => x.Id == id).FirstOrDefaultAsync();
            var acceptedByUser = await _userManager.FindByIdAsync(model.AcceptedByUserId.Value.ToString());

            if (existingBetOffer == null || acceptedByUser == null)
                return NotFound();

            var updateBetOffer = _mapper.Map<BetOffer>(model);

            _uow.Repo<BetOffer>().Update(updateBetOffer);
            _uow.Save();

            var betModel = _mapper.Map<BetModel>(updateBetOffer);

            _logger.LogInformation("Put action succeeded");

            return Ok(betModel);
        }
    }
}
