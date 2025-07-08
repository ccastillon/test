using AutoMapper;
using AutoMapper.QueryableExtensions;
using ForgetTheBookie.Api.Models.User;
using ForgetTheBookie.Database.Model;
using ForgetTheBookie.Database.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace ForgetTheBookie.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LeagueController : ControllerBase
    {
        private readonly IUnitOfWork _uow;
        private readonly UserManager<User> _userManager;
        private readonly ILogger<LeagueController> _logger;
        private readonly IMapper _mapper;

        public LeagueController(IUnitOfWork uow, UserManager<User> userManager, ILogger<LeagueController> logger, IMapper mapper)
        {
            _uow = uow;
            _userManager = userManager;
            _logger = logger;
            _mapper = mapper;
        }

        // GET: api/League
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<IQueryable<League>> Get()
        {
            _logger.LogInformation("Fetching all Leagues from the database.");

            var leagues = _uow.Repo<League>().Get();

            _logger.LogInformation($"Returning {leagues.Count()} leagues.");

            return Ok(leagues);
        }
    }
}
