using AutoMapper;
using AutoMapper.QueryableExtensions;
using ForgetTheBookie.Api.ActionFilters;
using ForgetTheBookie.Api.ExtensionMethods;
using ForgetTheBookie.Api.Models.UserBalanceAndTransactions;
using ForgetTheBookie.Database.Enum;
using ForgetTheBookie.Database.Model;
using ForgetTheBookie.Database.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ForgetTheBookie.Api.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserTransactionsController : ControllerBase
    {
        private readonly IUnitOfWork _uow;
        private readonly UserManager<User> _userManager;
        private readonly ILogger<UserTransactionsController> _logger;
        private readonly IMapper _mapper;

        public UserTransactionsController(IUnitOfWork uow, UserManager<User> userManager, ILogger<UserTransactionsController> logger, IMapper mapper)
        {
            _uow = uow;
            _userManager = userManager;
            _logger = logger;
            _mapper = mapper;
        }

        [HttpGet("{userId:guid}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<List<UserTransactionModel>>> Get(Guid userId)
        {
            _logger.LogInformation("Fetching all user's transactions from the database.");

            var existingUser = await _userManager.FindByIdAsync(userId.ToString());
            if (existingUser == null)
                return NotFound();

            var transactions = await _uow.Repo<Transaction>().Get(x => x.UserId == userId).OrderBy(o => o.TransactionDateTime)
                .ProjectTo<UserTransactionModel>(_mapper.ConfigurationProvider).ToListAsync();


            _logger.LogInformation($"Returning {transactions.Count()} user's bets.");

            return Ok(transactions.OrderByDescending(o => o.TransactionDateTime));
        }

        [HttpGet("{userId:guid}/{id:guid}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Get(Guid userId, Guid id)
        {
            _logger.LogInformation("Fetching user's transaction from the database.");
            var existingUser = await _userManager.FindByIdAsync(userId.ToString());
            if (existingUser == null)
                return NotFound();

            var existingTransaction = await _uow.Repo<Transaction>().GetByIdAsync(id);

            if (existingTransaction == null)
                return NotFound();

            var userTransactionModel = _mapper.Map<UserTransactionModel>(existingTransaction);

            _logger.LogInformation("Returning user's transaction data.");

            return Ok(userTransactionModel);
        }

        // POST: api/User/CreateTransaction
        [HttpPost]
        [ServiceFilter(typeof(ValidationFilterAttribute))]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<UserTransactionModel>> Post([FromBody] CreateTransactionModel model)
        {
            _logger.LogInformation("Post action called");

            var existingUser = await _userManager.FindByIdAsync(model.UserId.ToString());

            if (existingUser == null)
                return NotFound();

            var isValidTransaction = Enum.TryParse(model.Type, out TransactionType type);

            if (!isValidTransaction) 
                return BadRequest("Error adding transaction. Transaction type does not exist");

            var newTransaction = _mapper.Map<Transaction>(model);
            newTransaction.TransactionDateTime = DateTime.UtcNow;

            var userBalance = await UpdateUserBalance(model.UserId, model.Type, model.Amount);

            if (userBalance == null) return BadRequest("Error updating user balance");

            _uow.Repo<Transaction>().Insert(newTransaction);
            _uow.Save();

            var userTransactionModel = _mapper.Map<UserTransactionModel>(newTransaction);
            userTransactionModel.RunningBalance = userBalance;

            _logger.LogInformation("Post action succeeded");

            return CreatedAtAction(nameof(Get), new { userId = newTransaction.UserId, id = newTransaction.Id }, userTransactionModel);
        }

        private async Task<decimal?> UpdateUserBalance(Guid userId, string transactionType, decimal amount)
        {
            try
            {
                var existingUserBalance = await _uow.Repo<UserBalance>()
                    .Get(x => x.UserId == userId)
                    .FirstOrDefaultAsync();

                if (existingUserBalance != null)
                {
                    if (transactionType == TransactionType.DEPOSIT.GetDescription() || transactionType == TransactionType.WINNINGS.GetDescription())
                    {
                        existingUserBalance.Balance += amount;
                    }
                    else
                    {
                        existingUserBalance.Balance -= amount;
                    }

                    _uow.Repo<UserBalance>().Update(existingUserBalance);

                    return existingUserBalance.Balance;
                } 
                else if (existingUserBalance == null && transactionType == TransactionType.DEPOSIT.GetDescription())
                {
                    var newUserBalance = new UserBalance
                    {
                        UserId = userId,
                        Balance = amount
                    };

                    _uow.Repo<UserBalance>().Insert(newUserBalance);

                    return newUserBalance.Balance;
                }

                return null;
            }
            catch (Exception ex)
            {
                throw new Exception($"Something went wrong while updating UserBalance: {ex}");
            }
        }
    }
}
