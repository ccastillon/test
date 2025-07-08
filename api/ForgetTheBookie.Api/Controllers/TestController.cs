using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ForgetTheBookie.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        [HttpGet(Name = "")]
        public IActionResult Index()
        {
            return Content("There is nothing to see here.");
        }
    }
}
