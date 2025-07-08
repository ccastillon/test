using ForgetTheBookie.Api.Models.UserBalanceAndTransactions;
using ForgetTheBookie.Api.Models;
using ForgetTheBookie.Database.Enum;
using ForgetTheBookie.Database.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ForgetTheBookie.Api.Models.User;
using ForgetTheBookie.Database.Repository;
using AutoMapper.QueryableExtensions;
using AutoMapper;
using ForgetTheBookie.Api.ActionFilters;

namespace ForgetTheBookie.Api.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUnitOfWork _uow;
        private readonly UserManager<User> _userManager;
        private readonly ILogger<UsersController> _logger;
        private readonly IMapper _mapper;

        public UsersController(IUnitOfWork uow, UserManager<User> userManager, ILogger<UsersController> logger, IMapper mapper)
        {
            _uow = uow;
            _userManager = userManager;
            _logger = logger;
            _mapper = mapper;
        }

        // GET: api/User/GetAllUsers
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<IQueryable<UserModel>> Get()
        {
            _logger.LogInformation("Fetching all Users from the database.");

            var usermodels = _uow.Repo<User>().Get().ProjectTo<UserModel>(_mapper.ConfigurationProvider);

            _logger.LogInformation($"Returning {usermodels.Count()} users.");

            return Ok(usermodels);
        }

        // GET: api/User/GetUserById/{id}
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<UserModel>> GetUserById(Guid id)
        {
            _logger.LogInformation("Fetching User by Id from the database.");

            var user = await _userManager.FindByIdAsync(id.ToString());

            if (user == null)
                return NotFound();

            var model = _mapper.Map<UserModel>(user);

            _logger.LogInformation("Returning user data.");
            return Ok(model);
        }

        // PUT: api/User/EditInfoUser
        [HttpPut]
        [ServiceFilter(typeof(ValidationFilterAttribute))]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<EditUserModel>> Put([FromBody] EditUserModel EdituserModel)
        {
            _logger.LogInformation("Put action called");
            // TODO: check if user is logged in here

            var existingUser = await _userManager.FindByIdAsync(EdituserModel.Id.ToString());

            if (existingUser == null)
                return NotFound();

            existingUser.Email = EdituserModel.Email;
            existingUser.Name = EdituserModel.Name;
            existingUser.UserName = EdituserModel.Username;
            existingUser.DateOfBirth = EdituserModel.DateOfBirth;

            var result = await _userManager.UpdateAsync(existingUser);

            if (result.Succeeded)
            {
                _logger.LogInformation("Put action succeeded");
                return Ok(result);
            }
            else
                return StatusCode(StatusCodes.Status500InternalServerError, result);
        }

        // GET: api/User/GetUserBalanceById/{id}
        [HttpGet("{id}/Balance")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<UserBalanceModel>> GetUserBalanceById(Guid id)
        {
            _logger.LogInformation("Fetching User's Balance.");
            var userBal = await _uow.Repo<UserBalance>().Get().FirstOrDefaultAsync(x => x.UserId == id);

            if (userBal == null)
                return NotFound();

            var transactions = await _uow.Repo<Transaction>().Get(x => x.UserId == id && x.Type == TransactionType.ALLOCATED)
                .Include(x => x.BetOffer).Where(x => x.BetOffer.Status == BetStatus.ACCEPTED || x.BetOffer.Status == BetStatus.PROPOSED).ToListAsync();

            _logger.LogInformation("Returning User's balance");

            return Ok(new UserBalanceModel
            {
                Id = userBal.Id,
                UserId = userBal.UserId,
                Balance = userBal.Balance,
                AllocatedToBets = transactions.Any() ? transactions.Sum(t => t.Amount) : 0,
            });
        }
    }
}
