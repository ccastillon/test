using AutoMapper;
using AutoMapper.QueryableExtensions;
using ForgetTheBookie.Api.ActionFilters;
using ForgetTheBookie.Api.Models.Event;
using ForgetTheBookie.Database.Model;
using ForgetTheBookie.Database.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ForgetTheBookie.Api.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class EventsController : ControllerBase
    {
        private readonly IUnitOfWork _uow;
        private readonly ILogger<EventsController> _logger;
        private readonly IMapper _mapper;

        public EventsController(IUnitOfWork uow, ILogger<EventsController> logger, IMapper mapper)
        {
            _uow = uow;
            _logger = logger;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<IQueryable<EventModel>> GetAll()
        {
            _logger.LogInformation("Fetching all events from the database.");

            var events = _uow.Repo<Event>().Get()
                .Include(x => x.Team1).Include(x => x.Team2)
                .ProjectTo<EventModel>(_mapper.ConfigurationProvider);

            _logger.LogInformation($"Returning {events.Count()} events.");

            return Ok(events.OrderBy(o => o.StartDateTime));
        }

        [HttpGet("Upcoming-matches")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<IQueryable<EventModel>> GetUpcomingMatches()
        {
            _logger.LogInformation("Fetching all upcoming matches from the database.");

            var matches = _uow.Repo<Event>().Get()
                .Include(x => x.Team1).Include(x => x.Team2).ThenInclude(x => x.League)
                .Where(p => p.StartDateTime > DateTime.UtcNow /*&& countries.Contains(p.Team2.League.CountryName)*/)
                .OrderBy(o => o.StartDateTime).Take(10)
                .ProjectTo<EventModel>(_mapper.ConfigurationProvider);

            _logger.LogInformation($"Returning {matches.Count()} matches.");

            return Ok(matches);
        }

        [HttpGet("{id:Guid}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<EventModel>> GetById(Guid id)
        {
            _logger.LogInformation("Fetching event by Id from the database.");
            var existingEvent = await _uow.Repo<Event>().Get()
                .Include(x => x.Team1).Include(x => x.Team2)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (existingEvent == null)
                return NotFound();

            var model = _mapper.Map<EventModel>(existingEvent);

            _logger.LogInformation("Returning event data.");

            return Ok(model);
        }

        [HttpPost]
        [ServiceFilter(typeof(ValidationFilterAttribute))]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<Event>> Post([FromBody] CreateEditEventModel model)
        {
            _logger.LogInformation("Post action called");
            var existingTeam1 = await _uow.Repo<Team>().GetByIdAsync(model.Team1Id);
            var existingTeam2 = await _uow.Repo<Team>().GetByIdAsync(model.Team2Id);

            if (existingTeam1 == null || existingTeam2 == null)
                return NotFound();

            var newEvent = _mapper.Map<Event>(model);
            newEvent.StartDateTime = DateTime.UtcNow.AddDays(30);

            _uow.Repo<Event>().Insert(newEvent);
            _uow.Save();

            var eventModel = _mapper.Map<EventModel>(newEvent);

            _logger.LogInformation("Post action succeeded");

            return CreatedAtAction(nameof(GetById), new { id = newEvent.Id }, eventModel);
        }
    }
}
